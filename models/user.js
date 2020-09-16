import { Schema, model } from "mongoose";
const { ObjectId } = Schema.Types;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  picture: {
    type: String,
    default: "",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

userSchema.method("transform", function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

export default model("User", userSchema);
