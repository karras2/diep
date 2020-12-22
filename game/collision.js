let basicCollide = (i, o) => {
  let fasterEntity = o;
  if (Math.abs(i.vx + i.vy) + i.size > Math.abs(o.vx + o.vy) + o.size) fasterEntity = i;
};