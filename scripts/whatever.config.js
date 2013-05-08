var WhateverConfig=(function(){
	var domain="whateverweb.com";
	var subdomain="";
	return{
		domain:domain,
		subdomain:subdomain,
		baseURL:"http://"+subdomain+domain+"/",
		WebAppHTML : ["myApplications","contactInformation","securitySettings","createApplication",
		                "appDetails","editApplication","createCapability","allCapabilities","createCapabilitySet","allCapabilitySets",
		                "cssMediaQueries","imageServer"]
	};
})();