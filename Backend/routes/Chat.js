import {Router} from "express";
import {getAllThreads, getThreadMessagage, deleteThread, createThread} from "../controllers/ChatController.js";

const router = Router();

router.post("/thread", getAllThreads);
router.post("/thread/:threadId", getThreadMessagage);
router.delete("/thread/:threadId", deleteThread);
router.post("/chat", createThread);

export default router;