import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import SearchBox from './SearchBox';
import { setFilters, setSelectedORFI } from '../actions';
import { escapeRegexCharacters } from '../utils/regex';
// import { ui } from '../constants';

const FilterPathway = ({
  // windowSize,
  selected, data, removePathway, addPathway
}) => {
  if (!data.nodes) {
    return '';
  }

  const emptyText = [
    'Pneumonia, Measles, Type 1 Diabetes, etc.',
    'Malnutrition, Maternal Infection, Hypoxia, etc.',
    'Immunization, Exclusive Breastfeeding, Chemotherapy, etc.'
  ];

  const keys = ['ho', 'rf', 'int'];
  const lookup = {};
  keys.forEach((ky) => { lookup[ky] = data.nodes[ky].data.map((d) => d.id); });

  const content = keys.map((ky, i) => {
    const ids = selected[ky];
    if (ids.length > 0) {
      return ids.map((id) => {
        const idx = lookup[ky].indexOf(id);
        return (
          <Chip
            key={id}
            className="pathway-chip"
            label={data.nodes[ky].data[idx].name}
            onDelete={() => removePathway(
              data.nodes[ky].data[idx].id, data.nodes[ky].data[idx].class)}
          />
        );
      });
    }
    return (
      <div className="pathway-empty-text">
        Examples:
        <br />
        {emptyText[i]}
      </div>
    );
  });

  const cls = ['ho', 'rf', 'int'];
  const items = [];
  cls.forEach((d) => data.nodes[d].data.forEach((a) => items.push({
    id: a.id, name: a.name, type: data.nodes[d].name, class: a.class
  })));

  return (
    <div className="pathway-container" style={{ }}>
      <div className="pathway-header">
        <SearchBox
          items={items}
          handler={addPathway}
          initialText="What are you interested in?"
          checkSuggestion={(item, value) => {
            const escapedValue = escapeRegexCharacters(value.trim());
            const regex = new RegExp(`${escapedValue}`, 'i');
            const isSelected1 = selected.ho.indexOf(item.id) > -1;
            const isSelected2 = selected.rf.indexOf(item.id) > -1;
            const isSelected3 = selected.int.indexOf(item.id) > -1;
            return regex.test(item.name) && !(isSelected1 || isSelected2 || isSelected3);
          }}
          menuWidth={320}
          autofocus={false}
          handleEscape={() => {}}
        />
      </div>
      {/* <div className="filter-column-orfi-text">
      Disease Pathology consists of four main categories: Health Outcomes, Pathogenesis,
      Risk Factors, and Interventions.
      This section connects the links between these categories.
      </div> */}
      <div className="pathways-container" style={{ }}>
        <div className="pathway-section">
          <div className="pathway-section-header">
            <span>Health Outcomes</span>
          </div>
          <div className="pathway-section-content">
            {content[0]}
          </div>
        </div>
        <div className="pathway-section">
          <div className="pathway-section-header">
            <span>Risk Factors</span>
          </div>
          <div className="pathway-section-content">
            {content[1]}
          </div>
        </div>
        <div className="pathway-section">
          <div className="pathway-section-header">
            <span>Interventions</span>
          </div>
          <div className="pathway-section-content">
            {content[2]}
          </div>
        </div>
      </div>
    </div>
  );
};

FilterPathway.propTypes = {
  // windowSize: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  removePathway: PropTypes.func.isRequired,
  addPathway: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  // windowSize: state.windowSize,
  selected: state.selectedORFI,
  pathwayOpen: state.pathwayOpen,
  data: state.networkData.data
});

const mapDispatchToProps = (dispatch) => ({
  toggleFilters: (val, group) => {
    dispatch(setFilters({ val, group, type: 'toggle' }));
  },
  removePathway: (val, group) => {
    dispatch(setSelectedORFI({ val, group, type: 'remove' }));
  },
  addPathway: (obj) => {
    dispatch(setSelectedORFI({ val: obj.id, group: obj.class, type: 'add' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPathway);
