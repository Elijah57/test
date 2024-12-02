"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const http = __importStar(require("http"));
const config_1 = require("./config");
const ai_1 = __importDefault(require("./ai"));
const generative_ai_1 = require("@google/generative-ai");
const bot = new node_telegram_bot_api_1.default(config_1.config.bot_token, { polling: true });
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, config_1.welcome, { parse_mode: "Markdown" });
});
bot.onText(/\/help|\/about/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = config_1.about;
    bot.sendMessage(chatId, helpText, { parse_mode: "Markdown" });
});
bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const userInput = msg.text;
    if (userInput === null || userInput === void 0 ? void 0 : userInput.startsWith("/")) {
        return;
    }
    if (userInput) {
        let response;
        try {
            response = yield (0, ai_1.default)(userInput);
            bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
        }
        catch (error) {
            if (error instanceof generative_ai_1.GoogleGenerativeAIResponseError) {
                response = "Content is unsafe";
                bot.sendMessage(chatId, response);
            }
            // console.log("Error", error)
        }
    }
}));
const server = http.createServer();
server.on("request", (req, res) => {
    res.writeHead(200, { "conent-type": "application/json" });
    res.end(JSON.stringify({
        data: "I am alive"
    }));
});
server.listen(config_1.config.port, () => {
    console.log(`Server listening on port ${config_1.config.port}`);
});
