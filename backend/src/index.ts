import express from 'express'
import http from 'http'

require('dotenv').config()

const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3001
server.listen(3001, () => {
  console.log(`Server is running on port ${PORT}.`)
})


