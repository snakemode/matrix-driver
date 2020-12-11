import { IDeviceAdapter } from "./device-adapters/IDeviceAdapter";

export type Coord = { x: number, y?: number };

export interface PixelValue extends Coord {
    color?: Rgb | string;
}

export type Color = Rgb | string;
export type WireFormattedMessage = Uint8Array | string;

export type Rgb = { r: number, g: number, b: number };

export interface IRemoteMatrixLedDriverConfiguration {
    displayConfig: RemoteDisplayConfiguration;
    deviceAdapter: IDeviceAdapter
}

export interface IMessageTransport {
    send(payload: WireFormattedMessage): Promise<void>;
}

export enum IndexMode {
    TopLeft,
    TopRight
}

export enum CarriageReturnMode {
    Regular,
    Snaked
}

export interface LedMatrixConfiguration {
    width: number,
    height: number,
    indexFrom: IndexMode;
    carriageReturnMode: CarriageReturnMode;
}

export interface RemoteDisplayConfiguration {
    width: number,
    height: number,
}

export interface PixelDefinition extends SpriteSheetMetadata {
    character: string;
    spriteSheetOffset: number;
}

export interface SpriteSheetMetadata {
    index: number;
    width: number;
}

export interface ISpriteSheet {
    has(character: string): boolean;
    get(character: string): PixelDefinition;
}

export type DiffValue = { x: number, y: number, data: string }

export function isRgb(color: Color): color is Rgb {
    return (color as Rgb).r !== undefined
        && (color as Rgb).g !== undefined
        && (color as Rgb).b !== undefined;
}

export function isCoord(object: any): object is Coord {
    return (object as Coord).x !== undefined
        && (object as Coord).y !== undefined;
}

export function isHexCode(color: Color): color is string {
    return typeof color === "string" && color.startsWith("#");
}