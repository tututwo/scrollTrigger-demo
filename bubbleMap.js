class bubbleMap {
  constructor(opts) {
    Object.assign(this, opts);

    this.index = 10;
    this.yearList = [
      2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
    ];
    this.usaShapeData = feature(usa, usa.objects.cb_2018_us_state_5m);

    this.scrollSeek = linear$1()
      .domain([0.2, 0.6])
      .range([0, this.yearList.length - 1])
      .clamp(true);

    this.cityLabels = [
      {
        name: "Washington",
        coords: [-77.030415, 38.893343],
        orient: "sw",
        minYear: 2008,
      },
      {
        name: "New York",
        coords: [-74.007086, 40.710407],
        orient: "nw",
        minYear: 2008,
      },
      {
        name: "Baltimore",
        coords: [-76.615378, 39.288681],
        orient: "nw",
        minYear: 2009,
      },
      {
        name: "Atlanta",
        coords: [-84.385022, 33.757097],
        orient: "se",
        minYear: 2009,
      },
      {
        name: "Boston",
        coords: [-71.059094, 42.360393],
        orient: "ne",
        minYear: 2008,
      },
      {
        name: "San Francisco",
        coords: [-122.413249, 37.778091],
        orient: "ne",
        minYear: 2011,
      },
      {
        name: "Dallas",
        coords: [-96.798348, 32.780291],
        orient: "ne",
        minYear: 2011,
      },
      {
        name: "New Orleans",
        coords: [-90.103998, 29.956033],
        orient: "se",
        minYear: 2011,
      },
      {
        name: "Los Angeles",
        coords: [-118.244394, 34.049981],
        orient: "ne",
        minYear: 2013,
      },
      // {
      //   'name' : 'Philadelphia',
      //   'coords': [-75.156019,39.950388],
      //   'orient': 'se',
      //   'minYear': 2013
      // },
      {
        name: "Portland",
        coords: [-122.678292, 45.519407],
        orient: "se",
        minYear: 2013,
      },
      {
        name: "Seattle",
        coords: [-122.331609, 47.60785],
        orient: "se",
        minYear: 2014,
      },
      {
        name: "Chicago",
        coords: [-87.629936, 41.87903],
        orient: "sw",
        minYear: 2015,
      },
      {
        name: "Minneapolis",
        coords: [-93.265824, 44.976536],
        orient: "nw",
        minYear: 2015,
      },
      {
        name: "Denver",
        coords: [-104.995388, 39.750222],
        orient: "ne",
        minYear: 2015,
      },
    ];

    this.appendElements();
    this.update();
    this.setBlurb(0);
  }

  update() {
    this._setDimensions();
    this._setScales();
    this.render();
    this.updateBubbles();
  }

  _setDimensions() {
    // define width, height and margin

    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  _setScales() {
    // Radius
    this.rScale = pow()
      .domain([0, 500000000])
      .range([0, this.width / 12])
      .exponent(0.5);

    this.margin = this.width / 20;

    // Map
    this.usaProjection = geoAlbersUsa().fitExtent(
      [
        [this.margin, this.margin],
        [this.width - this.margin, this.height - this.margin],
      ],
      this.usaShapeData
    );

    this.geoPath = geoPath(this.usaProjection);
  }

  appendElements() {
    this.svg = select(this.element).select("svg");

    this.plot = this.svg.append("g").attr("class", "g-chart");

    // this.scales = this.svg.append("g")
    //   .attr("class", "g-scale")
    //   .selectAll('g')
    //   .data([10000000, 25000000,50000000,100000000,200000000,300000000,400000000,500000000,])
    //   .enter().append('g')

    // this.scales.append('circle')
    // this.scales.append('text')
    //   .text(d => d/1000000 + 'm')

    this.usaMap = this.plot
      .append("g")
      .attr("class", "usa-map-container")
      .append("path")
      .datum(this.usaShapeData);

    this.stateLabels = this.plot
      .append("g")
      .attr("class", "state-label-container")
      .selectAll("text")
      .data(stateLabels)
      .enter()
      .append("text")
      .text((d) => d[1]);

    this.cities = this.plot
      .append("g")
      .attr("class", "bubbles-container")
      .selectAll("g")
      .data(this.data)
      .enter()
      .append("g");

    this.bubbles = this.cities.append("circle").attr("cx", 0).attr("cy", 0);

    this.labels = this.plot
      .append("g")
      .attr("class", "cities-container")
      .selectAll("g")
      .data(this.cityLabels)
      .enter()
      .append("g")
      .attr("class", "city-label");

    this.labels.append("circle").attr("r", 1.5).attr("cx", 0).attr("cy", 0);

    this.labels.append("text").each((d, i, e) => {
      let _this = select(e[i]);
      _this.text(d.name);

      if (d.orient === "nw") {
        _this.attr("text-anchor", "end").attr("x", -3).attr("y", -3);
      }

      if (d.orient === "sw") {
        _this.attr("text-anchor", "end").attr("x", -3).attr("y", 9);
      }

      if (d.orient === "ne") {
        _this.attr("x", 3).attr("y", -3);
      }

      if (d.orient === "se") {
        _this.attr("x", 3).attr("y", 9);
      }
    });

    this.blurbs = select(this.element)
      .select("#bubble-map-blurbs")
      .selectAll("p")
      .data(this.blurbs)
      .enter()
      .append("p")
      .attr("class", (d, i) => {
        return "bubble-map-blurb bubble-map-blurb-" + i;
      })
      .html((d) => {
        return `
            <img class="bloomberg-money-sig" src="https://static01.nyt.com/newsgraphics/2020/01/07/bloomberg-spending/e291ba73e43ad03b9e5f1ca93851cd8460a85897/bloomberg.png"/>
            ${d.data.html}
          `;
      });
  }

  setBlurb(index) {
    this.blurbs.nodes()[index].classList.add("is-visible");
  }

  clearBlurbs() {
    this.blurbs.classed("is-visible", false);
  }

  render() {
    let sizeNoteCoords = this.usaProjection([-88.971069, 26.25955]);
    select("#mapScroller .bloomberg-scrolly-size-note")
      .style("left", sizeNoteCoords[0] + "px")
      .style("top", sizeNoteCoords[1] + "px");

    this.svg.attr("width", this.width);
    this.svg.attr("height", this.height);
    this.usaMap.attr("d", this.geoPath).on("click", (d, i, e) => {
      console.log(this.usaProjection.invert(mouse(e[i])));
    });

    this.stateLabels.attr("transform", (d) => {
      let c = this.usaProjection([d[2], d[3]]);
      return "translate(" + c[0] + "," + c[1] + ")";
    });

    this.cities.attr("transform", (d) => {
      let c = this.usaProjection(d.coords);
      return "translate(" + c[0] + "," + c[1] + ")";
    });

    this.bubbles.transition().attr("r", (d) => {
      return this.rScale(d.data[this.index].total);
    });

    this.labels.attr("transform", (d) => {
      return "translate(" + this.usaProjection(d.coords).join(",") + ")";
    });

    // this.scales
    //   .attr('transform', (d,i,e) => {
    //     let x = i * (this.width/e.length+1) + 100
    //     return `translate(${x},${this.height-40})`
    //   })

    // this.scales.select('circle').attr('r', d => this.rScale(d))
    //   .attr('fill', 'none')
    //   .attr('stroke', '#000')
  }

  updateBubbles(perc) {
    if (perc) {
      this.index = parseInt(Math.round(this.scrollSeek(perc)));
    }
    this.bubbles.transition().attr("r", (d) => {
      return this.rScale(d.data[this.index].total);
    });

    this.labels.classed("show-city", (d) => {
      return d.minYear <= this.yearList[this.index];
    });

    let citiesWithValue = this.data.filter((d) => {
      return d.data[this.index].total > 0;
    });

    let total = 0;

    citiesWithValue.forEach((d) => {
      total += d.data[this.index].total;
    });

    select("#bubble-map-info-box h4").text(this.yearList[this.index]);
    select("#bubble-map-info-box p").html(`
      ${cashFormat(total)} given across ${citiesWithValue.length} cities
    `);
  }
}
