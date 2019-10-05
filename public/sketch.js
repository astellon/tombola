// velocity of ball
let v
// position of ball
let x
// radius of ball
let r = 20
// speed factor
let delta = 0.5
// coefficient of restitution
let e = 1
// center of box
let center
// lines of box
let lines
// angle of box
let angle

function setup() {
  createCanvas(windowWidth, windowHeight)

  noStroke()
  background(0)

  v = createVector(0, 10)
  x = createVector(width/2, height/2)
  g = createVector(0, 0.9)

  center = createVector(width/2, height/2)

  angle = 0
  angle_delta = 0.01
  lines = center2box(center, 100, angle)
}

function draw() {
  background(0)

  // setting for rendering ball
  noFill()
  strokeWeight(2)
  stroke(255)
  
  circle(x.x, x.y, r)

  // angle increment
  angle += angle_delta
  angle = angle > 2*PI ? angle - 2*PI : angle
  
  lines = center2box(center, 150, angle)

  for (i = 0; i < 4; i++) {
    line(lines[i][0].x, lines[i][0].y, lines[i][1].x, lines[i][1].y)
  }

  step()
}

function step() {
  v = p5.Vector.add(v, g)
  x = p5.Vector.add(x, p5.Vector.mult(v, delta))

  for (i = 0; i < 4; i++) {
    if (ishit(x, r, lines[i])) {
      bounce(lines[i])
    }
  }
  
}

function ishit(ball, r, l) {
  thres = r + 5
  po = p5.Vector.sub(ball, l[0])     // line start to ball
  pq = p5.Vector.sub(l[1], l[0])  // line direction
  popq = p5.Vector.dot(po, pq)
  ph = (popq * popq)/p5.Vector.dot(pq, pq)
  len = p5.Vector.dot(po, po) - ph
  return len < thres*thres
}

function bounce(l) {
  d = p5.Vector.sub(l[1], l[0])  // line direction
  n = createVector(d.y, -d.x)
  vp = p5.Vector.mult(d, p5.Vector.dot(d, v)/d.magSq())  // parallel
  vv = p5.Vector.mult(n, p5.Vector.dot(n, v)/n.magSq())  // vertical
  v  = p5.Vector.add(vp, p5.Vector.mult(vv, -e))
}

function center2box(center, size, theta) {
  size = sqrt(2)*size

  lines = []

  for (i = 0; i < 4; i++) {
    angle1 = (2*i+1)*PI/4+theta
    angle2 = (2*i+3)*PI/4+theta

    lines[i] = [
      createVector(cos(angle1), sin(angle1)).mult(size).add(center),
      createVector(cos(angle2), sin(angle2)).mult(size).add(center)
    ]
  }

  return lines
}

function mousePressed() {
  setup()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
