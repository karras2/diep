// Import utilities
import * as Class from "/game/entities.js";
import * as Collision from "/game/collision.js";

// Set up canvas
let canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let ctx = canvas.getContext("2d");
ctx.lineJoin = "round";

let game = {
  width: 10000,
  height: 10000,
  mode: "FFA",
  random: function() {
    return {
      x: Math.floor(Math.random() * game.width),
      y: Math.floor(Math.random() * game.height)
    }
  }
};

let UPGRADETIERS = [15, 30, 45];

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
  camera: {
    ratio: 0,
    x: 0,
    y: 0
  },
  spawn: function() {
    let o = new Entity(game.random());
    o.define(Class.basic);
    o.color = "blue";
    o.name = localStorage.getItem("playername");
    o.xp = player.body ? Math.floor((player.body.xp > 23500 ? 23500 / 3 : player.body.xp / 3)) : 0;
    player.body = o;
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
    case 13:
      if (player.body.isDead) player.spawn();
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
  if (UI.registerClick(event.clientX, event.clientY)) return;
  player.mouse.a = true;
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

function lerp(a, b, x) {
  return a + x * (b - a);
}

function chooseChance(data) {
  let all = [];
  for (let key in data) {
    for (let i = 0; i < data[key]; i ++) all.push(key);
  }
  return all[Math.floor(Math.random() * all.length)];
};

function getDist(a, b) {
  var d = a.x - b.x;
  var e = a.y - b.y;
  var c = Math.sqrt(d * d + e * e);
  return c;
};

let drawPoly = (s, r, c, a = 0, ui = false) => {
  ctx.save();
  ctx.rotate(a - Math.PI / 2);
  ctx.lineWidth = 5 * player.camera.ratio;
  ctx.fillStyle = c[0];
  ctx.strokeStyle = c[1];
  if (typeof s === "string") {
    let path = new Path2D(s);
    ctx.save();
    ctx.scale(r, r);
    ctx.lineWidth /= r;
    ctx.stroke(path);
    ctx.fill(path);
    ctx.restore();
  } else if (s instanceof Array) {
    ctx.beginPath();
    for (let point of s) {
      let x = point[0] * r,
        y = point[1] * r;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else switch (true) {
    case s === 0:
      ctx.beginPath();
      ctx.arc(0, 0, ui ? r * 1.25 : (r + 5 * player.camera.ratio), 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = c[1];
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = c[0];
      ctx.fill();
      break;
    case s < 0: {
      ctx.beginPath();
      r *= 1.25;
      a += s % 2 ? 0 : Math.PI / s;
      let dip = 1 - 6 / s / s;
      s = -s;
      ctx.moveTo(
        r * Math.cos(a),
        r * Math.sin(a)
      );
      for (let i = 0; i < s; i++) {
        var theta = ((i + 1) / s) * 2 * Math.PI;
        var htheta = ((i + 0.5) / s) * 2 * Math.PI;
        var c = {
          x: r * dip * Math.cos(htheta + a),
          y: r * dip * Math.sin(htheta + a)
        };
        var p = {
          x: r * Math.cos(theta + a),
          y: r * Math.sin(theta + a)
        };
        ctx.quadraticCurveTo(c.x, c.y, p.x, p.y);
      }
      ctx.lineWidth = ui ? r * 0.25 : (5 * player.camera.ratio);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    break;
    case (s < 17 && s > 2):
      ctx.beginPath();
      let angle = 0;
      angle += (s % 2 ? 0 : Math.PI / s) - Math.PI;
      for (let i = 0; i < s; i++) {
        let theta = (i / s) * 2 * Math.PI;
        let x = (r * 1.25) * Math.cos(theta + angle);
        let y = (r * 1.25) * Math.sin(theta + angle);
        ctx.lineTo(x, y);
      }
      ctx.lineWidth = ui ? r * 0.25 : (5 * player.camera.ratio);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }
  ctx.restore();
};

let entities = [];

class Entity {
  constructor(pos, master = this) {
    this.x = pos.x;
    this.y = pos.y;
    this.master = master;
    this.view = 50;
    this.angle = 0;
    this.color = ["blue", "red", "green", "purple"][Math.floor(Math.random()* 4)];
    this.name = "";
    this.size = 25;
    this.tier = 0;
    this.range = -10;
    this.xp = 0;
    this.level = 0;
    this.alpha = 1;
    this.shape = 0;
    this.fov = 1;
    this.collisionArray = [];
    this.health = {
      max: 100,
      amount: 100
    };
    this.stats = {
      damage: 5,
      pene: 5,
      speed: 5,
      bSpeed: 1,
      fov: 1,
      bDamage: 2,
      bPene: 2,
      reload: 0.5
    };
    this.vx = 0;
    this.vy = 0;
    this.guns = [];
    this.upgrades = [];
    this.target = {
      x: 5000,
      y: 5000,
      vx: 0,
      vy: 0
    };
    entities.push(this);
  }
  define(tank) {
    let type = JSON.parse(JSON.stringify(tank));
    this.guns = [];
    this.upgrades = [];
    for (let key in type) {
      if (key === "guns") {
        for (let gun of type.guns) this.guns.push(new Gun(this, gun));
      } else if (key === "turrets") {
        for (let turret of type.turrets) {
          let o = new Entity()
        }
      } else if (key === "stats") {
        for (let k in type.stats) this.stats[k] = type.stats[k];
      } else if (key === "moveToTarget") {
        setTimeout(() => {
          this[key] = type[key];
        }, 100);
      } else {
        this[key] = type[key];
      }
    }
  }
  kill() {
    this.isDead = true;
    this.ondead(this.collisionArray);
    setTimeout(() => {
      entities = entities.filter(r => r !== this);
    }, 1000);
  }
  ondead(c) {
    if (c.length) {
      let o = c[0];
      o.master.xp += Math.floor(this.xp / 3);
    }
    if (this.isBot) setTimeout(() => {
      let o = new Entity(game.random());
      o.define(Class.basic);
      o.color = this.color;
      o.name = this.name;
      o.xp = Math.floor((this.xp > 23500 ? 23500 / 3 : this.xp / 3));
      o.isBot = true;
    }, 5000);
    if (this.type === "food") setTimeout(() => {
      let o = new Entity(game.random());
      let type = chooseChance({
        square: 4,
        triangle: 3,
        pentagon: 2,
        alphaPentagon: 1
      });
      o.define(Class[type]);
    }, 5000);
  }
  update() {
    this.range --;
    if (this.slows) {
      this.vx = lerp(this.vx, 0, 0.05);
      this.vy = lerp(this.vy, 0, 0.05);
    }
    if (this.type === "tank" && this.health.amount < this.health.max) this.health.amount += 0.1;
    if (this.type === "tank" && !this.boss && !this.isBot) {
      this.level = Math.floor(Math.pow(this.xp, 1 / 2.64));
      if (this.level >= 45) this.level = 45;
      this.size = (25 + (this.level));
      let oldHP = JSON.parse(JSON.stringify(this.health));
      this.health.max = (100 + (this.level * 10));
      if (oldHP.max < this.health.max) this.health.amount += this.health.max - oldHP.max;
      this.stats.speed = 5 - (this.level / 50);
    } else if (this.boss || this.isBot) {
      this.vx = this.vy = 0;
      this.findTarget();
      if (this.x < (this.target.x - this.size + this.target.size * 1.5)) this.vx = 1;
      if (this.x > (this.target.x + this.size + this.target.size * 1.5)) this.vx = -1;
      if (this.y < (this.target.y - this.size + this.target.size * 1.5)) this.vy = 1;
      if (this.y > (this.target.y + this.size + this.target.size * 1.5)) this.vy = -1;
      if (this.isBot) this.angle = Math.atan2((this.target.y + this.target.vy) - this.y, (this.target.x + this.target.vx) - this.x) - Math.PI / 2;
      this.shooting = true;
      if (this.isBot) {
        this.level = Math.floor(Math.pow(this.xp, 1 / 2.64));
        if (this.level >= 45) this.level = 45;
        this.size = (25 + (this.level));
        let oldHP = JSON.parse(JSON.stringify(this.health));
        this.health.max = (100 + (this.level * 10));
        if (oldHP.max < this.health.max) this.health.amount += this.health.max - oldHP.max;
        this.stats.speed = 5 - (this.level / 50);
      }
      let canUpgrade = false;
      if (this.level >= UPGRADETIERS[this.tier]) canUpgrade = true;
      if (canUpgrade && this.upgrades.length) {
        this.tier ++;
        let i = Math.floor(Math.random() * this.upgrades.length);
        let upgrade = this.upgrades[i];
        this.define(Class[upgrade]);
      }
    } else if (this.moveToMasterTarget) {
      let angleToGo = Math.atan2(this.master.y - (this.y + this.master.target.y), this.master.x - (this.x + this.master.target.x));//Math.atan2(this.master.y - this.y + player.mouse.y - canvas.height / 2, this.master.x - this.x + player.mouse.x - canvas.width / 2);
      let newVelocity = {
        x: Math.cos(angleToGo) * this.stats.speed, 
        y: Math.sin(angleToGo) * this.stats.speed
      };
      this.vx = lerp(this.vx, newVelocity.x, 0.1);
      this.vy = lerp(this.vy, newVelocity.y, 0.1);
      this.angle = angleToGo;
    } else if (this.moveToTarget) {
      this.findTarget();
      let angleToGo = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      let newVelocity = {
        x: Math.cos(angleToGo) * this.stats.speed, 
        y: Math.sin(angleToGo) * this.stats.speed
      };
      this.vx = lerp(this.vx, newVelocity.x, 0.1);
      this.vy = lerp(this.vy, newVelocity.y, 0.1);
      this.angle = angleToGo - Math.PI / 2;
    };
    if (this.range === 0) this.kill();
    if (this.isDead) {
      this.alpha -= 0.025;
      this.size += 0.075;
      if (this.alpha < 0) this.alpha = 0;
    }
    if (this.x + this.vx < 0 || this.x + this.vx > game.width) this.vx *= -0.5;
    if (this.y + this.vy < 0 || this.y + this.vy > game.height) this.vy *= -0.5;
    if (!this.moveToTarget) {
      this.x += this.vx * this.stats.speed;
      this.y += this.vy * this.stats.speed;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }
    if (this.invis) {
      if (Math.abs(this.vx) < 0.5 && Math.abs(this.vy) < 0.5) {
        if (this.alpha > 0.01) this.alpha -= 0.01;
      } else this.alpha = 1;
    }
    this.draw();
    if (this.spin === 1) this.angle += 0.02;
    if (this.spin === 2) this.angle += 0.005;
    //this.size += 0.1;
  }
  findTarget() {
    if (this.isDead) return;
    let target = false;
    let list = [];
    for (let o of entities) {
      var a = (o.x + o.vx) - (this.x + this.vx);
      var b = (o.y + o.vy) - (this.y + this.vy);
      var c = Math.sqrt(a * a + b * b);
      if (!o.isDead && o !== this.master && o !== this)
        if ((o.type === "food" || (o.type === "tank" && o !== this.master)) && c < (this.view * this.master.size) && o.alpha > 0.5) list.push(o);
    }
    let body = this;
    if (list.length > 1) list.sort(function(a, b) {
      return getDist(a, body) - getDist(b, body);
    });
    if (list.length) {
      if (this.target.type) if (list.includes(this.target)) return;
      this.target = list[0];
      return;
    } else if (this.type !== "tank") {
      this.target = {
        x: this.master.x + (Math.cos(Math.random() * Math.PI * 2) * this.master.size * Math.floor(Math.random() * 10)),
        y: this.master.y + (Math.sin(Math.random() * Math.PI * 2) * this.master.size * Math.floor(Math.random() * 10)),
        vx: 0,
        vy: 0
      };
    }
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    for (let gun of this.guns) gun.update();
    ctx.save();
    ctx.rotate(this.angle);
    drawPoly(this.shape, this.size * player.camera.ratio, window.colors[this.color]);
    ctx.restore();
    if (this.type !== "bullet") {
      ctx.beginPath();
      ctx.moveTo(-50 * player.camera.ratio, (this.size + 50) * player.camera.ratio);
      ctx.lineTo(50 * player.camera.ratio, (this.size + 50) * player.camera.ratio);
      ctx.closePath();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 10;
      ctx.stroke();
      let perCent = ((this.health.amount / this.health.max) >= 1 ? 1 : ((this.health.amount / this.health.max) <= 0 ? 0 : (this.health.amount / this.health.max))) * 90;
      ctx.beginPath();
      ctx.moveTo(-45 * player.camera.ratio, (this.size + 50) * player.camera.ratio);
      ctx.lineTo((-45 + perCent) * player.camera.ratio, (this.size + 50) * player.camera.ratio);
      ctx.closePath();
      ctx.strokeStyle = window.colors.healthBar[0];
      ctx.lineWidth = 7.5;
      ctx.stroke(); 
    }
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
    this.autoShoot = data.autoShoot || false;
    this.ammo = data.ammo;
    this.color = data.color || window.colors.gray;
    if (this.color === "me") this.color = window.colors[this.source.color];
    this.reload = (this.stats.reload * this.source.stats.reload) * this.delay;
    this.maxReload = (this.stats.reload * this.source.stats.reload);
    this.prop = data.prop || false;
  }
  update() {
    this.gunID = `${entities.indexOf(this.source)}-${this.source.guns.indexOf(this)}`;
    this.reload --;
    if (this.reload <= 0) {
      if (this.source.shooting || this.source.type === "bullet" || this.autoShoot) this.shoot();
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
    if (this.prop || this.source.isDead) return;
    let children = [];
    for (let o of entities) if (o.master === this.source && o.label === "Drone") children.push(o);
    if (this.source.maxChildren) if (children.length >= this.source.maxChildren) return;
    this.reload = this.maxReload;
    let o = new Entity({
      x: this.source.x, // nvm
      y: this.source.y // moveToMasterTarget
    }, this.source.master.master.master); // what?
    o.gunSourceID = this.gunID;
    o.x += Math.cos(this.angle + this.source.angle) * (this.x * this.source.size); 
    o.y += Math.sin(this.angle + this.source.angle) * (this.x * this.source.size);
    o.x += Math.cos(this.angle + this.source.angle) * (0 * this.source.size); 
    o.y += Math.sin(this.angle + this.source.angle) * (0 * this.source.size);
    // thats the offset? hm
    // why does it add it 2 times was gonna go for y. yeah
    o.size = ((this.source.size * (this.w / 2)) * 0.9) * this.stats.size;
    let spray = (Math.floor(Math.random() * (this.stats.spray * 2)) - this.stats.spray) / 10;
    o.vx = Math.cos(this.source.angle + this.angle + (Math.PI / 2) + spray) * (this.stats.speed * this.source.stats.bSpeed);
    o.vy = Math.sin(this.source.angle + this.angle + (Math.PI / 2) + spray) * (this.stats.speed * this.source.stats.bSpeed);
    o.color = this.source.color;
    o.angle = this.source.angle + this.angle;
    o.range = this.stats.range;
    o.stats.damage = this.stats.dmg * this.source.stats.bDamage;
    o.health.max = this.stats.pene * this.source.stats.bPene;
    o.health.amount = this.stats.pene * this.source.stats.bPene;
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
    ctx.fillRect(-(player.camera.x * player.camera.ratio) + canvas.width/2, -(player.camera.y * player.camera.ratio) + canvas.height/2, game.width * player.camera.ratio, game.height * player.camera.ratio);
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
    ctx.globalAlpha = 1;
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
    for (let o of entities) if (o.type === "tank" || o.boss) {
      if (o === player.body) continue;
      ctx.beginPath();
      ctx.arc((o.x / game.width) * s, (o.y / game.height) * s, (s / 75), 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = window.colors[o.color][0];
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  },
  leaderboard: function() {
    let toDraw = [];
    for (let o of entities) if (o.type === "tank" || o.boss) toDraw.push({
      name: o.name,
      xp: o.xp,
      color: o.color,
      tank: o.label
    });
    toDraw.sort(function(a, b) { return b.xp - a.xp });
    if (toDraw.length > 10) toDraw.length = 10;
    UI.lb = toDraw;
    ctx.save();
    ctx.translate((innerWidth * 0.975) - 200, (innerHeight * 0.1));
    for (let i = 0; i < UI.lb.length; i ++) {
      ctx.save();
      ctx.translate(0, (20 * i) + (10 * i));
      let user = UI.lb[i];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 0);
      ctx.closePath();
      ctx.lineWidth = 20;
      ctx.strokeStyle = window.colors["healthBar"][1];
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      let xx = 200 * (user.xp / UI.lb[0].xp);
      ctx.lineTo(xx, 0);
      ctx.closePath();
      ctx.lineWidth = 15;
      ctx.strokeStyle = window.colors["healthBar"][0];
      ctx.stroke();
      ctx.font = "15px Ubuntu";
      let text = user.name + " - " + user.xp + " - " + user.tank;
      let w = ctx.measureText(text).width;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeText(text, 100 - (w / 2), 5);
      ctx.fillText(text, 100 - (w / 2), 5);
      let mockup = this.mockups.find(r => {
        return r.label === user.tank;
      }) || this.mockups[0];
      mockup.color = user.color;
      mockup.size = 7.5;
      mockup.angle = Math.PI - (Math.PI / 4);
      mockup.x = -40;
      mockup.y = 0;
      UI.entity(mockup);
      ctx.restore();
    }
    ctx.restore();
  },
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
    let canUpgrade = false;
    if (player.body.level >= UPGRADETIERS[player.body.tier]) canUpgrade = true;
    let box = (x, y, color, up) => {
      if (!canUpgrade) return;
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
          if (y > object.y && y < (object.y + object.size)) {
            player.body.define(Class[object.upgrade]);
            player.body.tier ++;
            return 1;
          }
        }
      }
    }
    return 0;
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
      ctx.lineWidth = entity.size * 0.25;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
    ctx.save();
    ctx.rotate(entity.angle);
    drawPoly(entity.shape, entity.size, window.colors[entity.color], 0, true);
    ctx.restore();
    ctx.restore();
  },
  drawDead: function() {
    ctx.font = "75px Ubuntu";
    let texta = "Final Score: " + player.body.xp;
    let textb = "Level: " + player.body.level;
    let textc = "Tank: " + player.body.label;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.strokeText(texta, innerWidth * 0.25, innerHeight * 0.25);
    ctx.fillText(texta, innerWidth * 0.25, innerHeight * 0.25);
    ctx.strokeText(textb, innerWidth * 0.25, innerHeight * 0.5);
    ctx.fillText(textb, innerWidth * 0.25, innerHeight * 0.5);
    ctx.strokeText(textc, innerWidth * 0.25, innerHeight * 0.75);
    ctx.fillText(textc, innerWidth * 0.25, innerHeight * 0.75);
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
    this.leaderboard();
    this.spinAngle += 0.01;
    if (player.body.isDead) this.drawDead();
  }
};

let gameLoop = (() => {
  requestAnimationFrame(gameLoop);
  if (!player.body) return;
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
  
  
  // Collision update
  for (let o of entities) o.collisionArray = [];
  for (let o of entities) {
    for (let j of entities) {
      var a = (o.x + o.vx) - (j.x + j.vx);
      var b = (o.y + o.vy) - (j.y + j.vy);
      var c = Math.sqrt(a * a + b * b);
      if (c < o.size + j.size) {
        if (o.type === "food" && j.type === "food") Collision.firmCollide(o, j);
        Collision.basicCollide(o, j);
      }
    }
  }
  if (Math.random() > 0.975) window.boss();
  
  player.body.vx = lerp(player.body.vx, 0, 0.1);
  player.body.vy = lerp(player.body.vy, 0, 0.1);
  player.body.angle = Math.atan2((player.mouse.y - canvas.height / 2), (player.mouse.x - canvas.width / 2)) - Math.PI / 2;
  player.body.shooting = player.mouse.a || player.inputs.e;
  player.body.target = {
    x: -(player.mouse.x - canvas.width / 2) * (player.body.size - 10),
    y: -(player.mouse.y - canvas.height / 2) * (player.body.size - 10)
  };
  if (player.inputs.w) player.body.vy -= 0.1; 
  if (player.inputs.a) player.body.vx -= 0.1;
  if (player.inputs.s) player.body.vy += 0.1;
  if (player.inputs.d) player.body.vx += 0.1;
});
gameLoop();
UI.init();


(() => {
  player.spawn();
  for (let i = 0; i < 100; i ++) {
    let a = new Entity(game.random());
    let type = chooseChance({
      square: 4,
      triangle: 3,
      pentagon: 2,
      alphaPentagon: 1
    });
    a.define(Class[type]);
  }
  setTimeout(() => window.bots(5), 1000);
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

window["xp"] = function(data) {
  if (data > -1) {
    player.body.xp = data;
    console.log("Set your XP to " + data);
  } else {
    console.log("XP must be a number greater than 1!");
  }
};

window["boss"] = function() {
  let bossAlive = false;
  for (let o of entities) if (o.boss) bossAlive = true;
  if (bossAlive) return;
  let o = new Entity(game.random());
  let bosses = [Class.summoner, Class.fallenOverlord];
  o.define(bosses[Math.floor(Math.random() * bosses.length)]);
};

window["bots"] = function(data) {
  for (let i = 0; i < data; i ++) {
    let o = new Entity(game.random());
    o.define(Class.basic);
    let names = ['Alice', 'Bob', 'Carmen', 'David', 'Edith', 'Freddy', 'Gustav', 'Helga', 'Janet', 'Lorenzo', 'Mary', 'Nora', 'Olivia', 'Peter', 'Queen', 'Roger', 'Suzanne', 'Tommy', 'Ursula', 'Vincent', 'Wilhelm', 'Xerxes', 'Yvonne', 'Zachary'];
    o.name = "[BOT] " + names[Math.floor(Math.random() * names.length)];
    o.color = "red";
    o.isBot = true;
  }
}