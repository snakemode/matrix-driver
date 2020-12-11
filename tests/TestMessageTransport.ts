import { IMessageTransport, WireFormattedMessage } from "../app";


export class TestMessageTransport implements IMessageTransport {

    public sendRequests: any[];

    constructor() {
        this.sendRequests = [];
    }

    public async send(payload: WireFormattedMessage): Promise<void> {
        this.sendRequests.push(payload);
    }

}
