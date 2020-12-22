let basicCollide = (i, o) => {
  if (i.collisionArray.includes(o) || o.collisionArray.includes(i)) return;
  
  i.collisionArray.push(o);
  o.collisionArray.push(i);
  let fasterEntity = o;
  if (Math.abs(i.vx + i.vy) + i.size > Math.abs(o.vx + o.vy) + o.size) fasterEntity = i;
  if (fasterEntity === i) {
    i.vx *= 0.75;
    i.vy *= 0.75;
    o.vx = i.vx * 0.1;
    o.vy = i.vy * 0.1;
  } else {
    o.vx *= 0.75;
    o.vy *= 0.75;
    i.vx = o.vx * 0.1;
    i.vy = o.vy * 0.1;
  }
};

export { basicCollide }