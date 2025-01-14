"""Provides the switch for controlling continue conversation."""

from __future__ import annotations

import logging

from homeassistant.components.switch import (
    ENTITY_ID_FORMAT,
    SwitchDeviceClass,
    SwitchEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .. import util
from homeassistant.components.assist_pipeline.pipeline import PipelineStage

_LOGGER = logging.getLogger(__name__)


class ContinueConversationSwitch(SwitchEntity):
    """Switch to control the continue conversation feature."""

    _attr_is_on = False
    _attr_should_poll = False
    _attr_device_class = SwitchDeviceClass.SWITCH
    _attr_name = "Continue Conversation"  # Set the name directly here

    def __init__(self, hass: HomeAssistant, config_entry: ConfigEntry) -> None:
        """Initialize the Continue Conversation switch."""
        super().__init__()
        self.hass = hass
        util.InitializeEntity(self, ENTITY_ID_FORMAT, hass, config_entry)

        # Ensure the initial pipeline stage matches the default state of the switch
        self._update_pipeline_stage()

    @property
    def icon(self) -> str:
        """Return the icon of the switch."""
        return "mdi:toggle-switch"

    @property
    def hassmic_entity_name(self) -> str:
        """Return the entity name for the switch."""
        return "continue_conversation"

    def turn_on(self, **kwargs) -> None:
        """Turn the switch on."""
        self._attr_is_on = True
        self._update_pipeline_stage()
        self.schedule_update_ha_state()

    def turn_off(self, **kwargs) -> None:
        """Turn the switch off."""
        self._attr_is_on = False
        self._update_pipeline_stage()
        self.schedule_update_ha_state()

    def _update_pipeline_stage(self) -> None:
        """Update the start stage of the pipeline based on switch state."""
        if self._attr_is_on:
            _LOGGER.debug("Setting pipeline start stage to STT.")
            self.hass.data["pipeline_start_stage"] = PipelineStage.STT
        else:
            _LOGGER.debug("Setting pipeline start stage to WAKE_WORD.")
            self.hass.data["pipeline_start_stage"] = PipelineStage.WAKE_WORD

