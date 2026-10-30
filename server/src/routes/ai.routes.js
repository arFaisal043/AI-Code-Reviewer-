import { Router } from "express";
import { responseController } from "../controller/ai.controller.js";

const router = Router();

router.post("/get-review", responseController.getReview);


export const getReviewRoutes = router;