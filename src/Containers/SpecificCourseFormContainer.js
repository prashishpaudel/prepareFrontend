	/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel, formgroups, Alert} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col, Modal, Tab} from 'react-bootstrap';
//import './NameForm.css'; 
import Form from 'react-bootstrap-form'; 
import axios from 'axios';
import backendlink from '../../config/links.js';

import setAuthorizationToken from './setAuthorizationToken.js'

import CircularProgressbar from 'react-circular-progressbar';

import ReactTable from 'react-table';

import queryString from 'query-string';

import DynamicFormContainer from './DynamicFormContainer';

import CreateModifyCourseScenarioContainer from './CreateModifyCourseScenarioContainer.js';
import CreateModifyCourseLearnerContainer from './CreateModifyCourseLearnerContainer.js';


import './SpecificCourseContainer.css'


import  {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


 


class SpecificCourseFormContainer extends Component {

  constructor(props) {
    super(props);
    var query=queryString.parse(this.props.match.location.search);   

	this.state = {
		course_id:query.course_id,
		open:false,
		preNum:false,
		preNumRange:false,
		preheading:false,
		goals:[],
		presubheading:false,
		preassessment:[],
		postassessment:[]
		
		

	};

	this.addGoal = this.addGoal.bind(this);
	this.saveGoals=this.saveGoals.bind(this);
	this.addObjective=this.addObjective.bind(this);

	this.savePreassessment=this.savePreassessment.bind(this);
	this.savePostassessment=this.savePostassessment.bind(this);
	


    

  }
  componentDidMount(){	
 	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
 	var params={ 
   			course_id:this.state.course_id
   		}
   		var course_id=this.state.course_id;
   			
		axios.get(backendlink.backendlink+'/speceficcourse',{
			params:params,

		})
		.then(function (response) {


			
			var check = response.data;
			var traineeHist=[];
			if(check&&check.error){
				window.location.href = "./login?message="+check.message;
			}

			

			var datas=response.data.data;
				var goalData=[]
				var preassessment=[]
				var postassessment=[]

				

				datas.goalData.forEach(function(data){
					goalData.push(JSON.parse(data.GOAL_NAME));
				})
				

			datas.preassessmentData.forEach(function(data){
				
				preassessment.push(JSON.parse(data.TEXT));
			});

			datas.postassessmentData.forEach(function(data){
				
				postassessment.push(JSON.parse(data.TEXT));
			});

			

			this.setState({
				goals:goalData,
				preassessment:preassessment,
				postassessment:postassessment
				
			});

			

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}
	savePostassessment(event){
		var postassessment=this.state.postassessment;
		



		var params={};
  			params.course_id=this.state.course_id; 
  			params.postassessment=postassessment;
  			
  			axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  			axios.get(backendlink.backendlink+'/savepostassessment', {
	    		params: params
  			})
			.then(function (response) {

				
				
				

			}.bind(this))
			.catch(function (error) {
  			});


	}
	savePreassessment(event){
		var preassessment=this.state.preassessment;
		

		var params={};
  			params.course_id=this.state.course_id;
  			params.preassessment=preassessment;
  			axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  			axios.get(backendlink.backendlink+'/savepreassessment', {
	    		params: params
  			})
			.then(function (response) {

				
				
				

			}.bind(this))
			.catch(function (error) {
  			});


	}




	saveGoals(event){
		var goals=this.state.goals;
		

		var params={};
  			params.course_id=this.state.course_id;
  			params.goals=goals;
  			axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  			axios.get(backendlink.backendlink+'/savegoals', {
	    		params: params
  			})
			.then(function (response) {

				
				
				

			}.bind(this))
			.catch(function (error) {
  			});


	}


	addObjective(events){

		var goals=this.state.goals;
		var objective= document.getElementById("ObjectiveForm").elements["objective"].value;
		var goalInd=document.getElementById("ObjectiveForm").elements["goalInd"].value;
		
		

		if(objective.length>0 && goalInd>-1){
			goals[goalInd].objectives.push(objective);	

		}
		document.getElementById("ObjectiveForm").reset();
		
		this.setState({
			goals:goals
		})



		
	}

	addGoal(event){
		
		var goals=this.state.goals;


		var goal= document.getElementById("goalForm").elements["goal"].value;
		document.getElementById("goalForm").reset();
		if(goal.length>0){
			var temp = {};
			temp.objectives=[];
			temp.goalName=goal;
			goals.push(temp);
		}



		this.setState({
			goals:goals
		});
		event.preventDefault();
	}

	remove(index){
		var goals=this.state.goals;
		goals.splice(index, 1);

		this.setState({
			goals:goals
		});
	}

	displayGoal(){
		var goalshtml=[];
		var goals=this.state.goals;
		var that = this;



		goals.forEach(function(goal,index){
			goalshtml.push(
				<Row >
					<Col className="blue" sm={10} valign="bottom" ><b>{goal.goalName}</b></Col>
					<Col className="deleteGoal" onClick={that.remove.bind(that,index)}  sm={2}><b>Remove</b></Col>	
	  			</Row>

				);
			
			goal.objectives.forEach(function(eachObjective){
				goalshtml.push(
				<Row >
					<Col  sm={1} valign="bottom" ></Col>
					<Col className="blue1" sm={11} valign="bottom" ><b>{eachObjective}</b></Col>
					
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

	goalObjDiv(){

		var goalsState=this.state.goals;
		var goals=[];
		goalsState.forEach(function(eachGoal,index){
			var goalStr=eachGoal.goalName;
			if(goalStr.length<6){
				goalStr="    "+goalStr+'          ';
			}
			if(goalStr.length>40){
				goalStr=goalStr.slice(0,38);
			}
			goals.push(
  						<option value={index}>{goalStr}</option>
  						
  				);
			});



		return(
			<div>
				{this.displayGoal()}
				<br/>
				<br/>
				<form onSubmit={this.addGoal} id="goalForm"> 
							<table>
							<tr>
								<td width="160" valign="bottom" ><b>Goal:</b></td>
	  							<td><input type="text" name="goal" size="35" /></td>
	  							<td><Button onClick={this.addGoal.bind(this)} >Add</Button></td>	
	  						</tr>
	  								
						</table>			
						
				</form>

				<br/>
				<br/>


				<form onSubmit={this.addObjective} id="ObjectiveForm"> 
							<table>
							<tr>
								<td width="160" valign="bottom" ><b>Goal:</b></td>
	  							<td><select name="goalInd">
	  								{goals}
								</select>	</td>
	  							<td></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Objective:</b></td>
	  							<td><input type="text" name="objective" size="35" /></td>
	  							<td><Button onClick={this.addObjective.bind(this)} >Add Objective</Button></td>	
	  						</tr>
	  								
						</table>			
						
				</form>




					
			</div>

			)
	}

  addPreAssessment(assessment){
  	
    this.setState({
      preassessment:assessment
    })
  }

  addPostAssessment(assessment){
    this.setState({
      postassessment:assessment
    })
  }

  render() {
 
	  	
		const timelineStyle= {
			"background-color":"white",
			"border":"2px dotted grey"
		}

		var preassessment=this.state.preassessment;
		var postassessment=this.state.postassessment;
    

	    return (
	    

			<Grid >

			
			<Row>
			
				<Col sm={12}>
				<Tab.Container id="left-tabs-example" defaultActiveKey="first">
					  <Row className="clearfix">
					    <Col sm={12}>
					    <h5><b>Curriculum # {this.state.course_id}</b></h5>

					    </Col>
					    <Col sm={3} className="sideMenu123">
					      <Nav bsStyle="pills" stacked>
					      
					        <NavItem className="sideMenu1"  eventKey="first"><span className="sideMenu"><Glyphicon glyph="plus" /></span> &nbsp; &nbsp; &nbsp; Add Goals & Objectives</NavItem>
					        <NavItem className="sideMenu1"  eventKey="second"><span className="sideMenu"><Glyphicon glyph="pawn" /></span>&nbsp; &nbsp; &nbsp; Add Pre-assessment</NavItem>
					        <NavItem className="sideMenu1"  eventKey="third"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Add Training Scenario</NavItem>
					        <NavItem className="sideMenu1"  eventKey="fourth"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Add Post-assessment</NavItem>
					        <NavItem className="sideMenu1"  eventKey="fifth"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Add Learners</NavItem>
					        <NavItem disabled  className="sideMenu1"  eventKey="sixth"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Add Instructors</NavItem>
					        <NavItem disabled  className="sideMenu1"  eventKey="seventh"><span className="sideMenu"><Glyphicon glyph="user" /></span>&nbsp; &nbsp; &nbsp; Curriculum Analysis</NavItem>
					      </Nav>
					    </Col>
					    <Col sm={9} className="mmenu">
					      <Tab.Content animation>
					        <Tab.Pane eventKey="first">
					        	{this.goalObjDiv()}
					        		<br/>
									<Button className="submitButton1241231" onClick={this.saveGoals.bind(this)} >Save Goals & Objectives</Button>
					        </Tab.Pane>
					        <Tab.Pane eventKey="second">
					        	<DynamicFormContainer  goals={this.state.goals} assessment={preassessment} updateAssessment={this.addPreAssessment.bind(this)} heading='Pre-assessment' />
                 				 
                 				 <Button onClick={this.savePreassessment.bind(this)} >Save Pre-assessment </Button>
					        </Tab.Pane>
					        <Tab.Pane eventKey="third">
					        	<CreateModifyCourseScenarioContainer course_id={this.state.course_id} />
					        </Tab.Pane>

					        <Tab.Pane eventKey="fourth">
					        	<DynamicFormContainer  goals={this.state.goals} assessment={postassessment} updateAssessment={this.addPostAssessment.bind(this)} heading='Post-assessment' />
								  <Button onClick={this.savePostassessment.bind(this)} >Save Post-assessment </Button>
					        </Tab.Pane>


					        <Tab.Pane eventKey="fifth">
					        	<h5>No shared Learners</h5>
					        	<CreateModifyCourseLearnerContainer course_id={this.state.course_id} />
					        </Tab.Pane>


					        <Tab.Pane eventKey="seventh">
					        	<h5>No shared SBME Curriculum</h5>
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


export default SpecificCourseFormContainer; 