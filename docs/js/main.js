"use strict";
class BackGround extends HTMLElement {
    constructor() {
        super();
        this.scrolled = 0;
        document.querySelector("game").appendChild(this);
    }
    update() {
        this.scrolled--;
        this.style.backgroundPosition = `${this.scrolled}px 0px`;
    }
}
window.customElements.define("background-component", BackGround);
class GameObject extends HTMLElement {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._scale = 1;
        this._xspeed = 0;
        this._yspeed = 0;
    }
    get x() { return this._x; }
    set x(n) { this._x = n; }
    get y() { return this._y; }
    set y(n) { this._y = n; }
    get width() { return this.clientWidth; }
    get height() { return this.clientHeight; }
    get xspeed() { return this._xspeed; }
    set xspeed(n) { this._xspeed = n; }
    get yspeed() { return this._yspeed; }
    set yspeed(n) { this._yspeed = n; }
    get scale() { return this._scale; }
    set scale(n) { this._scale = n; }
    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
        this.scale = (this.xspeed < 0) ? -1 : 1;
        this.draw();
        if (this.x < 0) {
            this.remove();
        }
    }
    draw() {
        this.style.transform = `translate(${this._x}px, ${this._y}px) scaleX(${this._scale})`;
    }
    hasCollision(gameObject) {
        return (this._x < gameObject._x + gameObject.width &&
            this._x + this.width > gameObject._x &&
            this._y < gameObject._y + gameObject.height &&
            this._y + this.height > gameObject._y);
    }
}
class Banana extends GameObject {
    constructor() {
        super();
        document.querySelector("game").appendChild(this);
        this.x = window.innerWidth + this.clientWidth;
        this.y = Math.random() * (window.innerHeight - this.clientHeight);
        this.xspeed = -1;
    }
    onCollision(gameObject) {
        if (gameObject instanceof Robot) {
            Game.getInstance().addScore();
            this.x = window.innerWidth - this.clientWidth;
            this.y = Math.random() * (window.innerHeight - this.clientHeight);
        }
    }
}
window.customElements.define("banana-component", Banana);
class Can extends GameObject {
    constructor() {
        super();
        document.querySelector("game").appendChild(this);
        this.x = window.innerWidth + this.clientWidth;
        this.y = Math.random() * (window.innerHeight - this.clientHeight);
        this.xspeed = -1;
    }
    onCollision(gameObject) {
        if (gameObject instanceof Robot) {
            Game.getInstance().addScore();
            this.x = window.innerWidth - this.clientWidth;
            this.y = Math.random() * (window.innerHeight - this.clientHeight);
        }
    }
}
window.customElements.define("can-component", Can);
class Game {
    constructor() {
        this.gameObjects = [];
        this._gameOver = false;
        console.log("new game!");
        this.bg = new BackGround();
        this.ui = new UI();
        this.robot = new Robot();
        this.gameObjects.push(this.robot, new Can(), new Banana(), new Paprika(this.robot), new Spikes());
        this.gameLoop();
    }
    set gameOver(value) { this._gameOver = value; }
    gameLoop() {
        if (!this._gameOver) {
            for (const gameObject of this.gameObjects) {
                gameObject.update();
                this.checkCollision(gameObject);
            }
            this.bg.update();
            this.ui.update();
            requestAnimationFrame(() => this.gameLoop());
        }
        else {
            return;
        }
    }
    checkCollision(gameObject1) {
        for (const gameObject2 of this.gameObjects) {
            if (gameObject1.hasCollision(gameObject2)) {
                gameObject1.onCollision(gameObject2);
            }
        }
    }
    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    removeGameObject(gameObject) {
        let index = this.gameObjects.indexOf(gameObject);
        this.gameObjects.splice(index, 1);
        document.querySelector("game").removeChild(gameObject);
    }
    addScore() {
        this.ui.score++;
    }
}
window.addEventListener("load", () => Game.getInstance());
class Paprika extends GameObject {
    constructor(robot) {
        super();
        document.querySelector("game").appendChild(this);
        this.x = window.innerWidth + this.clientWidth;
        this.y = Math.random() * (window.innerHeight - this.clientHeight);
        this.xspeed = -1;
        robot.subscribe(this);
    }
    onCollision(gameObject) {
        if (gameObject instanceof Robot) {
            this.style.backgroundImage = "url(img/paprika-mad.png)";
            Game.getInstance().addScore();
            this.x = window.innerWidth - this.clientWidth;
            this.y = Math.random() * (window.innerHeight - this.clientHeight);
        }
    }
    notify() {
        this.style.backgroundImage = "url(img/paprika-smile.png)";
    }
}
window.customElements.define("paprika-component", Paprika);
class Robot extends GameObject {
    constructor() {
        super();
        this.observers = [];
        this.behavior = new Rolling(this);
        document.querySelector("game").appendChild(this);
        this.x = window.innerWidth / 4;
        this.y = window.innerHeight / 2;
    }
    update() {
        this.behavior.update(this);
        super.update();
    }
    onKeyDown(e) {
        switch (e.key.toUpperCase()) {
            case "A":
            case "ARROWLEFT":
                this.xspeed = -5;
                break;
            case "D":
            case "ARROWRIGHT":
                this.xspeed = 5;
                break;
            case "W":
            case "ARROWUP":
                this.yspeed = -5;
                break;
            case "S":
            case "ARROWDOWN":
                this.yspeed = 5;
                break;
        }
    }
    onKeyUp(e) {
        switch (e.key.toUpperCase()) {
            case "A":
            case "D":
            case "ARROWLEFT":
            case "ARROWRIGHT":
                this.xspeed = 0;
                break;
            case "W":
            case "S":
            case "ARROWUP":
            case "ARROWDOWN":
                this.yspeed = 0;
                break;
        }
    }
    onCollision(gameObject) {
        if (gameObject instanceof Banana) {
            this.notifyObservers();
            this.behavior = new Spinning(this);
            setTimeout(() => {
                this.behavior = new Rolling(this);
            }, 2000);
        }
        else if (gameObject instanceof Spikes) {
            this.behavior = new Hurt(this);
            this.style.filter = `hue-rotate(150deg)`;
            setTimeout(() => {
                this.behavior = new Rolling(this);
                this.style.filter = `hue-rotate(0deg)`;
            }, 2000);
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        let index = this.observers.indexOf(observer);
        this.observers.splice(index, 1);
    }
    notifyObservers() {
        for (const observer of this.observers) {
            observer.notify();
        }
    }
}
window.customElements.define("robot-component", Robot);
class Spikes extends GameObject {
    constructor() {
        super();
        document.querySelector("game").appendChild(this);
        this.x = window.innerWidth + this.clientWidth;
        this.y = Math.random() * (window.innerHeight - this.clientHeight);
        this.xspeed = -1;
    }
    onCollision(gameObject) {
        if (gameObject instanceof Robot) {
            Game.getInstance().addScore();
            this.x = window.innerWidth - this.clientWidth;
            this.y = Math.random() * (window.innerHeight - this.clientHeight);
        }
    }
}
window.customElements.define("spikes-component", Spikes);
class UI extends HTMLElement {
    constructor() {
        super();
        this.timer = 100;
        this._score = 0;
        document.querySelector("game").appendChild(this);
        const border = document.createElement("div");
        this.bar = document.createElement("div");
        this.scoreField = document.createElement("div");
        this.appendChild(border);
        this.appendChild(this.scoreField);
        border.appendChild(this.bar);
    }
    get score() { return this._score; }
    set score(n) { this._score = n; }
    update() {
        this.timer -= 0.1;
        if (this.timer <= 0) {
            Game.getInstance().gameOver = true;
            this.scoreField.innerHTML = `De tijd is om. Je score is ${this.score}`;
        }
        else {
            this.scoreField.innerHTML = `Score: ${this._score}`;
        }
        this.bar.style.width = `${this.timer}%`;
    }
}
window.customElements.define("ui-component", UI);
class Hurt {
    constructor(robot) {
        this.robot = robot;
    }
    update() {
        this.robot.xspeed = this.robot.yspeed = 0;
    }
}
class Rolling {
    constructor(robot) {
        this.robot = robot;
        this.robot.xspeed = 0;
        this.robot.yspeed = 0;
    }
    update() {
        window.addEventListener("keydown", (e) => this.robot.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.robot.onKeyUp(e));
    }
}
class Spinning {
    constructor(robot) {
        this.counter = 0;
        this.robot = robot;
    }
    update() {
        this.counter++;
        this.robot.xspeed = Math.sin(this.counter / 5) * 10;
        this.robot.yspeed = Math.random() * 2;
    }
}
//# sourceMappingURL=main.js.map