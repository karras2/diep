let basicCollide = (i, o) => {
  if (i.collisionArray.includes(o) || o.collisionArray.includes(i)) return;
  if (i === o || i.master === o || o.master === i || o.master === i.master) return;
  if (i.isDead || o.isDead) return;
  i.collisionArray.push(o);
  o.collisionArray.push(i);
  let fasterEntity = o;
  if (Math.abs(i.vx + i.vy) + i.size > Math.abs(o.vx + o.vy) + o.size) fasterEntity = i;
  if (fasterEntity === i) {
    i.vx *= 0.75;
    i.vy *= 0.75;
    o.vx = i.vx * 0.25;
    o.vy = i.vy * 0.25;
  } else {
    o.vx *= 0.75;
    o.vy *= 0.75;
    i.vx = o.vx * 0.25;
    i.vy = o.vy * 0.25;
  }
  //i.vx *= -0.5;
  //i.vy *= -0.5;
  //o.vx *= -0.5;
  //o.vy *= -0.5;
  if (o.type)
  i.health.amount -= o.stats.damage;
  o.health.amount -= i.stats.damage;
  if (i.health.amount <= 0) i.kill();
  if (o.health.amount <= 0) o.kill();
};

export { basicCollide }