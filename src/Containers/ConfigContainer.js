/*jslint node: true, esversion:6 */
import React,{useState} from 'react';
import { Row, Grid, Col, Nav, NavItem, Tab } from 'react-bootstrap';
import backendlink from '../../config/links.js';

import './ConfigContainer.css'




const ConfigContainer = () => {






  
  return (
    <Grid className="whiteBackground">
      <Row>
        <Col sm={12}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="myCurriculum">
            <Row className="clearfix">
              <Col className="sidemenu93872" sm={3}>
                <Nav bsStyle="pills" stacked> 
                  <NavItem className="sideMenu1" eventKey="myCurriculum">
                    <span className="sideMenu">
                      <i className="fa fa-list-alt" aria-hidden="true"></i>
                    </span>&nbsp; &nbsp; &nbsp; Event Detection(Audio via NLP)                  </NavItem>
                  <NavItem className="sideMenu1" eventKey="sharedCurriculum">
                    <span className="sideMenu">
                      <i className="fa fa-share-alt" aria-hidden="true"></i>
                    </span>&nbsp; &nbsp; &nbsp; Video Playback
                  </NavItem>
                </Nav>
              </Col>
              <Col className="mainContent12342" sm={9}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="myCurriculum">
                    {/* Your content for "MY SBME Curriculum" goes here */}
                  </Tab.Pane>
                  <Tab.Pane eventKey="sharedCurriculum">
                    {/* Your content for "Shared SBME Curriculum" goes here */}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Grid>
  );
};



export default ConfigContainer;































