import { stateLabels } from "../data/state.js";
import { usaProjection } from "../utility.js";
function StateLabel() {
  let stateLabelSelection = d3
    .select(".state-label-container")
    .selectAll("text")
    .data(stateLabels)
    .enter()
    .append("text")
    .text((d) => d[1])
    .attr("transform", (d) => {
      let c = usaProjection([d[2], d[3]]);
      return "translate(" + c[0] + "," + c[1] + ")";
    })
    .attr("opacity", 0);
  // what if this returns a timeline?


  let tl = gsap.timeline();
  tl.to(".state-label-container text", {
    duration: 1,
    opacity: 1,
    ease: "power1.out",
  });
//TODO: 1.when I scroll to the top of the scroller element
  ScrollTrigger.create({
    trigger: "#bubble-map",
    // markers: true,
    start: "10px top",
    end: "+=10px",//end after scrolling 500px beyond the start
    scrub: true,
    animation: tl,
  });
}
StateLabel();
