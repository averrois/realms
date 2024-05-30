import { App } from './App'
import { Player } from './Player/Player'
import { RealmData } from './types'

export class PlayApp extends App {

    private scale: number = 2
    private player: Player

    constructor(realmData: RealmData, skin: string = '001') {
        super(realmData)
        this.player = new Player(skin, true)
    }

    public async init() {
        await super.init()
        await this.loadRoom(this.realmData.spawnpoint.roomIndex)
        this.setScale(this.scale)
        this.app.renderer.on('resize', this.resizeEvent)

        await this.player.loadAnimations()
        this.player.setPosition(this.realmData.spawnpoint.x, this.realmData.spawnpoint.y)
        this.layers.object.addChild(this.player.parent)
        this.moveCameraToPlayer()
    }
    private setScale = (newScale: number) => {
        this.scale = newScale
        this.app.stage.scale.set(this.scale)
    }

    private moveCameraToPlayer = () => {
        const x = Math.round(this.player.parent.x - (this.app.screen.width / 2) / this.scale)
        const y = Math.round(this.player.parent.y - (this.app.screen.height / 2) / this.scale)
        this.app.stage.pivot.set(x, y)
    }

    private resizeEvent = () => {
        this.moveCameraToPlayer()
    }
}