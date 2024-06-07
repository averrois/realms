import io from 'socket.io-client'

const backend_url: string = process.env.NEXT_PUBLIC_BACKEND_URL as string

export class Netcode {
    public socket: any

    public async connect(access_token: string) {
        this.socket = io(backend_url, {
                reconnection: true,
                autoConnect: false,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                query: {
                    access_token
                }
            }
        )

        await this.socket.connect()
    }
}

const netcode = new Netcode()

export { netcode }