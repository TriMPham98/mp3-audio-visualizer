var song
var fft

function preload() {
  song = loadSound('PursuitOfHappinessInstrumental.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
}

function draw() {
  background(0);
  stroke(255);

  var wave = fft.waveform()

  for (var i = 0; i < width; i++) {
    var index = floor(map(i, 0, width, 0, wave.length));

    var x = i;
    var y = wave[index] * 300 + height / 2;
    point(x, y);
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}