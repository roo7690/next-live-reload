import ws from 'ws';
import chokidar from 'chokidar';
export default class Watcher {
    static wss?: ws.Server;
    static watcher?: chokidar.FSWatcher;
    static run(files: string[], ignored: string[] | undefined, opt: {
        dir: string;
    }): number;
    static close(): void;
}
