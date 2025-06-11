"""Defines the control for the microphone gain."""

from __future__ import annotations

import logging

import betterproto

from homeassistant.components.number import ENTITY_ID_FORMAT, NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .. import util
from ..proto import hassmic as proto

_LOGGER = logging.getLogger(__name__)


class MicrophoneGain(NumberEntity):
    """Represents a hassmic microphone gain slider."""

    def __init__(self, hass: HomeAssistant, config_entry: ConfigEntry) -> None:
        """Initialize."""
        super().__init__()
        self.hassmic_entity_name = "microphone_gain"
        util.InitializeEntity(self, ENTITY_ID_FORMAT, hass, config_entry)

        self._hass = hass
        self._config_entry = config_entry
        self._hassmic = config_entry.runtime_data

        self._attr_state = None
        self._attr_mode = NumberMode.SLIDER
        self._attr_native_min_value = 1
        self._attr_native_max_value = 11
        self._attr_native_step = 0.5

    async def async_set_native_value(self, value: float) -> None:
        """Set the microphone gain level."""
        if value is None:
            _LOGGER.debug("Requested gain is None")
            return
        if not (value >= 1 and value <= 11):
            _LOGGER.error("%f is not between 1 and 11", value)

        self.send_gain(value)

    def handle_client_event(self, event: proto.ClientEvent):
        """Handle a client event."""
        (which, val) = betterproto.which_one_of(event, "event")
        _LOGGER.debug("Handling client event: %s", which)
        match which:
            case "set_mic_gain":
                if val:
                    self._attr_native_value = val.mic_gain
            case _:
                pass  # ignore cases not listed here

        self.schedule_update_ha_state()

    def handle_saved_settings(self, ss: proto.SavedSettings):
        """Handle saved settings from the client."""
        if ss.mic_gain is not None:
            if self._attr_native_value is None:
                _LOGGER.debug(
                    "Setting microphone gain to %f due to saved settings",
                    ss.mic_gain,
                )
                self._attr_native_value = ss.mic_gain
                self.schedule_update_ha_state()
            else:
                _LOGGER.warning(
                    "Got saved settings from client, but microphone gain is already set!"
                )
        else:
            _LOGGER.warning(
                "Got saved settings from client, but microphone gain is specified!"
            )

    def handle_connection_state_change(self, new_state: bool):
        """If the remote device just reconnected, remind it what settings it should have."""
        _LOGGER.debug("Connection state change")
        if new_state and self._attr_native_value is not None:
            self.send_gain(self._attr_native_value)

        self.available = new_state
        self.schedule_update_ha_state()

    def send_gain(self, value: float):
        """Send the microphone gain setting to the remote."""
        _LOGGER.info("Sending microphone gain setting: %s", value)
        self._hassmic.connection_manager.send_enqueue(
            proto.HassmicCommand(set_mic_gain=value, internal=False)
        )


# vim: set ts=4 sw=4:
