import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { arc } from 'd3-shape';
import { brushX } from 'd3-brush';
import { select, event as curEvent } from 'd3-selection';
// import { throttle } from 'throttle-debounce';
import { setAgeRange, setTimelineFocusScale, clearExpanded } from '../actions';
import { ui } from '../constants';
import {
  y2w, w2y, m2w, w2m
} from '../utils/ageCalc';

const findIndex = (x, arr) => {
  for (let ii = 0; ii < arr.length; ii += 1) {
    if (x === arr[ii] && ii > 0) {
      return ii - 1;
    }
    if (x <= arr[ii]) {
      return Math.max(0, ii - 1);
    }
  }
  return 0;
};

class AgeSlider extends Component {
  constructor(props) {
    super(props);
    this.createAgeSlider = this.createAgeSlider.bind(this);
  }

  componentDidMount() {
    this.createAgeSlider();
  }

  componentDidUpdate(prevProps) {
    // only redraw if windowSize.appWidth has changed
    const { windowSize, ageRange } = this.props;
    if (prevProps.windowSize.appWidth !== windowSize.appWidth
      || prevProps.windowSize.appLeft !== windowSize.appLeft
      || prevProps.ageRange[0] !== ageRange[0]
      || prevProps.ageRange[1] !== ageRange[1]) {
      select(this.node).html('');
      this.createAgeSlider();
    }
  }

  createAgeSlider() {
    const { node } = this;
    const {
      setRange, setScale, windowSize, ageRange
    } = this.props;

    const brushHeight = 18;

    // const setRange2 = throttle(100, (curDom) => {
    //   setRange(curDom);
    // });

    // const setScale2 = throttle(100, (focDomain, focRange) => {
    //   setScale(focDomain, focRange);
    // });

    // Conception to prenatal: 40 weeks
    // Infant to toddler: 0 to 36 months (40 to 196 weeks)
    // Childhood to adolescence: 3 to 13 years (196 to 716)
    const xLengths = [10, 6, 5]; // number of ticks in each interval
    const xProps = xLengths.map((x) => x / 21);

    const svg = select(node);
    const marginFoc = {
      top: 40, right: 0, bottom: 0, left: 0
    };
    const marginCtx = {
      top: 0,
      right: 0,
      bottom: windowSize.height - ui.header.height,
      left: 0
    }; // bottom should be svg height
    const width = windowSize.appWidth - 30;
    const wwidth = windowSize.width;
    const wleft = (wwidth - width) / 2;
    const heightFoc = +svg.attr('height') - marginFoc.top - marginFoc.bottom;
    const heightCtx = +svg.attr('height') - marginCtx.top - marginCtx.bottom;

    // const xDomain = [0, 40, 196, 716];
    // this adds some padding to left and right of timeline
    const xDomain = [-10, 0, 40, 196, 719, 726];
    const xRange = [
      0,
      0 + wleft,
      width * xProps[0] + wleft,
      width * (xProps[0] + xProps[1]) + wleft,
      width + wleft,
      wwidth
    ];

    const xDomainFoc = [0, 40, 196, 719];
    const xRangeFoc = [
      0,
      wwidth * xProps[0],
      wwidth * (xProps[0] + xProps[1]),
      wwidth
    ];

    const xScaleFoc = scaleLinear()
      .range(xRangeFoc)
      .domain(xDomainFoc);

    const xScaleCtx = scaleLinear()
      .range(xRange)
      .domain(xDomain);

    // const xFocLabelTicks = [
    //   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    //   21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    //   m2w(0), m2w(1), m2w(2), m2w(3), m2w(4), m2w(5), m2w(6), m2w(7), m2w(8), m2w(9),
    //   m2w(10), m2w(11), m2w(12), m2w(13), m2w(14), m2w(15), m2w(16), m2w(17), m2w(18),
    //   m2w(19), m2w(20), m2w(21), m2w(22), m2w(23), m2w(24), m2w(25), m2w(26), m2w(27),
    //   m2w(28), m2w(29), m2w(30), m2w(31), m2w(32), m2w(33), m2w(34), m2w(35),
    //   y2w(3), y2w(4), y2w(5), y2w(6), y2w(7), y2w(8), y2w(9), y2w(10), y2w(11), y2w(12)
    // ];

    // change the ticks for the focused view based on how large of a region is selected
    const propSelected = (xScaleCtx(ageRange[1]) - xScaleCtx(ageRange[0])) / width;
    let xFocTicks = [];
    if (propSelected > 0.4) {
      xFocTicks = [
        0, 8, 16, 24, 32,
        m2w(0), m2w(12), m2w(24),
        y2w(3), y2w(7), y2w(11)
      ];
    } else if (propSelected > 0.15) {
      xFocTicks = [
        0, 4, 8, 12, 16, 20, 24, 28, 32, 36,
        m2w(0), m2w(6), m2w(12), m2w(18), m2w(24), m2w(30),
        y2w(3), y2w(5), y2w(7), y2w(9), y2w(11)
      ];
    } else if (propSelected > 0.05) {
      xFocTicks = [
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20,
        22, 24, 26, 28, 30, 32, 34, 36, 38,
        m2w(0), m2w(2), m2w(4), m2w(6), m2w(8),
        m2w(10), m2w(12), m2w(14), m2w(16), m2w(18),
        m2w(20), m2w(22), m2w(24), m2w(26), m2w(28),
        m2w(30), m2w(32), m2w(34),
        y2w(3), y2w(5), y2w(7), y2w(9), y2w(11)
      ];
    } else {
      xFocTicks = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        m2w(0), m2w(1), m2w(2), m2w(3), m2w(4), m2w(5), m2w(6), m2w(7), m2w(8), m2w(9),
        m2w(10), m2w(11), m2w(12), m2w(13), m2w(14), m2w(15), m2w(16), m2w(17), m2w(18),
        m2w(19), m2w(20), m2w(21), m2w(22), m2w(23), m2w(24), m2w(25), m2w(26), m2w(27),
        m2w(28), m2w(29), m2w(30), m2w(31), m2w(32), m2w(33), m2w(34), m2w(35),
        y2w(3), y2w(4), y2w(5), y2w(6), y2w(7), y2w(8), y2w(9), y2w(10), y2w(11), y2w(12)
      ];
    }

