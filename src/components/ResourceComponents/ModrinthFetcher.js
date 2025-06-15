import React, { useEffect, useState } from 'react';

/**
 * 从 Modrinth API 获取插件信息的组件
 * 
 * @param {Object} props
 * @param {string} props.projectId - Modrinth 项目 ID 或 slug
 * @param {Function} props.onDataLoaded - 数据加载完成后的回调函数
 * @param {React.ReactNode} props.children - 子组件，用于显示加载状态
 */
export default function ModrinthFetcher({ projectId, onDataLoaded, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取项目基本信息
        const projectResponse = await fetch(`https://api.modrinth.com/v2/project/${projectId}`);
        if (!projectResponse.ok) {
          throw new Error(`Failed to fetch project data: ${projectResponse.status}`);
        }
        const projectData = await projectResponse.json();

        // 获取项目版本信息
        const versionsResponse = await fetch(`https://api.modrinth.com/v2/project/${projectId}/version`);
        if (!versionsResponse.ok) {
          throw new Error(`Failed to fetch versions data: ${versionsResponse.status}`);
        }
        const versionsData = await versionsResponse.json();
        
        // 确保版本数据包含文件URL
        console.log('获取到的版本数据:', versionsData);
        
        // 获取项目团队信息
        let teamData = [];
        try {
          const teamResponse = await fetch(`https://api.modrinth.com/v2/project/${projectId}/members`);
          if (teamResponse.ok) {
            teamData = await teamResponse.json();
          }
        } catch (teamErr) {
          console.warn('无法获取团队信息，将使用空数组:', teamErr);
        }

        // 组合数据
        const combinedData = {
          ...projectData,
          versions: versionsData,
          team: teamData
        };

        setData(combinedData);
        if (onDataLoaded) {
          onDataLoaded(combinedData);
        }
      } catch (err) {
        console.error('Error fetching data from Modrinth:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, onDataLoaded]);

  if (loading) {
    return null; // 不显示加载提示
  }

  if (error) {
    console.error('Modrinth 数据加载错误:', error);
    return null; // 不显示错误提示
  }

  if (children) {
    return React.cloneElement(children, { modrinthData: data });
  }

  return null;
} 