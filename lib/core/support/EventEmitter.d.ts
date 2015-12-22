export declare class EventEmitter {
    private listeners;
    addListener(fn: any): () => void;
    trigger(...args: any[]): void;
}
