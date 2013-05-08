var spaceship=document.getElementById("spaceship");

var defaultLeft=spaceship.offsetLeft+"px";
var defaultTop=spaceship.offsetTop+"px";;
var floatTop=-30;

var currentValue=defaultTop;

spaceship.style.top="-50%";
spaceship.style.left="60%";
spaceship.style.position="absolute";

var landingTime=0.5;

Animator.createAnimation("spaceshipAnim",["left","top"],landingTime,0,"ease");

spaceship.style.display="block";
Animator.animateElement(spaceship,"spaceshipAnim",[null,null],[defaultLeft,defaultTop]);





