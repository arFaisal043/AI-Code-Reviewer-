import { Router } from "express";
import { responseController } from "../controller/ai.controller.js";

const router = Router();

router.post("/get-response", responseController.getResponse);


export const getResponseRoutes = router;