import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateMood,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/mood", verifyToken, updateMood);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
