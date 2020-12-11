
export interface IArduinoProgram {
    setup(): Promise<void>;
    loop(): Promise<void>;
}
