import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import BlobCursor from './BlobCursor';
import SpotlightCard from './SpotlightCard';
import SplitText from './SplitText';
import LineSidebar from './LineSidebar';
import TextCursor from './TextCursor';
import './styles.css';

const asset = (path) => import.meta.env.BASE_URL + path.split('/').map(encodeURIComponent).join('/');

const projects = [
  {
    id: 'mite', number: '01', title: '产品拆解、复刻与结构可视化', short: '除螨仪设计', en: 'PRODUCT REVERSE ENGINEERING', category: '产品设计 / CMF / 可视化',
    intro: '从真实产品出发，拆解结构、重建模型，并通过动态影像讲清楚产品如何工作。',
    groups: [
      { name: '1 展板', files: [{ label: '爆炸展板', path: '作品集/1除螨仪/1展板/爆炸展板.jpg', type: 'image' }] },
      { name: '2 效果图', files: [
        { label: '场景 01', path: '作品集/1除螨仪/2效果图/场景1-web.jpg', type: 'image' },
        { label: '场景 02', path: '作品集/1除螨仪/2效果图/场景2.jpg', type: 'image' },
        { label: '场景 03', path: '作品集/1除螨仪/2效果图/场景3.jpg', type: 'image' },
        { label: '场景 04', path: '作品集/1除螨仪/2效果图/场景4-web.jpg', type: 'image' },
        { label: '爆炸图 01', path: '作品集/1除螨仪/2效果图/爆炸图 (1).jpg', type: 'image' },
        { label: '爆炸图 02', path: '作品集/1除螨仪/2效果图/爆炸图 (2).jpg', type: 'image' },
        { label: '产品效果图 01', path: '作品集/1除螨仪/2效果图/除螨仪效果图.109.jpg', type: 'image' },
        { label: '产品效果图 02', path: '作品集/1除螨仪/2效果图/除螨仪效果图.106.jpg', type: 'image' },
        { label: '产品效果图 03', path: '作品集/1除螨仪/2效果图/除螨仪效果图.103.jpg', type: 'image' },
        { label: '产品效果图 04', path: '作品集/1除螨仪/2效果图/除螨仪效果图.97.jpg', type: 'image' },
      ] },
      { name: '产品动画', files: [{ label: '产品动画', path: '作品集/1除螨仪/产品动画/产品动画.mp4', type: 'video' }] },
    ],
  },
  {
    id: 'rocket', number: '02', title: '1m² 航天火箭发射模型', short: '火箭交互模型', en: 'INTERACTIVE OBJECT', category: '交互设计 / 开源硬件 / 原型',
    intro: '以工业文化为主题，全手工制作模型，以灯光、声音和动作建立完整的交互反馈。',
    groups: [
      { name: '1 展板', files: [{ label: '造型基础 · 展板', path: '作品集/2火箭发射交互模型/1展板/造型基础4-展板.jpg', type: 'image' }] },
      { name: '2 制作过程', files: Array.from({ length: 6 }, (_, i) => ({ label: `制作过程 0${i + 1}`, path: `作品集/2火箭发射交互模型/2制作过程/${i + 1}.jpg`, type: 'image' })) },
      { name: '3 演示视频', files: [{ label: '交互演示', path: '作品集/2火箭发射交互模型/3演示视频/展示视频.mp4', type: 'video' }] },
    ],
  },
  {
    id: 'mobility', number: '03', title: '适老化智能搬运电动车设计', short: '适老化电动车', en: 'DESIGN FOR INDEPENDENCE', category: '用户研究 / 适老化 / 产品定义',
    intro: '针对银发经济与关节损伤人群“能走但不能搬”的痛点，探索更友好的搬运体验。',
    groups: [{ name: '项目 PDF', files: [{ label: '查看完整项目', path: '作品集/3.适老化智能电动车设计/PDF.pdf', type: 'pdf' }] }],
  },
  {
    id: 'visual', number: '04', title: '信息可视化', short: '信息可视化', en: 'INFORMATION DESIGN', category: '信息可视化 / 视觉表达', intro: '通过信息图表与思维导图，将复杂内容组织成清晰、易读的视觉叙事。',
    groups: [{ name: '可视化作品', files: [
      { label: '交互设计与信息可视化', path: '作品集/5其他设计/交互设计与信息可视化.jpg', type: 'image' },
      { label: '思维导图', path: '作品集/5其他设计/思维导图横板.jpg', type: 'image' },
    ] }],
  },
  {
    id: 'misc', number: '05', title: '其他设计', short: '其他设计', en: 'SELECTED EXPERIMENTS', category: '视觉 / 机械 / 课题', intro: '来自不同课程、竞赛与个人探索的设计片段。',
    groups: [{ name: '平面与研究', files: [
      { label: '工作室课题展板', path: '作品集/5其他设计/工作室课题展板.jpg', type: 'image' },
      { label: '强省杯展板', path: '作品集/5其他设计/强省杯展板.jpg', type: 'image' },
    ] }, { name: '机械视频', files: [
      { label: '机械', path: '作品集/5其他设计/机械.mp4', type: 'video' },
      { label: '机械设计', path: '作品集/5其他设计/机械设计.mp4', type: 'video' },
    ] }],
  },
];

function SiteNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return <header className="site-nav">
    <a className="site-nav-brand" href="#top" onClick={closeMenu} aria-label="返回首页">MAXINE<span>®</span></a>
    <nav className={`site-nav-links ${menuOpen ? 'open' : ''}`} aria-label="主导航">
      <a href="#about" onClick={closeMenu}>关于我</a>
      <a href="#work" onClick={closeMenu}>作品集</a>
      <a href="#contact" onClick={closeMenu}>联系我</a>
    </nav>
    <button className="site-nav-toggle" type="button" aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
      {menuOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  </header>
}

function InteractiveBlobCursor() {
  const [enabled, setEnabled] = useState(false);
  const [homeVisible, setHomeVisible] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    const home = document.querySelector('.portfolio-cover');
    const observer = home ? new IntersectionObserver(([entry]) => setHomeVisible(entry.isIntersecting), { threshold: 0 }) : null;
    observer?.observe(home);
    return () => {
      query.removeEventListener('change', update);
      observer?.disconnect();
    };
  }, []);

  if (!enabled || homeVisible) return null;
  return <BlobCursor
    material="ink"
    color="#181818"
    size={17}
    morph={0.2}
    morphSpeed={0.4}
    depth={0.8}
    trail={1}
    lag={0.3}
    goo={0}
    stretch={0.7}
    wobble={0.45}
    shine={0.8}
    splashSpeed={0.3}
    splashSize={0.4}
    regrow={0.3}
    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
  />;
}

function Hero() {
  return <section className="portfolio-cover" id="top">
    <TextCursor text="Hello" mode="stamp" fontSize={23} fontWeight={600} spacing={82} maxPoints={5} shrink={0.35} fade={0.55} smoothing={0.3} color="#181818" style={{ position: 'absolute', inset: 0, zIndex: 40 }} />
    <div className="cover-identity">
      <svg className="cover-mark" viewBox="0 0 64 32" role="img" aria-label="Maxine 标志">
        <ellipse cx="32" cy="16" rx="29" ry="10" />
        <ellipse cx="32" cy="16" rx="10" ry="14" />
        <ellipse cx="32" cy="16" rx="21" ry="7" transform="rotate(-28 32 16)" />
        <circle cx="32" cy="16" r="3" />
      </svg>
      <p className="cover-name">吴美薪</p>
      <p className="cover-presenter">Product Designer · Maxine</p>
    </div>
    <div className="cover-meta">
      <p>Product Designer <span>/</span> Industrial Designer <span>/</span> Interaction Designer</p>
      <div className="cover-contact"><a href="mailto:maxinewu2005@163.com">maxinewu2005@163.com</a><a href="tel:13080860319">+86 130 8086 0319</a></div>
    </div>
    <h1 className="cover-title"><SplitText tag="span" text="Portfolio" className="cover-split" effect="rise" splitType="chars" delay={70} duration={1} staggerFrom="center" trigger="view" hoverEffect="lift" threshold={0.15} rootMargin="-40px" textAlign="center" /></h1>
  </section>
}

