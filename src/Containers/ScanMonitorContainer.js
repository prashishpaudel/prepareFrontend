/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
//import './NameForm.css'; 
import axios from 'axios';
import backendlink from '../../config/links.js';
import './form.css'




class ScanMonitorContainer extends Component { 

	constructor(props) {
		super(props);
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


export default ScanMonitorContainer; 