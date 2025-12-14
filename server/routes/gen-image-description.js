import { GoogleGenAI } from "@google/genai";
import { Router } from "express";
import { auth } from "../middleware/auth.js";

const router = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", auth([1]), async (req, res) => {
  try {
    const { image } = req.body;

    const [prefix, base64Data] = image.split(',');
    const mimeType = prefix.match(/:(.*?);/)?.[1] || 'image/jpeg';


    const contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      },
      { text: 
  `System instruction: You generate clothing descriptions for a charity donation system. Write descriptions from the donor's perspective - casual, natural, and descriptive. Focus on garment type, colors, materials, style, patterns, and branding. Keep under 80 words. Never mention condition or damage. Output only the description, nothing else. You MUST keep the character count under 240.
  You are assisting a charity donation management system. Analyze this clothing item image and provide a description as if written by the donor themselves. Focus on: the type of garment, color(s), material/fabric (if visible), style/design features, and any notable patterns or branding. Write in a casual, first-person but neutral perspective (e.g., 'Navy blue cotton t-shirt with a small logo on the chest'). Keep it under 240 characters, descriptive but natural, and avoid mentioning condition, damage, or quality assessments.`
},
    ];

    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it",
      contents: contents,
    });

    res.json({ description: response.text });
  } catch (e) {
    console.error("Error generating image description: ", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;