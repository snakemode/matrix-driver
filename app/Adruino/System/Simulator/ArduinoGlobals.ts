export function millis() {
    return Date.now();
}

export function digitalRead(pin: number): boolean {
    return false;
}

export function delay(timeoutMs: number) {
    return new Promise((res, rej) => { setTimeout(() => { res(true); }, timeoutMs); });
}

export const Serial = {
    begin: (baudRate: number) => {

    },

    print: (value: any) => {
        console.log(value);
    },

    println: (value: any) => {
        console.log(value);
    }
}

export function F(val: string) { return val; };
