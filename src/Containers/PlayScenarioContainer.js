/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel } from 'react-bootstrap';
import { Button, Col } from 'react-bootstrap';
//import './NameForm.css';
import axios from 'axios';
import backendlink from '../../config/links.js';

import play from '../img/playbutton.jpg'
import pause from '../img/pausebutton.jpg'
import 'react-table/react-table.css'
import './PlayScenarioContainer.css'
import queryString from 'query-string';
import PhysioContainer from './PhysioContainer.js';
import ScanMonitorContainer from './ScanMonitorContainer.js';
import Swal from 'sweetalert2';
class PlayScenarioContainer extends Component {

	constructor(props) {
		super(props);
		var query = queryString.parse(this.props.match.location.search);
		this.state = {
			loaded: 0,
			scenario_id: query.scenario_id,
			learnerData: [],
			deviceData: [],
			nlpStatus: null,
			enableNLP: false,
			nlpComponentShow: true,
			bulbNlpStatus:false,
			streamRoomData: [],
			selectedStream: null,
			level: -1,
			roleRating: {},
			significantEvent: [],
			comments: [],
			play: 0,
			playStatus: {
				timeleft: 0,
				flashCounter: 0
			},
			table: {
				sort: {
					column: "age",
					order: "desc"
				},
				columns: [
					{
						Header: 'Event name',
						accessor: 'EVENT_NAME'
					},
					{
						Header: 'Skill type',
						accessor: 'SKILL_TYPE'
					},
					{
						Header: 'Specific Skill',
						accessor: 'SPECIFIC_SKILL'
					},
					{
						Header: 'Time Start',
						accessor: 'TIME_START'
					}
				],
				rows: [
					{
						event_id: 1
					}
				]
			}
		};

	}


