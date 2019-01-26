import React from 'react';
import { connect } from 'react-redux';
import AgeSlider from './AgeSlider';
import EventsGroup from './EventsGroup';
import { ui } from '../constants';

const Body = ({ data, windowSize }) => (
  <div>
    <div className="slider-container" style={{ height: ui.slider.height, top: ui.header.height }}>
      <AgeSlider />
    </div>
    <div className="events-container" style={{ top: ui.slider.height + ui.header.height, height: windowSize.height - ui.header.height - ui.slider.height }}>
      {/* <PinnedEvents /> */}
      {data['Growth and Maturation'] !== undefined && (
        <EventsGroup
          data={data['Growth and Maturation']}
        />
      )}
      {data['Developmental Domains'] !== undefined && (
        <EventsGroup
          data={data['Developmental Domains']}
        />
      )}
      {data['Organogenesis'] !== undefined && (
        <EventsGroup
          data={data['Organogenesis']}
        />
      )}
    </div>
  </div>
);

const mapStateToProps = state => ({
  data: state.timelineData.data,
  windowSize: state.windowSize
});

export default connect(
  mapStateToProps,
)(Body);
