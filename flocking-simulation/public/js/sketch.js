let boidCount = 200
let flock = []

function setup() {
    createCanvas(900, 500)

    for (let i = 0; i < boidCount; i++) {
        flock.push(new Boid())
    }
}

function draw() {
    background(0)

    for (const boid of flock) {
        boid.show()
        // boid.connectToNeighbors(flock)
        boid.flockTogether(flock)
        boid.move()
        boid.wrapAround()
    }
    // noLoop()
}

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.velocity = p5.Vector.random2D()
        // this.velocity.setMag(random(2, 3))
        this.acceleration = createVector(0, 0)
        this.maxForce = 0.2
        this.maxSpeed = 2
        this.perceptionRange = 40
        this.radius = 4
    }

    show() {
        stroke(255)
        strokeWeight(2)
        point(this.position.x, this.position.y)
    }

    move() {
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        this.velocity.limit(this.maxSpeed)
        this.acceleration.mult(0)
    }

    flockTogether(allBoids) {
        const alignment = this.alignment(allBoids)
        const cohesion = this.cohesion(allBoids)
        const separation = this.separation(allBoids)
        this.acceleration.add(alignment)
        this.acceleration.add(cohesion)
        this.acceleration.add(separation)
    }

    alignment(allBoids) {
        const steeringForce = createVector()
        const neighbors = this.findNeighbors(allBoids)

        for (const neighbor of neighbors) {
            steeringForce.add(neighbor.velocity)
        }
        if (neighbors.length > 0) {
            steeringForce.div(neighbors.length)
            steeringForce.setMag(this.maxSpeed)
            steeringForce.sub(this.velocity)
            steeringForce.limit(this.maxForce)
        }
        return steeringForce
    }

    cohesion(allBoids) {
        const steeringForce = createVector()
        const neighbors = this.findNeighbors(allBoids)

        for (const neighbor of neighbors) {
            steeringForce.add(neighbor.position)
        }
        if (neighbors.length > 0) {
            steeringForce.div(neighbors.length)
            steeringForce.sub(this.position)
            steeringForce.setMag(this.maxSpeed)
            steeringForce.sub(this.velocity)
            steeringForce.limit(this.maxForce)
        }
        return steeringForce
    }

    separation(allBoids) {
        const separationForce = createVector()
        const neighbors = this.findNeighbors(allBoids)

        for (const neighbor of neighbors) {
            const distanceDifference = p5.Vector.sub(
                this.position,
                neighbor.position
            )
            separationForce.add(distanceDifference)
        }
        if (neighbors.length > 0) {
            separationForce.div(neighbors.length)
            separationForce.setMag(this.maxSpeed)
            separationForce.sub(this.velocity)
            separationForce.limit(this.maxForce)
        }
        return separationForce
    }

    wrapAround() {
        if (this.position.x > width) this.position.x = 0
        if (this.position.x < 0) this.position.x = width
        if (this.position.y > height) this.position.y = 0
        if (this.position.y < 0) this.position.y = height
    }

    showPerceptionRange() {
        stroke(255, 50)
        noFill()
        strokeWeight(1)
        ellipse(this.position.x, this.position.y, this.perceptionRange * 2)
    }

    findNeighbors(allBoids) {
        const neighbors = []
        for (const boid of allBoids) {
            const distance = dist(
                this.position.x,
                this.position.y,
                boid.position.x,
                boid.position.y
            )
            if (boid !== this && distance < this.perceptionRange) {
                neighbors.push(boid)
            }
        }
        return neighbors
    }

    connectToNeighbors(allBoids) {
        const neighbors = this.findNeighbors(allBoids)
        for (const neighbor of neighbors) {
            stroke(0, 255, 0, 60)
            strokeWeight(1)
            line(
                this.position.x,
                this.position.y,
                neighbor.position.x,
                neighbor.position.y
            )
        }
    }
}
