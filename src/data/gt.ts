// VANTA GT — the single flagship's real designed data (no lorem).
export interface SpecGroup { group: string; rows: { label: string; value: string }[]; }

export const SPECS: SpecGroup[] = [
  { group: 'Powertrain', rows: [
    { label: 'Configuration', value: 'Dual motor · AWD' },
    { label: 'Peak power', value: '1,020 hp · 760 kW' },
    { label: 'Peak torque', value: '1,300 N·m' },
    { label: 'Drive', value: 'Torque-vectoring AWD' },
  ]},
  { group: 'Performance', rows: [
    { label: '0–100 km/h', value: '2.4 s' },
    { label: '0–200 km/h', value: '7.1 s' },
    { label: 'Top speed', value: '412 km/h · limited' },
    { label: 'Standing 400 m', value: '9.6 s' },
  ]},
  { group: 'Battery & charging', rows: [
    { label: 'Usable capacity', value: '110 kWh' },
    { label: 'Range · WLTP', value: '690 km' },
    { label: 'Architecture', value: '900 V' },
    { label: 'DC peak', value: '350 kW · 10–80% in 18 min' },
  ]},
  { group: 'Chassis & body', rows: [
    { label: 'Structure', value: 'Carbon-bonded aluminium' },
    { label: 'Suspension', value: 'Active air · adaptive damping' },
    { label: 'Drag coefficient', value: 'Cd 0.19' },
    { label: 'Kerb weight', value: '1,940 kg' },
  ]},
];

export interface HeroStat { value: string; suffix: string; label: string; }
export const KEY_STATS: HeroStat[] = [
  { value: '1,020', suffix: 'HP', label: 'Combined output' },
  { value: '690', suffix: 'KM', label: 'WLTP range' },
  { value: '2.4', suffix: 'S', label: '0–100 km/h' },
  { value: '18', suffix: 'MIN', label: '10–80% charge' },
];

export interface Trim { id: string; name: string; paint: string; image: string; price: string; sub: string; }
export const TRIMS: Trim[] = [
  { id: 'obsidian', name: 'Obsidian', paint: '#0B0B0E', image: 'gt-color-obsidian.png', price: '$189,000', sub: 'The signature finish — deep, light-drinking black.' },
  { id: 'carbon', name: 'Carbon', paint: '#33333C', image: 'gt-color-carbon.png', price: '$194,500', sub: 'Exposed weave under a satin clear seal.' },
  { id: 'plasma', name: 'Plasma', paint: '#F0257E', image: 'gt-color-plasma.png', price: '$198,000', sub: 'Charged electrochromic pearl — the loud one.' },
  { id: 'bone', name: 'Bone', paint: '#ECEAE3', image: 'gt-color-bone.png', price: '$192,000', sub: 'Matte ceramic white, near-frictionless to the eye.' },
];
