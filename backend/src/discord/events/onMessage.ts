import { Events, Message } from 'discord.js'
import { Event } from '../events'

const event: Event = {
    name: Events.MessageCreate,
    execute(message: Message) {
        
    }
}

export default event