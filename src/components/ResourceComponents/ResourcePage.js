import React, { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

/**
 * 防抖函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 资源页面组件
 * 可以在 Markdown 中使用，用于展示插件资源信息
 */
export default function ResourcePage({
  id,
  name,
  icon,
  description,
  version,
  downloads,
  likes,
  category = 'plugin',
  authors = [],
  minecraftVersions = [],
  dependencies = [],
  platforms = [],
  environments = [],
  repo,
  website,
  supportedVersions,
  tags = [],
  features = [],
  screenshots = [],
  children,
  navigationItems = [],
  modrinthData,
  otherPlatforms = [], // 添加其他平台参数
}) {
  const [activeTab, setActiveTab] = useState('description');
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  const location = useLocation();
  
  // 添加下拉菜单状态
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // 自动生成导航项
  const defaultNavigationItems = [
    {
      id: 'intro',
      title: name + ' 插件介绍',
      href: '#plugin-intro',
    },
    {
      id: 'features',
      title: '核心功能',
      href: '#core-features',
    },
    {
      id: 'usage',
      title: '使用方法',
      href: '#usage',
    },
    {
      id: 'config',
      title: '配置示例',
      href: '#config',
    },
  ];
  
  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavigationItems;
  
  // 格式化下载次数
  const formatDownloads = (num) => {
    if (num === undefined || num === null) {
      return '0';
    }
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2).replace(/\.0+$/, '')}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0+$/, '')}K`;
    }
    return num.toString();
  };

  // 跟踪活动导航项
  const [activeNavItem, setActiveNavItem] = useState(navItems[0]?.id);
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  
  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 防抖动的滚动处理
  const debouncedHandleScroll = useCallback(
    debounce(() => {
      if (!contentRef.current || !sidebarRef.current) return;
      
      // 获取当前滚动位置
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // 处理侧边栏跟随滚动效果
      const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
      
      // 处理滚动方向
      if (scrollDirection === 'down') {
        // 向下滚动超过特定阈值，确保导航栏可见
        if (scrollTop > 200) {
          sidebarRef.current.style.transform = 'translateY(0)';
          sidebarRef.current.classList.add('sidebar-scrolling');
        }
      } else {
        // 向上滚动，显示侧边栏
        sidebarRef.current.style.transform = 'translateY(0)';
        sidebarRef.current.classList.remove('sidebar-scrolling');
      }
      
      setLastScrollTop(scrollTop);
      
      // 更新当前活动导航项
      updateActiveNavItem();
    }, 10),
    [lastScrollTop]
  );
  
  // 更新活动导航项
  const updateActiveNavItem = () => {
    if (!contentRef.current) return;
    
    const sections = contentRef.current.querySelectorAll('h2, h3');
    let currentActiveId = navItems[0]?.id;
    
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < 100) {
        const id = section.getAttribute('id');
        const matchedNavItem = navItems.find(item => item.href === `#${id}`);
        if (matchedNavItem) {
          currentActiveId = matchedNavItem.id;
        }
      }
    });
    
    setActiveNavItem(currentActiveId);
  };
  
  // 获取下载链接
  const getDownloadUrl = () => {
    console.log('modrinthData:', modrinthData);
    
    if (modrinthData) {
      // 直接返回Modrinth下载页面链接
      const modrinthPageUrl = `https://modrinth.com/plugin/${modrinthData.slug || modrinthData.id}/versions`;
      console.log('使用Modrinth页面链接:', modrinthPageUrl);
      return modrinthPageUrl;
    }
    
    // 如果没有Modrinth数据，尝试使用网站链接
    const fallbackUrl = website || repo || "#";
    console.log('使用备用链接:', fallbackUrl);
    return fallbackUrl;
  };
  
  useEffect(() => {
    // 直接绑定滚动处理函数（非防抖动版本），确保快速响应滚动事件
    const handleScroll = () => {
      if (!sidebarRef.current) return;
      // 轻量级操作以保持平滑
      sidebarRef.current.classList.toggle('is-scrolling', window.scrollY > 100);
    };
    
    // 防抖动处理复杂计算
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    // 添加交叉观察器，用于检测元素是否可见
    const setupIntersectionObserver = () => {
      if (!contentRef.current) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            // 当内容进入或离开视口时更新侧边栏可见性
            if (entry.isIntersecting) {
              setSidebarVisible(true);
            }
          });
        },
        { threshold: [0, 0.1, 0.5, 0.9, 1] }
      );
      
      observer.observe(contentRef.current);
      
      return () => {
        if (contentRef.current) observer.unobserve(contentRef.current);
        observer.disconnect();
      };
    };
    
    const observerCleanup = setupIntersectionObserver();
    
    // 初始运行一次
    updateActiveNavItem();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', debouncedHandleScroll);
      if (observerCleanup) observerCleanup();
    };
  }, [debouncedHandleScroll, navItems]);
  
  // 确保粘性定位能够正确工作的脚本
  useEffect(() => {
    // 创建脚本标签
    const script = document.createElement('script');
    script.id = 'sticky-fix-script';
    script.innerHTML = `
      (function() {
        // 确保侧边栏粘性定位正常工作
        function fixStickyPosition() {
          const sidebar = document.querySelector('[class*="resourcePageSidebar_"]');
          
          if (sidebar) {
            // 强制position: sticky
            sidebar.style.position = 'sticky';
            sidebar.style.position = '-webkit-sticky';
            sidebar.style.top = 'calc(var(--ifm-navbar-height) + 1rem)';
            sidebar.style.alignSelf = 'flex-start';
            
            // 隐藏滚动条
            sidebar.style.scrollbarWidth = 'none';
            sidebar.style.msOverflowStyle = 'none';
            
            // 添加隐藏滚动条的样式表
            if (!document.getElementById('hide-scrollbar-style')) {
              const style = document.createElement('style');
              style.id = 'hide-scrollbar-style';
              style.textContent = '[class*="resourcePageSidebar_"]::-webkit-scrollbar { display: none; width: 0; background: transparent; }';
              document.head.appendChild(style);
            }
          }
        }
        
        // 在DOM加载完成后执行
        document.addEventListener('DOMContentLoaded', fixStickyPosition);
        
        // 监听滚动事件
        window.addEventListener('scroll', function() {
          requestAnimationFrame(fixStickyPosition);
        });
      })();
    `;
    
    // 添加到文档中
    if (!document.getElementById('sticky-fix-script')) {
      document.body.appendChild(script);
    }
    
    return () => {
      // 清理
      if (document.getElementById('sticky-fix-script')) {
        document.getElementById('sticky-fix-script').remove();
      }
    };
  }, []);
  
  // 默认其他平台
  const defaultOtherPlatforms = [
    {
      name: 'MineBBS',
      url: `https://www.minebbs.com/resources/${name.toLowerCase()}/`,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17l10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12l10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    },
    {
      name: 'SpigotMC',
      url: `https://www.spigotmc.org/resources/${name.toLowerCase()}/`,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    }
  ];
  
  // 合并自定义和默认平台
  const allPlatforms = otherPlatforms.length > 0 ? otherPlatforms : defaultOtherPlatforms;
  
  return (
    <div className={styles.resourcePageWrapper} style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: 'none',
      overflow: 'visible',
      position: 'relative'
    }}>
      {/* 全宽显示的蓝色Header部分 */}
      <div className={styles.resourceHeaderFull}>
        <div className={styles.resourceHeader}>
          <div className={styles.resourceHeaderBackdrop}>
            <div className={styles.headerGlow}></div>
          </div>
          
          <div className={styles.resourceHeaderInner}>
            <div className={styles.resourceIcon}>
              {icon ? (
                <img src={icon} alt={`${name} 图标`} />
              ) : (
                <div className={styles.placeholderIcon}>
                  {name ? name.charAt(0).toUpperCase() : 'P'}
                </div>
              )}
            </div>
            
            <div className={styles.resourceMeta}>
              <h1 className={styles.resourceTitle}>{name}</h1>
              <p className={styles.resourceDescription}>{description}</p>
              
              <div className={styles.resourceMetaInfo}>
                <div className={styles.metaItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.58 13.15L11.15 18.58C10.96 18.77 10.71 18.87 10.45 18.87C10.19 18.87 9.94 18.77 9.75 18.58L6.4 15.23C6.02 14.85 6.02 14.23 6.4 13.85C6.78 13.47 7.4 13.47 7.78 13.85L10.45 16.52L15.2 11.77C15.58 11.39 16.2 11.39 16.58 11.77C16.96 12.15 16.96 12.77 16.58 13.15Z" fill="currentColor"/>
                  </svg>
                  <span>{version}</span>
                </div>
                
                <div className={styles.metaItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3M12 15L8 11M12 15L16 11M3 15V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16V15M6 21H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{formatDownloads(downloads)}</span>
                </div>
                
                <div className={styles.metaItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                  </svg>
                  <span>{likes}</span>
                </div>
                
                {category && (
                  <div className={clsx(styles.metaItem, styles.category)}>
                    {category}
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.resourceActions}>
              <a 
                href={getDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadButton}
                onClick={(e) => {
                  // 确保链接有效
                  const url = getDownloadUrl();
                  console.log('点击下载按钮，链接:', url);
                  
                  if (url === "#") {
                    e.preventDefault();
                    alert("下载链接暂不可用");
                  }
                  // 不阻止默认行为，让浏览器正常打开链接
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15V3M12 15L8 11M12 15L16 11M3 15V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16V15M6 21H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                下载
              </a>
              
              <div className={styles.dropdownContainer} ref={dropdownRef}>
                <button 
                  className={styles.actionButton} 
                  title="更多平台"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>其他平台</div>
                    {allPlatforms.map((platform, index) => (
                      <a 
                        key={index}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.dropdownItem}
                      >
                        {platform.icon}
                        <span>{platform.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.resourceContent} style={{
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative'
      }}>
        <div className={styles.resourceContentLeft}>
          <div className={styles.resourceTabs}>
            <button 
              className={clsx(styles.tabButton, activeTab === 'description' && styles.activeTab)}
              onClick={() => setActiveTab('description')}
            >
              描述
            </button>
            <button 
              className={clsx(styles.tabButton, activeTab === 'changelog' && styles.activeTab)}
              onClick={() => setActiveTab('changelog')}
            >
              更新日志
            </button>
            <button 
              className={clsx(styles.tabButton, activeTab === 'versions' && styles.activeTab)}
              onClick={() => setActiveTab('versions')}
            >
              版本
            </button>
          </div>
          
          <div className={styles.resourceTabContent}>
            {activeTab === 'description' && (
              <div className={styles.descriptionContent} ref={contentRef}>
                {children || (
                  <p>暂无描述内容。</p>
                )}
                
                {screenshots && screenshots.length > 0 && (
                  <div className={styles.screenshotGallery}>
                    <h3 className={styles.galleryTitle}>屏幕截图</h3>
                    <div className={styles.screenshotGrid}>
                      {screenshots.map((screenshot, index) => (
                        <div key={index} className={styles.screenshotItem}>
                          <img src={screenshot} alt={`截图 ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {features && features.length > 0 && (
                  <div className={styles.featuresList}>
                    <h3 className={styles.featuresTitle} id="core-features">功能特性</h3>
                    <ul className={styles.featuresGrid}>
                      {features.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'changelog' && (
              <div className={styles.changelogContent}>
                {modrinthData && modrinthData.versions && modrinthData.versions.length > 0 ? (
                  <div>
                    <h3>最新更新</h3>
                    {modrinthData.versions.slice(0, 5).map((version, index) => (
                      <div key={index} className={styles.changelogEntry}>
                        <h4>
                          {version.version_number} 
                          <span className={styles.versionDate}>
                            {new Date(version.date_published).toLocaleDateString('zh-CN')}
                          </span>
                        </h4>
                        <div className={styles.changelogBody}>
                          {version.changelog ? (
                            <div dangerouslySetInnerHTML={{ __html: version.changelog.replace(/\n/g, '<br/>') }} />
                          ) : (
                            <p>此版本没有更新日志。</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>暂无更新日志。</p>
                )}
              </div>
            )}
            
                          {activeTab === 'versions' && (
              <div className={styles.versionsContent}>
                {modrinthData && modrinthData.versions && modrinthData.versions.length > 0 ? (
                  <div>
                    <h3>版本历史</h3>
                    <div className={styles.versionCardList}>
                      {modrinthData.versions.map((version, index) => {
                        // 格式化游戏版本
                        let gameVersions = version.game_versions || [];
                        
                        // 智能分组版本号
                        let majorVersions = [];
                        if (gameVersions.length > 0) {
                          // 提取主要版本号并去重
                          majorVersions = [...new Set(gameVersions.map(v => v.split('.')[0] + '.' + v.split('.')[1]))];
                        }
                        
                        // 获取Modrinth版本页面URL
                        const modrinthVersionUrl = `https://modrinth.com/plugin/${modrinthData.slug || modrinthData.id}/version/${version.id}`;
                        
                        // 格式化发布日期
                        const publishDate = new Date(version.date_published);
                        const formattedDate = publishDate.toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                        
                        return (
                          <div key={index} className={styles.versionCard}>
                            <div className={styles.versionMeta}>
                              <div className={styles.versionNumber}>v{version.version_number}</div>
                              <div className={styles.versionDate}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {formattedDate}
                              </div>
                            </div>
                            <div className={styles.versionContent}>
                              <div className={styles.versionInfo}>
                                <div className={styles.versionInfoItem}>
                                  <div className={styles.versionInfoLabel}>支持的 Minecraft 版本</div>
                                  <div className={styles.versionTagList}>
                                    {majorVersions.length > 0 ? (
                                      majorVersions.map((v, i) => (
                                        <span key={i} className={styles.versionTag}>{v}</span>
                                      ))
                                    ) : (
                                      <span className={styles.versionTag}>未知</span>
                                    )}
                                  </div>
                                </div>
                                
                                {version.loaders && version.loaders.length > 0 && (
                                  <div className={styles.versionInfoItem}>
                                    <div className={styles.versionInfoLabel}>支持的平台</div>
                                    <div className={styles.versionTagList}>
                                      {version.loaders.map((loader, i) => (
                                        <span key={i} className={styles.versionTag}>{loader}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className={styles.versionActions}>
                                <a 
                                  href={modrinthVersionUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`${styles.versionButton} ${styles.versionDownloadButton}`}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15V3M12 15L8 11M12 15L16 11M3 15V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16V15M6 21H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  查看详情
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p>暂无版本历史。</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <aside 
          className={`${styles.resourcePageSidebar} resource-sidebar-sticky`} 
          ref={sidebarRef}
          style={{
            position: 'sticky',
            position: '-webkit-sticky',
            top: 'calc(var(--ifm-navbar-height) + 1rem)',
            maxHeight: 'calc(100vh - var(--ifm-navbar-height) - 2rem)',
            overflowY: 'auto',
            alignSelf: 'flex-start',
            display: 'block',
            zIndex: 10,
            transform: 'translateZ(0)',
            willChange: 'transform',
            transition: 'transform 0.3s ease',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* 自定义导航栏 */}
          <div className={styles.resourceSidebarNavigation}>
            <h3 className={styles.sidebarNavigationTitle}>{name} 操作指南</h3>
            <ul className={styles.sidebarNavigationList}>
              {navItems.map((item) => (
                <li key={item.id} className={styles.sidebarNavigationItem}>
                  <a 
                    href={item.href} 
                    className={clsx(
                      styles.sidebarNavigationLink,
                      activeNavItem === item.id && styles.sidebarNavigationLinkActive
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      
                      // 设置活动项
                      setActiveNavItem(item.id);
                      
                      // 查找目标元素
                      const target = document.querySelector(item.href);
                      const idTarget = document.getElementById(item.href.replace('#', ''));
                      const scrollTarget = target || idTarget;
                      
                      if (scrollTarget) {
                        // 添加高亮动画效果
                        scrollTarget.classList.add('highlight-section');
                        setTimeout(() => {
                          scrollTarget.classList.remove('highlight-section');
                        }, 2000);
                        
                        // 平滑滚动到目标
                        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 60;
                        const targetPosition = scrollTarget.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = targetPosition - navbarHeight - 20;
                        
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                        
                        // 给侧边栏添加一个临时活动状态
                        if (sidebarRef.current) {
                          sidebarRef.current.classList.add('is-navigating');
                          setTimeout(() => {
                            sidebarRef.current.classList.remove('is-navigating');
                          }, 500);
                        }
                      }
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 兼容性信息 */}
          <div className={styles.resourceSidebarCard}>
            <h3 className={styles.sidebarCardTitle}>兼容性</h3>
            <div className={styles.compatibilitySection}>
              <h4 className={styles.compatibilitySectionTitle}>Minecraft: Java 版</h4>
              <div className={styles.versionTags}>
                {minecraftVersions.map((version, index) => (
                  <span key={index} className={styles.versionTag}>{version}</span>
                ))}
                
                {minecraftVersions.length === 0 && (
                  <span className={styles.noData}>暂无版本信息</span>
                )}
              </div>
            </div>
          </div>
          
          {/* 运行平台信息 */}
          <div className={styles.resourceSidebarCard}>
            <h3 className={styles.sidebarCardTitle}>运行平台</h3>
            <div className={styles.platformsSection}>
              {platforms.map((platform, index) => (
                <div key={index} className={styles.platformTag}>
                  <span>{platform}</span>
                </div>
              ))}
              
              {platforms.length === 0 && (
                <span className={styles.noData}>暂无平台信息</span>
              )}
            </div>
          </div>
          
          {/* 链接区域 */}
          <div className={styles.resourceSidebarCard}>
            <h3 className={styles.sidebarCardTitle}>链接</h3>
            <div className={styles.linksSection}>
              {repo && (
                <a href={repo} className={styles.resourceLink} target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.5C19.9988 8.30583 19.5322 7.15684 18.7 6.3C19.0903 5.26128 19.0545 4.11985 18.7 3.1C18.7 3.1 17.6 2.8 15.7 4.1C14.0396 3.66459 12.2604 3.66459 10.6 4.1C8.7 2.8 7.6 3.1 7.6 3.1C7.24546 4.11985 7.20973 5.26128 7.6 6.3C6.76777 7.15684 6.30123 8.30583 6.3 9.5C6.3 14 9 15.2 11.8 15.5C11.2 16.1 11.1 16.7 11.1 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>GitHub 仓库</span>
                </a>
              )}
              
              {website && (
                <a href={website} className={styles.resourceLink} target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3C14.0082 5.71333 15.1617 9.32 15 13C14.8383 16.68 13.6847 20.2867 12 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3C9.99183 5.71333 8.83834 9.32 9 13C9.16166 16.68 10.3153 20.2867 12 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>官方网站</span>
                </a>
              )}
            </div>
          </div>
          
          {/* 作者信息 */}
          {authors.length > 0 && (
            <div className={styles.resourceSidebarCard}>
              <h3 className={styles.sidebarCardTitle}>作者</h3>
              <div className={styles.authorsSection}>
                {authors.map((author, index) => (
                  <div key={index} className={styles.authorItem}>
                    {author.avatar ? (
                      <img src={author.avatar} alt={`${author.name} 头像`} className={styles.authorAvatar} />
                    ) : (
                      <div className={styles.authorAvatarPlaceholder}>
                        {author.name ? author.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                    )}
                    <span className={styles.authorName}>{author.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
} 