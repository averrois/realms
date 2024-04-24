import * as PIXI from 'pixi.js'

export class App {
    private initialized: boolean = false
    private app: PIXI.Application = new PIXI.Application()

    async init() {
        const container = document.getElementById('app-container')
        if (!container) {
            throw new Error('Container not found')
        }

        await this.app.init({
            resizeTo: container,
        })
        this.initialized = true
    }

    getApp() {
        if (!this.initialized) {
            throw new Error('App not initialized')
        }

        return this.app
    }

    destroy() {
        if (this.initialized) {
            this.app.destroy()
        }
    }
}