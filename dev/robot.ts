class Robot extends GameObject implements Subject {
    private observers:Observer[] = []
    private behavior:Behavior = new Rolling(this)

    constructor(){
        super()
        document.querySelector("game")!.appendChild(this)

        this.x = window.innerWidth/4
        this.y = window.innerHeight/2
    }

    public update(): void{
        this.behavior.update(this)
        super.update()
    }

    public onKeyDown(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case "A":
            case "ARROWLEFT":
                this.xspeed = -5
                break
            case "D":
            case "ARROWRIGHT":
                this.xspeed = 5
                break
            case "W":
            case "ARROWUP":
                this.yspeed = -5
                break
            case "S":
            case "ARROWDOWN":
                this.yspeed = 5
                break
        }
    }

    public onKeyUp(e: KeyboardEvent): void {
        switch (e.key.toUpperCase()) {
            case "A":
            case "D":
            case "ARROWLEFT":
            case "ARROWRIGHT":
                this.xspeed = 0
                break
            case "W":
            case "S":
            case "ARROWUP":
            case "ARROWDOWN":
                this.yspeed = 0
                break
        }
    }

    public onCollision(gameObject: GameObject): void {
        if(gameObject instanceof Banana) {
            this.notifyObservers()

            // Verander gedrag naar tollend
            this.behavior = new Spinning(this)

            // Verander terug na een tijdje
            setTimeout(() => {
                this.behavior = new Rolling(this)
            }, 2000)
        } else if(gameObject instanceof Spikes) {
            // Verander gedrag naar pijngedaan
            this.behavior = new Hurt(this)
            this.style.filter = `hue-rotate(150deg)`

            // Verander terug na een tijdje
            setTimeout(() => {
                this.behavior = new Rolling(this)
                this.style.filter = `hue-rotate(0deg)`
            }, 2000)
        }
    }

    subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    unsubscribe(observer: Observer): void {
        let index = this.observers.indexOf(observer)
        this.observers.splice(index, 1)
    }

    notifyObservers(): void {
        for(const observer of this.observers) {
            observer.notify()
        }
    }
}

window.customElements.define("robot-component", Robot as any)