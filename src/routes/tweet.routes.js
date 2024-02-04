import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWt, createTweet);
router.route("/user/:userId").get(verifyJWt, getUserTweets);
router
  .route("/:tweetId")
  .patch(verifyJWt, updateTweet)
  .delete(verifyJWt, deleteTweet);

export default router;
