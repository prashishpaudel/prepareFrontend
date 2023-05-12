/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel, formgroups, Alert} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col,Modal} from 'react-bootstrap';
//import './NameForm.css'; 
import Form from 'react-bootstrap-form';
import axios from 'axios';
import backendlink from '../../config/links.js';

import setAuthorizationToken from './setAuthorizationToken.js'


import ReactTable from 'react-table';
import queryString from 'query-string';

import FormJson from "react-jsonschema-form";


import  {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


import './DynamicFormContainer.css'






class PreAssessmentFormContainer extends Component { 

	constructor(props) {
		super(props);
		var course_id=this.props.course_id;
		var goals=this.props.goals;
		var heading = this.props.heading;
		var assessment=this.props.assessment;


    
		   
		

		this.state = {
			course_id:course_id,
			open:false,
			preNum:false,
			preNumRange:false,
			preheading:false,
			assessment:assessment,
			goals:goals,
			heading:heading,
      formData:{}
			
			

		};

		

	}

	componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
 	 	if (nextProps.assessment !== this.state.assessment || nextProps.goals !== this.state.goals) {
    		this.setState({ 
    			assessment: nextProps.assessment,
    			goals:nextProps.goals
    		 });
  		}


	}


	componentDidMount(){	


		// axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		// var params={
  		//		course_id:this.state.course_id
  		//  		}
  		//  		var course_id=this.state.course_id;
   			
		// axios.get(backendlink.backendlink+'/speceficcourse',{
		// 	params:params,

		// })
		// .then(function (response) {
			
		// 	var check = response.data;
		// 	var traineeHist=[];
		// 	if(check&&check.error){
		// 		window.location.href = "./login?message="+check.message;
		// 	}
		// 	var tables=this.state.table;
		// 	var data=response.data.playOutput;
		// 	tables.rows=data;

			

			// this.setState({
			// 	goals:goals
			
				
			// });



		// }.bind(this))
		// .catch(function (error) {
    		
  // 		});
	}

	updateassessment(){
		this.props.updateAssessment(this.state.assessment);
	}
	handleClose() {
    	this.setState({ preNum: false });
  	}

  	handleShow() {
    	this.setState({ preNum: true });
  	}

  	handleCloseNumRangePre() {
    	this.setState({ preNumRange: false });
  	}

  	handleShowNumRangePre() {
    	this.setState({ preNumRange: true });
  	}

  	handleCloseMultiPre() {
    	this.setState({ premulti: false });
  	}

  	handleShowMultiPre() {
    	this.setState({ premulti: true });
  	}
  	
  	handleCloseHeading() {
    	this.setState({ preheading: false });
  	}
  	handleShowHeading() {
    	this.setState({ preheading: true });
  	}

  	handleShowSubHeading(){
    	this.setState({ presubheading: true });
  	}
	handleCloseSubHeading(){
    	this.setState({ presubheading: false });
  	}



	
	addMultipleChoicesList(){

		var targetname= document.getElementById("multichoicform").elements["targetname"].value;
  		var description= document.getElementById("multichoicform").elements["description"].value;
  		
  		var options=document.getElementById("multichoicform").elements["options"].value.split(';');
  		var multiplecheckbox=document.getElementById("multichoicform").elements["multiplecheckbox"].checked;

		var options1= document.getElementById("numericForm").elements["goal"].options;
		var goals=[];

		for (var i=0, iLen=options1.length; i<iLen; i++) {
			var opt = options1[i];
			if (opt.selected) {
				goals.push(opt.value || opt.text);
			}
		}

  		
  		var flag=0;
  		document.getElementById("multichoicform").reset();
  		if(targetname.length==0){
  			document.getElementById("warningtargetname").innerHTML=" Please enter the Question ";
  			flag=1;
  		}
  		if(options.length<2){
  			document.getElementById("warningoptions").innerHTML=" Please enter more than one target ";
  			flag=1;
  		}


  		if(flag==0){
  			var temp={};
  			temp['type']="multipleChoice";
  			temp['targetname']=targetname;
  			temp['description']=description;
  			temp['goal']=goals;
  			temp['options']=options;
  			temp['multiplecheckbox']=multiplecheckbox;


  			var assessment=this.state.assessment;
  				assessment.push(temp);
  				
  				this.setState({
  					preassessment:assessment,
  					preNum:false

  				});
  				this.updateassessment();
  		} 		
  	}
  	addNumericQuestion(){

  		var targetname= document.getElementById("numericForm").elements["targetname"].value;
  		var description= document.getElementById("numericForm").elements["description"].value;
  		var options= document.getElementById("numericForm").elements["goal"].options;
      var goals=[];

      for (var i=0, iLen=options.length; i<iLen; i++) {
        var opt = options[i];

        if (opt.selected) {
          goals.push(opt.value || opt.text);
        }
      }


  		var flag=0;
  		document.getElementById("numericForm").reset();



  		if(targetname.length==0){
  			document.getElementById("warningtargetname").innerHTML=" Please enter the Question ";
  			flag=1;
  		}

  		if(flag==0){
  			var temp={};
  			temp['type']="numeric";
  			temp['targetname']=targetname;
  			temp['description']=description;
  			temp['goal']=goals;


  			var assessment=this.state.assessment;
  			assessment.push(temp);

        

  			this.setState({
  				preassessment:assessment,
  				preNum:false

  			});
  			this.updateassessment();
  		} 		
  	}

  	addNumericRangeQuestion(){

  		var targetname= document.getElementById("numericForm").elements["targetname"].value;
  		var description= document.getElementById("numericForm").elements["description"].value;
  		var goal= document.getElementById("numericForm").elements["goal"].value;
  		var minInt= document.getElementById("numericForm").elements["minInt"].value;
  		var maxInt= document.getElementById("numericForm").elements["maxInt"].value;

      var options1= document.getElementById("numericForm").elements["goal"].options;
      var goals=[];

      for (var i=0, iLen=options1.length; i<iLen; i++) {
        var opt = options1[i];

        if (opt.selected) {
          goals.push(opt.value || opt.text);
        }
      }


  		

  		var flag=0;
  		document.getElementById("numericForm").reset();



  		if(targetname.length==0){
  			document.getElementById("warningtargetname").innerHTML=" Please enter the Question ";
  			flag=1;
  		}

  		
  		if(isNaN(minInt)||minInt.length==0 || parseInt(minInt)-Number(minInt)!=0){
  			document.getElementById("warningminInt").innerHTML=" *This should only be a Integer";
  			flag=1;
  		}
  		if(isNaN(maxInt)||maxInt.length==0 || parseInt(maxInt)-Number(maxInt)!=0){
  			document.getElementById("warningmaxInt").innerHTML=" *This should only be a Integer";
  			flag=1;
  		}

  		if(!isNaN(minInt) && !isNaN(maxInt)){
  			if(Number(minInt)>=Number(maxInt)){
  				document.getElementById("warningmaxInt").innerHTML="minInt < maxInt";
  				flag=1;	
  			}
  			
  		}

  		if(flag==0){
  			var temp={};
  			temp['type']="numericRange";
  			temp['targetname']=targetname;
  			temp['description']=description;
  			temp['goals']=goal;
  			temp['minInt']=Number(minInt);
  			temp['maxInt']=Number(maxInt);

  			

  			var assessment=this.state.assessment;
  				assessment.push(temp);

          

  				this.setState({
  					preassessment:assessment,
  					preNumRange:false

  				});
  				this.updateassessment();

  		} 		
  	}
  	addfromHeading(){

  		var targetname= document.getElementById("headingform").elements["targetname"].value;
  		var description= document.getElementById("headingform").elements["description"].value;

  		var flag=0;
  		document.getElementById("headingform").reset();



  		if(targetname.length==0){
  			document.getElementById("warningtargetname").innerHTML=" Please enter the Heading ";
  			flag=1;
  		}

  		if(flag==0){
  			var temp={};
  			temp['type']="heading";
  			temp['targetname']=targetname;
  			temp['description']=description;
  			var assessment=this.state.assessment;
  				
  				assessment.push(temp);
  				
  				this.setState({
  					preassessment:assessment,
  					preheading:false

  				});
  				this.updateassessment();
  		} 		
  	}

  	preassessmentNumeric(){

  		var goals=this.state.goals;
  		var goalOption=[];
  		goalOption.push(
  				<option value="">None</option>
  			);
      


  		goals.forEach(function(goal){
        if(goal && goal.objectives){

          goal.objectives.forEach(function(objective){


          var objectiveSte=objective;
      if(objectiveSte.length<6){
        objectiveSte="    "+objectiveSte+'          ';
      }
      if(objectiveSte.length>40){
        objectiveSte=objectiveSte.slice(0,38);
      }
          goalOption.push(
              <option value={objective}>{objectiveSte}</option>
              
          );
        })

        }
  			
  			
  		});


  		return(
  			<div>
  				
        		<Col className="questionsMenu" sm="12" onClick={this.handleShow.bind(this)}>
        			<b>Add Numeric Questions</b>
        		</Col>
  				<Modal show={this.state.preNum} onHide={this.handleClose.bind(this)}>
	          		<Modal.Body>
	          			<form action="" id="numericForm">
						<table>
							<table>
							<tr>
								<td width="160" valign="bottom" ><b>Question:</b></td>
	  							<td><input type="text" name="targetname" size="35" /></td>
	  							<td><span id="warningtargetname" className= "warning"  ></span></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Description:</b></td>
	  							<td><input type="text" name="description" size="35" /></td>
	  							<td><span id="warningtargetname" className= "warning"  ></span></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Goals:</b></td>
	  							<td>
	  							<select multiple name="goal">
	  								{goalOption}
								</select>	
	  							</td> 
	  							<td></td>	
	  						</tr>
	  								
						</table>			
						</table>
						<Button onClick={this.addNumericQuestion.bind(this)}>Add</Button>
						<Button onClick={this.handleClose.bind(this)}>Close</Button>
						</form>
    			      	
		        	</Modal.Body>
		        </Modal>
        </div>
  			);
  	}

  	preassessmentNumericRange(){
  		var goals=this.state.goals;
      var goalOption=[];
      goalOption.push(
          <option value="">None</option>
        );
      


      goals.forEach(function(goal){
        if(goal && goal.objectives){

          goal.objectives.forEach(function(objective){


          var objectiveSte=objective;
      if(objectiveSte.length<6){
        objectiveSte="    "+objectiveSte+'          ';
      }
      if(objectiveSte.length>40){
        objectiveSte=objectiveSte.slice(0,38);
      }
          goalOption.push(
              <option value={objective}>{objectiveSte}</option>
              
          );
        })

        }
        
        
      });


  		return(
  			<div>
  				
        		<Col className="questionsMenu" sm="12" onClick={this.handleShowNumRangePre.bind(this)}>
        			<b>Add Numerical Range Questions</b>
        		</Col>
  				<Modal show={this.state.preNumRange} onHide={this.handleCloseNumRangePre.bind(this)}>
	          		<Modal.Body>
	          			<form action="" id="numericForm">
						<table>
							<table>
							<tr>
								<td width="160" valign="bottom" ><b>Question:</b></td>
	  							<td><input type="text" name="targetname" size="35" /></td>
	  							<td><span id="warningtargetname" className= "warning"  ></span></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Description:</b></td>
	  							<td><input type="text" name="description" size="35" /></td>
	  							<td></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Minimum Int:</b></td>
	  							<td><input type="text" name="minInt" size="35" /></td>
	  							<td><span id="warningminInt" className= "warning"  ></span></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Maximum Int:</b></td>
	  							<td><input type="text" name="maxInt" size="35" /></td>
	  							<td><span id="warningmaxInt" className= "warning"  ></span></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Goals:</b></td>
	  							<td>
	  							<select multiple name="goal">
	  								{goalOption}
								</select>	
	  							</td>
	  							<td></td>	
	  						</tr>
	  								
						</table>			
						</table>
						<Button onClick={this.addNumericRangeQuestion.bind(this)} >Add</Button><Button onClick={this.handleCloseNumRangePre.bind(this)}>Close</Button>
						</form>
    			      	
		        	</Modal.Body>
		        </Modal>
        </div>
  			);
  	}

  	multipleChoicesList(){
  		var goals=this.state.goals;
      var goalOption=[];
      goalOption.push(
          <option value="">None</option>
        );
      


      goals.forEach(function(goal){
        if(goal && goal.objectives){

          goal.objectives.forEach(function(objective){


          var objectiveSte=objective;
      if(objectiveSte.length<6){
        objectiveSte="    "+objectiveSte+'          ';
      }
      if(objectiveSte.length>40){
        objectiveSte=objectiveSte.slice(0,38);
      }
          goalOption.push(
              <option value={objective}>{objectiveSte}</option>
              
          );
        })

        }
        
        
      });

  		


  		return(
  			<div>
        		<Col className="questionsMenu" sm="12" onClick={this.handleShowMultiPre.bind(this)}>
        			<b>Add Multiple Choice Questions</b>
        		</Col>

  				<Modal show={this.state.premulti} onHide={this.handleCloseMultiPre.bind(this)}>
	          		<Modal.Body>
	          			<form action="" id="multichoicform">
						<table>
							<table>
							<tr>
								<td width="160" valign="bottom" ><b>Question:</b></td>
	  							<td><input type="text" name="targetname" size="35" /></td>
	  							<td><span id="warningtargetname" className= "warning"  ></span></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Description:</b></td>
	  							<td><input type="text" name="description" size="35" /></td>
	  							<td></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Add options Seperated by ";" eg."one;two;three":</b></td>
	  							<td><input type="text" name="options" size="35" /></td>
	  							<td><span id="warningoptions" className= "warning"  ></span></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Multiple Select</b></td>
	  							<td><input name="multiplecheckbox" type="checkbox"/> </td>
	  							<td></td>	
	  						</tr>
	  						<tr>
								<td width="160" valign="bottom" ><b>Goals:</b></td>
	  							<td>
	  							<select multiple name="goal">
	  								{goalOption}
								</select>	
	  							</td>
	  							<td></td>	
	  						</tr>	
	  							
						</table>			
						</table>
						<Button onClick={this.addMultipleChoicesList.bind(this)}>Add</Button><Button onClick={this.handleCloseMultiPre.bind(this)}>Close</Button>
						</form>
    			      	
		        	</Modal.Body>
		        </Modal>
        </div>
  			);
  	}

  	formHeading(){
  		
  		
  			
	  		return(
	  			<div>
	  				<Button bsStyle="primary" bsSize="small" onClick={this.handleShowHeading.bind(this)}>
	          			Add Form Header
	        		</Button>
	  				<Modal show={this.state.preheading} onHide={this.handleCloseHeading.bind(this)}>
		          		<Modal.Body>
		          			<form action="" id="headingform">
							<table>
								<table>
								<tr>
									<td width="160" valign="bottom" ><b>Heading:</b></td>
		  							<td><input type="text" name="targetname" size="35" /></td>
		  							<td><span id="warningtargetname" className= "warning"  ></span></td>	
		  						</tr>
		  						<tr>
									<td width="160" valign="bottom" ><b>Description:</b></td>
		  							<td><input type="text" name="description" size="35" /></td>
		  							<td></td>	
		  						</tr>						
							</table>			
							</table>
							<Button onClick={this.addfromHeading.bind(this)}>Add</Button><Button onClick={this.handleCloseHeading.bind(this)}>Close</Button>
							</form>
	    			      	
			        	</Modal.Body>
			        </Modal>
	        	</div>
	  		)
  	}


  addNasaTlx(){
    var assessment= this.state.assessment;

    var assessment1=[{type: "numericRange", targetname: "Mental Demand", description: "How mentally demanding was the task? (Very Low =0, Very High=100)", goal: "", minInt: 0, maxInt:100, type: "numericRange"},{type: "numericRange", targetname: "Physical Demand", description: "How physically demanding was the task? (Very Low =0, Very High=100)", goal: "", minInt: 0, maxInt:100, type: "numericRange"},{type: "numericRange", targetname: "Temporal Demand", description: "How hurried or rushed was the pace of the task? (Very Low =0, Very High=100)", goal: "", minInt: 0, maxInt:100, type: "numericRange"},{type: "numericRange", targetname: "Performance", description: "How successful were you in accomplishing what you were asked to do? (Failure = 0, Perfect=100)", goal: "", minInt: 0, maxInt:100, type: "numericRange"},{type: "numericRange", targetname: "Effort", description: "How hard did you have to work to accomplish your level of performance? (Very Low =0, Very High=100)", goal: "", minInt: 0, maxInt:100, type: "numericRange"},{type: "numericRange", targetname: "Frustration", description: "How insecure, discouraged, irritated, stressed, and annoyed were you? (Very Low =0, Very High=100)", goal: "", minInt: 0, maxInt:100, type: "numericRange"}];

    assessment1.forEach(function(eachassessment){
      assessment.push(eachassessment);
    });


    this.setState({
      assessment:assessment
    })


  }
	preassessment(){
		return(
			<Row>
					<h5><center>Add Component</center></h5>
					{this.preassessmentNumeric()}
					
					{this.preassessmentNumericRange()}
					
					{this.multipleChoicesList()}
          <Col className="questionsMenu" sm="12" onClick={this.addNasaTlx.bind(this)}>
          <b>Add NASA TLX Form</b>
          </Col>
					
			</Row>
			)
	}

	deleteQuestion(index){
		var assessment=this.state.assessment;
		assessment.splice(index,1);
		this.setState({
			assessment:assessment
		});

		this.updateassessment();
	}
					
	assessmentQuestions(){

		var ques=[];
		var assessments= this.state.assessment;
		var that=this;
		assessments.forEach(function(assessment,index){
			ques.push(
				<Button className="deleteButton" bsStyle="danger" bsSize="xsmall" onClick={that.deleteQuestion.bind(that,index)}>
					{'Q ' + index}  X
				</Button>
				);
		});


		return(
			<Row>
			<h5><center>Delete Component</center></h5>
			
			<div className="deleteQuestionMenu" >{ques}
			</div>


					
			</Row>
			)
	}

	formDisplay(){
		var assessment=this.state.assessment;
    
		console.log(assessment);
    var jsonForm={};
		var uiSchema={};
		jsonForm['properties']={};
		jsonForm["type"]= "object";

    var formData = {};
		var formHtml=[];

		assessment.forEach(function(eachAssessment){
			var temp={};
			temp['type']="numeric";
  			
      console.log(eachAssessment);
      var goals=eachAssessment['goal'];

			if(eachAssessment['type']=="numeric"){

				temp['title']=eachAssessment['targetname'];
				temp['type']="number";
				temp['description']=goals;

				jsonForm['properties'][eachAssessment['targetname']]=temp;


			}
			if(eachAssessment['type']=="numericRange"){
				temp['title']=eachAssessment['targetname'];
				temp['type']="integer";

				temp['description']=goals;
				temp['minimum']=eachAssessment['minInt'];
				temp['maximum']=eachAssessment['maxInt'];
				uiSchema[eachAssessment['targetname']]={
					"ui:widget": "range",
				}
        formData[eachAssessment['targetname']]=(eachAssessment['minInt']+eachAssessment['maxInt'])/2;
				jsonForm['properties'][eachAssessment['targetname']]=temp;
				
			}
			if(eachAssessment['type']=="heading"){
				temp['title']=eachAssessment['targetname'];
				temp['description']=goals;
				jsonForm['properties'][eachAssessment['targetname']]=temp;
        
				
			}


			if(eachAssessment['type']=="multipleChoice"){
				
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
						"ui:widget": "radio"
					}
				}
			}
		});
		var index=0;
		return(
				<Col sm={12}>
				<div>
				<h4>{this.state.heading} Form</h4>
					<FormJson schema={jsonForm}
						uiSchema={uiSchema}
                formData={formData}
        				onChange={console.log("changed")}
        				 onSubmit={({ formData }) =>{
               				 console.log("submitted formData", formData)
               				 console.log(index);
                       this.setState({formData:formData});
               				}

              			}
        				onError={console.log("errors")} />
					</div>
				</Col>
			)
		


	}
	



  render() {
 
 		
	  

	    return (
				<Row>
					<Col sm={4}>
						{this.preassessment()}
						{this.assessmentQuestions()}
					</Col>

					<Col className="formBorder" sm={8}>
						{this.formDisplay()}
					</Col>
					
						
				
		 			
		 		</Row>
		 		
	    
	    	
		
		
	    )
	}
}


export default PreAssessmentFormContainer; 