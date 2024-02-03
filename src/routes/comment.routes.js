import { Router } from "express";
import { addComment , updateComment , deleteComment } from "../controllers/comment.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWt);

router.route("/comment/:commentId").patch(updateComment).delete(deleteComment)
router.route("/:videoId").post(addComment);

export default Router;