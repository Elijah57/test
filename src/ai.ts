import { GoogleGenerativeAI } from "@google/generative-ai";
import  {config, genAIConfig, safetySettings } from "./config";

const genAI = new GoogleGenerativeAI(config.api_key);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: genAIConfig,
    safetySettings: safetySettings
});

async function genAIResponse(content: string){

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
    
    const result = await model.generateContent(prompt);
    console.log(result.response.candidates[0].safetyRatings);
    return result.response.text();
}

export default genAIResponse;