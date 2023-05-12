/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import { Row, Grid} from 'react-bootstrap';
import { Button, Col} from 'react-bootstrap';
import axios from 'axios';
import backendlink from '../../config/links.js';
import './LoginContainer.css'
class LoginContainer extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
			 
			 };

  }
   componentDidMount() {	  		
		
	}
  login(){
    var flag=0;
    var username = document.getElementById("loginForm").elements["username"].value;
    var password = document.getElementById("loginForm").elements["password"].value;
    if(username.length===0){
        alert(" *Please enter the Event Name ");
        flag=1;
      }
    if(password.length===0){
        alert(" *Please enter the Event Name ");
        flag=1;
      }
      if(flag===0){
        axios.post(backendlink.backendlink+'/login',{
          username:username,
          password:password
        })
    .then(function (response) {
 
      var data = response.data;
      if(data.error){
        alert(data.message);
      }else{
        var token= data.token;
        localStorage.setItem('jwtToken',token);
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
      			<h1 className="h1">Login to Prepare</h1>
      				<form method="post" action="" id='loginForm'>
        				<p><input type="text" name="username" placeholder="Username"/></p>
        				<p><input type="password" name="password" placeholder="Password"/></p>
  
      					<p className="submit"><Button name="commit" value="Login" onClick={()=>{this.login()}} >Login</Button></p>
      				<br/>
      				<br/>
      				</form>
              <br/>
              <br/>
              <div class="login-help">
            <p>Havn't Signed up? <a href="/signup">Click here to sign up</a>.</p>
        </div>
    		</div>
    		
    		</Col>

    		
	    	
	 		</Col>
    
    </Grid>
	
	
    )
  }
}


export default LoginContainer; 