	componentDidMount() {
		var params = {
			scenario_id: this.state.scenario_id
		}
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink + '/getevent', {
			params: params
		})
			.then(function (response) {
				var check = response.data;

				if (check && check.error) {
					window.location.href = "./login?message=" + check.message;
				}


				var tables = this.state.table;
				var data = response.data.data;
				console.log('The data returned from getevent ', response.data)
				var playStatus = this.state.playStatus;



				if (response.data && response.data.scenarioDetails && response.data.scenarioDetails.length > 0 && response.data.learnerData && response.data.deviceData && playStatus && response.data.roles && response.data.roles.length > 0) {
					this.setState({ scenarioName: response.data.scenarioDetails[0].SCENARIO_NAME });
					this.setState({ scenarioTime: response.data.scenarioDetails[0].TIME_DURATION });
					playStatus.timeleft = response.data.scenarioDetails[0].TIME_DURATION;

					//Chhavne
					//response.data.deviceData = [{"SERIALNUMBER":123,"STARTTIME":0},{"SERIALNUMBER":1234,"STARTTIME":0}];


					this.setState({
						playStatus: playStatus,
						roles: response.data.roles,
						learnerData: response.data.learnerData,
						deviceData: response.data.deviceData,
						eventData: response.data.data,
						scenarioData: response.data.scenarioDetails,
						loaded: 1
					});

				} else {
				}


				data.forEach(function (row) {

					Object.keys(row).forEach(function (key) {
						if (typeof row[key] === "string") {
							if (row[key].includes('link</a>') || row[key].includes('<!--HTML-->')) {
								row[key] = <div dangerouslySetInnerHTML={{ __html: row[key] }} />;
							}
						}
					});
				});

				tables.rows = data;
				if (data.length > 0) {
					this.setState({ table: tables });

				} else {
					var elert = {
						flag: 1,
						message: "No data found in this Report"
					}
					this.setState({ elert: elert });
				}
				this.updateNodeTimestamp();

			}.bind(this))
			.catch(function (error) {

			});
		axios.get(backendlink.backendlink + '/getAudioStream')
			.then(response => {
				const data = response.data.data; // Access the data property of the response's data
				this.setState({ streamRoomData: data, selectedStream: data[0].Id });
				console.log('Audio Stream Data', data)
			})
			.catch(error => {
				console.log('Error:', error);
			});
	}
	// Function when Enable NLP Button is pressed
	handleEnableNLP = async () => {
		// Check if checkMulticastTranscriptionStreamAPI is up and running
		const multicastAPIURL = backendlink.checkMulticastTranscriptionStreamAPI + '/status-check';
		try {
			const response1 = await axios.get(multicastAPIURL);
			// assuming that the API returns a 200 status when it's up and running
			if (response1.status !== 200) {
				throw new Error('The Multicast Transcription Stream API is down.')

			}
		} catch (error) {
			console.error(error);
			Swal.fire('API Down', 'The Multicast Transcription Stream API  is down. Please turn on the Multicast Stream API on the configuration page.', 'error');
			return;
		}
		// Check if checkEventDetectionAPI is up and running
		const eventDetectionAPIURL = backendlink.checkEventDetectionAPI + '/status-check';
		try {
			const response2 = await axios.get(eventDetectionAPIURL);
			// assuming that the API returns a 200 status when it's up and running
			if (response2.status !== 200) {
				throw new Error('The Event Detection API is down.')
				

			}
		} catch (error) {
			console.error(error);
			Swal.fire('API Down', 'The Event Detection API is down. Please turn on the Event Detection API on the configuration page.', 'error');
			return;
		}

		this.setState(prevState => ({ enableNLP: !prevState.enableNLP }));
		Swal.fire('Select Audio Stream.', "Please select the Audio Stream Room from the dropdown below.", 'info')
	}
	// Function when audio stream source is selected.
	handleStreamChange = (event) => {
		this.setState({ selectedStream: event.target.value });

	}
	//Call Audio Stream API with StreamID
	submitStreamId = () => {

		if (this.state.selectedStream) {
			console.log('Audio Stream Data', this.state.streamRoomData)
			console.log('ID  of selected stream', this.state.selectedStream)
			let selectedStreamData = this.state.streamRoomData.find(item => Number(item.Id) === Number(this.state.selectedStream));

			if (selectedStreamData) {
				let selectedIp = selectedStreamData.Ip;
				let selectedPort = selectedStreamData.Port;
				let selectedRoom = selectedStreamData.Room;
				console.log(`Selected stream has Ip: ${selectedIp} and Port: ${selectedPort}`);
				const scenario_id = this.state.scenario_id
				const scenario_name = this.state.scenarioName
				const modelName = scenario_id.toString() + (scenario_name.replace(/\s/g, '').toLowerCase())
				//Log all information in console for understanding
				console.log('Model Name:', modelName)
				console.log('Scenario ID:', scenario_id)
				console.log('Scenario Name', scenario_name)
				console.log('Event Data', this.state.eventData)
				console.log('Scenario Data', this.state.scenarioData)

				//POST Body for multicastTranscriptionStreamAPILink
				const streamPostData = {
					multicast_group: selectedIp,
					port: selectedPort,

				};
				//POST Body for eventDetectionAPILink
				const eventPostData = {
					model_name: modelName,
					scenario_id: scenario_id,
					scenario_name: scenario_name,
					scenario_role_id: this.state.nodes[0].scenario_role_id,
					processing_status: true,
					event_id: {},
					event_time: {},
					lookup_dict: {}
				};
				// Loop through the response data and build key-value pairs
				let allEventsHaveLookupWords = true; // Flag to track if all events have LOOKUP_WORDS_SYNONYMS
				this.state.eventData.forEach(event => {
					const lookupWords = JSON.parse(event.LOOKUP_WORDS_SYNONYMS);
					if (lookupWords && lookupWords.length > 0) {
						lookupWords.forEach(word => {
							eventPostData.lookup_dict[word] = event.EVENT_NAME;
						});
					} else {
						allEventsHaveLookupWords = false; // Set the flag to false if any event is missing LOOKUP_WORDS_SYNONYMS
						Swal.fire('Error', `Event:${event.EVENT_NAME} doesn't have a lookup table. Try again after creating the Lookup table.`, 'error');
					}
				});
				let eventIdMap = this.state.eventData.map(item => ({ [item.EVENT_NAME]: item.EVENT_ID }));
				eventPostData.event_id = Object.assign({}, ...eventIdMap);
				let eventTimeMap = this.state.eventData.map(item => ({ [item.EVENT_NAME]: item.TIME_START }));
				eventPostData.event_time = Object.assign({}, ...eventTimeMap);
				console.log('Post Data', eventPostData)

				axios.post(backendlink.multicastTranscriptionStreamAPILink, streamPostData)
					.then(response => {
						console.log(response);
						return axios.post(backendlink.eventDetectionAPILink, eventPostData);
					})
					.then(response => {
						console.log(response);
						Swal.queue([
							{
								title: `${selectedRoom} Room Audio Stream Set`,
								text: "Audio Stream has been set Successfully.",
								type: 'success',
								timer: 2000,
								showConfirmButton: true
							},
							{
								title: 'Event Detection API',
								text: "Event detection API post successful.",
								type: 'success',
								timer: 2000,
								showConfirmButton: true
							}
						]);
						this.setState({ nlpComponentShow: false });
						this.setState({ bulbNlpStatus: true });
						this.setState({ nlpStatus: true });
						console.log('Timer:', this.state.playStatus)
						this.startInterval();
					})
					.catch(error => {
						console.log(error);
						Swal.fire({
							title: 'Error',
							text: "There was an error with the API request",
							type: 'error',
							timer: 2000, // Set the timer for 2 seconds
							showConfirmButton: true // Show the confirm button
						});
					});
			} else {
				console.log(`Stream with Id ${this.state.selectedStream} not found.`);
			}



		} else {
			Swal.fire('Audio Stream not selected ', 'Please select the Audio Stream Room from the dropdown', 'warning');

		}

	}

	patanai() {
		alert('hamza');
	}
	addRoleRating(SCENARIO_ROLE_ID, index, rating) {
		var roles = [];

		if (this.state && this.state.roles) {
			roles = this.state.roles;

		}
		console.log(roles);
		roles[index]['RATING'] = rating;
		this.setState({ roles: roles });
	}
	selectNode() {
		var nodes = this.state.nodes;
		var timeLeft = this.state.playStatus.timeleft;
		var scenarioTime = this.state.scenarioTime;
		var ind = -1;
		nodes.forEach(function (node, index) {
			if (node.time === scenarioTime - timeLeft) {
				ind = index;
			}
		});
		if (ind >= 0) {
			this.selectEvent(ind);
		}
	}
	playbuttonTriggered() {
		if (this.state.play === 0) {
			this.setState({ play: 1 });

			if (this.state.nlpStatus === null) {
				Swal.fire({
					title: 'Do you want to enable NLP?',
					type: 'question',
					showCancelButton: true,
					confirmButtonText: 'Yes',
					cancelButtonText: 'No'
				}).then((result) => {
					if (result.value) {
						this.setState({ nlpStatus: true });
						this.handleEnableNLP();
						// Do not start the interval here as it will be started in submitStreamId
					} else {
						this.setState({ nlpStatus: false });
						this.setState({ nlpComponentShow: false });
						this.setState({ bulbNlpStatus: false });
						// If NLP is not enabled, start the interval
						this.startInterval();
					}
				});
			} else {
				// If nlpStatus is not null, start the interval immediately
				this.startInterval();
			}
		} else {
			this.setState({ play: 0 });
			if (this.timerID) {
				clearInterval(this.timerID);
			}
		}
	}



	startInterval() {
		this.timerID = setInterval(() => {
			var playStatus = this.state.playStatus;
			playStatus.flashCounter = (playStatus.flashCounter + 1) % 2;
			this.selectNode();
			if (playStatus.timeleft === 0 || this.state.play === 0) {
				// Clear interval when the timeleft is 0 or play is 0
				clearInterval(this.timerID);
			} else {
				playStatus.timeleft -= 1;
			}
			this.setState({ playStatus: playStatus });
		}, 1000);
	}

	// setInterval() method, if you want flashing even when paused. Note: Note tested thoroughly
	// startInterval() {
	// 	this.timerID = setInterval(() => {
	// 		var playStatus = this.state.playStatus;
	// 		playStatus.flashCounter = (playStatus.flashCounter + 1) % 2;
	// 		this.setState({ playStatus: playStatus }); // update flash counter immediately

	// 		if (this.state.play === 1) {
	// 			this.selectNode();
	// 			if (playStatus.timeleft === 0) {
	// 				// Clear interval when the timeleft is 0
	// 				clearInterval(this.timerID);
	// 			} else {
	// 				playStatus.timeleft -= 1;
	// 				this.setState({ playStatus: playStatus }); // update time left only when play is 1
	// 			}
	// 		}
	// 	}, 1000);
	// }




	selectEvent(index) {
		console.log(index);
		var nodes = this.state.nodes;
		if (nodes) {

			nodes.forEach(function (node, index) {
				node.selected = 0;
			});
			nodes[index].selected = 1;
			var rating = 50;

			if (nodes[index].rating) {
				rating = nodes[index].rating;
			}
			if (document.getElementById('ratingBarform')) {
				document.getElementById('ratingBarform')['points'].value = rating;
			};

			this.setState({ nodes: nodes });
		}
	}
	findRoleIndex(str) {
		var index = -1;
		if (this.state && this.state.roles && this.state.roles.length > 0) {
			this.state.roles.forEach(function (role, i) {
				if (role.ROLE_NAME === str) {
					index = i;
				}
			});
		}
		return index;
	}
	displayEvent() {
		var nodes = this.state.nodes;
		if (nodes) {
			var ind = -1;
			nodes.forEach(function (node, index) {
				if (node.selected === 1) {
					ind = index;
				}
			});
			if (ind > -1) {
				return (
					<div>
						<b>Event Name:</b>{nodes[ind].eventName}<br />
						<b>Event Type:</b>{nodes[ind].label}<br />
						<b>Specific Event:</b>{nodes[ind].specificLabel}<br />
					</div>
				)
			} else {
				return (<center><h4>Select Event</h4></center>)
			}

		}
	}
	rateEvent(index) {
		var nodes = this.state.nodes;
		var points = document.getElementById('points' + index).value;
		nodes[index].rating = points;
		this.setState({ nodes: nodes });
	}

	eventLike(index) {
		var nodes = this.state.nodes;

		nodes[index].completed = true;
		nodes[index].completedTime = new Date().getTime();




		this.setState({ nodes: nodes });
	}


	eventLike1(index, rating) {
		var nodes = this.state.nodes;
		nodes[index].completed = true;
		nodes[index].completedTime = new Date().getTime();
		nodes[index].skillLevel = rating;




		this.setState({ nodes: nodes });
	}


	eventDislike(index) {
		var nodes = this.state.nodes;

		nodes[index].completed = false;





		var timeleft = this.state.scenarioTime - nodes[index].time;

		var playStatus = {
			'timeleft': timeleft,
			'flashCounter': 1
		};
		this.setState({
			nodes: nodes,
			playStatus: playStatus
		});
	}


	displayRatingBar() {
		var style = {
			'text-align': 'center',
			'vertical-align': 'middle'
		}
		var style1 = {
			'color': 'red'
		}
		var nodes = this.state.nodes;
		if (nodes) {
			var ind = -1;
			nodes.forEach(function (node, index) {
				if (node.selected === 1) {
					ind = index;
				}
			});


			if (ind > -1) {

				var that = this;
				var id = 'points' + ind;
				var warning1 = '';
				var warning = '';
				if (nodes[ind].time > (this.state.scenarioTime - this.state.playStatus.timeleft)) {
					warning1 = 'This event has not Occured yet according to the sytem time';
				}
				if (nodes[ind].rating) {
					warning = 'This Event has been graded';
				}
				var ratingBar = [];


				if (nodes[ind].completed && nodes[ind].completed === true) {
					ratingBar.push(
						<div>
							<Col sm={6}>
								<left>Poor</left>
							</Col>
							<Col sm={6}>
								<right>Excellent</right>
							</Col>
							<Col sm={12}>
								<form id='ratingBarform'>
									<input className="range blue inputab" type="range" id={id} name='points' min="0" max="100" />
									<Button onClick={() => { this.rateEvent(ind) }} bsSize="small">Rate Event</Button>
								</form>
							</Col>
						</div>
					)
				}
				else {

					ratingBar.push(
						<div>

							<br />
							<Button onClick={() => { that.eventLike1(ind, 0) }} bsStyle="info">Novice</Button>&emsp;&emsp;&emsp;&emsp;
							<Button onClick={() => { that.eventLike1(ind, 1) }} bsStyle="primary">Intermediate</Button>&emsp;&emsp;&emsp;&emsp;
							<Button onClick={() => { that.eventLike1(ind, 2) }} bsStyle="success">Expert</Button>
						</div>
					)


				}
				return (
					<div style={style}>
						<br />
						<p style={style1}>{warning}</p>

						<p style={style1}>{warning1}</p>
						<Col sm={12}>




							{ratingBar}

							<br />
							<br />
						</Col>
					</div>
				);

			} else {
				return (<center><h4>Select Event</h4></center>)
			}

		}
	}


	displayRatingBarList() {
		var style = {
			'text-align': 'center',
			'vertical-align': 'middle'
		}
		var nodes = this.state.nodes;
		var ratingBar = [];
		if (nodes) {
			var that = this;
			nodes.forEach(function (node, ind) {
				var id = 'points' + ind;

				if (!nodes[ind].rating) {


					if (nodes[ind].completed && nodes[ind].completed === true) {
						ratingBar.push(
							<Row className="row212131">
								<Col sm={12}>


									<b>Event Name: </b>{nodes[ind].eventName}<br />
									<b>Event Type: </b>{nodes[ind].label}<br />
									<b>Specific Event: </b>{nodes[ind].specificLabel}<br />
									<br />

								</Col>
								<br />
								<Col sm={12}>
									<Col sm={6}>
										<left>Poor</left>
									</Col>
									<Col sm={6}>
										<right>Excellent</right>
									</Col>
									<Col sm={12}>
										<form id='ratingBarform'>
											<input className="range blue inputab" type="range" id={id} name='points' min="0" max="100" />
											<Button onClick={() => { that.rateEvent(ind) }} bsSize="small">Rate Event</Button>
										</form>
									</Col>
								</Col>
							</Row>
						)
					}
					else {

						ratingBar.push(

							<Row className="row212131">
								<Col sm={12}>


									<b>Event Name: </b>{nodes[ind].eventName}<br />
									<b>Event Type: </b>{nodes[ind].label}<br />
									<b>Specific Event: </b>{nodes[ind].specificLabel}<br />
									<br />


								</Col>

								<Col sm={12}>



									<Button onClick={() => { that.eventLike1(ind, 0) }} bsStyle="info">Novice</Button>&emsp;&emsp;&emsp;&emsp;
									<Button onClick={() => { that.eventLike1(ind, 1) }} bsStyle="primary">Intermediate</Button>&emsp;&emsp;&emsp;&emsp;
									<Button onClick={() => { that.eventLike1(ind, 2) }} bsStyle="success">Expert</Button>


								</Col>

							</Row>




						)


					}

				}

			});





			return (
				<div style={style}>
					<br />

					<Col sm={12}>




						{ratingBar}

						<br />
						<br />
					</Col>
				</div>
			);



		}
	}
	displayTimelne() {
		var that = this;
		var circles = [];

		console.log(screen.width);
		var width = 725
		var height = 120;


		if (document.getElementById("gridsize")) {
			width = ((document.getElementById("gridsize").offsetWidth)) - 100;
		} else {
			width = (screen.width / 12) * 7 - 40;
		}


		circles.push(<line x1={20} y1={height} x2={width + 20} y2={height} stroke="green" strokeWidth={2} />)
		var scenarioTime = this.state.scenarioTime;
		var nodes = this.state.nodes;
		var upto = (((scenarioTime - (this.state.playStatus.timeleft)) / scenarioTime) * width) + 20;
		var significantEvent = this.state.significantEvent;
		if (significantEvent) {
			var cs = 50;
			significantEvent.forEach(function (event, index) {
				console.log('Hello');
				console.log(index);
				var r = 20;
				var cyval = height + 18 - 1 * (r + 5) * 2 - cs;
				var time = ((event.time / scenarioTime) * width) + 20;
				circles.push(<rect x={time} y={cyval} fill="red" width={15} height={15} onClick={() => that.selectEvent(index)}></rect>);
			})

		}
		if (nodes) {
			this.state.nodes.forEach(function (node, index) {
				var color = '';
				var r = 20;
				var cs = 50;
				var legend = that.findRoleIndex(node.role);
				if (node.label === 'Start') {
					color = "rgba(46, 139, 87,1)";
					r = 10;
					cs = 10;

				} else if (node.label === 'behavioral') {
					color = "rgba(255, 182,193,1)";
					r = width / 80;

				} else if (node.label === 'psychomotor') {
					color = "rgba(30,144,255,1)";
					r = width / 80;

				} else if (node.label === 'cognitive') {
					color = "rgba(75,0,130,1)";
					r = width / 80;
				} else {
					color = "rgba(213, 93, 9,1)";
					r = 10;
					cs = 10;
				}


				var time = ((node.time / scenarioTime) * width) + 20;
				var count = 0;

				for (var i = 0; i < index; i++) {
					var temptime = ((nodes[i].time / scenarioTime) * width) + 20;
					if (Math.abs(time - temptime) <= (r * 2 + 10)) {
						count += 1;
					}
				}
				var cyval = height + 18 - (count) * (r + 5) * 2 - cs;
				if (node.selected === 1) {
					var color2 = "rgba(255, 240, 0,1)";
					circles.push(
						<circle cx={time} cy={cyval} fill={color2} r={r + 10} onClick={() => that.selectEvent(index)}></circle>
					);
				}

				if (nodes[i].rating) {
					circles.push(
						<circle cx={time} cy={cyval} fill="red" r={r + 5} onClick={() => that.selectEvent(index)}></circle>
					);
				}

				if (time <= upto) {
					var color1 = '';
					var flash = 0;
					if (nodes[i].rating) {
						color1 = "red";
					} else {

						flash = (that.state.playStatus.flashCounter) % 2;
						color1 = "green";
					}
					if (flash === 0) {
						circles.push(
							<circle cx={time} cy={cyval} fill={color1} r={r + 5} onClick={() => that.selectEvent(index)}></circle>
						);
					}
				}

				circles.push(
					<circle cx={time} cy={cyval} fill={color} r={r} onClick={() => that.selectEvent(index)}></circle>
				);
				circles.push(
					<text x={time + r + 5} y={cyval + r / 2} font-family="sans-serif" font-size="13px" fill="(0,0,0,0.5)">{legend + 1}</text>
				);

			});
			for (var i = 1; i < 10; i++) {
				circles.push(
					<circle cx={i * (width / 10) + 20} cy={height} fill="rgba(0,0,0,0.5)" r={5}></circle>
				)
				var str = "rotate(0 " + (i * (width / 10) + 20) + "," + 290 + ")";
				circles.push(
					<text x={i * (width / 10) + 28} y={height + 14} font-family="sans-serif" font-size="13px" transform={str} fill="(0,0,0,0.5)">{Math.round((scenarioTime / 10) * i)}</text>
				)
			}

			// circles.push(
			// 	 <text x={width/2} y={height+40} font-family="sans-serif" font-size="25px" fill="(0,0,0,0.5)">Minutes</text>
			// 	)

			circles.push(
				<circle cx={20} cy={height} fill="rgba(46, 139, 87,1)" r={10}></circle>
			);

			circles.push(
				<circle cx={width + 20} cy={height} fill="rgba(213, 93, 9,1)" r={10}></circle>
			);

			if (this.state.play === 0) {
				circles.push(<line x1={20} y1={height} x2={upto} y2={height} stroke="rgba(213, 93, 9,0.4)" strokeWidth={40} />)
			} else if (this.state.play === 1) {
				circles.push(<line x1={20} y1={height} x2={upto} y2={height} stroke="rgba(213, 93, 9,0.4)" strokeWidth={49} />)

			}

			return (
				<svg width={width + 40} height={height + 50}>
					{circles}
				</svg>
			);

		}
	}

	displayLegend() {
		var circles = [];
		var width = 0;
		if (document.getElementById("gridsize")) {
			width = ((document.getElementById("gridsize").offsetWidth) / 12) * 7;
		} else {
			width = (screen.width / 12) * 7;
		}

		var height = 80;

		circles.push(
			<circle cx={25} cy={15} fill="rgba(75,75,75,1)" r={5}></circle>
		);
		circles.push(
			<text x={35} y={25} font-family="sans-serif" fontSize={20} fill="(0,0,0,0.5)">Legends</text>
		);

		circles.push(
			<text x={40} y={60} font-family="sans-serif" font-size="13px" fill="(0,0,0,0.5)">Psychomotor</text>
		)

		circles.push(
			<circle cx={25} cy={55} fill="rgba(30,144,255,1)" r={10}></circle>
		);

		circles.push(
			<text x={155} y={60} font-family="sans-serif" font-size="13px" fill="(0,0,0,0.5)">Cognitive</text>
		)

		circles.push(
			<circle cx={140} cy={55} fill="rgba(75,0,130,1)" r={10}></circle>
		);

		circles.push(
			<text x={270} y={60} font-family="sans-serif" font-size="13px" fill="(0,0,0,0.5)">Behavioral</text>
		)

		circles.push(
			<circle cx={255} cy={55} fill="rgba(255, 182,193,1)" r={10}></circle>
		);


		if (this.state && this.state.roles && this.state.roles.length > 0) {
			var dist = 0
			this.state.roles.forEach(function (role, i) {
				var tempx = 35 + dist;
				var tempy = 100;
				var str = role.ROLE_NAME.trim();
				dist = dist + 6 * str.length + 40;

				circles.push(
					<text x={tempx - 15} y={tempy + 5} font-family="sans-serif" font-size="13px" fill="(0,0,0,0.5)">{i + 1}</text>
				)

				circles.push(
					<circle cx={tempx} cy={tempy} fill="rgba(75,75,75,1)" r={5}></circle>
				)
				circles.push(
					<text x={tempx + 10} y={tempy + 5} font-family="sans-serif" fontSize={10} fill="(0,0,0,0.5)">{str}</text>
				)

			});

		} else {

		}
		return (
			<svg width={width + 40} height={height + 50}>
				{circles}
			</svg>
		);



	}

	updateNodeTimestamp() {
		var nodes = [];
		var temp = {};
		this.state.table.rows.forEach(function (event) {
			temp = {
				time: event.TIME_START,
				eventName: event.EVENT_NAME,
				label: event.SKILL_TYPE,
				specificLabel: event.SPECIFIC_SKILL,
				selected: 0,
				id: event.EVENT_ID,
				role: event.ROLE_NAME,
				scenario_role_id: event.SCENARIO_ROLE_ID
			}
			nodes.push(temp);
		});
		this.setState({ nodes: nodes });
		console.log('These are the nodes data', nodes)
	}
	displayPlaybutton() {
		const play_pause = {
			width: '30px'
		}
		var that = this;
		if (this.state.play === 0) {
			return (<img onClick={() => { that.playbuttonTriggered() }} style={play_pause} alt="logo" src={play} />);
		} else {
			return (<img onClick={() => { that.playbuttonTriggered() }} style={play_pause} alt="logo" src={pause} />);
		}
	}


	displayRoleRating() {




	}

	savePlay() {
		var trainee = {};

		if (this.state && this.state.trainee) {
			trainee = this.state.trainee;
		}

		var roles = this.state.roles;

		roles.forEach(function (role) {
			if (trainee[role.SCENARIO_ROLE_ID]) {
				trainee[role.SCENARIO_ROLE_ID]['rating'] = role.RATING;
			}
		});

		var nodes = JSON.stringify(this.state.nodes);

		var comments = JSON.stringify(this.state.comments);
		trainee = JSON.stringify(trainee);



		var params = {
			trainee: trainee,
			nodes: nodes,
			comments: comments,
			scenario_id: this.state.scenario_id
		}



		console.log('These are the params sent to saveplay', params);

		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		// Store nlpStatus in a variable
		const nlpStatus = this.state.nlpStatus;
		axios.get(backendlink.backendlink + '/saveplay', {
			params: params
		})
			.then(function (response) {
				if (response.data.error) {
					console.log(response.data);
					console.log(response.data.error);
					alert('PLease contact Admin');
				} else {
					console.log('response data', response.data)
					const playId = response.data.play_id;
					console.log('play ID:   ', playId)
					const stopParams = {
						play_id: playId,
					}
					// Check if this.state.nlpStatus is true
					if (nlpStatus) {
						axios.post(backendlink.stopEventDetectionAPILink, stopParams)
							.then(function (response) {
								console.log(response)
								// Restarting the page post request completes
								location.reload();
							})
							.catch(function (error) {
								console.log(error)
							})
					} else {
						location.reload();
					}

				}
			})
			.catch(function (error) {
			});


	}
	saveComment() {
		var significantEvent = this.state.significantEvent;
		var playStatus = this.state.playStatus;
		var timeLeft = playStatus.timeleft;
		var scenarioTime = this.state.scenarioTime;
		var comment = document.getElementById("commentform").elements["comment"].value;
		comment = comment.trim();
		document.getElementById("commentform").elements["comment"].value = "";

		if (this.state && this.state.comments) {
			var comments = this.state.comments;
			comments.push(comment);
			var temp = {};
			temp.name = 'comment';
			temp.time = scenarioTime - timeLeft;
			significantEvent.push(temp);
			this.setState({ comments: comments });
		}

	}
	saveTrainee() {
		var deviceData = this.state.deviceData;
		var learnerData = this.state.learnerData;

		var roles = [];
		if (this.state && this.state.roles) {
			roles = this.state.roles;
		}
		var masterFlag = 0;
		var allTrainees = {};
		roles.forEach(function (role) {
			var subjectIndex = document.getElementById("savetrainee").elements[role.SCENARIO_ROLE_ID + "learner"].value;
			var deviceIndex = document.getElementById("savetrainee").elements[role.SCENARIO_ROLE_ID + "device"].selectedOptions;

			if (!subjectIndex) {
				masterFlag = 1;
				alert("No Subject Selected");
			}
			else {
				var traineefname = learnerData[subjectIndex]["LEARNER_NAME"];
				var traineelname = learnerData[subjectIndex]["LEARNER_NAME"];
				var dicipline = learnerData[subjectIndex]["FACULTY"];
				var years = learnerData[subjectIndex]["YEARS"];
				var LEARNER_ID = learnerData[subjectIndex]["LEARNER_ID"];
				var ROCKET_ID = learnerData[subjectIndex]["ROCKET_ID"];

				var serialNumber = [];
				var deviceConnectTime = [];


				console.log(deviceIndex);
				for (var i = 0; i < deviceIndex.length; i++) {
					console.log(deviceIndex[i].value);
					console.log(deviceData);
					serialNumber.push(deviceData[deviceIndex[i].value]["SERIALNUMBER"]);
					deviceConnectTime.push(deviceData[deviceIndex[i].value]["STARTTIME"]);
				}


				traineefname = traineefname.trim();
				traineelname = traineelname.trim();
				dicipline = dicipline.trim();

				var flag = 0;
				if (flag === 0) {
					var trainee = {
						traineefname: traineefname,
						traineelname: traineelname,
						dicipline: dicipline,
						years: years,
						deviceConnectTime: deviceConnectTime,
						serialNumber: serialNumber,
						learnerid: LEARNER_ID,
						rocketid: ROCKET_ID
					}
					allTrainees[role.SCENARIO_ROLE_ID] = trainee;
				}

			}
		});

		if (masterFlag === 0) {
			this.setState({ trainee: allTrainees });
		}




	}
	alertr(k) {
		console.log(k);
	}


	participantInfoForm() {

		var roles = [];
		var deviceData = this.state.deviceData;
		var learnerData = this.state.learnerData;
		var deviceDataHTML = [];
		var learnerDataHTML = [];




		if (this.state && this.state.roles) {
			roles = this.state.roles;
		}
		var patientInfoForm = [];

		deviceData.forEach(function (eachData, index) {
			deviceDataHTML.push(
				<option value={index}>{eachData.SERIALNUMBER}</option>
			);
		});




		learnerData.forEach(function (eachData, index) {
			learnerDataHTML.push(
				<option value={index}>{eachData.LEARNER_NAME}/{eachData.ROCKET_ID}/{eachData.LEARNER_ID}</option>
			);
		});




		roles.forEach(function (role) {
			var role_name = role.ROLE_NAME;
			patientInfoForm.push(<h4>Information About {role_name}</h4>);
			patientInfoForm.push(
				<table>

					<tr>
						<td width="160" valign="bottom" ><b>Select Subject</b></td>
						<td>
							<select name={role.SCENARIO_ROLE_ID + "learner"} cols="80">
								{learnerDataHTML}
							</select>

						</td>
						<td></td>
					</tr>

					<tr>
						<td width="160" valign="bottom" ><b>Select Device</b></td>
						<td>
							<select multiple id="deviceOptions" name={role.SCENARIO_ROLE_ID + "device"} cols="80">
								{deviceDataHTML}
							</select>

						</td>
						<td></td>
					</tr>
				</table>

			)
			patientInfoForm.push(<br />);
			patientInfoForm.push(<br />);

		});



		return (
			<div>
				{patientInfoForm}
			</div>
		);
	}


	displayPhysio() {


		var trainee = this.state.trainee;

		var physio = [];

		Object.keys(trainee).forEach(function (tr) {

			trainee[tr].deviceConnectTime.forEach(function (data, ind) {

				physio.push(
					<div> Device Id: {trainee[tr].serialNumber[ind]} <br />
						Device Connection Time: {trainee[tr].deviceConnectTime[ind]}
					</div>
				)

				physio.push(
					<PhysioContainer deviceConnection={trainee[tr].deviceConnectTime[ind]} serialNumber={trainee[tr].serialNumber[ind]} />
				)
			})


		});
		return physio;

	}


	displaySaveButton() {
		var that = this;


		if (this.state && this.state.nodes) {

			var nodes = this.state.nodes;
			var flag = 1;
			nodes.forEach(function (node) {
				if (!node.rating) {
					flag = 0;
				}
			})

			var roles = [];
			if (this.state && this.state.roles) {
				roles = this.state.roles;
			}
			var cont = [];
			roles.forEach(function (role, index) {
				if (!role.RATING) {
					cont.push(
						<div>
							{role.ROLE_NAME}:

							<Button onClick={that.addRoleRating.bind(that, role.SCENARIO_ROLE_ID, index, 1)}>Novice</Button>
							<Button onClick={that.addRoleRating.bind(that, role.SCENARIO_ROLE_ID, index, 2)}>Competent</Button>
							<Button onClick={that.addRoleRating.bind(that, role.SCENARIO_ROLE_ID, index, 3)}>Expert</Button>
							<br /><br />
						</div>
					)
				}

			});


			if (flag === 0) {
				return (
					<h4>Please rate all events to save </h4>
				);
			} else {
				if (cont.length > 0) {
					return (
						<div>
							<h4> Please Rate the Skill of the Trainee:</h4>
							{cont}

						</div>
					)


				} else {
					return (
						<div>
							<Button onClick={this.savePlay.bind(this)}>Save</Button>
						</div>
					);

				}

			}
		}


	}

	render() {
		const timelineStyle = {
			"background-color": "white",
			"border": "2px dotted grey"
		}
		const h4style = {
			'font-size': '12px'
		}
		const Bulb = () => {
			const style = {
				height: '25px',
				width: '25px',
				borderRadius: '50%',
				backgroundColor: this.state.bulbNlpStatus ? '#50C878' : '#FF3131',
			};
			return <div style={style} />;
		};
		if (this.state.trainee) {
			return (
				<Grid>
					<Col sm={12}>
						<Row>
							<h4>Play Scenario: {this.state.scenarioName}</h4>
						</Row>
						<Row style={timelineStyle}>


							<Col sm={12}>
							</Col>

							<Col sm={5}>
								{this.displayLegend()}
							</Col>
							<Col sm={5}>
								<br />
								<Button bsStyle="danger" className="Danger" onClick={() => this.setState({ open1: !this.state.open1 })}>Add Significant Event</Button>
								<Panel collapsible expanded={this.state.open1} style={{ marginTop: '10px' }}>
									<Row >
										<Col sm={4}>
											<form action="" id="commentform">
												<textarea rows="2" cols="40" name="comment" />
											</form>
											<Button bsStyle="success" bsSize="small" onClick={this.saveComment.bind(this)}>Add Event</Button>
										</Col>

									</Row>

								</Panel>
							</Col>
							<Col sm={2}>
								<div>
									<center>
										<h6><b>NLP Status:</b></h6>
										<Bulb />
									</center>

								</div>
							</Col>

							<Col sm={8}>
								{this.displayTimelne()}
							</Col>
							<Col sm={4}>

							</Col>

							<Col sm={6}>
								{this.displayRatingBar()}
							</Col>
							<Col sm={3} style={{ marginTop: '12px' }}>
								{this.state.nlpComponentShow && (
									<React.Fragment>
										<Button className="btn btn-warning btn-sm" onClick={this.handleEnableNLP}>Enable NLP</Button>
										{this.state.enableNLP && (
											<div style={{ marginTop: '1px' }}>
												<label><b>Select Audio Stream Room:</b></label>
												<br />
												<select value={this.state.selectedStream} onChange={this.handleStreamChange}>
													{this.state.streamRoomData.map((item, index) => (
														<option key={index} value={item.Id}>{item.Room}</option>
													))}
												</select>
												<button style={{ marginLeft: '20px' }} className="btn btn-success btn-xs" onClick={this.submitStreamId}>Submit</button>
											</div>
										)}
									</React.Fragment>
								)}
							</Col>

							<Col sm={3}>
								<center>{this.displayEvent()}

									{this.displayPlaybutton()} <h4>{this.state.playStatus.timeleft}<span style={h4style}>sec left</span></h4> </center><br />
							</Col>

						</Row>
						<br />
						<Row>
							<Col sm={12}>
								{this.displayRatingBarList()}
							</Col>
							<Col sm={8}>
								{this.displaySaveButton()}
							</Col>
						</Row>
					</Col>
				</Grid>
			)
		} else {


			if (this.state.loaded === 0) {
				return (
					<h1>Loading</h1>
				)
			}

			return (
				<div>
					<h1>Enter Information about your trainee</h1>

					<Grid className="whiteBg">
						<Col sm={8}>
							<Row>
								<form action="" id="savetrainee">
									{this.participantInfoForm()}
									<Button className="btn-primary" onClick={this.saveTrainee.bind(this)}>Proceed</Button>
								</form>
							</Row>
						</Col>
						<Col sm={4}>
							<Row>
								<h4>Scanned Devices</h4>
								<ScanMonitorContainer />
							</Row>
						</Col>

					</Grid>



				</div>
			);
		}
	}
}


export default PlayScenarioContainer; 