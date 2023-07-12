/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel } from 'react-bootstrap';
import { Button, Col, Table } from 'react-bootstrap';
//import './NameForm.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import backendlink from '../../config/links.js';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import queryString from 'query-string';


class EditScenarioContainer extends Component {

	constructor(props) {
		super(props);
		var query = queryString.parse(this.props.match.location.search);
		this.state = {
			loading: 0,
			scenario_id: query.scenario_id,
			lookupWordsTable: [""],
			lookupSynonyms: [],
			objectivesSelection: [],
			table: {
				sort: {
					column: "age",
					order: "desc"
				},
				columns: [
					{
						Header: 'Event name',
						accessor: 'EVENT_NAME',
						width: 100,
						Cell: props => (
							<div
								style={{
									whiteSpace: 'nowrap',
									overflow: 'auto',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
								title={props.value}
							>
								{props.value}
							</div>
						),

					},

					{
						Header: 'Role Label',
						accessor: 'ROLE_NAME',
						width: 130,
						Cell: props => (
							<div
								style={{
									whiteSpace: 'nowrap',
									overflow: 'auto',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
								title={props.value}
							>
								{props.value}
							</div>
						),

					},
					{
						Header: 'Skill type',
						accessor: 'SKILL_TYPE',
						width: 120
					},
					{
						Header: 'Specific Skill',
						accessor: 'SPECIFIC_SKILL',
						width: 120,
						Cell: props => (
							<div
								style={{
									whiteSpace: 'nowrap',
									overflow: 'auto',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
								title={props.value}
							>
								{props.value}
							</div>
						),
					},
					{
						Header: 'Time Start',
						accessor: 'TIME_START'
					},
					{
						Header: 'Heart Rate',
						accessor: 'HEART_RATE'
					},
					{
						Header: 'Systolic BP',
						accessor: 'SYSTOLIC_BP'
					},
					{
						Header: 'Diastolic BP',
						accessor: 'DISTOLIC_BP'
					},
					{
						Header: 'SPo2',
						accessor: 'SPO2'
					},
					{
						Header: 'R_Rate',
						accessor: 'R_RATE'
					},
					{
						Header: 'Cardiac_Rythm',
						accessor: 'CARDIAC_RYTHM',
						width: 150,
						Cell: props => (
							<div
								style={{
									whiteSpace: 'nowrap',
									overflow: 'auto',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
								title={props.value}
							>
								{props.value}
							</div>
						),
					}, {
						Header: 'Lookup_Words_Synonyms',
						accessor: 'LOOKUP_WORDS_SYNONYMS',
						width: 250,
						Cell: props => (
							<div
								style={{
									whiteSpace: 'nowrap',
									overflow: 'auto',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
								title={props.value}
							>
								{props.value}
							</div>
						),
					}
				],
				rows: [
					{
						event_id: 1
					}
				]
			}
		};
		this.changeObjectives = this.changeObjectives.bind(this);
		this.handleObjectivesChange = this.handleObjectivesChange.bind(this);
		//Bind LookUp Words Table Methods
		this.handleAddRow = this.handleAddRow.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.saveRows = this.saveRows.bind(this);
		this.handleSynonymnDelete = this.handleSynonymnDelete.bind(this);
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
					//window.location.href = "./login?message="+check.message;
				}

				var tables = this.state.table;
				var data = response.data.data;
				var goals = [];
				var goalsobjectives = response.data.goalsobjectives;
				var objectives = [];

				console.log(response.data.goalsobjectives);

				goalsobjectives.forEach(function (data) {
					var temp = JSON.parse(data.GOAL_NAME)
					goals.push(temp['goalName'])
					temp['objectives'].forEach(function (eachObjective) {
						objectives.push(eachObjective)
					})

				})

				console.log(objectives);





				if (response.data && response.data.scenarioDetails && response.data.scenarioDetails.length > 0 && response.data.roles && response.data.roles.length > 0) {
					this.setState({
						scenarioName: response.data.scenarioDetails[0].SCENARIO_NAME,
						scenarioTime: response.data.scenarioDetails[0].TIME_DURATION,
						roles: response.data.roles,
						objectives: objectives,
						goalsobjectives: goalsobjectives,
						goals: goals

					}, () => {
						this.changeObjectives();
					});

				} else {
					alert('Error Please check');
					// var error= {
					// 	flag:1,
					// 	message:'Major problem this is then ent]'
					// }
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
					var Talert = {
						flag: 1,
						message: "No data found in this Report"
					}
					this.setState({ alert: Talert });
				}
				this.updateNodeTimestamp();

			}.bind(this))
			.catch(function (error) {

			});
	}

	changeSpeceficSkills() {
		var specificskills = [];

		if (document.getElementById("createevent").elements["skilltype"].value === 'cognitive') {
			specificskills = ["critical/clinical decision making", "task prioritization", "follow-up/ongoing assessment of patient status", "medical/procedural knowledge", "guideline adherence"];
		} else if (document.getElementById("createevent").elements["skilltype"].value === 'behavioral') {
			specificskills = ["judgment", "self-confidence", "leadership", "coping strategies/psychological resilience (to stressful situations)", "adaptability", "empathy/professionalism", "communication."];
		} else if (document.getElementById("createevent").elements["skilltype"].value === 'psychomotor') {
			specificskills = ["dexterity", "speed of skill", "task efficiency (defined as both speed and quality of intervention)", "time to initiation of care"];
		}



		var s1 = document.getElementById('specificskill');
		var i;
		for (i = s1.options.length - 1; i >= 0; i--) {
			s1.remove(i);
		}

		specificskills.forEach(function (skill) {
			var newOption = document.createElement("option");
			newOption.value = skill;
			newOption.innerHTML = skill;
			s1.options.add(newOption);
		});

	}

	changeObjectives() {
		console.log('changing objectives');
		var objectives = [];

		var selgoal = document.getElementById("createevent").elements["goal"].value;
		console.log(selgoal);
		if (this.state) {
			this.state.goalsobjectives.forEach(function (data) {
				var temp = JSON.parse(data.GOAL_NAME)
				temp['objectives'].forEach(function (eachObjective) {
					if (temp['goalName'] === selgoal) {
						objectives.push(eachObjective)
					}
				})

			})
			var s1 = document.getElementById("createevent").elements["objectives"];
			var i;
			for (i = s1.options.length - 1; i >= 0; i--) {
				s1.remove(i);
			}

			objectives.forEach(function (obj) {
				var newOption = document.createElement("option");
				newOption.value = obj;
				newOption.innerHTML = obj;
				s1.options.add(newOption);
			});
		}

	}





	submitevent() {
		var eventname = document.getElementById("createevent").elements["eventname"].value;
		eventname = eventname.trim();
		var skilltype = document.getElementById("createevent").elements["skilltype"].value;
		skilltype = skilltype.trim();
		var specificskill = document.getElementById("createevent").elements["specificskill"].value;
		specificskill = specificskill.trim();
		var timestart = document.getElementById("createevent").elements["timestart"].value;
		timestart = timestart.trim();

		var objectives = this.state.objectivesSelection;
		// check if objectives array is empty
		if (objectives.length === 0) {
			Swal.fire('Objective Missing', 'Please select at least one objective', 'info');
			return;

		}


		var role = document.getElementById("createevent").elements["role"].value;
		role = role.trim();
		var flag = 0;
		var heart_rate = document.getElementById("createevent").elements["heart_rate"].value;
		var event_timeout = document.getElementById("createevent").elements["event_timeout"].value;
		var event_penalty_coefficient = document.getElementById("createevent").elements["event_penalty_coefficient"].value;
		var systolic_bp = document.getElementById("createevent").elements["systolic_bp"].value;
		var diastolic_bp = document.getElementById("createevent").elements["diastolic_bp"].value;
		var spo2 = document.getElementById("createevent").elements["spo2"].value;
		var r_rate = document.getElementById("createevent").elements["r_rate"].value;
		var cardiac_rhythm = document.getElementById("createevent").elements["cardiac_rhythm"].value;



		if (isNaN(heart_rate) || heart_rate.length === 0) {
			heart_rate = -1;
			// document.getElementById("heart_rate").innerHTML=" heart_rate should only be a number";
			// flag=1;
		} else {
			document.getElementById("heart_rate").innerHTML = "";
		}

		if (isNaN(systolic_bp) || systolic_bp.length === 0) {
			systolic_bp = -1;
			// document.getElementById("systolic_bp").innerHTML=" this  should only be a number";
			// flag=1;
		} else {
			document.getElementById("systolic_bp").innerHTML = "";
		}

		if (isNaN(diastolic_bp) || diastolic_bp.length === 0) {
			diastolic_bp = -1;
			// document.getElementById("diastolic_bp").innerHTML=" this  should only be a number";
			// flag=1;
		} else {
			document.getElementById("diastolic_bp").innerHTML = "";
		}

		if (isNaN(r_rate) || r_rate.length === 0) {
			r_rate = -1;
			// document.getElementById("r_rate").innerHTML=" this  should only be a number";
			// flag=1;
		} else {
			document.getElementById("r_rate").innerHTML = "";
		}

		if (isNaN(spo2) || spo2.length === 0) {
			spo2 = -1;
			// document.getElementById("spo2").innerHTML=" this  should only be a number";
			// flag=1;
		} else {
			document.getElementById("spo2").innerHTML = "";
		}

		if (isNaN(event_penalty_coefficient) || event_penalty_coefficient.length === 0) {
			event_penalty_coefficient = -1;
		} else {
			document.getElementById("event_penalty_coefficient").innerHTML = "";
		}
		if (isNaN(event_timeout) || event_timeout.length === 0) {
			event_timeout = -1;
		} else {
			document.getElementById("event_timeout").innerHTML = "";
		}




		if (eventname.length === 0) {
			document.getElementById("ename").innerHTML = " *Please enter the Event Name ";
			flag = 1;
		} else {
			document.getElementById("ename").innerHTML = "";
		}
		if (skilltype.length === 0) {
			document.getElementById("skilltype").innerHTML = " *Please select the Skill Type";
			flag = 1;
		} else {
			document.getElementById("skilltype").innerHTML = "";
		}

		if (specificskill.length === 0) {
			document.getElementById("specificskillError").innerHTML = " *Please enter the Specefic Skill";
			flag = 1;
		} else {
			document.getElementById("specificskillError").innerHTML = "";
		}

		if (isNaN(timestart) || timestart.length === 0) {
			document.getElementById("timestart").innerHTML = " *Time Start should only be a number";
			flag = 1;
		} else {
			document.getElementById("timestart").innerHTML = "";
			if (!isNaN(timestart) && Number(timestart) > this.state.scenarioTime) {
				document.getElementById("timestart").innerHTML = " *This cant be more than the Total Scenario Duration";
				flag = 1;
			} else {
				document.getElementById("timestart").innerHTML = "";
			}
		}




		if (!this.state.scenario_id) {
			alert('please close this window and restart.');
		}
		if (flag === 0) {
			console.log(objectives);
			var params = {
				eventname: eventname,
				skilltype: skilltype,
				specificskill: specificskill,
				timestart: timestart,
				scenario_id: this.state.scenario_id,
				heart_rate: heart_rate,
				systolic_bp: systolic_bp,
				diastolic_bp: diastolic_bp,
				spo2: 1,
				r_rate: r_rate,
				cardiac_rhythm: cardiac_rhythm,
				scenario_role_id: role,
				event_timeout : event_timeout,
				event_penalty_coefficient : event_penalty_coefficient,
				objectives1: objectives.toString(),
				lookupSynonyms: this.state.lookupSynonyms.length > 0 ? JSON.stringify(this.state.lookupSynonyms) : null
			}
			console.log('Params to be sent', params)
			// Clear the tables
			this.setState({
				lookupWordsTable: [""],
				lookupSynonyms: []
			});
			axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
			axios.post(backendlink.backendlink + '/addevent', params)
				.then(function (response) {

					var tables = this.state.table;
					var data = response.data;
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
						this.updateNodeTimestamp();

					} else {
						var alert = {
							flag: 1,
							message: "No data found in this Report"
						}
						this.setState({ alert: alert });
					}

				}.bind(this))
				.catch(function (error) {

				});
			// Clear the objectivesSelection state and reset objectives options based on the default goal
			this.setState({ objectivesSelection: [] }, () => {
				this.changeObjectives();
			});
			document.getElementById("createevent").reset();
		} else {

		}
	}
	findRoleIndex(str) {
		var index = -1;
		if (this.state && this.state.roles && this.state.roles.length > 0) {
			console.log(22);
			this.state.roles.forEach(function (role, i) {
				if (role.ROLE_NAME === str) {
					index = i;
				}
			});
		}
		return index;
	}


	objectivesObjective() {
		var options = [];
		if (this.state && this.state.objectives && this.state.objectives.length > 0) {
			var currentGoal = this.state.goalsobjectives.find(goal => JSON.parse(goal.GOAL_NAME).goalName === this.state.goal);
			if (currentGoal) {
				var currentObjectives = JSON.parse(currentGoal.GOAL_NAME).objectives;
				currentObjectives.forEach((objective, index) => {
					options.push(
						<option
							key={`${objective}-${index}`}
							value={objective}
							selected={this.state.objectivesSelection.includes(objective)}
						>
							{objective}
						</option>
					);
				});
			}
			return options;
		} else {
			return <option value="Problem">Problem</option>;
		}
	}




	rolesOptions() {
		var options = [];
		if (this.state && this.state.roles && this.state.roles.length > 0) {
			this.state.roles.forEach(function (role) {
				options.push(
					<option value={role.SCENARIO_ROLE_ID}>{role.ROLE_NAME}({role.NUMBER})</option>
				);
			});


			return options;

		} else {
			return (
				<option value="Problem">Problem</option>
			)
		}




	}
	goalsOptions() {
		var options = [];
		if (this.state && this.state.goals && this.state.goals.length > 0) {
			this.state.goals.forEach(function (goal) {
				options.push(
					<option value={goal}>{goal}</option>
				);
			});

			return options;

		} else {
			return (
				<option value="Problem">Problem</option>
			)
		}




	}
	deleteevent(event_id) {
		// Confirmation dialog
		if (!window.confirm("Are you sure you want to delete this configuration?")) {
			return;  // If user does not confirm, exit function early
		}

		if (!this.state.scenario_id) {
			alert('please close this window and restart.');
		}

		var params = {
			event_id: event_id,
			scenario_id: this.state.scenario_id
		}
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink + '/deleteevent', {
			params: params
		})
			.then(function (response) {

				var tables = this.state.table;
				var data = response.data;
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
					this.updateNodeTimestamp();

				} else {
					var alert = {
						flag: 1,
						message: "No data found in this Report"
					}
					this.setState({ alert: alert });
					this.setState({ table: tables });
					this.updateNodeTimestamp();
				}

			}.bind(this))
			.catch(function (error) {

			});

	}
	selectEvent(index) {
		var nodes = this.state.nodes;
		if (nodes) {

			nodes.forEach(function (node, index) {
				node.selected = 0;
			});
			nodes[index].selected = 1;
			this.setState({ nodes: nodes });
		}
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

				var that = this;
				return (
					<div >
						<br />
						<b>Event Name:</b>{nodes[ind].eventName}<br />
						<b>Event Type:</b>{nodes[ind].label}<br />
						<b>Specific Event:</b>{nodes[ind].specificLabel}<br />
						{nodes[ind].lookupWordsSynonyms && nodes[ind].lookupWordsSynonyms.length > 0 ? (
							<ReactTable
								// data={this.state.lookupWordsTable.map((row, index) => ({ id: index, lookupWord: row }))}
								data={nodes[ind].lookupWordsSynonyms.map((row, index) => ({ id: index, lookupWord: row }))}
								columns={[
									{
										Header: 'Lookup Words (Synonyms)',
										accessor: 'lookupWord',
										width: 400,
										Cell: props => (
											<div
												style={{
													textAlign: 'left',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													maxWidth: '100%',
													fontWeight: 'normal',
												}}
												title={props.value}
											>
												{props.value}
											</div>
										),
									},
								]}
								defaultPageSize={5}
								className="-striped -highlight"
								style={{
									width: '100%',
									paddingLeft: '5px',
									overflowX: 'auto'
								}}
							/>
						) : (
							<div><b>No lookup words found.</b></div>
						)}

						<span className="warning">For Vital signs look below in the table</span><br />

						<Button className="btn-primary" onClick={() => that.deleteevent(nodes[ind].id)}>Remove Event</Button>
					</div>
				)
			} else {
				return (<center><br /><br /><h4>Select Event</h4></center>)
			}

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
			<circle cx={25} cy={5} fill="rgba(75,75,75,1)" r={5}></circle>
		);
		circles.push(
			<text x={35} y={15} font-family="sans-serif" fontSize={20} fill="(0,0,0,0.5)">Legends</text>
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
	displayTimeline() {
		var that = this;
		var circles = [];
		var width = 0;
		if (document.getElementById("gridsize")) {
			width = ((document.getElementById("gridsize").offsetWidth) / 12) * 7;
		} else {
			width = (screen.width / 12) * 7 - 40;
		}

		var height = 80;
		circles.push(
			<line x1={20} y1={height} x2={width + 20} y2={height} stroke="green" strokeWidth={2} />
		)
		var scenarioTime = this.state.scenarioTime;
		var nodes = this.state.nodes;
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
					if (Math.abs(time - temptime) <= (r * 2)) {
						count += 1;
					}
				}
				var cyval = height + 30 - (count) * r * 2 - cs;
				if (node.selected === 1) {
					var color1 = "rgba(255, 240, 0,1)";
					circles.push(
						<circle cx={time} cy={cyval} fill={color1} r={r + 3} onClick={() => that.selectEvent(index)}></circle>
					);
				}

				circles.push(
					<circle cx={time} cy={cyval} fill={color} r={r} onClick={() => that.selectEvent(index)}></circle>
				);

				circles.push(
					<text x={time + r + 2} y={cyval + r / 2} font-family="sans-serif" font-size="13px" fill="(0,0,0,0.5)">{legend + 1}</text>
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

			circles.push(
				<text x={width / 2 - 100} y={height + 40} font-family="sans-serif" font-size="13px" fill="(0,0,0,0.5)">Seconds</text>
			)



			circles.push(
				<circle cx={20} cy={height} fill="rgba(46, 139, 87,1)" r={10}></circle>
			);

			circles.push(
				<circle cx={width + 20} cy={height} fill="rgba(213, 93, 9,1)" r={10}></circle>
			);

			return (
				<svg width={width + 40} height={height + 50}>
					{circles}
				</svg>
			);

		}

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
				lookupWordsSynonyms: JSON.parse(event.LOOKUP_WORDS_SYNONYMS)
			}
			nodes.push(temp);
		});

		this.setState({ nodes: nodes });

	}
	// Look Up Words Method

