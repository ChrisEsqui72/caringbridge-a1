import express from "express";
import cors from "cors";
import { 
    generateDrafts,
    regenerateDraft
 } from "./services/llm.js";

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ??
            "http://localhost:5173"
    })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok"
    });
});

app.post("/api/drafts/generate", async (req, res) => {
    try {
        const drafts = await generateDrafts(
            req.body.onboarding
        );

        res.json({
            drafts
        });
    } catch (error) {
        console.error(
            "Draft generation error:",
            error
        );

        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to generate drafts"
        });
    }
});

app.post("/api/drafts/regenerate", async (req, res) => {
    try {
        const { onboarding, draft } = req.body;

        const updatedDraft = await regenerateDraft(
            onboarding,
            draft
        );

        res.json({
            draft: updatedDraft
        });
    } catch (error) {
        console.error(
            "Draft regeneration error:",
            error
        );

        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to regenerate draft"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Server running on port ${PORT}`
    );
});