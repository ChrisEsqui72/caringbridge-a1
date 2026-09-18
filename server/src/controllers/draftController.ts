import type { Request, Response } from "express";
import {
    generateDrafts,
    regenerateDraft
} from "../services/aiService.js";

export async function generateDraftsController(
    req: Request,
    res: Response
) {
    try {
        const { onboarding } = req.body;

        const drafts =
            await generateDrafts(onboarding);

        res.json({ drafts });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to generate drafts."
        });
    }
}

export async function regenerateDraftController(
    req: Request,
    res: Response
) {
    try {
        const {
            onboarding,
            draft
        } = req.body;

        const regenerated =
            await regenerateDraft(
                onboarding,
                draft
            );

        res.json({
            draft: regenerated
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to regenerate draft."
        });
    }
}