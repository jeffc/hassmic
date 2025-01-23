from __future__ import annotations

import asyncio
import logging

from homeassistant.components.assist_pipeline.pipeline import PipelineEvent, PipelineEventType
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_state_change
from homeassistant.components import sensor
from . import base
from . import microphone

_LOGGER = logging.getLogger(__name__)

class PipelineStage:
    """Defines pipeline stages."""
    STT = "stt"
    WAKE_WORD = "wake_word"


class ContinueConversationSwitch(base.SwitchBase):
    """Defines a switch for controlling 'Continue Conversation'."""

    @property
    def hassmic_entity_name(self):
        return "continue_conversation"

    @property
    def icon(self):
        return "mdi:chat"

    def __init__(self, hass: HomeAssistant, config_entry: ConfigEntry, microphone: Microphone) -> None:
        super().__init__(hass, config_entry)
        self._attr_is_on = False
        self.microphone = microphone
        self.config_entry = config_entry
        self._vad_start_detected = asyncio.Event()  # Event to detect VAD_START within the monitoring window.
        asyncio.create_task(self._initialize_simple_state_sensor())

    async def _initialize_simple_state_sensor(self):
        """Wait for the simple_state sensor to become available."""
        max_retries = 30  # 30 seconds, check every second
        initial_entity_id = f"sensor.{self.config_entry.title.replace(' ', '_').replace('.', '_')}_simple_state"
        entity_id = initial_entity_id.replace('_@_', '_')
        for attempt in range(max_retries):
            sensor_state = self.hass.states.get(entity_id)
            if sensor_state:
                async_track_state_change(self.hass, entity_id, self._on_simple_state_status)
                return
            await asyncio.sleep(1)

    def on_pipeline_event(self, event: PipelineEvent):
        """Handle pipeline events to manage the switch state."""

        # If STT_START is detected, start a task to monitor for STT_VAD_START or ERROR.
        if event.type == PipelineEventType.STT_START and self._attr_is_on:
            _LOGGER.debug("Detected STT_START event. Starting monitoring.")
            asyncio.create_task(self._monitor_vad_start())

        # If STT_VAD_START is detected, set the event flag.
        if event.type == PipelineEventType.STT_VAD_START:
            _LOGGER.debug("Detected STT_VAD_START event.")
            self._vad_start_detected.set()

    async def _monitor_vad_start(self):
        """Monitor for STT_VAD_START or ERROR within a specified window."""
        self._vad_start_detected.clear()  # Clear the VAD_START event flag.
        error_detected = asyncio.Event()  # Create a new event for ERROR detection.

        def handle_error_event(event: PipelineEvent):
            """Handle the detection of an ERROR event."""
            if event.type == PipelineEventType.ERROR:
                _LOGGER.debug("Detected ERROR event. Updating pipeline stage to WAKE_WORD immediately.")
                error_detected.set()

        # Listen for ERROR events in parallel with the wait.
        self.hass.bus.async_listen_once("pipeline_event", handle_error_event)

        try:
            # Create tasks for monitoring STT_VAD_START and ERROR.
            vad_task = asyncio.create_task(self._vad_start_detected.wait())
            error_task = asyncio.create_task(error_detected.wait())

            # Wait for either STT_VAD_START or ERROR to occur within the timeout.
            done, pending = await asyncio.wait(
                [vad_task, error_task],
                timeout=9,
                return_when=asyncio.FIRST_COMPLETED,
            )

            # Cancel pending tasks to avoid resource leaks.
            for task in pending:
                task.cancel()

            if error_task in done:
                # If an ERROR event was detected, update to WAKE_WORD and exit.
                self._update_pipeline_stage(PipelineStage.WAKE_WORD)
            elif vad_task in done:
                # If STT_VAD_START was detected, update to STT.
                _LOGGER.debug("STT_VAD_START detected within the timeout. Updating pipeline stage to STT.")
                self._update_pipeline_stage(PipelineStage.STT)
            else:
                # If nothing happened within the timeout, update to WAKE_WORD.
                _LOGGER.debug("No relevant event detected within the timeout. Updating pipeline stage to WAKE_WORD.")
                self._update_pipeline_stage(PipelineStage.WAKE_WORD)
        except asyncio.TimeoutError:
            _LOGGER.debug("Timeout occurred. Updating pipeline stage to WAKE_WORD.")
            self._update_pipeline_stage(PipelineStage.WAKE_WORD)


    def _update_pipeline_stage(self, stage: str):
        """Update the pipeline stage."""
        self.hass.data["pipeline_start_stage"] = stage

    async def async_turn_on(self, **kwargs):
        """Turn on the switch."""
        self._attr_is_on = True
        self._update_pipeline_stage(PipelineStage.STT)
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs):
        """Turn off the switch."""
        self._attr_is_on = False
        self._update_pipeline_stage(PipelineStage.WAKE_WORD)
        self.async_write_ha_state()

    async def async_update(self):
        """Ensure pipeline stage is updated if the switch is off."""
        if not self._attr_is_on:
            self._update_pipeline_stage(PipelineStage.WAKE_WORD)

    async def _on_simple_state_status(self, entity_id: str, old_state: State, new_state: State):
        """Handle sensor state change to control the microphone."""
        if new_state and self._attr_is_on:
            state = new_state.state
            if state == "intent-processing":
                await self.microphone.async_turn_off()
            if state == "tts-finished":
                await self.microphone.async_turn_on()
            elif state == "error-error":
                self._update_pipeline_stage(PipelineStage.WAKE_WORD)