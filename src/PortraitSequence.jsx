import { useId, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { blobPath } from './organic';

export default function PortraitSequence({ main, alternate, ready, reduced, hovered, locked, suspended, pointer, scrollProgress }) {
  const root=useRef(),windowPath=useRef(),controls=useRef();
  const unique=useId().replaceAll(':','');
  const shapeId=`portrait-window-${unique}`,maskId=`portrait-base-${unique}`,clipId=`portrait-overlay-${unique}`,shadowId=`portrait-shadow-${unique}`;
  useGSAP((context,contextSafe)=>{
    const blob={x:800,y:450,radius:0,phase:0};
    let mode='idle',inView=true,transition,idleTime=0,introPending=true,scrollPaused=false;
    let requested={hovered:false,locked:false,suspended:false};
    const render=()=>{
      const radius=blob.radius*(1-scrollProgress.current.value);
      windowPath.current?.setAttribute('d',blobPath(blob.x,blob.y,radius,radius*1.13,blob.phase));
      root.current.dataset.phase=mode;
      root.current.dataset.radius=radius.toFixed(2);
      root.current.dataset.centerX=blob.x.toFixed(2);
    };
    const stop=()=>{transition?.kill();transition=null;};
    const drift=contextSafe(()=>{
      stop();mode='drift';idleTime=0;
      const bounds=root.current.getBoundingClientRect();
      const left=-bounds.left/bounds.width*1600-420;
      const right=(window.innerWidth-bounds.left)/bounds.width*1600+420;
      gsap.set(blob,{x:left,y:390,radius:310});
      transition=gsap.timeline({repeat:-1,onUpdate:render})
        .to(blob,{x:right,y:590,duration:4.8,ease:'sine.inOut'},0)
        .to(blob,{x:left,y:350,duration:4.8,ease:'sine.inOut'},5.4)
        .to(blob,{y:390,duration:.6,ease:'sine.inOut'},10.2);
    });
    const sync=contextSafe(()=>{
      if(requested.suspended||!inView||document.hidden||scrollProgress.current.value>.02){transition?.pause();return;}
      transition?.resume();
      const moving=performance.now()-(pointer.current.lastMoved||0)<2500;
      const next=requested.locked?'locked':requested.hovered&&moving&&!reduced&&ready?'hover':'idle';
      if(mode===next||(mode==='intro'||mode==='drift')&&next==='idle')return;
      stop();mode=next;idleTime=0;
      if(next==='hover'||next==='locked')introPending=false;
      transition=gsap.to(blob,{radius:next==='locked'?2100:next==='hover'?290:0,duration:reduced?0:next==='idle'?.8:1.2,ease:'expo.inOut',onUpdate:render});
    });
    const tick=(_,delta)=>{
      if(!inView||document.hidden)return;
      const scrolled=scrollProgress.current.value>.02;
      if(scrolled!==scrollPaused){scrollPaused=scrolled;sync();}
      if(!requested.suspended&&!reduced&&!scrolled&&ready){
        blob.phase+=Math.min(delta,40)*.00065;
        const moving=performance.now()-(pointer.current.lastMoved||0)<2500;
        if(mode==='drift'&&requested.hovered&&moving)sync();
        if(mode==='hover'&&!moving)sync();
        if(mode==='idle'&&!introPending){idleTime+=Math.min(delta,40);if(idleTime>1800)drift();}
        if(mode==='hover'){
          const damping=1-Math.exp(-Math.min(delta,40)/160);
          blob.x+=(pointer.current.x-blob.x)*damping;
          blob.y+=(pointer.current.y-blob.y)*damping;
        }else if(mode==='locked'){
          blob.x+=(800-blob.x)*.08;blob.y+=(500-blob.y)*.08;
        }
      }
      render();
    };
    const intro=gsap.delayedCall(1.8,contextSafe(()=>{
      introPending=false;
      if(!ready||reduced||requested.hovered||requested.locked||requested.suspended||!inView||scrollProgress.current.value>.02)return;
      mode='intro';
      transition=gsap.timeline({onUpdate:render,onComplete:()=>{mode='idle';idleTime=0;render();}})
        .to(blob,{radius:270,x:760,y:380,duration:1.2,ease:'expo.inOut'},0)
        .to(blob,{x:940,y:630,duration:2.4,ease:'sine.inOut'},.6)
        .to(blob,{radius:0,duration:1,ease:'expo.inOut'},3.1);
    }));
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting&&entry.intersectionRatio>0;sync();},{threshold:.01});
    observer.observe(root.current);
    document.addEventListener('visibilitychange',sync);
    gsap.ticker.add(tick);
    controls.current=value=>{requested=value;sync();};
    render();
    return()=>{intro.kill();gsap.ticker.remove(tick);observer.disconnect();document.removeEventListener('visibilitychange',sync);controls.current=null;};
  },{scope:root,dependencies:[ready,reduced],revertOnUpdate:true});
  useGSAP(()=>{controls.current?.({hovered,locked,suspended});},{dependencies:[hovered,locked,suspended,ready,reduced]});
  return <svg ref={root} className="portrait-sequence" viewBox="0 0 1600 1000" role="img" aria-label="Ilyass Azyaiz" focusable="false">
    <defs>
      <path ref={windowPath} id={shapeId} d="M0,0Z"/>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000" style={{maskType:'luminance'}}>
        <rect width="1600" height="1000" fill="white"/><use href={`#${shapeId}`} fill="black" stroke="white" strokeWidth="1.5"/>
      </mask>
      <clipPath id={clipId}><use href={`#${shapeId}`}/></clipPath>
      <filter id={shadowId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="14"/>
      </filter>
    </defs>
    <image href={main} width="1600" height="1000" mask={`url(#${maskId})`}/>
    <use href={`#${shapeId}`} fill="none" stroke="#555a56" strokeWidth="24" opacity=".46" filter={`url(#${shadowId})`}/>
    <image href={alternate} width="1600" height="1000" clipPath={`url(#${clipId})`}/>
  </svg>;
}
