import React, { useEffect, useRef, useState } from 'react';
import ResourcePage from './ResourcePage';
import styles from './styles.module.css';
import { useColorMode } from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * ResourcePage的MDX包装器，用于在Markdown文档中使用
 */
export default function ResourcePageMDX(props) {
  const containerRef = useRef(null);
  // 保存修改过的元素引用，以便清理
  const [modifiedElements, setModifiedElements] = useState({
    mainColumn: null,
    sidebarColumn: null,
    mdxContent: null
  });
  
  // 存储从Modrinth获取的数据
  const [modrinthData, setModrinthData] = useState(null);
  
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  
  // 定义默认导航项
  const defaultNavigationItems = [
    {
      id: 'intro',
      title: props.name + ' 插件介绍',
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

  // 从props中获取自定义导航项
  const navigationItems = props.navigationItems || [];
  
  // 清理布局函数 - 更强大的清理，处理各种场景
  const cleanupLayout = () => {
    // 尝试多种方式清理已修改的元素
    
    // 1. 使用保存的元素引用
    const { mainColumn, sidebarColumn, mdxContent } = modifiedElements;
    
    if (mainColumn) {
      mainColumn.removeAttribute('data-resource-page');
      mainColumn.style.flex = '';
      mainColumn.style.maxWidth = '';
    }
    
    if (sidebarColumn) {
      sidebarColumn.style.display = '';
    }
    
    if (mdxContent) {
      mdxContent.style.padding = '';
      mdxContent.style.margin = '';
      mdxContent.style.maxWidth = '';
    }
    
    // 2. 备用清理 - 尝试查找并清理所有标记的资源页面元素
    document.querySelectorAll('[data-resource-page="true"]').forEach(element => {
      element.removeAttribute('data-resource-page');
      element.style.flex = '';
      element.style.maxWidth = '';
      
      // 尝试恢复相邻的右侧栏
      const adjacentSidebar = element.parentElement?.querySelector('.col--3');
      if (adjacentSidebar) {
        adjacentSidebar.style.display = '';
      }
      
      // 恢复markdown内容
      const markdownElement = element.querySelector('.markdown');
      if (markdownElement) {
        markdownElement.style.padding = '';
        markdownElement.style.margin = '';
        markdownElement.style.maxWidth = '';
      }
    });
    
    // 3. 移除可能已添加到document的任何资源页面特定样式
    const customStyle = document.getElementById('resource-page-dynamic-style');
    if (customStyle) {
      customStyle.remove();
    }
  };
  
  // 在DOM加载后处理布局
  useEffect(() => {
    // 处理资源页面布局
    const setupResourcePageLayout = () => {
      if (!containerRef.current) return;
      
      // 先执行一次清理，确保没有残留样式
      cleanupLayout();
      
      // 向上查找到最近的列元素
      let colElement = containerRef.current.closest('.col');
      if (!colElement) return;
      
      // 标记该元素为资源页面，使用自定义数据属性
      colElement.setAttribute('data-resource-page', 'true');
      
      // 查找相邻的右侧导航列
      const rightSidebarCol = colElement.parentElement.querySelector('.col--3');
      
      // 确保内容不受容器限制
      const mdxContent = colElement.querySelector('.markdown');
      
      // 保存修改过的元素引用，以便清理
      setModifiedElements({
        mainColumn: colElement,
        sidebarColumn: rightSidebarCol,
        mdxContent: mdxContent
      });
      
      // 应用样式
      if (rightSidebarCol) {
        // 隐藏原始右侧导航
        rightSidebarCol.style.display = 'none';
      }
      
      // 调整当前列的宽度
      colElement.style.flex = '0 0 100%';
      colElement.style.maxWidth = '100%';
      
      if (mdxContent) {
        mdxContent.style.padding = '0';
        mdxContent.style.margin = '0';
        mdxContent.style.maxWidth = '100%';
      }
      
      // 创建特定页面的动态样式，而不是依赖全局CSS
      const styleEl = document.createElement('style');
      styleEl.id = 'resource-page-dynamic-style';
      styleEl.textContent = `
        /* 仅针对当前资源页面的样式 - 使用非常特定的选择器 */
        [data-resource-page="true"] {
          width: 100% !important;
          flex: 0 0 100% !important;
          max-width: 100% !important;
        }
        
        [data-resource-page="true"] > div {
          margin: 0 !important;
          padding: 0 !important;
          max-width: 100% !important;
        }
        
        /* 移动端样式适配 */
        @media (max-width: 996px) {
          .resource-page-container,
          .resource-page-container > div,
          [data-resource-page="true"],
          [data-resource-page="true"] > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
          }
          
          .markdown > div {
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          
          img {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
    };
    
    // 设置定时器确保DOM完全加载
    const timer = setTimeout(setupResourcePageLayout, 100);
    
    // 监听路由变化，以便在导航时清理
    const handleRouteChange = () => {
      cleanupLayout();
    };
    
    // 尝试添加页面变化事件监听器
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      clearTimeout(timer);
      // 执行清理函数
      cleanupLayout();
      // 移除事件监听器
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // 组件卸载时再次确保清理 - 使用更可靠的方式
  useEffect(() => {
    // 为确保清理彻底，直接在全局window对象上添加卸载保证函数
    const originalBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = () => {
      cleanupLayout();
      if (originalBeforeUnload) return originalBeforeUnload();
    };
    
    return () => {
      // 恢复原始处理程序
      window.onbeforeunload = originalBeforeUnload;
      // 执行清理函数
      cleanupLayout();
      
      // 额外保证：等待一小段时间后再次清理，以处理异步导航
      setTimeout(cleanupLayout, 100);
    };
  }, []);
  
  /**
   * 将Modrinth数据映射到ResourcePage组件格式
   * 保证用户提供的数据优先级高于Modrinth数据
   */
  const getMergedProps = () => {
    if (!modrinthData) return props;
    
    // 处理作者信息
    let authors = props.authors || [];
    if (modrinthData.team && Array.isArray(modrinthData.team) && authors.length === 0) {
      authors = modrinthData.team.map(member => ({
        name: member.user?.username || member.user?.name || 'Unknown',
        avatar: member.user?.avatar_url,
        role: member.role
      }));
    }
    
    // 处理Minecraft版本
    let minecraftVersions = props.minecraftVersions || [];
    if (modrinthData.game_versions && Array.isArray(modrinthData.game_versions) && minecraftVersions.length === 0) {
      minecraftVersions = modrinthData.game_versions;
    }
    
    // 映射平台信息
    let platforms = props.platforms || [];
    if (modrinthData.loaders && Array.isArray(modrinthData.loaders) && platforms.length === 0) {
      platforms = modrinthData.loaders;
    }
    
    // 处理最新版本
    let version = props.version;
    if (!version && modrinthData.versions && Array.isArray(modrinthData.versions) && modrinthData.versions.length > 0) {
      version = modrinthData.versions[0].version_number;
    }
    
    // 处理其他平台
    let otherPlatforms = props.otherPlatforms || [];
    
    // 如果有MineBBS ID，添加MineBBS平台
    if (props.minebbsId) {
      otherPlatforms.push({
        name: 'MineBBS',
        url: `https://www.minebbs.com/resources/${props.minebbsId}/`,
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17l10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12l10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      });
    }
    
    // 如果有SpigotMC ID，添加SpigotMC平台
    if (props.spigotId) {
      otherPlatforms.push({
        name: 'SpigotMC',
        url: `https://www.spigotmc.org/resources/${props.spigotId}/`,
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      });
    }
    
    return {
      ...props,
      name: props.name || modrinthData.title,
      description: props.description || modrinthData.description,
      icon: props.icon || modrinthData.icon_url,
      downloads: props.downloads !== undefined ? props.downloads : modrinthData.downloads,
      likes: props.likes !== undefined ? props.likes : modrinthData.followers,
      category: props.category || (modrinthData.categories && modrinthData.categories.length > 0 ? modrinthData.categories[0] : 'plugin'),
      authors,
      minecraftVersions,
      platforms,
      version,
      repo: props.repo || modrinthData.source_url,
      website: props.website || modrinthData.website_url,
      modrinthData, // 确保传递完整的modrinthData对象
      otherPlatforms // 添加其他平台
    };
  };
  
  // 如果提供了 modrinthId，则自动获取 Modrinth 数据
  const ModrinthDataFetcher = ({ modrinthId }) => {
    if (!modrinthId) return null;

    return (
      <BrowserOnly>
        {() => {
          // 动态导入 ModrinthFetcher 组件
          const ModrinthFetcher = require('./ModrinthFetcher').default;
          
          return (
            <ModrinthFetcher projectId={modrinthId} onDataLoaded={(data) => {
              // 存储完整的Modrinth数据
              console.log('Modrinth数据加载成功:', data);
              setModrinthData(data);
            }} />
          );
        }}
      </BrowserOnly>
    );
  };

  // 合并Modrinth数据和用户提供的props
  const mergedProps = React.useMemo(() => {
    try {
      return getMergedProps();
    } catch (error) {
      console.error('合并Modrinth数据时出错:', error);
      return props; // 出错时返回原始props
    }
  }, [modrinthData, props]);

  return (
    <div className="resource-page-container" ref={containerRef}>
      {props.modrinthId && <ModrinthDataFetcher modrinthId={props.modrinthId} />}
      
      <ResourcePage
        {...mergedProps}
      >
        {props.children}
      </ResourcePage>
    </div>
  );
} 