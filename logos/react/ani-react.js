/* React logo */

let myLogo = document.getElementById("ani-svg");
var reacttl = gsap.timeline({ paused: true });
const pathAnimationDuration = 1;

// https://gsap.com/community/forums/topic/27881-magnetic-cursor/

const circleContainer = document.querySelector("#circleContainer");
const circle = document.querySelector("#circle01");

circleContainer.addEventListener("mousemove", onMove);
circleContainer.addEventListener("mouseleave", onLeave);

function onMove(e) {
  const { left, top, width, height } = circleContainer.getBoundingClientRect();

  const halfW = width / 2;
  const halfH = height / 2;
  const mouseX = e.x - left;
  const mouseY = e.y - top;

  const x = gsap.utils.interpolate(-halfW, halfW, mouseX / width);
  const y = gsap.utils.interpolate(-halfH, halfH, mouseY / height);

  gsap.to(circle, {
    x: x,
    y: y,
    scale: 0.8,
    duration: 0.6,
    ease: "power1",
    overwrite: true,
  });
}

function onLeave(e) {
  gsap.to(circle, {
    x: 0,
    y: 0,
    scale: 1,
    ease: "power3",
    duration: 0.6,
    overwrite: true,
  });
}

reacttl
  .set("#logoWrapper", {
    transformOrigin: "70.5% 70.5%",
  })

  .set("#gradiant01", {
    scale: 0,
    transformOrigin: "50% 50%",
  })

  .set("#gradiant02", {
    scale: 0,
    transformOrigin: "50% 50%",
  })

  .set("#gradiant03", {
    scale: 0,
    transformOrigin: "50% 50%",
  })

  /*************************************/
  // START
  /************************************/

  .add("start")
  //.to('#Logo', {opacity:0.1})
  .to(
    "#logopath03",
    pathAnimationDuration / 2,
    { strokeDasharray: "0, 2273", ease: "none" },
    "start"
  )
  .add("path02")
  .set("#logopath03", { opacity: "0" })
  .to("#gradiant03", {
    duration: pathAnimationDuration,
    motionPath: { path: "#clearpath03", start: -0, end: -1 },
    ease: "none",
    repeat: "-1",
  })
  .to(
    "#whitepath03",
    pathAnimationDuration,
    { strokeDashoffset: "2273px", ease: "none", repeat: "-1" },
    "<"
  )
  .to("#gradiant03", { scale: 1 }, "<")

  .to(
    "#logopath02",
    pathAnimationDuration / 2,
    { strokeDasharray: "0, 2273", ease: "none" },
    `path02`
  )
  .add("path03")
  .set("#logopath02", { opacity: "0" })
  .to("#gradiant02", {
    duration: pathAnimationDuration,
    motionPath: { path: "#clearpath02", start: -0, end: -1 },
    ease: "none",
    repeat: "-1",
  })
  .to(
    "#whitepath02",
    pathAnimationDuration,
    { strokeDashoffset: "2273px", ease: "none", repeat: "-1" },
    "<"
  )
  .to("#gradiant02", { scale: 1 }, "<")

  .to(
    "#logopath01",
    pathAnimationDuration / 2,
    { strokeDasharray: "0, 2273", ease: "none" },
    `path03`
  )
  .set("#logopath01", { opacity: "0" })
  .to("#gradiant01", {
    duration: pathAnimationDuration,
    motionPath: { path: "#clearpath01", start: -0, end: -1 },
    ease: "none",
    repeat: "-1",
  })
  .to(
    "#whitepath01",
    pathAnimationDuration,
    { strokeDashoffset: "2273px", ease: "none", repeat: "-1" },
    "<"
  )
  .to("#gradiant01", { scale: 1 }, "<");

myLogo.addEventListener("mouseenter", () => {
  reacttl.play();
});

myLogo.addEventListener("mouseleave", () => {
  reacttl.restart().pause();
});

reacttl.play();
