import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';
import ModrinthFetcher from '../components/ResourceComponents/ModrinthFetcher';

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
  }
];

// WebGL背景效果组件
function BannerBackground() {
  const canvasRef = useRef(null);
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // 设置画布尺寸
    const setCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
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
      
      // 简单的柏林噪声实现
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // 波浪函数
      float wave(vec2 position, float time, float speed, float frequency, float amplitude) {
        return sin(dot(position, vec2(0.0, frequency)) + time * speed) * amplitude;
      }
      
      void main() {
        vec2 st = v_texCoord;
        st.x *= u_resolution.x / u_resolution.y;
        
        // 动态渐变
        float time = u_time * 0.2;
        
        // 创建多层波浪效果
        float wave1 = wave(st, time, 0.5, 10.0, 0.03);
        float wave2 = wave(st, time, 0.3, 15.0, 0.02);
        float wave3 = wave(st, time * 0.8, 0.7, 5.0, 0.01);
        
        // 合并波浪
        float combinedWaves = wave1 + wave2 + wave3;
        
        // 使用波浪扭曲坐标
        vec2 distortedUV = st + vec2(combinedWaves * 0.2, combinedWaves * 0.3);
        
        // 生成多层噪声
        float noise1 = snoise(distortedUV * 2.0 + time * 0.2) * 0.5 + 0.5;
        float noise2 = snoise(distortedUV * 3.0 - time * 0.15) * 0.5 + 0.5;
        float noise3 = snoise(distortedUV * 1.0 + time * 0.1) * 0.5 + 0.5;
        
        // 混合噪声
        float finalNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
        
        // 为亮色和暗色主题设置不同的颜色
        vec3 color;
        if(u_isDark) {
          // 暗色主题 - 深蓝色到紫色渐变
          vec3 color1 = vec3(0.05, 0.1, 0.2);  // 深蓝色
          vec3 color2 = vec3(0.15, 0.05, 0.3); // 深紫色
          vec3 color3 = vec3(0.05, 0.15, 0.25); // 深青色
          
          // 使用波浪效果来混合颜色
          float waveBlend = (sin(time * 0.2) * 0.5 + 0.5) * 0.3;
          color = mix(mix(color1, color2, noise1 + waveBlend), color3, noise2);
          
          // 添加一些亮点
          float highlight = pow(noise3, 5.0) * 0.8;
          color += vec3(0.3, 0.4, 0.9) * highlight;
          
          // 添加波浪光效
          float waveHighlight = smoothstep(0.3, 0.7, sin(st.y * 20.0 + time * 2.0) * 0.5 + 0.5);
          color += vec3(0.1, 0.2, 0.5) * waveHighlight * 0.1;
        } else {
          // 亮色主题 - 白色到浅蓝色渐变
          vec3 color1 = vec3(0.95, 0.98, 1.0); // 近白色
          vec3 color2 = vec3(0.8, 0.9, 1.0);   // 浅蓝色
          vec3 color3 = vec3(0.9, 0.95, 1.0);  // 浅灰蓝色
          
          // 使用波浪效果来混合颜色
          float waveBlend = (sin(time * 0.2) * 0.5 + 0.5) * 0.3;
          color = mix(mix(color1, color2, noise1 + waveBlend), color3, noise2);
          
          // 添加一些蓝色亮点
          float highlight = pow(noise3, 5.0) * 0.2;
          color += vec3(0.0, 0.3, 0.8) * highlight;
          
          // 添加波浪光效
          float waveHighlight = smoothstep(0.3, 0.7, sin(st.y * 20.0 + time * 2.0) * 0.5 + 0.5);
          color += vec3(0.0, 0.2, 0.4) * waveHighlight * 0.05;
        }
        
        // 添加渐变效果
        color = mix(color, color * (0.8 + 0.2 * sin(st.y * 3.14159 + time)), 0.1);
        
        // 添加波纹效果
        float ripple = sin(length(st - vec2(0.5)) * 20.0 - time * 3.0) * 0.03;
        color += (isDarkTheme ? vec3(0.2, 0.3, 0.5) : vec3(0.0, 0.1, 0.3)) * ripple;
        
        // 边缘淡化效果
        float vignette = smoothstep(0.0, 0.7, 0.7 - length(st - vec2(0.5, 0.5)));
        color *= 0.8 + 0.2 * vignette;
        
        gl_FragColor = vec4(color, 0.9); // 轻微透明度
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
    
    // 启用属性
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    // 动画循环
    let startTime = Date.now();
    let animationFrameId;
    
    function render() {
      const currentTime = (Date.now() - startTime) / 1000; // 转换为秒
      
      gl.useProgram(program);
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1i(isDarkUniformLocation, isDarkTheme ? 1 : 0);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      animationFrameId = requestAnimationFrame(render);
    }
    
    render();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
      // 清理WebGL资源
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [isDarkTheme]);
  
  return <canvas ref={canvasRef} className={styles.bannerBackground} />;
}

function HomepageBanner() {
  const {siteConfig} = useDocusaurusContext();
  
  const handleScrollDown = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <header className={styles.banner}>
      <BannerBackground />
      <div className={styles.bannerBackdrop}></div>
      
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerIcon}>
            <div className={styles.bannerIconInner}>⚒️</div>
          </div>
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
  return (
    <Layout title="主页" description="Post系列插件 - 为您的Minecraft服务器提供实用功能增强">
      <main className={styles.main}>
        <HomepageBanner />
        <FeatureSection />
        <PluginSection />
        <SupportSection />
      </main>
    </Layout>
  );
}
