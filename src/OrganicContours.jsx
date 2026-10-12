import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { contourField } from './contourField';

export default function OrganicContours({ reduced, suspended, pointer }) {
  const root=useRef();
  const blocked=useRef(suspended);
  blocked.current=suspended;
  useGSAP(()=>{
    const paths=Array.from(root.current.querySelectorAll('path'));
    let phase=.3, inView=true,elapsed=0;
    const center={x:0,y:0};
    const draw=()=>contourField(phase,center.x,center.y).forEach((d,i)=>paths[i].setAttribute('d',d));
    const tick=(_,delta)=>{
      if(!inView||blocked.current||document.hidden||reduced)return;
      elapsed+=Math.min(delta,50);
      if(elapsed<33)return;
      phase+=elapsed*.00038;
      const damping=1-Math.exp(-elapsed/800);
      center.x+=((pointer.current.x-800)*.00025-center.x)*damping;
      center.y+=((pointer.current.y-500)*.0003-center.y)*damping;
      elapsed=0;
      draw();
    };
    draw();
    if(!reduced)gsap.ticker.add(tick);
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting&&entry.intersectionRatio>0;},{threshold:.001});
    observer.observe(root.current);
    return()=>{gsap.ticker.remove(tick);observer.disconnect();};
  },{scope:root,dependencies:[reduced],revertOnUpdate:true});
  return <svg ref={root} className="organic-contours" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">{Array.from({length:8},(_,i)=><path key={i} stroke="currentColor" strokeWidth="1"/>)}</svg>;
}
