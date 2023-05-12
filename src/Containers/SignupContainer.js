/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid} from 'react-bootstrap';
import { Button,Col} from 'react-bootstrap';
import axios from 'axios';
import backendlink from '../../config/links.js';

import './LoginContainer.css'



class SignupContainer extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
			
			 };

  }
   componentDidMount() {	  		
		
	}

  signup(){
    var flag=0;

    var params={};
    var errorMessage='';
    params['username']  = document.getElementById('signupform').elements['username'].value;
    params['password']  = document.getElementById('signupform').elements['password'].value;
    params['fname']  = document.getElementById('signupform').elements['fname'].value;
    params['lname']  = document.getElementById('signupform').elements['lname'].value;
    params['discipline']  = document.getElementById('signupform').elements['discipline'].value;
    params['experience']  = document.getElementById('signupform').elements['experience'].value;
    
    
    ['username','password','fname','lname','discipline','experience'].forEach(function(key){
    	
    	if(params[key].length===0 && flag===0){
    		flag=1;	
    		errorMessage=key+' is not correct';
    	}

    });

    if(flag===1){
    	alert(errorMessage);

    }
    
      if(flag===0){
       
        axios.post(backendlink.backendlink+'/signup',params)
    .then(function (response) {
 
      var data = response.data;
      if(data.error){
        alert(data.message);
      }else{
        
        window.location.href = "./";
      }


    })
    .catch(function (error) {
        
      });
      }
  }


  render() {
  	
    return (

		<Grid>
			<Col sm={12}>
	  		<Row>
	  		</Row>
	  		<br/>
	  		<br/>
	  		<br/>
	  		<br/>
	  		<br/>
	  		<br/>
	  		<Col sm={4}>
	  		</Col>
	  		<Col sm={4}>
	  		<div className="login">
      			<h1>Signup on Prepare</h1>
      				<form  action="" id='signupform'>
        				<p><input type="text" name="username"  placeholder="Username"/></p>
        				<p><input type="password" name="password"  placeholder="Password"/></p>
        				<p><input type="text" name="fname"  placeholder="First Name"/></p>
        				<p><input type="text" name="lname"  placeholder="Last Name"/></p>
        				
        				<input name='discipline' list="discipline"  placeholder="discipline" />
        				<datalist id="discipline">
        					  
  						</datalist>
  						<br/>
  						<br/>
  						<select name="experience" >
    						<option value="1">Experience less than 1  </option>
    						<option value="2">Experience less than 3  </option>
    						<option value="3">Experience more than 3     </option>
  						</select>

      					
      					<p className="submit"><Button  onClick={()=>{this.signup()}} >Signup</Button></p>
      				<br/>
      				<br/>
      				</form>
    		</div>
    		</Col>

    		
	    	
	 		</Col>
    
    </Grid>
	
	
    )
  }
}


export default SignupContainer; 