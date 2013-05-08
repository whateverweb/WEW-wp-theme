/**
 * Class that handles several security tasks including login, signup
 * requires Ajax.js,modalview.js
 * 
 * @param {Ajax} ajaxClass
 */
function Guardian(ajaxClass) {
	/*attributes*/
	this.ajaxClient = new ajaxClass();
	this.urlVars = this.getPathAndUrlVars();
	this.hasStorage = this.checkStorage();
	this.isLogged = this.checkLogged();
	
	this.init();
}


/**
 * Initiates the class
 */
Guardian.prototype.init=function(){
	// should check if we are inside index or not and take different decisions
	//detect if we are on desktop
	this.detectEnvironment();
	this.isDesktop=localStorage.getItem("isDesktop")=="true"?true:false;
	
	
	
	try {
		var is_desktop=this.isDesktop;
		this.sessionExpiredModal = new modalView({
			id:"sessionExpired",
			autoShow:false,
			autoHide:false,
			isDesktop:is_desktop,
			type : "m-submit",
			width : 300,
			title : "Session expired",
			content : "<input type='password' name='password' placeholder='Enter your password' >",
			approve : {
				scope : this,
				label : "Continue",
				action : "relogin"
			},
			deny : {
				scope : this,
				label : "Cancel",
				action : "goBackToIndex"
			}
		});
    } catch (e) {
		
	}
	
	if (this.urlVars.isIndex) {
		this.signUpVerify();
		this.resetPassVerify();
	} else {
		if (!this.hasStorage) {
			this.logoutCallback("");
			return;
		} 
		
		
			
		if (!sessionStorage.getItem("id") && WhateverConfig.WebAppHTML.indexOf(this.urlVars.curHTML) > -1) {
			var tmpEmail=localStorage.getItem("rememberedEmail");
			var tmpId=localStorage.getItem("rememberedId");
			if(tmpEmail){
				sessionStorage.setItem("id",tmpId);
				sessionStorage.setItem("userEmail",tmpEmail);
			}else{
				this.logoutCallback("");
			}
		}
	}
	this.adminMenu=document.getElementById("admin-menu");
	if(this.urlVars.isIndex){
		this.loginDiv=document.getElementById("sign-up");
		this.adminMenu=document.getElementById("admin-menu");
		this.spaceship=document.getElementById("spaceship");
		this.spaceshipLoggedIn=document.getElementById("spaceship-logged-in");
	}
	
	if (this.isLogged) {
		this.showAdminMenu();
	}else{
		this.hideAdminMenu();
	}
	
	this.getCheckedTooltips();
}


Guardian.prototype.detectEnvironment=function(forced){
	var isDesktopTxt=localStorage.getItem("isDesktop");
	if(isDesktopTxt===null || isDesktopTxt===undefined || forced){
		this.ajaxClient.addRequestToQueue({
			  method:'GET', 
			  link:WhateverConfig.baseURL+"ddr/capabilities",
			  callbackFunction:this.detectEnvironmentCallback, 
			  responseFormat:"JSON",
			  callbackScope:this,
			  async:false
			});
	}
}


Guardian.prototype.detectEnvironmentCallback=function(responseJSON){
	var is_desktop=responseJSON.is_full_desktop=="true"?true:false ;
	var is_tablet=responseJSON.is_tablet=="true"?true:false ;
	localStorage.setItem("isDesktop",is_desktop);
	localStorage.setItem("isTablet",is_tablet);
}


/**
 * Helper function. Shows the current user email and the logout button 
 */
Guardian.prototype.showAdminMenu=function(){
	if(this.adminMenu){
		this.adminMenu.style.display="block";
	}
	
	if(this.loginDiv){
		this.loginDiv.style.display="none";
		this.spaceship.parentNode.removeChild(this.spaceship);
		this.spaceshipLoggedIn.style.display="block";
		var ribbon=document.getElementById("logged-in-ribbon");
		ribbon.parentNode.removeChild(ribbon);
		var topStripe=document.getElementById("top-stripe");
		topStripe.className="stripe-logged-in";
	}
	/*var userNameContainers = document.getElementsByClassName("user-logo");
	for ( var i = 0; i < userNameContainers.length; i++) {
		userNameContainers[i].innerHTML = sessionStorage.getItem("userEmail");
	}*/
}

