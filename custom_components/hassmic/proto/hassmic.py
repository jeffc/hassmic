# Generated by the protocol buffer compiler.  DO NOT EDIT!
# sources: hassmic.proto
# plugin: python-betterproto
from dataclasses import dataclass

import betterproto


class MediaPlayerState(betterproto.Enum):
    """
    https://developer.android.com/reference/androidx/media3/common/Player.State
    """

    STATE_UNKNOWN = 0
    STATE_IDLE = 1
    STATE_BUFFERING = 2
    STATE_READY = 3
    STATE_ENDED = 4


class MediaPlayerId(betterproto.Enum):
    """The different media players available"""

    ID_UNKNOWN = 0
    # The normal music/audio playback player
    ID_PLAYBACK = 1
    # The announce player
    ID_ANNOUNCE = 2


@dataclass
class ClientInfo(betterproto.Message):
    """Information that the client sends about itself"""

    # The version, for example "0.9.2"
    version: str = betterproto.string_field(1)
    uuid: str = betterproto.string_field(2)


@dataclass
class Ping(betterproto.Message):
    """A ping message"""

    pass


@dataclass
class AudioData(betterproto.Message):
    data: bytes = betterproto.bytes_field(1)


@dataclass
class ClientEvent(betterproto.Message):
    """Tell the server that a client event occurred"""

    media_player_state_change: "ClientEventMediaPlayerStateChange" = (
        betterproto.message_field(1, group="event")
    )
    media_player_volume_change: "ClientEventMediaPlayerVolumeChange" = (
        betterproto.message_field(2, group="event")
    )
    device_volume_change: "ClientEventDeviceVolumeChange" = betterproto.message_field(
        3, group="event"
    )


@dataclass
class ClientEventMediaPlayerStateChange(betterproto.Message):
    """A media player has changed state"""

    player: "MediaPlayerId" = betterproto.enum_field(1)
    new_state: "MediaPlayerState" = betterproto.enum_field(2)


@dataclass
class ClientEventMediaPlayerVolumeChange(betterproto.Message):
    """A media player has changed volume"""

    player: "MediaPlayerId" = betterproto.enum_field(1)
    new_volume: float = betterproto.float_field(2)


@dataclass
class ClientEventDeviceVolumeChange(betterproto.Message):
    """The device volume has changed"""

    new_volume: float = betterproto.float_field(1)


@dataclass
class ClientMessage(betterproto.Message):
    """The wrapper message that actually gets sent to the server"""

    ping: "Ping" = betterproto.message_field(1, group="msg")
    client_info: "ClientInfo" = betterproto.message_field(2, group="msg")
    audio_data: "AudioData" = betterproto.message_field(3, group="msg")
    client_event: "ClientEvent" = betterproto.message_field(4, group="msg")


@dataclass
class PlayAudio(betterproto.Message):
    """Play an audio file"""

    # Whether this should be an announcement or not
    announce: bool = betterproto.bool_field(1)
    # The url to play
    url: str = betterproto.string_field(2)


@dataclass
class ServerMessage(betterproto.Message):
    """The wrapper message that gets sent from the server to the client"""

    play_audio: "PlayAudio" = betterproto.message_field(1, group="msg")
