// Derives presentation metadata (play style, level, weight class, benefit) from
// each racket's real specs. No ratings or review counts are invented here — when
// real review data exists, add a `rating` / `reviewCount` field to a listing and
// the UI will display it; otherwise products show a neutral "New" tag.
export function getProductMeta(listing) {
  const balance = (listing.specs?.balance || '').toLowerCase();
  const stiffness = (listing.specs?.stiffness || '').toLowerCase();
  const weight = (listing.specs?.weight || '').toUpperCase();

  let style = 'All-Round';
  if (balance.includes('head heavy')) style = 'Power';
  else if (balance.includes('head light')) style = 'Speed';
  else if (balance.includes('even')) style = 'Control';

  let level = 'Intermediate';
  if (stiffness.includes('extra stiff')) level = 'Advanced';
  else if (stiffness.includes('stiff')) level = 'Intermediate';
  else if (stiffness.includes('medium')) level = 'Intermediate';

  const weightClass = weight.includes('4U') ? 'Lightweight' : 'Standard';

  const benefitByStyle = {
    Power: 'Steep, heavy smashes from the back court.',
    Speed: 'Fast swings and quick defensive reactions.',
    Control: 'Precise placement with a longer shuttle hold.',
    'All-Round': 'Balanced feel for all-court play.',
  };

  return {
    style,
    level,
    weightClass,
    benefit: benefitByStyle[style],
    rating: listing.rating ?? null,
    reviewCount: listing.reviewCount ?? null,
  };
}

