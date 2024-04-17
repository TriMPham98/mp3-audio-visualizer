var song;
var fft;
var particles = [];

var songPlaying = false;
var songStarted = false;

function preload() {
  song = loadSound("./files/music/chasingDreamsBen.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  fft = new p5.FFT();
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(6.9);
  noFill();

  translate(width / 2, height / 2);

  fft.analyze();
  amp = fft.getEnergy(20, 200);

  var wave = fft.waveform();

  for (var t = -1; t <= 1; t += 2) {
    beginShape();
    for (var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1));

      var r = map(wave[index], -1, 1, 150, 350);

      var x = r * sin(i) * t;
      var y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  if (songPlaying) {
    for (var i = 0; i < 5; i++) {
      var p = new Particle();
      particles.push(p);
      // particles.push(p);
    }
  }

  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      if (songPlaying || songStarted) {
        particles[i].update(amp > 218); // Threshold for particle velocity boost
      }
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
    songPlaying = false;
  } else {
    song.play();
    loop();
    songPlaying = true;
    songStarted = true;
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));

    this.w = random(3, 10);

    this.color = [random(0, 255), random(0, 255), random(220, 255)];
  }
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}

// TODO: Add event listener for full screen on f key press