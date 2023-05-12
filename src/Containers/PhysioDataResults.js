/*jslint node: true, esversion:6 */
import React, { Component } from "react";
import { Row, Grid, Panel, formgroups, Alert } from "react-bootstrap";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  FormGroup,
  FormControl,
  Button,
  InputGroup,
  Glyphicon,
  Col,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
//import './NameForm.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label
} from "recharts";

import Form from "react-bootstrap-form";
import axios from "axios";
import backendlink from "../../config/links.js";

import setAuthorizationToken from "./setAuthorizationToken.js";

import ReactTable from "react-table";
import "./PhysioDataResults.css";
import queryString from "query-string";
import acc from "../img/acc.png";
import hr from "../img/hr.png";

import sweat from "../img/sweat.png";
import temp from "../img/temp.png";

import "./PhysioContainer.js";

const CustomizedDot = React.createClass({
  render() {
    const { cx, cy, stroke, payload, value } = this.props;

    // console.log(payload);
    // return (
    //     <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 1024 1024">
    //       <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z"/>
    //     </svg>
    //   );

    if (payload.selected) {
      // <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z"/>

      return (
        <circle cx={cx} cy={cy} r="6" fill="green" viewBox="0 0 1024 1024" />
      );
    }

    if (payload.event) {
      return (
        <svg
          x={cx - 2.5}
          y={cy - 2.5}
          width={5}
          height={5}
          fill="red"
          viewBox="0 0 1024 1024"
        >
          <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
        </svg>
      );
    }

    if (payload.event && payload.selected && payload.selected == 1) {
      return (
        <circle cx={cx} cy={cy} r="6" fill="green" viewBox="0 0 1024 1024" />
      );
    }

    return (
      <svg
        x={cx - 0.5}
        y={cy - 0.5}
        width={1}
        height={1}
        fill="green"
        viewBox="0 0 1024 1024"
      >
        <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
      </svg>
    );
  }
});

class PhysioDataResults extends Component {
  constructor(props) {
    // console.log(props);
    super(props);
    this.state = {
      hamza: 1,
      deviceConnection: null,
      serialNumber: null,
      data: [],
      physioData: null,
      timestamps: null,
      selectedTimestamp: null,
      section: 0,
      loaded: 0
    };

    this.sectionSelection = this.sectionSelection.bind(this);
  }

  componentWillReceiveProps(pp) {
    var physioData = this.state.physioData;
    var timestamps = this.state.timestamps;
    var startTime = pp.startTime;
    var endTime = pp.endTime;
    var section = pp.section;

    console.log(physioData);
    console.log(pp.deviceConnection);

    var selectedTimestamp = pp.selectedTimestamp;

    if (!physioData) {
      axios.defaults.headers.common["authenticationtoken"] =
        localStorage.jwtToken;
      var params = {};
      params = {};

      //params.deviceConnection=pp.deviceConnection;
      params.serialNumber = pp.serialNumber; //"A015BD";
      params.startTime = startTime - 20000;
      params.endTime = endTime + 20000;

      axios
        .get(backendlink.backendlink + "/getStreamDataResults", {
          params: params
        })
        .then(
          function(response) {
            var check = response.data;
            if (check && check.error) {
              this.setState({
                loaded: 1
              });
            }

            // console.log(physioData);

            physioData = response.data.data;
            this.setState({
              physioData: physioData,
              eventinfo: pp,
              selectedTimestamp: selectedTimestamp,
              timestamps: timestamps,
              loaded: 1
            });
          }.bind(this)
        )
        .catch(function(error) {});
    }

    if (this.state.selectedTimestamp != pp.selectedTimestamp) {
      console.log(selectedTimestamp);

      this.setState({
        selectedTimestamp: Math.round(selectedTimestamp / 1000)
      });
    }
  }
  componentDidMount() {
    var pp = this.props;
    console.log(pp.startTime);

    var physioData = this.state.physioData;
    var timestamps = this.state.timestamps;
    var startTime = pp.startTime;
    var endTime = pp.endTime;
    var section = pp.section;

    var selectedTimestamp = pp.selectedTimestamp;

    if (!physioData) {
      axios.defaults.headers.common["authenticationtoken"] =
        localStorage.jwtToken;
      var params = {};
      params = {};

      params.serialNumber = pp.serialNumber; //"A015BD";
      params.startTime = startTime - 20000;
      params.endTime = endTime + 20000;

      axios
        .get(backendlink.backendlink + "/getStreamDataResults", {
          params: params
        })
        .then(
          function(response) {
            var check = response.data;
            if (check && check.error) {
              this.setState({
                loaded: 1
              });
            }

            // console.log(physioData);

            physioData = response.data.data;
            this.setState({
              physioData: physioData,
              eventinfo: pp,
              selectedTimestamp: selectedTimestamp,
              timestamps: timestamps,
              loaded: 1
            });
          }.bind(this)
        )
        .catch(function(error) {});
    }

    if (this.state.selectedTimestamp != pp.selectedTimestamp) {
      console.log(selectedTimestamp);

      this.setState({
        selectedTimestamp: Math.round(selectedTimestamp / 1000)
      });
    }
  }

