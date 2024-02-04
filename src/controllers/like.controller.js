import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse";

// const getLikedVideos = asyncHandler(async(req , res)=> {

// })

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const isLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (isLiked) {
    await Like.findByIdAndDelete(isLiked._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Removed like from video"));
  }

  await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  });

  res.status(200).json(new ApiResponse(200, "Liked video successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (isLiked) {
    await Like.findByIdAndDelete(isLiked._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Removed like from comment"));
  }

  await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  });

  res.status(200).json(new ApiResponse(200, "Liked comment successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const isLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (isLiked) {
    await Like.findByIdAndDelete(isLiked._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Removed like from comment"));
  }

  await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  res.status(200).json(new ApiResponse(200, "Liked tweet successfully"));
});

export {toggleVideoLike , toggleCommentLike , toggleTweetLike}