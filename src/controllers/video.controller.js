import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// const getAllVideos = asyncHandler(async (req, res) => {});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Invalid videoId");
  }

  if (!isValidObjectId(req.user?._id)) {
    throw new ApiError(400, "Invalid userId");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: {
                $size: "$subscribers",
              },
              isSubscribed: {
                $cond: {
                  if: {
                    $in: [req.user?._id, "$subscribers.subscriber"],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              username: 1,
              "avatar.url": 1,
              subscribersCount: 1,
              isSubscribed: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        owner: {
          $first: "$owner",
        },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        "videoFile.url": 1,
        title: 1,
        description: 1,
        views: 1,
        createdAt: 1,
        duration: 1,
        comments: 1,
        owner: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!video) {
    throw new ApiError(500, "Failed to fetch video");
  }

  await Video.findByIdAndUpdate(videoId, {
    $inc: {
      views: 1,
    },
  });

  await User.findByIdAndUpdate(req.user?._id, {
    $addToSet: {
      watchHistory: videoId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "video details fetched successfully"));
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user is logged in.

  const videoFileLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.videoFile[0].path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file local path is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file local path is required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video file not found");
  }

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail not found");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: {
      url: videoFile.url,
      public_id: videoFile.public_id,
    },
    thumbnail: {
      url: thumbnail.url,
      public_id: thumbnail.public_id,
    },
    duration: videoFile.duration,
    owner: req.user?._id,
    isPublished: false,
  });

  const isUploaded = await Video.findById(video._id);

  if (!isUploaded) {
    throw new ApiError(
      500,
      "There was an error publishing the video.Please try again later"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Published Successfully"));
});

// update

// delete

const togglePublishStatus = asyncHandler(async (req, res) => {
  const videoId = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Unauthorized User");
  }

  const togglePublishStatus = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video?.isPublished,
      },
    },
    { new: true } //if you don't specify { new: true }, Mongoose returns the original document before it was updated.
  );

  if (!togglePublishStatus) {
    throw new ApiError(
      500,
      "Failed to toggle video publish status. Please try again later"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: togglePublishStatus.isPublished },
        "Video publish status toggled successfully."
      )
    );
});

export { getVideoById, publishVideo ,togglePublishStatus};
