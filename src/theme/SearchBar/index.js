import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';

import styles from './styles.module.css';

function SearchBar() {
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const searchInputRef = useRef(null);

  // 处理搜索提交
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // 构建搜索URL
    const baseUrl = siteConfig.baseUrl || '/';
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    const searchUrl = `${baseUrl}search?q=${encodedQuery}`;
    
    history.push(searchUrl);
  };

  // 处理输入变化
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 处理快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 按下 / 键时聚焦搜索框
      if (e.key === '/' && !e.target.closest('input, textarea')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // 按下 ESC 键时取消聚焦
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <form 
      className={`${styles.searchForm} ${focused ? styles.searchFormFocused : ''}`} 
      onSubmit={handleSearch}
    >
      <div className={styles.searchInputWrapper}>
        <input
          ref={searchInputRef}
          type="search"
          placeholder="搜索文档..."
          aria-label="搜索文档"
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <div className={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {searchQuery && (
          <button 
            type="button" 
            className={styles.clearButton}
            onClick={() => setSearchQuery('')}
            aria-label="清除搜索"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      {focused && (
        <div className={styles.searchHint}>
          按 <kbd>/</kbd> 聚焦搜索框，按 <kbd>ESC</kbd> 取消
        </div>
      )}
    </form>
  );
}

export default SearchBar;