export type Service<T> = {
    service: unknown;
    callback: () => T;
    singleton: boolean;
};

export interface DependencyContainerInterface {
    get<T>(name: string): Service<T>;
    set<T>(name: string, callback: () => T, singleton: boolean): void;
}

export class DependencyContainer implements DependencyContainerInterface {
    private _services: Map<
        string,
        {
            service: unknown;
            callback: () => unknown;
            singleton: boolean;
        }
    > = new Map();

    static init(): DependencyContainer {
        return new DependencyContainer();
    }

    clear(): void {
        this._services.clear();
    }
    get<T>(name: string): T {
        if (!this._services.has(name)) {
            throw new Error('Service not initialized');
        }

        if (this._services.get(name).singleton) {
            return this._services.get(name).service as T;
        }

        return this._services.get(name).callback() as T;
    }

    set<T>(name: string, callback: () => T, singleton: boolean = false): void {
        let service = undefined;
        if (singleton) service = callback();

        this._services.set(name, {
            service,
            callback,
            singleton,
        });
    }
}

export default DependencyContainer.init();
