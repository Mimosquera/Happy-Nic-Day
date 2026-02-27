# happy nic day

a birthday web app i made for my partner nic. it's purple, it runs on their phone, and every single interaction was designed to make them smile.

---

there's a pulsing purple heart in the middle of the home page. hold it down for about a second and it shows a little message and sends hearts floating up the screen. if you hold it again it toggles the hearts. if the shake message is already up and you hold the heart, it swaps it out.

there's a balloon drifting around below the heart. tap it to pop it. once it pops, the app asks for permission to use the gyroscope, and a new balloon floats up from the bottom of the screen. shake your phone and you get a different message. that second balloon can also be popped, and another one rises up again. it keeps going forever. popping the balloon when the heart message is up primes the next shake to go off right away.

everything avoids overlapping. if a message appears while the balloon is already floating up there, the balloon smoothly slides to a better spot. if the messages are different heights it adjusts. it uses the actual measured position of the message element to figure out where to put the balloon.

the hearts that float up are unicode text symbols, not emoji, so they render as actual characters with the right color instead of little sticker icons on iphone.

motion permission is saved to localStorage so iphone users only ever get the permission popup once.

---

the other pages:

**blow out the cake** uses the microphone to listen for breath. it's doing real-time RMS volume analysis via the Web Audio API. blow into your phone and the candles go out. there's a sound effect.

**would you still date me if** is a shuffled list of dumb hypothetical questions. it reshuffles when you've gone through all of them. the first question shows immediately without having to click.

**compliment machine** hits you with a random compliment every time you click. also reshuffles when exhausted.

---

built with react and vite. routing with react-router-dom. confetti via canvas-confetti. the font is Dancing Script. the color is purple.

hover effects work on mobile without getting stuck. there's a global touch handler that briefly applies a hover class on tap and removes it after half a second.
