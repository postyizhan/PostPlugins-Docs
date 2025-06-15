import React from 'react';
import ModrinthFetcher from './ModrinthFetcher';
import styles from './ModrinthResourceInfo.module.css';

/**
 * 显示 Modrinth 资源信息的组件
 * 
 * @param {Object} props
 * @param {string} props.projectId - Modrinth 项目 ID 或 slug
 * @param {boolean} props.showIcon - 是否显示图标
 * @param {boolean} props.showDownloads - 是否显示下载量
 * @param {boolean} props.showFollowers - 是否显示收藏量
 * @param {boolean} props.showVersions - 是否显示版本信息
 * @param {boolean} props.showMinecraftVersions - 是否显示支持的 Minecraft 版本
 */
export default function ModrinthResourceInfo({
  projectId,
  showIcon = true,
  showDownloads = true,
  showFollowers = true,
  showVersions = true,
  showMinecraftVersions = true,
  className = '',
}) {
  const ResourceDisplay = ({ modrinthData }) => {
    if (!modrinthData) return null;

    const {
      title,
      description,
      icon_url,
      downloads,
      followers,
      versions,
      game_versions,
    } = modrinthData;

    // 获取最新版本
    const latestVersion = versions && versions.length > 0 ? versions[0] : null;

    return (
      <div className={`${styles.modrinthResource} ${className}`}>
        <div className={styles.header}>
          {showIcon && icon_url && (
            <img src={icon_url} alt={`${title} icon`} className={styles.icon} />
          )}
          <div className={styles.info}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>

        <div className={styles.stats}>
          {showDownloads && (
            <div className={styles.stat}>
              <span className={styles.label}>下载量:</span>
              <span className={styles.value}>{downloads.toLocaleString()}</span>
            </div>
          )}

          {showFollowers && (
            <div className={styles.stat}>
              <span className={styles.label}>收藏量:</span>
              <span className={styles.value}>{followers.toLocaleString()}</span>
            </div>
          )}
        </div>

        {showMinecraftVersions && game_versions && game_versions.length > 0 && (
          <div className={styles.versions}>
            <h4>支持的 Minecraft 版本:</h4>
            <div className={styles.versionTags}>
              {game_versions.map(version => (
                <span key={version} className={styles.versionTag}>{version}</span>
              ))}
            </div>
          </div>
        )}

        {showVersions && versions && versions.length > 0 && (
          <div className={styles.versionList}>
            <h4>版本历史:</h4>
            <ul>
              {versions.slice(0, 5).map(version => (
                <li key={version.id} className={styles.versionItem}>
                  <div className={styles.versionHeader}>
                    <span className={styles.versionName}>{version.name}</span>
                    <span className={styles.versionDate}>
                      {new Date(version.date_published).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className={styles.versionDescription}>{version.version_number}</p>
                </li>
              ))}
              {versions.length > 5 && (
                <li className={styles.moreVersions}>
                  <a href={`https://modrinth.com/plugin/${projectId}/versions`} target="_blank" rel="noopener noreferrer">
                    查看更多版本...
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className={styles.footer}>
          <a
            href={`https://modrinth.com/plugin/${projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.modrinthLink}
          >
            在 Modrinth 上查看
          </a>
        </div>
      </div>
    );
  };

  return (
    <ModrinthFetcher projectId={projectId}>
      <ResourceDisplay />
    </ModrinthFetcher>
  );
} 