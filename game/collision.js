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
      o.vx = v.x * (0.025 / o.size * (i.density * o.density));
      o.vy = v.y * (0.025 / o.size * (i.density * o.density)); 
    }
  } else {
    let v = JSON.parse(JSON.stringify({ x: o.vx, y: o.vy }));
    if (i.type === "tank" || i.type === "food") {
      i.vx = v.x * (0.025 / i.size * (i.density * o.density));
      i.vy = v.y * (0.025 / i.size * (i.density * o.density)); 
    }
  };
  i.health.amount -= o.damage;
  o.health.amount -= i.damage;
  if (i.health.amount <= 0) i.kill();
  if (o.health.amount <= 0) o.kill();
};

let firmCollide = (i, o) => {
  if (i.collisionArray.includes(o) || o.collisionArray.includes(i)) return;
  if (i === o || i.master === o || o.master === i || o.master === i.master) return;
  if (i.isDead || o.isDead) return;
  i.collisionArray.push(o);
  o.collisionArray.push(i);
  let v1 = JSON.parse(JSON.stringify({ x: o.vx, y: o.vy }));
  let v2 = JSON.parse(JSON.stringify({ x: i.vx, y: i.vy }));
  i.vx = -v1.x;
  i.vy = -v1.y;
  o.vx = -v2.x;
  o.vy = -v2.y;
};

export { basicCollide, firmCollide }