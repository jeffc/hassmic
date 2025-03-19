"""Defines the `stt` sensor"""

from __future__ import annotations

import logging
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import base
from ..proto.hassmic import *

_LOGGER = logging.getLogger(__name__)


class STT(base.SensorBase):
    """Defines a sensor with the STT state."""

    @property
    def hassmic_entity_name(self):
        return "stt"

    @property
    def icon(self):
        return "mdi:ear-hearing"

    def __init__(self, hass: HomeAssistant, config_entry: ConfigEntry) -> None:
        super().__init__(hass, config_entry)

    def handle_client_event(self, event: ClientEvent):
        (which, val) = betterproto.which_one_of(event, "event")
        if which == "wyoming_event":
            try:
                (which, wevent) = betterproto.which_one_of(val, "event")
                match which:
                    case "transcript":
                        txt = wevent.text
                        _LOGGER.warning(f"Setting STT state to {txt}")
                        self.native_value = (
                            txt if len(txt) <= 255 else (txt[:252] + "...").strip()
                        )
                        self.extra_state_attributes = {
                            "speech": txt,
                        }

            except Exception as e:
                _LOGGER.warning(f"Error processing wyoming event: {e}")

        self.schedule_update_ha_state()


# vim: set ts=4 sw=4:
