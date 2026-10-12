// Closed Catmull–Rom spline with matching control points on every frame.
export function blobPath(cx, cy, rx, ry, phase = 0, seed = 0) {
  if (rx < .1 || ry < .1) return 'M0,0Z';
  const count=12;
  const points=Array.from({length:count},(_,i)=>{
    const a=i/count*Math.PI*2;
    const r=1+.14*Math.sin(3*a+phase+seed)+.075*Math.cos(2*a-phase*.7+seed)+.045*Math.sin(5*a+phase*.5);
    return [cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r];
  });
  const pair=p=>`${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  let d=`M${pair(points[0])}`;
  points.forEach((p,i)=>{
    const prev=points[(i+count-1)%count],next=points[(i+1)%count],after=points[(i+2)%count];
    d+=`C${pair([p[0]+(next[0]-prev[0])/6,p[1]+(next[1]-prev[1])/6])} ${pair([next[0]-(after[0]-p[0])/6,next[1]-(after[1]-p[1])/6])} ${pair(next)}`;
  });
  return `${d}Z`;
}
