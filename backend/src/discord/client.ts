import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { events } from './events'
import { commands } from './commands'

interface ExtendedClient extends Client {
  commands?: Collection<unknown, unknown>;
}

const client: ExtendedClient = new Client({ intents: GatewayIntentBits.Guilds })

function setUpClient() {
    client.commands = new Collection()
    for (const command of commands) {
        client.commands.set(command.data.name, command)
    }

    for (const event of events) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }

    }
}

export { client, setUpClient }