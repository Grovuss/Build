const builds = [
    { 
        id: 'mc_flatgrass', 
        name: 'MC_Flatgrass', 
        description: `
**A simple, open Minecraft recreation of GM_Flatgrass from Garry’s Mod.**

Perfect for building, testing, or sandbox-style experiments.

## Features

- **Large flat grass field** — endless space for building, testing, and messing around
-  **Accurate proportions** — matches the original map's scale and simplicity
- **Hidden room** — just like the original, tucked beneath the spawn area
- **Minimal terrain clutter** — perfect for experiments, Redstone testing, or PvP
        `,
        images: [
            'Flatgrass1.png',
            'Flatgrass2.png',
            'Flatgrass3.png'
        ],
        downloadUrl: 'https://drive.google.com/uc?export=download&id=1gcEe5yPzCaXcOS_isCobOV5Yh4P6Bg5l',
        tags: ['Recreation', 'Sandbox']
    }
];

function getBuilds() {
    return builds;
}

function getDownloadCount(buildId) {
    return parseInt(localStorage.getItem(`downloads_${buildId}`) || '0');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { builds, getBuilds, getDownloadCount };
}