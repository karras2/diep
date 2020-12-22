let started = false;
let landingPage = {
  canvas: document.querySelector("canvas"),
  ctx: 0,
  top: -innerHeight * 0.75,
  drawGrid: function() {
    let max = innerWidth,
      ticker = max / 80;
    for (let i = 0; i < max; i += ticker) {
      this.ctx.strokeStyle = window.colors.background[1];
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, max);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(max, i);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  },
  drawBack: function() {
    let all = [];
    let shape = (x, y, shape = -1) => {
      let shapes = [
        [4, 17.5, window.colors.square], // Square
        [3, 25, window.colors.triangle], // Triangle
        [5, 35, window.colors.pentagon] // Pentagon
      ];
      let shapeData = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape !== -1) shapeData = shapes[shape];
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(Math.random());
      this.ctx.beginPath();
      for (let i = 0; i < shapeData[0]; i++) {
        let fs = Math.PI * 2;
        if (i === 0) this.ctx.moveTo(Math.cos((fs / shapeData[0]) * i) * shapeData[1], Math.sin((fs / shapeData[0]) * i) * shapeData[1]);
        else this.ctx.lineTo(Math.cos((fs / shapeData[0]) * i) * shapeData[1], Math.sin((fs / shapeData[0]) * i) * shapeData[1]);
      }
      this.ctx.closePath();
      this.ctx.fillStyle = shapeData[2][0];
      this.ctx.strokeStyle = shapeData[2][1];
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
      return [x, y, shapeData[1]];
    };
    let make = s => {
      let sizes = [17.5, 25, 35]
      let clean = true,
        pos = {
          x: 0,
          y: 0
        };
      for (let i = 0; i < 100; i++) {
        let p = {
          x: Math.floor(Math.random() * innerWidth),
          y: Math.floor(Math.random() * innerHeight)
        };
        for (let position of all) {
          var a = p.x - position[0];
          var b = p.y - position[1];
          var c = Math.sqrt(a * a + b * b);
          if (c < 100) {
            clean = false;
          }
        }
        pos = p;
        if (clean) break;
      }
      if (clean) all.push(shape(pos.x, pos.y), s);
    };
    let k = () => {
      for (let i = 0; i < 50; i++) make(Math.floor(Math.random() * 6));
      if (all.length < 50) setTimeout(k, 1);
    }
    k();
  },
  init: function() {
    document.getElementById("titleText").textContent = "Diep";
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    this.ctx.fillStyle = window.colors.background[0];
    this.ctx.fillRect(0, 0, innerWidth, innerHeight);
    this.drawGrid();
    this.drawBack();
    this.ctx.fillStyle = "#000000";
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(0, 0, innerWidth, innerHeight);
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) startGame();
    });
  }
};

window.onload = function() {
  console.log("Loaded assets.");
  landingPage.init();
};
window.addEventListener("resize", () => {
  if (!started) landingPage.init();
});

let startGame = () => {
  started = true;
  document.removeEventListener("keydown", (event) => {
    if (event.keyCode === 13) startGame();
  });
  localStorage.setItem("playername", document.getElementById("playernameinput").value || "unnamed");
  document.body.innerHTML = "";
  let script = document.createElement("script");
  script.src = "./game/app.js";
  script.type = "module";
  let css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "/style.css";
  let preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = "https://fonts.gstatic.com/%22%3E";
  let Ubuntu = document.createElement("link");
  Ubuntu.rel = "stylesheet";
  Ubuntu.href = "https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap";
  document.body.appendChild(script);
  document.body.appendChild(css);
  document.body.appendChild(preconnect);
  document.body.appendChild(Ubuntu);
  document.body.appendChild(document.createElement("canvas"));
};