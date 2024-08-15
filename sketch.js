let song;
let fft;
let particles = [];

let songPlaying = false;
let songStarted = false;
let startButton;

function preload() {
  const audioPath =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "./public/music/chasingDreamsBen.mp3"
      : "/public/music/chasingDreamsBen.mp3";

  song = loadSound(
    audioPath,
    () => console.log("Audio loaded successfully"),
    (err) => console.error("Error loading audio:", err)
  );
  console.log("Audio preload attempted");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  fft = new p5.FFT();

  startButton = createButton("Start Audio");
  startButton.position(10, 10);
  startButton.mousePressed(startAudio);

  console.log("Setup complete");

  if (!song) {
    console.error("Song not loaded in setup");
  }
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(6.9);
  noFill();

  translate(width / 2, height / 2);

  fft.analyze();
  let amp = fft.getEnergy(20, 200);

  let wave = fft.waveform();

  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1));

      let r = map(wave[index], -1, 1, 150, 350);

      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  if (songPlaying) {
    for (let i = 0; i < 5; i++) {
      let p = new Particle();
      particles.push(p);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      if (songPlaying || songStarted) {
        particles[i].update(amp > 218);
      }
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

function mouseClicked() {
  if (song && song.isLoaded()) {
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
  } else {
    console.log("Song not loaded yet or song object is null");
  }
}

function startAudio() {
  if (song && song.isLoaded()) {
    if (!song.isPlaying()) {
      song.play();
      songPlaying = true;
      songStarted = true;
      loop();
    }
  } else {
    console.log("Song not loaded yet");
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Initialize p5 when the window loads
window.addEventListener("load", function () {
  new p5();
  console.log("p5 initialized");
});
