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


import './form.css'




class NameForm extends Component { 

	constructor(props) {
		super(props);
		var course_id=this.props.course_id;
		var goals=this.props.goals;
		var heading = this.props.heading;
		var assessment=this.props.assessment;
		   
		

		this.state = {
			connectedDevices:[]
		};

		

	}

	componentWillReceiveProps(nextProps) {
  


	}


	componentDidMount(){	


		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		var params={
  				dateTime:Date.now()-2000
  		 		}
  		 		
   			
		axios.get(backendlink.backendlink+'/getActiveDevices',{
			params:params,

		})
		.then(function (response) {
			
			var check = response.data;
			var traineeHist=[];
			if(check&&check.error){
				window.location.href = "./login?message="+check.message;
			}

			var data=check.data;


			// var tables=this.state.table;
			// var data=response.data.playOutput;
			// tables.rows=data;

			console.log(data);

			this.setState({
				connectedDevices:data

			});



		}.bind(this))
		.catch(function (error) {
    		
  		});
	}


  render() {
 

 	var connectedDevices = this.state.connectedDevices;
 	

 	var rows=[];

 		rows.push(
 			<tr>
				<th><b>Device Serial Number</b></th>
				<th><b>Device Start Time</b></th>
	  							
	  		</tr>
	  	);


	  	connectedDevices.forEach(function(connectedDevice){


	  		rows.push(
 			<tr>
				<td>{connectedDevice.SERIALNUMBER}</td>
				<td>{connectedDevice.STARTTIME}</td>
	  		</tr>
	  	);
	  	})

 		
	  

	    return (
				<Row>
					<Col sm={12}>
						
					
					<table>
						{rows}
					</table>

					</Col>
						
				
		 			
		 		</Row>
		 		
	    
	    	
		
		
	    )
	}
}


export default NameForm; 