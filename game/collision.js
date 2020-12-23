let basicCollide = (i, o) => {
  if (i.collisionArray.includes(o) || o.collisionArray.includes(i)) return;
  if (i === o || i.master === o || o.master === i || o.master === i.master) return;
  if (i.isDead || o.isDead) return;
  i.collisionArray.push(o);
  o.collisionArray.push(i);
  /*let fasterEntity = o;
  if (Math.abs(i.vx + i.vy) + i.size > Math.abs(o.vx + o.vy) + o.size) fasterEntity = i;
  if (fasterEntity === i) {
    let v = JSON.parse(JSON.stringify({ x: i.vx, y: i.vy }));
    i.vx *= -0.5;
    i.vy *= -0.5;
    o.vx = v.x;
    o.vy = v.y;
  } else {
    let v = JSON.parse(JSON.stringify({ x: o.vx, y: o.vy }));
    o.vx *= -0.5;
    o.vy *= -0.5;
    i.vx = v.x;
    i.vy = v.y;
  }*/
  i.vx *= -0.25;
  i.vy *= -0.25;
  o.vx *= -0.25;
  o.vy *= -0.25;
  if (o.type === "food" && i.type === "food") return;
  i.health.amount -= o.stats.damage;
  o.health.amount -= i.stats.damage;
  if (i.health.amount <= 0) i.kill();
  if (o.health.amount <= 0) o.kill();
};

export { basicCollide }