import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';
import ModrinthFetcher from '../components/ResourceComponents/ModrinthFetcher';

import styles from './index.module.css';

// 插件数据
const plugins = [
  {
    title: 'PostSpawner',
    projectId: 'postspawner',
    description: '全面而强大的刷怪笼控制插件，支持精准采集、自定义掉落、权限管理等功能，让您对刷怪笼有完全掌控。',
    link: '/PostSpawner/intro',
    tags: ['刷怪笼', '掉落物', '权限'],
  },
  {
    title: 'PostDrop',
    projectId: 'postdrop',
    description: '实用的物品丢弃保护插件，防止其他玩家拾取您丢弃的物品，支持物品高亮、可见性控制等功能。',
    link: '/PostDrop/intro',
    tags: ['物品', '保护', '高亮'],
  },
  {
    title: 'PostWarps',
    projectId: 'PostWarps',
    description: '功能强大的地标传送插件，支持创建公开和私有地标，提供完整的传送解决方案，让玩家轻松管理传送点。',
    link: '/PostWarps/intro',
    tags: ['传送', '地标', '管理'],
  }
];

// 检测设备性能
const detectLowEndDevice = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) return true;
  
  const renderer = gl.getParameter(gl.RENDERER);
  const isLowEndGPU = /Mali|Adreno [1-4]|PowerVR|Intel/i.test(renderer);
  const isMobile = window.innerWidth < 768;
  const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  
  return isLowEndGPU || hasLimitedMemory || (isMobile && window.devicePixelRatio > 2);
};

