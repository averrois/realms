import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { supabase } from './supabase'

require('dotenv').config()

const app = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

io.use(async (socket, next) => {
    const access_token = socket.handshake.query.access_token as string
    if (!access_token) {
        // Reject the connection by calling next with an error.
        const error = new Error("access token is required")
        return next(error)
    } else {
        // If clientId is provided, check if valid user
        const { data: user, error: error } = await supabase.auth.getUser(access_token)

        if (error) {
            return next(new Error("Invalid access token"))
        }

        next()
    }
})

// Handle a connection
io.on('connection', (socket) => {
    console.log('connected')
})


const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})


