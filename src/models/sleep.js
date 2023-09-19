const mongoose = require("mongoose")

const schema = new mongoose.Schema(
  {
    isStart: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

const Sleep = mongoose.model("Sleep", schema)

module.exports = Sleep
