import { json } from 'd3-request';
import {
  SET_AGE_RANGE, SET_FOCUS_SCALE, REQUEST_DATA, RECEIVE_DATA,
  SET_FILTERS, SET_FILTER_OPEN, WINDOW_RESIZE, SET_EXPANDED, SET_PINNED,
  SET_COLLAPSED_GROUP, REQUEST_NETWORK_DATA, RECEIVE_NETWORK_DATA,
  SET_SELECTED_ORFI, SET_PATHWAY_OPEN, SET_AGERANGE_OPEN,
  REQUEST_REFS_DATA, RECEIVE_REFS_DATA, SET_REVIEWREFS_OPEN,
  SET_LINKDIALOG_OPEN
} from '../constants';

export const setAgeRange = (val) => ({
  type: SET_AGE_RANGE,
  val
});

export const setTimelineFocusScale = (val) => ({
  type: SET_FOCUS_SCALE,
  val
});

export const setFilters = (data) => ({
  type: SET_FILTERS,
  data
});

export const setAgeRangeOpen = (val) => ({
  type: SET_AGERANGE_OPEN,
  val
});

export const setFilterOpen = (val) => ({
  type: SET_FILTER_OPEN,
  val
});

export const setLinkDialogOpen = (val) => ({
  type: SET_LINKDIALOG_OPEN,
  val
});

export const setPathwayOpen = (val) => ({
  type: SET_PATHWAY_OPEN,
  val
});

export const setReviewRefsOpen = (val) => ({
  type: SET_REVIEWREFS_OPEN,
  val
});

export const setSelectedORFI = (data) => ({
  type: SET_SELECTED_ORFI,
  data
});

export const setCollapsedGroup = (data) => ({
  type: SET_COLLAPSED_GROUP,
  data
});

export const addExpanded = (val) => ({
  type: SET_EXPANDED,
  data: { val, what: 'add' }
});

export const removeExpanded = (val) => ({
  type: SET_EXPANDED,
  data: { val, what: 'remove' }
});

export const clearExpanded = (val) => ({
  type: SET_EXPANDED,
  data: { val, what: 'clear' }
});

export const addPinned = (val) => ({
  type: SET_PINNED,
  data: { val, what: 'add' }
});

export const removePinned = (val) => ({
  type: SET_PINNED,
  data: { val, what: 'remove' }
});

export const clearPinned = (val) => ({
  type: SET_PINNED,
  data: { val, what: 'clear' }
});

export const setAllPinned = (val) => ({
  type: SET_PINNED,
  data: { val, what: 'set-all' }
});

export const windowResize = (dims) => ({
  type: WINDOW_RESIZE,
  dims
});

export const requestData = () => ({
  type: REQUEST_DATA
});

export const receiveData = (dat) => ({
  type: RECEIVE_DATA,
  data: dat,
  receivedAt: Date.now()
});

export const requestRefsData = () => ({
  type: REQUEST_REFS_DATA
});

export const receiveRefsData = (dat) => ({
  type: RECEIVE_REFS_DATA,
  data: dat,
  receivedAt: Date.now()
});

export const requestNetworkData = () => ({
  type: REQUEST_NETWORK_DATA
});

export const receiveNetworkData = (dat) => ({
  type: RECEIVE_NETWORK_DATA,
  data: dat,
  receivedAt: Date.now()
});

export const fetchData = (url) => (dispatch) => {
  dispatch(requestData());
  json(url, (dat) => {
    // compute the text width so we can compute layout when displaying events
    const tmpEl = document.createElement('canvas');
    const ctx = tmpEl.getContext('2d');
    ctx.font = '14px "Roboto Condensed"';

    const keys1 = Object.keys(dat.ogm.data);
    keys1.forEach((ky) => {
      const dt = dat.ogm.data[ky];
      for (let i = 0; i < dt.length; i += 1) {
        dt[i].textWidth = ctx.measureText(dt[i].desc_short).width;
        dt[i].class = 'ogm';
        dt[i].i = i;
      }
    });

    const keys2 = Object.keys(dat.nd.data);
    keys2.forEach((ky) => {
      const dt = dat.nd.data[ky];
      for (let i = 0; i < dt.length; i += 1) {
        dt[i].textWidth = ctx.measureText(dt[i].desc_short).width;
        dt[i].class = 'nd';
        dt[i].i = i;
      }
    });

    dispatch(receiveData(dat));
  });
};

export const fetchRefsData = (url) => (dispatch) => {
  dispatch(requestRefsData());
  json(url, (dat) => {
    dispatch(receiveRefsData(dat));
  });
};

export const fetchNetworkData = (url) => (dispatch) => {
  dispatch(requestNetworkData());
  json(url, (dat) => {
    const tmpEl = document.createElement('canvas');
    const ctx = tmpEl.getContext('2d');
    ctx.font = '14px "Roboto Condensed"';

    const kys = Object.keys(dat.nodes);
    kys.forEach((ky) => {
      const dt = dat.nodes[ky].data;
      dt.forEach((d, i) => {
        d.desc_short = d.name; // eslint-disable-line no-param-reassign
        d.textWidth = ctx.measureText(d.desc_short).width; // eslint-disable-line no-param-reassign
        d.uid = d.id; // eslint-disable-line no-param-reassign
        d.i = i; // eslint-disable-line no-param-reassign
      });
    });
    dispatch(receiveNetworkData(dat));
  });
};
