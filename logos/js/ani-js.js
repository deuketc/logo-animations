/* Javascript logo */
let myLogo = document.getElementById("ani-svg");
var jstl = gsap.timeline({ paused: true });
jstl
  .to("#ani-svg .js-background", { duration: 1, opacity: 1 })
  .to("#ani-svg .js-type", { duration: 0.7, scale: 0.6 }, "<")
  .to("#ani-svg .js-type", { duration: 0.7, x: 250 }, "<")
  .to("#ani-svg .js-type", { duration: 0.7, y: 260 }, "<");
myLogo.addEventListener("mouseenter", () => {
  jstl.play();
});

myLogo.addEventListener("mouseleave", () => {
  jstl.reverse();
});

jstl.play();