/**
 * Helper function. Hides the current user email and the logout button 
 */
Guardian.prototype.hideAdminMenu=function(){
	
	if(this.loginDiv){
		this.loginDiv.style.display="block";
		this.adminMenu.parentNode.removeChild(this.adminMenu);
		this.spaceshipLoggedIn.style.display="none";
	}
}



/**
 * Checks if there is a signUp token.
 * If positive, than signs up
 */
Guardian.prototype.signUpVerify = function() {
    var signupToken = this.urlVars.urlVars["signupToken"];
	if (signupToken) {// the access came from the email
		// got the signup token, now let's login
		var link=WhateverConfig.baseURL + 'core/sec/' + signupToken;
		this.ajaxClient.addRequestToQueue({
			  method:'POST', 
			  link:link,
			  callbackFunction:this.signUpRequestCallback,
			  callbackScope:this, 
			  responseFormat:"JSON"
			});
	}
}


/**
 * Checks if there is a reset token.
 * If positive, than signs up
 */
Guardian.prototype.resetPassVerify = function() {
    var resetToken = this.urlVars.urlVars["resetToken"];
	if (resetToken) {// the access came from the email
		sessionStorage.setItem("resetToken",resetToken);
		window.location.href = ("/resetPassword.html");
	}
}

/**
 * Performs a login
 * 
 * @param {String} 	 email
 * @param {String}   pass
 * @param {Function} callback 
 */
Guardian.prototype.login = function(email, pass, sessionExpires ,callback) {
	this.detectEnvironment(true);
	var link=WhateverConfig.baseURL+'core/sec/login';
	var request={};
	request.email=email;
	request.password=WhateverUtils.fixedEncodeURIComponent(pass);
	request.sessionExpires=sessionExpires;
	this.ajaxClient.addRequestToQueue({
		  method:'POST', 
		  link:link,
		  requestParameters : JSON.stringify(request),
		  requestParametersComputing : false, 
		  callbackFunction:callback,
		  callbackFunctionParameters:[sessionExpires],
		  responseFormat:"JSON"
		});
}

/**
 * Performs a signUp
 * 
 * @param {String} 	 email
 * @param {String}   pass
 * @param {Function} callback 
 */
Guardian.prototype.signUp = function(email, pass, callback) {
	var link = WhateverConfig.baseURL + 'core/user/' + email + '/' + WhateverUtils.fixedEncodeURIComponent(pass) + '/';
	this.ajaxClient.addRequestToQueue({
		  method:'POST', 
		  link:link,
		  callbackFunction:callback, 
		  responseFormat:"JSON"
		});
}


/**
 * Callback for signUp
 * 
 * @param {Object} 	resultJSON 
 */
Guardian.prototype.signUpRequestCallback = function(resultJSON) {
	if (resultJSON.statusCode) {
		var errorField=document.getElementById("login-form").getElementsByClassName("form-errors")[0];
		errorField.style.display="block";
		switch (resultJSON.statusCode) {
		   case "401":
				errorField.innerHTML="Account already confirmed. Please login";
				break;
			case "500":
				errorField.innerHTML="Internal server error";
				break;
			case "200":
				sessionStorage.setItem("id", resultJSON["id"]);
				window.location.href = ("/myApplications.html");
		}
	} else {
		if (resultJSON["id"] && this.hasStorage) {
			var userEmail=resultJSON["email"];
			sessionStorage.setItem("userEmail", userEmail);
			sessionStorage.setItem("id", resultJSON["id"]);
			var isDesktop=localStorage.getItem("isDesktop")=="true"?true:false;
			var isTablet=localStorage.getItem("isTablet")=="true"?true:false;
			if(isDesktop || isTablet){
				localStorage.setItem(userEmail+".menuLeftExpanded","true");
			}else{
				localStorage.setItem(userEmail+".menuLeftExpanded","false");
			}
			window.location.href = ("/myApplications.html");
		}
	}
}

/**
 * Shows a modal view
 */
