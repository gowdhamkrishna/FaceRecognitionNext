const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Schema for individual student attendance
const studentAttendanceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rollno: {
    type: Number,
    required: true,
    unique: false,
  },
  present: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Schema for attendance sessions
const sessionSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sessionNo: {
    type: Number,
    required: true,
  },
  classType: { type: String, required: true },
  sessionTime: { type: Number, required: true },
  subject: { type: String, required: true },
  students: {
    type: [studentAttendanceSchema],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "A session must have at least one student.",
    },
  },
});

const Session = mongoose.models.Session || model("Session", sessionSchema);

module.exports = Session;
