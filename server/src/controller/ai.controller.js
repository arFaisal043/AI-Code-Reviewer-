import { interaction } from "../services/ai.services.js";

const getResponse = async (req, res) => {
    const prompt = req.body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json(
            { error: "A non-empty prompt is required." }
        );
    }

    try {
        const response = await interaction(prompt.trim());
        return res.json({ response });
    } 
    catch (error) {
        console.error("Failed to generate AI response:", error);
        return res.status(502).json({ error: "Failed to generate an AI response." });
    }
};

export const responseController = {
    getResponse
};