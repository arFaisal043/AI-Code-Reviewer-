import { interaction } from "../services/ai.services.js";

const getReview = async (req, res) => {
    const code = req.body?.code;

    if (typeof code !== "string" || !code.trim()) {
        return res.status(400).json(
            { error: "Input is required." }
        );
    }

    try {
        const response = await interaction(code.trim());
        return res.json({ response });
    } 
    catch (error) {
        return res.status(502).json({ error: "Failed to generate an AI response." });
    }
};

export const responseController = {
    getReview
};