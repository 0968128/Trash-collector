class Paprika extends GameObject implements Observer {
    constructor(robot:Robot) {
        super()

        document.querySelector("game")!.appendChild(this)

        this.x = window.innerWidth + this.clientWidth
        this.y = Math.random() * (window.innerHeight - this.clientHeight)
        this.xspeed = -1

        // Abonneer Paprika op de gebeurtenis 'robot slipt over banaan'
        robot.subscribe(this)
    }
    
    public onCollision(gameObject: GameObject): void {
        if(gameObject instanceof Robot) {
            // Verander image naar boos
            this.style.backgroundImage = "url(img/paprika-mad.png)"
            Game.getInstance().addScore()
            this.x = window.innerWidth - this.clientWidth
            this.y = Math.random() * (window.innerHeight - this.clientHeight)
        }
    }

    notify(): void {
        // Verander image naar lachend
        this.style.backgroundImage = "url(img/paprika-smile.png)"
    }
}

window.customElements.define("paprika-component", Paprika as any)