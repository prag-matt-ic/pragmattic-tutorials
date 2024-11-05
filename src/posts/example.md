---
title: 'ParallaxX Toolkit'
date: '2020-01-01'
tags: 'parallax, js'
---

<video src="https://parallaxx-site.vercel.app/parallaxx.mp4" width="1618" height="962" controls playinline muted autoplay></video>

A lightweight, framework-agnostic toolkit for implementing smooth parallax and fade effects that leverage the native [ScrollTimeline](https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline) API.

✅ Minuscule footprint (5kb)  
✅ Easy to use presets  
✅ Maximum performance

## Installation

Install the package via npm:

```curl
npm i @parallaxx/toolkit
```

## Getting Started

### Import the Toolkit

```typescript
// Import the ParallaxX class and optional preset enums
import { ParallaxX, TranslatePreset, OpacityPreset } from '@parallaxx/toolkit'
// Import the CSS
import '@parallaxx/toolkit/dist/parallaxx.css'
```

### Initialize

Initialize the ParallaxX class in your application.
If you're using React/Next.js, initialize it inside useLayoutEffect:

```jsx
useLayoutEffect(() => {
  new ParallaxX()
}, [])
```

For other frameworks or vanilla JavaScript, initialize the class after the DOM is ready.

### Add Data Attributes

Add data attributes to the elements you want to animate.
ParallaxX finds elements with 'data-pxx-translate' and 'data-pxx-opacity' attributes.

```jsx
<div data-pxx-translate={TranslatePreset.FAST} data-pxx-opacity={OpacityPreset.FADE_IN}></div>
```

### Presets

The toolkit provides several presets for convenience.
The three values represent the enter, middle (center of the viewport), and exit values of the animation.

```typescript
enum TranslatePreset {
  SLOWER = '50%,0%,-50%',
  SLOW = '100%,0%,-100%',
  FAST = '200%,0%,-200%',
  FASTER = '300%,0%,-300%',
}

enum OpacityPreset {
  FADE_IN = '0,1,1',
  FADE_IN_OUT = '0,1,0',
  HALF_FADE_IN = '0.5,1,1',
  HALF_FADE_IN_OUT = '0.5,1,0.5',
}
```

```jsx
<div data-pxx-translate={TranslatePreset.SLOWER} data-pxx-opacity={OpacityPreset.FADE_IN_OUT}></div>
```

[View the website](https://parallaxx-site.vercel.app/)

### Custom Values

For greater flexibility you can provide custom values.
These are comma-separated strings representing the enter, middle, and exit values.

Translate values can be anything that CSS [translate3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d) supports.
Opacity values should range between 0 and 1.

```jsx
// Translate the element from 120px to -120px as it moves through the view.
// Fade the element from 0.2 opacity to 1.0 as it reaches the center of the view.
<div data-pxx-translate="120px,0,-120px" data-pxx-opacity="0.2,1.0,1.0"></div>

// Translate the element from 10vh to -20vh as it moves through the view. Aligning in the center (0)
// Fade the element from 0 opacity to 1.0 as it reaches the center of the view, and then back out to 0.4 as it exits.
<div data-pxx-translate="10vh,0,-20vh" data-pxx-opacity="0,1,0.4"></div>
```

#### Random Values

Values can be randomly generated too - which is useful for sets of mapped elements.
The format is "random(min|max)"

```jsx
// The following will result in a random exit value between -10px and -200px
<div data-pxx-translate="0,0,random(-10|-200)"
```

### Adjusting Animation Range

The range controls when the animation timeline starts and ends.

With cover (default) the timeline begins as the element starts to enter the view, and ends when it has completely left it.
With contain the timeline begins after the entire element has entered the view, and ends as it starts to leave.

You can customise these values to fine-tune the start and ending using different values.

[More Info](https://scroll-driven-animations.style/tools/view-timeline/ranges/#range-start-name=cover&range-start-percentage=0&range-end-name=cover&range-end-percentage=100&view-timeline-axis=block&view-timeline-inset=0&subject-size=smaller&subject-animation=reveal&interactivity=clicktodrag&show-areas=yes&show-fromto=yes&show-labels=yes)

```typescript
export enum RangePreset {
  COVER = 'cover 0% cover 100%', // Default
  CONTAIN = 'contain 0% contain 100%',
}
```

```jsx
<div data-pxx-range={RangePreset.CONTAIN}></div>
```

## How It Works

By utilizing native browser capabilities and minimizing reliance on JavaScript, ParallaxX outperforms animation frameworks that compute animations on the main thread.

## Browser Support

If window.ScrollTimeline() is not supported, a polyfill is loaded.

## License

This project is licensed under the MIT License.
