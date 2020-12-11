import { IMessageTransport, WireFormattedMessage } from '../types';
import Ably from "ably";

export class AblyTransport implements IMessageTransport {

    private ably: Ably.Types.RealtimePromise;
    private channelId: string;
    private channel: any;

    constructor(ablyClient: Ably.Types.RealtimePromise, channelId = "leds") {
        this.ably = ablyClient;
        this.channelId = channelId;
        this.channel = this.ably.channels.get(this.channelId);
    }

    public async send(payload: WireFormattedMessage): Promise<void> {
        this.channel.publish({ name: "StreamedText", data: payload });
    }
}
