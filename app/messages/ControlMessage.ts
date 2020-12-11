export class ControlMessage {

    public type: ControlMessageType;

    constructor(type: ControlMessageType) {
        this.type = type;
    }

    public static clear(): ControlMessage {
        return new ControlMessage(ControlMessageType.clear);
    }
}

export enum ControlMessageType {
    clear,
}