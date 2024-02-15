import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup } from "../controllers/chat.controllers.js";


const router = Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);


export default router;
