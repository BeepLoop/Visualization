let points = []
let i = 1

function setup() {
    createCanvas(600, 600)
    // frameRate(30)
    for (let i = 0; i < 50; i++) {
        if (i === 0) {
            points.push(new Point('purple'))
        }
        points.push(new Point())
    }
}

function draw() {
    background(0)
    translate(width / 2, height / 2)

    for (const point of points) {
        point.show()
    }

    if (i > points.length - 1) {
        points[0].locateTarget(points[0].closestPoint)
        i = 0
        noLoop()
    }
    if (i > 0) {
        points[0].connect(points[i])
    }
    i++
}

class Point {
    constructor(pointColor, lineColor) {
        this.position = createVector(
            random(-width / 2, width / 2),
            random(-height / 2, height / 2)
        )
        this.size = 6
        this.pointColor = pointColor || 'green'
        this.lineWeight = 1
        this.lineColor = lineColor || 'orange'
        this.shortestPath = Infinity
        this.closestPoint = null
    }

    show() {
        stroke(this.pointColor)
        strokeWeight(this.size)
        point(this.position.x, this.position.y)
    }

    update() {
        this.position = createVector(random(0, width), random(0, height))
        this.show()
    }

    locateTarget(point) {
        strokeWeight(1)
        stroke('red')
        noFill()
        rectMode(CENTER)
        rect(point.position.x, point.position.y, this.size * 2, this.size * 2)
    }

    connect(point) {
        stroke(this.lineColor)
        strokeWeight(this.lineWeight)
        line(
            this.position.x,
            this.position.y,
            point.position.x,
            point.position.y
        )
        const distance = dist(
            this.position.x,
            this.position.y,
            point.position.x,
            point.position.y
        )
        if (distance <= this.shortestPath) {
            this.shortestPath = distance
            this.closestPoint = point
            // this.locateTarget(this.closestPoint)
        }
    }
}
