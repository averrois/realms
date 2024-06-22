import ready from './events/ready'
import interactionCreate from './events/interactionCreate'
import onMessage from './events/onMessage'
import onLeaveServer from './events/onLeaveServer'

export type Event = {
    name: string,
    once?: boolean,
    execute: Function
}

export const events: Event[] = [
    ready,
    interactionCreate,
    onMessage,
    onLeaveServer,
]
