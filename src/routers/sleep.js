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

router.patch("/sleeps/:id", auth, async (req, res) => {
  const requestKeys = Object.keys(req.body)
  const allowedKeys = ["startDate", "endDate"]
  const isValid = requestKeys.every((k) => allowedKeys.includes(k))

  if (!isValid) {
    return res.status(400).send({ error: "Invalid update!" })
  }

  try {
    const sleep = await Sleep.findOne({ _id: req.params.id, owner: req.user._id })

    if (!sleep) {
      return res.status(404).send()
    }

    requestKeys.forEach((update) => (sleep[update] = req.body[update]))

    await sleep.save()

    res.send(sleep)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get("/sleeps", auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":")
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1
  }

  try {
    await req.user.populate({
      path: "sleeps",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    }).execPopulate()

    res.send({ "sleeps": req.user.sleeps })
  } catch (e) {
    console.log(`Error: ${e}`)
    res.status(500).send()
  }
})

router.delete("/sleeps/:id", auth, async (req, res) => {
  try {
    const sleep = await Sleep.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!sleep) {
      return res.status(404).send()
    }

    res.send()
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router
