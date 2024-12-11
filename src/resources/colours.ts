import { Color } from 'three'

import { SceneSection } from '@/hooks/home/useHomeStore'

const GREEN_VEC3 = new Color('#37FFA8')
const ORANGE_VEC3 = new Color('#E5A019')
const CYAN_VEC3 = new Color('#37F3FF')
const BLACK_VEC3 = new Color('#0A090C')
const OFF_BLACK_VEC3 = new Color('#1E1B23')
const LIGHT_VEC3 = new Color('#7A718E')
const MID_VEC3 = new Color('#2E2A37')

const POINT_VEC3 = new Color('#9A93A9')

const SECTION_COLOURS: Record<SceneSection, Color> = {
  [SceneSection.Purpose]: GREEN_VEC3,
  [SceneSection.Design]: ORANGE_VEC3,
  [SceneSection.Engineering]: CYAN_VEC3,
}

export {
  BLACK_VEC3,
  CYAN_VEC3,
  GREEN_VEC3,
  LIGHT_VEC3,
  MID_VEC3,
  OFF_BLACK_VEC3,
  ORANGE_VEC3,
  POINT_VEC3,
  SECTION_COLOURS,
}
