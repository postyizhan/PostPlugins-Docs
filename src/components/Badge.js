import React from 'react';
import styles from '../css/badge.module.css';

/**
 * Badge component for generating shields.io badges
 */
export default function Badge({
  service,
  label,
  value,
  color,
  logo,
  logoColor,
  link,
  description,
  style,
  labelColor,
}) {
  // Build the shields.io URL
  let shieldUrl = `https://img.shields.io/`;
  
  if (service === 'discord') {
    // Discord badge uses a different format
    shieldUrl += `discord/${value}.svg?`;
    // 确保label参数始终存在，即使为空
    shieldUrl += `label=${label ? encodeURIComponent(label) : ''}&`;
  } else {
    // Standard badge format
    shieldUrl += `badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color}?`;
  }
  
  // Add optional parameters
  if (logo) shieldUrl += `logo=${encodeURIComponent(logo)}&`;
  if (logoColor) shieldUrl += `logoColor=${encodeURIComponent(logoColor)}&`;
  if (style) shieldUrl += `style=${encodeURIComponent(style)}&`;
  if (labelColor) shieldUrl += `labelColor=${encodeURIComponent(labelColor)}&`;
  
  // Remove trailing '&' or '?' if present
  shieldUrl = shieldUrl.replace(/[&?]$/, '');
  
  return (
    <span className={styles.badgeWrapper}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={shieldUrl} alt={`${label}: ${value}`} />
      </a>
      {description && <span className={styles.badgeDescription}>{description}</span>}
    </span>
  );
}
