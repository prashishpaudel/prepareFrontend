export default function setAuthorizationToken(token){
	var config= {
  		headers: {'AuthenticationToken': localStorage.jwtToken}
	};

    return config;
}
