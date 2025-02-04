import mongoose from "mongoose";
const {model,Schema}=mongoose
const Teacher = new Schema({
  Name: { type: String, required: true },
  Age: { type: Number, required: true },
  Email: { type: String, required: true },
  cseA: {
    Physics: { type: Boolean, default: false },
    Chemistry: { type: Boolean, default: false },
    Maths: { type: Boolean, default: false },
  },
  cseB: {
    Physics: { type: Boolean, default: false },
    Chemistry: { type: Boolean, default: false },
    Maths: { type: Boolean, default: false },
  },
});

export default mongoose.models.Teacher || model("Teacher", Teacher);
