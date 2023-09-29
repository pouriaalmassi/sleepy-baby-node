const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../src/models/user")
const Sleep = require("../../src/models/sleep")

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: "Foo",
  email: "foo@user.com",
  password: "Red12345!",
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
  }],
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: "Bar",
  email: "bar@user.com",
  password: "Blue32#@",
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
  }],
}

const sleepOne = {
  _id: new mongoose.Types.ObjectId(),
  startDate: "2023-09-28T00:00:00.000Z",
  endDate: "2023-09-29T00:00:00.000Z",
  owner: userOne._id,
}

const sleepTwo = {
  _id: new mongoose.Types.ObjectId(),
  startDate: "2023-09-01T00:00:00.000Z",
  endDate: "2023-09-02T00:00:00.000Z",
  owner: userOne._id,
}

const sleepThree = {
  _id: new mongoose.Types.ObjectId(),
  startDate: "2023-09-03T00:00:00.000Z",
  endDate: "2023-09-04T00:00:00.000Z",
  owner: userTwo._id,
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Sleep.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Sleep(sleepOne).save()
  await new Sleep(sleepTwo).save()
  await new Sleep(sleepThree).save()
}

module.exports = {
  userOneId, userOne, userTwo, setupDatabase, sleepOne, sleepTwo, sleepThree,
}
