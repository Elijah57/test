import TelegramBot from "node-telegram-bot-api";
import * as http from "http";
import  {about, config, welcome} from "./config";
import genAIResponse from "./ai";
import { GoogleGenerativeAIResponseError } from "@google/generative-ai";


const bot = new TelegramBot(config.bot_token, {polling: true});

bot.onText(/\/start/, (msg: TelegramBot.Message)=>{
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, welcome, {parse_mode: "Markdown"})
})

bot.onText(/\/help|\/about/, (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const helpText = about;
    bot.sendMessage(chatId, helpText, { parse_mode: "Markdown" });
});

bot.on("message", async (msg: TelegramBot.Message)=>{
    const chatId = msg.chat.id;
    const userInput = msg.text;

    if (userInput?.startsWith("/")){
        return ;
    }

    if (userInput){
        let response;
        try{
            response = await genAIResponse(userInput);
            bot.sendMessage(chatId, response, {parse_mode: "Markdown"})
        }catch(error){
            if (error instanceof GoogleGenerativeAIResponseError){
                response = "Content is unsafe"
                bot.sendMessage(chatId, response)
            }
            // console.log("Error", error)
        }     
    }
});


const server = http.createServer();
server.on("request", (req, res)=>{
    res.writeHead(200, { "conent-type": "application/json"});
    res.end(JSON.stringify({
        data: "I am alive"
    }));
});
server.listen(config.port, ()=>{
    console.log(`Server listening on port ${config.port}`)
});