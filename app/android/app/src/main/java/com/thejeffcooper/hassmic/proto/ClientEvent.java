// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: hassmic.proto

package com.thejeffcooper.hassmic.proto;

/**
 *
 *
 * <pre>
 * Tell the server that a client event occurred
 * </pre>
 *
 * Protobuf type {@code hassmic.ClientEvent}
 */
public final class ClientEvent
    extends com.google.protobuf.GeneratedMessageLite<ClientEvent, ClientEvent.Builder>
    implements
    // @@protoc_insertion_point(message_implements:hassmic.ClientEvent)
    ClientEventOrBuilder {
  private ClientEvent() {}

  private int eventCase_ = 0;
  private java.lang.Object event_;

  public enum EventCase {
    MEDIA_PLAYER_STATE_CHANGE(1),
    MEDIA_PLAYER_VOLUME_CHANGE(2),
    DEVICE_VOLUME_CHANGE(3),
    LOG(4),
    EVENT_NOT_SET(0);
    private final int value;

    private EventCase(int value) {
      this.value = value;
    }

    /**
     * @deprecated Use {@link #forNumber(int)} instead.
     */
    @java.lang.Deprecated
    public static EventCase valueOf(int value) {
      return forNumber(value);
    }

    public static EventCase forNumber(int value) {
      switch (value) {
        case 1:
          return MEDIA_PLAYER_STATE_CHANGE;
        case 2:
          return MEDIA_PLAYER_VOLUME_CHANGE;
        case 3:
          return DEVICE_VOLUME_CHANGE;
        case 4:
          return LOG;
        case 0:
          return EVENT_NOT_SET;
        default:
          return null;
      }
    }

    public int getNumber() {
      return this.value;
    }
  };

  @java.lang.Override
  public EventCase getEventCase() {
    return EventCase.forNumber(eventCase_);
  }

  private void clearEvent() {
    eventCase_ = 0;
    event_ = null;
  }

  public static final int MEDIA_PLAYER_STATE_CHANGE_FIELD_NUMBER = 1;

  /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
  @java.lang.Override
  public boolean hasMediaPlayerStateChange() {
    return eventCase_ == 1;
  }

  /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.MediaPlayerStateChange getMediaPlayerStateChange() {
    if (eventCase_ == 1) {
      return (com.thejeffcooper.hassmic.proto.MediaPlayerStateChange) event_;
    }
    return com.thejeffcooper.hassmic.proto.MediaPlayerStateChange.getDefaultInstance();
  }

  /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
  private void setMediaPlayerStateChange(
      com.thejeffcooper.hassmic.proto.MediaPlayerStateChange value) {
    value.getClass();
    event_ = value;
    eventCase_ = 1;
  }

  /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
  private void mergeMediaPlayerStateChange(
      com.thejeffcooper.hassmic.proto.MediaPlayerStateChange value) {
    value.getClass();
    if (eventCase_ == 1
        && event_ != com.thejeffcooper.hassmic.proto.MediaPlayerStateChange.getDefaultInstance()) {
      event_ =
          com.thejeffcooper.hassmic.proto.MediaPlayerStateChange.newBuilder(
                  (com.thejeffcooper.hassmic.proto.MediaPlayerStateChange) event_)
              .mergeFrom(value)
              .buildPartial();
    } else {
      event_ = value;
    }
    eventCase_ = 1;
  }

  /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
  private void clearMediaPlayerStateChange() {
    if (eventCase_ == 1) {
      eventCase_ = 0;
      event_ = null;
    }
  }

  public static final int MEDIA_PLAYER_VOLUME_CHANGE_FIELD_NUMBER = 2;

  /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
  @java.lang.Override
  public boolean hasMediaPlayerVolumeChange() {
    return eventCase_ == 2;
  }

  /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.MediaPlayerVolume getMediaPlayerVolumeChange() {
    if (eventCase_ == 2) {
      return (com.thejeffcooper.hassmic.proto.MediaPlayerVolume) event_;
    }
    return com.thejeffcooper.hassmic.proto.MediaPlayerVolume.getDefaultInstance();
  }

  /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
  private void setMediaPlayerVolumeChange(com.thejeffcooper.hassmic.proto.MediaPlayerVolume value) {
    value.getClass();
    event_ = value;
    eventCase_ = 2;
  }

  /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
  private void mergeMediaPlayerVolumeChange(
      com.thejeffcooper.hassmic.proto.MediaPlayerVolume value) {
    value.getClass();
    if (eventCase_ == 2
        && event_ != com.thejeffcooper.hassmic.proto.MediaPlayerVolume.getDefaultInstance()) {
      event_ =
          com.thejeffcooper.hassmic.proto.MediaPlayerVolume.newBuilder(
                  (com.thejeffcooper.hassmic.proto.MediaPlayerVolume) event_)
              .mergeFrom(value)
              .buildPartial();
    } else {
      event_ = value;
    }
    eventCase_ = 2;
  }

  /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
  private void clearMediaPlayerVolumeChange() {
    if (eventCase_ == 2) {
      eventCase_ = 0;
      event_ = null;
    }
  }

  public static final int DEVICE_VOLUME_CHANGE_FIELD_NUMBER = 3;

  /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
  @java.lang.Override
  public boolean hasDeviceVolumeChange() {
    return eventCase_ == 3;
  }

  /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.DeviceVolume getDeviceVolumeChange() {
    if (eventCase_ == 3) {
      return (com.thejeffcooper.hassmic.proto.DeviceVolume) event_;
    }
    return com.thejeffcooper.hassmic.proto.DeviceVolume.getDefaultInstance();
  }

  /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
  private void setDeviceVolumeChange(com.thejeffcooper.hassmic.proto.DeviceVolume value) {
    value.getClass();
    event_ = value;
    eventCase_ = 3;
  }

  /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
  private void mergeDeviceVolumeChange(com.thejeffcooper.hassmic.proto.DeviceVolume value) {
    value.getClass();
    if (eventCase_ == 3
        && event_ != com.thejeffcooper.hassmic.proto.DeviceVolume.getDefaultInstance()) {
      event_ =
          com.thejeffcooper.hassmic.proto.DeviceVolume.newBuilder(
                  (com.thejeffcooper.hassmic.proto.DeviceVolume) event_)
              .mergeFrom(value)
              .buildPartial();
    } else {
      event_ = value;
    }
    eventCase_ = 3;
  }

  /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
  private void clearDeviceVolumeChange() {
    if (eventCase_ == 3) {
      eventCase_ = 0;
      event_ = null;
    }
  }

  public static final int LOG_FIELD_NUMBER = 4;

  /** <code>.hassmic.Log log = 4;</code> */
  @java.lang.Override
  public boolean hasLog() {
    return eventCase_ == 4;
  }

  /** <code>.hassmic.Log log = 4;</code> */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.Log getLog() {
    if (eventCase_ == 4) {
      return (com.thejeffcooper.hassmic.proto.Log) event_;
    }
    return com.thejeffcooper.hassmic.proto.Log.getDefaultInstance();
  }

  /** <code>.hassmic.Log log = 4;</code> */
  private void setLog(com.thejeffcooper.hassmic.proto.Log value) {
    value.getClass();
    event_ = value;
    eventCase_ = 4;
  }

  /** <code>.hassmic.Log log = 4;</code> */
  private void mergeLog(com.thejeffcooper.hassmic.proto.Log value) {
    value.getClass();
    if (eventCase_ == 4 && event_ != com.thejeffcooper.hassmic.proto.Log.getDefaultInstance()) {
      event_ =
          com.thejeffcooper.hassmic.proto.Log.newBuilder(
                  (com.thejeffcooper.hassmic.proto.Log) event_)
              .mergeFrom(value)
              .buildPartial();
    } else {
      event_ = value;
    }
    eventCase_ = 4;
  }

  /** <code>.hassmic.Log log = 4;</code> */
  private void clearLog() {
    if (eventCase_ == 4) {
      eventCase_ = 0;
      event_ = null;
    }
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static Builder newBuilder() {
    return (Builder) DEFAULT_INSTANCE.createBuilder();
  }

  public static Builder newBuilder(com.thejeffcooper.hassmic.proto.ClientEvent prototype) {
    return (Builder) DEFAULT_INSTANCE.createBuilder(prototype);
  }

  /**
   *
   *
   * <pre>
   * Tell the server that a client event occurred
   * </pre>
   *
   * Protobuf type {@code hassmic.ClientEvent}
   */
  public static final class Builder
      extends com.google.protobuf.GeneratedMessageLite.Builder<
          com.thejeffcooper.hassmic.proto.ClientEvent, Builder>
      implements
      // @@protoc_insertion_point(builder_implements:hassmic.ClientEvent)
      com.thejeffcooper.hassmic.proto.ClientEventOrBuilder {
    // Construct using com.thejeffcooper.hassmic.proto.ClientEvent.newBuilder()
    private Builder() {
      super(DEFAULT_INSTANCE);
    }

    @java.lang.Override
    public EventCase getEventCase() {
      return instance.getEventCase();
    }

    public Builder clearEvent() {
      copyOnWrite();
      instance.clearEvent();
      return this;
    }

    /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
    @java.lang.Override
    public boolean hasMediaPlayerStateChange() {
      return instance.hasMediaPlayerStateChange();
    }

    /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.MediaPlayerStateChange getMediaPlayerStateChange() {
      return instance.getMediaPlayerStateChange();
    }

    /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
    public Builder setMediaPlayerStateChange(
        com.thejeffcooper.hassmic.proto.MediaPlayerStateChange value) {
      copyOnWrite();
      instance.setMediaPlayerStateChange(value);
      return this;
    }

    /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
    public Builder setMediaPlayerStateChange(
        com.thejeffcooper.hassmic.proto.MediaPlayerStateChange.Builder builderForValue) {
      copyOnWrite();
      instance.setMediaPlayerStateChange(builderForValue.build());
      return this;
    }

    /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
    public Builder mergeMediaPlayerStateChange(
        com.thejeffcooper.hassmic.proto.MediaPlayerStateChange value) {
      copyOnWrite();
      instance.mergeMediaPlayerStateChange(value);
      return this;
    }

    /** <code>.hassmic.MediaPlayerStateChange media_player_state_change = 1;</code> */
    public Builder clearMediaPlayerStateChange() {
      copyOnWrite();
      instance.clearMediaPlayerStateChange();
      return this;
    }

    /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
    @java.lang.Override
    public boolean hasMediaPlayerVolumeChange() {
      return instance.hasMediaPlayerVolumeChange();
    }

    /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.MediaPlayerVolume getMediaPlayerVolumeChange() {
      return instance.getMediaPlayerVolumeChange();
    }

    /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
    public Builder setMediaPlayerVolumeChange(
        com.thejeffcooper.hassmic.proto.MediaPlayerVolume value) {
      copyOnWrite();
      instance.setMediaPlayerVolumeChange(value);
      return this;
    }

    /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
    public Builder setMediaPlayerVolumeChange(
        com.thejeffcooper.hassmic.proto.MediaPlayerVolume.Builder builderForValue) {
      copyOnWrite();
      instance.setMediaPlayerVolumeChange(builderForValue.build());
      return this;
    }

    /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
    public Builder mergeMediaPlayerVolumeChange(
        com.thejeffcooper.hassmic.proto.MediaPlayerVolume value) {
      copyOnWrite();
      instance.mergeMediaPlayerVolumeChange(value);
      return this;
    }

    /** <code>.hassmic.MediaPlayerVolume media_player_volume_change = 2;</code> */
    public Builder clearMediaPlayerVolumeChange() {
      copyOnWrite();
      instance.clearMediaPlayerVolumeChange();
      return this;
    }

    /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
    @java.lang.Override
    public boolean hasDeviceVolumeChange() {
      return instance.hasDeviceVolumeChange();
    }

    /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.DeviceVolume getDeviceVolumeChange() {
      return instance.getDeviceVolumeChange();
    }

    /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
    public Builder setDeviceVolumeChange(com.thejeffcooper.hassmic.proto.DeviceVolume value) {
      copyOnWrite();
      instance.setDeviceVolumeChange(value);
      return this;
    }

    /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
    public Builder setDeviceVolumeChange(
        com.thejeffcooper.hassmic.proto.DeviceVolume.Builder builderForValue) {
      copyOnWrite();
      instance.setDeviceVolumeChange(builderForValue.build());
      return this;
    }

    /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
    public Builder mergeDeviceVolumeChange(com.thejeffcooper.hassmic.proto.DeviceVolume value) {
      copyOnWrite();
      instance.mergeDeviceVolumeChange(value);
      return this;
    }

    /** <code>.hassmic.DeviceVolume device_volume_change = 3;</code> */
    public Builder clearDeviceVolumeChange() {
      copyOnWrite();
      instance.clearDeviceVolumeChange();
      return this;
    }

    /** <code>.hassmic.Log log = 4;</code> */
    @java.lang.Override
    public boolean hasLog() {
      return instance.hasLog();
    }

    /** <code>.hassmic.Log log = 4;</code> */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.Log getLog() {
      return instance.getLog();
    }

    /** <code>.hassmic.Log log = 4;</code> */
    public Builder setLog(com.thejeffcooper.hassmic.proto.Log value) {
      copyOnWrite();
      instance.setLog(value);
      return this;
    }

    /** <code>.hassmic.Log log = 4;</code> */
    public Builder setLog(com.thejeffcooper.hassmic.proto.Log.Builder builderForValue) {
      copyOnWrite();
      instance.setLog(builderForValue.build());
      return this;
    }

    /** <code>.hassmic.Log log = 4;</code> */
    public Builder mergeLog(com.thejeffcooper.hassmic.proto.Log value) {
      copyOnWrite();
      instance.mergeLog(value);
      return this;
    }

    /** <code>.hassmic.Log log = 4;</code> */
    public Builder clearLog() {
      copyOnWrite();
      instance.clearLog();
      return this;
    }

    // @@protoc_insertion_point(builder_scope:hassmic.ClientEvent)
  }

  @java.lang.Override
  @java.lang.SuppressWarnings({"unchecked", "fallthrough"})
  protected final java.lang.Object dynamicMethod(
      com.google.protobuf.GeneratedMessageLite.MethodToInvoke method,
      java.lang.Object arg0,
      java.lang.Object arg1) {
    switch (method) {
      case NEW_MUTABLE_INSTANCE:
        {
          return new com.thejeffcooper.hassmic.proto.ClientEvent();
        }
      case NEW_BUILDER:
        {
          return new Builder();
        }
      case BUILD_MESSAGE_INFO:
        {
          java.lang.Object[] objects =
              new java.lang.Object[] {
                "event_",
                "eventCase_",
                com.thejeffcooper.hassmic.proto.MediaPlayerStateChange.class,
                com.thejeffcooper.hassmic.proto.MediaPlayerVolume.class,
                com.thejeffcooper.hassmic.proto.DeviceVolume.class,
                com.thejeffcooper.hassmic.proto.Log.class,
              };
          java.lang.String info =
              "\u0000\u0004\u0001\u0000\u0001\u0004\u0004\u0000\u0000\u0000\u0001<\u0000\u0002<"
                  + "\u0000\u0003<\u0000\u0004<\u0000";
          return newMessageInfo(DEFAULT_INSTANCE, info, objects);
        }
        // fall through
      case GET_DEFAULT_INSTANCE:
        {
          return DEFAULT_INSTANCE;
        }
      case GET_PARSER:
        {
          com.google.protobuf.Parser<com.thejeffcooper.hassmic.proto.ClientEvent> parser = PARSER;
          if (parser == null) {
            synchronized (com.thejeffcooper.hassmic.proto.ClientEvent.class) {
              parser = PARSER;
              if (parser == null) {
                parser =
                    new DefaultInstanceBasedParser<com.thejeffcooper.hassmic.proto.ClientEvent>(
                        DEFAULT_INSTANCE);
                PARSER = parser;
              }
            }
          }
          return parser;
        }
      case GET_MEMOIZED_IS_INITIALIZED:
        {
          return (byte) 1;
        }
      case SET_MEMOIZED_IS_INITIALIZED:
        {
          return null;
        }
    }
    throw new UnsupportedOperationException();
  }

  // @@protoc_insertion_point(class_scope:hassmic.ClientEvent)
  private static final com.thejeffcooper.hassmic.proto.ClientEvent DEFAULT_INSTANCE;

  static {
    ClientEvent defaultInstance = new ClientEvent();
    // New instances are implicitly immutable so no need to make
    // immutable.
    DEFAULT_INSTANCE = defaultInstance;
    com.google.protobuf.GeneratedMessageLite.registerDefaultInstance(
        ClientEvent.class, defaultInstance);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEvent getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static volatile com.google.protobuf.Parser<ClientEvent> PARSER;

  public static com.google.protobuf.Parser<ClientEvent> parser() {
    return DEFAULT_INSTANCE.getParserForType();
  }
}
