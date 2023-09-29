const mongoose = require("mongoose")

const schema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

const Sleep = mongoose.model("Sleep", schema)

module.exports = Sleep
