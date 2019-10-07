// velocity of ball
let v
// position of ball
let x
// radius of ball
let r = 20.0
// coefficient of restitution
let e = 0.8
// center of box
let center
// size of box
let size = 200.0
// num of lines
let num = 6
// lines of box
let lines
// angle of box
let angle = 0
// angle increment rate
let angle_delta = 0.05

// Master volume in decibels
const volume = -16;
// The synth we'll use for audio
let synth;

let notes = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B'
]

function setup() {
  createCanvas(windowWidth, windowHeight)

  noStroke()
  background(0)

  // vector initialization
  v = createVector(0, 10.0)
  x = createVector(width/2, height/2)
  g = createVector(0, 0.9)

  // center of box
  center = createVector(width/2, height/2)

  lines = center2box(center, size, angle, num)

    // Make the volume quieter
    Tone.Master.volume.value = volume;

    // Setup a synth with ToneJS
    synth = new Tone.FMSynth ({
        harmonicity : 1 ,
        modulationIndex : 10 ,
        detune : 0 ,
        oscillator : {
        type : 'sine'
      },
        envelope : {
        attack : 0.01 ,
        decay : 0.01 ,
        sustain : 1 ,
        release : 0.5
      },
        modulation : {
        type : 'sine'
      },
        modulationEnvelope : {
        attack : 0.01 ,
        decay : 0.01 ,
        sustain : 1 ,
        release : 0.5
      }
    });
  
    // Wire up our nodes:
    // synth->master
    synth.connect(Tone.Master);
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
  
  lines = center2box(center, size, angle, num)

  for (i = 0; i < num; i++) {
    line(lines[i][0].x, lines[i][0].y, lines[i][1].x, lines[i][1].y)
  }

  // synth
  //synth.harmonicity.value = 2*x.x/width
  synth.modulationIndex.value = 10*x.y/height

  step()
}

function step() {
  // update position
  x = p5.Vector.add(x, v)

  // collision
  for (i = 0; i < num; i++) {
    if (ishit(p5.Vector.add(x,v), r, lines[i])) {
      k = bounce(lines[i])
      play(k, i)
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

  return k
}

function center2box(center, size, theta, num) {
  size = sqrt(2)*size

  lines = []

  for (i = 0; i < num; i++) {
    angle1 = (2*i+1)*PI/num+theta
    angle2 = (2*i+3)*PI/num+theta

    lines[i] = [
      createVector(cos(angle1), sin(angle1)).mult(size).add(center),
      createVector(cos(angle2), sin(angle2)).mult(size).add(center)
    ]
  }

  return lines
}

function play(k, i) {
  synth.triggerAttackRelease(notes[ Math.round((k)*12) % 12 ]+'4', 0.5);
}

function mousePressed() {
  setup()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
