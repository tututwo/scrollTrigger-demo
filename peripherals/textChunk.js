import { dimensions } from "../utility.js";
function textChunk() {
  let index;
  const yearList = [
    2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
  ];

  let tl = gsap.timeline();

  ScrollTrigger.create({
    trigger: "#bubble-map",
    markers: true,
    start: "top top",
    end: `+=${dimensions.height}px`,
    scrub: true,
    onEnter: () => {
      document
        .getElementById("bubble-map-text-chunks")
        .classList.add("is-active");
    },
    onUpdate: (sc) => {
      index = parseInt(Math.round(sc.progress * 10));

      d3.select("#bubble-map-text-chunks h4").text(yearList[index]);
    },
  });
}

textChunk();
