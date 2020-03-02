#### FLIP动画

[FLIP](https://aerotwist.com/blog/flip-your-animations/)

> Animations in your web app should run at 60fps. Not always easy to achieve that, and it really depends on what you're trying to do, but I'm here to help. With FLIP.

>FLIP stands for First, Last, Invert, Play.

- First: the initial state of the element(s) involved in the transition.

- Last: the final state of the element(s).

- Invert: here’s the fun bit. You figure out from the first and last how the element has changed, so – say – its width, height, opacity. Next you apply transforms and opacity changes to reverse, or invert, them. If the element has moved 90px down between First and Last, you would apply a transform of -90px in Y. This makes the elements appear as though they’re still in the First position but, crucially, they’re not.

- Play: switch on transitions for any of the properties you changed, and then remove the inversion changes. Because the element or elements are in their final position removing the transforms and opacities will ease them from their faux First position, out to the Last position.

```
// Get the first position.
var first = el.getBoundingClientRect();

// Now set the element to the last position.
el.classList.add('totes-at-the-end');

// Read again. This forces a sync
// layout, so be careful.
var last = el.getBoundingClientRect();

// You can do this for other computed
// styles as well, if needed. Just be
// sure to stick to compositor-only
// props like transform and opacity
// where possible.
var invert = first.top - last.top;

// Invert.
el.style.transform =`translateY(${invert}px)`;

// Wait for the next frame so we
// know all the style changes have
// taken hold.
requestAnimationFrame(function() {

  // Switch on animations.
  el.classList.add('animate-on-transforms');

  // GO GO GOOOOOO!
  el.style.transform = '';
});

// Capture the end with transitionend
el.addEventListener('transitionend',
    tidyUpAnimations);
```

[实现vue中的动画](https://codepen.io/501981732/pen/vbNzXz?editors=1111)