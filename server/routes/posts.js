import express from "express";
import { 
  getFeedPosts, 
  getUserPosts, 
  likePost, 
  addComment,
  flagPost 
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addComment);
router.patch("/:id/flag", verifyToken, flagPost);

export default router;