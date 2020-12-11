import { IMessageTransport, WireFormattedMessage } from "../../../types";

type ProcessFunction = (client: any, topic: string, payload: number[], payload_length: number) => void;

export class mqtt_connection implements IMessageTransport {

    private static fakeReceiveBufer: WireFormattedMessage[] = [];
    private static publishedMessages = [];

    public static get instance() { return mqtt_connection._staticInstance; }
    private static _staticInstance = new mqtt_connection(null);

    private processCallback: ProcessFunction;

    constructor(cfg: any) {
    }

    public ensure_mqtt_connected(callbackWhenMessageRecieved: ProcessFunction) {
        this.processCallback = callbackWhenMessageRecieved;
    }

    public async process_messages() {
        while (mqtt_connection.fakeReceiveBufer.length > 0) {
            const msg = mqtt_connection.fakeReceiveBufer.shift();

            const buffer = typeof msg === "string"
                ? Buffer.from(msg, "ascii")
                : msg;

            await this.processCallback(null, "topic", [...buffer], buffer.length);
        }
    }

    public publish(arg0: string): boolean {
        mqtt_connection.fakeReceiveBufer.push(arg0);
        mqtt_connection.publishedMessages.push(arg0);
        return true;
    }

    public static simulateRecievedMessage(arg0: WireFormattedMessage) {
        mqtt_connection.fakeReceiveBufer.push(arg0);
    }

    public async send(payload: WireFormattedMessage): Promise<void> {
        mqtt_connection.fakeReceiveBufer.push(payload);
    }

}