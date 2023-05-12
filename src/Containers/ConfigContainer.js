import React, { useState, useEffect } from 'react';
import { Row, Grid, Col, Nav, NavItem, Tab, Button, Table, Glyphicon } from 'react-bootstrap';
import axios from 'axios';
import './ConfigContainer.css';
import backendlink from '../../config/links.js';

const ConfigContainer = () => {
  const [configData, setConfigData] = useState([]);

  useEffect(() => {
    axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
    axios.get(backendlink.backendlink + '/getAudioStream')
      .then(response => {
        const data = response.data.data; // Access the data property of the response's data
        setConfigData(data);
        console.log(data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Add a new configuration to a database
  const handleSubmit = (event) => {
    event.preventDefault();
    const Room = event.target.room.value;
    const Ip = event.target.ip.value;
    const Port = event.target.port.value;

    // Send the new config to the backend
    axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
    axios.post(backendlink.backendlink + '/addAudioStream', { Room, Ip, Port })
      .then(response => {
        // If the backend was successful in adding the config, add it to our local state
        if (response.status === 200) {
          setConfigData([...configData, { Room, Ip, Port }]);
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });

    // Reset the form
    event.target.reset();
  };

  // Delete a specific configuration
  const handleDelete = (configId) => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
      axios.delete(`${backendlink.backendlink}/deleteAudioStream/${configId}`)
        .then(response => {
          // If the backend was successful in deleting the config, remove it from our local state
          if (response.status === 200) {
            setConfigData(configData.filter(config => config.Id !== configId));
          }
        })
        .catch(error => {
          console.log('Error:', error);
        });
    }
  }

  return (
    <Grid className="whiteBackground">
      <Row>
        <Col sm={12}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="audioNLP">
            <Row className="clearfix">
              <Col className="sidemenu93872" sm={3}>
                <Nav bsStyle="pills" stacked>
                  <NavItem className="sideMenu1" eventKey="audioNLP">
                    <span className="sideMenu">
                      <Glyphicon glyph="list-alt" />
                    </span>&nbsp; &nbsp; &nbsp; Event Detection(Audio via NLP)
                  </NavItem>
                  <NavItem className="sideMenu1" eventKey="videoPlayback">
                    <span className="sideMenu">
                      <Glyphicon glyph="share-alt" />
                    </span>&nbsp; &nbsp; &nbsp; Video Playback
                  </NavItem>
                </Nav>
              </Col>
              <Col className="mainContent12342" sm={9}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="audioNLP">
                    <form onSubmit={handleSubmit}>
                      <h5><b>Add New Configuration</b></h5>
                      <br/>
                      <table>
                        <tbody>
                        <tr>
                          <td width="100" valign="bottom" className="table-cell"><b>Room:</b></td>
                          <td><input type="text" name="room" size="35" required/></td>
                        </tr>
                        <tr>
                          <td width="100" valign="bottom"className="table-cell" ><b>IP:</b></td>
                          <td><input type="text" name="ip" size="35" required/></td>
                        </tr>
                        <tr>
                          <td width="100" valign="bottom"className="table-cell" ><b>Port:</b></td>
                          <td><input type="number" name="port" size="35" required/></td>
                        </tr>
                        </tbody>
                      </table>
                      <br/>
                      <Button className="btn-success" type="submit">Add Config</Button>
                    </form>
                    <br />
                    <Table striped bordered condensed hover>
                      <thead>
                        <tr>
                          <th className="bold-header">Room</th>
                          <th className="bold-header">IP</th>
                          <th className="bold-header">Port</th>
                          <th className="bold-header">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {configData && configData.map((config, index) => (
                          <tr key={index}>
                            <td className="bold-cell">{config.Room}</td>
                            <td className="bold-cell">{config.Ip}</td>
                            <td className="bold-cell">{config.Port}</td>
                            <td>
                              <Button className="btn-danger" onClick={() => handleDelete(config.Id)}>Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab.Pane>
                  <Tab.Pane eventKey="videoPlayback">
                    {/* Your content for "videoPlayback" goes here */}
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