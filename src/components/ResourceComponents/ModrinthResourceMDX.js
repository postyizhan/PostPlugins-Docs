import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ModrinthResourceInfo from './ModrinthResourceInfo';

/**
 * 用于在 MDX 文件中使用的 Modrinth 资源组件
 * 
 * @example
 * ```jsx
 * <ModrinthResource projectId="postspawner" />
 * ```
 */
export default function ModrinthResourceMDX(props) {
  // 使用 BrowserOnly 确保组件只在浏览器中渲染
  // 这样可以避免 SSR 时的 hydration 问题
  return (
    <BrowserOnly>
      {() => <ModrinthResourceInfo {...props} />}
    </BrowserOnly>
  );
} 