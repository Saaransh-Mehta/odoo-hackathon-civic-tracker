import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Road & Transportation",
        "Water & Sanitation",
        "Public Safety",
        "Parks & Recreation",
        "Street Lighting",
        "Waste Management",
        "Noise Complaints",
        "Other",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ location: "2dsphere" });

const Post = mongoose.model("Post", postSchema);
export default Post;
