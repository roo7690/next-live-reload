"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inject_1 = __importDefault(require("./inject"));
var watcher_1 = __importDefault(require("./watcher"));
/**
 * @class
 * @classdesc
 */
module.exports = /** @class */ (function () {
    /**
     *
     * @param {string[]} files List of files to watch
     * @param {string[]} ignored List of files to ignore
     * @param {WebpackConfigContext} opt
     */
    function NextLiveReload(files, opt, ignored) {
        if (ignored === void 0) { ignored = []; }
        this.files = files;
        this.ignored = ignored;
        this.opt = opt;
    }
    NextLiveReload.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.beforeCompile.tap('Refresh', function () {
            if (!process.env.NEXT_LIVE_RELOAD) {
                var port = watcher_1.default.run(_this.files, _this.ignored, _this.opt);
                inject_1.default.injectScript(_this.opt, port);
                process.env.NEXT_LIVE_RELOAD = 'compiled';
                process.on('exit', function () {
                    watcher_1.default.close();
                    inject_1.default.restore(_this.opt);
                    console.log('\x1b[1;33mNext Live Reload stopped\x1b[0m');
                });
            }
        });
    };
    return NextLiveReload;
}());
