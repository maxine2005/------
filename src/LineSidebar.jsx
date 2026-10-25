import { useCallback, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const curves = {
  linear: value => value,
  smooth: value => value * value * (3 - 2 * value),
  sharp: value => value * value * value,
};

export default function LineSidebar({ items, active, setActive }) {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const targets = useRef([]);
  const values = useRef([]);
  const frame = useRef(null);
  const lastTime = useRef(0);

  const animate = useCallback(now => {
    const dt = Math.min((now - lastTime.current) / 1000, 0.05);
    lastTime.current = now;
    const smoothing = 0.1;
    const factor = 1 - Math.exp(-dt / smoothing);
    let moving = false;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      const target = Math.max(targets.current[index] || 0, items[index]?.id === active ? 1 : 0);
      const current = values.current[index] || 0;
      const next = current + (target - current) * factor;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      values.current[index] = value;
      element.style.setProperty('--line-effect', value.toFixed(4));
      if (!settled) moving = true;
    });

    frame.current = moving ? requestAnimationFrame(animate) : null;
  }, [active, items]);

  const startAnimation = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    lastTime.current = performance.now();
    frame.current = requestAnimationFrame(animate);
  }, [animate]);

  const handlePointerMove = useCallback(event => {
    const list = listRef.current;
    if (!list) return;
    const pointerY = event.clientY - list.getBoundingClientRect().top;
    const radius = 100;
    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      const center = element.offsetTop + element.offsetHeight / 2;
      const proximity = Math.max(0, 1 - Math.abs(pointerY - center) / radius);
      targets.current[index] = curves.smooth(proximity);
    });
    startAnimation();
  }, [startAnimation]);

  const handlePointerLeave = useCallback(() => {
    targets.current = targets.current.map(() => 0);
    startAnimation();
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
  }, [active, startAnimation]);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  return <nav className="tree-nav line-sidebar" aria-label="作品目录">
    <div className="tree-head"><span>目录 / INDEX</span><span>05 PROJECTS</span></div>
    <ul className="line-sidebar__list" ref={listRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {items.map((project, index) => <li className={`tree-project line-sidebar__item ${active === project.id ? 'selected' : ''}`} key={project.id} ref={element => { itemRefs.current[index] = element; }}>
        <a className="tree-project-title line-sidebar__title" href={`#${project.id}`} aria-current={active === project.id ? 'location' : undefined} onClick={() => setActive(project.id)}>
          <span className="tree-num">{project.number}</span><span>{project.short}</span><ArrowUpRight size={14} />
        </a>
        {project.groups.map((group, groupIndex) => <a className="tree-group" href={`#${project.id}-group-${groupIndex}`} key={group.name} onClick={() => setActive(project.id)}>
          <span>{groupIndex + 1}.{group.name.replace(/^\d\s*/, '')}</span>{group.files.length > 0 && <span className="tree-count">{String(group.files.length).padStart(2, '0')}</span>}
        </a>)}
      </li>)}
    </ul>
  </nav>;
}
