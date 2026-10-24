/* Bilingual copy for the personal site. Keep keys stable; values are trusted static content. */
(() => {
  const DICT = {
    en: {
      "meta.title": "Shouzhe Li · Embodied AI, Full Stack, Simulation",
      "meta.description": "Full-stack embodied AI: data engines, VLA/RSI, simulation, evaluation, deployment, and the economics of shipping robots. Simulation and evaluation are the deepest layers.",
      "brand.tagline": "EMBODIED AI · FULL STACK",
      "a11y.skip": "Skip to content",
      "nav.primaryAria": "Primary",
      "nav.home": "Home",
      "nav.capabilities": "Capabilities",
      "nav.projects": "Projects",
      "nav.focus": "Focus",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.allProjects": "All projects",
      "nav.email": "Email",
      "a11y.theme": "Toggle color theme",
      "a11y.menu": "Menu",
      "lang.aria": "Switch language",
      "footer.built": "Built with static HTML/CSS/JS.",
      "notice.subpage": "The Chinese version of this page is in progress; the English original is shown below.",

      "home.hero.kicker": "Embodied AI · Full Stack · Simulation",
      "home.hero.title": "From data to deployment, I build the <em>embodied AI loop.</em>",
      "home.hero.lede": "My depth is simulation and evaluation. My range is the full stack: data engines, VLA/RSI, real2sim, deployment, and the economics that decide whether a robot ships.",
      "home.hero.cta1": "Explore capabilities",
      "home.hero.cta2": "View projects",
      "home.hero.note": "Deepest: simulation · evaluation · real2sim — Isaac Sim / Isaac Lab / Arena",
      "home.hero.imageAlt": "Abstract simulation viewport with a robot arm, camera frustum, and L0–L3 protocol labels",
      "home.hero.liveScene": "LIVE SCENE",
      "home.hero.stackAria": "Full-stack capability layers",
      "home.hero.stack.data": "DATA",
      "home.hero.stack.models": "VLA / RSI",
      "home.hero.stack.simulation": "SIMULATION",
      "home.hero.stack.evaluation": "EVALUATION",
      "home.hero.stack.deployment": "DEPLOYMENT",
      "home.hero.stack.strategy": "STRATEGY",
      "home.stats.layers": "Capability layers",
      "home.stats.scenes": "Simulation scenes",
      "home.stats.tests": "Contract tests",
      "home.stats.render": "Render sensitivity",

      "home.stack.eyebrow": "Full-stack capability",
      "home.stack.title": "One loop, six layers. <em>Simulation is where I go deepest.</em>",
      "home.stack.lede": "I can own the interfaces between data, models, simulation, evaluation, deployment, and the business case — not just one layer.",
      "home.stack.link": "Capability map",
      "home.stack.data.no": "01 / DATA",
      "home.stack.data.title": "Data engine",
      "home.stack.data.desc": "Collection, schema, QC, versioning, licensing, and the flywheel from field data back to training.",
      "home.stack.data.level": "Working depth",
      "home.stack.models.no": "02 / MODELS",
      "home.stack.models.title": "VLA & RSI",
      "home.stack.models.desc": "Fine-tuning, post-training, inference optimization, model cards, and evaluation-aware model selection.",
      "home.stack.models.level": "Working depth",
      "home.stack.sim.no": "03 / SIMULATION <span class=\"stack-badge\">DEEPEST</span>",
      "home.stack.sim.title": "Simulation & real2sim",
      "home.stack.sim.desc": "Isaac Sim/Lab, camera and rendering fidelity, physics, digital twins, and real-versus-sim validation.",
      "home.stack.sim.level": "Deep",
      "home.stack.eval.no": "04 / EVALUATION",
      "home.stack.eval.title": "Evaluation",
      "home.stack.eval.desc": "L0–L3 protocols, Wilson intervals, per-condition checks, real-machine gates, and silent-failure audits.",
      "home.stack.eval.level": "Deep",
      "home.stack.deploy.no": "05 / DEPLOYMENT",
      "home.stack.deploy.title": "Deployment",
      "home.stack.deploy.desc": "Real-time stack, safety, edge inference, field readiness, fleet operations, and intervention economics.",
      "home.stack.deploy.level": "Working depth",
      "home.stack.strategy.no": "06 / STRATEGY",
      "home.stack.strategy.title": "Industry & economics",
      "home.stack.strategy.desc": "Market, supply chain, ROI, build/buy, and the roadmap trade-offs that connect engineering to shipping.",
      "home.stack.strategy.level": "Informed",

      "home.work.eyebrow": "Selected work",
      "home.work.title": "Systems across the stack, with <em>simulation</em> as the lead.",
      "home.work.lede": "SIM-EVAL is the flagship. Real2Sim and the expert skill show the same loop from different angles.",
      "home.work.link": "All projects",
      "home.work.simEval.year": "FLAGSHIP",
      "home.work.simEval.aria": "Open SIM-EVAL simulation evaluation project",
      "home.work.simEval.imageAlt": "SIM-EVAL evaluation platform: dark simulation viewport with a robot arm and L0–L3 labels",
      "home.work.simEval.title": "SIM-EVAL — Simulation Evaluation Stack",
      "home.work.simEval.desc": "A reproducible evaluation stack for VLA models: scene onboarding, camera and rendering fidelity, L0–L3 protocol validation, and a silent-failure audit.",
      "home.work.real2sim.aria": "Open Real2Sim project",
      "home.work.real2sim.imageAlt": "Real2Sim pipeline: a video frame on the left and a wireframe USD scene on the right",
      "home.work.real2sim.title": "Real2Sim — Video to Assets",
      "home.work.real2sim.desc": "Reconstruct appearance and interaction-ready assets from a short capture, then validate real versus sim at the same pose.",
      "home.work.expert.aria": "Open the Embodied AI Expert skill and agent project",
      "home.work.expert.imageAlt": "Embodied AI expert knowledge graph with a central CEO agent and a separate simulation skill",
      "home.work.expert.title": "Embodied AI Expert — Skill + Agent",
      "home.work.expert.desc": "A two-skill architecture: broad embodied AI expertise, a deep simulation-platform skill, and an agent that routes between them.",

      "tag.simulation": "Simulation",
      "tag.evaluation": "Evaluation",
      "tag.real2sim": "Real2Sim",
      "tag.skill": "Skill",
      "tag.agent": "Agent",
      "tag.knowledge": "Knowledge",
      "tag.dataEngine": "Data engine",
      "tag.vlaRsi": "VLA / RSI",
      "tag.isaac": "Isaac Sim / Lab",
      "tag.deployment": "Deployment",
      "tag.unitEconomics": "Unit economics",

      "home.focus.eyebrow": "How I work",
      "home.focus.title": "Across the whole loop, with a <em>measurement-first</em> bias.",
      "home.focus.lede": "The last ten percent is not a demo — it is the measurement, the failure mode, and the evidence.",
      "home.focus.measurement.no": "01 / MEASUREMENT",
      "home.focus.measurement.title": "If you can't reproduce it, it isn't a result.",
      "home.focus.measurement.desc": "Every claim needs n, a confidence interval, a failure taxonomy, and a traceable artifact. A number without evidence is a story.",
      "home.focus.simulation.no": "02 / SIMULATION",
      "home.focus.simulation.title": "Simulation is an instrument.",
      "home.focus.simulation.desc": "Rendering, camera, physics, and protocol are part of the number. I calibrate the stack before I compare the model.",
      "home.focus.deployment.no": "03 / DEPLOYMENT",
      "home.focus.deployment.title": "Deployment is the test.",
      "home.focus.deployment.desc": "MTBF, intervention rate, and unit economics decide whether the loop is real. A demo is not a deployment.",

      "home.about.eyebrow": "About",
      "home.about.title": "Full-stack, from <em>data</em> to <em>deployment.</em>",
      "home.about.imageAlt": "Monogram portrait placeholder for Shouzhe Li",
      "home.about.p1": "I work across the embodied AI loop: <strong>data engines, VLA/RSI, simulation, evaluation, deployment, and the economics</strong> that decide whether a robot ships. My deepest hands-on work is simulation and evaluation — the measurement stack that makes the rest of the loop trustworthy.",
      "home.about.p2": "I like the unglamorous interfaces: the schema between data and training, the camera domain between renderer and policy, the gate between a model and a customer site. The goal is a loop another engineer can audit, not a highlight reel.",

      "home.contact.eyebrow": "Contact",
      "home.contact.title": "Let's make the whole loop <em>trustworthy.</em>",
      "home.contact.lede": "If you are building embodied AI across data, simulation, evaluation, or deployment, I would like to compare notes.",
      "home.contact.email": "Email",

      "notFound.title": "This page isn't in the <em>set.</em>",
      "notFound.lede": "The link may be old, or the project has been renamed. If you followed an old simulation-project link, it now lives under SIM-EVAL.",
      "notFound.open": "Open SIM-EVAL"
    },
    zh: {
      "meta.title": "Shouzhe Li · 具身智能 · 全栈 · 仿真",
      "meta.description": "具身智能全栈：数据引擎、VLA/RSI、仿真、评测、部署，以及机器人交付的经济性。仿真与评测是扎得最深的两层。",
      "brand.tagline": "具身智能 · 全栈",
      "a11y.skip": "跳到正文",
      "nav.primaryAria": "主导航",
      "nav.home": "首页",
      "nav.capabilities": "能力",
      "nav.projects": "项目",
      "nav.focus": "重点",
      "nav.about": "关于",
      "nav.contact": "联系",
      "nav.allProjects": "全部项目",
      "nav.email": "邮件",
      "a11y.theme": "切换配色",
      "a11y.menu": "菜单",
      "lang.aria": "切换语言",
      "footer.built": "使用静态 HTML/CSS/JS 构建。",
      "notice.subpage": "此页的中文版正在整理，以下保留英文原文。",

      "home.hero.kicker": "具身智能 · 全栈 · 仿真",
      "home.hero.title": "从数据到部署，我搭建具身智能的<em class=\"keep\">完整闭环。</em>",
      "home.hero.lede": "我最深的是仿真与评测，但覆盖面是整条全栈：数据引擎、VLA/RSI、Real2Sim、部署，以及决定机器人能否真正交付的经济性。",
      "home.hero.cta1": "查看能力地图",
      "home.hero.cta2": "查看项目",
      "home.hero.note": "最深：仿真 · 评测 · Real2Sim — Isaac Sim / Isaac Lab / Arena",
      "home.hero.imageAlt": "抽象仿真视口：机械臂、相机视锥与 L0–L3 协议标记",
      "home.hero.liveScene": "实时场景",
      "home.hero.stackAria": "全栈能力层",
      "home.hero.stack.data": "数据",
      "home.hero.stack.models": "VLA / RSI",
      "home.hero.stack.simulation": "仿真",
      "home.hero.stack.evaluation": "评测",
      "home.hero.stack.deployment": "部署",
      "home.hero.stack.strategy": "战略",
      "home.stats.layers": "能力层",
      "home.stats.scenes": "仿真场景",
      "home.stats.tests": "契约测试",
      "home.stats.render": "渲染敏感度",

      "home.stack.eyebrow": "全栈能力",
      "home.stack.title": "一个闭环，六层能力。<em><span class=\"keep\">仿真</span>是我最深的一层。</em>",
      "home.stack.lede": "我能在数据、模型、仿真、评测、部署与商业判断之间把接口打通，而不只是做好其中一层。",
      "home.stack.link": "能力地图",
      "home.stack.data.no": "01 / 数据",
      "home.stack.data.title": "数据引擎",
      "home.stack.data.desc": "采集、schema、质检、版本、授权，以及从现场数据回到训练的飞轮。",
      "home.stack.data.level": "实战深度",
      "home.stack.models.no": "02 / 模型",
      "home.stack.models.title": "VLA 与 RSI",
      "home.stack.models.desc": "微调、后训练、推理优化、模型卡，以及以评测为依据的模型选型。",
      "home.stack.models.level": "实战深度",
      "home.stack.sim.no": "03 / 仿真 <span class=\"stack-badge\">最深</span>",
      "home.stack.sim.title": "仿真与 Real2Sim",
      "home.stack.sim.desc": "Isaac Sim/Lab、相机与渲染保真、物理、数字孪生，以及真机与仿真的对照验证。",
      "home.stack.sim.level": "深度",
      "home.stack.eval.no": "04 / 评测",
      "home.stack.eval.title": "评测",
      "home.stack.eval.desc": "L0–L3 协议、Wilson 区间、分条件检查、真机 Gate，以及静默失败审计。",
      "home.stack.eval.level": "深度",
      "home.stack.deploy.no": "05 / 部署",
      "home.stack.deploy.title": "部署",
      "home.stack.deploy.desc": "实时栈、安全、边缘推理、现场就绪、车队运营与接管经济性。",
      "home.stack.deploy.level": "实战深度",
      "home.stack.strategy.no": "06 / 战略",
      "home.stack.strategy.title": "行业与经济性",
      "home.stack.strategy.desc": "市场、供应链、ROI、自研/采购，以及把工程与交付连接起来的路线取舍。",
      "home.stack.strategy.level": "认知覆盖",

      "home.work.eyebrow": "代表项目",
      "home.work.title": "全栈系统实践，以<em class=\"keep\">仿真</em>为主轴。",
      "home.work.lede": "SIM-EVAL 是旗舰项目；Real2Sim 与专家 skill 从不同角度展示同一个闭环。",
      "home.work.link": "全部项目",
      "home.work.simEval.year": "旗舰",
      "home.work.simEval.aria": "打开 SIM-EVAL 仿真评测项目",
      "home.work.simEval.imageAlt": "SIM-EVAL 评测平台：深色仿真视口、机械臂与 L0–L3 标记",
      "home.work.simEval.title": "SIM-EVAL — 仿真评测栈",
      "home.work.simEval.desc": "面向 VLA 模型的可复现评测栈：场景接入、相机与渲染保真、L0–L3 协议校验，以及静默失败审计。",
      "home.work.real2sim.aria": "打开 Real2Sim 项目",
      "home.work.real2sim.imageAlt": "Real2Sim 流程：左侧视频帧，右侧 USD 线框场景",
      "home.work.real2sim.title": "Real2Sim — 从视频到资产",
      "home.work.real2sim.desc": "从一段短采集重建外观与可交互资产，再在同一姿态下对照真机与仿真。",
      "home.work.expert.aria": "打开具身智能专家 skill 与 agent 项目",
      "home.work.expert.imageAlt": "具身智能专家知识图谱：中心是 CEO agent，仿真 skill 独立分支",
      "home.work.expert.title": "具身智能专家 — Skill + Agent",
      "home.work.expert.desc": "双 skill 架构：广度具身智能知识、深度仿真平台 skill，以及负责路由的 agent。",

      "tag.simulation": "仿真",
      "tag.evaluation": "评测",
      "tag.real2sim": "Real2Sim",
      "tag.skill": "Skill",
      "tag.agent": "Agent",
      "tag.knowledge": "知识库",
      "tag.dataEngine": "数据引擎",
      "tag.vlaRsi": "VLA / RSI",
      "tag.isaac": "Isaac Sim / Lab",
      "tag.deployment": "部署",
      "tag.unitEconomics": "单位经济性",

      "home.focus.eyebrow": "工作方式",
      "home.focus.title": "贯穿整个闭环，以<em class=\"keep\">测量</em>为先。",
      "home.focus.lede": "最后 10% 不是 demo，而是测量、失败模式与证据。",
      "home.focus.measurement.no": "01 / 测量",
      "home.focus.measurement.title": "不能复现的，不算结果。",
      "home.focus.measurement.desc": "每个结论都要有 n、置信区间、失败分类和可追溯产物；没有证据的数字只是故事。",
      "home.focus.simulation.no": "02 / 仿真",
      "home.focus.simulation.title": "仿真是测量仪器。",
      "home.focus.simulation.desc": "渲染、相机、物理与协议都算进结果。先校准测量栈，再比较模型。",
      "home.focus.deployment.no": "03 / 部署",
      "home.focus.deployment.title": "部署才是真正的测试。",
      "home.focus.deployment.desc": "MTBF、接管率与单位经济性决定闭环是否成立；demo 不等于部署。",

      "home.about.eyebrow": "关于",
      "home.about.title": "全栈，从<em class=\"keep\">数据</em>到<em class=\"keep\">部署</em>。",
      "home.about.imageAlt": "Shouzhe Li 的字母头像占位图",
      "home.about.p1": "我工作于具身智能的完整闭环：<strong>数据引擎、VLA/RSI、仿真、评测、部署，以及决定机器人能否交付的经济性</strong>。我手上最深的是仿真与评测——让闭环其余部分可信的测量栈。",
      "home.about.p2": "我喜欢那些不性感的接口：数据与训练之间的 schema、渲染器与策略之间的相机域、模型与客户现场之间的 Gate。目标是让另一位工程师可以审计的闭环，而不是一支高光视频。",

      "home.contact.eyebrow": "联系",
      "home.contact.title": "让整个闭环变得<em class=\"keep\">可信</em>。",
      "home.contact.lede": "如果你正在做数据、仿真、评测或部署方向的具身智能，欢迎交流。",
      "home.contact.email": "邮件",

      "notFound.title": "这个页面不在<em class=\"keep\">评测集</em>里。",
      "notFound.lede": "链接可能已过期，或项目已改名。旧仿真项目链接已迁到 SIM-EVAL。",
      "notFound.open": "打开 SIM-EVAL"
    }
  };

  const STORAGE_KEY = 'pa-lang';
  const SUPPORTED = ['en', 'zh'];
  const page = document.body.dataset.page || 'home';
  let lang = 'en';

  function lookup(key, l = lang) {
    if (DICT[l] && Object.prototype.hasOwnProperty.call(DICT[l], key)) return DICT[l][key];
    if (DICT.en && Object.prototype.hasOwnProperty.call(DICT.en, key)) return DICT.en[key];
    return null;
  }

  function t(key, l = lang) {
    return lookup(key, l) ?? key;
  }

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function store(next) {
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode */ }
  }

  function initialLang() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get('lang') || '').toLowerCase();
    if (SUPPORTED.includes(fromUrl)) {
      store(fromUrl);
      params.delete('lang');
      const qs = params.toString();
      const clean = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
      try { window.history.replaceState(null, '', clean); } catch { /* file:// */ }
      return fromUrl;
    }
    const stored = (readStored() || '').toLowerCase();
    if (SUPPORTED.includes(stored)) return stored;
    const browserLangs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];
    return browserLangs.some((code) => code.toLowerCase().startsWith('zh')) ? 'zh' : 'en';
  }

  function renderNotice() {
    const main = document.querySelector('main');
    if (!main) return;
    const existing = main.querySelector(':scope > .lang-notice');
    const needed = lang === 'zh' && page !== 'home' && page !== '404'
      && document.body.dataset.i18nComplete !== 'true';
    if (!needed) {
      existing?.remove();
      return;
    }
    let notice = existing;
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'lang-notice';
      const wrap = document.createElement('div');
      wrap.className = 'wrap';
      const tag = document.createElement('strong');
      tag.textContent = 'ZH';
      const msg = document.createElement('span');
      msg.dataset.i18n = 'notice.subpage';
      wrap.append(tag, msg);
      notice.append(wrap);
      main.prepend(notice);
    }
    const msg = notice.querySelector('[data-i18n="notice.subpage"]');
    if (msg) msg.textContent = t('notice.subpage');
  }

  function apply(next) {
    if (!SUPPORTED.includes(next)) return;
    lang = next;
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.setAttribute('data-lang', next);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = lookup(el.dataset.i18n);
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const value = lookup(el.dataset.i18nHtml);
      if (value !== null) el.innerHTML = value;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const index = pair.indexOf(':');
        if (index === -1) return;
        const attr = pair.slice(0, index).trim();
        const key = pair.slice(index + 1).trim();
        const value = lookup(key);
        if (attr && value !== null) el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll('[data-lang-option]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.langOption === next));
    });

    renderNotice();
    document.dispatchEvent(new CustomEvent('site:langchange', { detail: { lang: next } }));
  }

  function setLanguage(next) {
    if (!SUPPORTED.includes(next)) return;
    store(next);
    apply(next);
  }

  lang = initialLang();

  document.querySelectorAll('[data-lang-option]').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.langOption));
  });

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && SUPPORTED.includes(event.newValue || '')) {
      apply(event.newValue);
    }
  });

  window.SITE_I18N = {
    get lang() { return lang; },
    set: setLanguage,
    t
  };

  apply(lang);
})();
