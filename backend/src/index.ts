import express from 'express'
import cors from 'cors'
import http from 'http'
import { message } from 'realms-shared/types'

require('dotenv').config()

const app = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
  console.log(message)
})


