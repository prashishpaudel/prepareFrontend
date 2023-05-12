/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Panel } from 'react-bootstrap';
import { Button, Col } from 'react-bootstrap';
//import './NameForm.css'; 

import axios from 'axios';
import backendlink from '../../config/links.js';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-table/react-table.css'


class CourseAvgContainer extends Component {

	constructor(props) {
		super(props);


		this.state = {
			course_id: this.props.course_id,
			data: {},
			learnerData: this.props.learnerData,

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
						Header: 'CREATED_AT',
						accessor: 'CREATED_AT'
					},
					{
						Header: 'Trainee Name',
						accessor: 'Trainee Name'
					},
					{
						Header: 'Observer name',
						accessor: 'Observer name'
					},
					{
						Header: 'behavioral AVG',
						accessor: 'behavioral AVG'
					},
					{
						Header: 'psychomotor AVG',
						accessor: 'psychomotor AVG'
					},
					{
						Header: 'cognitive AVG',
						accessor: 'cognitive AVG'
					},
					{
						Header: 'more_info',
						accessor: 'more_info'
					}
				],
				rows: [

				]
			}
		};

	}
	componentDidMount() {
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		var learnerData = this.state.learnerData;

		var learner_ids = [];

		learnerData.forEach(function (eachLearnerData) {
			learner_ids.push(eachLearnerData.LEARNER_ID);
		});

		this.getData(this.state.course_id, learner_ids);




	}


	componentWillReceiveProps(pp) {
		if (pp.learnerData !== this.state.learnerData) {


			this.setState({
				learnerData: pp.learnerData
			});

			var learner_ids = [];

			var learnerData = pp.learnerData;

			learnerData.forEach(function (eachLearnerData) {
				learner_ids.push(eachLearnerData.LEARNER_ID);
			});

			this.getData(this.state.course_id, learner_ids);

		}
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


	filter1() {


		var options1 = document.getElementById("filter1").elements["objectives"].options;
		var objectives = [];

		for (var i = 0, iLen = options1.length; i < iLen; i++) {
			var opt = options1[i];

			if (opt.selected) {
				objectives.push(opt.value || opt.text);
			}
		}


		this.getData(this.state.course_id, objectives);

	}





	getData(course_id, learner_ids) {
		var params = {
			courseId: course_id,
			learner_ids: learner_ids
		}



		axios.get(backendlink.backendlink + '/getCourseOverview', {
			params: params

		})
			.then(function (response) {
				console.log(response.data);
				var check = response.data;
				if (check && check.error) {
					//window.location.href = "./login?message="+check.message;
				}
				var data = check.data;


				this.setState({ data: data });

			}.bind(this))
			.catch(function (error) {

			});
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
				if (data.ID === highlight) {
				}
				individualResult.push(
					<Col className='score' sm={4}>
						<div >
							<Row>
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







	render() {
		var data = this.state.data;
		var assessment = {};
		console.log(data);
		if (data && data.averagePostassessment){
			var averagePostassessment = data.averagePostassessment;
		}
		if (data && data.averagePreassessment){
			var averagePreassessment = data.averagePreassessment;
		}
		if (data && data.averageScenarioEvents){
			var averageScenarioEvents = data.averageScenarioEvents;
		}
		if (averagePreassessment) {

			Object.keys(averagePreassessment).forEach(function (eachQuestion) {
				var eachQuestion1 = eachQuestion.trim();
				if (!assessment[eachQuestion1]) {
					assessment[eachQuestion1] = {};
					assessment[eachQuestion1].preassessment = null;
					assessment[eachQuestion1].postassessment = null;
				}
				if (averagePreassessment[eachQuestion] && averagePreassessment[eachQuestion].count) {
					assessment[eachQuestion1].preassessment = Math.round(averagePreassessment[eachQuestion].total_points / averagePreassessment[eachQuestion].count);
				}



			})

		}


		if (averagePostassessment) {
			Object.keys(averagePostassessment).forEach(function (eachQuestion) {
				var eachQuestion1 = eachQuestion.trim();
				if (!assessment[eachQuestion1]) {
					assessment[eachQuestion1] = {};
					assessment[eachQuestion1].preassessment = null;
					assessment[eachQuestion1].postassessment = null;
				}
				if (averagePostassessment[eachQuestion] && averagePostassessment[eachQuestion].count) {
					assessment[eachQuestion1].postassessment = Math.round(averagePostassessment[eachQuestion].total_points / averagePostassessment[eachQuestion].count);
				}



			});
		}


		var assessmentHTML = [];
		Object.keys(assessment).forEach(function (eachQuestion) {

			var temp = [];
			temp.push(
				<div>{eachQuestion}: </div>
			)

			if (assessment[eachQuestion].preassessment) {
				temp.push(
					<div> Preassessment: {assessment[eachQuestion].preassessment} </div>
				)
			}

			if (assessment[eachQuestion].postassessment) {
				temp.push(
					<div> Postassessment: {assessment[eachQuestion].postassessment} </div>
				)
			}


			assessmentHTML.push(

				<div className="divvx1231">
					{temp}
				</div>


			)




		});

		var scenarioHTML = [];

		if (averageScenarioEvents) {
			Object.keys(averageScenarioEvents).forEach(function (eachScenario) {

				var temphtml = [];

				temphtml.push(
					<br />
				);
				temphtml.push(
					<Col sm={12}>
						<h4>{eachScenario}</h4>
					</Col>
				);

				temphtml.push(
					<br />
				);
				if (averageScenarioEvents[eachScenario]) {

					Object.keys(averageScenarioEvents[eachScenario]).forEach(function (learningEvent) {
						var score = Math.round(averageScenarioEvents[eachScenario][learningEvent].total_points / averageScenarioEvents[eachScenario][learningEvent].count);
						temphtml.push(
							<Col className='score' sm={4}>
								<div >
									<Row>
										<Col sm={8}>

											<h6>
												<b><span className='heading'>Event Name:</span> </b> <br /><b>{averageScenarioEvents[eachScenario][learningEvent].event_name}</b>
											</h6>
											<h6>
												<span className='heading'>Skill: </span><br />{averageScenarioEvents[eachScenario][learningEvent].skill_type} <br />
											</h6>
											<h6>
												<span className='heading'>Specific Skill: </span><br />{averageScenarioEvents[eachScenario][learningEvent].specific_skill}
											</h6>
										</Col>
										<Col sm={4}>
											<br />
											<br />
											<br />
											<div className='inside'>
												<CircularProgressbar percentage={score} />
											</div>
										</Col>
									</Row>
								</div>
							</Col>

						);

					})

				}


				scenarioHTML.push(
					<Row>
						{temphtml}
					</Row>
				)
			});
		}














		return (

			<div className="mainsection53224521">

				<Col sm={12}>



					<Button onClick={() => this.setState({ open1: !this.state.open1 })}>Filter</Button>
					<Panel collapsible expanded={this.state.open1}>
						<form action="" id="filter1">
							<b>Select Learners:</b><br />
							<select multiple name="objectives">
								{this.objectivesObjective()}

							</select>
							<br />

							<Button onClick={this.filter1.bind(this)}>Apply Filter</Button>

						</form>


					</Panel>


					<Row>
						<h3>Assessment Analysis</h3>
					</Row>


					{assessmentHTML}


					{scenarioHTML}

				</Col>

			</div>


		)
	}
}


export default CourseAvgContainer; 