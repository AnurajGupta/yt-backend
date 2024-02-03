import { Router } from "express";
import { createTweet, deleteTweet, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWt , createTweet);
// router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(verifyJWt, updateTweet).delete(verifyJWt , deleteTweet);
export default router;