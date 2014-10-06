function micropost(url, json, successCallback, failCallback) {
	this.bindFunction = function (caller, object) {
		return function() {
			return caller.apply(object, [object]);
		};
	};
	this.stateChange = function (object) {
		if (this.request.readyState==4) {
			clearTimeout(this.timeoutID);
			if (this.request.status==200) {
				this.successCall(JSON.parse(this.request.responseText));
			}
		}
	};
	this.getRequest = function() {
		if (window.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		else if (window.XMLHttpRequest)
			return new XMLHttpRequest();
		return false;
	};
	this.successCall=successCallback;
	this.failCall=failCallback;
	this.url=url;
	this.request = this.getRequest();
	this.timeoutID = 0;
	if(this.request) {
		var req = this.request;
		req.onreadystatechange = this.bindFunction(this.stateChange, this);
		req.open("POST", url, true);
		req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		req.setRequestHeader('Content-type', 'application/json');
		req.send(JSON.stringify(json));
		this.timeoutID = setTimeout(function() {
			this.request.abort();
			this.failCall("timeout","");
		}, 60000);
	}
}
