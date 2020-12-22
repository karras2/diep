// Import utilities
import * as Class from "/game/entities.js";
console.log(Class);

// Set up canvas
let canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let ctx = canvas.getContext("2d");
ctx.lineJoin = "round";

let game = {
  width: 10000,
  height: 10000,
  mode: "FFA"
};

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
    y: 0,
    upgrades: [],
    speed: 0.2,
    stats: {}
  },
  camera: {
    ratio: 0,
    x: 0,
    y: 0
  }
};

// Event listeners...
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  ctx.lineJoin = "round";
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
      player.inputs.e = !player.inputs.e;
      break;
    case 67:
      player.inputs.c = !player.inputs.c;
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
  player.mouse.a = true;
  UI.registerClick(event.clientX, event.clientY);
});

document.addEventListener("mouseup", (event) => {
  player.mouse.a = false;
});

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let entities = [];

class Entity {
  constructor(pos, master = this) {
    this.x = pos.x;
    this.y = pos.y;
    this.master = master;
    this.angle = 0;
    this.color = "blue";
    this.name = "";
    this.size = 25;
    this.range = -10;
    this.xp = 0;
    this.level = 0;
    this.alpha = 1;
    this.fov = 1;
    this.health = {
      max: 100,
      amount: 100
    };
    this.stats = {
      damage: 5,
      pene: 5,
      speed: 10,
      bSpeed: 1,
      fov: 1
    };
    this.vx = 0;
    this.vy = 0;
    this.guns = [];
    this.upgrades = [];
    entities.push(this);
  }
  define(type) {
    this.guns = [];
    this.upgrades = [];
    for (let key in type) {
      if (key === "guns") {
        for (let gun of type.guns) this.guns.push(new Gun(this, gun));
      } else if (key === "stats") {
        for (let k in type.stats) this.stats[k] = type.stats[k];
      } else {
        this[key] = type[key];
      }
    }
  }
  kill() {
    this.isDead = true;
    setTimeout(() => {
      entities = entities.filter(r => r !== this);
    }, 1000);
  }
  update() {
    this.range --;
    if (this.type === "tank") {
      this.xp += 100;
      this.level = Math.floor(Math.pow(this.xp, 1 / 2.64));
      if (this.level >= 45) this.level = 45;
      this.size = (25 + (this.level));
      //this.stats.speed = 5 - (this.level / 20);
    }
    if (this.range === 0) this.kill();
    if (this.isDead) {
      this.alpha -= 0.025;
      this.size += 0.075;
      if (this.alpha < 0) this.alpha = 0;
    }
    this.x += this.vx * this.stats.speed;
    this.y += this.vy * this.stats.speed;
    this.draw();
    if (this.spin === 1) this.angle += 0.02;
    //this.size += 0.1;
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    for (let gun of this.guns) gun.update();
    ctx.save();
    ctx.rotate(this.angle);
    ctx.beginPath(); // where are x and y pos
    // oh then it should be easy... i think
    // ill make a value called "ratio", which is gonna be what changes the x and y position to fov
    ctx.arc(0, 0, this.size * player.camera.ratio + 5 * player.camera.ratio, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = window.colors[this.color][1];
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, this.size * player.camera.ratio, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = window.colors[this.color][0];
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
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
    this.delay = data.position[6];
    this.stats = data.stats;
    this.ammo = data.ammo;
    this.color = data.color || window.colors.gray;
    if (this.color === "me") this.color = window.colors[this.source.color];
    this.reload = this.stats.reload * this.delay;
    this.maxReload = this.stats.reload;
  }
  update() {
    this.reload --;
    if (this.reload <= 0) {
      if (this.source.shooting) this.shoot();
      else this.reload = this.stats.reload * this.delay;
    }
    this.draw();
  }
  draw() {
    ctx.save();
    let w = (this.source.size * this.w) * player.camera.ratio;
    let h = (this.source.size * this.h) * player.camera.ratio;
    ctx.rotate(this.angle + this.source.angle);
    let x = (this.x * this.source.size * player.camera.ratio);
    let y = (this.y * this.source.size * player.camera.ratio);
    ctx.beginPath();
    ctx.moveTo(x - (w / 2), y);
    ctx.lineTo(x - (w / 2) * this.open, y + h);
    ctx.lineTo(x + (w / 2) * this.open, y + h);
    ctx.lineTo(x + (w / 2), y);
    ctx.closePath();
    ctx.fillStyle = this.color[0];
    ctx.strokeStyle = this.color[1];
    ctx.lineWidth = 5 * player.camera.ratio;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  shoot() {
    this.reload = this.maxReload;
    let o = new Entity({
      x: this.source.x,
      y: this.source.y
    }, this.source);
    o.x += Math.cos(this.angle + this.source.angle) * (this.x * this.source.size);
    o.y += Math.sin(this.angle + this.source.angle) * (this.x * this.source.size);
    o.x += Math.cos(this.angle + this.source.angle) * (this.y * this.source.size);
    o.y += Math.sin(this.angle + this.source.angle) * (this.y * this.source.size);
    o.size = (this.source.size * (this.w / 2)) * 0.9;
    let spray = (Math.floor(Math.random() * (this.stats.spray * 2)) - this.stats.spray) / 10;
    o.vx = Math.cos(this.source.angle + this.angle + (Math.PI / 2) + spray) * (this.stats.speed * this.source.stats.bSpeed);
    o.vy = Math.sin(this.source.angle + this.angle + (Math.PI / 2) + spray) * (this.stats.speed * this.source.stats.bSpeed);
    o.color = this.source.color;
    o.angle = this.source.angle + this.angle;
    o.range = this.stats.range;
    o.stats.damage = this.stats.damage * this.source.bDamage;
    o.health.max = this.stats.pene * this.source.bPene;
    o.health.amount = this.stats.pene * this.source.bPene;
    o.define(Class[this.ammo]);
  }
};

// UI object
let UI = {
  clickables: [],
  mockups: [],
  lb: [],
  spinAngle: 0,
  drawBack: function() {
    ctx.fillStyle = window.colors.background[1];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = window.colors.background[0];
    ctx.fillRect(-(player.camera.x * player.camera.ratio) + canvas.width/2, -(player.camera.y * player.camera.ratio) + canvas.height/2, game.width, game.height);
    ctx.lineWidth = 3 * player.camera.ratio;
    ctx.beginPath();
    ctx.globalAlpha = 0.05;
    for (let i = -game.width / 2; i < game.width * 1.5; i += 50) {
      ctx.moveTo((i - player.camera.x) * player.camera.ratio + canvas.width / 2, 0);
      ctx.lineTo((i - player.camera.x) * player.camera.ratio + canvas.width / 2, game.height);
      ctx.strokeStyle = "black"; 
    }
    for (let i = -game.height / 2; i < game.height * 1.5; i += 50) {
      ctx.moveTo(0, (i - player.camera.y) * player.camera.ratio + canvas.height / 2);
      ctx.lineTo(game.width, (i - player.camera.y) * player.camera.ratio + canvas.height / 2);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1
  },
  map: function() {
    let s = 250;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.translate((innerWidth * 0.975) - s, (innerHeight * 0.975) - s);
    ctx.fillStyle = window.colors.background[0];
    ctx.strokeStyle = window.colors.background[1];
    ctx.lineWidth = 5;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeRect(0, 0, s, s);
    ctx.beginPath();
    ctx.arc((player.body.x / game.width) * s, (player.body.y / game.height) * s, (s / 75), 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  },
  leaderboard: function() {},
  nameplate: function() {
    ctx.save();
    ctx.translate(innerWidth / 2, innerHeight - 30);
    ctx.beginPath();
    ctx.moveTo(-300, 0);
    ctx.lineTo(300, 0);
    ctx.closePath();
    ctx.lineWidth = 30;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.beginPath();
    let perCent = (player.body.level / 45) * 600;
    ctx.moveTo(-300, 0);
    ctx.lineTo(-300 + perCent, 0);
    ctx.closePath();
    ctx.lineWidth = 22.5;
    ctx.strokeStyle = "#f1ea59";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-200, -32.5);
    ctx.lineTo(200, -32.5);
    ctx.closePath();
    ctx.lineWidth = 25;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.beginPath();
    let topScore = UI.lb[0] ? UI.lb[0].xp : 1;
    let perCent2 = ((player.body.xp / topScore) >= 1 ? 1 : (player.body.xp / topScore)) * 400;
    ctx.moveTo(-200, -32.5);
    ctx.lineTo(-200 + perCent2, -32.5);
    ctx.closePath();
    ctx.lineWidth = 17.5;
    ctx.strokeStyle = window.colors.healthBar[0];
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.font = "25px Ubuntu";
    let w = ctx.measureText("Level " + player.body.level + " " + player.body.label).width;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.strokeText("Level " + player.body.level + " " + player.body.label, -(w / 2), 7);
    ctx.fillText("Level " + player.body.level + " " + player.body.label, -(w / 2), 7);
    ctx.font = "17.5px Ubuntu";
    w = ctx.measureText("XP: " + player.body.xp).width;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.strokeText("XP: " + player.body.xp, -(w / 2), -27.5);
    ctx.fillText("XP: " + player.body.xp, -(w / 2), -27.5);
    ctx.font = "40px Ubuntu";
    let name = localStorage.getItem("playername");
    w = ctx.measureText(name).width;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.strokeText(name, -(w / 2), -50);
    ctx.fillText(name, -(w / 2), -50);
    ctx.restore();
  },
  skills: function() {},
  upgrades: function() {
    let s = 100;
    let box = (x, y, color, up) => {
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.translate(x, y);
      ctx.fillStyle = color[0];
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = color[1];
      ctx.fillRect(0, s / 2, s, s / 2);
      ctx.strokeStyle = "#555555";
      ctx.lineWidth = 5;
      ctx.strokeRect(0, 0, s, s);
      ctx.globalAlpha = 1;
      ctx.restore();
      let mockup = this.mockups.find(r => {
        return r.label === Class[up].label
      }) || this.mockups[0];
      mockup.color = "blue";
      mockup.size = 20;
      mockup.angle = this.spinAngle;
      mockup.x = x + s / 2;
      mockup.y = y + s / 2;
      UI.entity(mockup);
      ctx.font = "20px Ubuntu";
      let w = ctx.measureText(Class[up].label).width;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.strokeText(Class[up].label, x + (s / 2) - (w / 2), y + s - 10);
      ctx.fillText(Class[up].label, x + (s / 2) - (w / 2), y + s - 10);
      this.clickables.push({
        type: "upgrade",
        x: x,
        y: y,
        size: s,
        upgrade: up
      });
    };
    let colors = [window.colors.blue, window.colors.green, window.colors.red, window.colors.purple];
    let x = 25, y = 25, t = 0, c = 0;
    for (let upgrade of player.body.upgrades) {
      x = (s / 4) + (s * c) + ((s / 4) * (c)),
      y = (s / 4) + (t * s) + ((s / 5) * t);
      box(x, y, window.colors.blue, upgrade);
      if (++t % 2 === 0) {
        c ++;
        t = 0;
      }
    }
  },
  registerClick: function(x, y) {
    for (let object of this.clickables) {
      if (object.type === "upgrade") {
        if (x > object.x && x < (object.x + object.size)) {
          if (y > object.y && y < (object.y + object.size)) player.body.define(Class[object.upgrade]);
        }
      }
    }
  },
  entity: function(entity) {
    ctx.save();
    ctx.translate(entity.x, entity.y);
    entity.guns.forEach(gun => {
      ctx.save();
      let w = gun.source.size * gun.w;
      let h = gun.source.size * gun.h;
      ctx.rotate(gun.angle + gun.source.angle);
      let x = (gun.x * gun.source.size);
      let y = (gun.y * gun.source.size);
      ctx.beginPath();
      ctx.moveTo(x - (w / 2), y);
      ctx.lineTo(x - (w / 2) * gun.open, y + h);
      ctx.lineTo(x + (w / 2) * gun.open, y + h);
      ctx.lineTo(x + (w / 2), y);
      ctx.closePath();
      ctx.fillStyle = window.colors.gray[0];
      ctx.strokeStyle = window.colors.gray[1];
      ctx.lineWidth = 5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
    ctx.save();
    ctx.rotate(entity.angle);
    ctx.beginPath();
    ctx.arc(0, 0, entity.size + 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = window.colors[entity.color][1];
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, entity.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = window.colors[entity.color][0];
    ctx.fill();
    ctx.restore();
    ctx.restore();
  },
  init: function() {
    for (let tank in Class) {
      let o = new Entity({ x: 0, y: 0 });
      o.define(Class[tank]);
      this.mockups.push(o);
      entities = entities.filter(r => r !== o);
    }
    console.log(this.mockups);
  },
  draw: function() {
    this.clickables = [];
    this.map();
    this.upgrades();
    this.nameplate();
    this.spinAngle += 0.01;
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
  ctx.save();
  player.body.fov = lerp(player.body.fov, 0.1 * (player.body.size / 5) * (player.body.stats.fov || 1), 0.01);
  player.camera.ratio = (canvas.width + canvas.height) / 4000 / player.body.fov
  
  UI.drawBack();
  for (let o of entities) {
    ctx.save();
    ctx.translate((o.x - player.camera.x) * player.camera.ratio + canvas.width / 2, (o.y - player.camera.y) * player.camera.ratio + canvas.height / 2);
    o.update();
    ctx.restore();
  }
  ctx.restore();
  UI.draw();
  player.body.vx = lerp(player.body.vx, 0, 0.1);
  player.body.vy = lerp(player.body.vy, 0, 0.1);
  player.body.angle = Math.atan2((player.mouse.y - canvas.height / 2), (player.mouse.x - canvas.width / 2)) - Math.PI / 2;
  player.body.shooting = player.mouse.a || player.inputs.e;
  if (player.inputs.w) player.body.vy -= 0.1; 
  if (player.inputs.a) player.body.vx -= 0.1;
  if (player.inputs.s) player.body.vy += 0.1;// yea, time for fov
  if (player.inputs.d) player.body.vx += 0.1;
});
gameLoop();
UI.init();


(() => {
  let o = new Entity({ x: 100, y: 100 });
  o.define(Class.basic);
  player.body = o;
})();




// Console commands
window["define"] = function(data) {
  if (Class[data]) {
    player.body.define(Class[data]);
    console.log("Set your tank to " + player.body.label);
  } else {
    console.log("That tank does not exist!");
  }
};

window["color"] = function(data) {
  if (window.colors[data]) {
    player.body.color = data;
    console.log("Set your color to " + player.body.color);
  } else {
    console.log("That color does not exist!");
  }
};

window["size"] = function(data) {
  if (data > 9 && data < 101) {
    player.body.size = data;
    console.log("Set your size to " + data);
  } else {
    console.log("Size must be a number between 10 and 100!");
  }
};