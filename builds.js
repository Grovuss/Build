const builds = [
    { 
        id: 'mc_flatgrass', 
        name: 'MC_Flatgrass', 
        description: `
**A simple, open Minecraft recreation of GM_Flatgrass from GMOD.**

Perfect for building, testing, or sandbox-style experiments.

## Features

- **Large flat grass field** — endless space for building, testing, and messing around
- **Accurate proportions** — matches the original map's scale and simplicity
- **Hidden room** — just like the original, tucked beneath the spawn area
- **Minimal terrain clutter** — perfect for experiments, Redstone testing, or PvP
        `,
        images: [
            'Flatgrass1.png',
            'Flatgrass2.png',
            'Flatgrass3.png'
        ],
        downloadUrl: 'https://drive.google.com/uc?export=download&id=1gcEe5yPzCaXcOS_isCobOV5Yh4P6Bg5l',
        tags: ['Game', "Garry's Mod", 'Sandbox']
    },
    { 
        id: 'mc_construct', 
        name: 'MC_Construct', 
        description: `
**A faithful, Minecraft recreation of GM_Construct from GMOD.**

Explore a clean, versatile space ideal for building, experimenting with redstone, testing creations, or hosting sandbox-style sessions with friends.

## Features

- **Accurate layout** — scaled to closely match the Source engine's iconic geometry
- **Natural elements integrated** — trees, bushes, and water features blend with the urban environment
- **Ample flat surfaces and structures** — perfect for building, roleplay, or redstone contraptions
- **Hidden room** — just like the original, tucked beneath some stairs
        `,
        images: [
            'Construct1.png',
            'Placeholder.png',
            'Placeholder.png'
        ],
        downloadUrl: 'https://drive.google.com/uc?export=download&id=1msV2Psl6yGXG81RQ7O_xDCZaK5pFXKVW',
        tags: ['Game', "Garry's Mod", 'Sandbox']
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
