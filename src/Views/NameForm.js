/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid, Panel} from 'react-bootstrap';
import { Button, Col} from 'react-bootstrap';
import './NameForm.css';
import axios from 'axios';
import backendlink from '../../config/links.js';
import 'react-table/react-table.css'

class NameForm extends Component { 
  constructor(props) {
    super(props);
    this.state = {
			loading:0,
			table: {
				sort: {
					column: "age",
					order: "desc"
				},
				columns: [
					{
		        Header: 'id',
		        accessor: 'id'
		      },
		      {
		        Header: 'age',
		        accessor: 'age'
		      },
		      {
		        Header: 'sex',
		        accessor: 'sex'
		      },
		      {
		      	Header: 'diagnosis',
		      	accessor: 'diagnosis',
		      },
		      {
		      	Header: 'los',
		      	accessor: 'los'
		      }
	      ],
				rows: [
					{
						id: "LOADING DATA",
						age: "LOADING DATA",
						sex: "LOADING DATA",
						diagnosis: "LOADING DATA",
						los: "LOADING DATA"
					}
				]
			}
 };

  }

  deleteScenario(scenario_id){
  		console.log('deleteScenario')
  		var flag=0;
  		var params= {
  			scenario_id:scenario_id,
  		}
  		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  		if(flag===0){
  			axios.get(backendlink.backendlink+'/deletescenario', {
	    		params: params
  			})
			.then(function (response) {
				
    			var tables={};
				var data=response.data;	

				tables.rows=data;

				if(data.length>0){

					tables.columns= [];
				
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
				
				}

			}.bind(this))
			.catch(function (error) {
  			});

  		}
  }
  createScenario(){
  		var scenarioname= document.getElementById("createsenario").elements["scenarioname"].value;
  		var timeduration= document.getElementById("createsenario").elements["timeduration"].value;
  		var category= document.getElementById("createsenario").elements["category"].value;
  		category=category.trim();
  		scenarioname=scenarioname.trim();
  		timeduration=timeduration.trim();
  		var flag=0;
  		if(isNaN(timeduration)||timeduration.length===0){
  			document.getElementById("sduration").innerHTML=" *This should only be a number";
  			flag=1;
  		}else{
  			document.getElementById("sduration").innerHTML="";
  		}
  		if(scenarioname.length===0){
  			document.getElementById("sname").innerHTML=" *Please enter the Scenario Name ";
  			flag=1;
  		}else{
  			document.getElementById("sname").innerHTML="";
  		}

  		if(category.length===0){
  			document.getElementById("category").innerHTML=" *Please enter the Category Name ";
  			flag=1;
  		}else{
  			document.getElementById("category").innerHTML="";
  		}

  		document.getElementById("createsenario").reset();

  		var params= {
  			scenario_name:scenarioname,
  			scenario_time:Number(timeduration)*60,
  			category:category
  		}
  		if(flag===0){
  			axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
  			axios.get(backendlink.backendlink+'/createscenario', {
	    		params: params
  			})
			.then(function (response) {
				
    			var tables={};
				var data=response.data;	
				tables.rows=data;

				if(data.length>0){

					tables.columns= [];
				
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
				console.log(this.state.table.rows);


				
				}else{
				
				}

			}.bind(this))
			.catch(function (error) {
  			});

  		}
  }
  componentDidMount() {
  	axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		axios.get(backendlink.backendlink+'/getscenario')
		.then(function (response) {
			var check = response.data;
			if(check&&check.error){
				window.location.href = "./login";
			
			}
    		
    		var tables={};
			var data=response.data;	
			console.log(data);
			data.forEach(function(row){

				Object.keys(row).forEach(function(key){
					if(typeof row[key] === "string"){

					if(row[key].includes('<Button')||row[key].includes('<!--HTML-->')){
						row[key]=<div dangerouslySetInnerHTML={{__html: row[key]}} />;
					}
					}
				});
			});
			
			tables.rows=data;
			if(data.length>0){
				
				tables.columns= [];
				
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
				var elert={
					flag:1,
					message:"No data found in this Report"
				}
				this.setState({elert:elert});
			}

		}.bind(this))
		.catch(function (error) {
    		
  		});
	}

	displayRows(){
		var rows=this.state.table.rows;
		var trs=[];
		var that=this;
		trs.push(
			<tr>
				<th>Scenario Name</th>
				<th>Discipline</th>
				<th>Delete</th>
			</tr>
			);

		rows.forEach(function(row){

			
			
			trs.push(
				<tr>
					<td>{row['SCENARIO NAME']}</td>
					<td>{row['CATEGORY']}</td>
					<td><Button onClick={() => that.deleteScenario(row['scenario_id'])} bsStyle="danger">Delete</Button></td>
				</tr>
				);
		});

		return(
				<table>
				{trs}
				</table>
			);
	}

  render() {
    return (
		<Grid>
			<Col sm={12}>
	  		<Row>
	    		<br/>
	    		<h1>Scenarios</h1>
				<br/>
	  		</Row>
    		<Row>
				<Button onClick={ ()=> this.setState({ open1: !this.state.open1 })}>Create Scenario</Button>
				<Panel collapsible expanded={this.state.open1}>	
					<form action="" id="createsenario">
						<table>
							<tr>
								<td width="160" valign="bottom" ><b>Scenario Name</b></td>
	  							<td><input type="text" name="scenarioname" size="35" /></td>
	  							<td><span id="sname" className="warning"  ></span></td>
	  							
	  						</tr>
	  						<tr>
								<td valign="bottom"><b>Time Duration(Minutes) </b></td>
								<td><input type="text" name="timeduration" size="35"/></td>
								<td><span className="warning" id="sduration" ></span></td>
							</tr>	
							<tr>
								<td valign="bottom"><b>Category</b></td>
								<td><input type="text" name="category" size="35"/></td>
								<td><span className="warning" id="category" ></span></td>
							</tr>			
						</table>
					 	<Button onClick={this.createScenario.bind(this)}>Create Scenario</Button>
    				</form> 
	    			</Panel>
	    	</Row>
	    </Col>   
	    <Col sm={12}>
	    				<table>
	    				{this.displayRows()}
	    				</table>
					</Col>
    </Grid>
	
	
    )
  }
}


export default NameForm; 