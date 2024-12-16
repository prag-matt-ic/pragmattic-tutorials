import { Color } from 'three'

import { CYAN_VEC3, GREEN_VEC3, ORANGE_VEC3 } from './colours'

export enum SceneSection {
  Purpose = 'purpose',
  Design = 'design',
  Engineering = 'engineering',
}

export const SECTION_COLOURS: Record<SceneSection, Color> = {
  [SceneSection.Purpose]: GREEN_VEC3,
  [SceneSection.Design]: ORANGE_VEC3,
  [SceneSection.Engineering]: CYAN_VEC3,
}

export const POINT_VEC3 = new Color('#9A93A9')
