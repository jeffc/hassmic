// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "hassmic.proto" (package "hassmic", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * Information that the client sends about itself
 *
 * @generated from protobuf message hassmic.ClientInfo
 */
export interface ClientInfo {
    /**
     * The version, for example "0.9.2"
     *
     * @generated from protobuf field: string version = 1;
     */
    version: string;
    /**
     * @generated from protobuf field: string uuid = 2;
     */
    uuid: string;
}
/**
 * A ping message
 *
 * @generated from protobuf message hassmic.Ping
 */
export interface Ping {
}
/**
 * @generated from protobuf message hassmic.AudioData
 */
export interface AudioData {
    /**
     * @generated from protobuf field: bytes data = 1;
     */
    data: Uint8Array;
}
/**
 * Tell the server that a client event occurred
 *
 * @generated from protobuf message hassmic.ClientEventOccurred
 */
export interface ClientEventOccurred {
    /**
     * @generated from protobuf field: hassmic.ClientEvent event = 1;
     */
    event: ClientEvent;
}
/**
 * @generated from protobuf message hassmic.ClientMessage
 */
export interface ClientMessage {
    /**
     * @generated from protobuf oneof: msg
     */
    msg: {
        oneofKind: "ping";
        /**
         * @generated from protobuf field: hassmic.Ping ping = 1;
         */
        ping: Ping;
    } | {
        oneofKind: "clientInfo";
        /**
         * @generated from protobuf field: hassmic.ClientInfo client_info = 2;
         */
        clientInfo: ClientInfo;
    } | {
        oneofKind: "audioData";
        /**
         * @generated from protobuf field: hassmic.AudioData audio_data = 3;
         */
        audioData: AudioData;
    } | {
        oneofKind: "eventOccurred";
        /**
         * @generated from protobuf field: hassmic.ClientEvent event_occurred = 4;
         */
        eventOccurred: ClientEvent;
    } | {
        oneofKind: undefined;
    };
}
/**
 * Events that the client wants to make the server aware of
 *
 * @generated from protobuf enum hassmic.ClientEvent
 */
export enum ClientEvent {
    /**
     * @generated from protobuf enum value: UNKNOWN_EVENT = 0;
     */
    UNKNOWN_EVENT = 0
}
// @generated message type with reflection information, may provide speed optimized methods
class ClientInfo$Type extends MessageType<ClientInfo> {
    constructor() {
        super("hassmic.ClientInfo", [
            { no: 1, name: "version", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "uuid", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<ClientInfo>): ClientInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.version = "";
        message.uuid = "";
        if (value !== undefined)
            reflectionMergePartial<ClientInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClientInfo): ClientInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string version */ 1:
                    message.version = reader.string();
                    break;
                case /* string uuid */ 2:
                    message.uuid = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ClientInfo, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string version = 1; */
        if (message.version !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.version);
        /* string uuid = 2; */
        if (message.uuid !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.uuid);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message hassmic.ClientInfo
 */
export const ClientInfo = new ClientInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Ping$Type extends MessageType<Ping> {
    constructor() {
        super("hassmic.Ping", []);
    }
    create(value?: PartialMessage<Ping>): Ping {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Ping>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Ping): Ping {
        return target ?? this.create();
    }
    internalBinaryWrite(message: Ping, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message hassmic.Ping
 */
export const Ping = new Ping$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AudioData$Type extends MessageType<AudioData> {
    constructor() {
        super("hassmic.AudioData", [
            { no: 1, name: "data", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<AudioData>): AudioData {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.data = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<AudioData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AudioData): AudioData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bytes data */ 1:
                    message.data = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: AudioData, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bytes data = 1; */
        if (message.data.length)
            writer.tag(1, WireType.LengthDelimited).bytes(message.data);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message hassmic.AudioData
 */
export const AudioData = new AudioData$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ClientEventOccurred$Type extends MessageType<ClientEventOccurred> {
    constructor() {
        super("hassmic.ClientEventOccurred", [
            { no: 1, name: "event", kind: "enum", T: () => ["hassmic.ClientEvent", ClientEvent] }
        ]);
    }
    create(value?: PartialMessage<ClientEventOccurred>): ClientEventOccurred {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.event = 0;
        if (value !== undefined)
            reflectionMergePartial<ClientEventOccurred>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClientEventOccurred): ClientEventOccurred {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* hassmic.ClientEvent event */ 1:
                    message.event = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ClientEventOccurred, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* hassmic.ClientEvent event = 1; */
        if (message.event !== 0)
            writer.tag(1, WireType.Varint).int32(message.event);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message hassmic.ClientEventOccurred
 */
export const ClientEventOccurred = new ClientEventOccurred$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ClientMessage$Type extends MessageType<ClientMessage> {
    constructor() {
        super("hassmic.ClientMessage", [
            { no: 1, name: "ping", kind: "message", oneof: "msg", T: () => Ping },
            { no: 2, name: "client_info", kind: "message", oneof: "msg", T: () => ClientInfo },
            { no: 3, name: "audio_data", kind: "message", oneof: "msg", T: () => AudioData },
            { no: 4, name: "event_occurred", kind: "enum", oneof: "msg", T: () => ["hassmic.ClientEvent", ClientEvent] }
        ]);
    }
    create(value?: PartialMessage<ClientMessage>): ClientMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.msg = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<ClientMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClientMessage): ClientMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* hassmic.Ping ping */ 1:
                    message.msg = {
                        oneofKind: "ping",
                        ping: Ping.internalBinaryRead(reader, reader.uint32(), options, (message.msg as any).ping)
                    };
                    break;
                case /* hassmic.ClientInfo client_info */ 2:
                    message.msg = {
                        oneofKind: "clientInfo",
                        clientInfo: ClientInfo.internalBinaryRead(reader, reader.uint32(), options, (message.msg as any).clientInfo)
                    };
                    break;
                case /* hassmic.AudioData audio_data */ 3:
                    message.msg = {
                        oneofKind: "audioData",
                        audioData: AudioData.internalBinaryRead(reader, reader.uint32(), options, (message.msg as any).audioData)
                    };
                    break;
                case /* hassmic.ClientEvent event_occurred */ 4:
                    message.msg = {
                        oneofKind: "eventOccurred",
                        eventOccurred: reader.int32()
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ClientMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* hassmic.Ping ping = 1; */
        if (message.msg.oneofKind === "ping")
            Ping.internalBinaryWrite(message.msg.ping, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* hassmic.ClientInfo client_info = 2; */
        if (message.msg.oneofKind === "clientInfo")
            ClientInfo.internalBinaryWrite(message.msg.clientInfo, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* hassmic.AudioData audio_data = 3; */
        if (message.msg.oneofKind === "audioData")
            AudioData.internalBinaryWrite(message.msg.audioData, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* hassmic.ClientEvent event_occurred = 4; */
        if (message.msg.oneofKind === "eventOccurred")
            writer.tag(4, WireType.Varint).int32(message.msg.eventOccurred);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message hassmic.ClientMessage
 */
export const ClientMessage = new ClientMessage$Type();