    // context ticks
    const xTicks = [
      0, 4, 8, 12, 16, 20, 24, 28, 32, 36,
      m2w(0), m2w(6), m2w(12), m2w(18), m2w(24), m2w(30),
      y2w(3), y2w(5), y2w(7), y2w(9), y2w(11)
    ];

    // context minor ticks
    const xTicks2 = [
      2, 6, 10, 14, 18, 22, 26, 30, 34, 38,
      m2w(3), m2w(9), m2w(15), m2w(21), m2w(27), m2w(33),
      y2w(4), y2w(6), y2w(8), y2w(10), y2w(12)
    ];

    // context major ticks
    const xTicks3 = [
      0, m2w(0), y2w(3), y2w(13)
    ];

    // focus view ticks
    const xAxisFoc2 = axisBottom(xScaleFoc)
      .tickValues(xFocTicks)
      .tickSize(windowSize.height - ui.header.height)
      .tickFormat(() => null);

    // focus view tick labels
    const xAxisFoc = axisBottom(xScaleFoc)
      .tickValues(xFocTicks)
      .tickSize(0)
      .tickFormat((d) => {
        if (d <= 39) {
          return `${d}WK`;
        }
        if (d === 40) {
          return 'BIRTH';
        }
        if (d > 39 && d < 196) {
          return `${Math.round(w2m(d))}MO`;
        }
        if (d > 196) {
          return `${Math.round(w2y(d))}YR`;
        }
        return null;
      });

    // context (full) timeline view major ticks
    const xAxisCtx = axisBottom(xScaleCtx)
      .tickValues(xTicks)
      .tickSize(10)
      .tickSizeOuter(0)
      .tickFormat((d) => {
        if (d <= 36) {
          return d;
        }
        if (d > 38 && d < 196) {
          return Math.round(w2m(d));
        }
        // if (d > 196) {
        return Math.round(w2y(d));
        // }
      });

    // context (full) timeline view minor ticks
    const xAxisCtx2 = axisBottom(xScaleCtx)
      .tickValues(xTicks2)
      .tickSize(10)
      .tickSizeOuter(0)
      .tickFormat(() => null);

    // context (full) timeline view tick labels
    const xAxisCtx3 = axisBottom(xScaleCtx)
      .tickValues(xTicks3)
      .tickSize(18)
      .tickSizeOuter(0)
      .tickFormat((d) => {
        if (d <= 36) {
          return 'CONCEPTION TO PRENATAL (weeks)';
        }
        if (d > 38 && d < 196) {
          return 'INFANT TO TODDLER (months)';
        }
        if (d > 196 && d < 300) {
          return 'CHILDHOOD TO ADOLESCENCE (years)';
        }
        return null;
      });

    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', wwidth)
      .attr('height', heightFoc);

