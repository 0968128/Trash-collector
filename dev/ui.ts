class UI extends HTMLElement {
    private static instance:UI
    private bar:HTMLElement
    private scoreField:HTMLElement
    private timer:number = 100
    private _score:number = 0

    public get score() { return this._score }
    public set score(n:number) { this._score = n }

    constructor() {
        super()
        document.querySelector("game")!.appendChild(this)

        const border = document.createElement("div")
        this.bar = document.createElement("div")
        this.scoreField = document.createElement("div")

        this.appendChild(border)
        this.appendChild(this.scoreField)
        border.appendChild(this.bar)
    }
    
    public update(){
        this.timer -= 0.1
        if (this.timer <= 0) {
            Game.getInstance().gameOver = true
            this.scoreField.innerHTML = `De tijd is om. Je score is ${this.score}`
        } else {
            this.scoreField.innerHTML = `Score: ${this._score}`
        }
        this.bar.style.width = `${this.timer}%`
    }
}

window.customElements.define("ui-component", UI as any)