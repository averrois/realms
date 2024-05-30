import { App } from './App'

export class PlayApp extends App {

    private scale: number = 1.5

    public async init() {
        await super.init()
        await this.loadRoom(this.realmData.spawnpoint.roomIndex)
        this.setScale(this.scale)
    }

    private setScale(newScale: number) {
        this.scale = newScale
        this.app.stage.scale.set(this.scale)
    }
}