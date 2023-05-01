/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row} from 'react-bootstrap';
import { Button,Col} from 'react-bootstrap';
import axios from 'axios';
import backendlink from '../../config/links.js';
import 'react-table/react-table.css';
import '../Views/NameForm.css';
import './CreateModifyCourseScenarioContainer.css';


class CreateModifyCourseScenarioContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    		scenarioInGeneration:0,
    		scenarioRoles:[],
    		learnerData:[],
    		course_id:this.props.course_id,
			loading:0,
			table: {
				
				columns: [
			
	      ],
				rows: [
					{
						
					}
				]
			}
 };

  }

deleteLearner(id)
{
	var params={};
	params.learner_id = id;
	params.courseId= this.state.course_id;
	axios.get(backendlink.backendlink+'/deleteLearner', {
		params: params
	  })
	.then(function (response) {
		var data=response.data;	
		this.setState({
			learnerData:data.data
		});

	}.bind(this))
	.catch(function (error) {
		alert("There was an error while deleting the learner. Please try again.");
	  });


	  return;
}

  addLearner(){

  		var learnerName = document.getElementById("addLearnerForm").elements["learnerName"].value;
		var rocketId = document.getElementById("addLearnerForm").elements["rocketId"].value;
		var role = document.getElementById("addLearnerForm").elements["role"].value;
		var years = document.getElementById("addLearnerForm").elements["years"].value;
		var faculty = document.getElementById("addLearnerForm").elements["faculty"].value;
		var course_id = this.state.course_id;
  		learnerName=learnerName.trim()
		rocketId=rocketId.trim();
		role=role.trim();
		years=years.trim();
		faculty=faculty.trim();

		console.log(learnerName);
  		if(learnerName.length===0){
  			document.getElementById("learnerName").innerHTML=" *Please enter the Learner Name ";
  		}else{
  			document.getElementById("learnerName").innerHTML="";
  		}

  		if(rocketId.length===0){
  			document.getElementById("rocketId").innerHTML=" *Please enter the Rocket Id";
  		}else{
  			document.getElementById("rocketId").innerHTML="";
  		}

  		if(role.length===0){
  			document.getElementById("role").innerHTML=" *Please enter the role";
  		}else{
  			document.getElementById("role").innerHTML="";
  		}

  		if(isNaN(years)||years.length===0){
  			document.getElementById("years").innerHTML=" *This should only be a number";
  		}else{
  			document.getElementById("years").innerHTML="";
  		}

  		if(faculty.length===0){
  			document.getElementById("faculty").innerHTML=" *Please enter the faculty/Discipline";
  		}else{
  			document.getElementById("faculty").innerHTML="";
  		}

  		var params={};
  		params.learnerName=learnerName; 
  		params.rocketId=rocketId;
		params.role=role;
		params.years=years;
		params.faculty=faculty;
		params.courseId=course_id;
  			
  		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  		axios.get(backendlink.backendlink+'/addLearner', {
	    	params: params
  		})
		.then(function (response) {
			var data=response.data;	
			this.setState({
				learnerData:data.data
			});
			document.getElementById("addLearnerForm").elements["learnerName"].value = "";
		document.getElementById("addLearnerForm").elements["rocketId"].value = "";
		document.getElementById("addLearnerForm").elements["role"].value = "";
		document.getElementById("addLearnerForm").elements["years"].value = "";
		document.getElementById("addLearnerForm").elements["faculty"].value = "";

		}.bind(this))
		.catch(function (error) {
  		});


  		return;




  		// var scenarioDetails= {
  		// 	scenario_name:learnerName,
  		// 	scenario_time:Number(timeduration)*60,
  		// 	category:category
  		// }
  		// if(flag==0){
  		// 	this.setState({
  		// 		scenarioDetails:scenarioDetails,
  		// 		scenarioInGeneration:1
  		// 	});

  		// }


  }


  componentDidMount() {
  	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  		var params={
   			courseId:this.state.course_id
   		}
  		
		axios.get(backendlink.backendlink+'/getLearners',{
			params:params
		})
		.then(function (response) {
			var check = response.data;
			if(check&&check.error){
				window.location.href = "./login";
			
			}
    		
    		
    		
			var data=response.data;	
			this.setState({
				learnerData:data.data
			});
			

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}











 SenarioCreationDiv() {
		
		return (
			<form action="" id="addLearnerForm">
						<table>
							
							<tr>
								<td width="160" valign="bottom" ><b>Learner Name</b></td>
	  							<td><input type="text" name="learnerName" size="35" /></td>
	  							<td><span id="learnerName" className="warning"  ></span></td>
	  							
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Rocket ID</b></td>
	  							<td><input type="text" name="rocketId" size="35" /></td>
	  							<td><span id="rocketId" className="warning"  ></span></td>
	  							
	  						</tr>
	  						<tr>
								<td valign="bottom"><b>Role</b></td>
								<td><input type="text" name="role" size="35"/></td>
								<td><span className="warning" id="role" ></span></td>
							</tr>
							<tr>
								<td valign="bottom"><b>Years</b></td>
								<td><input type="text" name="years" size="35"/></td>
								<td><span className="warning" id="years" ></span></td>
							</tr>	
							<tr>
								<td valign="bottom"><b>Faculty/Department</b></td>
								<td><input type="text" name="faculty" size="35"/></td>
								<td><span className="warning" id="faculty" ></span></td>
							</tr>		
									
						</table>

					 	<Button className="btn success btn-primary" onClick={this.addLearner.bind(this)}>Add Learner</Button>
    				</form>

			);
	
	}


	gotoSpec(id){
		
		window.location.href = "./editScenario?scenario_id="+id;
		
	}

  render() {

  	var learnerData=this.state.learnerData;
  	console.log(learnerData);



  	var rowsHtml=[];
  	rowsHtml.push(
  		<Row className="rowHeader12321151">
			<Col className="headercell134321" sm={2}><b>Learner Name</b></Col>
			<Col className="headercell134321" sm={2}><b>Rocket ID</b></Col>
			<Col className="headercell134321" sm={2}><b>Role</b></Col>
			<Col className="headercell134321" sm={2}><b>Years</b></Col>
			<Col className="headercell134321" sm={2}><b>Faculty</b></Col>
			<Col className="headercell134321" sm={2}><b>  </b></Col>
  		</Row>
  		);

  	var that=this;

  	learnerData.forEach(function(eachrow){
		 
		  if (eachrow["numPlays"] === 0)
				rowsHtml.push(
				<Row className="row12321151">
					<Col className="cell134321" sm={12}>
						<Row>
							<Col sm={2}>{eachrow["LEARNER_NAME"]}</Col>
							<Col sm={2}>{eachrow["ROCKET_ID"]}</Col>
							<Col sm={2}>{eachrow["ROLE"]}</Col>
							<Col sm={2}>{eachrow["YEARS"]}</Col>
							<Col sm={2}>{eachrow["FACULTY"]}</Col>
							<Col sm={2}><div className="btn success btn-primary" onClick={that.deleteLearner.bind(that, eachrow["LEARNER_ID"])}><b><center>Delete</center></b></div></Col>
						</Row>
					</Col>
				</Row>

		  );  
		  else
		  rowsHtml.push(
			<Row className="row12321151">
				<Col className="cell134321" sm={12}>
					<Row>
						<Col sm={2}>{eachrow["LEARNER_NAME"]}</Col>
						<Col sm={2}>{eachrow["ROCKET_ID"]}</Col>
						<Col sm={2}>{eachrow["ROLE"]}</Col>
						<Col sm={2}>{eachrow["YEARS"]}</Col>
						<Col sm={2}>{eachrow["FACULTY"]}</Col>
					</Row>
				</Col>
			</Row>

	  );  
  	})




    return (
		<div className="mainsection53224521">
			<Col sm={12}>
	  		
    		<Row>  
				{this.SenarioCreationDiv()}
	    	</Row>
	    	<br/>
	    	<br/>
	    	<Row>
	    	{rowsHtml}

	    	</Row>

	    </Col>   
    </div>
	
	
    )
  }
}


export default CreateModifyCourseScenarioContainer;  