// Import utilities
import * as Class from "/game/entities.js";
console.log(Class);

// Set up canvas
let canvas = document.createElement("canvas");
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

class Entity {
  constructor(pos, master = this) {
    this.x = pos.x;
    this.y = pos.y;
    this.master = master;
    this.name = "";
    this.health = {
      max: 100,
      amount: 0
    };
  }
}