export const listings = [
  {
    id: 1,
    title: "Astrox 99 Pro",
    series: "Astrox Series",
    brand: "Yonex",
    price: "$260",
    image: "https://images.pexels.com/photos/8496267/pexels-photo-8496267.jpeg?auto=compress&cs=tinysrgb&w=600&h=420&fit=crop",
    specs: {
      weight: "4U (Ave.83g)",
      balance: "Head Heavy",
      stiffness: "Stiff",
      tension: "20-28 lbs",
      frame: "HM Graphite / Namd / Volume Cut Resin / Tungsten",
      shaft: "HM Graphite / Namd"
    },
    description: "The Astrox 99 Pro is designed for power hitters who want to dominate the court with steep, devastating smashes. Featuring the new Power-Assist Bumper, it transfers more weight to the shuttle for heavier, more powerful shots.",
    technologies: ["Rotational Generator System", "Namd", "Energy Boost Cap Plus", "Isometric"],
    color: "#FF4500"
  },
  {
    id: 2,
    title: "Nanoray Z-Speed",
    series: "Nanoray Series",
    brand: "Yonex",
    price: "$230",
    image: "https://images.unsplash.com/photo-1708312604109-16c0be9326cd?w=600&h=420&auto=format&fit=crop&q=80",
    specs: {
      weight: "3U (Ave.88g)",
      balance: "Head Light",
      stiffness: "Extra Stiff",
      tension: "20-27 lbs",
      frame: "HM Graphite / Sonic Metal / EX-HMG",
      shaft: "HM Graphite / Nanometric / X-Fullerene"
    },
    description: "Built for speed, the Nanoray Z-Speed holds the world record for the fastest smash. Its aerodynamic frame and compact head size reduce air resistance, allowing for lightning-fast swings and quick drives.",
    technologies: ["Sonic Metal", "X-Fullerene", "Horizontal-A Concept", "Compact Frame"],
    color: "#FFD700"
  },
  {
    id: 3,
    title: "Arcsaber 11 Pro",
    series: "Arcsaber Series",
    brand: "Victor",
    price: "$250",
    image: "https://images.pexels.com/photos/6307230/pexels-photo-6307230.jpeg?auto=compress&cs=tinysrgb&w=600&h=420&fit=crop",
    specs: {
      weight: "3U (Ave.88g)",
      balance: "Even Balance",
      stiffness: "Stiff",
      tension: "19-27 lbs",
      frame: "HM Graphite / POCKETING BOOSTER",
      shaft: "HM Graphite / Super HMG / Ultra PE FIBER"
    },
    description: "The Arcsaber 11 Pro offers ultimate control and precision. The frame is designed to flex at the point of impact to hold the shuttle on the string bed for longer, delivering precise shot-making.",
    technologies: ["Pocketing Booster", "Control-Assist Bumper", "Isometric", "Solid Feel Core"],
    color: "#DC143C"
  },
  {
    id: 4,
    title: "Duora Z-Strike",
    series: "Duora Series",
    brand: "Li-Ning",
    price: "$245",
    image: "https://images.unsplash.com/photo-1708312604073-90639de903fc?w=600&h=420&auto=format&fit=crop&q=80",
    specs: {
      weight: "3U (Ave.88g)",
      balance: "Even/Head Heavy",
      stiffness: "Extra Stiff",
      tension: "20-29 lbs",
      frame: "HM Graphite / NANOMETRIC DR / Hyper-MG",
      shaft: "HM Graphite / NANOMETRIC / EX-HMG"
    },
    description: "Dual Optimum System allows for huge forehands and quick backhands. The Duora Z-Strike is an offensive racquet specially made to boost power, speed, and control, giving players a tactical upper hand.",
    technologies: ["Dual Optimum System", "Nanometric DR", "Duora Grommet", "Isometric"],
    color: "#000000"
  },
  {
    id: 5,
    title: "Voltric Z-Force II",
    series: "Voltric Series",
    brand: "FZ Forza",
    price: "$240",
    image: "https://images.unsplash.com/photo-1559309106-ed14040fd35d?w=600&h=420&auto=format&fit=crop&q=80",
    specs: {
      weight: "4U (Ave.83g)",
      balance: "Head Heavy",
      stiffness: "Extra Stiff",
      tension: "20-28 lbs",
      frame: "HM Graphite / Sound Filter / NANOMETRIC / Tungsten",
      shaft: "HM Graphite / EX-HMG / NANOMETRIC"
    },
    description: "Features an ultra-thin shaft and the TRI-VOLTAGE SYSTEM that combine to increase smash energy. This racket provides incredible power and fast racket handling for aggressive players.",
    technologies: ["Tri-Voltage System", "Sound Filter", "Nanometric", "Compact Frame"],
    color: "#4B0082"
  },
  {
    id: 6,
    title: "Astrox 88D Pro",
    series: "Astrox Series",
    brand: "Apacs",
    price: "$255",
    image: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=600&h=420&auto=format&fit=crop&q=80",
    specs: {
      weight: "4U (Ave.83g)",
      balance: "Head Heavy",
      stiffness: "Stiff",
      tension: "20-28 lbs",
      frame: "HM Graphite / VOLUME CUT RESIN / Tungsten",
      shaft: "HM Graphite / Namd"
    },
    description: "Designed for the back-court player, the 88D Pro evolves the Rotational Generator System to allow for more powerful smashes and clear shots that break the opponent's defense.",
    technologies: ["Rotational Generator System", "Volume Cut Resin", "Namd", "Aero+Box Frame"],
    color: "#DAA520"
  },
  {
    id: 7,
    title: "Astrox 88S Pro",
    series: "Astrox Series",
    brand: "Yonex",
    price: "$255",
    image: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=600&h=420&fit=crop",
    specs: {
      weight: "4U (Ave.83g)",
      balance: "Head Heavy",
      stiffness: "Stiff",
      tension: "20-28 lbs",
      frame: "HM Graphite / VOLUME CUT RESIN / Tungsten",
      shaft: "HM Graphite / Namd"
    },
    description: "Tailored for the front-court player, the 88S Pro offers decisive control and touch. The frame design enhances hold for precise net play and quick interceptions.",
    technologies: ["Rotational Generator System", "Volume Cut Resin", "Namd", "New Built-in T-Joint"],
    color: "#2E8B57"
  },
  {
    id: 8,
    title: "Nanoflare 800",
    series: "Nanoflare Series",
    brand: "Victor",
    price: "$240",
    image: "https://images.unsplash.com/photo-1633313236093-beebdd1a5e80?w=600&h=420&auto=format&fit=crop&q=80",
    specs: {
      weight: "3U (Ave.88g)",
      balance: "Head Light",
      stiffness: "Stiff",
      tension: "20-28 lbs",
      frame: "HM Graphite / M40X / EX-HMG",
      shaft: "HM Graphite / NANOMETRIC"
    },
    description: "Engineered for rapid-fire rallies, the Nanoflare 800 features a razor-thin frame for reduced air resistance. It delivers lightning-fast drive shots and quick defensive reactions.",
    technologies: ["Razor Frame", "Sonic Flare System", "M40X", "Isometric"],
    color: "#191970"
  },
  {
    id: 9,
    title: "Arcsaber 7 Pro",
    series: "Arcsaber Series",
    brand: "Li-Ning",
    price: "$220",
    image: "https://images.pexels.com/photos/12630113/pexels-photo-12630113.jpeg?auto=compress&cs=tinysrgb&w=600&h=420&fit=crop",
    specs: {
      weight: "4U (Ave.83g)",
      balance: "Even Balance",
      stiffness: "Medium",
      tension: "19-27 lbs",
      frame: "HM Graphite / POCKETING BOOSTER",
      shaft: "HM Graphite / Ultra PE FIBER"
    },
    description: "A classic reborn. The Arcsaber 7 Pro offers enhanced shuttle hold and a softer feel, making it perfect for intermediate to advanced players seeking control and comfort.",
    technologies: ["Pocketing Booster", "Isometric", "Box Frame", "T-Anchor"],
    color: "#FF1493"
  },
  {
    id: 10,
    title: "Yonex Ax 100 ZZ",
    series: "Astrox Series",
    brand: "Apacs",
    price: "$270",
    image: "https://images.pexels.com/photos/8496267/pexels-photo-8496267.jpeg?auto=compress&cs=tinysrgb&w=600&h=420&fit=crop",
    specs: {
      weight: "4U (Ave.83g)",
      balance: "Head Heavy",
      stiffness: "Extra Stiff",
      tension: "20-28 lbs",
      frame: "HM Graphite / Namd / Tungsten / Black Micro Core / Nanometric",
      shaft: "HM Graphite / Namd"
    },
    description: "The choice of champions. The Astrox 100 ZZ features a hyper-slim shaft and a solid feel core for maximum power transmission and reduced vibration. Designed for the ultimate offensive game.",
    technologies: ["Hyper Slim Shaft", "Namd", "Black Micro Core", "Rotational Generator System"],
    color: "#000080"
  }
];
