export enum Pathname {
  Home = '/',
  Blog = '/blog',
  Examples = '/example',
}

export enum ExamplePathname {
  ImageSequence = '/examples/scroll-driven-image-sequence',
  ScrollingBackgroundShader = '/examples/scrolling-background-shader',
  ScrollingThreeJs = '/examples/scrolling-three-scene',
  StarsParticles = '/examples/stars-particles',
  FBOEffects = '/examples/fbo-effects',
  InfiniteMarquee = '/examples/infinite-scrolling-marquee',
  WavePlane = '/examples/wave-plane',
}

type Example = {
  title: string
  pathname: ExamplePathname
  youtubeUrl?: string
  githubUrl?: string
  // blogPathname?: string
}

export const EXAMPLES: Record<ExamplePathname, Example> = {
  [ExamplePathname.ImageSequence]: {
    title: 'Scroll-driven image sequence header',
    pathname: ExamplePathname.ImageSequence,
    youtubeUrl: 'https://youtu.be/l8hwkDAr0Eg',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic-tutorials/blob/main/src/components/ImageSequenceHeader.tsx',
  },
  [ExamplePathname.ScrollingBackgroundShader]: {
    title: 'Magical gradients in a scrolling background shader',
    pathname: ExamplePathname.ScrollingBackgroundShader,
    youtubeUrl: 'https://youtu.be/_YvCZ4I16Vg',
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic-tutorials/blob/main/src/app/examples/scrolling-background-shader/page.tsx',
  },
  [ExamplePathname.ScrollingThreeJs]: {
    title: 'Scrolling React Three Fiber Scene',
    pathname: ExamplePathname.ScrollingThreeJs,
    youtubeUrl: 'https://youtu.be/1GGe3j59aKQ',
  },
  [ExamplePathname.StarsParticles]: {
    title: 'Stars Particles with 3D HTML Text',
    pathname: ExamplePathname.StarsParticles,
  },
  [ExamplePathname.WavePlane]: {
    title: 'Wave Plane',
    pathname: ExamplePathname.WavePlane,
  },
  [ExamplePathname.FBOEffects]: {
    title: 'FBO Effects',
    pathname: ExamplePathname.FBOEffects,
  },
  [ExamplePathname.InfiniteMarquee]: {
    title: 'Infinite Scrolling Marquee',
    pathname: ExamplePathname.InfiniteMarquee,
  },
} as const
