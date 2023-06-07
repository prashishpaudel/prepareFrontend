/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid } from 'react-bootstrap';
import { Tabs, Tab, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
//import './NameForm.css'; 
import axios from 'axios';
import backendlink from '../../config/links.js';
import CircularProgressbar from 'react-circular-progressbar';
import PhysioDataResults from './PhysioDataResultsNew.js'
import ReactTable from 'react-table';
import './specificresultscontainer.css'
import queryString from 'query-string';
import { Player } from 'video-react';

import "../../node_modules/video-react/dist/video-react.css";
import './RunContainer.css';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

import './specificresultscontainer.css'
var ts = require("timeseries-analysis");



class SpecificResultsContainer extends Component {

	constructor(props) {
		super(props);



		var query = queryString.parse(this.props.match.location.search);

		this.state = {
			deviceConnection: null,
			section: 0,
			playvids: [],
			serialNumber: null,
			vidSelected: 0,
			histSkillsDetails: {},
			histSpecificSkillsDetails: {},
			histEventsDetails: {},
			actual: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1],
			occured: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1],
			nlpOccured: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1],
			traineeHist: [],
			avgSkillPoints: {
				behavioral: -1,
				cognitive: -1,
				psychomotor: -1
			},
			play_id: query.play_id,
			lastname: query.lastname,
			table: {
				sort: {
					column: "age",
					order: "desc"
				},
				columns: [
					{
						Header: 'SCENARIO_NAME',
						accessor: 'SCENARIO_NAME'
					},
					{
						Header: 'Observer Name',
						accessor: 'Observer Name'
					},
					{
						Header: 'TRAINEE Name',
						accessor: 'TRAINEE Name'
					},

					{
						Header: 'EVENT_NAME',
						accessor: 'EVENT_NAME'
					},
					{
						Header: 'SKILL_TYPE',
						accessor: 'SKILL_TYPE'
					},
					{
						Header: 'SPECIFIC_SKILL',
						accessor: 'SPECIFIC_SKILL'
					},
					{
						Header: 'HEART_RATE',
						accessor: 'HEART_RATE'
					},
					{
						Header: 'SYSTOLIC_BP',
						accessor: 'SYSTOLIC_BP'
					},
					{
						Header: 'DISTOLIC_BP',
						accessor: 'DISTOLIC_BP'
					},
					{
						Header: 'SYSTOLIC_BP',
						accessor: 'SYSTOLIC_BP'
					},
					{
						Header: 'SPO2',
						accessor: 'SPO2'
					},
					{
						Header: 'R_RATE',
						accessor: 'R_RATE'
					},
					{
						Header: 'CARDIAC_RYTHM',
						accessor: 'CARDIAC_RYTHM'
					},
					{
						Header: 'POINTS',
						accessor: 'POINTS'
					},
					{
						Header: 'PREDICTED_TEXT',
						accessor: 'PREDICTED_TEXT'
					}

				],
				rows: [

				],
				comments: [

				]
			}


		};

		this.play = this.play.bind(this);
		this.sectionSelection = this.sectionSelection.bind(this);

	}
	componentDidMount() {
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		var params = {
			play_id: this.state.play_id,
			lastname: this.state.lastname
		}

		axios.get(backendlink.backendlink + '/speceficresults', {
			params: params
		})
			.then(function (response) {



				var check = response.data;
				console.log('This is total reponse data',check)



				var traineeHist = [];
				if (check && check.error) {
					window.location.href = "./login?message=" + check.message;
				}
				var tables = this.state.table;
				var data = response.data.playOutput;
				var timestampsEvents = [];
				var nlpTimeStampsEvents = [];
				var eventNames = [];
				var comm = response.data.comments;



				var playvids = check.vidList;




				data.forEach(function (da) {
					if (!da.TIME) {
						da.TIME = 0;
					}
					if (!da.TIMESTAMP) {
						da.TIMESTAMP = 0;
					}
					if (!da.NLP_TIMESTAMP) {
						da.NLP_TIMESTAMP = 0;
					}

					da.TIME = parseInt(da.TIME, 10);
					da.TIMESTAMP = parseInt(da.TIMESTAMP, 10);
					da.NLP_TIMESTAMP = parseInt(da.NLP_TIMESTAMP, 10);
					timestampsEvents.push(Math.round(da.TIMESTAMP / 1000));
					nlpTimeStampsEvents.push(Math.round(da.NLP_TIMESTAMP / 1000));
					eventNames.push(da.EVENT_NAME);

					

				});



				var deviceConnection = 0;
				var serialNumber = [];


				serialNumber = response.data.connectedDevices;

			



				data = JSON.parse(JSON.stringify(data.sort(function (a, b) { return a.TIME - b.TIME })));

				data.forEach(function (eachdata, index) {
					eachdata['idlabel'] = index;
				});


				var occured = JSON.parse(JSON.stringify(data.sort(function (a, b) { return a.TIMESTAMP - b.TIMESTAMP })));
				var nlpOccured = JSON.parse(JSON.stringify(data.sort(function (a, b) { return a.NLP_TIMESTAMP - b.NLP_TIMESTAMP })));
				var actual = JSON.parse(JSON.stringify(data.sort(function (a, b) { return a.TIME - b.TIME })));
				console.log('Occured',occured)
				console.log('Actual',actual)




				tables.rows = data;



				if (response && response.data && response.data.histDetails && response.data.histDetails.length > 0) {
					traineeHist = response.data.histDetails;
				}





				var histSkillsDetails = {};
				var histSpecificSkillsDetails = {};
				var histEventsDetails = {};

				if (response && response.data && response.data.histSkillsDetails && response.data.histSkillsDetails.length > 0) {
					var histSkillsDetailsArr = response.data.histSkillsDetails;
					histSkillsDetailsArr.forEach(function (pointData) {
						if (!histSkillsDetails[pointData['skill_type']]) {
							histSkillsDetails[pointData['skill_type']] = [];
						}
						histSkillsDetails[pointData['skill_type']].push(pointData.points);
					});
				}
				console.log('This is histSkillsDetails',histSkillsDetails)
				console.log('This is histSpecificSkillsDetails',histSpecificSkillsDetails)
				console.log('This is histEventsDetails',histEventsDetails)


				if (response && response.data && response.data.histSpecificSkillsDetails && response.data.histSpecificSkillsDetails.length > 0) {
					var histSpecificSkillsDetailsArr = response.data.histSpecificSkillsDetails;
					histSpecificSkillsDetailsArr.forEach(function (pointData) {
						if (!histSpecificSkillsDetails[pointData['specific_skill']]) {
							histSpecificSkillsDetails[pointData['specific_skill']] = [];
						}
						histSpecificSkillsDetails[pointData['specific_skill']].push(pointData.points);
					});
				}


				if (response && response.data && response.data.histEventsDetails && response.data.histEventsDetails.length > 0) {
					var histEventsDetailsArr = response.data.histEventsDetails;
					histEventsDetailsArr.forEach(function (pointData) {
						if (!histEventsDetails[pointData['event_name']]) {
							histEventsDetails[pointData['event_name']] = [];
						}
						histEventsDetails[pointData['event_name']].push(pointData.points);
					});
				}




				var psychomotor = 0;
				var cognitive = 0;
				var behavioral = 0;
				var psychomotorCount = 0;
				var cognitiveCount = 0;
				var behavioralCount = 0;

				data.forEach(function (row) {

					if (row.SKILL_TYPE === 'psychomotor') {
						psychomotor += parseInt(row.POINTS, 10);
						psychomotorCount += 1;
					}
					if (row.SKILL_TYPE === 'cognitive') {
						cognitive += parseInt(row.POINTS, 10);
						cognitiveCount += 1;
					}
					if (row.SKILL_TYPE === 'behavioral') {
						behavioral += parseInt(row.POINTS, 10);
						behavioralCount += 1;
					}
				});
				var avgSkillPoints = {}
				if (psychomotorCount > 0) {
					avgSkillPoints.psychomotor = (psychomotor / psychomotorCount);

				} else {
					avgSkillPoints.psychomotor = -1;
				}

				if (behavioralCount > 0) {
					avgSkillPoints.behavioral = (behavioral / behavioralCount);
				} else {
					avgSkillPoints.behavioral = -1;
				}
				if (cognitiveCount > 0) {
					avgSkillPoints.cognitive = (cognitive / cognitiveCount);
				} else {
					avgSkillPoints.cognitive = -1;
				}





				
				this.setState({
					table: tables,
					avgSkillPoints: avgSkillPoints,
					traineeHist: traineeHist,
					actual: actual,
					occured: occured,
					nlpOccured:nlpOccured,
					histSkillsDetails: histSkillsDetails,
					histSpecificSkillsDetails: histSpecificSkillsDetails,
					histEventsDetails: histEventsDetails,
					deviceConnection: deviceConnection,
					serialNumber: serialNumber,
					timestampsEvents: timestampsEvents,
					nlpTimeStampsEvents: nlpTimeStampsEvents,
					eventNames: eventNames,
					playvids: playvids,
					comments: comm
				});

		


			}.bind(this))
			.catch(function (error) {

			});
	}








	displaySkills(datas) {



		var graphs = [];
		var ph = 3;

		Object.keys(datas).forEach(function (skill) {
			if (skill !== "null") {
				if (datas[skill].length > 3) {
					var temp = [];
					var skilly = "Actual";
					var skilly1 = "Predictions";
					var skillx = "Times";



					var forecasts = [];
					var data = JSON.parse(JSON.stringify(datas[skill]));



					for (var j = 0; j < ph; j++) {

						var t = new ts.main(ts.adapter.fromArray(data));

						// // We're going to forecast the 11th datapoint


						// // We calculate the AR coefficients of the 10 previous points
						var coeffs = t.ARMaxEntropy({
							data: t.data.slice(data.length - 3, data.length),
							degree: 2
						});




						// Now, we calculate the forecasted value of that 11th datapoint using the AR coefficients:
						var forecast = 0;
						// // Init the value at 0.
						for (var i = 0; i < coeffs.length; i++) { // Loop through the coefficients
							forecast -= t.data[data.length - i - 1][1] * coeffs[i];
							// Explanation for that line:
							// t.data contains the current dataset, which is in the format [ [date, value], [date,value], ... ]
							// For each coefficient, we substract from "forecast" the value of the "N - x" datapoint's value, multiplicated by the coefficient, where N is the last known datapoint value, and x is the coefficient's index.
						}
						data.push(forecast)
						forecasts.push(forecast);


					}


					var dataWithForecast = datas[skill].concat(forecasts);




					dataWithForecast.forEach(function (eachdata, index) {
						var temp1 = {};
						if (index < datas[skill].length) {
							temp1[skilly] = eachdata;
						}

						if (index >= datas[skill].length - 1) {
							temp1[skilly1] = eachdata
						}




						temp1[skillx] = index;
						temp.push(temp1);
					})


					graphs.push(
						<Col className='whi2' sm={12}>
							<br />
							<br />

							<b> {skill.toUpperCase()} ANALYSIS</b>
							<LineChart width={400} height={330} data={temp}
								margin={{ top: 30, right: 0, left: 0, bottom: 20 }}>
								<XAxis label={{ value: "# of Sessions", position: 'insideBottomRight', offset: 0 }} dataKey={skillx} />
								<YAxis label={{ value: " Points(1-100)", angle: -90, position: 'insideLeft' }} />
								<createClasssianGrid />
								<Tooltip />
								<Legend verticalAlign="middle" layout="horizontal" align="right" />

								<Line type="monotone" dataKey={skilly1} stroke="#ef131e" />
								<Line type="monotone" dataKey={skilly} stroke="#8884d8" />
								<ReferenceLine y={90} label="Expert" stroke="red" />



							</LineChart>

						</Col>

					);
				}



			}







		});


		return (
			<Row>
				{graphs}

			</Row>
		)
	}






	trendAnalysis() {


		var histSkillsDetails = this.state.histSkillsDetails;
		var histSpecificSkillsDetails = this.state.histSpecificSkillsDetails;
		var histEventsDetails = this.state.histEventsDetails;




		return (
			<Row>
				<Col sm={12}>
					<center>
						<Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
							<Tab eventKey={1} title="Skills Analysis">
								{this.displaySkills(histSkillsDetails)}
							</Tab>
							<Tab eventKey={2} title="Specific Skills Analysis">
								{this.displaySkills(histSpecificSkillsDetails)}
							</Tab>
							<Tab eventKey={3} title="Events Analysis">
								{this.displaySkills(histEventsDetails)}
							</Tab>
						</Tabs>
					</center>
				</Col>
			</Row>

		);
	}



	showInstructorComments() {
		var comm = this.state.comments;
		var rowsHtml = [];
		rowsHtml.push(
			<Row className="rowHeader12321151">
				<Col className="headercell134321" sm={4} >
					<b>Created at</b>
				</Col>

				<Col className="headercell134321" sm={8}>
					<b>Comment</b>
				</Col>

			</Row>

		);


		comm.forEach(function (eachRow) {
			var dte = new Date(eachRow['CREATED_AT']);
			var dteString = (dte.getMonth() + 1) + '/' + dte.getDate() + '/' + dte.getFullYear();
			console.log(dteString);
			rowsHtml.push(
				<Row className="row12321151">
					<Col className="cell134321" sm={4}>
						<b>{dteString}</b>
					</Col>
					<Col className="cell134321" sm={8}>
						<b>{eachRow['COMMENT']}</b>
					</Col>
				</Row>
			)
		});

		return (

			<div>

				{rowsHtml}

			</div>


		);
	}




	displayGraph() {
		var avgData = [];
		var psychomotorData = [];
		var behavioralData = [];
		var cognitiveData = [];
		var barData = this.state.traineeHist;






		barData.forEach(function (eachdata) {
			if (eachdata.PSYCHOMOTOR_AVG) {
				eachdata.PSYCHOMOTOR_AVG = parseInt(eachdata.PSYCHOMOTOR_AVG, 10);
			} else {
				eachdata.PSYCHOMOTOR_AVG = 0;
			}
			if (eachdata.BEHAVIORAL_AVG) {
				eachdata.BEHAVIORAL_AVG = parseInt(eachdata.BEHAVIORAL_AVG, 10);
			} else {
				eachdata.BEHAVIORAL_AVG = 0;
			}
			if (eachdata.TOTAL_AVG) {
				eachdata.TOTAL_AVG = parseInt(eachdata.TOTAL_AVG, 10);
			} else {
				eachdata.TOTAL_AVG = 0;
			}
			if (eachdata.COGNITIVE_AVG) {
				eachdata.COGNITIVE_AVG = parseInt(eachdata.COGNITIVE_AVG, 10);
			} else {
				eachdata.COGNITIVE_AVG = 0;
			}
			var temp = {};
			if (eachdata.TOTAL_AVG > 0) {
				temp.totalPoints = eachdata.TOTAL_AVG;
				temp.scenario = avgData.length;
				avgData.push(temp);
			}
			temp = {};
			if (eachdata.PSYCHOMOTOR_AVG > 0) {
				temp.psychomotorPoints = eachdata.PSYCHOMOTOR_AVG;
				temp.scenario = psychomotorData.length;
				psychomotorData.push(temp);
			}
			temp = {};
			if (eachdata.BEHAVIORAL_AVG > 0) {
				temp.behavioralPoints = eachdata.BEHAVIORAL_AVG;
				temp.scenario = behavioralData.length;
				behavioralData.push(temp);
			}

			temp = {};
			if (eachdata.COGNITIVE_AVG > 0) {
				temp.cognitivePoints = eachdata.COGNITIVE_AVG;
				temp.scenario = cognitiveData.length;
				cognitiveData.push(temp);
			}


		});



		if (barData.length > 0) {

			return (

				<Row>
					<Row>
						<Col sm={6}>
							<center>

								<LineChart width={300} height={150} data={cognitiveData}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<XAxis dataKey="scenario" />
									<YAxis />
									<CartesianGrid strokeDasharray="3 3" />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="cognitivePoints" stroke="#8884d8" activeDot={{ r: 8 }} />

								</LineChart>
							</center>


						</Col>
						<Col sm={6}>
							<center>
								<LineChart width={300} height={150} data={behavioralData}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<XAxis dataKey="scenario" />
									<YAxis />
									<CartesianGrid strokeDasharray="3 3" />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="behavioralPoints" stroke="#8884d8" activeDot={{ r: 8 }} />

								</LineChart>
							</center>
						</Col>

					</Row>
					<br />
					<br />
					<Row>
						<Col sm={6}>
							<center>
								<LineChart width={300} height={150} data={psychomotorData}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<XAxis dataKey="scenario" />
									<YAxis />
									<CartesianGrid strokeDasharray="3 3" />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="psychomotorPoints" stroke="#8884d8" activeDot={{ r: 8 }} />

								</LineChart>
							</center>
						</Col>
						<Col sm={6}>
							<center>
								<LineChart width={300} height={150} data={avgData}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<XAxis dataKey="scenario" />
									<YAxis />
									<CartesianGrid strokeDasharray="3 3" />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="totalPoints" stroke="#8884d8" activeDot={{ r: 8 }} />

								</LineChart>
							</center>
						</Col>
					</Row>




				</Row>


			);
		}
		return (
			<div>data</div>
		);






	}
	highlighti(id) {
		var highlight = id;
		var actual = this.state.actual;
		var selectedTimestamp = 0;
		var selectedNlpTimestamp = 0;



		actual.forEach(function (eachActual) {
			if (eachActual.ID === id) {

				selectedTimestamp = eachActual.TIMESTAMP;

			}
		});
		actual.forEach(function (eachActual) {
			if (eachActual.ID === id) {

				selectedNlpTimestamp = eachActual.NLP_TIMESTAMP;

			}
		});




		this.setState({
			highlight: highlight,
			selectedTimestamp: selectedTimestamp,
			selectedNlpTimestamp:selectedNlpTimestamp

		});

	}

	ale() {


	}



	displaySequenceActual() {

		/*	var actual=this.state.actual;
	
	
			var individualResult=[];
			var that = this;
	
	
			if(actual && actual.length>0){
				var start =actual[0].ID;
	
				var min=100000000000000;
				actual.forEach(function(data,index) {
					min		
				});
			
				actual.forEach(function(data,index) {
					individualResult.push(
						<span>&nbsp;<button onClick={() => that.highlighti(data.ID)} className="btn btn-info btn-circle">{data.idlabel+1}</button>&nbsp;&nbsp;&nbsp;</span>
				
					);		
				});
			}
	
			return(
	
					<div>
					{individualResult}
					</div>
			);
			*/
	}


	displaySequenceOccured() {

		var actual = this.state.occured;

		var individualResult = [];
		var that = this;


		if (actual && actual.length > 0) {
			actual.forEach(function (data, index) {

				if (index !== data.idlabel) {
					individualResult.push(

						<span><button onClick={() => that.highlighti(data.ID)} className="btn btn-incorrect btn-circle" >{data.idlabel + 1}</button>&nbsp;&nbsp;&nbsp;</span>
					);
				}
				else {
					individualResult.push(

						<span><button onClick={() => that.highlighti(data.ID)} className="btn btn-correct btn-circle" >{data.idlabel + 1}</button>&nbsp;&nbsp;&nbsp;</span>
					);
				}


			});
		}

		return (

			<div>
				{individualResult}
			</div>
		);
	}










	displaySequence() {
		var individualResult = [];
		var datas = this.state.table.rows;
		var highlight = -1;
		if (this.state.highlight) {
			highlight = this.state.highlight;
		}
		if (datas.length > 0) {
			datas.forEach(function (data) {
				var cla = 'score';
				if (data.ID === highlight) {
					cla = 'selected';
					individualResult.push(
						<Col className={cla} sm={12}>
							<div >
								<Row>
									<span className="event-number">{data.idlabel + 1}</span>
									<Col sm={8}>

										<h6>
											<b><span className='heading'>Event Name:</span> </b> <br /><b>{data.EVENT_NAME}</b>
										</h6>
										<h6>
											<span className='heading'>Skill: </span><br />{data.SKILL_TYPE} <br />
										</h6>
										<h6>
											<span className='heading'>Specific Skill: </span><br />{data.SPECIFIC_SKILL}
										</h6>
										<h6>
											<span className='heading'>Predicted Text: </span><br />{data.PREDICTED_TEXT}
										</h6>


									</Col>
									<Col sm={4}>
										<br />
										<br />
										<br />
										<div className='inside'>
											<CircularProgressbar percentage={data.POINTS} />
										</div>
									</Col>
								</Row>
							</div>
						</Col>
					);

				}


			});


		}







		return (
			<Row>

				<Col sm={4}>
					<div>
						{individualResult}
					</div>
				</Col>

				<Col sm={8}>
					<div>

						<center>
							<span className="event-heading">Sequence of Events:</span><br /><br />{this.displaySequenceOccured()}

						</center>
						<br />
						<br />
						<br />
					</div>
				</Col>
			</Row>
		);


	}

	displayIndividual() {
		var individualResult = [];
		var datas = this.state.table.rows;
		var highlight = -1;
		if (this.state.highlight) {
			highlight = this.state.highlight;
		}
		if (datas.length > 0) {
			datas.forEach(function (data) {
				var cla = 'score';
				if (data.ID === highlight) {
					cla = 'selected';

				}
				individualResult.push(
					<Col className={cla} sm={4}>
						<div >
							<Row>
								<span className="event-number">{data.idlabel + 1}</span>
								<Col sm={8}>

									<h6>
										<b><span className='heading'>Event Name:</span> </b> <br /><b>{data.EVENT_NAME}</b>
									</h6>

									<h6>
										<span className='heading'>Skill: </span><br />{data.SKILL_TYPE} <br />
									</h6>
									<h6>
										<span className='heading'>Specific Skill: </span><br />{data.SPECIFIC_SKILL}
									</h6>
									<h6>
										<span className='heading'>Specific Skill: </span><br />{data.SPECIFIC_SKILL}
									</h6>


								</Col>
								<Col sm={4}>
									<br />
									<br />
									<br />
									<div className='inside'>
										<CircularProgressbar percentage={data.POINTS} />
									</div>
								</Col>
							</Row>
						</div>
					</Col>
				);

			});
			return (
				<div>
					{individualResult}
				</div>
			);

		}
		return (
			<div></div>
		);

		//individualResult.push(<h6>{data.EVENT_NAME}</h6>)


	}

	fileChangedHandler = (event) => {
	}


	state = { selectedFile: null }

	fileChangedHandler = (event) => {
		this.setState({ selectedFile: event.target.files[0] })
	}

	uploadHandler = () => {
		const formData = new FormData()


		formData.append('myFile', this.state.selectedFile, this.state.play_id)

		axios.post('http://localhost:1338/fileUpload', formData, {
			onUploadProgress: progressEvent => {
				console.log(progressEvent.loaded / progressEvent.total)
			}
		}).then(function (response) {
			var check = response.data;
			console.log(check);

			this.setState({
				playvids: check.data
			})


		}.bind(this))
			.catch(function (error) {

			});

	}


	displayReportHeader() {
		var datas = this.state.table.rows;

		var sNumber = '';

		if ((this.state.serialNumber == null)) {
			sNumber = "N/A";

		}

		else if ((this.state.serialNumber.length === 0)) {
			sNumber = "N/A";
		}

		else {
			sNumber = this.state.serialNumber[0].SERIALNUMBER;
		}

		if (datas.length > 0) {
			var totalScore = 0;
			datas.forEach(function (data) {
				totalScore += parseInt(data.POINTS,10);

			});



			var avgScore = Math.round(totalScore / datas.length);
			return (
				<div>



					<Row>
						<Col sm={6}>
							<left>
								<h6>
									<b>Scenario Name</b><br />
									{datas[0].SCENARIO_NAME}
								</h6>
								<h6>
									<b>Category</b><br />
									{datas[0].CATEGORY}
								</h6>
							</left>

							<left>
								<h6>
									<b>Trainee Name</b><br />
									{datas[0]["TRAINEE Name"]}
								</h6>
							</left>
							<left>
								<h6>
									<b>Device</b><br />
									{sNumber}
								</h6>
							</left>
						</Col>

						<Col sm={6}>
							<left>
								<h6>
									<b>Observer Name</b><br />
									{datas[0]["Observer Name"]}
								</h6>
								<h6>
									<b>Average Score</b><br />
									{avgScore}
								</h6>
								<h6>
									<b>Expertise Level</b><br />
									N/A
								</h6>
							</left>
						</Col>

					</Row>
				</div>
			);

		}
		return (
			<h4 className='heading'>Results</h4>
		);
	}


	handleStateChange(state, prevState) {
		// copy player state to this component's state
		this.setState({
			player: state
		});
	}

	sectionSelection(ind) {

		this.setState({
			section: ind,
			player: this.state.player,
			deviceConnection: this.state.deviceConnection
		})

	}

	play(ind) {

		this.setState({
			vidSelected: ind
		})
		this.refs.player.load();

	}

	onChildButtonClick(val) {
		console.log(val);
	}


	lis() {

		var lis = [];
		var playvids = this.state.playvids;
		var vidSelected = this.state.vidSelected;

		playvids.forEach(function (data, ind) {


			if (vidSelected === ind) {
				lis.push(
					<ListGroupItem className="vidList vidSelected" onClick={() => { this.play(ind) }}>{data.NAME}</ListGroupItem>
				);

			} else {
				lis.push(
					<ListGroupItem className="vidList" onClick={() => { this.play(ind) }}>{data.NAME}</ListGroupItem>
				);

			}



		}, this)


		return (
			<div>
				{lis}
			</div>
		)


	}

	displayVids() {

		var playvids = this.state.playvids;
		var vidSelected = this.state.vidSelected;
		this.items = this.state.playvids;






		var path = "";

		for (var i = 0; i < playvids.length; i++) {

			if (vidSelected === i) {

				path = playvids[i].PATH;
			}




		}



		return (
			<div className="Youtube">
				<Row>
					<Col sm={12}>
						<br />
					</Col>

					<Col sm={3}>
						{this.displayReportHeader()}
						<br />
						<br />
						<input type="file" onChange={this.fileChangedHandler} />
						<button onClick={this.uploadHandler}>Upload!</button>
					</Col>
					<Col sm={6}>
						<Player ref="player">
							<source src={"http://localhost:1338/" + path} />
						</Player>
					</Col>
					<Col sm={3}>

						{this.lis()}


					</Col>
				</Row>
			</div>

		)
	}







	render() {

		var startTime = 0;
		var endTime = 0

		var section = this.state.section;
		if (this.state.occured && this.state.occured.length > 0) {
			startTime = this.state.occured[0].TIMESTAMP;
			endTime = this.state.occured[this.state.occured.length - 1].TIMESTAMP
		}

		const AverageSkills = (props)=>({
			render() {
				return (
					<CircularProgressbar percentage={this.props.data} />
				);

				// if (this.props.data != -1) {


				// 	return (
				// 		<CircularProgressbar percentage={this.props.data} />
				// 	);
				// }

				// return (
				// 	<center className='CircularProgressbar-path'><h1>N/A</h1></center>
				// );

			}
		})
		var mainSection = [];

		var sideSection = [];

		if (section === 0) {
			mainSection.push(
				<Row>
					<Col sm={4}>

						<center><AverageSkills data={Math.round(this.state.avgSkillPoints.behavioral)} /></center>
						<center><h6>Behavioral Skills</h6></center>

					</Col>
					<Col sm={4}>
						<center><AverageSkills data={Math.round(this.state.avgSkillPoints.psychomotor)} /></center>
						<center><h6>Psychomotor Skills</h6></center>

					</Col>
					<Col sm={4}>
						<center><AverageSkills data={Math.round(this.state.avgSkillPoints.cognitive)} /></center>
						<center><h6>Cognitive Skills</h6></center>
					</Col>
				</Row>
			)

			sideSection.push(
				<ListGroupItem className="sideMenuCellCssSelected" onClick={() => { this.sectionSelection(0) }}><span className="sideMenuCellCssSelected">SBME Summary</span></ListGroupItem>
			)

		} else {
			sideSection.push(
				<ListGroupItem className="sideMenuCellCss" onClick={() => { this.sectionSelection(0) }}><span className="sideMenuCellCss">SBME Summary</span></ListGroupItem>
			)
		}

		if (section === 1) {
			mainSection.push(
				<Row>
					{this.displaySequence()}
					{this.displayIndividual()}
				</Row>

			)

			sideSection.push(

				<ListGroupItem className="sideMenuCellCssSelected" onClick={() => { this.sectionSelection(1) }}><span className="sideMenuCellCssSelected">Instructor Summary</span></ListGroupItem>

			)



		} else {
			sideSection.push(

				<ListGroupItem className="sideMenuCellCss" onClick={() => { this.sectionSelection(1) }}><span className="sideMenuCellCss">Instructor Summary</span></ListGroupItem>

			)
		}

		if (section === 2) {
			mainSection.push(
				<Row>
					<ReactTable
						columns={this.state.table.columns}
						data={this.state.table.rows}
						defaultFilterMethod={(filter, row) => (String(row[filter.id]) === filter.value)}
					/>

				</Row>
			)

			sideSection.push(
				<ListGroupItem className="sideMenuCellCssSelected" onClick={() => { this.sectionSelection(2) }}><span className="sideMenuCellCssSelected">Instructor Assessment Table</span></ListGroupItem>

			)

		} else {

			sideSection.push(
				<ListGroupItem className="sideMenuCellCss" onClick={() => { this.sectionSelection(2) }}><span className="sideMenuCellCss">Instructor Assessment Table</span></ListGroupItem>

			)

		}


		if (section === 3) {

			var serialNumber = this.state.serialNumber;
			for (var i = 0; i < serialNumber.length; i++) {
				mainSection.push(
					<Row>
						{this.displaySequence()}
						<br/>
						<PhysioDataResults section={section} startTime={startTime} endTime={endTime} deviceConnection={this.state.deviceConnection} serialNumber={serialNumber[i].SERIALNUMBER} timestamps={this.state.timestampsEvents} nlpTimeStamps={this.state.nlpTimeStampsEvents} eventNames={this.state.eventNames} selectedTimestamp={this.state.selectedTimestamp} selectedNlpTimestamp={this.state.selectedNlpTimestamp} />

					</Row>
				)
			}

			sideSection.push(
				<ListGroupItem className="sideMenuCellCssSelected" onClick={() => { this.sectionSelection(3) }}><span className="sideMenuCellCssSelected">Learner Physiological Data</span></ListGroupItem>
			)

		} else {
			sideSection.push(
				<ListGroupItem className="sideMenuCellCss" onClick={() => { this.sectionSelection(3) }}><span className="sideMenuCellCss">Learner Physiological Data</span></ListGroupItem>
			)
		}

		if (section === 5) {
			mainSection.push(
				<Row className="trendAnalysiscss">
					<center><h4 className='heading'>Instructor Comments </h4></center>
					{this.showInstructorComments()}
				</Row>
			)

			sideSection.push(
				<ListGroupItem className="sideMenuCellCssSelected" onClick={() => { this.sectionSelection(5) }}><span className="sideMenuCellCssSelected">Instructor Comments</span></ListGroupItem>
			)
		} else {
			sideSection.push(

				<ListGroupItem className="sideMenuCellCss" onClick={() => { this.sectionSelection(5) }}><span className="sideMenuCellCss">Instructor Comments</span></ListGroupItem>

			)

		}

		if (section === 4) {
			mainSection.push(
				<Row className="trendAnalysiscss">
					<center><h4 className='heading'>Previous Trend </h4></center>
					{this.trendAnalysis()}
				</Row>
			)

			sideSection.push(
				<ListGroupItem className="sideMenuCellCssSelected" onClick={() => { this.sectionSelection(4) }}><span className="sideMenuCellCssSelected">Learner-based Data (Past Trends)</span></ListGroupItem>
			)
		} else {
			sideSection.push(
				<ListGroupItem className="sideMenuCellCss" onClick={() => { this.sectionSelection(4) }}><span className="sideMenuCellCss">Learner-based Data (Past Trends)</span></ListGroupItem>
			)

		}


		if (section === 6) {
			mainSection.push(
				<Row>

					Contact Administrator
				</Row>
			)
		}







		return (


			<Grid >

				<center><h3>SBME Analysis Report</h3></center>

				{this.displayVids()}







				<Col sm={12} className='main'>
					<Col sm={3} className='sidemenu'>
						<ListGroup>
							{sideSection}
						</ListGroup>
					</Col>

					<Col sm={9} className="MainContent">

						{mainSection}


					</Col>
				</Col>



			</Grid>


		)
	}
}


export default SpecificResultsContainer; 