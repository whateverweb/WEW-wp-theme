var masterContainer=document.getElementById("sign-up-body");

var singleForm = document.getElementById("login-form");
var loginErrorField=singleForm.getElementsByClassName("form-errors")[0];

var forgotPasswordForm=document.getElementById("forgot-password");
var forgotPasswordFormErrorField=forgotPasswordForm.getElementsByClassName("form-errors")[0];

var registerLoading=document.getElementById("register-loading");


var welcomeMessage=document.getElementById("welcome-message");

var termsAndConditionsContainer=document.getElementById("terms-agree");
var termsAndConditionsContainerCheckBox=termsAndConditionsContainer.getElementsByTagName("input")[0];
termsAndConditionsContainer.style.display="none";

var registerCommand=sessionStorage.getItem("registerCommand");
sessionStorage.removeItem("registerCommand");

var forgotPass = document.getElementById("forgot-password-button");


var screens=[];
screens["login"]=singleForm;
screens["forgotpass"]=forgotPasswordForm;
screens["welcome"]=welcomeMessage;




var submitButton = document.getElementById("submit-btn");
/*var title = document.getElementById("sign-up-title").getElementsByTagName("span")[0];
var title2= document.getElementById("sign-up-title").getElementsByTagName("span")[1];*/



var pwd2 = singleForm.pwd2.parentNode.cloneNode(true);

var action = "login";

var loginErrorOccured=true;

var userEmail;

pwd2parent = singleForm.pwd2.parentNode.parentNode;
pwd2parent.removeChild(singleForm.pwd2.parentNode);



singleForm.email.onkeyup = singleForm.pwd1.onkeyup = function() {
	if (singleForm.email.value == "") {
		singleForm.pwd1.value = "";
		try {
			pwd2parent.removeChild(pwd2);
		} catch (e) {}

		forgotPass.style.display = "";
		action = "login";
		submitButton.value = "Continue";
		/*title.innerHTML = "Login or Register.";
		title2.innerHTML=" It\'s completely FREE!";*/
		singleForm.pwd1.className="last-element";
		termsAndConditionsContainer.style.display="none";
	}
	if(loginErrorOccured){
		clearLoginErrorMessage();
	}
}


showLogin();
if(registerCommand){
	 CheckIfMailExistsCallback({statusCode:"404"});
}

function clearLoginErrorMessage(){
	loginErrorField.innerHTML="";
	loginErrorField.style.display="none";
	loginErrorOccured=false;
	
}

function toogleScreens(id){
	resetAll();
	for(var i in screens){
		screens[i].style.display="none";
	}
	screens[id].style.display="";
}

function showForgotPassword(){
	forgotPasswordFormErrorField.innerHTML="";
	forgotPasswordFormErrorField.style.display="none";
	toogleScreens("forgotpass");
	
	forgotPasswordForm.getElementsByTagName("input")[0].focus();
	forgotPasswordForm.getElementsByTagName("input")[1].focus();
}

function showLogin(){
	toogleScreens("login");
	singleForm.email.focus();
	singleForm.pwd1.focus();
	try{
		singleForm.pwd2.focus();
	}catch(e){}
	singleForm.getElementsByTagName("input")[3].focus();
}

function showWelcomeMessage(){
	toogleScreens("welcome");
}

function testActionType() {
	clearLoginErrorMessage();
	checkIfSignup(singleForm);
	singleForm.pwd1.focus();
	return false;
}

function submitForm(loginForm) {
	if (action == "login") {
		checkFormLogin(loginForm);
	} else {
		checkFormSignup(loginForm);
	}
	return false;
}

function checkIfSignup(form) {
	
	var rules = [ {
		field : "email",
		rules : [ "notempty", 'email' ],
		errors : [ "Please enter your email.", "Email not valid!" ]
	} ]

	formValidator.validate(form, rules, function(error) {}, CheckIfMailExistsSuccess);
}

