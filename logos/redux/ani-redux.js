/* Redux logo */
let myLogo = document.getElementById("ani-svg");
var reduxtl = gsap.timeline({ paused: true });
const swooshDuration = 0.5;
const spinDuration = 2;

reduxtl
  .to("#ani-svg #stock", { delay: 0.001 })
  .set("#ani-svg #stock", { opacity: 0 })
  .set("#ani-svg #hide-animation", { opacity: 0 })
  .set("#ani-svg #ball-top", {
    scale: 0,
    transformOrigin: "center center",
  })
  .set("#ani-svg #ball-right", { opacity: 0 })
  .set("#ani-svg #ball-left", { opacity: 0 })
  .set("#ani-svg #ball-move-left", { opacity: 0 })
  .set("#ani-svg #ball-move-right", { opacity: 0 })
  .set("#ani-svg #ball-move-top", { opacity: 0 })

  .to("#ani-svg #ball-top", {
    delay: 0.5,
    duration: 1.2,
    scale: 1,
    ease: "elastic.out",
  })

  /*************************************/
  // SPIN
  /************************************/
  .add("start-spin")
  .set("#ani-svg #ball-right", { opacity: 1 })
  .set("#ani-svg #ball-left", { opacity: 1 })

  .to(
    "#ani-svg #ball-top",
    {
      duration: spinDuration,
      ease: "power1.in",
      motionPath: {
        path: "#ball-path-1",
        align: "#ball-path-1",
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
    },
    "start-spin"
  )
  .to(
    "#ani-svg #ball-right",
    {
      duration: spinDuration,
      ease: "power1.in",
      motionPath: {
        path: "#ball-path-2",
        align: "#ball-path-2",
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 1,
      },
    },
    "start-spin"
  )
  .to(
    "#ani-svg #ball-left",
    {
      duration: spinDuration,
      ease: "power1.in",
      motionPath: {
        path: "#ball-path-3",
        align: "#ball-path-3",
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 1,
      },
    },
    "start-spin"
  )
  .to(
    "#ani-svg #balls",
    {
      duration: spinDuration,
      rotation: -1000,
      transformOrigin: "center center",
      ease: "power1.in",
    },
    "start-spin"
  )

  /**********************************/
  // Lines
  /**********************************/
  .add("start-lines")
  .set("#ani-svg #balls", { opacity: 0 }, "start-lines")
  .set("#ani-svg #ball-move-left", { opacity: 1 })
  .set("#ani-svg #ball-move-right", { opacity: 1 })
  .set("#ani-svg #ball-move-top", { opacity: 1 })
  .set("#ani-svg #swoosh-left", { opacity: 0 })
  .set("#ani-svg #swoosh-right", { opacity: 0 })
  .set("#ani-svg #swoosh-top", { opacity: 0 })
  .to(
    "#ani-svg #swoosh-top-hide",
    { duration: swooshDuration, drawSVG: "0% 0%" },
    "start-lines"
  )
  .to(
    "#ani-svg #swoosh-left-hide",
    { duration: swooshDuration, drawSVG: "0% 0%" },
    "start-lines"
  )
  .to(
    "#ani-svg #swoosh-right-hide",
    { duration: swooshDuration, drawSVG: "0% 0%" },
    "start-lines"
  )

  /**********************************/
  // balls move
  /**********************************/
  .to(
    "#ani-svg #swoosh-left",
    {
      duration: swooshDuration,
      opacity: 1,
    },
    "start-lines"
  )
  .to(
    "#ani-svg #swoosh-top",
    {
      duration: swooshDuration,
      opacity: 1,
    },
    "start-lines"
  )
  .to(
    "#ani-svg #swoosh-right",
    {
      duration: swooshDuration,
      opacity: 1,
    },
    "start-lines"
  )
  .to(
    "#ani-svg #ball-move-left",
    {
      duration: swooshDuration,
      motionPath: {
        path: "#swoosh-left-path",
        align: "#swoosh-left-path",
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0.003,
      },
    },
    "start-lines"
  )
  .to(
    "#ani-svg #ball-move-top",
    {
      duration: swooshDuration,
      motionPath: {
        path: "#swoosh-top-path",
        align: "#swoosh-top-path",
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
    },
    "start-lines"
  )
  .to(
    "#ani-svg #ball-move-right",
    {
      duration: swooshDuration,
      motionPath: {
        path: "#swoosh-right-path",
        align: "#swoosh-right-path",
        alignOrigin: [0.5, 0.5],
        start: 1,
        end: 0,
      },
      onComplete: () => {
        reduxtl.play(0);
        reduxtl.pause();
      },
    },
    "start-lines"
  );

myLogo.addEventListener("mouseenter", () => {
  reduxtl.play();
});

reduxtl.play();
