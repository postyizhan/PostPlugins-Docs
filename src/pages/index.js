import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';
import ModrinthFetcher from '../components/ResourceComponents/ModrinthFetcher';
import PerformanceMonitor, { PerformanceUtils } from '../components/PerformanceMonitor';

import styles from './index.module.css';

// 插件数据 - 使用Modrinth项目ID
const plugins = [
  {
    title: 'PostSpawner',
    projectId: 'postspawner', // Modrinth项目ID
    description: '全面而强大的刷怪笼控制插件，支持精准采集、自定义掉落、权限管理等功能，让您对刷怪笼有完全掌控。',
    link: '/PostSpawner/intro',
    tags: ['刷怪笼', '掉落物', '权限'],
  },
  {
    title: 'PostDrop',
    projectId: 'postdrop', // Modrinth项目ID
    description: '实用的物品丢弃保护插件，防止其他玩家拾取您丢弃的物品，支持物品高亮、可见性控制等功能。',
    link: '/PostDrop/intro',
    tags: ['物品', '保护', '高亮'],
  },
  {
    title: 'PostWarps',
    projectId: 'PostWarps', // Modrinth项目ID
    description: '功能强大的地标传送插件，支持创建公开和私有地标，提供完整的传送解决方案，让玩家轻松管理传送点。',
    link: '/PostWarps/intro',
    tags: ['传送', '地标', '管理'],
  }
];