  sectionSelection(ind) {
    console.log(ind);

    this.setState({
      section: ind
    });
  }

  DisplaySideMenu() {
    var labels = [
      "HEART_RATE",
      "GSR",
      "RR_INTERVAL",
      "SKIN_TEMPERATURE",
      "accx",
      "accy",
      "accz",
      "BVP"
    ];
    var maps = {
      HEART_RATE: "HEART RATE",
      GSR: "GSR",
      RR_INTERVAL: "RR INTERVAL",
      SKIN_TEMPERATURE: "SKIN TEMPERATURE",
      accx: "ACCX",
      accy: "ACCY",
      accz: "ACCZ",
      BVP: "BVP"
    };
    var sideMenu = [];
    var section = this.state.section;

    labels.forEach(function(label, index) {
      if (index == section) {
        sideMenu.push(
          <ListGroupItem
            className="Sidemenuphysio383933"
            onClick={() => {
              this.sectionSelection(index);
            }}
          >
            {maps[label]}
          </ListGroupItem>
        );
      } else {
        sideMenu.push(
          <ListGroupItem
            onClick={() => {
              this.sectionSelection(index);
            }}
          >
            {maps[label]}
          </ListGroupItem>
        );
      }
    }, this);

    return <ListGroup>{sideMenu}</ListGroup>;
  }

  DisplayPhysioGraph() {
    var labels = [
      "HEART_RATE",
      "GSR",
      "RR_INTERVAL",
      "SKIN_TEMPERATURE",
      "accx",
      "accy",
      "accz",
      "BVP"
    ];
    var maps = {
      HEART_RATE: "HEART RATE",
      GSR: "GSR",
      RR_INTERVAL: "RR INTERVAL",
      SKIN_TEMPERATURE: "SKIN TEMPERATURE",
      accx: "ACCX",
      accy: "ACCY",
      accz: "ACCZ",
      BVP: "BVP"
    };
    var graphs = [];

    var section = this.state.section;

    var physioData = this.state.physioData;

    var startTime = 0;
    if (physioData && physioData.length) {
      startTime = physioData[0].timestamp;
    }

    var eventinfo = this.state.eventinfo;

    var selectedTimestamp = this.state.selectedTimestamp;

    if (eventinfo && eventinfo.timestamps) {
      eventinfo.timestamps.forEach(function(echTimeStamp) {
        var sec = echTimeStamp - startTime;

        physioData[sec].event = 1;

        if (selectedTimestamp && selectedTimestamp == echTimeStamp) {
          physioData[sec].selected = 1;
        } else {
          physioData[sec].selected = 0;
        }
      });
    }

    labels.forEach(function(eachLabel, index) {
      if (index == section) {
        var interval = 3;
        if (physioData && physioData.length) {
          interval = Math.round(physioData.length / 5);
        }

        graphs.push(
          <div id="container">
            <center>
              <Row>
                <br />
                <br />
                <br />
                <br />
                <br />
                <LineChart
                  width={600}
                  height={300}
                  data={physioData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                >
                  <XAxis dataKey="second" interval={interval}>
                    <Label value="Seconds" offset={0} position="insideBottom" />
                  </XAxis>

                  <YAxis
                    label={{
                      value: maps[eachLabel],
                      angle: -90,
                      position: "insideLeft"
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey={eachLabel}
                    strokeWidth={1}
                    stroke="lightgrey"
                    dot={<CustomizedDot />}
                  />
                </LineChart>
              </Row>
            </center>
          </div>
        );
      }
    });

    return graphs;
  }

  render() {
    var physioData = this.state.physioData;
    const play_pause = {
      width: "45px",
      padding: "5px"
    };

    const boxPhysio = {
      border: "1px solid black",
      height: "60px",
      padding: "2px",
      "background-color": "#ffd9cc"
    };

    const data = [
      { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
      { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
      { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
      { name: "Page D", uv: 2780, pv: null, amt: 2000 },
      { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
      { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
      { name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
    ];

    var physioData = this.state.physioData;

    if (this.state.loaded == 0) {
      return (
        <div>
          <center>
            <h5>PLEASE WAIT - LOADING</h5>
            <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" />
          </center>
        </div>
      );
    }

    return (
      <Row className="graph7898393">
        <Col className="sidemenu758392" sm={3}>
          <ListGroup>{this.DisplaySideMenu()}</ListGroup>
        </Col>

        <Col sm={9}>{this.DisplayPhysioGraph()}</Col>
      </Row>
    );
  }
}

export default PhysioDataResults;
