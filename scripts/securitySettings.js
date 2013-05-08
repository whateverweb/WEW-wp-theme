var userEmail = sessionStorage.getItem("userEmail");
var sessionToken = sessionStorage.getItem("id");

var myForm;

function checkFormChangePass(form) {
	myForm = form;
	var rules = [
			{
				field : "pwd0",
				rules : [ "notempty", 'regexp:.{6,32}' ],
				errors : [ "Old password is incorrect.",
				           "Old password is incorrect." ]
			},     
			{
				field : "pwd1",
				rules : [ "notempty", 'regexp:.{6,32}' ],
				errors : [ "Please enter a password.",
				           "Password must contain between 6 and 32 characters." ]
			},
			{
				field : "pwd2",
				rules : [ "notempty", 'regexp:.{6,32}', '=pwd1' ],
				errors : [ "Please enter a password.",
						"Confirmation does not match. Please confirm your password.",
						"Confirmation does not match. Please confirm your password." ]
			} ]

	formValidator.validate(form, rules, changePassFormErrorCallback,
			changePassFormSuccessCallback);
	return false;
}

function changePassFormSuccessCallback(form) {
	myGuardian.changePass(userEmail, form.pwd0.value, form.pwd1.value, sessionToken,
			changePassCallback);
}



function changePassFormErrorCallback(error) {
	ErrorMessages.showError(error);
}

function treatChangePassErrors(statusCode){
	switch (statusCode) {
		case "401":
			myGuardian.showRelogin();
			break;
		case "409":
			ErrorMessages.showError("Old password is incorrect.");
			break;
		case "500":
			ErrorMessages.showError("Internal server error.");
			break;
		case "200":
			formValidator.emptyForm(myForm);
			ErrorMessages.showSuccess("Password successfully changed.");
	}
}


function changePassCallback(resultJSON) {
	if (resultJSON.statusCode) {
		treatChangePassErrors(resultJSON.statusCode);
		return;
	}
	emptyForm(myForm);
	ErrorMessages.showSuccess("Password successfully changed");
	
}
