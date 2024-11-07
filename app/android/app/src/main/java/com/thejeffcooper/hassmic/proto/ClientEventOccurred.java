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
 * Protobuf type {@code hassmic.ClientEventOccurred}
 */
public final class ClientEventOccurred
    extends com.google.protobuf.GeneratedMessageLite<
        ClientEventOccurred, ClientEventOccurred.Builder>
    implements
    // @@protoc_insertion_point(message_implements:hassmic.ClientEventOccurred)
    ClientEventOccurredOrBuilder {
  private ClientEventOccurred() {}

  public static final int EVENT_FIELD_NUMBER = 1;
  private int event_;

  /**
   * <code>.hassmic.ClientEvent event = 1;</code>
   *
   * @return The enum numeric value on the wire for event.
   */
  @java.lang.Override
  public int getEventValue() {
    return event_;
  }

  /**
   * <code>.hassmic.ClientEvent event = 1;</code>
   *
   * @return The event.
   */
  @java.lang.Override
  public com.thejeffcooper.hassmic.proto.ClientEvent getEvent() {
    com.thejeffcooper.hassmic.proto.ClientEvent result =
        com.thejeffcooper.hassmic.proto.ClientEvent.forNumber(event_);
    return result == null ? com.thejeffcooper.hassmic.proto.ClientEvent.UNRECOGNIZED : result;
  }

  /**
   * <code>.hassmic.ClientEvent event = 1;</code>
   *
   * @param value The enum numeric value on the wire for event to set.
   */
  private void setEventValue(int value) {
    event_ = value;
  }

  /**
   * <code>.hassmic.ClientEvent event = 1;</code>
   *
   * @param value The event to set.
   */
  private void setEvent(com.thejeffcooper.hassmic.proto.ClientEvent value) {
    event_ = value.getNumber();
  }

  /** <code>.hassmic.ClientEvent event = 1;</code> */
  private void clearEvent() {

    event_ = 0;
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      java.nio.ByteBuffer data) throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      java.io.InputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static Builder newBuilder() {
    return (Builder) DEFAULT_INSTANCE.createBuilder();
  }

  public static Builder newBuilder(com.thejeffcooper.hassmic.proto.ClientEventOccurred prototype) {
    return (Builder) DEFAULT_INSTANCE.createBuilder(prototype);
  }

  /**
   *
   *
   * <pre>
   * Tell the server that a client event occurred
   * </pre>
   *
   * Protobuf type {@code hassmic.ClientEventOccurred}
   */
  public static final class Builder
      extends com.google.protobuf.GeneratedMessageLite.Builder<
          com.thejeffcooper.hassmic.proto.ClientEventOccurred, Builder>
      implements
      // @@protoc_insertion_point(builder_implements:hassmic.ClientEventOccurred)
      com.thejeffcooper.hassmic.proto.ClientEventOccurredOrBuilder {
    // Construct using com.thejeffcooper.hassmic.proto.ClientEventOccurred.newBuilder()
    private Builder() {
      super(DEFAULT_INSTANCE);
    }

    /**
     * <code>.hassmic.ClientEvent event = 1;</code>
     *
     * @return The enum numeric value on the wire for event.
     */
    @java.lang.Override
    public int getEventValue() {
      return instance.getEventValue();
    }

    /**
     * <code>.hassmic.ClientEvent event = 1;</code>
     *
     * @param value The event to set.
     * @return This builder for chaining.
     */
    public Builder setEventValue(int value) {
      copyOnWrite();
      instance.setEventValue(value);
      return this;
    }

    /**
     * <code>.hassmic.ClientEvent event = 1;</code>
     *
     * @return The event.
     */
    @java.lang.Override
    public com.thejeffcooper.hassmic.proto.ClientEvent getEvent() {
      return instance.getEvent();
    }

    /**
     * <code>.hassmic.ClientEvent event = 1;</code>
     *
     * @param value The enum numeric value on the wire for event to set.
     * @return This builder for chaining.
     */
    public Builder setEvent(com.thejeffcooper.hassmic.proto.ClientEvent value) {
      copyOnWrite();
      instance.setEvent(value);
      return this;
    }

    /**
     * <code>.hassmic.ClientEvent event = 1;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearEvent() {
      copyOnWrite();
      instance.clearEvent();
      return this;
    }

    // @@protoc_insertion_point(builder_scope:hassmic.ClientEventOccurred)
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
          return new com.thejeffcooper.hassmic.proto.ClientEventOccurred();
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
              };
          java.lang.String info =
              "\u0000\u0001\u0000\u0000\u0001\u0001\u0001\u0000\u0000\u0000\u0001\f";
          return newMessageInfo(DEFAULT_INSTANCE, info, objects);
        }
        // fall through
      case GET_DEFAULT_INSTANCE:
        {
          return DEFAULT_INSTANCE;
        }
      case GET_PARSER:
        {
          com.google.protobuf.Parser<com.thejeffcooper.hassmic.proto.ClientEventOccurred> parser =
              PARSER;
          if (parser == null) {
            synchronized (com.thejeffcooper.hassmic.proto.ClientEventOccurred.class) {
              parser = PARSER;
              if (parser == null) {
                parser =
                    new DefaultInstanceBasedParser<
                        com.thejeffcooper.hassmic.proto.ClientEventOccurred>(DEFAULT_INSTANCE);
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

  // @@protoc_insertion_point(class_scope:hassmic.ClientEventOccurred)
  private static final com.thejeffcooper.hassmic.proto.ClientEventOccurred DEFAULT_INSTANCE;

  static {
    ClientEventOccurred defaultInstance = new ClientEventOccurred();
    // New instances are implicitly immutable so no need to make
    // immutable.
    DEFAULT_INSTANCE = defaultInstance;
    com.google.protobuf.GeneratedMessageLite.registerDefaultInstance(
        ClientEventOccurred.class, defaultInstance);
  }

  public static com.thejeffcooper.hassmic.proto.ClientEventOccurred getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static volatile com.google.protobuf.Parser<ClientEventOccurred> PARSER;

  public static com.google.protobuf.Parser<ClientEventOccurred> parser() {
    return DEFAULT_INSTANCE.getParserForType();
  }
}
