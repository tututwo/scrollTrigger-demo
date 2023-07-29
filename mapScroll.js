let theBubbleMap = null;
let mapScroller = null;

if (scrollingGraphics["mapScroller"]) {
  mapScroller = scrollingGraphics["mapScroller"];
  mapScroller.updateAspectRatio(window.innerHeight / window.innerWidth);

  mapScroller.$scrollstory.on("itemfocus", function (event, item) {
    if (item.index === 0) {
      theBubbleMap.updateBubbles(0);
    }
  });

  // console.log(templates["bubble_map/bubble_map"]);
  mapScroller.$graphic.append(`
	<div id="bubble-map-wrapper" class="chart-container has-tooltip">
		<div id="bubble-map" class="hide-labels">
			<svg height="900"></svg>
			<div id="bubble-map-info-box">
				<h4></h4>
				<p></p>
			</div>
			<div id="bubble-map-blurbs">
			</div>
			<p class="bloomberg-scrolly-size-note">Circles show the cumulative amount of philanthropic money spent by Mr. Bloomberg in the United States.</p>
		</div>
		<div id="bloomberg-scroll-prompt">Scroll</div>
	</div>
	`);

  theBubbleMap = new bubbleMap({
    element: document.getElementById("bubble-map"),
    data: locationContribs,
    blurbs: mapScroller.scrollstory._items,
  });

  let setMapScroll = () => {
    let curr = document.documentElement.scrollTop || document.body.scrollTop;
    let top = document.getElementById("mapScroller").offsetTop;
    let h = document.getElementById("mapScroller").offsetHeight;

    if (curr > top && curr < top + h) {
      let pos = (curr - top) / h;

      if (pos <= 0.08) {
        theBubbleMap.updateBubbles(0.75);
        document
          .getElementById("bubble-map-info-box")
          .classList.remove("is-active");
        document.getElementById("bubble-map").classList.add("hide-labels");
        theBubbleMap.clearBlurbs();
        theBubbleMap.setBlurb(0);
      } else if (pos >= 0.08 && pos <= 0.3) {
        theBubbleMap.updateBubbles(pos);
        document
          .getElementById("bubble-map-info-box")
          .classList.add("is-active");
        document.getElementById("bubble-map").classList.remove("hide-labels");
        theBubbleMap.clearBlurbs();
        theBubbleMap.setBlurb(1);
      } else if (pos >= 0.3 && pos <= 0.5) {
        theBubbleMap.updateBubbles(pos);
        document
          .getElementById("bubble-map-info-box")
          .classList.add("is-active");
        document.getElementById("bubble-map").classList.remove("hide-labels");
        theBubbleMap.clearBlurbs();
        theBubbleMap.setBlurb(2);
      } else if (pos >= 0.5 && pos <= 0.75) {
        theBubbleMap.updateBubbles(pos);
        document
          .getElementById("bubble-map-info-box")
          .classList.add("is-active");
        document.getElementById("bubble-map").classList.remove("hide-labels");
        theBubbleMap.clearBlurbs();
        theBubbleMap.setBlurb(3);
      } else {
        theBubbleMap.updateBubbles(0.75);
        document
          .getElementById("bubble-map-info-box")
          .classList.add("is-active");
        document.getElementById("bubble-map").classList.remove("hide-labels");
        theBubbleMap.clearBlurbs();
        theBubbleMap.setBlurb(3);
      }
    }
  };

  // let's scroll yo
  let timeout;

  // Listen for scroll events
  window.addEventListener(
    "scroll",
    function (event) {
      // If there's a timer, cancel it
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
      timeout = window.requestAnimationFrame(setMapScroll);
    },
    false
  );
}
// =============
// RESIZE UPDATE
// =============

window.addEventListener("optimizedResize", () => {
  if (scrollingGraphics["mapScroller"]) {
    theBubbleMap.update();
    mapScroller.updateAspectRatio(window.innerHeight / window.innerWidth);
  }
  if (scrollingGraphics["bubbleScroller"]) {
    theBubbleChart.update(false);
    bubbleScroller.updateAspectRatio(window.innerHeight / window.innerWidth);
  }
});