	//Adding the row to LookUp Words table
	handleAddRow() {
		// Add a new row to the lookupWordsTable
		this.setState(prevState => ({
			lookupWordsTable: [...prevState.lookupWordsTable, ""]

		}));
	}
	// Updating the state of lookupWordsTable based on input.
	handleInputChange(event, index) {
		// Handle the input changes in the lookupWordsTable
		let lookupWordsTable = [...this.state.lookupWordsTable];
		lookupWordsTable[index] = event.target.value;
		this.setState({ lookupWordsTable });
	}

	//Delete the specific synonymn from the table.
	handleSynonymnDelete(index) {
		const lookupSynonyms = [...this.state.lookupSynonyms];
		lookupSynonyms.splice(index, 1);
		this.setState({ lookupSynonyms });
		console.log('synonyms after deleteing', lookupSynonyms)
	}
	
	// Send API request to get the synonyms of LookUP words
	saveRows() {
		// Handle form submission here.
		const eventName = document.getElementById('createevent').elements.eventname.value;
		// Check if eventname is empty
		if (eventName.trim() === '') {
			Swal.fire('No Event Name ', 'Please enter an Event Name', 'info');
			return;
		}
		const lookUpWords = this.state.lookupWordsTable.filter(word => word.trim() !== '');
		// Check if lookUpWords is empty
		if (lookUpWords.length === 0) {
			Swal.fire('No LookUp Word ', 'Please enter at least one Look Up Word.', 'info');
			return;
		}
		const lookupDict = {};
		lookUpWords.forEach(word => {
			lookupDict[word] = eventName;
		});

		const jsonObject = {
			lookup_dict: lookupDict
		};

		const lookup_dict = JSON.stringify(jsonObject);
		console.log('LookUp Words', lookup_dict);

		// Send API request to get the synonymn of lookup Words:\
		axios.post(backendlink.medicalSynonymnAPILink, lookup_dict, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				console.log('Response from the API', response.data); // Display the response from the API
				const { lookup_dict } = response.data;
				let lookupSynonyms = Object.keys(lookup_dict);
				// Add lookUpWords to lookupSynonyms
				lookupSynonyms = [...lookupSynonyms, ...lookUpWords];
				this.setState({ lookupSynonyms });
				console.log('lookupSynonyms', lookupSynonyms)
			})
			.catch(error => {
				console.error(error);
				// Display alert when API is down
				Swal.fire('API Down ', 'The Medical Synonym API is currently down. Please try turning it on in the Configuration Page and try again.', 'error');
			});
	}


	// Handle objective change
	handleObjectivesChange(e) {
		let selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
		this.setState({ objectivesSelection: selectedOptions });
	}


	render() {
		const divStyle = {
			width: '400px'
		};
		const timelineStyle = {
			"background-color": "white",
			"border": "2px dotted grey"
		}
		var form = document.getElementById("createevent");
		if (form && form.elments && form.elements["skilltype"] && form.elements["skilltype"].value) {
			this.changeSpeceficSkills();
		}
		return (
			<Grid>
				<Col sm={12}>
					<Row>
						<h4>Edit Scenario: {this.state.scenarioName}</h4>
					</Row>
					<Row style={timelineStyle}>


						<Col sm={8}>
							{this.displayTimeline()}
							{this.displayLegend()}
						</Col>
						<Col sm={4}>
							{this.displayEvent()}
							<br />
						</Col>
					</Row>

					<Row>

						<Button className="btn-primary" onClick={() => this.setState({ open1: !this.state.open1 })}>Add Event</Button>
						<br />
						<br />
						<Panel collapsible expanded={this.state.open1}>
							<form action="" id="createevent">
								<Col sm={6}>
									<table>
										<tr>
											<td width="160" valign="bottom" ><b>Event Name</b></td>
											<td><input type="text" name="eventname" size="35" />
												<br /> <span id="ename" className="warning"  ></span>
											</td>
											<td></td>

										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>Skill Type</b></td>
											<td>
												<select id="selectElementId" style={divStyle} name="skilltype" onChange={this.changeSpeceficSkills}>
													<option value="psychomotor">Psychomotor</option>
													<option value="cognitive">Cognitive</option>
													<option value="behavioral">Behavioral</option>
												</select>
												<br />
												<span id="skilltype" className="warning"  ></span>
											</td>
											<td></td>

										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>Specific Skill</b></td>
											<td><select id="specificskill" style={divStyle} name="specificskill">
												<option>dexterity</option>
												<option>speed of skill</option>
												<option>task efficiency (defined as both speed and quality of intervention)</option>
												<option>time to initiation of care</option>
											</select>
												<br />
												<span id="specificskillError" className="warning"  ></span>
											</td>
											<td></td>

										</tr>
										<tr>
											<td valign="bottom"><b>Event Start Time(Seconds) </b></td>
											<td><input type="text" name="timestart" size="35" />
												<br /><span className="warning" id="timestart" ></span>
											</td>
											<td></td>
										</tr>


										<tr>
											<td width="160" valign="bottom" ><b>Role</b></td>
											<td><select style={divStyle} name="role">
												{this.rolesOptions()}
											</select>
												<br />
												<span id="" className="warning"  ></span>
											</td>
											<td></td>

										</tr>

										<tr>
											<td width="160" valign="bottom" ><b>Goal</b></td>
											<td><select style={divStyle} name="goal" onChange={this.changeObjectives} selected={false}>
												{this.goalsOptions()}
											</select>
												<br />
												<span id="" className="warning"  ></span>
											</td>
											<td></td>

										</tr>

										<tr>
											<td width="160" valign="bottom" ><b>Objectives:</b></td>
											<td>
												<select
													multiple
													style={divStyle}
													name="objectives"
													value={this.state.objectivesSelection}
													onChange={this.handleObjectivesChange}
												>
													{this.objectivesObjective()}
												</select>
												<br />
												<span id="" className="warning"  ></span>
											</td>
											<td></td>
										</tr>

										<tr>
											<td width="160" valign="bottom" ><b>Event Time Out (sec)</b></td>
											<td><input type="number" name="event_timeout" size="35" />
												<br /><span id="event_timeout" className="warning"  ></span>
											</td>
											<td></td>
										</tr>
										
									</table>
								</Col>
								<Col sm={6}>
									<table>
										<tr>
											<td width="160" valign="bottom" ><b>Vital Signs</b></td>
											<td><span className="warning"></span></td>
											<td></td>

										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>Heart Rate  [beats per minute]</b></td>
											<td><input type="text" name="heart_rate" size="35" />
												<br /><span id="heart_rate" className="warning"  ></span>
											</td>
											<td></td>

										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>Systolic Blood pressure [mmHg]</b></td>
											<td><input type="text" name="systolic_bp" size="35" />
												<br /><span id="systolic_bp" className="warning"  ></span>
											</td>
											<td></td>

										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>Diastolic Blood pressure [mmHg]</b></td>
											<td><input type="text" name="diastolic_bp" size="35" />
												<br /><span id="diastolic_bp" className="warning"  ></span>
											</td>
											<td></td>

										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>SPO2 (Blood Oxygen Saturation) [%]</b></td>
											<td><input type="text" name="spo2" size="35" />
												<br />
												<span id="spo2" className="warning"  ></span>
											</td>
											<td></td>

										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>Respiration Rate [breaths per minute]</b></td>
											<td><input type="text" name="r_rate" size="35" />
												<br />
												<span id="r_rate" className="warning"  ></span>
											</td>
											<td></td>
										</tr>
										<tr>
											<td width="160" valign="bottom" ><b>Cardiac Rhythm</b></td>
											<td>
												<select name="cardiac_rhythm">
													<option value="no info">Not applicable</option>
													<option value="Asystole">Asystole</option>
													<option value="Atrial Enlargement, Left">Atrial Enlargement, Left</option>
													<option value="Atrial Enlargement, Right">Atrial Enlargement, Right</option>
													<option value="Atrial Fibrillation">Atrial Fibrillation</option>
													<option value="Atrial Flutter">Atrial Flutter</option>
													<option value="Atrial Flutter with 2:1 AV Conduction">Atrial Flutter with 2:1 AV Conduction</option>
													<option value="Atrial Tachycardia">Atrial Tachycardia</option>
													<option value="AV Block, First-Degree">AV Block, First-Degree</option>
													<option value="AV Block, Second-Degree, Mobitz I">AV Block, Second-Degree, Mobitz I</option>
													<option value="AV Block, Second-Degree, Mobitz II">AV Block, Second-Degree, Mobitz II</option>
													<option value="AV Block, Third-Degree">AV Block, Third-Degree</option>
													<option value="Bundle Branch Block, Incomplete Right">Bundle Branch Block, Incomplete Right</option>
													<option value="Bundle Branch Block, Left">Bundle Branch Block, Left</option>
													<option value="Bundle Branch Block, Left with PVCs 25%">Bundle Branch Block, Left with PVCs 25%</option>
													<option value="Bundle Branch Block, Left with PVCs">Bundle Branch Block, Left with PVCs</option>
													<option value="Bundle Branch Block, Right">Bundle Branch Block, Right</option>
													<option value="Hypercalcemia">Hypercalcemia</option>
													<option value="Hyperkalemia (Mild)">Hyperkalemia (Mild)</option>
													<option value="Hyperkalemia (Moderate)">Hyperkalemia (Moderate)</option>
													<option value="Hyperkalemia (Severe)">Hyperkalemia (Severe)</option>
													<option value="Hypertrophy, Biventricular">Hypertrophy, Biventricular</option>
													<option value="Hypertrophy, Left Ventricular">Hypertrophy, Left Ventricular</option>
													<option value="Hypertrophy, Right Ventricular">Hypertrophy, Right Ventricular</option>
													<option value="Hypocalcemia">Hypocalcemia</option>
													<option value="Hypokalemia">Hypokalemia</option>
													<option value="Hypothermia">Hypothermia</option>
													<option value="Junctional">Junctional</option>
													<option value="Long QT Syndrome">Long QT Syndrome</option>
													<option value="STEMI Anterior">STEMI Anterior</option>
													<option value="STEMI Anterolateral">STEMI Anterolateral</option>
													<option value="STEMI Inferior">STEMI Inferior</option>
													<option value="STEMI Lateral">STEMI Lateral</option>
													<option value="STEMI Posterior">STEMI Posterior</option>
													<option value="STEMI Septal">STEMI Septal</option>
													<option value="STEMI LBBB">STEMI LBBB</option>
													<option value="Myocardial Ischemia, Mild">Myocardial Ischemia, Mild</option>
													<option value="Myocardial Ischemia, Moderate">Myocardial Ischemia, Moderate</option>
													<option value="Myocardial Ischemia, Moderate with PVCs 10%">Myocardial Ischemia, Moderate with PVCs 10%</option>
													<option value="Myocardial Ischemia, Moderate with PVCs 25%">Myocardial Ischemia, Moderate with PVCs 25%</option>
													<option value="Myocardial Ischemia, Moderate with PVCs">Myocardial Ischemia, Moderate with PVCs</option>
													<option value="Myocardial Ischemia, Severe">Myocardial Ischemia, Severe</option>
													<option value="Normal Junctional">Normal Junctional</option>
													<option value="NSTEMI">NSTEMI</option>
													<option value="NSTEMI with PVCs 10%">NSTEMI with PVCs 10%</option>
													<option value="NSTEMI with PVCs 25%">NSTEMI with PVCs 25%</option>
													<option value="Paroxysmal Junctional Tachycardia">Paroxysmal Junctional Tachycardia</option>
													<option value="Pericarditis">Pericarditis</option>
													<option value="Premature Atrial Contraction ">Premature Atrial Contraction </option>
													<option value="Premature Ventricular Contraction 10%">Premature Ventricular Contraction 10%</option>
													<option value="Premature Ventricular Contraction 25%">Premature Ventricular Contraction 25%</option>
													<option value="Pulseless Electrical Activity">Pulseless Electrical Activity</option>
													<option value="Sinus">Sinus</option>
													<option value="Sinus Bradycardia">Sinus Bradycardia</option>
													<option value="Sinus Tachycardia">Sinus Tachycardia</option>
													<option value="Sinus with PAC">Sinus with PAC</option>
													<option value="Sinus with PVCs: 10%">Sinus with PVCs: 10%</option>
													<option value="Sinus with PVCs: 25%">Sinus with PVCs: 25%</option>
													<option value="ST Elevation with Chest Pain">ST Elevation with Chest Pain</option>
													<option value="Third Degree AV Block">Third Degree AV Block</option>
													<option value="Torsade de Pointes">Torsade de Pointes</option>
													<option value="Trifascicular Block">Trifascicular Block</option>
													<option value="Ventricular Fibrillation, Coarse">Ventricular Fibrillation, Coarse</option>
													<option value="Ventricular Fibrillation, Fine">Ventricular Fibrillation, Fine</option>
													<option value="Ventricular Tachycardia">Ventricular Tachycardia</option>
													<option value="Ventricular Tachycardia, Pulseless">Ventricular Tachycardia, Pulseless</option>
													<option value="Wellen's Syndrome">Wellen's Syndrome</option>
													<option value="WPW Syndrome, Left Lateral Pathway">WPW Syndrome, Left Lateral Pathway</option>
												</select>

											</td>
											<td><span id="cardiac_rhythm" className="warning"  ></span></td>
										</tr>

										<tr>
											<td width="160" valign="bottom" ><b>Penalty Coefficient</b></td>
											<td><input type="number" name="event_penalty_coefficient" size="35" />
												<br /><span id="event_penalty_coefficient" className="warning"  ></span>
											</td>
											<td></td>
										</tr>

									</table>
								</Col>

								<Col sm={6}>
									<div style={{ border: '1px dashed black', padding: '10px', marginTop: '40px' }}>
										<Table striped bordered condensed hover>
											<thead>
												<tr>
													<th className="bold-header">Look Up Words:</th>
												</tr>
											</thead>
											<tbody>
												{this.state.lookupWordsTable.map((item, index) => (
													<tr key={index}>
														<td>
															<textarea //Note use <textarea> for large input
																type="text"
																name="lookUpWords"
																value={item}
																onChange={event => this.handleInputChange(event, index)}
																style={{ width: '100%', height: '50px' }}

															/>
														</td>
													</tr>
												))}
											</tbody>
										</Table>
										<button type="button" className="btn btn-info" onClick={this.handleAddRow}>Add Row</button>
										<div className="text-center">
											<button type="button" className="btn btn-success" onClick={this.saveRows} >Generate Synonyms</button>
										</div>
									</div>

								</Col>


								<Col sms={6}>
									<br />
									<ReactTable
										style={{ marginTop: "420px", overflow: 'auto'}}
										// data={this.state.lookupSynonyms.map((synonym, index) => ({ synonym, index }))}
										data={this.state.lookupSynonyms.map((synonym, index) => ({ key: index, synonym, index }))}

										columns={[
											{
												Header: 'Look Up Words(Synonyms):',
												accessor: 'synonym', // String-based value accessors!
												Cell: row => <div style={{ textAlign: 'left', paddingLeft: '8', overflowX: 'auto', whiteSpace: 'nowrap' }}>{row.value}</div>

											},
											{
												Header: 'Actions',
												accessor: 'actions',
												width: 100,
												Cell: rowInfo => (
													<button className="btn btn-warning  btn-xs" onClick={() => this.handleSynonymnDelete(rowInfo.index)}>
														Delete
													</button>
												)
											}
										]}
										defaultPageSize={5}
									/>

								</Col>
								<div className="text-center" style={{ marginTop: "20px" }}>
									<Button className="btn-primary" onClick={this.submitevent.bind(this)}>Create Event</Button>
								</div>
							</form>

						</Panel>


						<ReactTable
							columns={this.state.table.columns}
							data={this.state.table.rows}
							defaultFilterMethod={(filter, row) => (String(row[filter.id]) === filter.value)}
							defaultPageSize={10}
							getTdProps={() => ({
								style: {
									textAlign: 'left',

								},
							})}
						/>
						<br />
					</Row>
				</Col>

			</Grid>


		)
	}
}


export default EditScenarioContainer;

