import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { sockets } from './sockets/sockets'
import routes from './sockets/routes/routes'
import { client, setUpClient } from './discord/client'
import { supabase } from './supabase'
import { sessionManager } from './session'

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

if (process.env.LOGIN_BOT === 'true') {
    setUpClient()
    client.login(process.env.BOT_TOKEN)
} else {
    console.log('Skipping bot login.')
}

app.use(routes())

sockets(io)

function onRealmUpdate(payload: any) {
    const id = payload.new.id
    
    let changeMade = false

    if (JSON.stringify(payload.new.map_data) !== JSON.stringify(payload.old.map_data)) {
        changeMade = true
    }

    if (payload.new.discord_server_id !== payload.old.discord_server_id) {
        changeMade = true
    }

    if (payload.new.privacy_level !== payload.old.privacy_level) {
        changeMade = true
    }

    if (changeMade) {
        sessionManager.terminateSession(io, id, "This realm has been changed by the owner. Refresh to see what's new!")
    }
}

supabase
    .channel('realms')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'realms' }, onRealmUpdate)
    .subscribe()

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})


