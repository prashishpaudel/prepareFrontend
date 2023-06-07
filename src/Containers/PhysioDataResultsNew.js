/*jslint node: true, esversion:6 */
import React, { Component } from "react";
import { Row } from "react-bootstrap";
import moment from 'moment';
import {
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
  Tooltip,
  Legend,
  Label
} from "recharts";
import axios from "axios";
import backendlink from "../../config/links.js";
import "./PhysioDataResults.css";
import "./PhysioContainer.js";



const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  // return (
  //     <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 1024 1024">
  //       <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z"/>
  //     </svg>
  //   );

  if (payload.instructorSelected == 1) {
    // <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z"/>

    return (
      <circle cx={cx} cy={cy} r="8" fill="#21dbb0" viewBox="0 0 1024 1024" />
    );
  }
  if (payload.nlpSelected == 1) {
    // <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z"/>

    return (
      <circle cx={cx} cy={cy} r="8" fill="#ff87b5" viewBox="0 0 1024 1024" />
    );
  }
  if (payload.instructorEvent == 1) {

    return (

      <svg
        x={cx - 2.5}
        y={cy - 2.5}
        width={7}
        height={7}
        fill="#21dbb0"
        viewBox="0 0 1024 1024"
      >

        <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
      </svg>
    );
  }
  if (payload.nlpEvent == 1) {
    return (

      <svg
        x={cx - 2.5}
        y={cy - 2.5}
        width={7}
        height={7}
        fill="#ff87b5"
        viewBox="0 0 1024 1024"
      >

        <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
      </svg>
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

};

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="graph_tooltip"><p>Time: {moment().startOf('day').seconds(label).format('m:ss')}<br />Value: {parseFloat(payload[0].value).toFixed(3)}</p></div>
    );
  }
  return null;
}

const AxisLabel = ({ axisType, x = -100, y = 10, width, height, stroke, children }) => {
  children = children.replaceAll("_", " ");
  if (children.indexOf('Temperature') !== -1) {
    children += ' (°C)'
  }
  else if (children.indexOf('Heart') !== -1) {
    children += ' (BPM)';
  }
  else if (children.indexOf('Galvanic') !== -1) {
    children += ' (µS)'
  }
  return (
    <text x={x} y={y} transform={'rotate(270)'} textAnchor="middle" stroke={stroke} className="recharts-label">
      {children}
    </text>

  );
};

const LegendComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 30 }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg width={10} height={10} style={{ fill: '#21dbb0' }}>
        <circle cx={5} cy={5} r="5" />
      </svg>
      <span style={{ marginLeft: 5 }}>Instructor Indetified Events</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
      <svg width={10} height={10} style={{ fill: '#ff87b5' }}>
        <circle cx={5} cy={5} r="5" />
      </svg>
      <span style={{ marginLeft: 5 }}>NLP Indetified Events</span>
    </div>
  </div>
);

class PhysioDataResultsNew extends Component {



  constructor(props) {
    // console.log(props);
    super(props);
    this.state = {
      labels: [],
      hamza: 1,
      deviceConnection: null,
      serialNumber: null,
      data: [],
      physioData: null,
      timestamps: null,
      nlpTimeStamps: null,
      selectedTimestamp: null,
      selectedNlpTimestamp: null,
      section: 0,
      loaded: 0
    };
    this.sectionSelection = this.sectionSelection.bind(this);
  }


