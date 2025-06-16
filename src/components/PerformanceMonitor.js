import { useEffect, useRef } from 'react';

/**
 * 性能监控组件
 * 监控FPS、内存使用等性能指标
 */
function PerformanceMonitor({ onPerformanceChange }) {
  const performanceRef = useRef({
    fps: 60,
    frameCount: 0,
    lastTime: performance.now(),
    memoryUsage: 0,
    isLowPerformance: false
  });

  useEffect(() => {
    let animationId;
    let lastReportTime = performance.now();
    const reportInterval = 2000; // 每2秒报告一次性能

    const measurePerformance = (currentTime) => {
      const perf = performanceRef.current;
      perf.frameCount++;

      // 计算FPS
      const deltaTime = currentTime - perf.lastTime;
      if (deltaTime >= 1000) {
        perf.fps = Math.round((perf.frameCount * 1000) / deltaTime);
        perf.frameCount = 0;
        perf.lastTime = currentTime;
      }

      // 检测内存使用（如果支持）
      if (performance.memory) {
        perf.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      // 检测低性能状态
      const wasLowPerformance = perf.isLowPerformance;
      perf.isLowPerformance = perf.fps < 30 || perf.memoryUsage > 100;

      // 定期报告性能变化
      if (currentTime - lastReportTime >= reportInterval) {
        if (onPerformanceChange && (wasLowPerformance !== perf.isLowPerformance)) {
          onPerformanceChange({
            fps: perf.fps,
            memoryUsage: perf.memoryUsage,
            isLowPerformance: perf.isLowPerformance,
            recommendation: getPerformanceRecommendation(perf)
          });
        }
        lastReportTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    // 开始监控
    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onPerformanceChange]);

  return null; // 这是一个无UI的监控组件
}

/**
 * 根据性能数据提供优化建议
 */
function getPerformanceRecommendation(perf) {
  if (perf.fps < 20) {
    return {
      level: 'critical',
      message: '性能严重不足，建议关闭动画效果',
      actions: ['disable-animations', 'reduce-quality']
    };
  } else if (perf.fps < 30) {
    return {
      level: 'warning',
      message: '性能较低，建议降低动画质量',
      actions: ['reduce-quality', 'limit-fps']
    };
  } else if (perf.memoryUsage > 100) {
    return {
      level: 'warning',
      message: '内存使用较高，建议优化资源',
      actions: ['cleanup-resources', 'reduce-quality']
    };
  }
  
  return {
    level: 'good',
    message: '性能良好',
    actions: []
  };
}

/**
 * 性能优化工具函数
 */
export const PerformanceUtils = {
  // 检测设备性能等级
  detectDevicePerformance: () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { level: 'low', reason: 'no-webgl' };
    }

    const renderer = gl.getParameter(gl.RENDERER);
    const vendor = gl.getParameter(gl.VENDOR);
    
    // 检测低端GPU
    const isLowEndGPU = /Mali|Adreno [1-4]|PowerVR|Intel/.test(renderer);
    const isHighDPI = window.devicePixelRatio > 2;
    const isMobile = window.innerWidth < 768;
    const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;

    if (isLowEndGPU || hasLimitedMemory) {
      return { level: 'low', reason: 'hardware-limited' };
    } else if (isHighDPI || isMobile) {
      return { level: 'medium', reason: 'mobile-device' };
    } else {
      return { level: 'high', reason: 'desktop-capable' };
    }
  },

  // 获取推荐的动画设置
  getRecommendedSettings: (devicePerformance) => {
    switch (devicePerformance.level) {
      case 'low':
        return {
          enableAnimations: false,
          targetFPS: 30,
          quality: 0.3,
          enableWebGL: false
        };
      case 'medium':
        return {
          enableAnimations: true,
          targetFPS: 30,
          quality: 0.6,
          enableWebGL: true
        };
      case 'high':
      default:
        return {
          enableAnimations: true,
          targetFPS: 60,
          quality: 1.0,
          enableWebGL: true
        };
    }
  },

  // 节流函数
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // 防抖函数
  debounce: (func, wait, immediate) => {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
};

export default PerformanceMonitor;
