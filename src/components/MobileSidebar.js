import React, { useState, useEffect, useCallback } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
// 导入侧边栏配置
import sidebarConfig from '../../sidebars';
import styles from './MobileSidebar.module.css';

function MobileSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState({});
  const { siteConfig } = useDocusaurusContext();
  const allDocsData = useAllDocsData();

  // 直接使用侧边栏配置
  const mainSidebar = sidebarConfig.tutorialSidebar || [];

  // 获取所有文档数据，用于查找标题
  const allDocs = React.useMemo(() => {
    const docsMap = {};

    Object.keys(allDocsData).forEach(pluginId => {
      const docsPlugin = allDocsData[pluginId];
      const versions = docsPlugin.versions || [];

      versions.forEach(version => {
        const docs = version.docs || [];
        docs.forEach(doc => {
          docsMap[doc.id] = {
            ...doc,
            frontMatter: doc.frontMatter || {}
          };
        });
      });
    });

    return docsMap;
  }, [allDocsData]);

  // 判断链接是否激活
  const isActive = (to) => {
    if (!to) return false;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  // 获取文档链接
  const getDocLink = (id) => {
    if (!id) return '/';
    return `/${id.replace(/^\//, '')}`;
  };
  
  // 获取文档标题 - 使用预定义的标题映射
  const getDocTitle = useCallback((id) => {
    if (!id) return '';

    // 预定义的标题映射，基于 Markdown 文件的 frontmatter title
    const titleMap = {
      'intro': 'PostPlugins',
      'PostSpawner/intro': '开始',
      'PostSpawner/command': '命令',
      'PostSpawner/permission': '权限',
      'PostSpawner/items': '物品设置',
      'PostDrop/intro': '开始',
      'PostDrop/command': '命令',
      'PostDrop/permission': '权限',
      'PostDrop/PlaceholderAPI': 'PlaceholderAPI',
      'PostWarp/intro': '开始',
      'components/index': '组件',
      'components/badges': '徽章',
      'components/discord-badge-example': 'Discord 徽章示例',
      'components/more-badges': '更多徽章',
      'components/usage-guide': '使用指南'
    };

    // 首先尝试从预定义映射获取
    if (titleMap[id]) {
      return titleMap[id];
    }

    // 尝试从文档数据中获取标题
    const doc = allDocs[id];
    if (doc && doc.frontMatter && doc.frontMatter.title) {
      return doc.frontMatter.title;
    }

    if (doc && doc.title) {
      return doc.title;
    }

    // 如果没有找到，返回格式化的ID作为备选
    const lastSegment = id.split('/').pop();
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [allDocs]);

  // 切换分类展开/折叠
  const toggleCategory = (label) => {
    setExpandedCategories(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // 自动展开当前页面所在的分类
  useEffect(() => {
    const path = location.pathname;
    if (mainSidebar && mainSidebar.length) {
      mainSidebar.forEach(item => {
        if (item.type === 'category') {
          const shouldExpand = item.items?.some(subItem => {
            const docLink = getDocLink(subItem.id || subItem);
            return path.startsWith(docLink);
          });
          
          if (shouldExpand) {
            setExpandedCategories(prev => ({
              ...prev,
              [item.label]: true
            }));
          }
        }
      });
    }
  }, [location.pathname, mainSidebar]);

  // 渲染侧边栏项
  const renderSidebarItem = (item) => {
    if (!item) return null;
    
    // 处理简单的文档ID字符串
    if (typeof item === 'string') {
      const docLink = getDocLink(item);
      const title = getDocTitle(item);

      return (
        <Link
          key={item}
          to={docLink}
          className={`${styles.mobileSidebarLink} ${isActive(docLink) ? styles.mobileSidebarLinkActive : ''}`}
          onClick={onClose}
        >
          {title}
        </Link>
      );
    }

    // 处理分类
    if (item.type === 'category') {
      const isExpanded = expandedCategories[item.label] || false;
      return (
        <div key={item.label} className={styles.mobileSidebarItem}>
          <div 
            className={`${styles.mobileSidebarCategory} ${
              item.items?.some(subItem => isActive(getDocLink(subItem.id || subItem))) 
                ? styles.mobileSidebarCategoryActive 
                : ''
            }`}
            onClick={() => toggleCategory(item.label)}
          >
            <span>{item.label}</span>
            <svg 
              className={`${styles.mobileSidebarCategoryIcon} ${isExpanded ? styles.mobileSidebarCategoryIconRotated : ''}`} 
              width="14" 
              height="14" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={`${styles.mobileSidebarSubItems} ${isExpanded ? styles.mobileSidebarSubItemsExpanded : ''}`}>
            {item.items?.map(subItem => renderSidebarItem(subItem))}
          </div>
        </div>
      );
    }
    
    // 处理普通文档
    if (item.id) {
      const docLink = getDocLink(item.id);
      const title = item.label || getDocTitle(item.id);

      return (
        <Link
          key={item.id}
          to={docLink}
          className={`${styles.mobileSidebarLink} ${isActive(docLink) ? styles.mobileSidebarLinkActive : ''}`}
          onClick={onClose}
        >
          {title}
        </Link>
      );
    }

    return null;
  };

  return (
    <div className={`${styles.mobileSidebar} ${isOpen ? styles.mobileSidebarOpen : ''}`}>
      <div className={styles.mobileSidebarBackdrop} onClick={onClose}></div>
      <div className={styles.mobileSidebarContainer}>
        <div className={styles.mobileSidebarHeader}>
          <h2 className={styles.mobileSidebarTitle}>文档导航</h2>
          <button className={styles.mobileSidebarCloseButton} onClick={onClose} aria-label="关闭侧边栏">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.mobileSidebarContent}>
          {mainSidebar && mainSidebar.length > 0 ? (
            mainSidebar.map(item => renderSidebarItem(item))
          ) : (
            <div className={styles.mobileSidebarEmpty}>
              <p>暂无导航内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileSidebar; 