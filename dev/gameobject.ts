abstract class GameObject extends HTMLElement {
    private _x: number = 0
    private _y: number = 0
    private _scale: number = 1
    private _xspeed: number = 0
    private _yspeed: number = 0

    public get x(): number { return this._x }
    public set x(n: number) { this._x = n }
    public get y(): number { return this._y }
    public set y(n: number) { this._y = n }

    public get width() { return this.clientWidth }
    public get height() { return this.clientHeight }

    public get xspeed(): number { return this._xspeed }
    public set xspeed(n: number) { this._xspeed = n }
    public get yspeed(): number { return this._yspeed }
    public set yspeed(n: number) { this._yspeed = n }

    public get scale():number { return this._scale }
    public set scale(n:number) { this._scale = n }

    constructor() {
        super()
    }

    public update() {
        this.x += this.xspeed
        this.y += this.yspeed
        this.scale = (this.xspeed < 0) ? -1 : 1

        // Teken object op de geüpdatete plek
        this.draw()

        if(this.x < 0) {
            this.remove()
        }
    }

    private draw() {
        this.style.transform = `translate(${this._x}px, ${this._y}px) scaleX(${this._scale})`
    }

    public hasCollision(gameObject:GameObject):boolean {
        return (
        this._x < gameObject._x + gameObject.width &&
        this._x + this.width > gameObject._x &&
        this._y < gameObject._y + gameObject.height &&
        this._y + this.height > gameObject._y
        )
    }

    public abstract onCollision(gameObject:GameObject):void
}