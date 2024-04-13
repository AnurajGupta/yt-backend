import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse";

const getLikedVideos = asyncHandler(async (req, res) => {
  const allLikedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
            },
          },
          {
            $unwind: "$ownerDetails",
          },
        ],
      },
    },
    {
      $unwind: "$likedVideos", // If you have an array in a document, $unwind makes a new document for each item in that array.
    },
    {
      $sort: {
        createdAt: -1, // new documents comes first.
      },
    },
    {
      $project: {
        _id: 0,
        likedVideo: {
          _id: 1,
          "videoFile.url": 1,
          "thumbnail.url": 1,
          owner: 1,
          title: 1,
          description: 1,
          views: 1,
          duration: 1,
          createdAt: 1,
          isPublished: 1,
          ownerDetails: {
            username: 1,
            fullName: 1,
            "avatar.url": 1,
          },
        },
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, allLikedVideos, "liked videos fetched successfully")
    );
});

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

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
