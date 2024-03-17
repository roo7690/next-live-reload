"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Inject = /** @class */ (function () {
    function Inject() {
    }
    Inject.getIndexFile = function (opt) {
        var architecture = ["/src/app/layout.tsx", "/src/app/layout.jsx", "/src/app/layout.ts", "/src/app/layout.js", "/app/layout.tsx", "/app/layout.jsx", "/app/layout.ts", "/app/layout.js",
            "/src/pages/_document.tsx", "/src/pages/_document.jsx", "/src/pages/_document.ts", "/src/pages/_document.js", "/pages/_document.tsx", "/pages/_document.jsx", "/pages/_document.ts", "/pages/_document.js"];
        var indexFile = '';
        for (var i = 0; i < architecture.length; i++) {
            if (fs_1.default.existsSync(opt.dir + architecture[i])) {
                indexFile = opt.dir + architecture[i];
                break;
            }
        }
        return indexFile;
    };
    Inject.injectScript = function (opt, port) {
        this.indexFile = this.getIndexFile(opt);
        this.index = fs_1.default.readFileSync(this.indexFile, 'utf-8');
        if (!/next-live-reload\/ws.js/.test(this.index)) {
            var tab = /\n(.*)<\/body>/.exec(this.index)[1], modIndex = this.index.replace('</body>', " <script type=\"javascript\" src=\"/next-live-reload/ws.js\"></script>\n".concat(tab, "</body>"));
            fs_1.default.writeFileSync(this.indexFile, modIndex);
            fs_1.default.mkdirSync(opt.dir + '/public/next-live-reload');
        }
        if (!fs_1.default.existsSync(opt.dir + '/public/next-live-relaod')) {
            var ws = "window.addEventListener('load',()=>{\n  let ws= new WebSocket('ws://localhost:'+".concat(port, ")\n  ws.onmessage=(e)=>{\n    if(e.data=='reload'){\n      window.location.reload()\n    }\n  }\n})");
            fs_1.default.writeFileSync(opt.dir + '/public/next-live-reload/ws.js', ws);
        }
    };
    Inject.restore = function (opt) {
        if (this.index && this.indexFile) {
            fs_1.default.writeFileSync(this.indexFile, this.index);
            fs_1.default.rmdirSync(opt.dir + '/public/next-live-reload');
        }
    };
    Inject.index = undefined;
    Inject.indexFile = undefined;
    return Inject;
}());
exports.default = Inject;
