/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Panel,} from 'react-bootstrap';
import { Button,  Col,ProgressBar} from 'react-bootstrap';
//import './NameForm.css'; 
import axios from 'axios';
import backendlink from '../../config/links.js';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-table/react-table.css'
import './CourseAnalyticsContainer.css';


class NameForm extends Component {

  constructor(props) {
    super(props);

    
    this.state = {
    	course_id:this.props.course_id,
    	learnerData:this.props.learnerData,
    	data:{},
			
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

		learnerData.forEach(function(eachLearnerData){
			learner_ids.push(eachLearnerData.LEARNER_ID);
		});
 		
	}


	componentWillReceiveProps(pp){
		if(pp.learnerData!==this.state.learnerData){


			this.setState({
				learnerData:pp.learnerData
			});

			var learner_ids = [];

			var learnerData = pp.learnerData;

			learnerData.forEach(function(eachLearnerData){
				learner_ids.push(eachLearnerData.LEARNER_ID);
			});

			this.getData(this.state.course_id, learner_ids);
			
		}
	}



	getData(course_id,learner_ids){
  		var params={
   			courseId:course_id,
   			learner_ids:learner_ids
   		}

   		
   			
		axios.get(backendlink.backendlink+'/getCourseOverview',{
			params:params

		})
		.then(function (response) {
			console.log(response.data);
			var check = response.data;
			if(check&&check.error){
				//window.location.href = "./login?message="+check.message;
			}
			var data=check.data;
			

			this.setState({data:data});

		}.bind(this))
		.catch(function (error) {
    		
  		});
  	}


  	filter(){

		
		var options1= document.getElementById("filter").elements["objectives"].options;
	      var objectives=[];

	      for (var i=0, iLen=options1.length; i<iLen; i++) {
	        var opt = options1[i];

	        if (opt.selected) {
	          objectives.push(opt.value || opt.text);
	        }
	      }


	      this.getData(this.state.course_id,objectives);
  		


  		
	}



  	objectivesObjective(){
		var options=[];
		if(this.state&& this.state.learnerData&& this.state.learnerData.length>0){
			this.state.learnerData.forEach(function(eachlearnerdata){
				options.push(
					<option value={eachlearnerdata.LEARNER_ID}>Name:{eachlearnerdata.LEARNER_NAME} * Role:{eachlearnerdata.ROLE} * Year:{eachlearnerdata.YEARS}</option>
				);
			});

			return options;

		}else{
			return(
				<option value="Problem">Problem</option>
				)
		}
	}




  render() {

	// if (!this.state.data || !this.state.data.goalDetails ) {
	// 	return <div>Loading...</div>;
	//   }

	
	var data=this.state.data;
	console.log(data)
	var goalDetails=data.goalDetails ;
	var objectiveScoreAll=data.objectiveScoreAll ;
	var objectiveScorePost=data.objectiveScorePost;
	var objectiveScorePre=data.objectiveScorePre ;
	var objectiveScoreScenario=data.objectiveScoreScenario;

	var overallgoal=[];
	if(goalDetails){
		Object.keys(goalDetails).forEach(function(eachgoal){
			var objectivehtml=[];
			
			var totalScore=0;
			var totalCount=0;

			goalDetails[eachgoal].forEach(function(objective){
				
				if(objectiveScoreAll[objective]&& objectiveScoreAll[objective][0]>0){
					objectivehtml.push(
							<div>
								<b>Objective: {objective} - </b>{Math.round(objectiveScoreAll[objective][0]/objectiveScoreAll[objective][1])}
								<ProgressBar now={Math.round(objectiveScoreAll[objective][0]/objectiveScoreAll[objective][1])} label={`${Math.round(objectiveScoreAll[objective][0]/objectiveScoreAll[objective][1])}%`} />
							</div>
						)
						totalScore+=objectiveScoreAll[objective][0];
						totalCount+=objectiveScoreAll[objective][1];
				}
				
			});
			if(totalCount>0){

				overallgoal.push(
					<div className="eachRow1234111">
					<Row>
						<Col sm={3}>
							<center>
							<CircularProgressbar percentage={Math.round(totalScore/totalCount)} />
							<h5>Goal: {eachgoal}</h5>
							</center>
						</Col>
						<Col sm={9}>
							{objectivehtml}
						</Col>
					</Row>
					</div>

				)

				




			}
			

		});	
	}

	var pregoal=[];
	if(goalDetails){
		Object.keys(goalDetails).forEach(function(eachgoal){
			
			var objectivehtml=[];
			
			var totalScorePre=0;
			var totalCountPre=0;

			var totalScorePost=0;
			var totalCountPost=0;



			goalDetails[eachgoal].forEach(function(objective){
				
				if( objectiveScorePre[objective] && objectiveScorePre[objective][1] && objectiveScorePost[objective][1] && objectiveScorePre[objective] && objectiveScorePost[objective][1] && objectiveScorePost[objective][1]){
					
					objectivehtml.push(
						<div className="divvx1231">
							<div>
								<h5>{objective}</h5>
							</div>
					
							<div>
								<b>PreAssessment:</b>{Math.round(objectiveScorePre[objective][0]/objectiveScorePre[objective][1])}
								 <ProgressBar bsStyle="danger" now={Math.round(objectiveScorePre[objective][0]/objectiveScorePre[objective][1])} />
							</div>
					
							<div>
								<b>PostAssessment:</b>{Math.round(objectiveScorePost[objective][0]/objectiveScorePost[objective][1])}
								<ProgressBar  now={Math.round(objectiveScorePost[objective][0]/objectiveScorePost[objective][1])} />
							</div>
						</div>
						)


						totalScorePre+=objectiveScorePre[objective][0];
						totalCountPre+=objectiveScorePre[objective][1];
						totalScorePost+=objectiveScorePost[objective][0];
						totalCountPost+=objectiveScorePost[objective][1];
				}
				
			});




			if(totalCountPre>0){
				pregoal.push(
					<div className="eachRow1234111">
					<Row>
						<Col sm={3}>
							<center>
								<h5>Preassessment</h5>
								<div className='preCircularBar'>
									<CircularProgressbar percentage={Math.round(totalScorePre/totalCountPre)} />
								</div>
								<h5>Postassessment</h5>
								<CircularProgressbar percentage={Math.round(totalScorePost/totalCountPost)} />
								<h5>Goal: {eachgoal}</h5>
							</center>
						</Col>
						<Col sm={9}>
							{objectivehtml}
						</Col>
					</Row>
					</div>

				)

			}

			

		});	
	}


	var scenariogoal=[];

	if(goalDetails){
		Object.keys(goalDetails).forEach(function(eachgoal){
			var objectivehtml=[];
			
			var totalScoreScneario=0;
			var totalCountScenario=0;

			



			goalDetails[eachgoal].forEach(function(objective){
				
				if( objectiveScoreScenario[objective] && objectiveScoreScenario[objective][1] && objectiveScorePost[objective][1]){
					objectivehtml.push(
							<div>
								<b>Objective: {objective} - </b>{Math.round(objectiveScoreScenario[objective][0]/objectiveScoreScenario[objective][1])}
								<ProgressBar now={Math.round(objectiveScoreScenario[objective][0]/objectiveScoreScenario[objective][1])} label={`$Math.round(objectiveScoreScenario[objective][0]/objectiveScoreScenario[objective][1])}%`} />
							</div>
						)


					// objectivehtml.push(
					// 		<div>
					// 			<b>Pre {objective}:</b>{Math.round(objectiveScoreScenario[objective][0]/objectiveScoreScenario[objective][1])}
					// 		</div>
					// 	)
						totalScoreScneario+=objectiveScoreScenario[objective][0];
						totalCountScenario+=objectiveScoreScenario[objective][1];
				}
				
			});



			if(totalCountScenario>0){




				scenariogoal.push(
					<div className="eachRow1234111">
					<Row>
						<Col sm={3}>
							<center>
							<CircularProgressbar percentage={Math.round(totalScoreScneario/totalCountScenario)} />
							<h5>Goal: {eachgoal}</h5>
							</center>
						</Col>
						<Col sm={9}>
							{objectivehtml}
						</Col>
					</Row>
					</div>

				)

			}

			

		});	
	}






	

    return (

		<div className="mainsection53224521">

			<Col sm={12}>
	  		<Row>
	    		<h3>Course Analysis</h3>
	  		</Row>

	  		<Button onClick={ ()=> this.setState({ open1: !this.state.open1 })}>Filter</Button>
								
			<Panel collapsible expanded={this.state.open1}>	
				<form action="" id="filter">
					<b>Select Learners:</b><br/>
					<select  multiple  name="objectives">
  							{this.objectivesObjective()}
  							
  					</select>						
					<br/>

					<Button onClick={this.filter.bind(this)}>Apply Filter</Button>
				 	
				</form> 


			</Panel>



	  		<Row>
	    		<h3>Overall Analysis of Goal & Objective Achieved</h3>
	  		</Row>
	  		{overallgoal}

	  		<Row>
	    		<h3>Comparison of Preassessment and Postassessment</h3>
	  		</Row>
	  		{pregoal}


	  		<Row>
	    		<h3>Overall Analysis of Goal & Objective Achieved Based on Instructor Feedback</h3>
	  		</Row>
	  		{scenariogoal}
	 		</Col>
    
    	</div>
	
	
    )
  }
}


export default NameForm; 