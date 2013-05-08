/*check if there is a resetToken*/
var resetToken=sessionStorage.getItem("resetToken");
if(!resetToken){
	window.location.href = ("/index.html");
}

var sendButton=document.getElementById("submit-btn");
var loginLink=generateLoginLink();
var resetPassErrorField=document.getElementsByClassName("form-errors")[0];
var resetLoading=document.getElementById("register-loading");

var formContainer=document.getElementById("sign-up-body");


var myForm = null;
var message=null;

function generateLoginLink(){
	var link=document.createElement("a");
	link.innerHTML="Login";
	link.setAttribute("href","index.html");
	link.className="cyan-page-button";
	return link;
}

function checkFormResetPass(form) {
	myForm = form;
	var rules = [
			{
				field : "pwd1",
				rules : [ "notempty",'regexp:.{6,32}' ],
				errors : [ "Please enter a password.",
				        "Password must contain at between 6 and 32 characters." ]
			},
			{
				field : "pwd2",
				rules : [ "notempty", 'regexp:.{6,32}', '=pwd1' ],
				errors : [ "Please enter a password.",
						"Confirmation does not match. Please confirm your password.",
						"Confirmation does not match. Please confirm your password." ]
			} ]

	formValidator.validate(form, rules, resetPassFormErrorCallback,	resetPassFormSuccessCallback);
	return false;
}

function resetPassFormSuccessCallback(form) {
	resetLoading.style.display="block";
	myForm.style.opacity="0.5";
	myGuardian.resetPass(form.pwd1.value, resetToken,
			resetPassCallback);
}

function resetPassFormErrorCallback(error) {
	showFinalMessage(error,false,false);
	return false;
}

function resetPassCallback(resultJSON) {
	resetLoading.style.display="none";
	myForm.style.opacity="1";
	if (resultJSON.statusCode != null) {
		if (resultJSON.statusCode != "200") {
			switch (resultJSON.statusCode) {
			case "403":
				showFinalMessage("Invalid reset token",false,true);
				sessionStorage.removeItem("resetToken");
				break;
			case "500":
				showFinalMessage("Internal server error",false,false);
				break;
			}
		} else {
			formValidator.emptyForm(myForm);
			showFinalMessage("Password successfully reset.",true,true);
			sessionStorage.removeItem("resetToken");
		}
	} else {
		formValidator.emptyForm(myForm);
		showFinalMessage("Password successfully reset.",true,true);
		sessionStorage.removeItem("resetToken");
	}
}


function showFinalMessage(messageText,success,hideForm){
	var formParent=formContainer.parentNode;
	
	if(!message){
		message=document.createElement("h3");
		formParent.insertBefore(message,formContainer);
	}
	message.innerHTML=messageText;
	
	var div=document.createElement("div");
	div.className="clear-contents";
	
	if(hideForm){
		formParent.removeChild(formContainer);
	}
	if(success){
		formParent.appendChild(loginLink);
	}
	if(hideForm){
		formParent.appendChild(div);
	}
}
