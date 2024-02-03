import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";


// const getVideoComments = asyncHandler(async(req , res) => {
    
// })

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const video = Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: req.user?._id,
  });

  if (!comment) {
    throw new ApiError(500, "Failed to add comment");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "comment not found");
  }

  if (comment?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Unauthorized User");
  }

  const newComment = await Comment.findByIdAndUpdate(
    comment?._id,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!newComment) {
    throw new ApiError(500, "Failed to edit comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newComment, "Comment edited successfully"));
});

const deleteComment = asyncHandler(async(req ,res) => {
    const {commentId} = req.params;

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(400 , "Comment not found")
    }

    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized User");
      }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if(!deletedComment){
        throw new ApiError(500 , "failed to delete comment! please try again later")
    }

    return res.status(200).json(new ApiResponse(200 , deletedComment , "comment deleted successfully"))
})

export {addComment , updateComment , deleteComment}