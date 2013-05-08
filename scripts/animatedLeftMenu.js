function AnimatedLeftMenu(triggerId,pageId,menuId,contentsId,isDesktop,isTablet){
	this.trigger=document.getElementById(triggerId);
	this.menuContainer=document.getElementById(menuId);
	this.contentsContainer=document.getElementById(contentsId);
	this.page=document.getElementById(pageId);
	this.isDesktop=isDesktop;
	this.isTablet=isTablet;
	
	this.inner=this.contentsContainer.getElementsByClassName("inner")[0];
	/*this is the open value of the left menu*/
	if(this.isDesktop || this.isTablet){
		this.minVal=0;
		this.maxVal=20;
	}else{
		this.minVal=0;
		this.maxVal=60;
	}
	
	
	Animator.createAnimation("slidepage", ["left"], 0.3);
	Animator.createAnimation("slideOthers", ["width","right"], 0.3);
	
}


AnimatedLeftMenu.prototype.animateMenu=function(destinationValue,ifExpanded){
	
	if(ifExpanded){
		this.menuContainer.className="maximized";
		//this.trigger.className="trigger-close";
	}else{
		this.menuContainer.className="minimized";
		//this.trigger.className="trigger-open";
	}
	
	/*if(!this.isDesktop && !this.isTablet){
		if(ifExpanded){
			this.inner.style.whiteSpace="nowrap";
		}else{
			this.inner.style.whiteSpace="normal";
		}
	}*/
	Animator.animateElement(this.page, "slidepage", null, [destinationValue+"%"]);
	Animator.animateElement(this.menuContainer, "slideOthers", null, [destinationValue+"%",destinationValue+"%"]);
	Animator.animateElement(this.contentsContainer, "slideOthers", null, [(100-destinationValue)+"%",destinationValue+"%"]);
}


AnimatedLeftMenu.prototype.moveMenuToPosition=function(destinationValue){
	this.page.style.left=destinationValue+"%";
	
	this.menuContainer.style.width=destinationValue+"%";
	this.menuContainer.style.right=destinationValue+"%";
	
	this.contentsContainer.style.width=(100-destinationValue)+"%";
	this.contentsContainer.style.right=destinationValue+"%";
}


var userEmail=sessionStorage.getItem("userEmail");
var isDesktop=localStorage.getItem("isDesktop")=="true"?true:false;
var isTablet=localStorage.getItem("isTablet")=="true"?true:false;

function testExpanded(){
	var tmpExpanded=localStorage.getItem(userEmail+".menuLeftExpanded");
	var returnExpanded=tmpExpanded=="true"?true:false;
	

	if(!isDesktop && !isTablet){
		returnExpanded=false;
		localStorage.setItem(userEmail+".menuLeftExpanded",returnExpanded);
	}
	return returnExpanded;
	
}

var leftMenuController=new AnimatedLeftMenu("left-menu-trigger","page","left-menu","page-contents",isDesktop,isTablet);
var expanded=testExpanded();

leftMenuController.menuContainer.className=expanded?"maximized":"minimized";
//leftMenuController.trigger.className=expanded?"trigger-close":"trigger-open";


var destVal=expanded?leftMenuController.maxVal:leftMenuController.minVal;
leftMenuController.moveMenuToPosition(destVal);

var triggerBehavior=function(){
	expanded=!expanded;
	//leftMenuController.trigger.className=expanded?"trigger-close":"trigger-open";
	destVal=expanded?leftMenuController.maxVal:leftMenuController.minVal;
	if(isDesktop || isTablet){
		leftMenuController.animateMenu(destVal,expanded);
	}else{
		leftMenuController.moveMenuToPosition(destVal);
	}
	localStorage.setItem(userEmail+".menuLeftExpanded",expanded);
	/*if(evt){
		evt.preventDefault();
	}*/
}

leftMenuController.trigger.onclick=function(){
	triggerBehavior() ;
}
