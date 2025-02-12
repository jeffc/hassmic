// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: hassmic.proto

package com.thejeffcooper.hassmic.proto;

/**
 *
 *
 * <pre>
 * Information saved and loaded between runs of the hassmic app
 * </pre>
 *
 * Protobuf type {@code hassmic.SavedSettings}
 */
public final class SavedSettings
    extends com.google.protobuf.GeneratedMessageLite<SavedSettings, SavedSettings.Builder>
    implements
    // @@protoc_insertion_point(message_implements:hassmic.SavedSettings)
    SavedSettingsOrBuilder {
  private SavedSettings() {}

  public static final int ANNOUNCE_VOLUME_FIELD_NUMBER = 1;
  private float announceVolume_;

  /**
   *
   *
   * <pre>
   * The last volume of the `announce` player
   * </pre>
   *
   * <code>float announce_volume = 1;</code>
   *
   * @return The announceVolume.
   */
  @java.lang.Override
  public float getAnnounceVolume() {
    return announceVolume_;
  }

  /**
   *
   *
   * <pre>
   * The last volume of the `announce` player
   * </pre>
   *
   * <code>float announce_volume = 1;</code>
   *
   * @param value The announceVolume to set.
   */
  private void setAnnounceVolume(float value) {

    announceVolume_ = value;
  }

  /**
   *
   *
   * <pre>
   * The last volume of the `announce` player
   * </pre>
   *
   * <code>float announce_volume = 1;</code>
   */
  private void clearAnnounceVolume() {

    announceVolume_ = 0F;
  }

  public static final int PLAYBACK_VOLUME_FIELD_NUMBER = 2;
  private float playbackVolume_;

  /**
   *
   *
   * <pre>
   * The last volume of the `playback` player
   * </pre>
   *
   * <code>float playback_volume = 2;</code>
   *
   * @return The playbackVolume.
   */
  @java.lang.Override
  public float getPlaybackVolume() {
    return playbackVolume_;
  }

  /**
   *
   *
   * <pre>
   * The last volume of the `playback` player
   * </pre>
   *
   * <code>float playback_volume = 2;</code>
   *
   * @param value The playbackVolume to set.
   */
  private void setPlaybackVolume(float value) {

    playbackVolume_ = value;
  }

  /**
   *
   *
   * <pre>
   * The last volume of the `playback` player
   * </pre>
   *
   * <code>float playback_volume = 2;</code>
   */
  private void clearPlaybackVolume() {

    playbackVolume_ = 0F;
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(
      java.nio.ByteBuffer data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, data);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(
      byte[] data, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, data, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseDelimitedFrom(
      java.io.InputStream input) throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseDelimitedFrom(
      java.io.InputStream input, com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return parseDelimitedFrom(DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(
      com.google.protobuf.CodedInputStream input) throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(DEFAULT_INSTANCE, input);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageLite.parseFrom(
        DEFAULT_INSTANCE, input, extensionRegistry);
  }

  public static Builder newBuilder() {
    return (Builder) DEFAULT_INSTANCE.createBuilder();
  }

  public static Builder newBuilder(com.thejeffcooper.hassmic.proto.SavedSettings prototype) {
    return (Builder) DEFAULT_INSTANCE.createBuilder(prototype);
  }

  /**
   *
   *
   * <pre>
   * Information saved and loaded between runs of the hassmic app
   * </pre>
   *
   * Protobuf type {@code hassmic.SavedSettings}
   */
  public static final class Builder
      extends com.google.protobuf.GeneratedMessageLite.Builder<
          com.thejeffcooper.hassmic.proto.SavedSettings, Builder>
      implements
      // @@protoc_insertion_point(builder_implements:hassmic.SavedSettings)
      com.thejeffcooper.hassmic.proto.SavedSettingsOrBuilder {
    // Construct using com.thejeffcooper.hassmic.proto.SavedSettings.newBuilder()
    private Builder() {
      super(DEFAULT_INSTANCE);
    }

    /**
     *
     *
     * <pre>
     * The last volume of the `announce` player
     * </pre>
     *
     * <code>float announce_volume = 1;</code>
     *
     * @return The announceVolume.
     */
    @java.lang.Override
    public float getAnnounceVolume() {
      return instance.getAnnounceVolume();
    }

    /**
     *
     *
     * <pre>
     * The last volume of the `announce` player
     * </pre>
     *
     * <code>float announce_volume = 1;</code>
     *
     * @param value The announceVolume to set.
     * @return This builder for chaining.
     */
    public Builder setAnnounceVolume(float value) {
      copyOnWrite();
      instance.setAnnounceVolume(value);
      return this;
    }

    /**
     *
     *
     * <pre>
     * The last volume of the `announce` player
     * </pre>
     *
     * <code>float announce_volume = 1;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearAnnounceVolume() {
      copyOnWrite();
      instance.clearAnnounceVolume();
      return this;
    }

    /**
     *
     *
     * <pre>
     * The last volume of the `playback` player
     * </pre>
     *
     * <code>float playback_volume = 2;</code>
     *
     * @return The playbackVolume.
     */
    @java.lang.Override
    public float getPlaybackVolume() {
      return instance.getPlaybackVolume();
    }

    /**
     *
     *
     * <pre>
     * The last volume of the `playback` player
     * </pre>
     *
     * <code>float playback_volume = 2;</code>
     *
     * @param value The playbackVolume to set.
     * @return This builder for chaining.
     */
    public Builder setPlaybackVolume(float value) {
      copyOnWrite();
      instance.setPlaybackVolume(value);
      return this;
    }

    /**
     *
     *
     * <pre>
     * The last volume of the `playback` player
     * </pre>
     *
     * <code>float playback_volume = 2;</code>
     *
     * @return This builder for chaining.
     */
    public Builder clearPlaybackVolume() {
      copyOnWrite();
      instance.clearPlaybackVolume();
      return this;
    }

    // @@protoc_insertion_point(builder_scope:hassmic.SavedSettings)
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
          return new com.thejeffcooper.hassmic.proto.SavedSettings();
        }
      case NEW_BUILDER:
        {
          return new Builder();
        }
      case BUILD_MESSAGE_INFO:
        {
          java.lang.Object[] objects =
              new java.lang.Object[] {
                "announceVolume_", "playbackVolume_",
              };
          java.lang.String info =
              "\u0000\u0002\u0000\u0000\u0001\u0002\u0002\u0000\u0000\u0000\u0001\u0001\u0002\u0001"
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
          com.google.protobuf.Parser<com.thejeffcooper.hassmic.proto.SavedSettings> parser = PARSER;
          if (parser == null) {
            synchronized (com.thejeffcooper.hassmic.proto.SavedSettings.class) {
              parser = PARSER;
              if (parser == null) {
                parser =
                    new DefaultInstanceBasedParser<com.thejeffcooper.hassmic.proto.SavedSettings>(
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

  // @@protoc_insertion_point(class_scope:hassmic.SavedSettings)
  private static final com.thejeffcooper.hassmic.proto.SavedSettings DEFAULT_INSTANCE;

  static {
    SavedSettings defaultInstance = new SavedSettings();
    // New instances are implicitly immutable so no need to make
    // immutable.
    DEFAULT_INSTANCE = defaultInstance;
    com.google.protobuf.GeneratedMessageLite.registerDefaultInstance(
        SavedSettings.class, defaultInstance);
  }

  public static com.thejeffcooper.hassmic.proto.SavedSettings getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static volatile com.google.protobuf.Parser<SavedSettings> PARSER;

  public static com.google.protobuf.Parser<SavedSettings> parser() {
    return DEFAULT_INSTANCE.getParserForType();
  }
}