Guardian.prototype.showRelogin = function() {
	this.sessionExpiredModal.show();
}


/**
 * Performs a (re)login using data in the local storage object
 */
Guardian.prototype.relogin = function() {
	// try to get the signUp token 

	var email = sessionStorage.getItem("userEmail");
	var pass = this.sessionExpiredModal.inputs.password;
    
	sessionStorage.removeItem("id");
	if (pass.length < 6) {
		this.sessionExpiredModal.showError("Please enter a valid password");
	} else {
		var link=WhateverConfig.baseURL+'core/sec/login';
		var request={};
		request.email=email;
		request.password=WhateverUtils.fixedEncodeURIComponent(pass);
		request.sessionExpires="true";
		var scope=this;
		this.ajaxClient.addRequestToQueue({
			  method:'POST', 
			  link:link,
			  requestParameters : JSON.stringify(request),
			  requestParametersComputing : false, 
			  callbackFunction:this.reloginCallback, 
			  responseFormat:"JSON",
			  callbackScope:scope
			});
	}
}


/**
 * Callback for the relogin function
 * 
 * @param {Object} 	 resultJSON 
 */
Guardian.prototype.reloginCallback = function(resultJSON) {
	if (resultJSON.statusCode) {// if there is any error code
		switch (resultJSON.statusCode) {
			case "401":
				// than we have a problem
				this.sessionExpiredModal.showError("Wrong password.");
				break;
			case "500":
				this.sessionExpiredModal.showError("Internal server error.");
				break;
			}
	} else {
		sessionStorage.setItem("id", resultJSON["id"]);
		if(sessionStorage.getItem("userEmail")==localStorage.getItem("rememberedEmail")){
			localStorage.setItem("rememberedId",resultJSON["id"]);
		}
		window.location.href=window.location.href;
	}
}


/**
 * Performs a logout
 */
Guardian.prototype.logout = function() {
		var sessionToken = sessionStorage.getItem("id");
		var link=WhateverConfig.baseURL + 'core/sec/' + sessionToken;
		this.ajaxClient.addRequestToQueue({
			  method:'DELETE', 
			  link:link,
			  callbackFunction:this.logoutCallback, 
			  responseFormat:"JSON"
			});
}


/**
 * Callback for logout action
 * 
 * @param {Object} 	 response
 */
Guardian.prototype.logoutCallback = function(response) {
	var currentId=sessionStorage.getItem("id");
	var rememberedId=localStorage.getItem("rememberedId");
	if(currentId==rememberedId){
		localStorage.removeItem("rememberedId");
		localStorage.removeItem("rememberedEmail");
	}
	sessionStorage.removeItem("id");
	window.location.href = ("/");

}

/**
 * Performs a change password action
 * 
 * @param {String} 	 email
 * @param {String}   pass
 * @param {String}   token
 * @param {Function} callback 
 */
Guardian.prototype.changePass = function(email,oldPass, pass, token, callback) {
	var link=WhateverConfig.baseURL + 'core/user/' + email + '/' +WhateverUtils.fixedEncodeURIComponent(oldPass)+'/'+ WhateverUtils.fixedEncodeURIComponent(pass) + '/' + token;
	this.ajaxClient.addRequestToQueue({
		  method:'PUT', 
		  link:link,
		  callbackFunction:callback, 
		  responseFormat:"JSON",
		});
}

/**
 * Performs a reset password action
 * 
 * @param {String} 	 email
 * @param {String}   pass
 * @param {String}   token
 * @param {Function} callback 
 */
Guardian.prototype.resetPass = function(pass, token, callback) {
	var link=WhateverConfig.baseURL + 'core/user/reset/confirm/' + token + '/' + WhateverUtils.fixedEncodeURIComponent(pass);
	this.ajaxClient.addRequestToQueue({
		  method:'POST', 
		  link:link,
		  callbackFunction:callback, 
		  responseFormat:"JSON",
		});
}

/**
 * Checks if the user is logged
 */
Guardian.prototype.checkLogged = function() {
	var curUser = sessionStorage.getItem("userEmail");
	var curId = sessionStorage.getItem("id");
	if (curUser && curId) {
		return true;
	}
	return false;
}


