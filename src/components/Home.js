import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import posed from 'react-pose';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Footer from './Footer';
import HeaderNonApp from './HeaderNonApp';
import history from '../history';
import { ui } from '../constants';

const crslItems = [
  {
    title: 'Contextualize the role of immunization',
    desc: 'Explore the extended network of risk factors associated with measles infection in children by contextualizing immunization alongside other potential interventions.',
    link: 'app#from=280&to=5017&nd=&ogm=&ho=ho_15&int=&rf=rf_163,rf_81,rf_19,rf_82,rf_59&cgs=&pnd=',
    index: 1
  },
  {
    title: 'Malnutrition and Cognitive Development',
    desc: 'Explore biological mechanisms linking malnutrition to impaired cognitive development.',
    link: 'app#from=279&to=832&nd=Cognitive&ogm=CNS&ho=&int=&rf=rf_82,rf_151&cgs=&pnd=OG034;ogm;cn;33,OG035;ogm;cn;34,OG036;ogm;cn;35,OG037;ogm;cn;36,GM007;ogm;cn;43,DD304;nd;co;1,DD314;nd;co;11,DD320;nd;co;17,DD325;nd;co;22,rf_151;rf;;58,rf_82;rf;;146,DD338;nd;co;35',
    index: 2
  },
  {
    title: 'Breastfeeding Intervention',
    desc: 'Explore metrics to evaluate a breastfeeding promotion intervention.',
    link: 'app#from=280&to=460&nd=&ogm=Gastrointestinal&ho=ho_2,ho_7,ho_10,ho_18,ho_21,ho_24,ho_26,ho_29&int=int_61&rf=rf_82,rf_1,rf_49,rf_71&cgs=ogm_Gastrointestinal&pnd=GM073;ogm;gi;75,GM081;ogm;gi;83,GM082;ogm;gi;84',
    index: 3
  }
];

const PosedDiv = posed.div({
  state1: { left: 800 * -2 },
  state2: { left: 800 * -1 },
  state3: { left: 800 * -0 },
  state4: { left: 800 * 1 },
  state5: { left: 800 * 2 }
  // visible: { left: prps => (800 * (prps.i - curCrsl)) }
});

