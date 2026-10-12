import { useId, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Both photographs share the same 1600 × 1000 coordinate system. Only the
// reveal window moves: translating image fragments would misalign the face.
function slab({ x, y, thickness, angle }) {
  if (thickness < .1) return '';
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians), sin = Math.sin(radians);
  return [[-1800,-thickness/2],[1800,-thickness/2],[1800,thickness/2],[-1800,thickness/2]]
    .map(([px,py],i) => `${i ? 'L' : 'M'}${(x+px*cos-py*sin).toFixed(2)},${(y+px*sin+py*cos).toFixed(2)}`).join(' ')+'Z';
}

export default function PortraitSequence({ main, alternate, ready, reduced, hovered, locked, suspended }) {
  const root = useRef();
  const windowPath = useRef();
  const controls = useRef();
  const unique = useId().replaceAll(':','');
  const shapeId = `portrait-window-${unique}`;
  const maskId = `portrait-base-${unique}`;
  const clipId = `portrait-overlay-${unique}`;

  useGSAP((context, contextSafe) => {
    const scanner = { x:800, y:-250, thickness:0, angle:-6 };
    const strips = Array.from({length:4},()=>({progress:0}));
    let mode = 'idle';
    let requested = { hovered:false, locked:false, suspended:false };
    let inView = true;
    let introDone = false;
    let transition;
    const render = () => {
      const panels = strips.map(({progress},i) => {
        if (progress < .0001) return '';
        const width=1600*progress;
        const x=i%2 ? 1600-width : 0;
        return `M${x},${i*250-.5}h${width}v251h${-width}Z`;
      }).join(' ');
      windowPath.current?.setAttribute('d',`${slab(scanner)} ${panels}`.trim() || 'M0,0Z');
      root.current.dataset.phase=mode;
    };
    const loop = gsap.timeline({paused:true, repeat:-1, onUpdate:render});
    loop.set(scanner,{x:800,y:-250,thickness:190,angle:-6},0)
      .to(scanner,{y:1250,angle:6,duration:2.4,ease:'sine.inOut'},0)
      .set(scanner,{thickness:0},2.4)
      .set(scanner,{x:100,y:500,angle:65,thickness:0},3.05)
      .to(scanner,{thickness:540,duration:.45,ease:'expo.inOut'},3.05)
      .to(scanner,{x:1500,angle:115,duration:1.5,ease:'expo.inOut'},3.05)
      .to(scanner,{x:450,angle:55,duration:1.5,ease:'expo.inOut'},4.75)
      .to(scanner,{thickness:0,duration:1,ease:'expo.inOut'},6.3)
      .set(scanner,{thickness:0},8.3);
    const stopTransition = () => { transition?.kill(); transition=null; };
    const clear = contextSafe(() => {
      loop.pause(); stopTransition(); mode='idle';
      transition=gsap.timeline({onUpdate:render})
        .to(scanner,{thickness:0,duration:reduced?0:.6,ease:'expo.inOut'},0)
        .to(strips,{progress:0,duration:reduced?0:.7,stagger:reduced?0:{each:.09,from:'end'},ease:'expo.inOut'},0);
    });
    const sync = contextSafe(() => {
      const unavailable = !inView || requested.suspended || document.hidden;
      if (unavailable) { loop.pause(); transition?.pause(); return; }
      transition?.resume();
      if (requested.locked) {
        if (mode==='locked') return;
        loop.pause(); stopTransition(); mode='locked';
        transition=gsap.timeline({onUpdate:render})
          .to(scanner,{thickness:0,duration:reduced?0:.35,ease:'power2.out'},0)
          .to(strips,{progress:1,duration:reduced?0:.9,stagger:reduced?0:.1,ease:'expo.inOut'},0);
      } else if (requested.hovered && !reduced && ready) {
        if (mode==='hover') { loop.resume(); return; }
        stopTransition(); gsap.set(strips,{progress:0});
        mode='hover'; introDone=true; loop.restart();
      } else if (mode==='intro' && !introDone) {
        loop.resume();
      } else if (mode!=='idle') clear();
      render();
    });
    const intro = gsap.delayedCall(1.8,contextSafe(() => {
      if (!ready || reduced || requested.locked || requested.hovered || requested.suspended || !inView || document.hidden) return;
      mode='intro'; loop.restart();
    }));
    loop.eventCallback('onRepeat',contextSafe(() => {
      if (mode==='intro') { introDone=true; clear(); }
    }));
    const observer = new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:.1});
    observer.observe(root.current);
    document.addEventListener('visibilitychange',sync);
    controls.current = value => { requested=value; sync(); };
    render();
    return () => { intro.kill(); observer.disconnect(); document.removeEventListener('visibilitychange',sync); controls.current=null; };
  },{scope:root,dependencies:[ready,reduced],revertOnUpdate:true});

  useGSAP(() => { controls.current?.({hovered,locked,suspended}); },{dependencies:[hovered,locked,suspended,ready,reduced]});

  return <svg ref={root} className="portrait-sequence" viewBox="0 0 1600 1000" role="img" aria-label="Ilyass Azyaiz" focusable="false">
    <defs>
      <path ref={windowPath} id={shapeId} d="M0,0Z"/>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000" style={{maskType:'luminance'}}>
        <rect width="1600" height="1000" fill="white"/><use href={`#${shapeId}`} fill="black" stroke="white" strokeWidth="1.5"/>
      </mask>
      <clipPath id={clipId}><use href={`#${shapeId}`}/></clipPath>
    </defs>
    <image href={main} width="1600" height="1000" mask={`url(#${maskId})`}/>
    <image href={alternate} width="1600" height="1000" clipPath={`url(#${clipId})`}/>
  </svg>;
}
