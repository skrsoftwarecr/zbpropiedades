import type { Product, Vehicle } from './types';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'BMW M Performance Kidney Grille in High-Gloss Black',
    category: 'Original',
    price: 95000,
    description: 'Enhance the sporty look of your BMW with this original M Performance kidney grille. Made from high-quality, durable plastic with a high-gloss black finish.',
    stock: 15,
    condition: 'Nuevo',
    compatibility: ['G20 3 Series', 'G22 4 Series'],
    imageId: 'part-1'
  },
  {
    id: 'p2',
    name: 'BBS CI-R 20" Performance Wheels (Set of 4)',
    category: 'Aftermarket',
    price: 1250000,
    description: 'Legendary BBS performance and style. The CI-R features a distinctive Y-spoke design and weight optimization for superior handling.',
    stock: 5,
    condition: 'Nuevo',
    compatibility: ['F80 M3', 'F82 M4', 'F10 5 Series'],
    imageId: 'part-2'
  },
  {
    id: 'p3',
    name: 'Original BMW Oil Filter Kit',
    category: 'Original',
    price: 13500,
    description: 'Genuine BMW oil filter kit for various models. Includes filter, gasket, and necessary o-rings for a complete oil change service.',
    stock: 100,
    condition: 'Nuevo',
    compatibility: ['Most E-chassis and F-chassis models'],
    imageId: 'part-3'
  },
  {
    id: 'p4',
    name: 'Akrapovič Slip-On Line (Titanium) Exhaust System',
    category: 'Aftermarket',
    price: 2350000,
    description: 'Unleash the sound and performance of your M car. This lightweight titanium exhaust system provides a power boost and an aggressive, deep tone.',
    stock: 3,
    condition: 'Nuevo',
    compatibility: ['F87 M2 Competition'],
    imageId: 'part-4'
  },
   {
    id: 'p5',
    name: 'BMW M Performance Carbon Fiber Mirror Caps',
    category: 'Original',
    price: 380000,
    description: 'Add a touch of race-inspired styling with these genuine carbon fiber mirror caps. Perfect fit and finish as expected from BMW M Performance.',
    stock: 8,
    condition: 'Nuevo',
    compatibility: ['G80 M3', 'G82 M4'],
    imageId: 'part-5'
  },
  {
    id: 'p6',
    name: 'Zimmermann Performance Brake Rotors (Front Pair)',
    category: 'Aftermarket',
    price: 165000,
    description: 'High-quality German-made brake rotors. Cross-drilled for improved heat dissipation and wet-weather performance. A popular OEM-alternative.',
    stock: 20,
    condition: 'Nuevo',
    compatibility: ['E90 335i', 'E92 335i'],
    imageId: 'part-6'
  },
  {
    id: 'p7',
    name: 'BMW M Performance Alcantara Steering Wheel',
    category: 'Original',
    price: 490000,
    description: 'Upgrade your driving experience with this ergonomic Alcantara-wrapped steering wheel, featuring a red 12 o\'clock marker.',
    stock: 7,
    condition: 'Nuevo',
    compatibility: ['F22 2 Series', 'F30 3 Series'],
    imageId: 'part-7'
  },
  {
    id: 'p8',
    name: 'KW V3 Coilover Suspension Kit',
    category: 'Aftermarket',
    price: 1450000,
    description: 'State-of-the-art suspension technology for performance-oriented drivers. Independently adjustable rebound and compression damping.',
    stock: 4,
    condition: 'Nuevo',
    compatibility: ['F80 M3', 'F82 M4'],
    imageId: 'part-8'
  },
];

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2022,
    price: 44000000,
    mileage: 20116,
    vin: 'WBS123...',
    engine: '3.0L Twin-Turbo I6',
    transmission: 'Automático',
    exteriorColor: 'Isle of Man Green',
    interiorColor: 'Kyalami Orange',
    features: ['Carbon Fiber Roof', 'M-Sport Seats', 'Harman Kardon Sound', 'Executive Package'],
    description: 'A stunning, low-mileage example of the G82 M4 Competition. This vehicle is in immaculate condition and comes with a full service history.',
    imageIds: ['vehicle-1', 'vehicle-interior-1', 'vehicle-detail-1']
  },
  {
    id: 'v2',
    make: 'BMW',
    model: 'X5 M50i',
    year: 2021,
    price: 37500000,
    mileage: 33796,
    vin: 'WBS456...',
    engine: '4.4L Twin-Turbo V8',
    transmission: 'Automático',
    exteriorColor: 'Carbon Black Metallic',
    interiorColor: 'Black Vernasca Leather',
    features: ['Driving Assistance Pro', 'Panoramic Sunroof', '22" M Wheels', 'Parking Assistance Package'],
    description: 'The perfect blend of luxury and performance. This X5 M50i offers thrilling power and ultimate comfort for the whole family.',
    imageIds: ['vehicle-2', 'vehicle-interior-2', 'vehicle-detail-2']
  },
  {
    id: 'v3',
    make: 'BMW',
    model: 'M2 CS',
    year: 2020,
    price: 49500000,
    mileage: 12874,
    vin: 'WBS789...',
    engine: '3.0L Twin-Turbo I6',
    transmission: 'Manual',
    exteriorColor: 'Misano Blue Metallic',
    interiorColor: 'Black Dakota Leather/Alcantara',
    features: ['Carbon Fiber Roof', 'Adaptive M Suspension', 'M-Sport Brakes', 'Gold Wheels'],
    description: 'A future classic. This limited-edition M2 CS with a 6-speed manual transmission is a pure driver\'s car. Meticulously maintained and collector-owned.',
    imageIds: ['vehicle-3', 'vehicle-interior-3', 'vehicle-detail-3']
  },
  {
    id: 'v4',
    make: 'BMW',
    model: '330i M-Sport',
    year: 2023,
    price: 25000000,
    mileage: 8851,
    vin: 'WBSABC...',
    engine: '2.0L Turbo I4',
    transmission: 'Automático',
    exteriorColor: 'Brooklyn Grey',
    interiorColor: 'Tacora Red',
    features: ['M Sport Package', 'Live Cockpit Pro', 'Shadowline Trim', 'Premium Package'],
    description: 'Like-new G20 330i with the desirable M-Sport package and a striking color combination. Balance of factory warranty remaining.',
    imageIds: ['vehicle-4', 'vehicle-interior-4', 'vehicle-detail-4']
  },
];