  componentWillReceiveProps(pp) {

    var physioData = this.state.physioData;
    var timestamps = this.state.timestamps;
    var nlpTimeStamps = this.state.nlpTimeStamps;
    var eventNames = this.state.eventNames;
    var labels = this.state.labels;
    var startTime = pp.startTime;
    var endTime = pp.endTime;
    var selectedTimestamp = pp.selectedTimestamp;
    var selectedNlpTimestamp = pp.selectedNlpTimestamp;
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
          function (response) {
            var check = response.data;
            if (check && check.error) {
              this.setState({
                loaded: 1
              });
            }

            physioData = response.data.data;
            labels = response.data.labels;
            this.setState({
              physioData: physioData,
              eventinfo: pp,
              selectedTimestamp: selectedTimestamp,
              selectedNlpTimestamp: selectedNlpTimestamp,
              timestamps: timestamps,
              nlpTimeStamps: nlpTimeStamps,
              eventNames: eventNames,
              labels: labels,
              loaded: 1
            });
          }.bind(this)
        )
        .catch(function (error) { });
    }

    if (this.state.selectedTimestamp !== pp.selectedTimestamp) {
      this.setState({
        selectedTimestamp: Math.round(selectedTimestamp / 1000)
      });
    }

    // // If selectedNlpTimestamp is single value
    // if (this.state.selectedNlpTimestamp !== pp.selectedNlpTimestamp) {
    //   this.setState({
    //     selectedNlpTimestamp: Math.round(selectedNlpTimestamp / 1000)
    //   });
    // }

    // For array of multiple NLP timestamps value
    // For array of multiple NLP timestamps value
    if (JSON.stringify(this.state.selectedNlpTimestamp) !== JSON.stringify(pp.selectedNlpTimestamp)) {
      if (pp.selectedNlpTimestamp) {
        const roundedTimestamps = pp.selectedNlpTimestamp.map(timestamp => Math.round(timestamp / 1000));
        this.setState({
          selectedNlpTimestamp: roundedTimestamps
        });
      } else {
        this.setState({
          selectedNlpTimestamp: null
        })
      }
    }


  }
  componentDidMount() {

    var pp = this.props;
    var physioData = this.state.physioData;
    var timestamps = this.state.timestamps;
    var nlpTimeStamps = this.state.nlpTimeStamps;
    var eventNames = this.state.eventNames;
    var labels = this.state.labels;

    var startTime = pp.startTime;
    var endTime = pp.endTime;
    var selectedTimestamp = pp.selectedTimestamp;
    var selectedNlpTimestamp = pp.selectedNlpTimestamp;

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
          function (response) {
            var check = response.data;
            if (check && check.error) {
              this.setState({
                loaded: 1
              });
            }
            physioData = response.data.data;
            labels = response.data.labels;


            this.setState({
              physioData: physioData,
              eventinfo: pp,
              selectedTimestamp: selectedTimestamp,
              selectedNlpTimestamp: selectedNlpTimestamp,
              timestamps: timestamps,
              nlpTimeStamps: nlpTimeStamps,
              eventNames: eventNames,
              labels: labels,
              loaded: 1
            });
          }.bind(this)
        )
        .catch(function (error) { });
    }
    if (this.state.selectedTimestamp !== pp.selectedTimestamp) {

      this.setState({
        selectedTimestamp: Math.round(selectedTimestamp / 1000)
      });
    }
    // //If selectedNlpTimestamp is single value
    // if (this.state.selectedNlpTimestamp !== pp.selectedNlpTimestamp) {

    //   this.setState({
    //     selectedNlpTimestamp: Math.round(selectedNlpTimestamp / 1000)
    //   });
    // }

    // For array of multiple NLP timestamps value
    // For array of multiple NLP timestamps value
    if (JSON.stringify(this.state.selectedNlpTimestamp) !== JSON.stringify(pp.selectedNlpTimestamp)) {
      if (pp.selectedNlpTimestamp) {
        const roundedTimestamps = pp.selectedNlpTimestamp.map(timestamp => Math.round(timestamp / 1000));
        this.setState({
          selectedNlpTimestamp: roundedTimestamps
        });
      } else {
        this.setState({
          selectedNlpTimestamp: null
        })
      }
    }


  }

  sectionSelection(ind) {

    this.setState({
      section: ind
    });
  }

  DisplaySideMenu() {
    var labels = this.state.labels;
    var sideMenu = [];
    var section = this.state.section;



    labels.forEach(function (label, index) {
      if (index === section) {
        sideMenu.push(
          <ListGroupItem
            className="Sidemenuphysio383933"
            onClick={() => {
              this.sectionSelection(index);
            }}
          >
            {label.replaceAll("_", " ")}
          </ListGroupItem>
        );
      } else {
        sideMenu.push(
          <ListGroupItem
            onClick={() => {
              this.sectionSelection(index);
            }}
          >
            {label.replaceAll("_", " ")}
          </ListGroupItem>
        );
      }
    }, this);

    return <ListGroup>{sideMenu}</ListGroup>;
  }

  formatYAxisTick(tick) {
    var v = parseFloat(tick).toFixed(3).ToString();
    if (tick.endsWith('000')) {
      v = tick.Substring(0, tick.length - 4)
    }
    return v;
  }

  DisplayPhysioGraph() {

    var labels = this.state.labels;

    var graphs = [];
    var section = this.state.section;
    var physioData = this.state.physioData;


    var startTime = 0;
    if (physioData && physioData.length) {
      startTime = physioData[0].timestamp;
    }
    var eventinfo = this.state.eventinfo;

    var selectedTimestamp = this.state.selectedTimestamp;
    var selectedNlpTimestamp = this.state.selectedNlpTimestamp;
    if (eventinfo && eventinfo.timestamps) {
      eventinfo.timestamps.forEach(function (echTimeStamp, index) {

        var sec = echTimeStamp - startTime;

        physioData[sec].instructorEvent = 1;
        if (selectedTimestamp && selectedTimestamp === echTimeStamp) {
          physioData[sec].instructorSelected = 1;
        } else {
          physioData[sec].instructorSelected = 0;
        }
      });
    }
    console.log('Timestamp Processing', selectedTimestamp)
    console.log('NLPTimestamp Processing', selectedNlpTimestamp)
    if (eventinfo && eventinfo.nlpTimeStamps) {
      eventinfo.nlpTimeStamps.forEach(function (eachNLPTimeStamp, index) {
        if (eachNLPTimeStamp !== 0) {
          var sec = eachNLPTimeStamp - startTime;
          physioData[sec].nlpEvent = 1;
          // if (selectedNlpTimestamp && selectedNlpTimestamp === eachNLPTimeStamp) { //If selectedNlpTimestamp is single value
          if (selectedNlpTimestamp && selectedNlpTimestamp.includes(eachNLPTimeStamp)) {  // For array of multiple NLP timestamps value
            physioData[sec].nlpSelected = 1;
          } else {
            physioData[sec].nlpSelected = 0;
          }
        }
      });
    }

    labels.forEach(function (eachLabel, index) {
      if (index === section) {
        if (physioData && physioData.length) {
        }

        graphs.push(
          <div id="container">
            <center>
              <Row>
                <LegendComponent />
                <LineChart
                  width={600}
                  height={300}
                  data={physioData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                >
                  <XAxis dataKey="second" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(tick) => moment().startOf('day').seconds(tick).format('m:ss')} >
                    <Label value="Time (minutes:seconds)" offset={0 - 10} position="insideBottom" />
                  </XAxis>

                  <YAxis
                    /*    label={{
                          value: eachLabel,
                          angle: -90,
                          position: "insideLeft"
                          
                        }}*/
                    label={<AxisLabel axisType='yAxis'>{eachLabel}</AxisLabel>}
                    type="number"
                    //  domain={[dataMin => (dataMin - Math.round((dataMax - dataMin) * .1)), dataMax => (dataMax + Math.round((dataMax-dataMin) * .1))]}
                    domain={['dataMin', 'dataMax']}

                    tickFormatter={(tick) => parseFloat(tick).toFixed(3)}
                  />
                  <Tooltip content={<CustomTooltip />} />
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
    if (this.state.loaded === 0) {
      return (
        <div>
          <center>
            <h5>PLEASE WAIT - LOADING</h5>
            <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="" />
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

export default PhysioDataResultsNew;