/**
 * Check if the browser supports local storage Object
 */
Guardian.prototype.checkStorage = function() {
	try {
		sessionStorage.setItem("mod", "mod");
		sessionStorage.removeItem("mod");
		return true;
	} catch (e) {
		return false;
	}
}


/**
 * Gets the URL and URL variables of the current page
 * Also check if index is the current page
 */
Guardian.prototype.getPathAndUrlVars = function() {
	var vars = [], hash;
	var hashes = window.location.href.slice(
			window.location.href.indexOf('?') + 1).split('&');
	var path = window.location.pathname;
	path = path.split("/");
	path = path[path.length - 1];

	var isIndex = false;
	if (path == "" || path == "index.html") {
		isIndex = true;
	}

	for ( var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}

	path = path.split(".")[0];
	return {
		urlVars : vars,
		isIndex : isIndex,
		curHTML : path
	}
}


/**
 * Redirects to index.html
 */
Guardian.prototype.goBackToIndex = function() {
	this.logoutCallback("");
}



/**
 * Checks all tooltips allready accessed
 * 
 */
Guardian.prototype.getCheckedTooltips = function() {
	var userEmail=sessionStorage.getItem("userEmail");
	if(!userEmail){
		return;
	}
	
	var allReadyChecked=localStorage.getItem(userEmail+'.'+'tooltipsChecked');
	if(allReadyChecked=='true'){
		return;
	}
	
	var link=WhateverConfig.baseURL + 'core/account/marker/' + userEmail;
	this.ajaxClient.addRequestToQueue({
		  method:'GET', 
		  link:link,
		  callbackFunction:this.getCheckedTooltipsCallback,
		  callbackScope : this,
		  responseFormat:"JSON"
		});
}

Guardian.prototype.getCheckedTooltipsCallback = function(resultJSON) {
	var userEmail=sessionStorage.getItem("userEmail");
	if(!userEmail){
		return;
	}
	
	if(!resultJSON.statusCode){
		for(var i=0;i<resultJSON.length;i++){
			localStorage.setItem(userEmail+'.'+resultJSON[i].markerName,"checked");
		}
	}
	localStorage.setItem(userEmail+'.'+'tooltipsChecked','true');
}


/**
 * Checks all tooltips allready accessed
 * 
 */
Guardian.prototype.setCheckedTooltip = function(id) {
	var userEmail=sessionStorage.getItem("userEmail");
	if(!userEmail){
		return;
	}
	var link=WhateverConfig.baseURL + 'core/account/marker/'+ id +'/' + userEmail;
	this.ajaxClient.addRequestToQueue({
		  method:'PUT', 
		  link:link,
		  callbackFunction:this.setCheckedTooltipCallback,
		  callbackScope : this,
		  responseFormat:"TEXT"
		});
}

Guardian.prototype.setCheckedTooltipCallback = function(result) {

}

Guardian.prototype.retreiveStorageAppsList=function(userEmail){
	try{
		var storageAppAliases=localStorage.getItem(userEmail+".storageAppAliases").split(",");
		var storageAppKeys=localStorage.getItem(userEmail+".storageAppKeys").split(",");
		var storageAppNames=localStorage.getItem(userEmail+".storageAppNames").split(",");
		var storageAppActive=localStorage.getItem(userEmail+".storageAppActive").split(",");
	
	return{
		"storageAppAliases":storageAppAliases,
		"storageAppKeys":storageAppKeys,
		"storageAppNames":storageAppNames,
		"storageAppActive":storageAppActive
	};
   }catch(e){
	   return{
			"storageAppAliases":[],
			"storageAppKeys":[],
			"storageAppNames":[],
			"storageAppActive":[]
		}; 
   }
}

Guardian.prototype.saveAppList=function(userEmail,appList){
	localStorage.setItem(userEmail+".storageAppAliases",appList.storageAppAliases);
	localStorage.setItem(userEmail+".storageAppKeys",appList.storageAppKeys);
	localStorage.setItem(userEmail+".storageAppNames",appList.storageAppNames);
	localStorage.setItem(userEmail+".storageAppActive",appList.storageAppActive);
}


var myGuardian = new Guardian(Ajax);
