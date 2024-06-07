import io from 'socket.io-client'

const backend_url: string = process.env.NEXT_PUBLIC_BACKEND_URL as string

export class Netcode {
    public socket

    constructor(access_token: string) {
        this.socket = io(backend_url, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                query: {
                    access_token
                }
            }
        )
    }
}