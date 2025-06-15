import React, { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation, useHistory } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

function CustomNavbar() {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode, setColorMode } = useColorMode();
  const location = useLocation();
  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);
  const [currentPluginPage, setCurrentPluginPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pluginsPerPage = 4; // 每页显示的插件数量改为4个
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  // 插件数据 - 只保留实际存在的插件
  const pluginsData = [
    {
      id: 'postspawner',
      name: 'PostSpawner',
      description: '刷怪笼控制',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      to: '/PostSpawner/intro',
      docs: [
        { label: '基础介绍', to: '/PostSpawner/intro' },
        { label: '命令用法', to: '/PostSpawner/command' },
        { label: '权限设置', to: '/PostSpawner/permission' },
        { label: '物品设置', to: '/PostSpawner/items' },
      ]
    },
    {
      id: 'postdrop',
      name: 'PostDrop',
      description: '物品丢弃保护',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7L12 3L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 12L12 16L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      to: '/PostDrop/intro',
      docs: [
        { label: '基础介绍', to: '/PostDrop/intro' },
        { label: '命令用法', to: '/PostDrop/command' },
        { label: '权限设置', to: '/PostDrop/permission' },
        { label: 'PlaceholderAPI', to: '/PostDrop/PlaceholderAPI' },
      ]
    }
  ];
  
  // 搜索过滤插件
  const filteredPlugins = searchTerm 
    ? pluginsData.filter(plugin => 
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.docs.some(doc => doc.label.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : pluginsData;
  
  // 计算总页数
  const totalPages = Math.ceil(filteredPlugins.length / pluginsPerPage);
  
  // 获取当前页的插件
  const getCurrentPagePlugins = () => {
    const startIndex = (currentPluginPage - 1) * pluginsPerPage;
    const endIndex = startIndex + pluginsPerPage;
    return filteredPlugins.slice(startIndex, endIndex);
  };
  
  // 处理搜索输入
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPluginPage(1); // 重置到第一页
  };
  
  // 切换到下一页
  const goToNextPage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPluginPage < totalPages) {
      setCurrentPluginPage(currentPluginPage + 1);
    }
  };
  
  // 切换到上一页
  const goToPrevPage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPluginPage > 1) {
      setCurrentPluginPage(currentPluginPage - 1);
    }
  };

  // 监听滚动事件，添加导航栏滚动效果
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setOpenLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 切换主题
  const toggleColorMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  // 切换菜单
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 导航链接
  const navItems = [
    { label: '开始', to: '/intro' },
    { 
      label: '插件', 
      items: [
        { 
          label: 'PostSpawner',
          description: '刷怪笼控制插件',
          to: '/PostSpawner/intro',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          ),
        },
        { 
          label: 'PostDrop',
          description: '物品丢弃保护插件',
          to: '/PostDrop/intro',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L12 3L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 12L12 16L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        },
      ]
    },
  ];

  // 判断链接是否激活
  const isActive = (to) => {
    return location.pathname.startsWith(to);
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarBackdrop}></div>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarBrand}>
          <Link to="/" className={styles.navbarLogo}>
            <span className={styles.navbarTitle}>
              <span className={styles.navbarTitleMain}>Post</span>
              <span className={styles.navbarTitleSub}>Plugins</span>
            </span>
          </Link>
        </div>

        {/* 桌面导航 */}
        <nav className={styles.navbarItems}>
          {navItems.map((item, i) => (
            item.items ? (
              <div 
                key={i} 
                className={`${styles.navbarDropdown}`} 
                ref={openDropdown === i ? dropdownRef : null}
              >
                <button 
                  className={`${styles.navbarItem} ${styles.navbarDropdownToggle}`}
                  onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                >
                  {item.label}
                  <svg className={`${styles.dropdownArrow} ${openDropdown === i ? styles.dropdownArrowOpen : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {openDropdown === i && (
                  <div className={styles.compactMegaMenu}>
                    <div className={styles.compactMenuBackdrop}></div>
                    <div className={styles.compactMenuContainer}>
                      <div className={styles.menuSearchBar}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input 
                          type="text" 
                          placeholder="搜索插件..." 
                          className={styles.menuSearchInput}
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      <div className={styles.compactMenuColumns}>
                        <div className={styles.compactMenuLeft}>
                          <h3 className={styles.compactMenuTitle}>插件列表</h3>
                          <div className={styles.pluginGrid}>
                            {getCurrentPagePlugins().map((plugin, j) => (
                              <div key={j} className={styles.pluginListItem}>
                                <Link 
                                  to={plugin.to}
                                  className={styles.pluginListLink}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <div className={styles.pluginListIcon}>
                                    {plugin.icon}
                                  </div>
                                  <div className={styles.pluginListContent}>
                                    <h4>{plugin.name}</h4>
                                    <span>{plugin.description}</span>
                                  </div>
                                </Link>
                                
                                <div className={styles.pluginDocs}>
                                  {plugin.docs.map((doc, k) => (
                                    <Link 
                                      key={k}
                                      to={doc.to}
                                      className={styles.pluginDocLink}
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      {doc.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                                                      {filteredPlugins.length === 0 ? (
                              <div className={styles.noResults}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 10L14 14M14 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                                </svg>
                                <p>没有找到匹配的插件</p>
                              </div>
                            ) : totalPages > 1 && (
                              <div className={styles.pagination}>
                                <button
                                  className={styles.paginationButton}
                                  onClick={goToPrevPage}
                                  disabled={currentPluginPage === 1}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19L9 13L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <span>{currentPluginPage} / {totalPages}</span>
                                <button
                                  className={styles.paginationButton}
                                  onClick={goToNextPage}
                                  disabled={currentPluginPage === totalPages}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 19L15 13L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            )}
                        </div>
                        
                        <div className={styles.compactMenuRight}>
                          <div className={styles.compactMenuSection}>
                            <h3 className={styles.compactMenuSectionTitle}>快速入口</h3>
                            <div className={styles.menuLinks}>
                              <Link 
                                to="/intro#faq"
                                className={styles.menuLink}
                                onClick={() => setOpenDropdown(null)}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                常见问题
                              </Link>
                            </div>
                          </div>
                          
                          <div className={styles.compactMenuSection}>
                            <h3 className={styles.compactMenuSectionTitle}>资源链接</h3>
                            <div className={styles.resourceLinks}>
                              <a 
                                href="https://qm.qq.com/q/dENGavSflK"
                                className={styles.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpenDropdown(null)}
                              >
                                QQ交流群
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M7 7H17V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </a>
                              <a 
                                href="https://github.com/postyizhan/PostPlugins-Docs"
                                className={styles.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpenDropdown(null)}
                              >
                                GitHub仓库
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M7 7H17V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={i}
                to={item.to}
                className={`${styles.navbarItem}`}
              >
                <span className={isActive(item.to) ? styles.navbarItemActive : ''}>
                  {item.label}
                </span>
              </Link>
            )
          ))}
        </nav>

        <div className={styles.navbarRight}>
          {/* 语言切换按钮 - 现在放在主题切换按钮左侧 */}
          <div 
            className={styles.localeDropdown}
            ref={openLanguageDropdown ? langDropdownRef : null}
          >
            <button 
              className={styles.localeToggle}
              onClick={() => setOpenLanguageDropdown(!openLanguageDropdown)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {openLanguageDropdown && (
              <div className={styles.localeDropdownMenu}>
                <Link 
                  to="/zh-Hans/" 
                  className={styles.localeDropdownItem}
                  onClick={() => setOpenLanguageDropdown(false)}
                >
                  中文
                </Link>
                <Link 
                  to="/en/" 
                  className={styles.localeDropdownItem}
                  onClick={() => setOpenLanguageDropdown(false)}
                >
                  English
                </Link>
              </div>
            )}
          </div>

          {/* 主题切换按钮 */}
          <button
            className={styles.themeToggle}
            onClick={toggleColorMode}
            title={colorMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {colorMode === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* GitHub 链接 */}
          <Link
            to="https://github.com/postyizhan/PostPlugins-Docs"
            className={styles.githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.5C19.9988 8.30564 19.5325 7.15578 18.7 6.3C19.0905 5.26128 19.0545 4.11808 18.6 3.1C18.6 3.1 17.5 2.8 15.6 4.1C14.0397 3.66345 12.3603 3.66345 10.8 4.1C8.9 2.8 7.8 3.1 7.8 3.1C7.34548 4.11808 7.30951 5.26128 7.7 6.3C6.86745 7.15578 6.40123 8.30564 6.4 9.5C6.4 14.1 9.1 15.2 11.9 15.5C11.3 16.1 11.2 16.7 11.2 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* 移动端菜单按钮 */}
          <button className={styles.menuButton} onClick={toggleMenu} aria-label="菜单">
            <div className={`${styles.menuIcon} ${isMenuOpen ? styles.menuIconOpen : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuBackdrop}></div>
        <div className={styles.mobileMenuItems}>
          {/* 移动端搜索框 */}
          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuSectionTitle}>搜索</div>
            <form 
              className={styles.customSearchForm} 
              onSubmit={(e) => {
                e.preventDefault();
                const searchQuery = e.target.querySelector('input').value.trim();
                if (searchQuery) {
                  const baseUrl = siteConfig.baseUrl || '/';
                  const encodedQuery = encodeURIComponent(searchQuery);
                  const searchUrl = `${baseUrl}search?q=${encodedQuery}`;
                  history.push(searchUrl);
                  setIsMenuOpen(false);
                }
              }}
            >
              <div className={styles.customSearchInputWrapper}>
                <input
                  type="search"
                  placeholder="搜索文档..."
                  aria-label="搜索文档"
                  className={styles.customSearchInput}
                />
                <div className={styles.customSearchIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </form>
          </div>
          
          <div className={styles.mobileMenuDivider}></div>
          
          {/* 开始链接 */}
          <Link
            to="/intro"
            className={`${styles.mobileMenuItem} ${isActive('/intro') ? styles.mobileMenuItemActive : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            开始
          </Link>
          
          {/* 插件菜单标题 - 只用于显示和切换 */}
          <div 
            className={styles.mobileMenuHeader}
            onClick={() => setOpenDropdown(openDropdown === 'plugins' ? null : 'plugins')}
          >
            插件
            <svg className={`${styles.mobileMenuArrow} ${openDropdown === 'plugins' ? styles.dropdownArrowOpen : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* 插件子菜单 - 条件渲染 */}
          {openDropdown === 'plugins' && (
            <div className={styles.mobileSubmenuItems}>
              {/* PostSpawner */}
              <Link
                to="/PostSpawner/intro"
                className={styles.mobileSimpleItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={styles.mobileSimpleIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className={styles.mobileSimpleContent}>
                  <h4>PostSpawner</h4>
                  <p>刷怪笼控制插件</p>
                </div>
              </Link>
              
              {/* PostDrop */}
              <Link
                to="/PostDrop/intro"
                className={styles.mobileSimpleItem}
                
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={styles.mobileSimpleIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7L12 3L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 12L12 16L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.mobileSimpleContent}>
                  <h4>PostDrop</h4>
                  <p>物品丢弃保护插件</p>
                </div>
              </Link>
            </div>
          )}
          
          <div className={styles.mobileMenuDivider}></div>
          
          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuSectionTitle}>语言</div>
            <div className={styles.mobileLocale}>
              <Link to="/zh-Hans/" className={styles.mobileLocaleItem} onClick={() => setIsMenuOpen(false)}>
                中文
              </Link>
              <Link to="/en/" className={styles.mobileLocaleItem} onClick={() => setIsMenuOpen(false)}>
                English
              </Link>
            </div>
          </div>
          
          <div className={styles.mobileMenuDivider}></div>
          
          <div className={styles.mobileMenuSection}>
            <div className={styles.mobileMenuSectionTitle}>主题</div>
            <button
              className={styles.mobileThemeToggle}
              onClick={() => {
                toggleColorMode();
                setIsMenuOpen(false);
              }}
            >
              {colorMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
              {colorMode === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          
          <div className={styles.mobileMenuDivider}></div>
          
          <Link
            to="https://github.com/postyizhan/PostPlugins-Docs"
            className={styles.mobileGithubLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.5C19.9988 8.30564 19.5325 7.15578 18.7 6.3C19.0905 5.26128 19.0545 4.11808 18.6 3.1C18.6 3.1 17.5 2.8 15.6 4.1C14.0397 3.66345 12.3603 3.66345 10.8 4.1C8.9 2.8 7.8 3.1 7.8 3.1C7.34548 4.11808 7.30951 5.26128 7.7 6.3C6.86745 7.15578 6.40123 8.30564 6.4 9.5C6.4 14.1 9.1 15.2 11.9 15.5C11.3 16.1 11.2 16.7 11.2 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return <CustomNavbar />;
} 