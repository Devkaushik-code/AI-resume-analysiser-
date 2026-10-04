import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Gemini AI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "ResumeAI backend is running"
    });
});

// Resume AI analysis
app.post("/api/analyze", async (req, res) => {

    try {

        const { resumeText } = req.body;

        if (!resumeText || typeof resumeText !== "string") {
            return res.status(400).json({
                success: false,
                message: "Resume text is required."
            });
        }

        // Prevent unnecessarily large requests
        const resume = resumeText.slice(0, 30000);

        const prompt = `
You are an expert ATS resume reviewer and career advisor.

Analyze the following resume carefully.

Give practical, honest and personalized feedback.

Focus on:
1. Overall quality of the resume
2. Strengths
3. Weaknesses and areas to improve
4. Missing or recommended technical/professional skills
5. ATS-friendly improvements

Do not invent information that is not present in the resume.

Resume:

${resume}
`;

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: prompt,

            config: {

                responseMimeType: "application/json",

                responseSchema: {

                    type: Type.OBJECT,

                    properties: {

                        summary: {
                            type: Type.STRING
                        },

                        strengths: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        },

                        weaknesses: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        },

                        recommendedSkills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }

                    },

                    required: [
                        "summary",
                        "strengths",
                        "weaknesses",
                        "recommendedSkills"
                    ]

                }

            }

        });

        const result = JSON.parse(response.text);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error("Gemini analysis error:", error.message);

        res.status(500).json({
            success: false,
            message: "AI analysis failed. Please try again."
        });

    }

});

app.listen(PORT, () => {

    console.log(`ResumeAI backend running on port ${PORT}`);

});