// WebGL背景效果组件（带视差效果）
function BannerBackground() {
  const canvasRef = useRef(null);
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const isLowEnd = detectLowEndDevice();
    const targetFPS = isLowEnd ? 30 : 60;
    const targetFrameTime = 1000 / targetFPS;

    // 设置画布尺寸
    const setCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio, isLowEnd ? 1.5 : 2);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    setCanvasSize();
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 100);
    };
    window.addEventListener('resize', handleResize);

    // 鼠标移动事件（视差效果）
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // 归一化鼠标位置到 -0.1 到 0.1 范围
      mouseRef.current.targetX = (clientX / innerWidth - 0.5) * 0.2;
      mouseRef.current.targetY = (clientY / innerHeight - 0.5) * 0.2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 着色器代码（带视差偏移）
    const vertexShader = `
      attribute vec4 a_position;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = a_position;
        v_texCoord = a_position.xy * 0.5 + 0.5;
      }
    `;
    
    const fragmentShader = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform vec2 u_resolution;
      uniform bool u_isDark;
      uniform vec2 u_mouse;

      float radialGradient(vec2 st, vec2 center, float radius) {
        return smoothstep(radius, 0.0, length(st - center));
      }

      void main() {
        vec2 st = v_texCoord;
        st.x *= u_resolution.x / u_resolution.y;
        
        // 应用视差偏移
        st += u_mouse;

        // 三个光斑（随鼠标移动）
        float blob1 = radialGradient(st, vec2(0.25, 0.6), 0.8);
        float blob2 = radialGradient(st, vec2(0.75, 0.4), 0.9);
        float blob3 = radialGradient(st, vec2(0.5, 0.2), 0.7);

        vec3 color;
        if(u_isDark) {
          vec3 base = vec3(0.05, 0.07, 0.15);
          color = base + vec3(0.2, 0.4, 0.95) * blob1 * 0.7
                      + vec3(0.9, 0.2, 0.7) * blob2 * 0.6
                      + vec3(0.3, 0.8, 0.9) * blob3 * 0.5;
        } else {
          vec3 base = vec3(0.97, 0.98, 1.0);
          color = mix(base, vec3(0.6, 0.75, 1.0), blob1 * 0.4);
          color = mix(color, vec3(1.0, 0.7, 0.85), blob2 * 0.35);
          color = mix(color, vec3(0.7, 0.95, 0.95), blob3 * 0.3);
        }

        // 暗角效果
        float vignette = 1.0 - smoothstep(0.3, 1.3, length(st - vec2(0.5))) * 0.3;
        gl_FragColor = vec4(color * vignette, 1.0);
      }
    `;

    // 创建着色器程序
    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    // 设置顶点数据
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    
    const posLoc = gl.getAttribLocation(program, "a_position");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const darkLoc = gl.getUniformLocation(program, "u_isDark");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    let lastTime = 0;
    let isVisible = true;

    const handleVisibilityChange = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (time) => {
      if (isVisible && time - lastTime >= targetFrameTime) {
        // 平滑插值鼠标位置（缓动效果）
        const mouse = mouseRef.current;
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;

        gl.useProgram(program);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1i(darkLoc, isDarkTheme ? 1 : 0);
        gl.uniform2f(mouseLoc, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [isDarkTheme]);
  
  return <canvas ref={canvasRef} className={styles.bannerBackground} />;
}

// 主页横幅组件
function HomepageBanner({ enableWebGL }) {
  const {siteConfig} = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  
  const handleScrollDown = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <header className={styles.banner}>
      {enableWebGL && <BannerBackground />}
      <div className={styles.bannerBackdrop}></div>
      
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <img 
            src={isDarkTheme ? "/img/logo_white.svg" : "/img/logo.svg"} 
            alt="Logo" 
            className={styles.bannerIcon}
          />
          <h1 className={styles.bannerTitle}>
            <span className={styles.bannerTitleMain}>Post</span>
            <span className={styles.bannerTitleSub}>Plugins</span>
          </h1>
          <p className={styles.bannerSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.bannerDescription}>
            为您的服务器提供高品质、易用且高性能的Minecraft插件，让您的游戏体验更加出色。
          </p>
          <div className={styles.bannerCta}>
            <Link className={styles.primaryButton} to="/intro">开始使用</Link>
            <Link className={styles.secondaryButton} to="https://github.com/postyizhan">GitHub</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.scrollDown} onClick={handleScrollDown}>
        <svg className={styles.scrollArrowSvg} width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </header>
  );
}

// 插件卡片组件（简化版）
function PluginCard({ plugin }) {
  const [modrinthData, setModrinthData] = useState(null);
  
  return (
    <div className={styles.pluginCard}>
      <ModrinthFetcher projectId={plugin.projectId} onDataLoaded={setModrinthData} />
      
      <div className={styles.pluginCardHeader}>
        {modrinthData?.icon_url ? (
          <img src={modrinthData.icon_url} alt={`${plugin.title} icon`} className={styles.pluginCardIcon} />
        ) : (
          <div className={styles.pluginCardIconPlaceholder}>{plugin.title.charAt(0)}</div>
        )}
        <div>
          <h3 className={styles.pluginCardTitle}>{plugin.title}</h3>
          <span className={styles.pluginCardVersion}>
            {modrinthData?.versions?.[0]?.version_number 
              ? `v${modrinthData.versions[0].version_number}` 
              : 'v?.?.?'}
          </span>
        </div>
      </div>
      
      <p className={styles.pluginCardDescription}>{plugin.description}</p>
      
      <div className={styles.pluginCardFooter}>
        <div className={styles.pluginCardTags}>
          {plugin.tags.map((tag, idx) => (
            <span key={idx} className={styles.pluginCardTag}>{tag}</span>
          ))}
        </div>
        <Link className={styles.pluginCardButton} to={plugin.link}>查看文档</Link>
      </div>
    </div>
  );
}

// 插件展示区
function PluginSection() {
  return (
    <section className={styles.section} id="plugins">
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>插件系列</h2>
          <p className={styles.sectionDescription}>
            我们提供多种功能强大的插件，为您的Minecraft服务器带来更多可能性
          </p>
        </div>
        <div className={styles.pluginGrid}>
          {plugins.map((plugin, idx) => <PluginCard key={idx} plugin={plugin} />)}
        </div>
      </div>
    </section>
  );
}

// 特性展示区
function FeatureSection() {
  const features = [
    { title: '简单配置', description: '直观的配置文件和详细的文档指引，让您能够轻松设置插件，无需复杂操作。', emoji: '⚙️' },
    { title: '性能优化', description: '所有插件均经过性能优化，确保在繁忙的服务器环境中也能流畅运行。', emoji: '🚀' },
    { title: '持续更新', description: '我们定期更新插件，增加新功能并修复问题，确保您的服务器体验始终保持最佳。', emoji: '🔄' }
  ];

  return (
    <section className={styles.featureSection} id="features">
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>特性优势</h2>
          <p className={styles.sectionDescription}>Post系列插件的核心优势</p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureCardIcon}>{feature.emoji}</div>
              <h3 className={styles.featureCardTitle}>{feature.title}</h3>
              <p className={styles.featureCardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 支持联系区
function SupportSection() {
  return (
    <section className={styles.supportSection} id="support">
      <div className="container">
        <div className={styles.supportContent}>
          <div className={styles.supportText}>
            <h2 className={styles.supportTitle}>需要帮助？</h2>
            <p className={styles.supportDescription}>
              如果您在使用过程中遇到任何问题，或有任何建议，欢迎随时联系我们。
            </p>
          </div>
          <div className={styles.supportButtons}>
            <Link className={styles.supportButton} href="https://qm.qq.com/q/dENGavSflK">加入QQ群</Link>
            <Link className={styles.supportButton} href="https://github.com/postyizhan/PostPlugins-Docs/issues">GitHub Issues</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [enableWebGL, setEnableWebGL] = useState(true);

  useEffect(() => {
    const isLowEnd = detectLowEndDevice();
    setEnableWebGL(!isLowEnd);

    // 设置 CSS 变量修正移动端 viewport
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setVH, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <Layout title="主页" description="Post系列插件 - 为您的Minecraft服务器提供实用功能增强">
      <main className={styles.main}>
        <HomepageBanner enableWebGL={enableWebGL} />
        <FeatureSection />
        <PluginSection />
        <SupportSection />
      </main>
    </Layout>
  );
}
