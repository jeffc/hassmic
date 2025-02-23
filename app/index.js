// this is a compiled form of index.ts
// This is temporary and should be replaced
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var react_native_1 = require("react-native");
var main_1 = require("./app/main");
var backgroundtask_1 = require("./app/backgroundtask");
var app_json_1 = require("./app.json");
var react_native_fast_encoder_1 = require("react-native-fast-encoder");
// ---- begin textencoder polyfills ----
// from https://gist.github.com/aretrace/bcb0777c2cfd2b0b1d9dcfb805fe2838
if (react_native_1.Platform.OS !== 'web') {
    var setupPolyfills = function () { return __awaiter(void 0, void 0, void 0, function () {
        var polyfillGlobal, _a, ReadableStream, TransformStream, _b, TextEncoderStream, TextDecoderStream, _c, fetch, Headers, Request, Response;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('react-native/Libraries/Utilities/PolyfillFunctions'); })];
                case 1:
                    polyfillGlobal = (_d.sent()).polyfillGlobal;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('web-streams-polyfill/dist/ponyfill'); })];
                case 2:
                    _a = _d.sent(), ReadableStream = _a.ReadableStream, TransformStream = _a.TransformStream;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('@stardazed/streams-text-encoding'); })];
                case 3:
                    _b = _d.sent(), TextEncoderStream = _b.TextEncoderStream, TextDecoderStream = _b.TextDecoderStream;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('react-native-fetch-api'); })];
                case 4:
                    _c = _d.sent(), fetch = _c.fetch, Headers = _c.Headers, Request = _c.Request, Response = _c.Response;
                    polyfillGlobal('TextDecoder', function () { return react_native_fast_encoder_1.default; });
                    polyfillGlobal('ReadableStream', function () { return ReadableStream; });
                    polyfillGlobal('TransformStream', function () { return TransformStream; });
                    polyfillGlobal('TextEncoderStream', function () { return TextEncoderStream; });
                    polyfillGlobal('TextDecoderStream', function () { return TextDecoderStream; });
                    polyfillGlobal('fetch', function () {
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return fetch(args[0], __assign(__assign({}, args[1]), { reactNative: { textStreaming: true } }));
                        };
                    });
                    polyfillGlobal('Headers', function () { return Headers; });
                    polyfillGlobal('Request', function () { return Request; });
                    polyfillGlobal('Response', function () { return Response; });
                    return [2 /*return*/];
            }
        });
    }); };
    setupPolyfills();
}
// ---- end textencoder polyfills ----
react_native_1.AppRegistry.registerHeadlessTask('HassmicBackgroundTask', function () { return backgroundtask_1.BackgroundTaskManager.run_fn; });
react_native_1.AppRegistry.registerComponent(app_json_1.name, function () { return main_1.default; });
