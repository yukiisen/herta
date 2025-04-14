export default class DataStore<T> {
    private file: Bun.BunFile;

    content?: T;

    constructor (public filePath: string) {
        this.file = Bun.file(filePath);
    }

    // checks if the file is null and throws an error.
    private checkLoaded (): asserts this is DataStore<T> & { content: NonNullable<T> } {
        if (this.content == undefined) throw new Error("You must load the file to memory before initializing");
    }

    // loads file into memory
    async load() {
        this.content = await this.file.json();
        return this;
    }

    setData <K extends keyof T>(key: K, value: NonNullable<T>[K]): this {
        this.checkLoaded();
        this.content[key] = value;
        return this;
    }

    getData <K extends keyof T>(key: K): T[K] {
        this.checkLoaded();
        return this.content[key];
    }

    deleteData <K extends keyof T>(key: K): void {
        this.checkLoaded();
        delete this.content[key];
    }

    alter (handler: (data: T) => void) {
        this.checkLoaded();
        handler(this.content);
    }

    async save () {
        this.checkLoaded();
        await this.file.write(JSON.stringify(this.content));
    }
}
