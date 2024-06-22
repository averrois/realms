import { Events, Message } from 'discord.js'
import { Event } from '../events'

const event: Event = {
    name: Events.MessageCreate,
    execute(message: Message) {
        if (message.author.bot || message.system) return
        console.log('message: ', message.content)
    }
}

export default event