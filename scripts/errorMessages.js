ErrorMessages=(function (){
	var container=document.getElementById("page-messages");
	var errorContainer=document.createElement("div");
	var timeoutId=0;
	
	errorContainer.style["opacity"]=0;
	container.appendChild(errorContainer);
	Animator.createAnimation("fadeError", ["opacity"], 0.35);
	
	
	return{
       showError:function(message){
    	   errorContainer.style.display="block";
    	   errorContainer.className="error-messages";
    	   errorContainer.innerHTML=message;
    	   Animator.animateElement(errorContainer, "fadeError", [0], [1]);
    	   clearTimeout(timeoutId);
    	   timeoutId=setTimeout(function(){
    		   Animator.animateElement(errorContainer, "fadeError", null, [0]);
    		   timeoutId=setTimeout(function(){
    			   errorContainer.style.display="none";
    		   },500);
    	   },2500);
       },
       showSuccess:function(message){
    	   clearTimeout(timeoutId);
    	   errorContainer.style.display="block";
    	   errorContainer.className="success-messages";
    	   errorContainer.innerHTML=message;
    	   Animator.animateElement(errorContainer, "fadeError", [0], [1]);
    	   clearTimeout(timeoutId);
    	   timeoutId=setTimeout(function(){
    		   Animator.animateElement(errorContainer, "fadeError", null, [0]);
    		   timeoutId=setTimeout(function(){
    			   errorContainer.style.display="none";
    		   },500);
    	   },2500);
       }
		
	};
	
})();
