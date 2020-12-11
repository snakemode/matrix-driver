export enum index_mode {
    TOP_LEFT = 0,
    TOP_RIGHT = 1,
    BOTTOM_LEFT = 2,
    BOTTOM_RIGHT = 3
}

export enum carriage_return_mode {
    REGULAR = 0,
    SNAKED = 1,
    SNAKED_VERTICALLY = 2
}

export interface wifiCredentials {
    ssid: string;
    password: string;
}

export interface mqttConfiguration {
    server: string;
    port: number;
    user: string;
    password: string;
    certificate: string;
    subscription: string;
}

export interface displayConfiguration {
    width: number;
    height: number;
    indexMode: index_mode;
    carriageReturnMode: carriage_return_mode;
    gpioPin: number;
    pixelType: any;
}

export interface configuration {
    wifi: wifiCredentials;
    mqtt: mqttConfiguration;
    display: displayConfiguration;
}