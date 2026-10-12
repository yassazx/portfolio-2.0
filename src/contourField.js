// Isolines of a slowly evolving, warped scalar field. Unlike nested circles,
// this produces separate islands and open meanders like a topographic map.
const pairs=[[],[[3,0]],[[0,1]],[[3,1]],[[1,2]],[[3,2],[0,1]],[[0,2]],[[3,2]],[[2,3]],[[0,2]],[[0,3],[1,2]],[[1,2]],[[1,3]],[[0,1]],[[3,0]],[]];
const levels=[-1.65,-1.2,-.75,-.3,.15,.6,1.05,1.5];
function smooth(points,closed){
  if(points.length<3)return '';
  const pair=p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const middle=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  // Approximating quadratics avoid tiny loops where a contour passes very
  // close to a grid corner and successive sampled points nearly coincide.
  let d=`M${pair(closed?middle(points.at(-1),points[0]):points[0])}`;
  for(let i=closed?0:1;i<(closed?points.length:points.length-1);i++)
    d+=`Q${pair(points[i])} ${pair(middle(points[i],points[(i+1)%points.length]))}`;
  if(!closed)d+=`L${pair(points.at(-1))}`;
  return d+(closed?'Z':'');
}
export function contourField(time,offsetX=0,offsetY=0){
  const columns=40,rows=28,step=42;
  const values=Array.from({length:(columns+1)*(rows+1)},(_,i)=>{
    const x=(i%(columns+1)*step-100)/1440*5.2-2.6+offsetX;
    const y=(Math.floor(i/(columns+1))*step-100)/900*3.8-1.9+offsetY;
    const u=x+.5*Math.sin(y*1.4+time*.7);
    const v=y+.38*Math.sin(x*1.7-time*.5);
    return Math.sin(u*1.65+time*.5)+.72*Math.cos(v*2.1-time*.6)+.48*Math.sin(u*1.25+v*1.75+time*.4)+.26*Math.cos(u*2.8-v*1.4-time*.7);
  });
  return levels.map(level=>{
    const nodes=new Map();
    for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
      const ids=[y*(columns+1)+x,y*(columns+1)+x+1,(y+1)*(columns+1)+x+1,(y+1)*(columns+1)+x];
      const corners=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]];
      const v=ids.map(id=>values[id]);
      const index=v.reduce((bits,value,i)=>bits|(value>level?1<<i:0),0);
      const segments=(index===5||index===10)&&v.reduce((a,b)=>a+b)/4>level?pairs[index===5?10:5]:pairs[index];
      const edge=e=>{
        const next=(e+1)%4;
        const key=ids[e]<ids[next]?`${ids[e]}:${ids[next]}`:`${ids[next]}:${ids[e]}`;
        if(!nodes.has(key)){
          const t=(level-v[e])/(v[next]-v[e]);
          nodes.set(key,{point:[(corners[e][0]+(corners[next][0]-corners[e][0])*t)*step-100,(corners[e][1]+(corners[next][1]-corners[e][1])*t)*step-100],neighbors:[]});
        }
        return key;
      };
      segments.forEach(([a,b])=>{const one=edge(a),two=edge(b);nodes.get(one).neighbors.push(two);nodes.get(two).neighbors.push(one);});
    }
    const visited=new Set(),paths=[];
    const trace=start=>{
      if(visited.has(start))return;
      const points=[];let current=start,previous,closed=false;
      while(current&&!visited.has(current)){
        visited.add(current);const node=nodes.get(current);points.push(node.point);
        const next=node.neighbors.find(n=>n!==previous);
        previous=current;current=next;if(current===start){closed=true;break;}
      }
      paths.push(smooth(points,closed));
    };
    for(const [key,node] of nodes)if(node.neighbors.length===1)trace(key);
    for(const key of nodes.keys())trace(key);
    return paths.join(' ');
  });
}
