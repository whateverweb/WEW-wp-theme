var intervalsNumber=4;

chartTitle="Transfer (MB)";
description='Total transfer for this';



function getStatistics(userEmail,appKey){
	
	var userEmail = sessionStorage.getItem("userEmail");
	appKey = localStorage.getItem(userEmail+".curAppKey");
	
	
	
	currentRequestLink=WhateverConfig.baseURL + 'core/bytes/acc/' + userEmail + '/'+sessionToken;
	if(appKey){
		//appKey='e2db877b-2b78-4653-840f-3e831987cc69';
		currentRequestLink=WhateverConfig.baseURL + 'core/bytes/app/' + appKey + '/'+sessionToken;
	}
	
	
	feedingData=[['Week', 'transfer (MB)']];
	
	currentRequestLink+="?numberofWeeks="+intervalsNumber;
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
		for(var i=0;i<intervalsNumber;i++){
			feedingData.push([labelsString[i],resultJSON[i].totalBytesPerQueryInterval/1024/1024]);
		}
		var previsionValue=2*feedingData[feedingData.length-1][1]-feedingData[feedingData.length-2][1];
		feedingData.push([previsionLabel,previsionValue]);
		drawChart();
	}
}


google.load("visualization", "1", {packages:["corechart"]});


