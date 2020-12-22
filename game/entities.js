const s = {
  // reload, recoil, dmg, pene, speed, range, density, spray
  basic: [50, 1, 1, 1, 1.75, 100, 150, 1],
  twin: [1.4, 0.8, 0.6, 0.6, 1, 1, 1, 1],
  mach: [0.75, 1.125, 0.7, 0.7, 1, 0.9, 2],
  sniper: [1.125, 1, 0.8, 1.25, 1.5, 1.25, 1, 0.5],
  flank: [1.1, 1, 0.8, 0.8, 0.9, 1, 1, 1],
  thruster: [1, 1.5, 0.5, 0.5, 0.75, 0.6, 0.5, 1.5],
  destroy: [4, 2, 2, 3, 1.125, 2, 5, 0.1]
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
  return out;
});

let bullet = {
  label: "Bullet",
  guns: []
};

let basic = {
  label: "Basic",
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
  upgrades: ["destroyer"]
};
let sniper = {
  label: "Sniper",
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
    position: [1.5, 1, 1, 0, 0, Math.PI, 0],
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

export { bullet, basic, twin, machine, sniper, flank, triple, double, destroyer }