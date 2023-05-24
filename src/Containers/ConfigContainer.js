import React, { useState, useEffect } from 'react';
import { Row, Grid, Col, Nav, NavItem, Tab, Button, Table, Glyphicon, ToggleButton, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import './ConfigContainer.css';
import backendlink from '../../config/links.js';

const ConfigContainer = () => {
  const [configData, setConfigData] = useState([]);
  const [apiData, setApiData] = useState([
    {
      name: 'Lookup Medical Synonymn',
      checkurl: 'http://192.168.1.95:5004',
      active: false,
      openurl: 'http://192.168.1.95:5002/open-medicalSynonyms',
      closeurl: 'http://192.168.1.95:5002/close-medicalSynonyms'
    },
    {
      name: 'Listen Multicast Audio',
      // checkurl: 'http://192.168.1.95:5008/',
      checkurl: 'http://192.168.1.70:5001',
      active: false,
      openurl: 'http://192.168.1.95:5002/open-multicastStream',
      closeurl: 'http://192.168.1.95:5002/close-multicastStream'
    },
    {
      name: 'Online Training',
      checkurl: 'http://192.168.1.95:5006',
      active: false,
      openurl: 'http://192.168.1.95:5002/open-scenarioTraining',
      closeurl: 'http://192.168.1.95:5002/close-scenarioTraining'
    },
    {
      name: 'Event Detection',
      checkurl: 'http://192.168.1.95:5003',
      active: false,
      openurl: 'http://192.168.1.95:5002/open-eventDetection',
      closeurl: 'http://192.168.1.95:5002/close-eventDetection'
    },
    {
      name: 'Whisper Transcribe',
      checkurl: '',
      active: JSON.parse(localStorage.getItem('WhisperTranscribeActive')) || false,
      openurl: 'http://192.168.1.95:5002/open-whisperTranscribe',
      closeurl: 'http://192.168.1.95:5002/close-whisperTranscribe'
    },
  ]);
  // Function to check status of API
  const checkAPIStatus = async (checkurl) => {
    try {
      const res = await fetch(checkurl + '/status-check');
      return res.ok; // Return whether status is OK
    } catch (error) {
      return false;
    }
  };
  // Fetch the status of API

  useEffect(() => {
    apiData.forEach((api, index) => {
      if (api.checkurl) {
        checkAPIStatus(api.checkurl).then((isActive) => {
          setApiData((prevData) => {
            const newData = [...prevData];
            newData[index].active = isActive;
            return newData;
          });
        });
      }
    });
  }, []);

  // Set the status of Whisper Transcribe based on local storage

  // Load 'Whisper Transcribe' active status from local storage on component re-render
  useEffect(() => {
    const storedStatus = localStorage.getItem('WhisperTranscribeActive');
    const whisperTranscribeActive = storedStatus ? storedStatus === 'true' : false;
    setApiData((prevData) => prevData.map((api) =>
      api.name === 'Whisper Transcribe' ? { ...api, active: whisperTranscribeActive } : api
    ));
  }, []);



  useEffect(() => {
    axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
    axios.get(backendlink.backendlink + '/getAudioStream')
      .then(response => {
        const data = response.data.data; // Access the data property of the response's data
        setConfigData(data);
        console.log(data)
      })
      .catch(error => {
        console.log('Error:', error);
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

  // Handle toggle change button for API status:
  const onOffApi = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok; // Return whether status is OK
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
  };


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
                    </span>&nbsp; &nbsp; &nbsp; API Configuration
                  </NavItem>
                </Nav>
              </Col>
              <Col className="mainContent12342" sm={9}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="audioNLP">
                    <form onSubmit={handleSubmit}>
                      <h5><b>Add New Configuration</b></h5>
                      <br />
                      <table>
                        <tbody>
                          <tr>
                            <td width="100" valign="bottom" className="table-cell"><b>Room:</b></td>
                            <td><input type="text" name="room" size="35" required /></td>
                          </tr>
                          <tr>
                            <td width="100" valign="bottom" className="table-cell" ><b>IP:</b></td>
                            <td><input type="text" name="ip" size="35" required /></td>
                          </tr>
                          <tr>
                            <td width="100" valign="bottom" className="table-cell" ><b>Port:</b></td>
                            <td><input type="number" name="port" size="35" required /></td>
                          </tr>
                        </tbody>
                      </table>
                      <br />
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
                    <h4><b>Change API Status</b></h4>
                    <br />
                    <br />
                    <Table striped bordered condensed hover>
                      <thead>
                        <tr>
                          <th className="bold-header">API Name</th>
                          <th className="bold-header">Status</th>
                          <th className="bold-header">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiData.map((api, index) => (
                          <tr key={index}>
                            <td className="bold-cell">{api.name}</td>
                            <td className="bold-cell">{api.active ? "Active" : "Inactive"}</td>
                            <td>
                              <ButtonGroup toggle>
                                <ToggleButton
                                  type="checkbox"
                                  variant={api.active ? "success" : "outline-secondary"}
                                  checked={api.active}
                                  value="1"
                                  onChange={async () => {
                                    const confirmMessage = api.active
                                      ? `Are you sure you want to turn off ${api.name}?`
                                      : `Are you sure you want to turn on ${api.name}?`;
                                    if (window.confirm(confirmMessage)) {
                                      const url = api.active ? api.closeurl : api.openurl;
                                      const responseOk = await onOffApi(url);
                                      if (responseOk) {
                                        const newActiveStatus = !api.active;
                                        setApiData((prevData) => {
                                          const newData = [...prevData];
                                          newData[index].active = newActiveStatus;
                                          // Update local storage if this is the 'Whisper Transcribe' API
                                          if (api.name === 'Whisper Transcribe') {
                                            localStorage.setItem('WhisperTranscribeActive', JSON.stringify(newActiveStatus));
                                          }
                                          return newData;
                                        });
                                      } else {
                                        console.log(`Failed to toggle API at ${url}`);
                                        window.alert('The Script Open Close API is currently down. Please try again once it has been resumed..')
                                      }
                                    }
                                  }}
                                  
                                >
                                  {api.active ? "On" : "Off"}
                                </ToggleButton>


                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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