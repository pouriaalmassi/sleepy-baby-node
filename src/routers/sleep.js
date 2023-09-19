const express = require("express")
const Sleep = require("../models/sleep")
const router = new express.Router()
const auth = require("../middleware/auth")

router.post("/sleeps", auth, async (req, res) => {
  const value = new Sleep({
    ...req.body,
    owner: req.user._id,
  })

  try {
    await value.save()
    res.status(201).send(value)
  } catch (e) {
    res.status(400) // .send(e)
  }
})

module.exports = router
