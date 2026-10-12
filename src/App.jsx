import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Arrow, Contours, Monogram, Project, RevealTitle, RollText, Signature } from './components.jsx';
import { projects, skills } from './data.js';
import mainPortrait from '../main.png';
import hoverPortrait from '../hover.png';
import PortraitSequence from './PortraitSequence.jsx';
import OrganicContours from './OrganicContours.jsx';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const email = 'ilyassazetd@gmail.com';
const linkedIn = 'https://www.linkedin.com/in/ilyass-azyaiz-768689292/';
const cvPath = '/Ilyass-Azyaiz-CV.pdf';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const m = window.matchMedia('(prefers-reduced-motion: reduce)'); const sync = () => setReduced(m.matches); m.addEventListener('change', sync); return () => m.removeEventListener('change', sync); }, []);
  return reduced;
}

function Splash({ onComplete, reduced }) {
  const ref = useRef();
  const number = useRef();
  useGSAP((context, contextSafe) => {
    let cancelled = false;
    let completed = false;
    const progress = { value: 0 };
    const updateProgress = contextSafe((value) => gsap.to(progress, { value, duration: reduced ? 0 : .35, ease: 'power2.out', onUpdate: () => { if (number.current) number.current.textContent = String(Math.round(progress.value)).padStart(3, '0'); } }));
    const finish = contextSafe(() => {
      if (cancelled || completed) return;
      completed = true;
      updateProgress(100);
      gsap.timeline({ onComplete }).to('.splash-mark', { scale: .75, rotation: -10, autoAlpha: 0, duration: reduced ? .1 : .45, ease: 'power3.in' }, .18).to('.splash-meta, .splash-footer', { autoAlpha: 0, y: -12, duration: reduced ? .1 : .35 }, .2).to(ref.current, { yPercent: -105, borderBottomLeftRadius: '45%', borderBottomRightRadius: '45%', duration: reduced ? .15 : .9, ease: 'power4.inOut' }, reduced ? .15 : .45);
    });
    if (!reduced) gsap.from('.splash-mark', { scale: .5, rotation: -25, autoAlpha: 0, duration: .9, ease: 'expo.out' });
    let loaded = 0;
    const resources = [mainPortrait, hoverPortrait].map(src => new Promise(resolve => { const img = new Image(); img.src = src; img.decode().catch(() => {}).finally(() => { loaded++; if (!cancelled) updateProgress(loaded * 35); resolve(); }); }));
    const minimum = new Promise(resolve => setTimeout(resolve, reduced ? 0 : 1300));
    Promise.allSettled([...resources, document.fonts.ready, minimum]).then(() => finish());
    const timeout = setTimeout(finish, 4500);
    ref.current.querySelector('button').addEventListener('click', finish);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, { scope: ref });
  return <div ref={ref} className="splash" role="status" aria-label="Loading Ilyass Azyaiz portfolio"><div className="splash-meta"><span>ILYASS AZYAIZ</span><span>SOFTWARE ENGINEER</span></div><div className="splash-mark"><Monogram/><span>HELLO, WORLD.</span></div><div className="splash-footer"><span>LOADING ILYASS <span ref={number} className="splash-number">000</span><span aria-hidden="true">%</span></span><button type="button">SKIP INTRO <Arrow/></button></div></div>;
}

function Header({ ready, menuOpen, setMenuOpen, dark, reduced }) {
  const menu = useRef();
  const toggle = useRef();
  const menuTl = useRef();
  const wasOpen = useRef(false);
  useGSAP(() => {
    menuTl.current = gsap.timeline({ paused: true, onReverseComplete: () => gsap.set(menu.current, { visibility: 'hidden' }) }).fromTo(menu.current, { clipPath: 'ellipse(110% 0% at 50% 0%)' }, { clipPath: 'ellipse(110% 150% at 50% 0%)', duration: reduced ? .01 : .8, ease: 'power4.inOut' }).fromTo('.menu-link', { yPercent: 110, rotate: 3 }, { yPercent: 0, rotate: 0, duration: reduced ? .01 : .7, stagger: reduced ? 0 : .07, ease: 'expo.out' }, reduced ? 0 : .25).fromTo('.menu-portrait', { y: 55, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: reduced ? .01 : .7 }, reduced ? 0 : .25);
  }, { scope: menu, dependencies: [reduced], revertOnUpdate: true });
  useEffect(() => {
    if (menuOpen) {
      gsap.set(menu.current, { visibility: 'visible' });
      menuTl.current?.timeScale(1).play();
      const id = setTimeout(() => menu.current?.querySelector('a')?.focus({ preventScroll: true }), reduced ? 10 : 700);
      return () => clearTimeout(id);
    }
    menuTl.current?.timeScale(1.25).reverse();
    if (wasOpen.current) toggle.current?.focus({ preventScroll: true });
    wasOpen.current = false;
  }, [menuOpen, reduced]);
  useEffect(() => {
    if (!menuOpen) return;
    wasOpen.current = true;
    function keyboard(e) {
      if (e.key === 'Escape') setMenuOpen(false);
      if (e.key === 'Tab') {
        const items = [toggle.current, ...menu.current.querySelectorAll('a, button')];
        const index = items.indexOf(document.activeElement);
        if (e.shiftKey && index <= 0) { e.preventDefault(); items.at(-1).focus(); }
        else if (!e.shiftKey && index === items.length-1) { e.preventDefault(); items[0].focus(); }
      }
    }
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, [menuOpen, setMenuOpen]);
  const navigate = (e, id) => {
    e.preventDefault(); setMenuOpen(false);
    window.setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }); history.replaceState(null, '', `#${id}`); }, reduced ? 30 : 600);
  };
  return <>
    <header className={`header ${dark && !menuOpen ? 'header-light' : ''} ${menuOpen ? 'menu-is-open' : ''}`} inert={!ready}>
      <a className="wordmark" href="#home" aria-label="Ilyass Azyaiz, home" onClick={e=>navigate(e, 'home')}><span>ILYASS</span><strong>AZYAIZ</strong></a>
      <a className="header-mark" href="#home" aria-label="Back to top" onClick={e=>navigate(e, 'home')}><Monogram/></a>
      <div className="header-actions"><a className="button contact-button" href={`mailto:${email}`}><RollText>LET’S TALK</RollText><Arrow/></a><button ref={toggle} className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><span/><span/></button></div>
    </header>
    <div id="site-menu" ref={menu} className={`menu ${menuOpen ? 'is-open' : ''}`} inert={!menuOpen} aria-hidden={!menuOpen}>
      <Contours/>
      <div className="menu-portrait"><img src={hoverPortrait} alt=""/><span>CASABLANCA, MOROCCO<br/>BUILDING BEYOND THE OBVIOUS.</span></div>
      <nav aria-label="Main navigation">{[['home','Home'],['about','About'],['work','The work'],['background','Background'],['contact','Contact']].map(([id,label])=><div className="menu-link-mask" key={id}><a className="menu-link" href={`#${id}`} onClick={e=>navigate(e,id)}>{label}<Arrow/></a></div>)}</nav>
      <div className="menu-bottom"><a href={`mailto:${email}`}>{email}</a><a href={cvPath} download><RollText>DOWNLOAD CV</RollText><Arrow/></a></div>
    </div>
  </>;
}

