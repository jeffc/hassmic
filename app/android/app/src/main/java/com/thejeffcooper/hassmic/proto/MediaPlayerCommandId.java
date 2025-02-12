// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: hassmic.proto

package com.thejeffcooper.hassmic.proto;

/** Protobuf enum {@code hassmic.MediaPlayerCommandId} */
public enum MediaPlayerCommandId implements com.google.protobuf.Internal.EnumLite {
  /** <code>COMMAND_UNKNOWN = 0;</code> */
  COMMAND_UNKNOWN(0),
  /** <code>COMMAND_PLAY = 1;</code> */
  COMMAND_PLAY(1),
  /** <code>COMMAND_PAUSE = 2;</code> */
  COMMAND_PAUSE(2),
  /** <code>COMMAND_STOP = 3;</code> */
  COMMAND_STOP(3),
  UNRECOGNIZED(-1),
  ;

  /** <code>COMMAND_UNKNOWN = 0;</code> */
  public static final int COMMAND_UNKNOWN_VALUE = 0;

  /** <code>COMMAND_PLAY = 1;</code> */
  public static final int COMMAND_PLAY_VALUE = 1;

  /** <code>COMMAND_PAUSE = 2;</code> */
  public static final int COMMAND_PAUSE_VALUE = 2;

  /** <code>COMMAND_STOP = 3;</code> */
  public static final int COMMAND_STOP_VALUE = 3;

  @java.lang.Override
  public final int getNumber() {
    if (this == UNRECOGNIZED) {
      throw new java.lang.IllegalArgumentException(
          "Can't get the number of an unknown enum value.");
    }
    return value;
  }

  /**
   * @param value The number of the enum to look for.
   * @return The enum associated with the given number.
   * @deprecated Use {@link #forNumber(int)} instead.
   */
  @java.lang.Deprecated
  public static MediaPlayerCommandId valueOf(int value) {
    return forNumber(value);
  }

  public static MediaPlayerCommandId forNumber(int value) {
    switch (value) {
      case 0:
        return COMMAND_UNKNOWN;
      case 1:
        return COMMAND_PLAY;
      case 2:
        return COMMAND_PAUSE;
      case 3:
        return COMMAND_STOP;
      default:
        return null;
    }
  }

  public static com.google.protobuf.Internal.EnumLiteMap<MediaPlayerCommandId>
      internalGetValueMap() {
    return internalValueMap;
  }

  private static final com.google.protobuf.Internal.EnumLiteMap<MediaPlayerCommandId>
      internalValueMap =
          new com.google.protobuf.Internal.EnumLiteMap<MediaPlayerCommandId>() {
            @java.lang.Override
            public MediaPlayerCommandId findValueByNumber(int number) {
              return MediaPlayerCommandId.forNumber(number);
            }
          };

  public static com.google.protobuf.Internal.EnumVerifier internalGetVerifier() {
    return MediaPlayerCommandIdVerifier.INSTANCE;
  }

  private static final class MediaPlayerCommandIdVerifier
      implements com.google.protobuf.Internal.EnumVerifier {
    static final com.google.protobuf.Internal.EnumVerifier INSTANCE =
        new MediaPlayerCommandIdVerifier();

    @java.lang.Override
    public boolean isInRange(int number) {
      return MediaPlayerCommandId.forNumber(number) != null;
    }
  }
  ;

  private final int value;

  private MediaPlayerCommandId(int value) {
    this.value = value;
  }

  // @@protoc_insertion_point(enum_scope:hassmic.MediaPlayerCommandId)
}
