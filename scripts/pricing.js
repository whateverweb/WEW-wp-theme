var registerContainer=document.getElementById("no-pricing-register");
if(myGuardian.isLogged){
	registerContainer.parentNode.style.textAlign="left";
	registerContainer.parentNode.removeChild(registerContainer);
}