function Hero({ ready, reduced, suspended }) {
  const ref = useRef();
  const stage = useRef();
  const portrait = useRef();
  const pointer = useRef({x:800,y:450});
  const scrollProgress = useRef({value:0});
  const [transitioning, setTransitioning] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [locked, setLocked] = useState(false);
  const pointerFns = useRef(null);
  useGSAP(() => {
    if (!ready) return;
    if (!reduced) {
      gsap.from('.portrait-sequence', { yPercent: 12, scale: 1.09, duration: 1.45, ease: 'expo.out' });
      gsap.from('.hero-detail, .hero-bottom', { autoAlpha: 0, y: 20, duration: .9, delay: .35, ease: 'power3.out' });
      pointerFns.current = { x: gsap.quickTo(portrait.current, 'x', { duration: .8, ease: 'power3.out' }), y: gsap.quickTo(portrait.current, 'y', { duration: .8, ease: 'power3.out' }), rotation: gsap.quickTo(portrait.current, 'rotation', { duration: .8, ease: 'power3.out' }) };
      const frame=ref.current.querySelector('.hero-portrait-reveal');
      const targetWidth=()=>Math.min(window.innerWidth<768?window.innerWidth*.82:window.innerWidth*.48,520,stage.current.clientHeight*.95);
      const strokes=ref.current.querySelectorAll('.signature-scene .signature-mark path');
      strokes.forEach(path=>gsap.set(path,{autoAlpha:0,strokeDasharray:path.getTotalLength(),strokeDashoffset:path.getTotalLength()}));
      let active=false;
      const progress=scrollProgress.current;
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
        id:'hero-signature',trigger:ref.current,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true,
        onUpdate:self=>{
          stage.current.dataset.progress=self.progress.toFixed(3);
          const next=self.progress>.08;
          if(next!==active){active=next;setTransitioning(next);}
        },
      }})
        .to(progress,{value:1,duration:.78},0)
        .to(stage.current,{backgroundColor:'#292f22',duration:.6},0)
        .to('.organic-contours',{color:'#70834b',opacity:.34,duration:.65},0)
        .fromTo('.hero-detail, .hero-bottom',{autoAlpha:1,y:0},{autoAlpha:0,y:-30,duration:.16,immediateRender:false},0)
        .to(frame,{scale:()=>targetWidth()/frame.offsetWidth,y:()=>stage.current.clientHeight*.52+targetWidth()*.625/2-stage.current.clientHeight-2,backgroundColor:'#626957',duration:.7,ease:'power1.inOut'},0)
        .to('.portrait-sequence',{filter:'grayscale(1)',opacity:.65,duration:.7},0)
        .fromTo('.signature-scene',{autoAlpha:0},{autoAlpha:1,duration:.2},.38)
        .fromTo('.signature-line-one',{xPercent:15},{xPercent:-12,duration:.6},.4)
        .fromTo('.signature-line-two',{xPercent:-15},{xPercent:12,duration:.6},.4)
        .to(strokes,{autoAlpha:1,duration:.03,stagger:.055},.55)
        .to(strokes,{strokeDashoffset:0,duration:.36,stagger:.055,ease:'power1.inOut'},.55);
    }
    return () => { pointerFns.current = null; scrollProgress.current.value=0; };
  }, { scope: ref, dependencies: [ready, reduced], revertOnUpdate: true });
  function move(e) {
    if (e.pointerType !== 'mouse' || reduced) return;
    const box = stage.current.getBoundingClientRect();
    const imageBox=portrait.current.querySelector('svg').getBoundingClientRect();
    pointer.current={x:(e.clientX-imageBox.left)/imageBox.width*1600,y:(e.clientY-imageBox.top)/imageBox.height*1000,lastMoved:performance.now()};
    const x = (e.clientX-box.left)/box.width-.5;
    const y = (e.clientY-box.top)/box.height-.5;
    const weight=1-scrollProgress.current.value;
    pointerFns.current?.x(x*25*weight); pointerFns.current?.y(y*10*weight); pointerFns.current?.rotation(x*1.5*weight);
  }
  const togglePortrait = () => { setHovered(false); setLocked(value=>!value); };
  return <section ref={ref} className={`hero-journey ${reduced?'is-reduced':''}`} id="home"><div ref={stage} className="hero" onPointerMove={move} onPointerLeave={()=>{pointerFns.current?.x(0);pointerFns.current?.y(0);pointerFns.current?.rotation(0);}}>
    <OrganicContours reduced={reduced} suspended={suspended} pointer={pointer}/>
    <div className="hero-detail hero-intro"><span>SOFTWARE ENGINEER</span><span>CURIOUS BY NATURE.<br/>ENGINEER BY TRAINING.</span></div>
    <h1 className="hero-name" aria-label="Ilyass Azyaiz"/>
    <div className="hero-portrait-reveal"><div ref={portrait} className="hero-portrait" onPointerEnter={e=>{if(e.pointerType==='mouse')setHovered(true);}} onPointerLeave={e=>{if(e.pointerType==='mouse')setHovered(false);}}><PortraitSequence main={mainPortrait} alternate={hoverPortrait} ready={ready} reduced={reduced} hovered={hovered&&!transitioning} locked={locked} suspended={suspended} pointer={pointer} scrollProgress={scrollProgress}/></div></div>
    <div className="signature-scene" aria-hidden="true"><div className="signature-intro"><Monogram/><span>A NOTE FROM ILYASS</span></div><div className="signature-marquee"><div className="signature-line-one">CURIOUS BY NATURE. CURIOUS BY NATURE.</div><div className="signature-line-two">ENGINEER BY TRAINING. ENGINEER BY TRAINING.</div></div><Signature/></div>
    <div className="hero-detail hero-location"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="15"/><ellipse cx="20" cy="20" rx="7" ry="15"/><path d="M5 20h30M8 11h24M8 29h24"/></svg><span>BASED IN<br/>CASABLANCA, MA</span></div>
    <div className="hero-bottom" inert={transitioning&&!reduced}><a href="#about" className="scroll-cue"><span>SCROLL TO EXPLORE</span><span className="cue-arrow"><Arrow direction="down"/></span></a><button className="portrait-switch" onClick={togglePortrait} aria-pressed={locked}><span>{locked ? 'BACK TO CASUAL' : 'SWITCH TO WORK MODE'}</span><span className="switch-track"><i/></span><span className="switch-arrow"><Arrow/></span></button></div>
  </div>{reduced&&<div className="signature-static dark-section"><p>CURIOUS BY NATURE.<br/>ENGINEER BY TRAINING.</p><img src={mainPortrait} alt=""/><Signature/></div>}</section>;
}

