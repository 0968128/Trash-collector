/// <reference path="gameobject.ts"/>

class Banana extends GameObject {
    constructor() {
        super()

        document.querySelector("game")!.appendChild(this)

        this.x = window.innerWidth + this.clientWidth
        this.y = Math.random() * (window.innerHeight - this.clientHeight)
        this.xspeed = -1
    }

    public onCollision(gameObject: GameObject): void {
        if(gameObject instanceof Robot) {
            Game.getInstance().addScore()
            this.x = window.innerWidth - this.clientWidth
            this.y = Math.random() * (window.innerHeight - this.clientHeight)
        }
    }
}

window.customElements.define("banana-component", Banana as any)