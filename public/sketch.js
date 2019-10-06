// velocity of ball
let v
// position of ball
let x
// radius of ball
let r = 20.0
// coefficient of restitution
let e = 0.6
// center of box
let center
// size of box
let size = 200.0
// lines of box
let lines
// angle of box
let angle = 0
// angle increment rate
let angle_delta = 0.03

function setup() {
  createCanvas(windowWidth, windowHeight)

  noStroke()
  background(0)

  // vector initialization
  v = createVector(0, 10.0)
  x = createVector(width/2, height/2)
  g = createVector(0, 0.1)

  // center of box
  center = createVector(width/2, height/2)

  lines = center2box(center, size, angle)
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
  
  lines = center2box(center, size, angle)

  for (i = 0; i < 4; i++) {
    line(lines[i][0].x, lines[i][0].y, lines[i][1].x, lines[i][1].y)
  }

  step()
}

function step() {
  // update position
  x = p5.Vector.add(x, v)

  // collision
  for (i = 0; i < 4; i++) {
    if (ishit(p5.Vector.add(x,v), r, lines[i])) {
      bounce(lines[i])
    }
  }
  
  // update velocity
  v = p5.Vector.add(v, g)  
}

function ishit(ball, r, l) {
  pq = p5.Vector.sub(l[1], l[0])

  k = p5.Vector.dot(pq, p5.Vector.sub(ball, l[0]))/pq.magSq()

  if (k < 0 || 1 < k) {
    return false  // out of line
  }

  prod = p5.Vector.mult(pq, k)

  po = p5.Vector.sub(ball, l[0])  // line start to ball
  len = p5.Vector.dot(po, po) - prod.magSq()

  return len <= r*r
}

function bounce(l) {
  d = p5.Vector.sub(l[1], l[0])  // line direction
  n = createVector(d.y, -d.x)
  vp = p5.Vector.mult(d, p5.Vector.dot(d, v)/d.magSq())  // parallel
  vv = p5.Vector.mult(n, p5.Vector.dot(n, v)/n.magSq())  // vertical
  vv = p5.Vector.mult(vv, -e)
  v  = p5.Vector.add(vp, vv)  // reflect
  
  gv = p5.Vector.mult(n, -1*p5.Vector.dot(n, g)/n.magSq())

  v = p5.Vector.add(v, gv)

  k = p5.Vector.dot(d, p5.Vector.sub(x, l[0]))/d.magSq()
  if (1/2 < k && k < 1) {
    ph = p5.Vector.mult(d, p5.Vector.dot(d, p5.Vector.sub(x, l[0]))/d.magSq())
    h = p5.Vector.add(l[0], prod)

    ro = p5.Vector.cross(createVector(0,0,angle_delta*1.5), p5.Vector.sub(h, center))
    rov = p5.Vector.mult(n, p5.Vector.dot(n, ro)/n.magSq())

    v = p5.Vector.add(v, rov)
  }
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
