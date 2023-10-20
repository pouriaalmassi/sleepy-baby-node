const app = require("./app")

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server started.`)
  console.log(`MONGODB_URL: ${MONGODB_URL}`)
})
