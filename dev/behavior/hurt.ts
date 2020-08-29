class Hurt implements Behavior {
    private robot:Robot
    constructor(robot:Robot) {
        this.robot = robot
    }
    update() {
        this.robot.xspeed = this.robot.yspeed = 0
    }
}