import { Router } from "express";
import {
    generateDraftsController,
    regenerateDraftController
} from "../controllers/draftController.js";

const router = Router();

router.post(
    "/generate",
    generateDraftsController
);

router.post(
    "/regenerate",
    regenerateDraftController
);

export default router;