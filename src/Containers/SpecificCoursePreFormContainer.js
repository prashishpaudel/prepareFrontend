	/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid} from 'react-bootstrap';
import { Button, Col} from 'react-bootstrap';
//import './NameForm.css'; 
import axios from 'axios';
import backendlink from '../../config/links.js';
import FormJson from "react-jsonschema-form";
import queryString from 'query-string';
import './SpecificCourseContainer.css'
 


class SpecificCoursePreFormContainer extends Component {

  constructor(props) {
    super(props);
    var query=queryString.parse(this.props.match.location.search);   

	this.state = {
		course_id:query.course_id,
		preassessment:[],
		courseDetails:[],
		learnerData:[],
		flag:0
	};
  }
  componentDidMount(){	
 	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
 	var params={
   			course_id:this.state.course_id
   		}
   			
		axios.get(backendlink.backendlink+'/speceficcourse',{
			params:params,

		})
		.then(function (response) {


			
			var check = response.data;
			if(check&&check.error){
				window.location.href = "./login?message="+check.message;
			}

			

			var datas=response.data.data;
				var preassessment=[]
			var courseDetails= datas.courseDetails;
			var learnerData = datas.learnerData;
				

			datas.preassessmentData.forEach(function(data){
				
				preassessment.push(JSON.parse(data.TEXT));
			});

			

			

			this.setState({
				preassessment:preassessment,
				courseDetails:courseDetails,
				learnerData:learnerData
			});

			

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}
	

	formDisplay(){
		var assessment=this.state.preassessment;
    
		console.log(assessment);
    var jsonForm={};
		var uiSchema={};
		jsonForm['properties']={};
		jsonForm["type"]= "object";

    var formData = {};
		assessment.forEach(function(eachAssessment){
			var temp={};
			temp['type']="numeric";
  			
      console.log(eachAssessment);
      var goals=JSON.stringify(eachAssessment['goal']);

			if(eachAssessment['type']==="numeric"){

				temp['title']=eachAssessment['targetname'];
				temp['type']="number";
				temp['description']=goals;
				jsonForm['properties'][eachAssessment['targetname']]=temp;


			}
			if(eachAssessment['type']==="numericRange"){
				temp['title']=eachAssessment['targetname'];
				temp['type']="integer";

				temp['description']=goals;
				temp['minimum']=eachAssessment['minInt'];
				temp['maximum']=eachAssessment['maxInt'];
				uiSchema[eachAssessment['targetname']]={
					"ui:widget": "range",
					title: {
   						 classNames: "slider"
  						}
				}
        formData[eachAssessment['targetname']]=(eachAssessment['minInt']+eachAssessment['maxInt'])/2;
				jsonForm['properties'][eachAssessment['targetname']]=temp;
				
			}
			if(eachAssessment['type']==="heading"){
				temp['title']=eachAssessment['targetname'];
				temp['description']=goals;
				jsonForm['properties'][eachAssessment['targetname']]=temp;
        
				
			}


			if(eachAssessment['type']==="multipleChoice"){
				
				if(eachAssessment['multiplecheckbox']){
					temp['type']="array";
					temp['title']=eachAssessment['targetname'];
					temp['description']=goals;
					temp["items"]={
						"type": "string",
						"enum":eachAssessment["options"]
					}
					temp["uniqueItems"]= true;
					jsonForm['properties'][eachAssessment['targetname']]=temp;
					
      			
					uiSchema[eachAssessment['targetname']]={
						"ui:widget": "checkboxes"
					}


				}else{
					temp['type']="string";
					temp['title']=eachAssessment['targetname'];
					temp['description']=goals;
					temp["enum"]=eachAssessment["options"];
					jsonForm['properties'][eachAssessment['targetname']]=temp;
					uiSchema[eachAssessment['targetname']]={
						"ui:widget": "radio",
						 
					}
				}
			}
		});


		


		
		
		return(
				<Col sm={11} className="preform">
				<div>
				<h3>{this.state.heading} Form</h3>
					<FormJson schema={jsonForm}
						uiSchema={uiSchema}
                		formData={formData}
        				onChange={console.log("changed")}
        				 onSubmit={({ formData }) =>{
        				 	console.log(formData);
               				 var course_id= this.state.course_id;
               				 var params={};

               				 params["course_id"]=course_id;
               				 params["learner_id"]=this.state.learner_id;
               				 params["learner_name"]=this.state.learner_name;
               				 params["learnerDetail"]=this.state.learnerDetail; 
               				 params["formData"]=formData; 	
  	 						
  	 						
  							axios.get(backendlink.backendlink+'/savepreassessmentformresponse', {
	    						params: params
  							})
							.then(function (response) {
    							if(response.data.error){
									alert('PLease contact Admin');
								}else{

									this.setState({flag:3});
								}
							}.bind(this))
							.catch(function (error) {
  							});
    


               				 
               				 

                       		
               				}

              			}
        				onError={console.log("errors")} />
					</div>
				</Col>
			)
		


	}


participantInfoForm(){
  	var learnerData =this.state.learnerData;
  	var learnerDataHTML=[];

  	learnerData.forEach(function(eachData,index){
  		learnerDataHTML.push(
  			<option value={index}>{eachData.LEARNER_NAME}/{eachData.ROCKET_ID}/{eachData.LEARNER_ID}</option>
  			);
  	});

  	  	
  	return(
				<div>
				<table>

  							<tr>
								<td width="160" valign="bottom" ><b>Select Subject id</b></td>
	  							<td>
	  							  <select name={"learner"} cols="80">
    									{learnerDataHTML}
  								</select>
	  							
	  							</td>
	  							<td></td>
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Designation(Resident/med student)</b></td>
	  							<td>
		  							<input type="text" name="designation">
		  							</input>
	  							</td>
	  							<td></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Department</b></td>
	  							<td>
		  							<input type="text" name="department">
		  							</input>
	  							</td>
	  							<td></td>	
	  						</tr>

	  						<tr>
								<td width="160" valign="bottom" ><b>Year</b></td>
	  							<td>
		  							<input type="text" name="year">
		  							</input>
	  							</td>
	  							<td></td>	
	  						</tr>

						</table>
				</div>
			);
  }



	



	addLEarner(){
		var learnerIndex = document.getElementById("addLEarner").elements["learner"].value;


		var designation = document.getElementById("addLEarner").elements["designation"].value.trim();
		var department = document.getElementById("addLEarner").elements["department"].value.trim();
		var year = document.getElementById("addLEarner").elements["year"].value.trim();

		var flag=0;
		if(department.length===0){
			flag=1;
		}
		if(department.length===0){
			flag=1;
		}
		if(year.length===0){
			flag=1;
		}

		if(flag===1){
			alert("Enter Complete info");

		}else{
			var learnerData=this.state.learnerData;
			var learnerDetail=learnerData[learnerIndex];
			learnerDetail["designation"]=designation;
			learnerDetail["department"]=department;
			learnerDetail["year"]=year;



			if(learnerIndex){
				this.setState({
					learner_id:learnerData[learnerIndex].LEARNER_ID,
					learner_name:learnerData[learnerIndex].LEARNER_NAME,
					learnerDetail:learnerData[learnerIndex],
					flag:1

				});
			}
		}


			
		

	}

  render() {

		var courseDetails = this.state.courseDetails;
		var Content=[];
		var flag = this.state.flag;
		var courseName='Error';
		if(courseDetails&&courseDetails.length && courseDetails[0].COURSE_NAME){
			courseName=courseDetails[0].COURSE_NAME	
		}

		if(flag===1){
			Content.push(this.formDisplay());
		}else if(flag===0){


			Content.push(
				<form action="" id="addLEarner">
								{this.participantInfoForm()}
					 			<Button onClick={this.addLEarner.bind(this)}>Proceed</Button>
							</form> 
				)
		}else{
			Content.push("Form Submitted, Thank You");
		}

		
    

	    return (
	    

			<Grid >

			
			<Row>
				<h1>Pre-Assessment Form For {courseName}</h1>
			</Row>		
			<Row>

			<Col className="formBorder" sm={12}>
						{Content}
					</Col>
					
					
		 			
		 	</Row>
	    
	    	</Grid>
		
		
	    )
	}
}


export default SpecificCoursePreFormContainer; 