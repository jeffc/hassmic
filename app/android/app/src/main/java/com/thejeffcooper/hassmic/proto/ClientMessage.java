// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: hassmic.proto

package com.thejeffcooper.hassmic.proto;

/**
 *
 *
 * <pre>
 * The wrapper message that actually gets sent to the server
 * </pre>
 *
 * Protobuf type {@code hassmic.ClientMessage}
 */
public final class ClientMessage
    extends com.google.protobuf.GeneratedMessageLite<ClientMessage, ClientMessage.Builder>
    implements
    // @@protoc_insertion_point(message_implements:hassmic.ClientMessage)
    ClientMessageOrBuilder {
  private ClientMessage() {}

  private int msgCase_ = 0;
  private java.lang.Object msg_;

  public enum MsgCase {
    PING(1),
    CLIENT_INFO(2),
    AUDIO_DATA(3),
    EVENT_OCCURRED(4),
    MSG_NOT_SET(0);
    private final int value;

    private MsgCase(int value) {
      this.value = value;
    }

    /**
     * @deprecated Use {@link #forNumber(int)} instead.
     */
    @java.lang.Deprecated
    public static MsgCase valueOf(int value) {
      return forNumber(value);
    }

    public static MsgCase forNumber(int value) {
      switch (value) {
        case 1:
          return PING;
        case 2:
          return CLIENT_INFO;
        case 3:
          return AUDIO_DATA;
        case 4:
          return EVENT_OCCURRED;
        case 0:
          return MSG_NOT_SET;
        default:
          return null;
      }
    }

    public int getNumber() {
      return this.value;
    }
  };

  @java.lang.Override
  public MsgCase getMsgCase() {
    return MsgCase.forNumber(msgCase_);
  }

  private void clearMsg() {
    msgCase_ = 0;
    msg_ = null;
  }

  public static final int PING_FIELD_NUMBER = 1;

  /** <code>.hassmic.Ping ping = 1;</code> */
  @java.lang.Override
  public boolean hasPing() {
    return msgCase_ == 1;
  }

  /** <code>.hassmic.Ping ping = 1;</code> */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.Ping getPing() {
    if (msgCase_ == 1) {
      return (com.thejeffcooper.hassmic.proto.Ping) msg_;
    }
    return com.thejeffcooper.hassmic.proto.Ping.getDefaultInstance();
  }

  /** <code>.hassmic.Ping ping = 1;</code> */
  private void setPing(com.thejeffcooper.hassmic.proto.Ping value) {
    value.getClass();
    msg_ = value;
    msgCase_ = 1;
  }

  /** <code>.hassmic.Ping ping = 1;</code> */
  private void mergePing(com.thejeffcooper.hassmic.proto.Ping value) {
    value.getClass();
    if (msgCase_ == 1 && msg_ != com.thejeffcooper.hassmic.proto.Ping.getDefaultInstance()) {
      msg_ =
          com.thejeffcooper.hassmic.proto.Ping.newBuilder(
                  (com.thejeffcooper.hassmic.proto.Ping) msg_)
              .mergeFrom(value)
              .buildPartial();
    } else {
      msg_ = value;
    }
    msgCase_ = 1;
  }

  /** <code>.hassmic.Ping ping = 1;</code> */
  private void clearPing() {
    if (msgCase_ == 1) {
      msgCase_ = 0;
      msg_ = null;
    }
  }

  public static final int CLIENT_INFO_FIELD_NUMBER = 2;

  /** <code>.hassmic.ClientInfo client_info = 2;</code> */
  @java.lang.Override
  public boolean hasClientInfo() {
    return msgCase_ == 2;
  }

  /** <code>.hassmic.ClientInfo client_info = 2;</code> */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.ClientInfo getClientInfo() {
    if (msgCase_ == 2) {
      return (com.thejeffcooper.hassmic.proto.ClientInfo) msg_;
    }
    return com.thejeffcooper.hassmic.proto.ClientInfo.getDefaultInstance();
  }

  /** <code>.hassmic.ClientInfo client_info = 2;</code> */
  private void setClientInfo(com.thejeffcooper.hassmic.proto.ClientInfo value) {
    value.getClass();
    msg_ = value;
    msgCase_ = 2;
  }

  /** <code>.hassmic.ClientInfo client_info = 2;</code> */
  private void mergeClientInfo(com.thejeffcooper.hassmic.proto.ClientInfo value) {
    value.getClass();
    if (msgCase_ == 2 && msg_ != com.thejeffcooper.hassmic.proto.ClientInfo.getDefaultInstance()) {
      msg_ =
          com.thejeffcooper.hassmic.proto.ClientInfo.newBuilder(
                  (com.thejeffcooper.hassmic.proto.ClientInfo) msg_)
              .mergeFrom(value)
              .buildPartial();
    } else {
      msg_ = value;
    }
    msgCase_ = 2;
  }

  /** <code>.hassmic.ClientInfo client_info = 2;</code> */
  private void clearClientInfo() {
    if (msgCase_ == 2) {
      msgCase_ = 0;
      msg_ = null;
    }
  }

  public static final int AUDIO_DATA_FIELD_NUMBER = 3;

  /** <code>.hassmic.AudioData audio_data = 3;</code> */
  @java.lang.Override
  public boolean hasAudioData() {
    return msgCase_ == 3;
  }

  /** <code>.hassmic.AudioData audio_data = 3;</code> */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.AudioData getAudioData() {
    if (msgCase_ == 3) {
      return (com.thejeffcooper.hassmic.proto.AudioData) msg_;
    }
    return com.thejeffcooper.hassmic.proto.AudioData.getDefaultInstance();
  }

  /** <code>.hassmic.AudioData audio_data = 3;</code> */
  private void setAudioData(com.thejeffcooper.hassmic.proto.AudioData value) {
    value.getClass();
    msg_ = value;
    msgCase_ = 3;
  }

  /** <code>.hassmic.AudioData audio_data = 3;</code> */
  private void mergeAudioData(com.thejeffcooper.hassmic.proto.AudioData value) {
    value.getClass();
    if (msgCase_ == 3 && msg_ != com.thejeffcooper.hassmic.proto.AudioData.getDefaultInstance()) {
      msg_ =
          com.thejeffcooper.hassmic.proto.AudioData.newBuilder(
                  (com.thejeffcooper.hassmic.proto.AudioData) msg_)
              .mergeFrom(value)
              .buildPartial();
    } else {
      msg_ = value;
    }
    msgCase_ = 3;
  }

  /** <code>.hassmic.AudioData audio_data = 3;</code> */
  private void clearAudioData() {
    if (msgCase_ == 3) {
      msgCase_ = 0;
      msg_ = null;
    }
  }

  public static final int EVENT_OCCURRED_FIELD_NUMBER = 4;

  /**
   * <code>.hassmic.ClientEvent event_occurred = 4;</code>
   *
   * @return Whether the eventOccurred field is set.
   */
  @java.lang.Override
  public boolean hasEventOccurred() {
    return msgCase_ == 4;
  }

  /**
   * <code>.hassmic.ClientEvent event_occurred = 4;</code>
   *
   * @return The enum numeric value on the wire for eventOccurred.
   */
  @java.lang.Override
  public int getEventOccurredValue() {
    if (msgCase_ == 4) {
      return (java.lang.Integer) msg_;
    }
    return 0;
  }

  /**
   * <code>.hassmic.ClientEvent event_occurred = 4;</code>
   *
   * @return The eventOccurred.
   */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.ClientEvent getEventOccurred() {
    if (msgCase_ == 4) {
      com.thejeffcooper.hassmic.proto.ClientEvent result =
          com.thejeffcooper.hassmic.proto.ClientEvent.forNumber((java.lang.Integer) msg_);
      return result == null ? com.thejeffcooper.hassmic.proto.ClientEvent.UNRECOGNIZED : result;
    }
    return com.thejeffcooper.hassmic.proto.ClientEvent.UNKNOWN_EVENT;
  }

  /**
   * <code>.hassmic.ClientEvent event_occurred = 4;</code>
   *
   * @param value The enum numeric value on the wire for eventOccurred to set.
   */
  private void setEventOccurredValue(int value) {
    msgCase_ = 4;
    msg_ = value;
  }

  /**
   * <code>.hassmic.ClientEvent event_occurred = 4;</code>
   *
   * @param value The eventOccurred to set.
   */
  private void setEventOccurred(com.thejeffcooper.hassmic.proto.ClientEvent value) {
    msg_ = value.getNumber();
    msgCase_ = 4;
  }

  /** <code>.hassmic.ClientEvent event_occurred = 4;</code> */
  private void clearEventOccurred() {
    if (msgCase_ == 4) {
      msgCase_ = 0;
      msg_ = null;
    }
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static Builder newBuilder() {
    return (Builder) DEFAULT_INSTANCE.createBuilder();
  }

  public static Builder newBuilder(com.thejeffcooper.hassmic.proto.ClientMessage prototype) {
    return (Builder) DEFAULT_INSTANCE.createBuilder(prototype);
  }

  /**
   *
   *
   * <pre>
   * The wrapper message that actually gets sent to the server
   * </pre>
   *
   * Protobuf type {@code hassmic.ClientMessage}
   */
  public static final class Builder
      extends com.google.protobuf.GeneratedMessageLite.Builder<
          com.thejeffcooper.hassmic.proto.ClientMessage, Builder>
      implements
      // @@protoc_insertion_point(builder_implements:hassmic.ClientMessage)
      com.thejeffcooper.hassmic.proto.ClientMessageOrBuilder {
    // Construct using com.thejeffcooper.hassmic.proto.ClientMessage.newBuilder()
    private Builder() {
      super(DEFAULT_INSTANCE);
    }

    @java.lang.Override
    public MsgCase getMsgCase() {
      return instance.getMsgCase();
    }

    public Builder clearMsg() {
      copyOnWrite();
      instance.clearMsg();
      return this;
    }

    /** <code>.hassmic.Ping ping = 1;</code> */
    @java.lang.Override
    public boolean hasPing() {
      return instance.hasPing();
    }

    /** <code>.hassmic.Ping ping = 1;</code> */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.Ping getPing() {
      return instance.getPing();
    }

    /** <code>.hassmic.Ping ping = 1;</code> */
    public Builder setPing(com.thejeffcooper.hassmic.proto.Ping value) {
      copyOnWrite();
      instance.setPing(value);
      return this;
    }

    /** <code>.hassmic.Ping ping = 1;</code> */
    public Builder setPing(com.thejeffcooper.hassmic.proto.Ping.Builder builderForValue) {
      copyOnWrite();
      instance.setPing(builderForValue.build());
      return this;
    }

    /** <code>.hassmic.Ping ping = 1;</code> */
    public Builder mergePing(com.thejeffcooper.hassmic.proto.Ping value) {
      copyOnWrite();
      instance.mergePing(value);
      return this;
    }

    /** <code>.hassmic.Ping ping = 1;</code> */
    public Builder clearPing() {
      copyOnWrite();
      instance.clearPing();
      return this;
    }

    /** <code>.hassmic.ClientInfo client_info = 2;</code> */
    @java.lang.Override
    public boolean hasClientInfo() {
      return instance.hasClientInfo();
    }

    /** <code>.hassmic.ClientInfo client_info = 2;</code> */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.ClientInfo getClientInfo() {
      return instance.getClientInfo();
    }

    /** <code>.hassmic.ClientInfo client_info = 2;</code> */
    public Builder setClientInfo(com.thejeffcooper.hassmic.proto.ClientInfo value) {
      copyOnWrite();
      instance.setClientInfo(value);
      return this;
    }

    /** <code>.hassmic.ClientInfo client_info = 2;</code> */
    public Builder setClientInfo(
        com.thejeffcooper.hassmic.proto.ClientInfo.Builder builderForValue) {
      copyOnWrite();
      instance.setClientInfo(builderForValue.build());
      return this;
    }

    /** <code>.hassmic.ClientInfo client_info = 2;</code> */
    public Builder mergeClientInfo(com.thejeffcooper.hassmic.proto.ClientInfo value) {
      copyOnWrite();
      instance.mergeClientInfo(value);
      return this;
    }

    /** <code>.hassmic.ClientInfo client_info = 2;</code> */
    public Builder clearClientInfo() {
      copyOnWrite();
      instance.clearClientInfo();
      return this;
    }

    /** <code>.hassmic.AudioData audio_data = 3;</code> */
    @java.lang.Override
    public boolean hasAudioData() {
      return instance.hasAudioData();
    }

    /** <code>.hassmic.AudioData audio_data = 3;</code> */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.AudioData getAudioData() {
      return instance.getAudioData();
    }

    /** <code>.hassmic.AudioData audio_data = 3;</code> */
    public Builder setAudioData(com.thejeffcooper.hassmic.proto.AudioData value) {
      copyOnWrite();
      instance.setAudioData(value);
      return this;
    }

    /** <code>.hassmic.AudioData audio_data = 3;</code> */
    public Builder setAudioData(com.thejeffcooper.hassmic.proto.AudioData.Builder builderForValue) {
      copyOnWrite();
      instance.setAudioData(builderForValue.build());
      return this;
    }

    /** <code>.hassmic.AudioData audio_data = 3;</code> */
    public Builder mergeAudioData(com.thejeffcooper.hassmic.proto.AudioData value) {
      copyOnWrite();
      instance.mergeAudioData(value);
      return this;
    }

    /** <code>.hassmic.AudioData audio_data = 3;</code> */
    public Builder clearAudioData() {
      copyOnWrite();
      instance.clearAudioData();
      return this;
    }

    /**
     * <code>.hassmic.ClientEvent event_occurred = 4;</code>
     *
     * @return Whether the eventOccurred field is set.
     */
    @java.lang.Override
    public boolean hasEventOccurred() {
      return instance.hasEventOccurred();
    }

    /**
     * <code>.hassmic.ClientEvent event_occurred = 4;</code>
     *
     * @return The enum numeric value on the wire for eventOccurred.
     */
    @java.lang.Override
    public int getEventOccurredValue() {
      return instance.getEventOccurredValue();
    }

    /**
     * <code>.hassmic.ClientEvent event_occurred = 4;</code>
     *
     * @param value The enum numeric value on the wire for eventOccurred to set.
     * @return This builder for chaining.
     */
    public Builder setEventOccurredValue(int value) {
      copyOnWrite();
      instance.setEventOccurredValue(value);
      return this;
    }

    /**
     * <code>.hassmic.ClientEvent event_occurred = 4;</code>
     *
     * @return The eventOccurred.
     */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.ClientEvent getEventOccurred() {
      return instance.getEventOccurred();
    }

    /**
     * <code>.hassmic.ClientEvent event_occurred = 4;</code>
     *
     * @param value The eventOccurred to set.
     * @return This builder for chaining.
     */
    public Builder setEventOccurred(com.thejeffcooper.hassmic.proto.ClientEvent value) {
      copyOnWrite();
      instance.setEventOccurred(value);
      return this;
    }

    /**
     * <code>.hassmic.ClientEvent event_occurred = 4;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearEventOccurred() {
      copyOnWrite();
      instance.clearEventOccurred();
      return this;
    }

    // @@protoc_insertion_point(builder_scope:hassmic.ClientMessage)
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
          return new com.thejeffcooper.hassmic.proto.ClientMessage();
        }
      case NEW_BUILDER:
        {
          return new Builder();
        }
      case BUILD_MESSAGE_INFO:
        {
          java.lang.Object[] objects =
              new java.lang.Object[] {
                "msg_",
                "msgCase_",
                com.thejeffcooper.hassmic.proto.Ping.class,
                com.thejeffcooper.hassmic.proto.ClientInfo.class,
                com.thejeffcooper.hassmic.proto.AudioData.class,
              };
          java.lang.String info =
              "\u0000\u0004\u0001\u0000\u0001\u0004\u0004\u0000\u0000\u0000\u0001<\u0000\u0002<"
                  + "\u0000\u0003<\u0000\u0004?\u0000";
          return newMessageInfo(DEFAULT_INSTANCE, info, objects);
        }
        // fall through
      case GET_DEFAULT_INSTANCE:
        {
          return DEFAULT_INSTANCE;
        }
      case GET_PARSER:
        {
          com.google.protobuf.Parser<com.thejeffcooper.hassmic.proto.ClientMessage> parser = PARSER;
          if (parser == null) {
            synchronized (com.thejeffcooper.hassmic.proto.ClientMessage.class) {
              parser = PARSER;
              if (parser == null) {
                parser =
                    new DefaultInstanceBasedParser<com.thejeffcooper.hassmic.proto.ClientMessage>(
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

  // @@protoc_insertion_point(class_scope:hassmic.ClientMessage)
  private static final com.thejeffcooper.hassmic.proto.ClientMessage DEFAULT_INSTANCE;

  static {
    ClientMessage defaultInstance = new ClientMessage();
    // New instances are implicitly immutable so no need to make
    // immutable.
    DEFAULT_INSTANCE = defaultInstance;
    com.google.protobuf.GeneratedMessageLite.registerDefaultInstance(
        ClientMessage.class, defaultInstance);
  }

  public static com.thejeffcooper.hassmic.proto.ClientMessage getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static volatile com.google.protobuf.Parser<ClientMessage> PARSER;

  public static com.google.protobuf.Parser<ClientMessage> parser() {
    return DEFAULT_INSTANCE.getParserForType();
  }
}
