// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: hassmic.proto

package com.thejeffcooper.hassmic.proto;

public interface MediaPlayerVolumeChangeOrBuilder
    extends
    // @@protoc_insertion_point(interface_extends:hassmic.MediaPlayerVolumeChange)
    com.google.protobuf.MessageLiteOrBuilder {

  /**
   * <code>.hassmic.MediaPlayerId player = 1;</code>
   *
   * @return The enum numeric value on the wire for player.
   */
  int getPlayerValue();

  /**
   * <code>.hassmic.MediaPlayerId player = 1;</code>
   *
   * @return The player.
   */
  com.thejeffcooper.hassmic.proto.MediaPlayerId getPlayer();

  /**
   * <code>float new_volume = 2;</code>
   *
   * @return The newVolume.
   */
  float getNewVolume();
}
