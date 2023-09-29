const app = require("../src/app")
const request = require("supertest")
const User = require("../src/models/user")
const { userOneId, userOne, setupDatabase } = require("./fixtures/db")

beforeEach(setupDatabase)

test("Should sign up user.", async () => {
  const res = await request(app)
    .post("/users").send({
      name: "New",
      email: "new@user.com",
      password: "Red12345!",
    }).expect(201)

  // Assert not null.
  const user = await User.findById(res.body.user._id)
  expect(user).not.toBeNull()

  // Assert objects match.
  expect(res.body).toMatchObject({
    user: {
      name: "New",
      email: "new@user.com",
    },
    token: user.tokens[0].token,
  })

  // Assert the password is not stored in plain text.
  expect(user.password).not.toBe("Red12345!")
})

test("Should log in existing user with correct credentials.", async () => {
  const res = await request(app).post("/users/login").send({
    email: userOne.email,
    password: userOne.password,
  }).expect(200)

  // Assert that once the user is logged in that the new jwt
  // is appended to the user's tokens in the database.
  const databaseUser = await User.findById(userOneId)
  expect(res.body.token).toBe(databaseUser.tokens[1].token)
})

test("Should not log in user with incorrect credentials.", async () => {
  await request(app).post("/users/login").send({
    email: "xxx",
    password: "yyy",
  }).expect(400)
})

test("Should get user profile.", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test("Should not get user profile for unauthenticated user.", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401)
})

test("Should delete user profile for authenticated user.", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const nullUser = await User.findById(userOneId)
  expect(nullUser).toBeNull()
})

test("Should not delete user profile for unauthenticated user.", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401)
})

test("Should update user fields.", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "New Name",
    })
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toEqual("New Name")
})

test("Should not update non existent user fields.", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "New Location",
    })
    .expect(400)
})
