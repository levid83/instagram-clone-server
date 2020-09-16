import { Schema, model } from "mongoose";
const { ObjectId } = Schema.Types;
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
postSchema.method("transform", function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

export default model("Post", postSchema);
