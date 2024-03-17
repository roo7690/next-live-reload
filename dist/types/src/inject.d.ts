export default class Inject {
    static index?: string;
    static indexFile?: string;
    static getIndexFile(opt: {
        dir: string;
    }): string;
    static injectScript(opt: {
        dir: string;
    }, port: number): void;
    static restore(opt: {
        dir: string;
    }): void;
}
