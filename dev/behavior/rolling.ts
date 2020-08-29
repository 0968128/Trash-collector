class Rolling implements Behavior {
    private robot:Robot
    constructor(robot:Robot) {
        this.robot = robot
        this.robot.xspeed = 0
        this.robot.yspeed = 0
    }
    update() {
        window.addEventListener("keydown", (e: KeyboardEvent) => this.robot.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.robot.onKeyUp(e))
    }
}