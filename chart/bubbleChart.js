import { data } from "../data/locationDataValue.js";
import { dimensions, usaProjection } from "../utility.js";

 function bubbleChart() {
  let index = 10;
  const rScale = d3
    .scalePow()
    .domain([0, 500000000])
    .range([0, dimensions.width / 12])
    .exponent(0.5);

  const cities = d3
    .select(".bubbles-container")
    .selectAll("g")
    .data(data)
    .join("g");
  cities.attr("transform", (d) => {
    let c = usaProjection(d.coords);
    return "translate(" + c[0] + "," + c[1] + ")";
  });
  const bubbles = cities
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => {
      return rScale(d.data[index].total);
    });
  /********************************
   * * Approach 1: d3.transition
   ********************************/
  // const onScroll = (year) =>
  //   bubbles.transition().attr("r", (d) => {
  //     return rScale(d.data[year].total);
  //   });

  // ScrollTrigger.create({
  //   trigger: "#bubble-map",
  //   start: "top top",
  //   markers: true,
  //   pin: true,
  //   onUpdate: (sc) => {
  //     const newIndex = parseInt(Math.round(sc.progress * 10));
  //     onScroll(newIndex);
  //   },
  // });

  /********************************
   * * Approach 2: one master timeline for all
   ********************************/
  let masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#bubble-map",
      // markers: true,
      start: "top top",
      end: `+=${dimensions.height}px`,
      pin: true,
      scrub: true,
     
    },
  });

  bubbles.each((d, i, nodes) => {
    d.data.forEach((yearData, yearIndex) => {
      masterTL.to(
        nodes[i],
        {
          attr: { r: rScale(yearData.total) },
          ease: "power1.out",
        },
        yearIndex / 10 // We set each transition to start at the corresponding progress point.
      );
    });
  });
  /********************************
   * * Approach 3: one  timeline for each circle
   ********************************/
  // let timelines = [];

  // bubbles.each((d, i, nodes) => {
  //   // Create a timeline for each bubble
  //   let tl = gsap.timeline({ paused: true });

  //   // Add to each timeline the transitions of the radius for each year
  //   d.data.forEach((yearData, yearIndex) => {
  //     tl.to(
  //       nodes[i],
  //       {
  //         attr: { r: rScale(yearData.total) },
  //         ease: "power1.out",
  //       },

  //     ); // We set each transition to start at the corresponding progress point.
  //   });

  //   timelines.push(tl);
  // });
  // ScrollTrigger.create({
  //   trigger: "#bubble-map",
  //   markers: true,
  //   start: "top top",
  //   end: `+=${dimensions.height}px`,
  //   pin: true,
  //   scrub: true,
  //   onUpdate: (sc) => {
  //     let progress = sc.progress;
  //     // Update the progress of each individual timeline
  //     timelines.forEach((tl) => tl.progress(progress));
  //   },
  // });

}
bubbleChart();
