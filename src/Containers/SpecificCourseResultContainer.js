/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid } from 'react-bootstrap';
import { Nav, NavItem, Button, Glyphicon, Col, Tab } from 'react-bootstrap';
//import './NameForm.css'; 
import axios from 'axios';
import backendlink from '../../config/links.js';
import queryString from 'query-string';
import ResultContainer from './ResultsContainer1.js';
import ResultContainer3 from './ResultsContainer3.js';
import CourseAnalyticsContainer from './CourseAnalyticsContainer.js'
import CourseAvgContainer from './CourseAvgContainer.js';
import './SpecificCourseContainer.css'


class SpecificCourseResultContainer extends Component {

	constructor(props) {
		super(props);
		var query = queryString.parse(this.props.match.location.search);

		this.state = {
			learnerData: [],
			course_id: query.course_id,
			open: false,
			preNum: false,
			preNumRange: false,
			preheading: false,
			goals: [],
			presubheading: false,
			preassessment: [],
			postassessment: []



		};

		this.addGoal = this.addGoal.bind(this);
		this.saveGoals = this.saveGoals.bind(this);
		this.addObjective = this.addObjective.bind(this);

		this.savePreassessment = this.savePreassessment.bind(this);
		this.savePostassessment = this.savePostassessment.bind(this);





	}
	componentDidMount() {
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		var params = {
			course_id: this.state.course_id
		}
		axios.get(backendlink.backendlink + '/speceficcourse', {
			params: params,

		})
			.then(function (response) {



				var check = response.data;
				if (check && check.error) {
					window.location.href = "./login?message=" + check.message;
				}



				var datas = response.data.data;
				var goalData = []
				var preassessment = []
				var postassessment = []
				var learnerData = datas.learnerData;
				//This datas will have object containing goalData array, courseDetails arrays,preassessmentData arrays,postassesmentData arrays, LearnerData arrays
				console.log(datas);
				var courseName = 'd'
				if (datas && datas.courseDetails) {
					//This will log details of courseDetails array.
					console.log(datas.courseDetails[0]);
					courseName = datas.courseDetails[0].COURSE_NAME;
				}




				datas.goalData.forEach(function (data) {
					goalData.push(JSON.parse(data.GOAL_NAME));
				})

				datas.preassessmentData.forEach(function (data) {

					preassessment.push(JSON.parse(data.TEXT));
				});
				datas.postassessmentData.forEach(function (data) {

					postassessment.push(JSON.parse(data.TEXT));
				});



				this.setState({
					goals: goalData,
					preassessment: preassessment,
					postassessment: postassessment,
					learnerData: learnerData,
					courseName: courseName

				});



			}.bind(this))
			.catch(function (error) {

			});
	}
	savePostassessment(event) {
		var postassessment = this.state.postassessment;
		var params = {};
		params.course_id = this.state.course_id;
		params.postassessment = postassessment;

		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink + '/savepostassessment', {
			params: params
		})
			.then(response => {
				// Handle response here
			})
			.catch(error => {
				// Handle error here
			});


	}
	savePreassessment(event) {
		var preassessment = this.state.preassessment;
		var params = {};
		params.course_id = this.state.course_id;
		params.preassessment = preassessment;
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink + '/savepreassessment', {
			params: params
		})
			.then(response => {
				// Handle response here
			})
			.catch(error => {
				// Handle error here
			});

	}




	saveGoals(event) {
		var goals = this.state.goals;


		var params = {};
		params.course_id = this.state.course_id;
		params.goals = goals;
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink + '/savegoals', {
			params: params
		})
			.then(response => {
				// Handle response here
			})
			.catch(error => {
				// Handle error here
			});


	}


	addObjective(events) {

		var goals = this.state.goals;
		var objective = document.getElementById("ObjectiveForm").elements["objective"].value;
		var goalInd = document.getElementById("ObjectiveForm").elements["goalInd"].value;



		if (objective.length > 0 && goalInd > -1) {
			goals[goalInd].objectives.push(objective);

		}
		document.getElementById("ObjectiveForm").reset();

		this.setState({
			goals: goals
		})




	}

	addGoal(event) {

		var goals = this.state.goals;


		var goal = document.getElementById("goalForm").elements["goal"].value;
		document.getElementById("goalForm").reset();
		if (goal.length > 0) {
			var temp = {};
			temp.objectives = [];
			temp.goalName = goal;
			goals.push(temp);
		}



		this.setState({
			goals: goals
		});
		event.preventDefault();
	}

	remove(index) {
		var goals = this.state.goals;
		goals.splice(index, 1);

		this.setState({
			goals: goals
		});
	}

	displayGoal() {
		var goalshtml = [];
		var goals = this.state.goals;
		var that = this;



		goals.forEach(function (goal, index) {
			goalshtml.push(
				<Row >
					<Col sm={12} valign="bottom" ><h5>Goal Number {index + 1}:</h5></Col>

				</Row>

			);
			goalshtml.push(
				<Row >
					<Col className="blue" sm={10} valign="bottom" ><b>{goal.goalName}</b></Col>
					<Col className="deleteGoal" onClick={that.remove.bind(that, index)} sm={2}><b>Remove</b></Col>
				</Row>

			);

			goal.objectives.forEach(function (eachObjective, index) {
				goalshtml.push(
					<Row >
						<Col sm={2} valign="bottom" ><b>Objective {index + 1}</b></Col>
						<Col className="blue1" sm={10} valign="bottom" ><b>{eachObjective}</b></Col>

					</Row>
				)
			});
		})

		return (
			<div className="goalsObj">


				{goalshtml}


			</div>
		)
	}

	goalObjDiv() {

		var goalsState = this.state.goals;
		var goals = [];
		goalsState.forEach(function (eachGoal, index) {
			var goalStr = eachGoal.goalName;
			if (goalStr.length < 6) {
				goalStr = "    " + goalStr + '          ';
			}
			if (goalStr.length > 40) {
				goalStr = goalStr.slice(0, 38);
			}
			goals.push(
				<option value={index}>{goalStr}</option>

			);
		});



		return (
			<div>
				<br />
				<br />

				<h3>Goal & Objective Module</h3>
				<br />
				<br />


				<form onSubmit={this.addGoal} id="goalForm">
					<table>
						<tr>
							<td width="160" valign="bottom" ><b>Add Goal:</b></td>
							<td><input type="text" name="goal" size="35" /></td>
							<td><Button onClick={this.addGoal.bind(this)} >Add</Button></td>
						</tr>

					</table>

				</form>

				<br />
				<br />


				<form onSubmit={this.addObjective} id="ObjectiveForm">
					<table>
						<tr>
							<td width="160" valign="bottom" ><b>Select Goal:</b></td>
							<td><select name="goalInd">
								{goals}
							</select>	</td>
							<td></td>
						</tr>
						<tr>
							<td width="160" valign="bottom" ><b>Add Objective:</b></td>
							<td><input type="text" name="objective" size="35" /></td>
							<td><Button onClick={this.addObjective.bind(this)} >Add Objective</Button></td>
						</tr>

					</table>

				</form>

				<br />
				<br />
				{this.displayGoal()}





			</div>

		)
	}

	addPreAssessment(assessment) {

		this.setState({
			preassessment: assessment
		})
	}

	addPostAssessment(assessment) {
		this.setState({
			postassessment: assessment
		})
	}

	objectivesObjective() {
		var options = [];
		if (this.state && this.state.learnerData && this.state.learnerData.length > 0) {
			this.state.learnerData.forEach(function (eachlearnerdata) {
				options.push(
					<option value={eachlearnerdata.LEARNER_ID}>Name:{eachlearnerdata.LEARNER_NAME} * Role:{eachlearnerdata.ROLE} * Year:{eachlearnerdata.YEARS}</option>
				);
			});

			return options;

		} else {
			return (
				<option value="Problem">Problem</option>
			)
		}
	}


	gotoPreSpec(id) {

		window.location.href = "./specificCoursePreForm?course_id=" + id;

	}


	gotoPostSpec(id) {

		window.location.href = "./specificCoursePostForm?course_id=" + id;

	}











	render() {
		return (


			<Grid >


				<Row>

					<Col sm={12}>
						<Tab.Container id="left-tabs-example" defaultActiveKey="seventh">
							<Row className="clearfix">
								<Col sm={12}>
									<h5><b>Curriculum Name :  {this.state.courseName}</b></h5>

								</Col>
								<Col sm={3} className="sideMenu123">
									<Nav bsStyle="pills" stacked>

										<NavItem className="sideMenu1" eventKey="seventh"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Results</NavItem>
										<NavItem className="sideMenu1" eventKey="eigth"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Curriculum Analysis</NavItem>
										<NavItem className="sideMenu1" eventKey="ninth"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Average Scores</NavItem>
										<NavItem className="sideMenu1" eventKey="tenth"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Download CSV</NavItem>
									</Nav>
								</Col>
								<Col sm={9} className="mmenu">
									<Tab.Content animation>

										<Tab.Pane eventKey="seventh">
											<ResultContainer course_id={this.state.course_id} />

										</Tab.Pane>

										<Tab.Pane eventKey="eigth">





											<CourseAnalyticsContainer learnerData={this.state.learnerData} course_id={this.state.course_id} />

										</Tab.Pane>

										<Tab.Pane eventKey="ninth">
											{/* Error Part */}

											<CourseAvgContainer course_id={this.state.course_id} learnerData={this.state.learnerData} />

										</Tab.Pane>


										<Tab.Pane eventKey="tenth">
											<ResultContainer3 course_id={this.state.course_id} />


										</Tab.Pane>


									</Tab.Content>
								</Col>
							</Row>
						</Tab.Container>;
					</Col>
					<Col sm={9}>
					</Col>

				</Row>
				<Row>



				</Row>

			</Grid>


		)
	}
}


export default SpecificCourseResultContainer; 