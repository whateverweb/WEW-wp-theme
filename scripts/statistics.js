
var sessionToken = sessionStorage.getItem("id");
var userEmail=sessionStorage.getItem("userEmail");
var appKey = localStorage.getItem(userEmail+".curAppKey");
var appName= localStorage.getItem(userEmail+".curAppName");

var statisticsTitle=document.getElementById("statistics-title");
var applicationsList=document.getElementById("applications-list");
var preloader=document.getElementById("wait-for-page");

var timeFrames=calculateTimeframes();

var description='Total number of requests for this';

var chartType="column";

var currentRequestLink="";
var completedRequests=0;
var values=[];
var labels=[];
var previsionLabel="prevision for next week";
var labelsString=["three weeks ago","two weeks ago","last week","this week"];

var suffix=" account";
var chartTitle='Requests';

var feedingData=[
                 ["week","requests"],
                 ["three weeks ago",0],
                 ["two weeks ago",0],
                 ["last week",0],
                 ["this week",0],
                 [previsionLabel,0],
              ];

if(appKey){
	suffix=" application";
}


function drawChart() {
	  var data = google.visualization.arrayToDataTable(feedingData);

	  var options = {
	    title: chartTitle,
		hAxis : {
				title : description + suffix,
				titleTextStyle : {
					color : 'red'
				}
				
		},
		vAxis :{
			viewWindow:{
				viewWindowMode:"explicit",
				min:0
			}
		},
		animation: {duration: 2000,easing: "in"}
	  };
      
	  var chart=null;
	  if(chartType=="pie"){
		  chart = new google.visualization.PieChart(document.getElementById('chart_container'));
	  }else{
		  chart = new google.visualization.ColumnChart(document.getElementById('chart_container'));
	  }
	  chart.draw(data, options);
}


function chartLoadedFromGoogle(){
	drawChart();
	getStatistics(userEmail,appKey);
	
}


function calculateTimeframes(){
	var timeFrames=[];
	timeFrames["sec"]=1000;
	timeFrames["min"]=60*timeFrames["sec"];
	timeFrames["hour"]=60*timeFrames["min"];
	timeFrames["day"]=24*timeFrames["hour"];
	timeFrames["week"]=7*timeFrames["day"];
	
	return timeFrames;
}


function getStatisticsTimeFrame(link){
    
	myGuardian.ajaxClient.addRequestToQueue({
		  method:'GET', 
		  async:true,
		  link:link,
		  callbackFunction:getTimeFrameCallback, 
		  responseFormat:"JSON",
	});
}

google.setOnLoadCallback(chartLoadedFromGoogle);


