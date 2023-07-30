import { data } from "../data/locationDataValue.js";
import { dimensions, usaProjection } from "../utility.js";

async function bubbleChart() {
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



  let onScroll = (year) => {
    // Create a new timeline
    let tl = gsap.timeline();
    // Add tweens to the timeline for each bubble
    bubbles.each((d, i, nodes) => {

      tl.to(nodes[i], {
        duration: 0.2,
        attr: { r: rScale(d.data[year].total) },
        ease: "power1.out",
      });
    });
    return tl;
  };

  let masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#bubble-map",
      markers: true,
      start: "top top",
      end: `+=${dimensions.height}px`,
      pin: true,
      // pingSpacing: true,
      scrub: true,
      onUpdate: (sc) => {
        let newIndex = parseInt(Math.round(sc.progress * 10));
        if (newIndex !== index) {
          index = newIndex;
          masterTL.add(onScroll(index));
        }
      },
    },
  });
}
bubbleChart();
