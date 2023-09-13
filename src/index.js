const app = require("./app")

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is listening http://127.0.0.1:${port}`)
})
