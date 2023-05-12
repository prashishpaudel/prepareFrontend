/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
//import './NameForm.css'; 

import axios from 'axios';
import backendlink from '../../config/links.js';
import 'react-table/react-table.css'
import acc from '../img/acc.png';
import hr from '../img/hr.png';
import sweat from '../img/sweat.png';
import temp from '../img/temp.png';
import './PhysioContainer.js' 



class PhysioContainer extends Component {

	constructor(props) {
    	super(props);
		this.state = {
			hamza:1,
			active:false,
			physio:
				{accx:"NA",
				accy:"NA",
				accz:"NA",
				BVP:"NA",
				GSR:"NA",
				RR_INTERVAL:"NA",
				SKIN_TEMPERATURE:"NA",
				HEART_RATE:"NA"


			}
		}
 	};








	displayState() {
		axios.defaults.headers.common['authenticationtoken'] = localStorage.jwtToken;
		var params={};
		
		params={};
		params.deviceConnection=this.props.deviceConnection;
		params.serialNumber=this.props.serialNumber;//"A015BD";

		
		axios.get(backendlink.backendlink+'/getStreamData',{ 
    		params: params
  		})
		.then(function (response) {
			// if(check&&check.error){
			// 	window.location.href = "./login?message="+check.message;
			// }

			var data=response.data.data;

			var physio = this.state.physio;


			data.forEach(function(row){
				physio[row.feature]=Math.round(row.value * 100) / 100 
			});

			
			if(data.length===0){
				this.setState({
					active:false
				});	
			}else{
				this.setState({physio:physio,
					active:true
				});
			}

			
			

		}.bind(this))
		.catch(function (error) {
    		this.setState({
					active:false
			});
  		});

	}
  
   componentDidMount() {	

		this.displayState();
		this.interval = setInterval(this.displayState.bind(this), 20000);

	}


  render() {

  	const play_pause={
		width:'45px',
		padding:'5px'
		}

		const boxPhysio={
		border: "1px solid black",
		height:"60px",
		padding:"2px",
		"background-color": "#ffd9cc"
		}


	var physio=this.state.physio;

	var activeS = "No or Waiting";
	if(this.state.active){
		activeS = "Yes";
	}
	
    return (

		<Col sm={12}>
	  		
		  		<Row>
		  			<center>
		  			<Col style={boxPhysio} sm={2}>
		  				<b>Active: {activeS}</b>
		  			</Col>
		  			<Col style={boxPhysio} sm={3}>
		  				<img className="blink" style={play_pause} alt="logo" src={acc} />
			  			<b>accx:</b>{physio.accx} 	 &nbsp;
			  			<b>accy:</b>{physio.accy} 	 &nbsp;
			  			<b>accz:</b>{physio.accz}  	
		  			</Col>
		  
		  			<Col style={boxPhysio} sm={3}>
		  				<img className="blink" style={play_pause} alt="logo" src={hr} />
						<b>bvp:</b>{physio.BVP}  &nbsp;&nbsp;
			  			<b>ibi:</b>{physio.RR_INTERVAL}  &nbsp;&nbsp;
			  			<b>hr:</b>{physio.HEART_RATE}  &nbsp;&nbsp;
		  			</Col>

		  			<Col style={boxPhysio} sm={2}>
		  				<img className="blink" style={play_pause} alt="logo" src={sweat} />
		  				<b>gsr:</b>{physio.GSR}
		  			</Col>
		  			
		  			<Col style={boxPhysio} sm={2}>
		  				<img className="blink" style={play_pause} alt="logo" src={temp} />
		  				<b>temp:</b>{physio.SKIN_TEMPERATURE}
		  			</Col>
		  			</center>
		  		</Row>
		  	
	  	</Col>
	
	
    )
  }
}


export default PhysioContainer; 