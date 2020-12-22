const s = {
  // reload, recoil, dmg, pene, speed, range, density, spray
  basic: [25, 1, 1, 1, 1.5, 100, 150, 1],
  twin: [1.4, 0.8, 0.6, 0.6, 1, 1, 1, 1],
  mach: [0.75, 1.125, 0.7, 0.7, 1, 0.9, 2],
  sniper: [1.125, 1, 0.8, 1.25, 1.25, 1.25, 1, 0.5]
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
    position: [2, 0.75, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic])
  }]
};
let twin = {
  label: "Twin",
  guns: [{
    position: [1.9, 0.7, 1, 0.5, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [1.9, 0.7, 1, -0.5, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }]
};
let machine = {
  label: "Machine",
  guns: [{
    position: [1.8, 0.75, 1.75, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.mach])
  }]
};
let sniper = {
  label: "Sniper",
  guns: [{
    position: [2.5, 0.7, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.sniper])
  }]
};

export { bullet, basic, twin, machine, sniper }