function About() {
  return <section className="about dark-section" id="about"><Contours/><div className="about-symbol"><Monogram/><span>HELLO. I’M ILYASS.</span></div><RevealTitle className="manifesto">A CURIOUS MIND.<br/>A <em>BUILDER</em> AT HEART.<br/>FROM FIRST LINE<br/>TO <em>FINAL DEPLOY.</em></RevealTitle><div className="about-copy"><span className="about-flourish" aria-hidden="true">ia.</span><p>I’m a software engineer based in Casablanca, working at the intersection of software, data, and cloud. I like connecting the pieces—thoughtful interfaces, useful data, and reliable systems.</p><p>From full-stack applications to automated delivery pipelines, I turn complex problems into things that work.</p></div></section>;
}

function Work({ ready, reduced }) {
  const ref = useRef();
  const rail = useRef();
  const scrollTween = useRef();
  const focusFrame = useRef();
  useGSAP(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => rail.current.scrollWidth - ref.current.clientWidth;
      scrollTween.current = gsap.to(rail.current, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${distance()}`, scrub: .65, pin: true, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: self => gsap.set('.work-progress-line', { scaleX: self.progress }) } });
      return () => { scrollTween.current = null; cancelAnimationFrame(focusFrame.current); ref.current.scrollLeft = 0; };
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [ready, reduced], revertOnUpdate: true });
  function syncProjectFocus(event) {
    if (!scrollTween.current) return;
    const project = event.target.closest('.project');
    const index = Array.from(rail.current.children).indexOf(project);
    if (index < 0) return;
    cancelAnimationFrame(focusFrame.current);
    // Native focus may scroll the clipped container after focus dispatch.
    focusFrame.current = requestAnimationFrame(() => {
      const tween = scrollTween.current;
      if (!tween) return;
      const trigger = tween.scrollTrigger;
      const progress = index / (projects.length - 1);
      ref.current.scrollLeft = 0;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' });
      ScrollTrigger.update();
      trigger.getTween()?.progress(1);
      tween.progress(progress);
    });
  }
  return <section className="work" id="work"><div className="section-heading"><RevealTitle>THE WORK.<br/><em>THE PROGRESS.</em></RevealTitle><p>Three chapters. Three different challenges.<br/>A little more capable with every one.</p></div><div ref={ref} className="work-stage"><div ref={rail} className="work-rail" onFocusCapture={syncProjectFocus}>{projects.map((project,index)=><Project key={project.id} project={project} index={index}/>)}</div><div className="work-progress" aria-hidden="true"><span className="work-progress-line"/></div></div></section>;
}

function Background() {
  return <>
    <section className="expertise dark-section" id="expertise"><Contours/><div className="section-heading"><RevealTitle>DIFFERENT TOOLS.<br/><em>ONE MINDSET.</em></RevealTitle><p>Understand the problem.<br/>Build the right thing.<br/>Make it work beautifully.</p></div><div className="skills-grid">{skills.map((s,i)=><article className="skill" key={s.title}><div className="skill-symbol" aria-hidden="true">{i===0?<span>&lt;/&gt;</span>:i===1?<svg viewBox="0 0 100 100"><path d="M15 25h28v20H15Zm42 30h28v20H57ZM29 45v20h28M43 35h28v20" fill="none" stroke="currentColor" strokeWidth="3"/></svg>:<svg viewBox="0 0 100 100"><path d="m20 68 30-45 30 45M33 49h34M20 78h60" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="50" cy="23" r="7" fill="currentColor"/></svg>}</div><h3>{s.title}<span>.</span></h3><p>{s.subtitle}</p><ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div></section>
    <section className="background" id="background"><div className="background-title"><RevealTitle>ALWAYS<br/><em>LEARNING.</em></RevealTitle><p>Strong foundations.<br/>An appetite for what comes next.</p><a className="button" href={cvPath} download><RollText>DOWNLOAD MY CV</RollText><Arrow/></a></div><div className="credentials"><div className="credential-group"><h3>EDUCATION</h3><article><span>2021 — 2026</span><h4>State Engineer in<br/>Computer Engineering</h4><p>ENSA Berrechid</p></article><article><span>2023 — 2024</span><h4>Software Engineering</h4><p>ALX · Casablanca</p></article></div><div className="credential-group certifications"><h3>CERTIFICATIONS</h3><article><span>JUNE 2025</span><h4>AWS Cloud Practitioner</h4></article><article><span>MAY 2025</span><h4>GitHub Foundations</h4></article><article><span>OCTOBER 2024</span><h4>Oracle Cloud Infrastructure<br/>Foundations Associate</h4></article></div></div><div className="languages"><span>GOOD CONVERSATIONS, IN</span><div><span>English</span><span>Français</span><span>العربية</span></div></div></section>
  </>;
}

function Contact({ replay }) {
  const [copyState,setCopyState] = useState('COPY EMAIL');
  const reset = useRef();
  useEffect(()=>()=>clearTimeout(reset.current),[]);
  const copy = async () => { try { await navigator.clipboard.writeText(email); setCopyState('COPIED!'); } catch { setCopyState('SELECT EMAIL TO COPY'); } clearTimeout(reset.current); reset.current=setTimeout(()=>setCopyState('COPY EMAIL'),2500); };
  return <footer className="contact" id="contact"><div className="contact-surface dark-section"><Contours/><Monogram className="footer-mark"/><RevealTitle>LET’S BUILD<br/>SOMETHING <em>GOOD.</em></RevealTitle><div className="contact-links"><div><p>HAVE SOMETHING IN MIND?</p><a className="email-link" href={`mailto:${email}`}>{email}<Arrow/></a><a className="linkedin-link" href={linkedIn} target="_blank" rel="noopener noreferrer">LINKEDIN <Arrow/></a><button className="copy-email" onClick={copy} aria-live="polite">{copyState}<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/></svg></button></div><a className="button" href={cvPath} download><RollText>GET MY CV</RollText><Arrow/></a></div><div className="footer-name" aria-hidden="true">ILYASS <em>AZYAIZ</em></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ILYASS AZYAIZ</span><button onClick={replay}>REPLAY INTRO</button><a href="#home">BACK TO TOP <Arrow/></a></div></div></footer>;
}

export default function App() {
  const ref = useRef();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const reduced = useReducedMotion();
  const finish = useCallback(()=>setReady(true),[]);
  useEffect(() => { document.documentElement.style.overflow = !ready || menuOpen ? 'hidden' : ''; return () => { document.documentElement.style.overflow = ''; }; }, [ready,menuOpen]);
  useGSAP(() => {
    if (!ready) return;
    const sections = gsap.utils.toArray('.dark-section');
    const syncHeader = () => { const hero=ref.current.querySelector('.hero');const r=hero.getBoundingClientRect();const heroDark=Number(hero.dataset.progress)>.35&&r.top<=55&&r.bottom>55;setDark(heroDark||sections.some(section => {const rect=section.getBoundingClientRect();return rect.top<=55&&rect.bottom>55;})); };
    const themeTrigger = ScrollTrigger.create({ start:0, end:'max', onUpdate:syncHeader });
    syncHeader();
    if (!reduced) {
      gsap.utils.toArray('.reveal-title').forEach(title => {
        const lines = title.querySelectorAll('.title-line-inner');
        const wipes = title.querySelectorAll('.title-wipe');
        gsap.timeline({ scrollTrigger: { trigger: title, start: 'top 91%', once: true } })
          .fromTo(wipes, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: .4, stagger: .08, ease: 'power3.inOut' }, 0)
          .fromTo(lines, { clipPath: 'inset(0 100% 0 0)', yPercent: 15 }, { clipPath: 'inset(0 0% 0 0)', yPercent: 0, duration: .7, stagger: .08, ease: 'expo.out' }, .35)
          .to(wipes, { scaleX: 0, transformOrigin: 'right', duration: .7, stagger: .08, ease: 'expo.out' }, .4);
      });
      gsap.from('.about-symbol', { scale:.7, rotation:-18, autoAlpha:0, duration:.9, ease:'expo.out',scrollTrigger:{trigger:'.about',start:'top 70%',once:true} });
      gsap.to('.about .contours', { yPercent:15, ease:'none',scrollTrigger:{trigger:'.about',start:'top bottom',end:'bottom top',scrub:true} });
      gsap.from('.skill', { y:65,autoAlpha:0,duration:1,stagger:.12,ease:'expo.out',scrollTrigger:{trigger:'.skills-grid',start:'top 85%',once:true} });
      gsap.from('.contact-surface', { y:90, duration:1,ease:'expo.out',scrollTrigger:{trigger:'.contact',start:'top 85%',once:true} });
    }
    const refresh = requestAnimationFrame(()=>ScrollTrigger.refresh());
    return ()=>{cancelAnimationFrame(refresh);themeTrigger.kill();};
  }, { scope:ref,dependencies:[ready,reduced],revertOnUpdate:true });
  return <div ref={ref} className={`portfolio ${ready?'is-ready':''}`}>
    <a className="skip-link" href="#about" inert={!ready||menuOpen}>Skip to content</a>
    <Header ready={ready} menuOpen={menuOpen} setMenuOpen={setMenuOpen} dark={dark} reduced={reduced}/>
    <main inert={!ready||menuOpen}><Hero ready={ready} reduced={reduced} suspended={menuOpen||!ready}/><About/><Work ready={ready} reduced={reduced}/><Background/></main>
    <div inert={!ready||menuOpen}><Contact replay={()=>{window.scrollTo({top:0,behavior:'instant'});setReady(false);}}/></div>
    {!ready&&<Splash onComplete={finish} reduced={reduced}/>}
  </div>;
}
