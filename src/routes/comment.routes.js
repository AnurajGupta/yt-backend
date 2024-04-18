import { Router } from "express";
import { addComment , updateComment , deleteComment , getVideoComments} from "../controllers/comment.controller.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWt);

router.route("/comment/:commentId").patch(updateComment).delete(deleteComment)
router.route("/:videoId").get(getVideoComments).post(addComment);

export default router;