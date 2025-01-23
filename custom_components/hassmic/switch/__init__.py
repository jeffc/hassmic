"""Switch platform for hassmic integration."""

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .microphone import Microphone
from .continue_conversation import ContinueConversationSwitch

_LOGGER = logging.getLogger(__name__)

# All of the sensor types in hassmic
ALL_SWITCH_TYPES = [
    Microphone,
]

async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Initialize hassmic config entry for switches."""

    microphone = Microphone(hass, config_entry)
    continue_conversation = ContinueConversationSwitch(hass, config_entry, microphone)

    async_add_entities([
        microphone,
        continue_conversation,
        *[switch_type(hass, config_entry) for switch_type in ALL_SWITCH_TYPES if switch_type is not Microphone]
    ])

# vim: set ts=4 sw=4:
