const s = {
  // reload, recoil, dmg, pene, speed, range, density, spray
  basic: [25, 1, 1, 1, 10, 100, 150, 1],
  twin: [1.4, 0.8, 0.6, 0.6, 1, 1, 1, 1]
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
    position: [2, 0.75, 1, 0.5, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }, {
    position: [2, 0.75, 1, -0.5, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic, s.twin])
  }]
};

export { basic, twin }