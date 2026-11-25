// Product data
const products = [
    {
        id: 1,
        name: "Smartphone Futuristic X",
        description: "Le dernier smartphone avec écran pliable et technologie holographique intégrée.",
        price: 29900,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        badge: "Nouveau"
    },
    {
        id: 2,
        name: "Montre Connectée Pro",
        description: "Montre intelligente avec suivi de santé avancé et projection holographique.",
        price: 85000,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
        badge: "Populaire"
    },
    {
        id: 3,
        name: "Casque VR Immersif",
        description: "Expérience de réalité virtuelle ultra-immersive avec capteurs de mouvement.",
        price: 17500,
        image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        badge: "Tendance"
    },
    {
        id: 4,
        name: "Drone Caméra 8K",
        description: "Drone avec caméra stabilisée 8K et intelligence artificielle intégrée.",
        price: 230000,
        image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        badge: null
    },
    {
        id: 5,
        name: "Enceinte Holographique",
        description: "Enceinte avec projection holographique et son spatial 360°.",
        price: 120000,
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        badge: "Innovation"
    },
    {
        id: 6,
        name: "Ordinateur Portable Quantum",
        description: "Ordinateur portable avec processeur quantique et écran transparent.",
        price: 450000,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        badge: "Premium"
    },
    {
        id: 7,
        name: "Écouteurs Traduction IA",
        description: "Écouteurs sans fil avec traduction instantanée en 40 langues.",
        price: 65000,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        badge: null
    },
    {
        id: 8,
        name: "Projecteur Portable Laser",
        description: "Projecteur de poche avec technologie laser et batterie longue durée.",
        price: 95000,
        image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        badge: "Compact"
    }
];