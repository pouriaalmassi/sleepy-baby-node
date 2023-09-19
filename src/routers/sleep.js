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
    res.status(400)
  }
})

router.get("/sleeps", auth, async (req, res) => {
  const match = {}
  const sort = {}

  // TODO left off the `completed` matching

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":")
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1
  }

  try {
    await req.user.populate({
      path: "sleeps",
      match: match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
  } catch (e) {
    console.log(`Error: ${e}`)
    res.status(500).send()
  }
})

module.exports = router
