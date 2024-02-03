import { Router } from "express";
import { toggleVideoLike ,toggleCommentLike , toggleTweetLike } from "../controllers/like.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWt);

router.route("/video/:videoId").post(toggleVideoLike);
router.route("/comment/:commentId").post(toggleCommentLike);
router.route("/tweet/:tweetId").post(toggleTweetLike);
// router.route("/allvideos").post();


export default router;