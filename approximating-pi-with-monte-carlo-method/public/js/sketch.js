let radius = 200
let totalDots = 0
let insideCircle = 0
let recordPi = 0

function setup() {
    createCanvas(500, 500)
    // radius = width
    background(0)
    translate(width / 2, height / 2)

    stroke(255)
    noFill()
    rectMode(CENTER)
    rect(0, 0, radius * 2, radius * 2)

    console.log('radius in setup', radius)
    ellipse(0, 0, radius * 2)
}

function draw() {
    translate(width / 2, height / 2)
    let pi

    for (let i = 0; i < 100; i++) {
        let x = random(-radius, radius)
        let y = random(-radius, radius)

        totalDots++
        const d = float(x) * float(x) + float(y) * float(y)

        if (d < float(radius) * float(radius)) {
            insideCircle++
            stroke('red')
        } else {
            stroke('blue')
        }

        point(x, y)

        pi = 4 * (insideCircle / totalDots)
        let recordDiff = Math.abs(Math.PI - recordPi)
        let diff = Math.abs(Math.PI - pi)
        if (diff < recordDiff) {
            recordDiff = diff
            recordPi = pi
            const record = document.getElementById('record')
            record.innerHTML = `PI: ${recordPi}`
            console.log({ recordPi })
        }
    }
    // console.log(pi)
}

function isInsideCircle(pointX, pointY) {
    const pointDistance = dist(0, 0, pointX, pointY)

    if (pointDistance > radius) return true
    return false
}
