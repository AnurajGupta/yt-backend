import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// getUserTweet
// const getUserTweets = asyncHandler(async(req , res) => {

// })

// createTweet
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Cannot create an Empty tweet");
  }

  const tweet = Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "Failed to create a tweet.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully!"));
});

// updateTweet
const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError("No such tweet exists");
  }

  //   console.log(tweet.owner.toString())
  //   console.log("*********")
  //   console.log(req.user?._id.toString())

  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Unauthorized User");
  }

  const newTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  if (!newTweet) {
    throw new ApiError(500, "Failed to edit your tweet! please try again");
  }

  res
    .status(200)
    .json(new ApiResponse(200, newTweet, "Tweet updated successfully"));
});
// deleteTweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError("No such tweet exists");
  }

  if (tweet?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "Unauthorized User");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(500, "Failed to delete tweet, please try again");
  }

  res.status(200).json(200, deletedTweet, "Tweet deleted successfully");
});

export { createTweet, updateTweet, deleteTweet };