    const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${marginCtx.left},${marginCtx.top})`);

    const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${marginFoc.left},${marginFoc.top})`);

    focus.append('rect')
      .attr('class', 'focus-area')
      .attr('width', wwidth)
      .attr('height', heightFoc);

    const gAxisFoc = focus.append('g')
      .attr('class', 'axis axis--x4')
      .attr('transform', `translate(0,${5})`)
      .call(xAxisFoc);

    gAxisFoc.selectAll('text')
      .attr('y', 2)
      .attr('x', 2)
      .style('text-anchor', 'start');
    gAxisFoc.selectAll('path')
      .attr('stroke', null);
    gAxisFoc.selectAll('line')
      .attr('stroke', null);

    const gAxisFoc2 = focus.append('g')
      .attr('class', 'axis axis--x5')
      .attr('transform', `translate(0,${5})`);

    gAxisFoc2.call(xAxisFoc2)
      .selectAll('path')
      .attr('stroke', null);
    gAxisFoc2.call(xAxisFoc2)
      .selectAll('line')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-dasharray', '1, 4')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${heightCtx})`)
      .call(xAxisCtx)
      .selectAll('text')
      .attr('y', 7) // how far the tick labels are below the axis line
      .attr('x', 3) // how far the tick labels are to the right of the tick lines
      .attr('fill', ui.slider.unselectColor)
      .style('text-anchor', 'start');

    context.append('g')
      .attr('class', 'axis axis--x2')
      .attr('transform', `translate(0,${heightCtx})`)
      .call(xAxisCtx2)
      .selectAll('text')
      .attr('fill', ui.slider.unselectColor);

    context.append('g')
      .attr('class', 'axis axis--x3')
      .attr('transform', `translate(0,${heightCtx})`)
      .call(xAxisCtx3)
      .selectAll('text')
      .attr('y', 23) // how far the tick labels are below the axis line
      .attr('fill', ui.slider.unselectColor)
      .style('text-anchor', 'start');

    svg.selectAll('.context .domain')
      .attr('stroke', ui.slider.unselectColor);

    const brush = brushX()
      .extent([[0 + wleft + 1, heightCtx], [wwidth - wleft - 1, heightCtx + brushHeight]]);

    const gBrush = context.append('g')
      .attr('class', 'brush')
      .call(brush);

    const handle = gBrush.selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter().append('path')
      .attr('class', 'handle--custom')
      .attr('fill', ui.slider.selectColor)
      .attr('cursor', 'ew-resize')
      .attr('d', arc()
        .innerRadius(0)
        .outerRadius(brushHeight / 2)
        .startAngle(0)
        .endAngle((d, i) => (i ? Math.PI : -Math.PI)));

    const brushLine = gBrush
      .append('rect')
      .attr('class', 'handle-line')
      .attr('width', 0)
      .attr('height', 1)
      .attr('stroke', ui.slider.selectColor);

    function updateXDomainRange(curDom) {
      // const xd = [];
      // const xr = [];
      // const curDom2 = curDom.sort();
      const curDom2 = curDom;
      const idx1 = findIndex(curDom2[0], xDomain) - 1;
      const idx2 = findIndex(curDom2[1], xDomain) - 1;
      const newDomain = [];
      const newRange = [];

      if (idx1 === idx2) {
        newDomain.push(curDom2[0], curDom2[1]);
        newRange.push(0 + wleft, width + wleft);
      } else if ((idx2 - idx1) === 1) {
        const newLengths = [
          xLengths[idx1] * ((xDomainFoc[idx1 + 1] - curDom2[0])
            / (xDomainFoc[idx1 + 1] - xDomainFoc[idx1])),
          xLengths[idx2] * ((curDom2[1] - xDomainFoc[idx2])
            / (xDomainFoc[idx2 + 1] - xDomainFoc[idx2]))
        ];
        const denom = newLengths[0] + newLengths[1];
        const newProps = newLengths.map((d) => d / denom);
        newDomain.push(
          curDom2[0],
          xDomainFoc[idx1 + 1],
          curDom2[1]
        );
        newRange.push(
          0 + wleft,
          newProps[0] * width + wleft,
          width + wleft
        );
      } else if ((idx2 - idx1) === 2) {
        const newLengths = [
          xLengths[idx1] * ((xDomainFoc[idx1 + 1] - curDom2[0])
            / (xDomainFoc[idx1 + 1] - xDomainFoc[idx1])),
          xLengths[idx1 + 1],
          xLengths[idx2] * ((curDom2[1] - xDomainFoc[idx2])
            / (xDomainFoc[idx2 + 1] - xDomainFoc[idx2]))
        ];
        const denom = newLengths[0] + newLengths[1] + newLengths[2];
        const newProps = newLengths.map((d) => d / denom);
        newDomain.push(
          curDom2[0],
          xDomainFoc[idx1 + 1],
          xDomainFoc[idx1 + 2],
          curDom2[1]
        );
        newRange.push(
          0 + wleft,
          newProps[0] * width + wleft,
          (newProps[0] + newProps[1]) * width + wleft,
          width + wleft
        );
      }
      return { domain: newDomain, range: newRange };
    }

    function updateBrush() {
      if (curEvent.sourceEvent && curEvent.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
      // const s = curEvent.selection || xScaleCtx.range();
      const s = curEvent.selection;
      let curDom;
      if (s) { // if there is a selection
        curDom = s.map(xScaleCtx.invert);
        handle.attr('display', null)
          .attr('transform', (d, i) => `translate(${s[i]},${brushHeight / 2})`);
        brushLine
          .attr('width', s[1] - s[0])
          .attr('transform', `translate(${s[0]},${0})`);
      } else {
        // curDom = [Infinity, Infinity];
        curDom = [xDomain[0], xDomain[xDomain.length - 1]];
        handle.attr('display', 'none');
        brushLine.attr('width', 0);
      }

      // highlight selected axis ticks
      svg.selectAll('.context .axis--x text')
        .attr('fill', (d) => (
          (d >= curDom[0] && d <= curDom[1]) ? ui.slider.selectColor : ui.slider.unselectColor
        ));

      // highlight selected axis range labels (conception, infant, toddler)
      svg.selectAll('.context .axis--x3 text')
        .attr('fill', (d) => {
          if (d === xTicks3[0]) {
            return (curDom[0] <= xTicks3[1])
              ? ui.slider.selectColorLabels : ui.slider.unselectColor;
          }
          if (d === xTicks3[1]) {
            const inRange = curDom[0] <= xTicks3[2] && curDom[1] >= xTicks3[1];
            return inRange ? ui.slider.selectColorLabels : ui.slider.unselectColor;
          }
          if (d === xTicks3[2]) {
            return (curDom[1] >= xTicks3[2])
              ? ui.slider.selectColorLabels : ui.slider.unselectColor;
          }
          return ui.slider.unselectColor;
        });

      // highlight selected major axis tick lines
      svg.selectAll('.context .axis line')
        .attr('stroke', (d) => (
          (d >= curDom[0] && d <= curDom[1]) ? ui.slider.selectColor : ui.slider.unselectColor
        ));
    }

    function updateView() {
      if (curEvent.sourceEvent && curEvent.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
      // const s = curEvent.selection || xScaleCtx.range();
      const s = curEvent.selection;
      let curDom;
      let focDomain;
      let focRange;
      if (s) { // if there is a selection
        curDom = s.map(xScaleCtx.invert);
        const newDR = updateXDomainRange(curDom);
        focDomain = newDR.domain;
        focRange = newDR.range;
        handle.attr('display', null)
          .attr('transform', (d, i) => `translate(${s[i]},${brushHeight / 2})`);
        brushLine
          .attr('width', s[1] - s[0])
          .attr('transform', `translate(${s[0]},${0})`);
      } else {
        // curDom = [Infinity, Infinity];
        curDom = [xDomain[0], xDomain[xDomain.length - 1]];
        focDomain = xDomain;
        focRange = xRange;
        handle.attr('display', 'none');
        brushLine.attr('width', 0);
      }

      xScaleFoc.domain(focDomain);
      xScaleFoc.range(focRange);

      // trigger a change to ageRange
      setRange(curDom);
      setScale(focDomain, focRange);

      // update the ticks in the focused timeline view
      focus.select('.axis--x4')
        // .transition() // TODO: fix this
        .call(xAxisFoc)
        .selectAll('text')
        .attr('y', 2)
        .attr('x', 2)
        .style('text-anchor', 'start');

      focus.select('.axis--x5')
        .transition()
        .call(xAxisFoc2);
    }

    brush
      .on('end', updateView)
      .on('brush', updateBrush);

    gBrush.call(brush.move, [xScaleCtx(ageRange[0]), xScaleCtx(ageRange[1])]);
  }

  render() {
    const { windowSize } = this.props;
    return (
      <svg
        ref={(node) => { this.node = node; }}
        width={windowSize.width}
        height={windowSize.height - ui.header.height}
      />
    );
  }
}

AgeSlider.propTypes = {
  setRange: PropTypes.func.isRequired,
  setScale: PropTypes.func.isRequired,
  windowSize: PropTypes.object.isRequired,
  ageRange: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  ageRange: state.ageRange,
  windowSize: state.windowSize
});

const mapDispatchToProps = (dispatch) => ({
  setRange: (range) => {
    dispatch(setAgeRange(range));
    // clear expanded items in case events move to a different row
    dispatch(clearExpanded());
  },
  setScale: (domain, range) => {
    const scl = scaleLinear()
      .range(range)
      .domain(domain);
    dispatch(setTimelineFocusScale(scl));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgeSlider);
