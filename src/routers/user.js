const express = require("express")
const User = require("../models/user")
const router = new express.Router()
const auth = require("../middleware/auth")

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body)
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
})

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
})

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user)
})

router.patch("/users/me", auth, async (req, res) => {
  const requestKeys = Object.keys(req.body)
  const allowedKeys = ["name", "password"]
  const isValid = requestKeys.every((u) => allowedKeys.includes(u))

  if (!isValid) {
    return res.status(400).send({ error: "Invalid updates!" })
  }

  try {
    const user = req.user

    requestKeys.forEach((update) => {
      // []s accesses a property dynamically.
      user[update] = req.body[update]
    })

    await user.save()

    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove()
    // sendCloseEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
