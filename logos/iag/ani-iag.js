let myLogo = document.getElementById("ani-svg");
var iagtl = gsap.timeline({ paused: true });
const spinDuration = 2;

iagtl
  .add("start-logo")

  .set("#hide-01", { transformOrigin: "center center", rotation: -90 })
  .set("#hide-03", { transformOrigin: "center center", rotation: -65 })
  .set("#i-circle-01", { scale: 0, transformOrigin: "center center" })

  .from("#theMaskRect", { x: 1024, duration: 1.5 }, 0)
  .from("#background", { x: 1024, duration: 1.5 }, 0)

  // I
  .to("#hide-01", { duration: 0.5, drawSVG: "0% 0%", ease: "none" }, 0.3)
  .fromTo("#hide-03", 1, { drawSVG: "0% 100%" }, { drawSVG: "100% 100% " }, 0.6)
  .fromTo(
    "#hide-02",
    0.3,
    { drawSVG: "0% 100%" },
    { drawSVG: "100% 100% " },
    0.8
  )

  // A
  .fromTo(
    "#hide-04",
    0.5,
    { drawSVG: "0% 100%" },
    { drawSVG: "100% 100% " },
    0.8
  )
  .fromTo(
    "#hide-05",
    0.8,
    { drawSVG: "0% 100%" },
    { drawSVG: "100% 100% " },
    1.1
  )

  // G
  .fromTo(
    "#hide-06",
    0.6,
    { drawSVG: "0% 100%" },
    { drawSVG: "100% 100% " },
    1.5
  )
  .to("#i-circle-01", { scale: 1, duration: 1, ease: "elastic.out" });

myLogo.addEventListener("mouseenter", () => {
  iagtl.restart().play();
});

iagtl.play();