function CheckIfMailExistsSuccess(form) {
	var link = WhateverConfig.baseURL + 'core/user/verify/email/' + form.email.value;
	myGuardian.ajaxClient.addRequestToQueue({
		method : 'GET',
		link : link,
		callbackFunction : CheckIfMailExistsCallback,
		responseFormat : "JSON"
	});
}

function CheckIfMailExistsCallback(responseJSON) {
	if (responseJSON.statusCode) {
		switch (responseJSON.statusCode) {
			case "200":
				try {
					pwd2parent.removeChild(pwd2);
				} catch (e) {}
				singleForm.pwd1.className="last-element";
				forgotPass.style.display = "";
				action = "login";
				submitButton.value = "Login";
				/*title.innerHTML = "Login.";
				title2.innerHTML=" And let\'s WEB!";*/
				termsAndConditionsContainer.style.display="none";
				break;
			case "404":
				try {
					pwd2parent.insertBefore(pwd2,loginErrorField);
					var field=pwd2.getElementsByTagName("input")[0];
					field.className="last-element";
					field.value="";
					pwd2.style.display="block";
					formValidator.setFieldBehavure(field);
				} catch (e) {}
				singleForm.pwd1.className=null;
				forgotPass.style.display = "none";
				action = "signup";
				/*title.innerHTML = "Register.";
				  title2.innerHTML=" It\'s Fast, Easy and FREE!";*/
				submitButton.value = "Register";
				
				termsAndConditionsContainerCheckBox.checked=false;
				termsAndConditionsContainer.style.display="block";
				break;
		}
		
	}
}

function checkFormSignup(form) {
	if(!termsAndConditionsContainerCheckBox.checked){
		showLoginError("In order to use our services, you must agree to WhateverWeb's Terms of Service and Privacy Policy.",false);
		return false;
	}
	var rules = [
			{
				field : "email",
				rules : [ "notempty", 'email' ],
				errors : [ "Please enter your email.", "Email not valid!" ]
			},
			{
				field : "pwd1",
				rules : [ "notempty", "regexp:.{6,32}" ],
				errors : [ 'Please enter a password.',
				        'Password must contain between 6 and 32 characters.' ]
			},
			{
				field : "pwd2",
				rules : [ "notempty", "regexp:.{6,}", "=pwd1" ],
				errors : [ 'Please enter a password.',
						'Confirmation does not match. Please confirm your password.',
						'Confirmation does not match. Please confirm your password.' ]
			} ]

	formValidator.validate(form, rules, signupFormErrorCallback,signupFormSuccessCallback);
	return false;
}

function checkFormLogin(form) {
	var rules = [
			{
				field : "email",
				rules : [ "notempty", 'email' ],
				errors : [ "Please enter your email.", "Email not valid!" ]
			},
			{
				field : "pwd1",
				rules : [ "notempty", "regexp:.{6,32}" ],
				errors : [ 'Please enter a password.',
						'Password must contain between 6 and 32 characters.' ]
			} ]

	formValidator.validate(form, rules, loginFormErrorCallback,loginFormSuccessCallback);
	return false;
}

function signupFormSuccessCallback(form) {
	registerLoading.style.display="block";
	form.style.opacity="0.5";
	userEmail=form.email.value;
	sessionStorage.setItem("userEmail", userEmail);
	myGuardian.signUp(form.email.value, form.pwd1.value, signupCallback);
}

function signupFormErrorCallback(error) {
	showLoginError(error,false);
}

function loginFormSuccessCallback(form) {
	userEmail=form.email.value;
	sessionStorage.setItem("userEmail", userEmail);
	myGuardian.login(form.email.value, form.pwd1.value, form.rememberMe.checked, loginCallback);
}

function loginFormErrorCallback(error) {
	showLoginError(error,false);
}

function treatSignupErrors(statusCode){
	switch (statusCode) {
		case "409":
			// than we have a problem
			showLoginError("Account already exists. Please login.",false);
			break;
		case "500":
			showLoginError("Internal server error.",false);
			break;
	}
}

