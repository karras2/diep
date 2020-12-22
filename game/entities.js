const s = {
  // reload, recoil, dmg, pene, speed, range, density, spray
  basic: [25, 1, 1, 1, 10, 100, 150, 1]
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
    pos: [2, 0.5, 1, 0, 0, 0, 0],
    ammo: "bullet",
    stats: combineStats([s.basic])
  }]
};

export { basic }