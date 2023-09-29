const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Sleep = require("./sleep")

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(v) {
        if (!validator.isEmail(v)) {
          throw new Error("Email is invalid.")
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate(v) {
        if (v.toLowerCase().includes("password")) {
          throw new Error(
            "The password should not contain the word 'passwords'.",
          )
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

schema.virtual("sleeps", {
  ref: "Sleep",
  localField: "_id",
  foreignField: "owner",
})

schema.methods.toJSON = function() {
  const userObject = this.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

schema.methods.generateAuthToken = async function() {
  const newToken = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET,
  )

  this.tokens = this.tokens.concat({ token: newToken })

  await this.save()

  return newToken
}

schema.statics.findByCredentials = async (email, password) => {
  const errorMessage = "Unable to log in"

  const user = await User.findOne({ email })

  if (!user) {
    throw new Error(errorMessage)
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error(errorMessage)
  }

  return user
}

schema.pre("save", async function(next) {
  console.log("Pre hook 'save' middleware running.")

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  next()
})

schema.pre("remove", async function(next) {
  console.log("Pre hook 'remove' middleware running.")

  await Sleep.deleteMany({ owner: this._id })

  next()
})

const User = mongoose.model("User", schema)

module.exports = User