function signupCallback(resultJSON) {
	if (resultJSON.statusCode != null) {
		treatSignupErrors(resultJSON.statusCode);
		return;
	}
	//showLoginError("Your request was sent. Please check the submitted email address.");
	registerLoading.style.display="none";
	singleForm.style.opacity="1";
	showWelcomeMessage();
}

function treatLoginErrors(statusCode) {
	switch (statusCode) {
	case "401":
		showLoginError("This account is not activated or the password is wrong.",false);
		break;
	case "500":
		showLoginError("Internal server error.",false);
		break;
	}
}

function loginCallback(resultJSON, sessionExpires) {
	if (resultJSON.statusCode != null) {// if there is any error code
		treatLoginErrors(resultJSON.statusCode);
		return;
	}
	var userEmail=sessionStorage.getItem("userEmail");
	if (resultJSON["id"] != null && myGuardian.hasStorage) {
		// save it into memory and navigate to landing page
		sessionStorage.setItem("id", resultJSON["id"]);
		
		if(!sessionExpires){
			localStorage.setItem("rememberedEmail",userEmail);
			localStorage.setItem("rememberedId",resultJSON["id"]);
		}
		window.location.href = ("myApplications.html");
	}
	
	var isDesktop=localStorage.getItem("isDesktop")=="true"?true:false;
	var isTablet=localStorage.getItem("isTablet")=="true"?true:false;
	
	if(isDesktop || isTablet){
		localStorage.setItem(userEmail+".menuLeftExpanded","true");
	}else{
		localStorage.setItem(userEmail+".menuLeftExpanded","false");
	}

}

function sendPasswordToEmail() {
	var field=forgotPasswordForm.getElementsByTagName("input")[0];
	if (formValidator.validateEmail(field.value)) {
		registerLoading.style.display="block";
		forgotPasswordForm.style.opacity="0.5";
		// send info to server
		myGuardian.ajaxClient.addRequestToQueue({
				method : 'POST',
				/*user/remind*/
				link : WhateverConfig.baseURL + 'core/user/reset/' + field.value + "/",
				callbackFunction : remindEmailSent,
				responseFormat : "JSON",
		});
	} else {
		showForgotPassError("Please enter a valid email address.",false);
	}
}


function remindEmailSent(resultJSON) {
	registerLoading.style.display="none";
	forgotPasswordForm.style.opacity="1";
	switch (resultJSON.statusCode) {
		case "403":
			showForgotPassError("This accound doesn't exist.",false);
			break;
		case "500":
			showForgotPassError("An error occured. Please try again later.",false);
			break;
		default:
			forgotPasswordForm.getElementsByTagName("input")[0].value="";
		    showForgotPassError("Please check your email for reset link.",true);
		}
}

function resetAll(){
	var field=forgotPasswordForm.getElementsByTagName("input")[0];
	field.value="";
	forgotPasswordFormErrorField.innerHTML="";
	forgotPasswordFormErrorField.style.display="none";
	loginErrorField.innerHTML="";
	loginErrorField.style.display="none";
	singleForm.pwd1.value="";
	singleForm.email.value="";
	try{
		singleForm.pwd2.value="";
	}catch(e){}
	singleForm.email.value="";
	try {
		pwd2parent.removeChild(pwd2);
	} catch (e) {}
	singleForm.email.onkeyup();
}

function showForgotPassError(errorText,success){
	forgotPasswordFormErrorField.style.display="block";
	forgotPasswordFormErrorField.className="form-errors";
	if(success){
		forgotPasswordFormErrorField.className+=" success";
	}
	forgotPasswordFormErrorField.innerHTML=errorText;	
}

function showLoginError(errorText,success){
	loginErrorField.style.display="block";
	loginErrorField.className="form-errors";
	if(success){
		loginErrorField.className+=" success";
	}
	loginErrorOccured=true;
	loginErrorField.innerHTML=errorText;
}