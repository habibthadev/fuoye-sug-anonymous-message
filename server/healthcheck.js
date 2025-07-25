const http = require("http")

const options = {
  host: "localhost",
  port: process.env.PORT || 5000,
  path: "/health",
  timeout: 2000,
  date: new Date().now()
}

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

request.on("error", (err) => {
  console.log("ERROR:", err)
  process.exit(1)
})

request.end()
