import { IDeviceAdapter } from "../app/device-adapters/IDeviceAdapter";
import { SetPixelsMessage } from "../app/messages/SetPixelsMessage";
import { ControlMessage } from "../app/messages/ControlMessage";
import { SetTextMessage } from "../app/messages/SetTextMessage";

export class TestDeviceAdapter implements IDeviceAdapter {

    public sendRequests: any[];

    constructor() {
        this.sendRequests = [];
    }

    public sendPixels(payload: SetPixelsMessage): void {
        this.sendRequests.push(payload);
    }

    public sendText(payload: SetTextMessage): void {
        this.sendRequests.push(payload);
    }

    public sendControlMessage(payload: ControlMessage): void {
        this.sendRequests.push(payload);
    }

}