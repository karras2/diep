const s = {
  // reload, recoil, dmg, pene, speed, range, density, spray
  basic: [50, 1, 1, 1, 3, 300, 150, 1],
  twin: [1.4, 0.8, 0.6, 0.6, 1, 1, 1, 1],
  mach: [0.75, 1.125, 0.7, 0.7, 1, 0.9, 4],
  sniper: [1.125, 1, 0.8, 1.25, 1.5, 1.25, 1, 0.5],
  flank: [1.1, 1, 0.8, 0.8, 0.9, 1, 1, 1],
  thruster: [1, 1.5, 0.5, 0.5, 0.75, 0.5, 0.5, 1.5],
  rocketeerRocket: [0.75, 2, 1.25, 1.25, 0.5, 10, 2],
  destroy: [4, 2, 2, 3, 1.125, 2, 5, 0.1],
  gunner: [1.25, 0.75, 0.75, 0.8, 1, 1, 2, 1.25],
  rocketeerRocket: [0.75, 2, 1.25, 1.25, 0.5, 10, 2],
  skimmerMissile: [0.75, 1, 1.25, 1.25, 1, 10, 0.5],
};

let combineStats = ((stats) => {
  let baseStats = JSON.parse(JSON.stringify(stats[0]));
  stats.shift();
  for (let stat of stats) {
    for (let i = 0; i < stat.length; i ++) baseStats[i] *= stat[i];
  }
  let out = {};
  let names = ["reload", "recoil", "dmg", "pene", "speed", "range", "density", "spray"];
  for (let i = 0; i < names.length; i ++) out[names[i]] = baseStats[i];
  out.range = Math.floor(out.range);
  return out;
});

let bullet = {
  label: "Bullet",
  type: "bullet",
  guns: []
};
let rocket = {
  label: "Rocket",
  type: "bullet",
  guns: [{
    position: [2, 1, 1.75, 0, 0, Math.PI, 2],
    ammo: "bullet",
    stats: combineStats([s.basic, s.mach, s.thruster, s.rocketeerRocket]),
    color: "me"
  }]
};
let missile = {
  label: "Missile",
  type: "bullet",
  spin: 1,
  guns: [{
    position: [1.65, 1, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.mach, s.thruster, s.skimmerMissile]),
    color: "me"
  }, {
    position: [1.65, 1, 1, 0, 0, Math.PI, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.mach, s.thruster, s.skimmerMissile]),
    color: "me"
  }]
};

let basic = {
  label: "Basic",
  type: "tank",
  guns: [{
    position: [2, 1, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic])
  }],
  upgrades: ["twin", "machine", "sniper", "flank"]
};

// LvL 15
let twin = {
  label: "Twin",
  guns: [{
    position: [1.9, 0.9, 1, 0.5, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [1.9, 0.9, 1, -0.5, 0, 0, 0.5],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }],
  upgrades: ["triple", "double"]
};
let machine = {
  label: "Machine Gun",
  guns: [{
    position: [2, 1, 1.75, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.mach])
  }],
  upgrades: ["destroyer", "gunner"]
};
let sniper = {
  label: "Sniper",
  stats: {
    fov: 1.1
  },
  guns: [{
    position: [2.5, 0.9, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.sniper])
  }]
};
let flank = {
  label: "Flank Guard",
  guns: [{
    position: [2, 1, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.flank])
  }, {
    position: [1.6, 1, 1, 0, 0, Math.PI, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.flank, s.thruster])
  }]
};

// LvL 30
let triple = {
  label: "Triple Shot",
  guns: [{
    position: [1.75, 0.9, 1, -0.25, 0, Math.PI / 10, 0.5],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [1.75, 0.9, 1, 0.25, 0, -Math.PI / 10, 0.5],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [2, 0.9, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }]
};
let double = {
  label: "Double Twin",
  guns: [{
    position: [1.9, 0.9, 1, 0.5, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [1.9, 0.9, 1, -0.5, 0, 0, 0.5],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [1.9, 0.9, 1, 0.5, 0, Math.PI, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [1.9, 0.9, 1, -0.5, 0, Math.PI, 0.5],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }]
};
let destroyer = {
  label: "Destroyer",
  guns: [{
    position: [2, 1.4, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.destroy])
  }]
};
let gunner = {
  label: "Gunner",
  guns: [{
    position: [1.75, 0.5, 1, 0.8, 0, 0, 0.25],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin, s.gunner])
  }, {
    position: [1.75, 0.5, 1, -0.8, 0, 0, 0.75],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin, s.gunner])
  }, {
    position: [2, 0.5, 1, 0.4, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin, s.gunner])
  }, {
    position: [2, 0.5, 1, -0.4, 0, 0, 0.5],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin, s.gunner])
  }]
};

export { bullet, rocket, missile, basic, twin, machine, sniper, flank, triple, double, destroyer, gunner }