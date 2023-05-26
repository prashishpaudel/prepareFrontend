/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
import '../Views/NameForm.css';
import axios from 'axios';
import backendlink from '../../config/links.js';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './RunContainer.css';

class RunContainer extends Component {
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

					tables.columns=[];
				
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
  		document.getElementById("createsenario").reset();

  		var params= {
  			scenario_name:scenarioname,
  			scenario_time:Number(timeduration)*60
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
					data.forEach(function(row){
				if(row['scenario_id']){
					var runScenario='/playScenario?scenario_id='+row['scenario_id'];
					row['scenario_id']='<a href="'+runScenario+'" class="btn btn-success .btn-sm btn-primary" role="button">Run Scenario</a>'
				}

				Object.keys(row).forEach(function(key){
					if(typeof row[key] === "string"){

					if(row[key].includes('<a href="')||row[key].includes('<!--HTML-->')){
						row[key]=<div dangerouslySetInnerHTML={{__html: row[key]}} />;
					}
					}
				});
			});

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
			data.forEach(function(row){
				if(row['scenario_id']){
					var runScenario='/playScenario?scenario_id='+row['scenario_id'];
					row['scenario_id']='<a href="'+runScenario+'" class="btn btn-primary .btn-sm" role="button">Run Scenario</a>'
				}

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

	

  render() {
    return (
		<Grid>
			<Col sm={12}>
	  		<Row>
	    		<br/>
	    		<h1>Scenarios</h1>
				<br/>
	  		</Row>
	    </Col>   
	    <Col sm={12}>
	   		<ReactTable
							columns={this.state.table.columns}
							data={this.state.table.rows}
							defaultFilterMethod={(filter, row) => (String(row[filter.id]) === filter.value)}
							filterable
				/>
		</Col>
    </Grid>
	
	
    )
  }
}


export default RunContainer;  