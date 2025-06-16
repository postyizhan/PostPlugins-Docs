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
      ],
    },
  ],
};

module.exports = sidebars;
