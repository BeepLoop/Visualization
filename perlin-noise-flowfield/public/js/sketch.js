let increment = 0.1
let scale = 20
let cols, rows
let zOff = 0
let particleCount = 1000
let particles = []
let flowField

function setup() {
    createCanvas(900, 500)
    cols = floor(width / scale)
    rows = floor(height / scale)
    flowField = new Array(rows * cols)

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(random(255), random(255), random(255)))
    }
    background(255)
}

function draw() {
    randomSeed()
    let yOff = 0
    for (let y = 0; y < rows; y++) {
        let xOff = 0
        for (let x = 0; x < cols; x++) {
            let index = x + y * cols
            let angle = noise(xOff, yOff, zOff) * TWO_PI * 4
            let vector = p5.Vector.fromAngle(angle)
            vector.setMag(0.4)
            flowField[index] = vector
            xOff += increment

            // stroke(0, 80)
            // strokeWeight(1)
            // push()
            // translate(x * scale, y * scale)
            // rotate(vector.heading())
            // line(0, 0, scale, 0)
            // pop()
        }
        yOff += increment
        zOff += 0.0001
    }

    for (const particle of particles) {
        particle.update()
        particle.show()
        particle.wrapAround()
        particle.follow(flowField)
    }
}

class Particle {
    constructor(r, g, b) {
        this.position = createVector(random(width), random(height))
        this.prevPosition = this.position.copy()
        this.velocity = createVector(0, 0)
        this.acceleration = createVector(0, 0)
        this.maxSpeed = 2
        this.size = 1
        this.r = r
        this.g = g
        this.b = b
        this.alpha = 10
    }

    update() {
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
        this.position.add(this.velocity)
        this.acceleration.mult(0)
    }

    applyForce(force) {
        this.acceleration.add(force)
    }

    show() {
        stroke(this.r, this.g, this.b, this.alpha)
        strokeWeight(this.size)
        // point(this.position.x, this.position.y)
        line(
            this.position.x,
            this.position.y,
            this.prevPosition.x,
            this.prevPosition.y
        )
        this.updatePrev()
    }

    follow(flowFieldVectors) {
        const x = floor(this.position.x / scale)
        const y = floor(this.position.y / scale)
        const index = x + y * cols
        const force = flowFieldVectors[index]
        this.applyForce(force)
    }

    wrapAround() {
        if (this.position.x > width) {
            this.position.x = 0
            this.updatePrev()
        }
        if (this.position.x < 0) {
            this.position.x = width
            this.updatePrev()
        }
        if (this.position.y > height) {
            this.position.y = 0
            this.updatePrev()
        }
        if (this.position.y < 0) {
            this.position.y = height
            this.updatePrev()
        }
    }

    updatePrev() {
        this.prevPosition.x = this.position.x
        this.prevPosition.y = this.position.y
    }
}