// 设置视口高度变量
function setViewportHeight() {
  // 获取视口高度并设置CSS变量
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// WebGL背景效果组件
function BannerBackground() {
  const canvasRef = useRef(null);
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  const animationRef = useRef(null);
  const fpsRef = useRef({ lastTime: 0, frameCount: 0, fps: 60 });
  const performanceRef = useRef({ isLowEnd: false, targetFPS: 60 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const detectPerformance = () => {
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);

      const isLowEnd = /Mali|Adreno [1-4]|PowerVR|Intel/.test(renderer) ||
                       window.devicePixelRatio > 2 ||
                       window.innerWidth < 768;

      performanceRef.current = {
        isLowEnd,
        targetFPS: isLowEnd ? 30 : 60,
        quality: isLowEnd ? 0.5 : 1.0
      };
    };

    detectPerformance();

    // 防抖的画布尺寸设置
    let resizeTimeout;
    const setCanvasSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const { width, height } = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio, performanceRef.current.isLowEnd ? 1.5 : 2);
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }, 100);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // 着色器程序
    const vertexShaderSource = `
      attribute vec4 a_position;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = a_position;
        v_texCoord = a_position.xy * 0.5 + 0.5;
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform bool u_isDark;
      uniform float u_quality;

      // 简单而美观的径向渐变
      float radialGradient(vec2 st, vec2 center, float radius) {
        float dist = length(st - center);
        return smoothstep(radius, 0.0, dist);
      }

      // 柔和的波浪渐变
      float waveGradient(vec2 st, float frequency) {
        return sin(st.x * frequency) * cos(st.y * frequency) * 0.5 + 0.5;
      }
      
      void main() {
        vec2 st = v_texCoord;
        st.x *= u_resolution.x / u_resolution.y;

        // 创建三个彩色光斑中心
        vec2 pos1 = vec2(0.25, 0.6);
        vec2 pos2 = vec2(0.75, 0.4);
        vec2 pos3 = vec2(0.5, 0.2);

        // 创建大型柔和光斑
        float blob1 = radialGradient(st, pos1, 0.8);
        float blob2 = radialGradient(st, pos2, 0.9);
        float blob3 = radialGradient(st, pos3, 0.7);

        // 添加波浪纹理
        float wave = waveGradient(st, 8.0) * 0.05;

        vec3 color;
        if(u_isDark) {
          // 暗色主题 - 鲜艳的彩色渐变
          vec3 baseColor = vec3(0.05, 0.07, 0.15);  // 深色基底
          
          // 三个鲜艳的彩色光斑
          vec3 color1 = vec3(0.2, 0.4, 0.95);   // 鲜艳蓝色
          vec3 color2 = vec3(0.9, 0.2, 0.7);    // 鲜艳粉红
          vec3 color3 = vec3(0.3, 0.8, 0.9);    // 鲜艳青色
          
          // 混合光斑
          color = baseColor;
          color += color1 * blob1 * 0.7;
          color += color2 * blob2 * 0.6;
          color += color3 * blob3 * 0.5;
          color += wave;
          
        } else {
          // 亮色主题 - 柔和的彩色渐变
          vec3 baseColor = vec3(0.97, 0.98, 1.0);   // 浅色基底
          
          // 三个柔和的彩色光斑
          vec3 color1 = vec3(0.6, 0.75, 1.0);   // 柔和蓝色
          vec3 color2 = vec3(1.0, 0.7, 0.85);   // 柔和粉色
          vec3 color3 = vec3(0.7, 0.95, 0.95);  // 柔和青色
          
          // 混合光斑（减色模式）
          color = baseColor;
          color = mix(color, color1, blob1 * 0.4);
          color = mix(color, color2, blob2 * 0.35);
          color = mix(color, color3, blob3 * 0.3);
          color += wave * 0.5;
        }

        // 柔和的整体渐变
        vec2 center = vec2(0.5);
        float dist = length(st - center);
        float vignette = 1.0 - smoothstep(0.3, 1.3, dist) * 0.3;
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    // 创建着色器
    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }
    
    // 创建程序
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // 检查着色器是否创建成功
    if (!vertexShader || !fragmentShader) {
      console.error('Shader creation failed');
      return;
    }
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }
    
    // 创建顶点缓冲区
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // 创建一个覆盖整个画布的矩形
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // 获取变量位置
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const isDarkUniformLocation = gl.getUniformLocation(program, "u_isDark");
    const qualityUniformLocation = gl.getUniformLocation(program, "u_quality");

    // 启用属性
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    let startTime = Date.now();
    let lastFrameTime = 0;
    const targetFrameTime = 1000 / performanceRef.current.targetFPS;
    let isVisible = true;

    // 页面可见性检测
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function render(currentTime) {
      if (currentTime - lastFrameTime < targetFrameTime) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      if (!isVisible) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      lastFrameTime = currentTime;
      const timeInSeconds = (currentTime - startTime) / 1000;

      gl.useProgram(program);
      gl.uniform1f(timeUniformLocation, timeInSeconds);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1i(isDarkUniformLocation, isDarkTheme ? 1 : 0);
      gl.uniform1f(qualityUniformLocation, performanceRef.current.quality);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(render);
    }

    animationRef.current = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(resizeTimeout);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // 清理WebGL资源
      if (gl && program) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [isDarkTheme]);
  
  return <canvas ref={canvasRef} className={styles.bannerBackground} />;
}

function HomepageBanner({ performanceSettings }) {
  const {siteConfig} = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  
  const handleScrollDown = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <header className={styles.banner}>
      {/* 根据性能设置决定是否显示WebGL背景 */}
      {performanceSettings?.enableWebGL !== false && <BannerBackground />}
      <div className={styles.bannerBackdrop}></div>
      
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <img src={isDarkTheme ? "/img/logo_white.svg" : "/img/logo.svg"} alt="Logo" className={styles.bannerIcon} />
          <h1 className={styles.bannerTitle}>
            <span className={styles.bannerTitleMain}>Post</span>
            <span className={styles.bannerTitleSub}>Plugins</span>
          </h1>
          <p className={styles.bannerSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.bannerDescription}>
            为您的服务器提供高品质、易用且高性能的Minecraft插件，让您的游戏体验更加出色。
          </p>
          <div className={styles.bannerCta}>
            <Link className={styles.primaryButton} to="/intro">
              开始使用
            </Link>
            <Link className={styles.secondaryButton} to="https://github.com/postyizhan">
              GitHub
          </Link>
          </div>
        </div>
      </div>
      
      {/* 简化的滚动箭头 */}
      <div className={styles.scrollDown} onClick={handleScrollDown}>
        <svg className={styles.scrollArrowSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </header>
  );
}

function PluginCard({ plugin }) {
  const [modrinthData, setModrinthData] = useState(null);
  
  // 处理数据加载完成后的回调
  const handleDataLoaded = (data) => {
    console.log('Modrinth数据加载完成:', data);
    setModrinthData(data);
  };
  
  return (
    <div className={styles.pluginCard}>
      <ModrinthFetcher
        projectId={plugin.projectId}
        onDataLoaded={handleDataLoaded}
      >
        {/* 这里为空，因为ModrinthFetcher会调用onDataLoaded回调 */}
      </ModrinthFetcher>
      
              <div className={styles.pluginCardHeader}>
        {modrinthData?.icon_url ? (
          <img 
            src={modrinthData.icon_url} 
            alt={`${plugin.title} icon`} 
            className={styles.pluginCardIcon} 
          />
        ) : (
          <div className={styles.pluginCardIconPlaceholder}>{plugin.title.charAt(0)}</div>
        )}
                <div>
                  <h3 className={styles.pluginCardTitle}>{plugin.title}</h3>
          <span className={styles.pluginCardVersion}>
            {modrinthData?.versions && modrinthData.versions.length > 0 
              ? `v${modrinthData.versions[0].version_number}` 
              : 'v?.?.?'}
          </span>
                </div>
              </div>
              
              <p className={styles.pluginCardDescription}>
                {plugin.description}
              </p>
              
              <div className={styles.pluginCardFooter}>
                <div className={styles.pluginCardTags}>
                  {plugin.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className={styles.pluginCardTag}>{tag}</span>
                  ))}
                </div>
                <Link className={styles.pluginCardButton} to={plugin.link}>
                  查看文档
                </Link>
              </div>
            </div>
  );
}

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
          {plugins.map((plugin, idx) => (
            <PluginCard key={idx} plugin={plugin} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  const features = [
    {
      title: '简单配置',
      description: '直观的配置文件和详细的文档指引，让您能够轻松设置插件，无需复杂操作。',
      emoji: '⚙️'
    },
    {
      title: '性能优化',
      description: '所有插件均经过性能优化，确保在繁忙的服务器环境中也能流畅运行。',
      emoji: '🚀'
    },
    {
      title: '持续更新',
      description: '我们定期更新插件，增加新功能并修复问题，确保您的服务器体验始终保持最佳。',
      emoji: '🔄'
    }
  ];

  return (
    <section className={styles.featureSection} id="features">
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>特性优势</h2>
          <p className={styles.sectionDescription}>
            Post系列插件的核心优势
          </p>
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
            <Link className={styles.supportButton} href="https://qm.qq.com/q/dENGavSflK">
              加入QQ群
            </Link>
            <Link className={styles.supportButton} href="https://github.com/postyizhan/PostPlugins-Docs/issues">
              GitHub Issues
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [performanceSettings, setPerformanceSettings] = useState(null);

  // 性能监控回调
  const handlePerformanceChange = (perfData) => {
    console.log('Performance update:', perfData);

    // 根据性能数据调整设置
    if (perfData.isLowPerformance && !performanceSettings?.lowPerformanceMode) {
      setPerformanceSettings(prev => ({
        ...prev,
        lowPerformanceMode: true,
        enableWebGL: false
      }));
    }
  };

  // 设置视口高度
  useEffect(() => {
    // 初始设置
    setViewportHeight();

    // 检测设备性能
    const devicePerf = PerformanceUtils.detectDevicePerformance();
    const recommendedSettings = PerformanceUtils.getRecommendedSettings(devicePerf);
    setPerformanceSettings(recommendedSettings);

    // 监听窗口大小变化 - 使用防抖优化
    const debouncedResize = PerformanceUtils.debounce(setViewportHeight, 100);

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, []);

  return (
    <Layout title="主页" description="Post系列插件 - 为您的Minecraft服务器提供实用功能增强">
      <PerformanceMonitor onPerformanceChange={handlePerformanceChange} />
      <main className={styles.main}>
        <HomepageBanner performanceSettings={performanceSettings} />
        <FeatureSection />
        <PluginSection />
        <SupportSection />
      </main>
    </Layout>
  );
}
