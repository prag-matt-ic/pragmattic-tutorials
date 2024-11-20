// white: '#F6F6F6',
//   green: '#45F1A6',
//   'green-alt': '#0DAF69',
//   cyan: '#37F3FF',
//   light: '#7A718E',
//   mid: '#2E2A37',
//   'off-black': '#1E1B23',
//   black: '#0A090C',

import { Vector3 } from 'three'

// http://dev.thi.ng/gradients/
export const COSINE_COLOUR_PALETTES: Record<string, Vector3[]> = {
  // Custom
  BluePurpleOrange: [
    new Vector3(0.57, 0.254, 0.893),
    new Vector3(0.522, 0.533, 0.953),
    new Vector3(0.639, 1.158, 0.816),
    new Vector3(2.416, 2.916, 5.794),
  ],
  // Presets:
  Rainbow: [
    new Vector3(0.5, 0.5, 0.5),
    new Vector3(0.166, 0.166, 0.166),
    new Vector3(1.0, 1.0, 1.0),
    new Vector3(0.0, 0.333, 0.667),
  ],
  OrangeMagentaBlue: [
    new Vector3(0.821, 0.328, 0.242),
    new Vector3(0.659, 0.481, 0.896),
    new Vector3(0.612, 0.34, 0.296),
    new Vector3(2.82, 3.026, -0.273),
  ],
  OrangeBlue: [
    new Vector3(0.5, 0.5, 0.5),
    new Vector3(0.5, 0.5, 0.5),
    new Vector3(0.8, 0.8, 0.5),
    new Vector3(0, 0.2, 0.5),
  ],
  BlueCyan: [
    new Vector3(0.0, 0.5, 0.5),
    new Vector3(0.0, 0.5, 0.5),
    new Vector3(0.0, 0.5, 0.333),
    new Vector3(0.0, 0.5, 0.667),
  ],
} as const