const Home = ({
  windowSize
}) => {
  const [curCrsl, setCurCrsl] = useState(0);

  return (
    <div>
      <HeaderNonApp />
      <div
        className="home-container"
        style={{
          width: windowSize.width,
          top: ui.header.height,
          height: windowSize.height - ui.header.height
        }}
      >
        <div
          className="home-image"
          style={{
            height: 420,
            // marginLeft: windowSize.appLeft,
            width: '100%'
          }}
        >
          <div
            className="home-image-inner"
            style={{
              height: 420,
              marginLeft: windowSize.appLeft,
              width: windowSize.appWidth
            }}
          >
            <div className="home-image-text">
              <div className="home-image-text-welcome">
                Welcome to the
              </div>
              <div className="home-image-text-set">
                Seminal Events Timeline
              </div>
              <div className="home-image-text-desc">
                Explore the biological mechanisms of global health problems through seminal events
                of human development from conception to thirteen years of age.
              </div>
            </div>
          </div>
        </div>
        <div className="home-buildvis">
          <div className="home-buildvis-inner" style={{ paddingLeft: windowSize.appLeft }}>
            <div className="home-buildvis-text">Build a visualization</div>
            <IconButton
              classes={{ root: 'home-carousel-button-root' }}
              className="home-buildvis-button"
              aria-label="build"
              onClick={() => history.replace('app')}
            >
              <ArrowForwardIcon />
            </IconButton>
          </div>
        </div>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#F1F2F2"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image1" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">1</div>
            <div className="home-instructions-header">Add Variables</div>
            <div className="home-instructions-text">
              Add categories of events from development across organogenesis,
              growth and maturation, and neurodevelopment.
            </div>
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#FFFFFF"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image2" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">2</div>
            <div className="home-instructions-header">Search Causal Pathways</div>
            <div className="home-instructions-text">
              Search for specific health outcomes, risk factors, and interventions
              and see causal pathways of how a particular event is related to others.
            </div>
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#F1F2F2"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image3" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">3</div>
            <div className="home-instructions-header">Select Age range</div>
            <div className="home-instructions-text">
              See specific periods of development by narrowing the time period of development
              from conception to age 13 years. Adjust by dragging sliders on the timeline
              or selecting a pre-specified range.
            </div>
          </Box>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          bgcolor="#FFFFFF"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexGrow={1} className="home-instructions-image home-instructions-image4" />
          <Box flexGrow={1} className="home-instructions-desc">
            <div className="home-instructions-number">4</div>
            <div className="home-instructions-header">View Details</div>
            <div className="home-instructions-text">
              Expand events to view detailed descriptions, peak ages, detailed references,
              and causal pathway diagrams.
            </div>
          </Box>
        </Box>
        <div
          className="home-carousel-container"
          style={{
            // paddingLeft: windowSize.appLeft,
            // paddingRight: windowSize.appLeft,
            width: '100%'
          }}
        >
          <div
            className="home-carousel-header"
            style={{ paddingLeft: windowSize.appLeft + 50 }}
          >
            Get started with an example visualization
          </div>
          <div
            className="home-carousel-box"
            style={{ width: '100%' }}
          >
            {
              crslItems.map((crsl, i) => (
                <PosedDiv
                  pose={`state${i + 3 - curCrsl}`}
                  className="home-carousel-item"
                  key={crsl.title}
                  style={{ marginLeft: windowSize.appLeft + 50 }}
                >
                  <div className="home-carousel-item-title">{crsl.title}</div>
                  <div className="home-carousel-item-desc">{crsl.desc}</div>
                  <div className="carousel-button">
                    <Button
                      classes={{ label: 'carousel-button-label', root: 'carousel-button-root' }}
                      onClick={() => history.replace(crsl.link)}
                    >
                      Start with visualization
                    </Button>
                  </div>
                </PosedDiv>
              ))
            }
            { curCrsl > 0 && (
              <div className="home-carousel-button-left" style={{ left: windowSize.appLeft + 10 }}>
                <IconButton
                  className="home-carousel-button"
                  aria-label="carousel-left"
                  classes={{ root: 'home-carousel-button-root' }}
                  onClick={() => setCurCrsl(Math.max(0, curCrsl - 1))}
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
            )}
            { curCrsl < crslItems.length - 1 && (
              <div className="home-carousel-button-right" style={{ left: windowSize.appLeft + 811 }}>
                <IconButton
                  className="home-carousel-button"
                  aria-label="carousel-right"
                  classes={{ root: 'home-carousel-button-root' }}
                  onClick={() => setCurCrsl(Math.min(crslItems.length - 1, curCrsl + 1))}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            )}
          </div>
        </div>
        <div
          className="home-methodology"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <div className="home-methodology-text">Read about the methodology</div>
          <IconButton
            className="home-methodology-button"
            aria-label="build"
            onClick={() => history.replace('methodology')}
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>
        <Box
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <div className="home-info-header">Supported By</div>
        </Box>
        <Box
          display="flex"
          flexWrap="nowrap"
          className="home-info"
          style={{ paddingLeft: windowSize.appLeft, paddingRight: windowSize.appLeft }}
        >
          <Box flexBasis={0} flexGrow={1} className="home-info-column">
            <div className="home-info-logo">
              <img src="images/bmgf.png" alt="bmgf" width="250px" />
            </div>
            <div>
              <p>
                Guided by the belief that every life has equal value, the Bill & Melinda
                Gates Foundation works to help all people lead healty, productive lives.
                In developing countries, it focuses on improving people&apos;s health and
                giving them the chance to lift themselves out of hunger and extreme
                poverty. In the United States, it seeks to ensure that all people -
                especially those with the fewest resources - have access to the
                opportunities they need to succeed in school and life.
              </p>
            </div>
          </Box>
          <Box flexBasis={0} flexGrow={1} className="home-info-column">
            <div className="home-info-logo">
              Healthy Birth,
              <br />
              Growth, & Development
            </div>
            <div>
              <p>
                In 2013, the Bill & Melinda Gates Foundation created the Health Birth, Growth,
                and Development program (HBGD) to ensure that all children can regain control
                of their futures, maximize their potential, and have the opportunity to lead
                a healty and productive life.
              </p>
              <p>
                HBGD intends to fill the key knowledge gaps in the field the prevent us from
                knowing how to use our scarce resources to intervene effectively. HBGD is
                organized around a list of key questions, and the answers to these questions
                will help the Foundation and its partners cut through some of the complexity
                and start to reduce the heavy burden of preterm birth, stunting, and
                neurocognitive impairment.
              </p>
            </div>
          </Box>
          <Box flexBasis={0} flexGrow={1} className="home-info-column">
            <div className="home-info-logo">
              <img src="images/hbgdki.png" alt="hbgdki" width="150px" />
            </div>
            <div>
              <p>
                Within HBGD, the knowledge integration initiative (HBGDki) aims to answer the
                key questions by analyzing the large body of data that already exists.
              </p>
              <p>
                Researchers have been studying birth, growth, and development for decades, but
                most of the data they&apos;ve collected are stored on hard drives or in file
                cabinets where no one has access to them. HBGDki has brought a lot of these
                data together in a large and diverse knowledge base. HBGDki is visualizing and
                analyzing the data using state-of-the-art analysis methods and tools to
                generate new insights that will help us answer the key questions.
              </p>
            </div>
          </Box>
        </Box>
        <Footer />
      </div>
    </div>
  );
};

Home.propTypes = {
  windowSize: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  windowSize: state.windowSize
});

// const mapDispatchToProps = dispatch => ({
// });

export default connect(
  mapStateToProps
  // mapDispatchToProps,
)(Home);
