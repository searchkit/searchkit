export declare class EventEmitter {
    listeners: any[];
    addListener(fn: any): () => void;
    trigger(...args: any[]): void;
}
