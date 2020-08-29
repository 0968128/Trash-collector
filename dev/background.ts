class BackGround extends HTMLElement {

    private scrolled : number = 0

    constructor() {
        super()
        document.querySelector("game")!.appendChild(this)
    }

    public update(){
        this.scrolled--
        this.style.backgroundPosition = `${this.scrolled}px 0px`
    }
}

window.customElements.define("background-component", BackGround as any)