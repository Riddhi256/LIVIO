import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// ✅ Ensure we pass the actual function
const plugin = passportLocalMongoose.default || passportLocalMongoose;
userSchema.plugin(plugin);

export default mongoose.model("User", userSchema);
