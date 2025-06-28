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
          label: '菜单',
          items: [
            'PostWarps/menu/layout',
            'PostWarps/menu/icon',
            'PostWarps/menu/sub-icon',
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
  ],
};

module.exports = sidebars;
