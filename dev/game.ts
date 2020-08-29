class Game {
    private static instance:Game
    private ui:UI
    private bg:BackGround
    private robot:Robot
    private gameObjects:GameObject[] = []
    private _gameOver:boolean = false

    public set gameOver(value:boolean) { this._gameOver = value }

    private constructor() {
        console.log("new game!")

        this.bg = new BackGround()
        this.ui = new UI()
        this.robot = new Robot()

        this.gameObjects.push(this.robot, new Can(), new Banana(), new Paprika(this.robot), new Spikes())

        this.gameLoop()
    }

    private gameLoop(){
        if(!this._gameOver) {
            // Checken op botsingen
            for(const gameObject of this.gameObjects) {
                gameObject.update()
                this.checkCollision(gameObject)
            }

            // Achtergrond laten meeschuiven
            this.bg.update()

            // Interface updaten
            this.ui.update()

            // Gameloop aan de gang houden
            requestAnimationFrame(() => this.gameLoop())
        } else {
            return
        }
    }

    private checkCollision(gameObject1:GameObject) {
        for(const gameObject2 of this.gameObjects) {
            // Check of het meegegeven gameobject een botsing heeft
            if(gameObject1.hasCollision(gameObject2)) {
                // Voer functionaliteit uit bij botsing
                gameObject1.onCollision(gameObject2)
            }
        }
    }

    public static getInstance():Game {
        if(!Game.instance) {
            Game.instance = new Game()
        }
        return Game.instance
    }

    public removeGameObject(gameObject:GameObject):void {
        let index = this.gameObjects.indexOf(gameObject)
        this.gameObjects.splice(index, 1)
        document.querySelector("game")!.removeChild(gameObject)
    }

    public addScore():void {
        this.ui.score++
    }
}

window.addEventListener("load", () => Game.getInstance())