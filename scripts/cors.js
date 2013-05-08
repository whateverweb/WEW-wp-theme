function read(msisdn) {
	var m = "4793841107";
	var http = new XMLHttpRequest();
	http.open('GET', 'http://emilio.mobiletech.no:8080/dextella-msggw-wars-batchconfirm/NetcomAntichurn.groovy?msisdn=' + m,false);
	http.onreadystatechange = function() {
		if(http.readyState == 4 && http.status == 200) {
			var data = http.responseText;
//			alert(data.customer.subscriberid);
		}
	}
	http.send();
}

function update(sid) {
	var http = new XMLHttpRequest();
	http.open("PUT", "http://emilio.mobiletech.no:8080/dextella-msggw-wars-batchconfirm/NetcomAntichurn.groovy?subscriberid=" + sid);
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			alert(http.responseText);
		}
	}
	http.send(null);
}
