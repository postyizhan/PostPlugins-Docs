/**
 * PostPlugins 资源页面插件
 * 
 * 此插件为 Docusaurus 添加自定义资源页面组件，可以在 Markdown 中嵌入使用
 */

const path = require('path');

module.exports = function(context, options) {
  return {
    name: 'resource-page-plugin',
    
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          alias: {
            '@resource-components': path.resolve(__dirname, '../../components/ResourceComponents'),
          },
        },
      };
    },

    // 注册 MDX 组件以供 Markdown 文档使用
    contentLoaded({content, actions}) {
      const {addRoute, createData} = actions;
    },
  };
}; 