function About() {
  useLayoutEffect(() => {
    const page = document.querySelector(".about-page-spotlight");
    const selfHeading = page?.querySelector(".about-profile h3");
    const selfText = page?.querySelector(".about-description");
    const skillsHeading = page?.querySelector(".about-block:last-child > h2");
    const skillsText = page?.querySelector(".about-skills-summary");
    if (!page || !selfHeading || !selfText || !skillsHeading || !skillsText) return;

    const alignContent = () => {
      skillsHeading.style.transform = "";
      skillsText.style.transform = "";
      if (window.matchMedia("(max-width: 900px)").matches) return;
      const headingOffset = selfHeading.getBoundingClientRect().top - skillsHeading.getBoundingClientRect().top;
      const textOffset = selfText.getBoundingClientRect().top - skillsText.getBoundingClientRect().top;
      skillsHeading.style.transform = `translateY(${headingOffset}px)`;
      skillsText.style.transform = `translateY(${textOffset}px)`;
    };

    alignContent();
    const observer = new ResizeObserver(alignContent);
    observer.observe(page);
    const photo = page.querySelector(".about-photo");
    if (photo) observer.observe(photo);
    window.addEventListener("resize", alignContent);
    document.fonts?.ready.then(alignContent);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", alignContent);
      skillsHeading.style.transform = "";
      skillsText.style.transform = "";
    };
  }, []);  return <section className="about-page" id="about">
    <SpotlightCard
      className="about-page-spotlight"
      theme="light"
      spotlightColor="#ff5a00"
      intensity={0.65}
      spotlightSize={300}
      softness={0.85}
      shape="circle"
      borderGlow={0.45}
      proximity={90}
      smoothing={0.25}
      grain={0}
      flare
      style={{ '--spotlight-card-surface': 'rgba(255,255,255,.18)', '--spotlight-card-border': 'rgba(24,24,27,.08)', '--spotlight-card-shadow': 'none' }}
    >
      <div className="about-profile">
        <h2>吴美薪</h2>
        <p className="about-subtitle">工业设计专业 · 产品设计师</p>
        <img className="about-photo" src={asset('chen4471.jpg')} alt="吴美薪个人照片" />
        <h3>自我评价</h3>
        <p className="about-description">我具备从用户研究、需求洞察到方案落地的完整产品思维。习惯以用户真实需求驱动决策，擅长用户研究、需求拆解、交互原型与可视化表达。具备较强执行力，能够制定清晰工作计划，合理安排时间，学习速度快、适应能力强，能快速进入企业并学习业务与技术。</p>
      </div>
      <div className="about-details">
        <section className="about-block about-education">
          <h2>教育背景</h2>
          <div className="education-row"><div><b>大连民族大学</b><small className="education-degree">工业设计 · 国家一流专业 · 学士</small></div><strong>2023 — 2027</strong></div>
          <p className="education-note">专业前 20%　·　校级二等奖学金　·　优秀三好学生</p>
        </section>
        <section className="about-block">
          <h2>主修课程</h2>
          <div className="about-skill-columns">
            <div><span>机械设计基础</span><span>工程材料与制造工艺</span><span>智能基础（开源硬件编程实践）</span><span>创造性思维</span><span>工业设计方法学</span><span>基础描写</span></div>
            <div><span>色彩基础</span><span>服务设计</span><span>情感化设计</span><span>交互设计</span><span>适老化设计</span><span>设计心理学</span></div>
          </div>
        </section>
        <section className="about-block">
          <h2>专业能力</h2>
          <p className="about-skills-summary">精通PS、AI等平面软件；Rhino、3DMax、SolidWorks等三维建模软件；KeyShots、C4D等建模渲染软件；Arduino、Mixly等编程软件；Word、Excel、PPT等日常办公软件；ChatGPT、Codex、DeepSeek等人工智能软件。</p>
          <a className="resume-link" href={asset('resume.jpg')} target="_blank" rel="noopener noreferrer">查看简历原图 <ArrowUpRight size={16} /></a>
        </section>
      </div>
    </SpotlightCard>
  </section>
}

function TreeNav({ active, setActive }) {
  return <LineSidebar items={projects} active={active} setActive={setActive} />
}

function Media({ file, index }) {
  const url = asset(file.path);
  const imageUrl = file.path === '作品集/2火箭发射交互模型/2制作过程/5.jpg' ? `${url}?v=original` : file.path === '作品集/1除螨仪/1展板/爆炸展板.jpg' ? `${url}?v=exploded-board-2` : url;
  const videoUrl = file.type === 'video' && file.path.startsWith('作品集/5其他设计/') ? `${url}?v=h264` : url;
  if (file.type === 'video') return <div className="media video-wrap"><video controls controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture disableRemotePlayback playsInline preload={file.path === '作品集/1除螨仪/产品动画/产品动画.mp4' ? 'auto' : 'metadata'} onContextMenu={(event) => event.preventDefault()} src={videoUrl} /><span className="media-caption">{String(index + 1).padStart(2, '0')} / {file.label}</span></div>;
  if (file.type === 'pdf') return <div className="pdf-card"><div><span className="pdf-mark">PDF</span><p>完整项目文档<br /><small>研究 · 洞察 · 设计方案</small></p></div><iframe src={`${url}?v=20261031b#toolbar=0&navpanes=0&zoom=45`} title="适老化智能电动车设计 PDF" loading="lazy" /><a className="pdf-mobile-open" href={`${url}?v=20261031b`} target="_blank" rel="noreferrer">查看源文件 <ArrowUpRight size={16} /></a></div>;
  return <div className="media image-wrap"><img loading="lazy" src={imageUrl} alt={file.label} /><span className="media-caption">{String(index + 1).padStart(2, '0')} / {file.label}</span></div>;
}

