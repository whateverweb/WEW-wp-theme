//switch class
function switchButton(id,callback){
     this.container=document.getElementById(id);
     this.buttOn=document.createElement("a");
     this.buttOff=document.createElement("a");
     this.state=false;
     
     // init
     this.container.innerHTML="";
     
     this.buttOn.innerHTML="ON";
     this.buttOn.id="first";
     this.container.appendChild(this.buttOn);
     
     
     this.buttOff.innerHTML="OFF";
     this.buttOff.id="last";
     this.container.appendChild(this.buttOff);
     
     this.refreshState();
     
     var scope=this;
     this.buttOn.onclick=function(){
        if(!scope.state){
        	scope.state=true;
        	if(callback){
        		callback();
        	}
        }
        scope.refreshState();
     }
     
     this.buttOff.onclick=function(){
         if(scope.state){
         	scope.state=false;
         	if(callback){
         		callback();
         	}
         }
         scope.refreshState();
      }
     
     
}

switchButton.prototype.refreshState=function(){
    if(this.state){
        this.buttOn.className="selected";
        this.buttOff.className="";
    }else{
    	this.buttOn.className="";
        this.buttOff.className="selected";
    }
}

switchButton.prototype.setState=function(newState){
	this.state=newState;
	this.refreshState();
}