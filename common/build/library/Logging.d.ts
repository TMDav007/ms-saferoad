declare class Logging {
    static log: (args: any) => (args: any) => void;
    static info: (args: any) => void;
    static warn: (args: any) => void;
    static error: (args: any) => void;
}
export { Logging };