function Project({ project, setActive }) {
  return <article className="project" id={project.id} onMouseEnter={() => setActive(project.id)}><div className="project-heading"><span className="project-number">{project.number} <i /> CASE STUDY</span><span className="project-category">{project.category}</span></div><div className="project-title-row"><h3>{project.title}</h3><span className="project-en">{project.en}</span></div><p className="project-intro">{project.intro}</p>{project.empty ? <div className="empty-project"><span>04 — VISUAL STUDIES</span><p>目录项已保留<br /><small>该文件夹当前没有可展示的素材。</small></p></div> : project.groups.map((group, groupIndex) => <section className="asset-group" id={`${project.id}-group-${groupIndex}`} key={group.name}><div className="asset-group-head"><span>{group.name}</span><span>{String(group.files.length).padStart(2, '0')} ASSETS</span></div><div data-mite-effects={project.id === 'mite' && groupIndex === 1 ? '' : undefined} className={`media-grid ${group.files.length === 1 ? 'single' : ''} ${group.files.length > 4 ? 'dense' : ''} ${project.id === 'visual' || project.id === 'misc' || ((project.id === 'rocket' || project.id === 'mite') && groupIndex === 0) ? 'stacked' : ''}`}>{group.files.map((file, i) => <Media key={file.path} file={file} index={i} />)}</div></section>)}</article>
}

function Work() {
  const [active, setActive] = useState('mite');
  return <section className="work-section" id="work"><div className="section-wrap work-intro"><div className="section-kicker"><span>02 / SELECTED WORK</span><span>作品集</span></div><div className="work-intro-row"><div><p className="eyebrow">PRODUCT DESIGN / SELECTED PROJECTS</p><h2><SplitText tag="span" text="从用户洞察，" className="work-intro-first" effect="rise" splitType="chars" delay={70} duration={1} staggerFrom="center" trigger="view" hoverEffect="lift" threshold={0.15} rootMargin="-40px" textAlign="left" /><br /><SplitText tag="span" text="到产品落地。" className="work-intro-muted" effect="rise" splitType="chars" delay={70} duration={1} staggerFrom="center" trigger="view" hoverEffect="lift" threshold={0.15} rootMargin="-40px" textAlign="left" /></h2></div><p>聚焦用户研究、需求拆解与产品方案表达。<br />呈现从问题洞察到设计落地的实践。</p></div></div><div className="work-layout"><TreeNav active={active} setActive={setActive} /><main className="project-list">{projects.map((project) => <Project key={project.id} project={project} setActive={setActive} />)}</main></div></section>
}

function Contact() {
  return <footer className="contact-page" id="contact">
    <div className="contact-topline">
      <a href="#top" className="contact-brand"><b>PORTFOLIO</b><small>PRODUCT DESIGN</small></a>
      <nav aria-label="作品类别"><a href="#work">产品设计</a><a href="#work">交互设计</a><a href="#about">关于我</a></nav>
      <a className="contact-top-link" href="mailto:maxinewu2005@163.com" aria-label="发送邮件">↗</a>
    </div>
    <div className="contact-stage">
      <p className="contact-edition">2023 — 2027&nbsp; DESIGN</p>
      <h2 className="contact-thanks"><SplitText tag="span" text="Thanks" className="contact-split" effect="rise" splitType="chars" delay={70} duration={1} staggerFrom="center" trigger="view" hoverEffect="lift" threshold={0.15} rootMargin="-40px" textAlign="center" /></h2>
      <div className="contact-caption"><strong>个人网站</strong></div>
    </div>
    <div className="contact-base">
      <span>© 2023—2027</span>
      <span>吴美薪&nbsp; · &nbsp;<a href="mailto:maxinewu2005@163.com">maxinewu2005@163.com</a>&nbsp; · &nbsp;<a href="tel:13080860319">130 8086 0319</a></span>
      <span>产品设计 / 大连</span>
    </div>
  </footer>
}

function App() { return <><SiteNavigation /><Hero /><About /><Work /><Contact /><InteractiveBlobCursor /></>; }

createRoot(document.getElementById('root')).render(<App />);
