import { Children, isValidElement, useEffect, useRef, useState } from 'react';

export function Arrow({ direction = 'up-right', className = '' }) {
  return <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={direction === 'down' ? { transform: 'rotate(135deg)' } : undefined}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Monogram({ className = '' }) {
  return <svg className={`monogram ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path className="mark-i" d="m23 16-12 48h10l12-48H23Z" fill="currentColor"/><path className="mark-a" d="m43 16-23 48h11l5-12h19l1 12h11l-7-48H43Zm-3 27 9-20h2l3 20H40Z" fill="currentColor"/></svg>;
}

export function Signature({ className = '' }) {
  return <svg className={`signature-mark ${className}`} viewBox="0 0 900 400" fill="none" aria-label="Ilyass Azyaiz signature mark" role="img"><g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M90 277C218 178 595 66 757 72C865 76 623 240 273 296C102 324 95 306 225 245M528 35C449 134 342 301 304 365"/>
    <path d="M364 275C407 213 475 151 468 187L418 307C486 209 584 117 574 167L531 265C555 253 594 216 610 219C626 223 573 261 597 252L675 210"/>
    <path d="M243 316C427 281 632 224 811 229"/>
  </g></svg>;
}

export function Contours({ className = '' }) {
  return <svg className={`contours ${className}`} viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1">
    <path d="M-120 124C44-122 352-20 331 179S84 544 240 704s403 32 486 118 32 285 260 282M-40 194C95 13 268 34 249 187S86 482 297 638s384 27 489 137 77 244 258 244"/>
    <path d="M112 110c68-68 118-7 105 70S89 333 69 261s-13-95 43-151Zm389-249C704 54 613 177 760 230s287-53 358 73-66 221 105 281 244-39 336 36"/>
    <path d="M538-67c139 174 83 253 231 361s287-81 315 80-39 160 112 263 277-54 350 110M631-13c47 143 144 162 245 111s215-96 229 42 199 90 342 59"/>
    <path d="M589 458c105-134 198-14 205 111S937 748 978 878s-113 216-227 81S558 810 454 795s-135-113-67-181 135-63 202-156Z"/>
    <path d="M614 536c66-62 123-16 110 55s49 115 125 184 99 163 32 166-89-85-178-141-224-42-224-114 75-94 135-150Z"/>
    <path d="M-44 851c122-129 268-42 261 66s-16 169-135 178M1146-28c-7 167 80 116 186 188s131 213 215 228M1104 808c-26-91 65-133 148-77s-13 85 27 175 135 127 134 192M376 329c54-82 163-42 146 39s-146 112-164 56 0-68 18-95Z"/>
  </g></svg>;
}

export function RollText({ children }) {
  return <span className="roll-text"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

export function ProjectVisual({ type }) {
  if (type === 'quality') return <div className="project-visual pipeline-visual" aria-label="Diagram of a continuous delivery quality pipeline">
    <div className="diagram-top"><span>DELIVERY PIPELINE</span><span className="status-dot">QUALITY FIRST</span></div>
    <div className="pipeline-line"><div className="pipeline-node"><span className="node-icon">&lt;/&gt;</span><span>COMMIT</span></div><span className="connector"/><div className="pipeline-node"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 16 8v22L24 43 8 35V13Zm0 0v38M8 13l16 10 16-10" fill="none" stroke="currentColor" strokeWidth="2"/></svg><span>BUILD</span></div><span className="connector"/><div className="pipeline-node node-accent"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 16 6v14c0 9-16 18-16 18S8 34 8 25V11Z M16 24l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2"/></svg><span>VERIFY</span></div><span className="connector"/><div className="pipeline-node"><Arrow/><span>DELIVER</span></div></div>
    <div className="pipeline-checks"><span><i/> Static analysis</span><span><i/> Quality gates</span><span><i/> E2E regression</span></div>
    <div className="diagram-bottom"><span>CONTAINERIZED TESTING</span><span>AUTOMATED AT EVERY STEP</span></div>
  </div>;
  if (type === 'data') return <div className="project-visual data-visual" aria-label="Diagram of the data reporting project: approximately 20,000 records per day, 12 KPIs, three dashboards">
    <div className="diagram-top"><span>THE REPORTING PICTURE</span><span>PYTHON → SQL → POWER BI</span></div>
    <div className="data-main"><span className="data-number">20<span>K</span></span><span>RECORDS<br/>PER DAY</span><svg viewBox="0 0 200 100" aria-hidden="true"><path d="M0 85 20 70 40 77 60 50 80 55 100 34 120 44 140 17 160 25 180 7 200 13" fill="none" stroke="currentColor" strokeWidth="3"/>{[0,1,2,3,4,5,6,7,8,9].map(i=><rect key={i} x={i*20} y={100-(i*7+13)} width="8" height={i*7+13} fill="currentColor" opacity=".13"/>)}</svg></div>
    <div className="data-bottom"><div><strong>12</strong><span>KEY INDICATORS</span></div><div><strong>3</strong><span>DASHBOARDS</span></div><div><strong>4h <Arrow/> 30m</strong><span>WEEKLY REPORTING</span></div></div>
  </div>;
  return <div className="project-visual software-visual" aria-label="Architecture diagram of the internal resource tracking application">
    <div className="diagram-top"><span>RESOURCE TRACKING</span><span>FULL-STACK APPLICATION</span></div>
    <div className="architecture"><div className="architecture-layer layer-ui"><span>01 / INTERFACE</span><strong>Angular</strong><div className="interface-lines"><i/><i/><i/></div></div><div className="architecture-layer layer-api"><span>02 / APPLICATION</span><strong>Spring Boot</strong><span className="api-code">GET / resources <Arrow/></span></div><div className="architecture-layer layer-data"><span>03 / CONNECTION</span><strong>REST APIs</strong><span className="braces">&#123; &#125;</span></div></div>
    <div className="diagram-bottom"><span>JAVA + ANGULAR</span><span>ONE CONNECTED WORKFLOW</span></div>
  </div>;
}

export function Project({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const details = useRef();
  const toggle = useRef();
  useEffect(() => {
    if (!expanded) return;
    const frame = requestAnimationFrame(() => {
      const panel = details.current;
      panel.focus({ preventScroll: true });
      const rect = panel.getBoundingClientRect();
      if (rect.top < 90 || rect.bottom > window.innerHeight - 20) {
        window.scrollTo({ top: window.scrollY + rect.top - 90, behavior: 'instant' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [expanded]);
  const closeDetails = () => {
    setExpanded(false);
    toggle.current.focus();
  };
  return <article className={`project project-${project.id}`} id={`work-${project.id}`}>
    <div className="project-meta"><span>{project.company} <span className="meta-divider">/</span> {project.year}</span><span>{project.discipline}</span></div>
    <div className="project-visual-wrap"><ProjectVisual type={project.id}/>
    <div ref={details} className={`project-details ${expanded ? 'expanded' : ''}`} id={`details-${project.id}`} role="region" aria-label={`${project.company} project details`} tabIndex={expanded ? 0 : -1} inert={!expanded} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); closeDetails(); } }}><div><p><strong>{project.role}</strong> · {project.date}</p><p>{project.details}</p><ul className="tech-list">{project.stack.map(s=><li key={s}>{s}</li>)}</ul></div></div>
    </div>
    <div className="project-copy"><div><h3>{project.title[0]}<br/><em>{project.title[1]}</em></h3></div><div className="project-description"><p>{project.description}</p><button ref={toggle} className="detail-toggle" aria-expanded={expanded} aria-controls={`details-${project.id}`} onClick={() => setExpanded(!expanded)}><RollText>{expanded ? 'CLOSE DETAILS' : 'EXPLORE THE WORK'}</RollText><span className={`plus ${expanded ? 'is-open' : ''}`} aria-hidden="true"/></button></div></div>
    <span className="project-index" aria-label={`Project ${index+1} of 3`}>0{index+1} <span>/ 03</span></span>
  </article>;
}

export function RevealTitle({ children, className = '', as: Tag = 'h2' }) {
  const lines = [[]];
  Children.toArray(children).forEach(child => {
    if (isValidElement(child) && child.type === 'br') lines.push([]);
    else lines.at(-1).push(child);
  });
  return <Tag className={`reveal-title ${className}`}>{lines.map((line, index) => <span className="title-line" key={index}><span className="title-line-inner">{line}</span><span className="title-wipe" aria-hidden="true"/></span>)}</Tag>;
}
