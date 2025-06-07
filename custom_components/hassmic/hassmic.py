"""Main class for hassmic."""

import asyncio
import base64
import betterproto
import contextlib
import enum
import json
import logging

from packaging.version import Version

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntry
from homeassistant.helpers.entity import Entity
from homeassistant.helpers import issue_registry as ir

from .connection_manager import ConnectionManager
from .exceptions import BadHassMicClientInfoException, BadMessageException
from .const import DOMAIN

from .proto.hassmic import *

MAX_CHUNK_SIZE = 8192
MAX_JSON_SIZE = 1024

MSG_TIMEOUT_SECS = 0.5

_LOGGER = logging.getLogger(__name__)


class HassMic:
    """Handles interface between the HassMic app and home assistant."""

    @staticmethod
    async def async_validate_connection_params(host: str, port: int) -> str:
        """ "Validate the connection parameters and return the UUID of the host.

        Raise an exception if target is invalid.
        """

        _LOGGER.debug("Trying to validate connection to %s:%d", host, port)
        reader, writer = await asyncio.open_connection(host, port)
        try:
            async with asyncio.timeout(2):
                m = await HassMic.recv_message(reader)
                if (w := betterproto.which_one_of(m, "msg"))[0] == "client_info":
                    if (uuid := w[1].uuid) is not None:
                        return uuid
                raise BadHassMicClientInfoException
        # Finally is executed regardless of result
        finally:
            writer.close()
            await writer.wait_closed()

    @property
    def connection_manager(self):
        return self._connection_manager

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, device: DeviceEntry):
        """Initialize the instance."""

        self._hass = hass
        self._configentry = entry
        self._device = device

        self._host = entry.data.get("hostname")
        self._port = entry.data.get("port")

        # track the entities created alongside this hassmic
        self._entities = []

        self._connection_manager = ConnectionManager(
            host=self._host,
            port=self._port,
            hass=hass,
            config_entry=entry,
            recv_fn=self.handle_incoming_message,
            connection_state_callback=self._handle_connection_state_change,
        )

        self._connection_manager.run()

    def register_entity(self, ent: Entity):
        """Add an entity to the list of entities generated for this hassmic."""
        self._entities.append(ent)

    def _handle_connection_state_change(self, new_state: bool):
        """Handle a state change from the connection manager."""
        _LOGGER.debug("Got connection change to state: %s", repr(new_state))
        for e in self._entities:
            hcsc = getattr(e, "handle_connection_state_change", None)
            if hcsc is not None and callable(hcsc):
                e.handle_connection_state_change(new_state)

    def _handle_client_event(self, event: ClientEvent):
        """Handle a client event from the device."""
        (which, val) = betterproto.which_one_of(event, "event")
        match which:
            case "log":
                logstr = val.log_text
                lg = logging.getLogger(f"{__spec__.parent}.{self._host}")
                match val.severity:
                    case LogSeverity.SEVERITY_DEBUG:
                        lg.debug(logstr)
                    case LogSeverity.SEVERITY_INFO:
                        lg.info(logstr)
                    case LogSeverity.SEVERITY_WARNING:
                        lg.warning(logstr)
                    case LogSeverity.SEVERITY_ERROR:
                        lg.error(logstr)
                    case _:
                        lg.error("[SEVERITY NOT SET]" + logstr)

            case "wyoming_event":
                try:
                    (which, wevent) = betterproto.which_one_of(val, "event")
                    match which:
                        case "ping" | "pong" | "audio-chunk":
                            pass
                        case None:
                            _LOGGER.warning(
                                f"Unmatched Wyoming event; json=`{val.raw_json}`"
                            )
                        case _:
                            _LOGGER.debug(f"Got {which} message")
                except Exception as e:
                    _LOGGER.warning(f"Error logging wyoming event: {e} ({val})")

            case _:
                pass

        for e in self._entities:
            hce = getattr(e, "handle_client_event", None)
            if hce is not None and callable(hce):
                e.handle_client_event(event)

    def _handle_saved_settings(self, ss: SavedSettings):
        """Handle saved settings from the device."""
        for e in self._entities:
            hss = getattr(e, "handle_saved_settings", None)
            if hss is not None and callable(hss):
                e.handle_saved_settings(ss)

    async def stop(self):
        """Shut down instance."""
        await asyncio.gather(self._connection_manager.close())

    async def handle_incoming_message(self, reader) -> ClientInfo:
        """Wrap recv_message and dispatches recieved messages appropriately."""

        m = await HassMic.recv_message(reader)
        if m is None:
            return None

        # match this way because the example given on the betterproto docs
        # always matches the first case given for some reason.
        (which, val) = betterproto.which_one_of(m, "msg")
        match which:
            case "audio_data":
                _LOGGER.warning("Got audio_data, which is no longer supported!")

            case "client_info":
                # Throw an error if the detected app version is too old
                if Version(val.version) < Version("0.9.3"):
                    _LOGGER.error(f"Version {val.version} is too low!")
                    ir.async_create_issue(
                        self._hass,
                        DOMAIN,
                        "too_old",
                        is_fixable=False,
                        severity=ir.IssueSeverity.ERROR,
                        translation_key="too_old",
                        translation_placeholders={
                            "required_version": "0.9.3",
                            "detected_version": val.version,
                        },
                    )
                _LOGGER.debug("Got client info: %s", repr(val))

            case "client_event":
                self._handle_client_event(val)

            case "saved_settings":
                self._handle_saved_settings(val)

            case "ping":
                pass

            case _:
                _LOGGER.warning(
                    "Got an unknown message from " "%s:%d. Ignoring it.",
                    self._host,
                    self._port,
                )

        return m

    @staticmethod
    async def recv_message(reader) -> ClientMessage:
        """Read a message from the stream, or None if the stream is closed."""

        recv = await reader.readline()
        while recv == b"\n":  # skip blank lines if we're expecting JSON
            recv = await reader.readline()

        if recv == b"":
            _LOGGER.debug("Got empty msg (EOF); closing socket")
            return None

        try:
            msg = ClientMessage().parse(base64.b64decode(recv))
        except ValueError as err:
            raise BadMessageException(
                f"Got bad message trying to read proto from client"
            ) from err

        return msg


# vim: set ts=4 sw=4:
