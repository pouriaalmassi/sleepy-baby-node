const app = require("../src/app")
const request = require("supertest")
const Sleep = require("../src/models/sleep")
const { userOneId, userOne, userTwo, setupDatabase, sleepOne, sleepTwo, sleepThree } = require("./fixtures/db")
const { response } = require("express")

beforeEach(setupDatabase)

test("Should create sleep for user.", async () => {
  const res = await request(app)
    .post("/sleeps")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      startDate: "2023-09-29T00:00:00.000Z",
    })
    .expect(201)

  const sleep = await Sleep.findById(res.body._id)
  expect(sleep).not.toBeNull()
  expect(sleep.startDate).not.toBeNull()
  expect(sleep.startDate).toEqual(new Date("2023-09-29T00:00:00.000Z"))
})

test("User one should have two sleeps", async () => {
  const res = await request(app)
    .get("/sleeps")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(res.body.sleeps.length).toEqual(2)
})

test("Users should not be able to delete the sleeps of other users.", async () => {
  const res = await request(app)
    .delete(`/sleeps/${sleepOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
  const sleep = await Sleep.findById(sleepOne)
  expect(sleep).not.toBeNull()
})

test("Users should be able to delete their own sleeps.", async () => {
  const res = await request(app)
    .delete(`/sleeps/${sleepOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  const sleep = await Sleep.findById(sleepOne)
  expect(sleep).toBeNull()
})
