var userEmail = sessionStorage.getItem("userEmail");
var sessionToken = sessionStorage.getItem("id");

var contactFormInfo=document.getElementById("change-contact-info");

var oldValues={};

getContactInfo();



function validateContactFormInfo(form){
	contactFormInfo=form;
	if(testAgainstOldValues()){
		ErrorMessages.showError("No changes since last save.");
		return false;
	}
	var atMost=" must not exceed 20 characters.";
	var atMostAddress=" must not exceed 60 characters.";
	var rules=[
	           	{field:"firstName",rules:["regexp:.{0,20}"],errors:["First name"+atMost]},
	           	{field:"lastName",rules:["regexp:.{0,20}"],errors:["Last name"+atMost]},
	           	{field:"phone",rules:["regexp:[0-9-.+ ]*","regexp:.{0,20}"],errors:["Please enter only numbers and -,.,+ or space.","Phone number"+atMost]},
	           	
	           	{field:"address",rules:["regexp:.{0,60}"],errors:["Address"+atMostAddress]},
	           	
	           	{field:"city",rules:["regexp:.{0,20}"],errors:["City "+atMost]},
	           	
		   		{field:"zipCode",rules:["regexp:[0-9]*","regexp:.{0,20}"],errors:["Please enter only numbers.","Zip code"+atMost]},
		   		
		   		{field:"country",rules:["regexp:.{0,20}"],errors:["Country"+atMost]},
	      ]
	formValidator.validate(form,rules,validateContactFormInfoError,validateContactFormInfoSuccess);
	return false;
}

function validateContactFormInfoError(error){
	ErrorMessages.showError(error);
}

function validateContactFormInfoSuccess(form){
	sendContactInfo();
}


function getContactInfo(){
	var link=WhateverConfig.baseURL + 'core/user/contact/'+userEmail+'/'+sessionToken;
	myGuardian.ajaxClient.addRequestToQueue({
		  method:'GET', 
		  link:link,
		  callbackFunction:getContactInfoCallback, 
		  responseFormat:"JSON",
		}); 
}

function getContactInfoCallback(responseJSON){
	if (responseJSON.statusCode) {
		switch (responseJSON.statusCode) {
				case "401":
					myGuardian.showRelogin();
					break;
				case "500":
					ErrorMessages.showError("Internal server error");
					break;
		}
	} else {
		contactFormInfo.firstName.value=oldValues.firstName=responseJSON.firstName || "";
		contactFormInfo.lastName.value=oldValues.lastName=responseJSON.lastName || "";
		contactFormInfo.address.value=oldValues.address=responseJSON.address || "";
		contactFormInfo.phone.value=oldValues.phone=responseJSON.phone || "";
		contactFormInfo.city.value=oldValues.city=responseJSON.city || "";
		contactFormInfo.zipCode.value=oldValues.zipCode=responseJSON.zipCode || "";
		contactFormInfo.country.value=oldValues.country=responseJSON.country || "";
		
	}
}

function testAgainstOldValues(){
	return (contactFormInfo.firstName.value==oldValues.firstName
	&& contactFormInfo.lastName.value==oldValues.lastName
	&& contactFormInfo.address.value==oldValues.address
	&& contactFormInfo.phone.value==oldValues.phone
	&& contactFormInfo.city.value==oldValues.city
	&& contactFormInfo.zipCode.value==oldValues.zipCode
	&& contactFormInfo.country.value==oldValues.country);
}

function sendContactInfo(){
	var link=WhateverConfig.baseURL + 'core/user/contact/'+userEmail+'/'+sessionToken+'?';
	link+="firstName="+WhateverUtils.fixedEncodeURIComponent(contactFormInfo.firstName.value);
	link+="&lastName="+WhateverUtils.fixedEncodeURIComponent(contactFormInfo.lastName.value);
	link+="&address="+WhateverUtils.fixedEncodeURIComponent(contactFormInfo.address.value);
	link+="&phone="+WhateverUtils.fixedEncodeURIComponent(contactFormInfo.phone.value);
	link+="&city="+WhateverUtils.fixedEncodeURIComponent(contactFormInfo.city.value);
	link+="&zipCode="+WhateverUtils.fixedEncodeURIComponent(contactFormInfo.zipCode.value);
	link+="&country="+WhateverUtils.fixedEncodeURIComponent(contactFormInfo.country.value);
	myGuardian.ajaxClient.addRequestToQueue({
		  method:'PUT', 
		  link:link,
		  callbackFunction:sendContactInfoCallback, 
		  responseFormat:"JSON",
		}); 
}

function sendContactInfoCallback(responseJSON){
	if (responseJSON.statusCode) {
		switch (responseJSON.statusCode) {
				case "401":
					myGuardian.showRelogin();
					break;
				case "500":
					ErrorMessages.showError("Internal server error");
					break;
				case "200":
					ErrorMessages.showSuccess("Contact info successfully changed");
					oldValues.firstName=contactFormInfo.firstName.value;
					oldValues.lastName=contactFormInfo.lastName.value;
					oldValues.address=contactFormInfo.address.value;
					oldValues.phone=contactFormInfo.phone.value;
					oldValues.city=contactFormInfo.city.value;
					oldValues.zipCode=contactFormInfo.zipCode.value;
					oldValues.country=contactFormInfo.country.value;
					break;
				
		}
	} 
}