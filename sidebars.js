/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'PostSpawner',
      items: [
        'PostSpawner/intro',
        'PostSpawner/command',
        'PostSpawner/permission',
        'PostSpawner/items',
      ],
    },
    {
      type: 'category',
      label: 'PostDrop',
      items: [
        'PostDrop/intro',
        'PostDrop/command',
        'PostDrop/permission',
        'PostDrop/PlaceholderAPI',
      ],
    },
    {
      type: 'category',
      label: 'PostWarps',
      items: [
        'PostWarps/intro',
        'PostWarps/commands',
        'PostWarps/permission',
        {
          type: 'category',
          label: '菜单配置',
          items: [
            'PostWarps/menu/layout',
            'PostWarps/menu/icon',
            'PostWarps/menu/sub-icon',
            'PostWarps/menu/action',
            'PostWarps/menu/warp-action',
          ],
        },
        {
          type: 'category',
          label: '占位符',
          items: [
            'PostWarps/placeholder/PlaceHolderAPI',
            'PostWarps/placeholder/build-in',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'PostBits',
      items: [
        'PostBits/intro',
        {
          type: 'category',
          label: '提供器',
          items: [
            'PostBits/provider/block',
            'PostBits/provider/item',
            'PostBits/provider/action',
          ],
        },
        {
          type: 'category',
          label: '功能',
          items: [
            'PostBits/feature/chair',
            'PostBits/feature/elevator',
            'PostBits/feature/invedit',
            'PostBits/feature/keybind',
            'PostBits/feature/portabletools',
            'PostBits/feature/utility',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
