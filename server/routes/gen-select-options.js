import { GoogleGenAI } from "@google/genai";
import { Router } from "express";
import { auth } from "../middleware/auth.js";

const router = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", auth([1]), async (req, res) => {
  try {
    const { description, options } = req.body; // pass in all the categories as lists in one big list to prevent multiple calls

    const schema = {
      type: "object",
      properties: {
        categoryId: {
          type: "integer",
          description: "The ID of the best matching category",
        },
        colourId: {
          type: "integer",
          description: "The ID of the best matching colour",
        },
        materialId: {
          type: "integer",
          description: "The ID of the best matching material",
        },
        sizeId: {
          type: "integer",
          description: "The ID of the best matching size",
        },
        genderId: {
          type: "integer",
          description: "The ID of the best matching gender",
        },
        conditionId: {
          type: "integer",
          description: "The ID of the best matching condition",
        }
      },
      required: ["categoryId", "colourId", "materialId", "sizeId", "genderId", "conditionId"]
    };

    // Create the prompt with available options
    const optionsText = `
      Available options:
      Categories: ${options.categories.map(c => `${c.categoryId}: ${c.category}`).join(', ')}
      Colours: ${options.colours.map(c => `${c.colourId}: ${c.colour}`).join(', ')}
      Materials: ${options.materials.map(m => `${m.materialId}: ${m.material}`).join(', ')}
      Sizes: ${options.sizes.map(s => `${s.sizeId}: ${s.size}`).join(', ')}
      Genders: ${options.genders.map(g => `${g.genderId}: ${g.gender}`).join(', ')}
      Conditions: ${options.conditions.map(c => `${c.conditionId}: ${c.condition}`).join(', ')} 
      Description: ${description}

      Select the most appropriate option ID for each category based on the description.
      For colours, choose the primary colour mentioned or implied in the description. Use multi-colour options sparingly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: optionsText }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const result = JSON.parse(response.text);
    console.log("Generated selection:", result);
    res.json({ selection: result });
  } catch (e) {
    console.error("Error generating select options: ", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;