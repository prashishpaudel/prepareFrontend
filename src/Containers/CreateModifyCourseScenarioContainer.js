/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel, formgroups, Alert} from 'react-bootstrap';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl, Button, InputGroup, Glyphicon, Col} from 'react-bootstrap';

import Form from 'react-bootstrap-form';
import axios from 'axios';
import backendlink from '../../config/links.js';
import { LinkContainer } from 'react-router-bootstrap';
import setAuthorizationToken from '../Containers/setAuthorizationToken.js' 
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../Views/NameForm.css';
import './CreateModifyCourseScenarioContainer.css';


class CreateModifyCourseScenarioContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    		scenarioInGeneration:0,
    		scenarioRoles:[],
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





   createScenario(){
  		//check if the number of roles is more than one.
  		var flag=0
  		
  		if(this.state && !this.state.scenarioDetails){
  			flag=1;
  		}

  		if(this.state && !this.state.scenarioRoles){
  			flag=1;
  		}

  		if(this.state && this.state.scenarioRoles && this.state.scenarioRoles.length==0){
  			flag=1;
  		}
  		
  		

  		
  		if(flag==0){
  			var params=this.state.scenarioDetails;
  			params.roles=this.state.scenarioRoles;
  			params.course_id=this.state.course_id
  			axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  			axios.get(backendlink.backendlink+'/createscenario', {
	    		params: params
  			})
			.then(function (response) {
				
				var tables={};
			var data=response.data;	
			var that=this;
			
			data.forEach(function(row){
				// if(row['scenario_id']){
				// 	var editScenario='/editScenario?scenario_id='+row['scenario_id'];
				// 	row['scenario_id']='<a href="'+editScenario+'" class="btn btn-success .btn-sm" role="button">Edit Scenario</a>'
				// }

				Object.keys(row).forEach(function(key){
					if(typeof row[key] === "string"){

					if(row[key].includes('<a href="')||row[key].includes('<!--HTML-->')){
						row[key]=<div dangerouslySetInnerHTML={{__html: row[key]}} />;
					}
					}
				});
			});
			
			tables.rows=data;
			if(data.length>0){
				
				tables.columns= new Array();
				
				Object.keys(data[0]).forEach(function (value){
				var temp = {};
				temp.Header=  value;
		    	temp.accessor= value;
		    	temp.id=value;
		    	temp.filterMethod= function(filter, row) {
		    		if(row[filter.id] == null){
		    			return false;
		    		}
		    		var a =row[filter.id].toLowerCase();
		    		var b =  filter.value.toLowerCase();
		    		return a.includes(b);
		    	}
		    	tables.columns.push(temp);
				});
				
				this.setState({
					table:tables,
					scenarioRoles:[],
					scenarioInGeneration:0,
					scenarioDetails:{}

				});

			}else{
				var alert={
					flag:1,
					message:"No data found in this Report"
				}
				this.setState({
					alert:alert,
					scenarioRoles:[],
					scenarioInGeneration:0,
					scenarioDetails:{}});
			}
				

			}.bind(this))
			.catch(function (error) {
  			});

  		}
  }

  nextPhaseScenario(){
  	var scenarioname= document.getElementById("createsenario").elements["scenarioname"].value;
  		var timeduration= document.getElementById("createsenario").elements["timeduration"].value;
  		var category= document.getElementById("createsenario").elements["category"].value;
  		category=category.trim();
  		scenarioname=scenarioname.trim();
  		timeduration=timeduration.trim();
  		var flag=0;
  		if(isNaN(timeduration)||timeduration.length==0){
  			document.getElementById("sduration").innerHTML=" *This should only be a number";
  			flag=1;
  		}else{
  			document.getElementById("sduration").innerHTML="";
  		}
  		if(scenarioname.length==0){
  			document.getElementById("sname").innerHTML=" *Please enter the Scenario Name ";
  			flag=1;
  		}else{
  			document.getElementById("sname").innerHTML="";
  		}

  		if(category.length==0){
  			document.getElementById("category").innerHTML=" *Please enter the Category Name ";
  			flag=1;
  		}else{
  			document.getElementById("category").innerHTML="";
  		}

  		document.getElementById("createsenario").reset();

  		var scenarioDetails= {
  			scenario_name:scenarioname,
  			scenario_time:Number(timeduration)*60,
  			category:category
  		}
  		if(flag==0){
  			this.setState({
  				scenarioDetails:scenarioDetails,
  				scenarioInGeneration:1
  			});

  		}


  }


  componentDidMount() {
  	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  		var params={
   			course_id:this.state.course_id
   		}
  		
		axios.get(backendlink.backendlink+'/getscenariobycourseid',{
			params:params
		})
		.then(function (response) {
			var check = response.data;
			if(check&&check.error){
				window.location.href = "./login";
			
			}
    		
    		var tables={};
			var data=response.data;	
			var that=this;
			
			data.forEach(function(row){
				// if(row['scenario_id']){
				// 	var editScenario='/editScenario?scenario_id='+row['scenario_id'];
				// 	row['scenario_id']='<a href="'+editScenario+'" class="btn btn-success .btn-sm" role="button">Edit Scenario</a>'
				// }

				Object.keys(row).forEach(function(key){
					if(typeof row[key] === "string"){

					if(row[key].includes('<a href="')||row[key].includes('<!--HTML-->')){
						row[key]=<div dangerouslySetInnerHTML={{__html: row[key]}} />;
					}
					}
				});
			});
			
			tables.rows=data;
			if(data.length>0){
				
				tables.columns= new Array();
				
				Object.keys(data[0]).forEach(function (value){
				var temp = {};
				temp.Header=  value;
		    	temp.accessor= value;
		    	temp.id=value;
		    	temp.filterMethod= function(filter, row) {
		    		if(row[filter.id] == null){
		    			return false;
		    		}
		    		var a =row[filter.id].toLowerCase();
		    		var b =  filter.value.toLowerCase();
		    		return a.includes(b);
		    	}
		    	tables.columns.push(temp);
				});
				
				this.setState({table:tables});

			}else{
				var alert={
					flag:1,
					message:"No data found in this Report"
				}
				this.setState({alert:alert});
			}

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}

addRole(){
	var roleLabel= document.getElementById("addRole").elements["roleLabel"].value;
  		var roleNumber= document.getElementById("addRole").elements["roleNumber"].value;
  		roleLabel=roleLabel.trim();
  		roleNumber=roleNumber.trim();
  		
  		var flag=0;
  		if(isNaN(roleNumber)||roleNumber.length==0){
  			document.getElementById("rLabel").innerHTML=" *Enter Number";
  			flag=1;
  		}else{
  			document.getElementById("rLabel").innerHTML="";
  		}
  		if(roleLabel.length==0){
  			document.getElementById("numberRoles").innerHTML=" *Enter Role";
  			flag=1;
  		}else{
  			document.getElementById("numberRoles").innerHTML="";
  		}
  		document.getElementById("addRole").reset();
  		if(flag==0){
  			if(this.state && this.state.scenarioRoles){
  				var scenarioRoles = this.state.scenarioRoles;
  				var temp = {
  					roleLabel:roleLabel,
  					roleNumber:roleNumber
  				};
  				scenarioRoles.push(temp);
  			}
  			this.setState({scenarioRoles:scenarioRoles});
  		}


}

removeRole(i){
	var scenarioRoles = this.state.scenarioRoles;
	scenarioRoles.splice(i);
	this.setState({
		scenarioRoles:scenarioRoles
	});

	
}

displayRoles(){

	var roles=[];
	var that=this;
	
	var scenarioRoles = this.state.scenarioRoles;
	
	scenarioRoles.forEach(function(scenarioRole,i){

		roles.push(
			<div>
				{scenarioRole.roleLabel}-{scenarioRole.roleNumber} 
				<Button bsSize="xsmall" bsStyle="danger" onClick={that.removeRole.bind(that,i)}>Delete Role</Button>
			</div>
			);
	});
	return(
	<div>
		{roles}
	</div>
		);

}

resetRole(){
	this.setState({
		scenarioRoles:[],
		scenarioInGeneration:0,
		scenarioDetails:{}
	});

}

addRolesPart(){
	return(
		<Row>
			<Col sm={7}>
			<form action="" id="addRole">
			<table>
				<tr>
					<td  valign="bottom" ><b>Role:</b></td>
	  				<td><input type="text" name="roleLabel" size="25" /></td>
	  				<td><span id="rLabel" className= "warning"  ></span></td>		
	  			</tr>
	  			<tr>
					<td  valign="bottom" ><b>Number of Trainees:</b></td>
	  				<td><input type="text" name="roleNumber" size="25" /></td>
	  				<td><span id="numberRoles" className= "warning"  ></span></td>		
	  			</tr>
			</table>
			<Button onClick={this.addRole.bind(this)}>Add Role</Button>
			<Button onClick={this.resetRole.bind(this)}>Reset</Button>
			<Button onClick={this.createScenario.bind(this)}>Save Scenario</Button>
			</form>

			</Col>
			<Col sm={5}>
			<b>Roles</b>
			<br/>
			{this.displayRoles()}

			</Col>
		</Row>
		)

}



 SenarioCreationDiv() {
		if(this.state&&this.state.scenarioInGeneration==0){
		return (
			<form action="" id="createsenario">
						<table>
							<table>
							<tr>
								<td width="160" valign="bottom" ><b>Scenario Name</b></td>
	  							<td><input type="text" name="scenarioname" size="35" /></td>
	  							<td><span id="sname" className= "warning"  ></span></td>
	  							
	  						</tr>
	  						<tr>
								<td valign="bottom"><b>Time Duration(Minutes) </b></td>
								<td><input type="text" name="timeduration" size="35"/></td>
								<td><span className= "warning" id="sduration" ></span></td>
							</tr>	
							<tr>
								<td valign="bottom"><b>Type</b></td>
								<td><input type="text" name="category" size="35"/></td>
								<td><span className= "warning" id="category" ></span></td>
							</tr>		
						</table>			
						</table>

					 	<Button className="btn-primary" onClick={this.nextPhaseScenario.bind(this)}>Next</Button>
    				</form>

			);
	}else{
		return(
			<div>
			{this.addRolesPart()}
			</div>
			);
	}
	}


	gotoSpec(id){
		
		window.location.href = "./editScenario?scenario_id="+id;
		
	}

	gotoSpec1(id){
		
		window.location.href = "./playScenario?scenario_id="+id;
		
	}

  render() {

  	var rows=this.state.table.rows;
  

  	var rowsHtml=[];
  	var rowsHtml1=[];
  	rowsHtml.push(
  		<Row className="rowHeader12321151">
  		<Col className="headercell134321" sm={5}>
  		<b>Scenario Name</b>
  		</Col>

  		<Col className="headercell134321" sm={3}>
  		<b>Discipline</b>
  		</Col>

  		<Col className="headercell134321" sm={2}>
  		<b><center>Edit</center></b>
  		</Col>

  		<Col className="headercell134321" sm={2}>
  		<b><center>Play</center></b>
  		</Col>

  		</Row>

  		);

  	var that=this;

  	rows.forEach(function(eachrow){
		rowsHtml.push(
  		<Row className="row12321151">
  		<Col className="cell134321" sm={5}>
			<b>{eachrow['SCENARIO NAME']}</b>
  		</Col>

  		<Col className="cell134321" sm={3}>
			<b>{eachrow['DISCIPLINE']}</b>
  		</Col>

  		<Col onClick={ ()=> that.gotoSpec(eachrow['scenario_id'])}  className="cell134321 btn success" sm={2}>
			<b><center>Edit</center></b>
  		</Col>
  		<Col onClick={ ()=> that.gotoSpec1(eachrow['scenario_id'])}  className="cell134321 btn success" sm={2}>
			<b><center>Play</center></b>
  		</Col>

  		</Row>

  		);  		
  	})




    return (
		<div className="mainsection53224521">
			<Col sm={12}>
	  		
    		<Row>  
				<Button className="btn-primary" onClick={ ()=> this.setState({ open1: !this.state.open1 })}>Create Scenario</Button>
				<Panel collapsible expanded={this.state.open1}>	
					{this.SenarioCreationDiv()}
					
					
	    			</Panel>
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