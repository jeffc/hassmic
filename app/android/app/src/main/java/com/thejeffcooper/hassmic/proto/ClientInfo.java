// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: hassmic.proto

package com.thejeffcooper.hassmic.proto;

/**
 *
 *
 * <pre>
 * Information that the client sends about itself
 * </pre>
 *
 * Protobuf type {@code hassmic.ClientInfo}
 */
public final class ClientInfo
    extends com.google.protobuf.GeneratedMessageLite<ClientInfo, ClientInfo.Builder>
    implements
    // @@protoc_insertion_point(message_implements:hassmic.ClientInfo)
    ClientInfoOrBuilder {
  private ClientInfo() {
    version_ = "";
    uuid_ = "";
  }

  public static final int VERSION_FIELD_NUMBER = 1;
  private java.lang.String version_;

  /**
   *
   *
   * <pre>
   * The version, for example "0.9.2"
   * </pre>
   *
   * <code>string version = 1;</code>
   *
   * @return The version.
   */
  @java.lang.Override
  public java.lang.String getVersion() {
    return version_;
  }

  /**
   *
   *
   * <pre>
   * The version, for example "0.9.2"
   * </pre>
   *
   * <code>string version = 1;</code>
   *
   * @return The bytes for version.
   */
  @java.lang.Override
  public com.google.protobuf.ByteString getVersionBytes() {
    return com.google.protobuf.ByteString.copyFromUtf8(version_);
  }

  /**
   *
   *
   * <pre>
   * The version, for example "0.9.2"
   * </pre>
   *
   * <code>string version = 1;</code>
   *
   * @param value The version to set.
   */
  private void setVersion(java.lang.String value) {
    java.lang.Class<?> valueClass = value.getClass();

    version_ = value;
  }

  /**
   *
   *
   * <pre>
   * The version, for example "0.9.2"
   * </pre>
   *
   * <code>string version = 1;</code>
   */
  private void clearVersion() {

    version_ = getDefaultInstance().getVersion();
  }

  /**
   *
   *
   * <pre>
   * The version, for example "0.9.2"
   * </pre>
   *
   * <code>string version = 1;</code>
   *
   * @param value The bytes for version to set.
   */
  private void setVersionBytes(com.google.protobuf.ByteString value) {
    checkByteStringIsUtf8(value);
    version_ = value.toStringUtf8();
  }

  public static final int UUID_FIELD_NUMBER = 2;
  private java.lang.String uuid_;

  /**
   *
   *
   * <pre>
   * The uuid of this client
   * </pre>
   *
   * <code>string uuid = 2;</code>
   *
   * @return The uuid.
   */
  @java.lang.Override
  public java.lang.String getUuid() {
    return uuid_;
  }

  /**
   *
   *
   * <pre>
   * The uuid of this client
   * </pre>
   *
   * <code>string uuid = 2;</code>
   *
   * @return The bytes for uuid.
   */
  @java.lang.Override
  public com.google.protobuf.ByteString getUuidBytes() {
    return com.google.protobuf.ByteString.copyFromUtf8(uuid_);
  }

  /**
   *
   *
   * <pre>
   * The uuid of this client
   * </pre>
   *
   * <code>string uuid = 2;</code>
   *
   * @param value The uuid to set.
   */
  private void setUuid(java.lang.String value) {
    java.lang.Class<?> valueClass = value.getClass();

    uuid_ = value;
  }

  /**
   *
   *
   * <pre>
   * The uuid of this client
   * </pre>
   *
   * <code>string uuid = 2;</code>
   */
  private void clearUuid() {

    uuid_ = getDefaultInstance().getUuid();
  }

  /**
   *
   *
   * <pre>
   * The uuid of this client
   * </pre>
   *
   * <code>string uuid = 2;</code>
   *
   * @param value The bytes for uuid to set.
   */
  private void setUuidBytes(com.google.protobuf.ByteString value) {
    checkByteStringIsUtf8(value);
    uuid_ = value.toStringUtf8();
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static Builder newBuilder() {
    return (Builder) DEFAULT_INSTANCE.createBuilder();
  }

  public static Builder newBuilder(com.thejeffcooper.hassmic.proto.ClientInfo prototype) {
    return (Builder) DEFAULT_INSTANCE.createBuilder(prototype);
  }

  /**
   *
   *
   * <pre>
   * Information that the client sends about itself
   * </pre>
   *
   * Protobuf type {@code hassmic.ClientInfo}
   */
  public static final class Builder
      extends com.google.protobuf.GeneratedMessageLite.Builder<
          com.thejeffcooper.hassmic.proto.ClientInfo, Builder>
      implements
      // @@protoc_insertion_point(builder_implements:hassmic.ClientInfo)
      com.thejeffcooper.hassmic.proto.ClientInfoOrBuilder {
    // Construct using com.thejeffcooper.hassmic.proto.ClientInfo.newBuilder()
    private Builder() {
      super(DEFAULT_INSTANCE);
    }

    /**
     *
     *
     * <pre>
     * The version, for example "0.9.2"
     * </pre>
     *
     * <code>string version = 1;</code>
     *
     * @return The version.
     */
    @java.lang.Override
    public java.lang.String getVersion() {
      return instance.getVersion();
    }

    /**
     *
     *
     * <pre>
     * The version, for example "0.9.2"
     * </pre>
     *
     * <code>string version = 1;</code>
     *
     * @return The bytes for version.
     */
    @java.lang.Override
    public com.google.protobuf.ByteString getVersionBytes() {
      return instance.getVersionBytes();
    }

    /**
     *
     *
     * <pre>
     * The version, for example "0.9.2"
     * </pre>
     *
     * <code>string version = 1;</code>
     *
     * @param value The version to set.
     * @return This builder for chaining.
     */
    public Builder setVersion(java.lang.String value) {
      copyOnWrite();
      instance.setVersion(value);
      return this;
    }

    /**
     *
     *
     * <pre>
     * The version, for example "0.9.2"
     * </pre>
     *
     * <code>string version = 1;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearVersion() {
      copyOnWrite();
      instance.clearVersion();
      return this;
    }

    /**
     *
     *
     * <pre>
     * The version, for example "0.9.2"
     * </pre>
     *
     * <code>string version = 1;</code>
     *
     * @param value The bytes for version to set.
     * @return This builder for chaining.
     */
    public Builder setVersionBytes(com.google.protobuf.ByteString value) {
      copyOnWrite();
      instance.setVersionBytes(value);
      return this;
    }

    /**
     *
     *
     * <pre>
     * The uuid of this client
     * </pre>
     *
     * <code>string uuid = 2;</code>
     *
     * @return The uuid.
     */
    @java.lang.Override
    public java.lang.String getUuid() {
      return instance.getUuid();
    }

    /**
     *
     *
     * <pre>
     * The uuid of this client
     * </pre>
     *
     * <code>string uuid = 2;</code>
     *
     * @return The bytes for uuid.
     */
    @java.lang.Override
    public com.google.protobuf.ByteString getUuidBytes() {
      return instance.getUuidBytes();
    }

    /**
     *
     *
     * <pre>
     * The uuid of this client
     * </pre>
     *
     * <code>string uuid = 2;</code>
     *
     * @param value The uuid to set.
     * @return This builder for chaining.
     */
    public Builder setUuid(java.lang.String value) {
      copyOnWrite();
      instance.setUuid(value);
      return this;
    }

    /**
     *
     *
     * <pre>
     * The uuid of this client
     * </pre>
     *
     * <code>string uuid = 2;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearUuid() {
      copyOnWrite();
      instance.clearUuid();
      return this;
    }

    /**
     *
     *
     * <pre>
     * The uuid of this client
     * </pre>
     *
     * <code>string uuid = 2;</code>
     *
     * @param value The bytes for uuid to set.
     * @return This builder for chaining.
     */
    public Builder setUuidBytes(com.google.protobuf.ByteString value) {
      copyOnWrite();
      instance.setUuidBytes(value);
      return this;
    }

    // @@protoc_insertion_point(builder_scope:hassmic.ClientInfo)
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
          return new com.thejeffcooper.hassmic.proto.ClientInfo();
        }
      case NEW_BUILDER:
        {
          return new Builder();
        }
      case BUILD_MESSAGE_INFO:
        {
          java.lang.Object[] objects =
              new java.lang.Object[] {
                "version_", "uuid_",
              };
          java.lang.String info =
              "\u0000\u0002\u0000\u0000\u0001\u0002\u0002\u0000\u0000\u0000\u0001\u0208\u0002\u0208"
                  + "";
          return newMessageInfo(DEFAULT_INSTANCE, info, objects);
        }
        // fall through
      case GET_DEFAULT_INSTANCE:
        {
          return DEFAULT_INSTANCE;
        }
      case GET_PARSER:
        {
          com.google.protobuf.Parser<com.thejeffcooper.hassmic.proto.ClientInfo> parser = PARSER;
          if (parser == null) {
            synchronized (com.thejeffcooper.hassmic.proto.ClientInfo.class) {
              parser = PARSER;
              if (parser == null) {
                parser =
                    new DefaultInstanceBasedParser<com.thejeffcooper.hassmic.proto.ClientInfo>(
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

  // @@protoc_insertion_point(class_scope:hassmic.ClientInfo)
  private static final com.thejeffcooper.hassmic.proto.ClientInfo DEFAULT_INSTANCE;

  static {
    ClientInfo defaultInstance = new ClientInfo();
    // New instances are implicitly immutable so no need to make
    // immutable.
    DEFAULT_INSTANCE = defaultInstance;
    com.google.protobuf.GeneratedMessageLite.registerDefaultInstance(
        ClientInfo.class, defaultInstance);
  }

  public static com.thejeffcooper.hassmic.proto.ClientInfo getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static volatile com.google.protobuf.Parser<ClientInfo> PARSER;

  public static com.google.protobuf.Parser<ClientInfo> parser() {
    return DEFAULT_INSTANCE.getParserForType();
  }
}
