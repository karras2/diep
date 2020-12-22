// Import utilities
import * as Class from "/game/entities.js";
console.log(Class);

// Set up canvas
let canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let ctx = canvas.getContext("2d");

// Player object
let player = {
  mouse: {
    x: 0,
    y: 0,
    a: false,
    b: false
  },
  inputs: {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false,
    c: false,
    k: false
  },
  body: {
    x: 0,
    y: 0
  },
  camera: {
    x: 0,
    y: 0
  }
};

// Event listeners...
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

document.addEventListener("keydown", (event) => {
  switch(event.keyCode) {
    case 87: case 38:
      player.inputs.w = true;
      break;
    case 65: case 37:
      player.inputs.a = true;
      break;
    case 83: case 40:
      player.inputs.s = true;
      break;
    case 68: case 39:
      player.inputs.d = true;
      break;
    case 69:
      player.inputs.e = true;
      break;
    case 67:
      player.inputs.c = false;
      break;
    case 75:
      player.inputs.k = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch(event.keyCode) {
    case 87: case 38:
      player.inputs.w = false;
      break;
    case 65: case 37:
      player.inputs.a = false;
      break;
    case 83: case 40:
      player.inputs.s = false;
      break;
    case 68: case 39:
      player.inputs.d = false;
      break;
    case 69:
      player.inputs.e = false;
      break;
    case 67:
      player.inputs.c = false;
      break;
    case 75:
      player.inputs.k = false;
      break;
  }
});

document.addEventListener("mousemove", (event) => {
  player.mouse.x = event.clientX;
  player.mouse.y = event.clientY;
});

document.addEventListener("mousedown", (event) => {
  if (event.which === 1) player.mouse.a = true;
  if (event.which === 3) player.mouse.b = true;
});

document.addEventListener("mouseup", (event) => {
  player.mouse.a = false;
  player.mouse.b = false;
});

let entities = [];

class Entity {
  constructor(pos, master = this) {
    this.x = pos.x;
    this.y = pos.y;
    this.master = master;
    this.angle = 0;
    this.color = "blue";
    this.name = "";
    this.size = 10;
    this.health = {
      max: 100,
      amount: 100
    };
    this.stats = {
      damage: 5,
      pene: 5,
      speed: 5
    };
    this.vx = 0;
    this.vy = 0;
    entities.push(this);
  }
  define(type) {
    for (let key in type) {
      this.guns = [];
      if (key === "guns") {
        for (let gun of type.guns) this.guns.push(new Gun(this, gun));
      } else {
        this[key] = type[key];
      }
    }
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.draw();
    this.angle += 0.01;
    this.size += 0.1;
  }
  draw() {
    for (let gun of this.guns) gun.draw();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.arc(0, 0, this.size + 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = window.colors[this.color][1];
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = window.colors[this.color][0];
    ctx.fill();
    ctx.restore();
  }
};

class Gun {
  constructor(source, data) {
    this.source = source;
    this.x = data.position[3];
    this.y = data.position[4];
    this.w = data.position[1];
    this.h = data.position[0];
    this.angle = data.position[5];
    this.open = data.position[2];
    this.stats = data.stats;
    this.ammo = data.ammo;
  }
  update() {
    this.draw();
  }
  draw() {
    ctx.save();
    let w = this.source.size * this.w;
    let h = this.source.size * this.h;
    ctx.translate(this.source.x, this.source.y);
    ctx.rotate(this.angle + this.source.angle);
    let x = (this.x * this.source.size);
    let y = (this.y * this.source.size);
    ctx.beginPath();
    ctx.moveTo(x - (w / 2), y);
    ctx.lineTo(x - (w / 2) * this.open, y + h);
    ctx.lineTo(x + (w / 2) * this.open, y + h);
    ctx.lineTo(x + (w / 2), y);
    ctx.closePath();
    ctx.fillStyle = window.colors.gray[0];
    ctx.strokeStyle = window.colors.gray[1];
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
};

let gameLoop = (() => {
  function lerp(a, b, x) {
    return a + x * (b - a);
  }
  requestAnimationFrame(gameLoop);
  player.camera.x = lerp(player.camera.x, player.body.x, 0.05);
  player.camera.y = lerp(player.camera.y, player.body.y, 0.05);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let o of entities) {
    ctx.save();
    ctx.translate(o.x - (player.camera.x + canvas.width / 2), o.y - (player.camera.y + canvas.height / 2));
    o.update();
    ctx.restore();
  }
});
gameLoop();

(() => {
  let o = new Entity({ x: 100, y: 100 });
  o.define(Class.basic);
  player.body = o;
})();