"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("./config");
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.config.api_key);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: config_1.genAIConfig,
    safetySettings: config_1.safetySettings
});
function genAIResponse(content) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `
    Given a definition, return the word it defines, along with its etymology, a clear definition, and relatable examples. 
    Provide the output in the following format:
    Word: <word>
    Etymology: <etymology>
    Definition: <definition>
    Examples: <examples>

    Definition: When you're happy that other people are also sad.
    Word: schadenfreude
    Etymology: Derived from German, where "Schaden" means harm and "Freude" means joy.
    Definition: A feeling of pleasure or satisfaction at the misfortune of others.
    Examples: Watching the villain get their comeuppance in a movie can evoke schadenfreude.

    Definition: existing purely in the mind, but not in physical reality.
    Word: abstract
    Etymology: From Latin "abstractus," meaning "drawn away."
    Definition: Existing in thought or as an idea but not having a physical or concrete existence.
    Examples: The idea of perfect justice is abstract; its not something you can touch or see.

    Definition: ${content}
    Word: `;
        const result = yield model.generateContent(prompt);
        console.log(result.response.candidates[0].safetyRatings);
        return result.response.text();
    });
}
exports.default = genAIResponse;
