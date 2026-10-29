import { GoogleGenAI } from "@google/genai";

export async function interaction(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: prompt,
    });

    if (!result.text) {
        throw new Error("Gemini returned an empty response.");
    }

    return result.text;
}


// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({});

// const interaction = await ai.interactions.create({
//   model: "gemini-4-argon",
//   input: "Explain how AI works in a few words",
// });

// console.log(interaction.output_text);