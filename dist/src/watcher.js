"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var chokidar_1 = __importDefault(require("chokidar"));
var Watcher = /** @class */ (function () {
    function Watcher() {
    }
    Watcher.run = function (files, ignored, opt) {
        var _this = this;
        if (ignored === void 0) { ignored = []; }
        var port = 1000 * (Math.floor(Math.random() * 6 + 3)) + 100 * (Math.floor(Math.random() * 9))
            + 10 * (Math.floor(Math.random() * 9)) + Math.floor(Math.random() * 9), _files = [], _ignored = [];
        for (var i = 0; i < files.length; i++) {
            _files.push(opt.dir + files[i]);
        }
        for (var i = 0; i < ignored.length; i++) {
            _ignored.push(opt.dir + ignored[i]);
        }
        this.wss = new ws_1.default.Server({ port: port });
        this.watcher = chokidar_1.default.watch(_files, {
            ignored: _ignored,
            persistent: true,
            interval: 1000
        });
        this.wss.on('connection', function (ws) {
            var _a;
            ws.on('error', console.error);
            (_a = _this.watcher) === null || _a === void 0 ? void 0 : _a.on('change', function () {
                ws.send('reload');
            });
        });
        return port;
    };
    Watcher.close = function () {
        var _a, _b;
        (_a = this.wss) === null || _a === void 0 ? void 0 : _a.close();
        (_b = this.watcher) === null || _b === void 0 ? void 0 : _b.close();
    };
    return Watcher;
}());
exports.default = Watcher;
