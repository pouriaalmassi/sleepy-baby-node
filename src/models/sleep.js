const mongoose = require("mongoose")
const { randomUUID } = require("crypto")

const schema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.String,
      default: () => randomUUID()
    },
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
