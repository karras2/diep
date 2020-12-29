let basicCollide = (i, o) => {
  if (i.collisionArray.includes(o) || o.collisionArray.includes(i)) return;
  if (i === o || i.master === o || o.master === i || o.master === i.master) return;
  if (i.isDead || o.isDead) return;
  if (i.team === o.team) return;
  i.collisionArray.push(o);
  o.collisionArray.push(i);
  let fasterEntity = o;
  if (Math.abs(i.vx + i.vy)> Math.abs(o.vx + o.vy)) fasterEntity = i;
  if (fasterEntity === i) {
    let v = JSON.parse(JSON.stringify({ x: i.vx, y: i.vy }));
    if (o.type === "tank" || o.type === "food") {
      o.vx = (v.x / (o.size / i.density)) / 10;
      o.vy = (v.y / (o.size / i.density)) / 10; 
    }
  } else {
    let v = JSON.parse(JSON.stringify({ x: o.vx, y: o.vy }));
    if (i.type === "tank" || i.type === "food") {
      i.vx = (v.x / (i.size / o.density)) / 10;
      i.vy = (v.y / (i.size / o.density)) / 10; 
    }
  };
  i.health.amount -= o.stats.damage;
  o.health.amount -= i.stats.damage;
  if (i.health.amount <= 0) i.kill();
  if (o.health.amount <= 0) o.kill();
};

let firmCollide = (i, o) => {
  if (i.collisionArray.includes(o) || o.collisionArray.includes(i)) return;
  if (i.isDead || o.isDead) return;
  i.collisionArray.push(o);
  o.collisionArray.push(i);
  i.vx *= -0.75;
  i.vy *= -0.75;
  o.vx *= -0.75;
  o.vy *= -0.75;
};

export { basicCollide, firmCollide }