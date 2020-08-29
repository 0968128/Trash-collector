class Spinning implements Behavior {
    private counter:number = 0
    private robot:Robot
    constructor(robot:Robot) {
        this.robot = robot
    }
    update():void {
        this.counter++
        this.robot.xspeed = Math.sin(this.counter/5) * 10 
        this.robot.yspeed = Math.random() * 2
    }
}