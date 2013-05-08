var intervalsNumber=4;
var numberOfDevices=5;
chartType="pie";
chartTitle="Device Calls";



function getStatistics(userEmail,appKey){
	
	var userEmail = sessionStorage.getItem("userEmail");
	appKey = localStorage.getItem(userEmail+".curAppKey");
	
	
	
	currentRequestLink=WhateverConfig.baseURL + 'core/topCalls/acc/' + userEmail + '/' + numberOfDevices + '/' +sessionToken;
	if(appKey){
		//appKey='e2db877b-2b78-4653-840f-3e831987cc69';
		//appKey='f20dc10b-b8a3-4a27-97d2-9f5871932fce';
		currentRequestLink=WhateverConfig.baseURL + 'core/topCalls/app/' + appKey + '/' + numberOfDevices + '/' + sessionToken;
	}
	
	
	feedingData=[['Device', 'calls percentage']];
	
	//currentRequestLink+="?numberofWeeks="+intervalsNumber;
	getStatisticsTimeFrame(currentRequestLink);
	
	
	
}

function getTimeFrameCallback(resultJSON) {
	toggleMasterPreloader(false);
	if (resultJSON.statusCode != null) {
		switch (resultJSON.statusCode) {
		case "401":
			myGuardian.showRelogin();
			break;
		case "204":
			ErrorMessages.showError("No data reported yet.");
			break;
		default:
			ErrorMessages.showError("Server error.");
			break;
		}
		
	}else{
		for(var i=0;i<resultJSON.length;i++){
			feedingData.push([resultJSON[i].brand+' '+resultJSON[i].model,resultJSON[i].numberOfCalls]);
		}
		drawChart();
	}
}

feedingData=[['Device', 'calls percentage']];

google.load("visualization", "1", {packages:["corechart"]});


