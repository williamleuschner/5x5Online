//Initialize Framework7
var five = new Framework7();
var $$ = Framework7.$;
var teacherView = five.addView('.view-teach', {
	dynamicNavbar: true
});
var adminView = five.addView('.view-admin', {
	dynamicNavbar: true
});
/*
var sentView = five.addView('.view-sent', {
	dynamicNavbar: true
});
*/
five.params["modalTitle"] = '5x5 Online';
five.params["modalPopupCloseByOutside"] = false;
//Declare global variables
var packagePrefix = "com.5x5manage.";
var ajaxURL = 'http://s0ph0s.linuxd.net/5x5Online/manage'
function authenticate(isForm) {
	// Initialize variables for username and token
	var uname = "";
	var token = "";
	// Assign them differently based on whether the function call came from another function or the form
	if (isForm) {
		// get the values from the form first
		uname = $$("#username").val();
		token = $$("#token").val();
		// then write them to the local storage
		localStorage[packagePrefix + "uname"] = uname
		localStorage[packagePrefix + "token"] = token
	} else {
		// read the values from local storage
		uname = localStorage[packagePrefix + "uname"];
		token = localStorage[packagePrefix + "token"];
	}
	// Make an object to hold the authentication request data
	var reqData = {
		method:"auth",
		contents:{
			uname:uname,
			token:token
		}
	};
	// Show a loading indicator
	five.showIndicator();
	console.log("AJAX sent...");
	// Send the request
	micropost(ajaxURL, reqData, function(response) {
		console.log("...and recieved.");
		// Hide the loading indicator
		five.hideIndicator();
		// If the login attempt succeeded,
		if (response['s'] == true) {
			// Close the login modal, if open.
			five.closeModal(".auth_popup");
			// Fill in the lists of stuff with the data the server sent.
			populateLists("all", response['data']);
			bindItems();
		} else {
			// Otherwise, tell the user they dun goofed.
			popupError(response['message']);
			five.popup(".auth_popup");
		}
	}, function(src, errorCode) {
		popupError("Sending credentials failed. (" + src + " error " + errorCode + ")");
		five.popup(".auth_popup");
	});
}
function popupError(text) {
	if (text == undefined) text = "undefined";
	$$(".error").text(text);
	console.log("Error displayed (" + text + ")");
	setTimeout(function(){$$(".error").text("")}, 5000);
	console.log("Timeout set");
}
// Populates the lists of administrators and teachers
function populateLists(which, data) {
	// List string bits
	console.log("Populating list " + which + ".");
	var part1 = '<div class="list-block"><ul>';
	var listItemTemplate = '<li class="swipeout {2}-remove-call"><div class="item-content swipeout-content"><div class="item-inner"><div class="item-title">{0}</div><div class="item-after">{1}</div></div></div><div class="swipeout-actions"><div class="swipeout-actions-inner"><a href="#" class="swipeout-delete">Delete</a></div></div></li>';
	var part2 = '</ul></div>';
	var listItems = "";
	switch (which) {
		case "all":
			populateLists("admins", data["admins"]);
			populateLists("teachers", data["teachers"]);
			break;
		case "admins":
			for (var key in data) {
				listItems += listItemTemplate.format(key, data[key], "admin");
			}
			listContent = part1 + listItems + part2;
			listItems = "";
			$$("#delete_me_a").remove();
			$$("#insert_list_here_a").append(listContent);
			break;
		case "teachers":
			for (var key in data) {
				listItems += listItemTemplate.format(key, data[key], "teacher");
			}
			listContent = part1 + listItems + part2;
			listItems = "";
			$$("#delete_me_t").remove();
			$$("#insert_list_here_t").append(listContent);
			break;
	}
}
//Adds an event listener to all list items with the correct classes to send a remove request to the server.
function bindItems() {
	$$(".admin-remove-call").on("deleted", function(){removeAdministrator(this)});
	$$(".teacher-remove-call").on("deleted", function(){removeTeacher(this)});
}
//Will eventually remove an administrator.
function removeAdministrator(e) {
	console.log("Dead function call. This == " + e);
	five.alert("Hello! I'm the developer. This function doesn't do anything yet. Please refresh the page or close and re-open the app to get that administrator back.");
}
//Will eventually remove a teacher.
function removeTeacher(e) {
	console.log("Dead function call. This == " + e);
	five.alert("Hello! I'm the developer. This function doesn't do anything yet. Please refresh the page or close and re-open the app to get that teacher back.");
}
// Adds an administrator
function addAdministrator() {
	// Get form data
	var newUname = $$("#addUname").val();
	// Validate form data
	if (newUname == "") {
		five.alert("You must enter a username.");
		return;
	}
	// Make request object
	var reqData = {
		method:"add_admin",
		contents: {
			uname:localStorage[packagePrefix + "uname"],
			token:localStorage[packagePrefix + "token"],
			newUname:newUname
		}
	};
	// Send request
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response) {
		five.hideIndicator();
		if (response['s'] == true) {	
			populateLists("all", response['data']);
			bindItems();
		} else {
			five.alert(response['message'],response['title']);
		}
	}, function(src,errorCode) {
		five.alert("Sending the teacher add request failed. (" + src + " error " + errorCode + ")");
	})
}
// Adds a teacher
//Function that runs on startup to check various required states.
function startupCheck() {
	// Alert the user if they are offline
	if (!navigator.onLine) {
		five.alert("You are not connected to the internet. This app does not function without an internet connection.");
		return;
	}
	// If there are values saved in local storage, try to authenticate with them before prompting the user
	if (localStorage[packagePrefix + 'uname'] != "" && localStorage[packagePrefix + 'token'] != "") {
		authenticate(false);
	} else {
		five.popup(".auth_popup");
	}
}
// Asst. maintenece on page load
window.onload = function() {
	// Assign empty strings to local storage for username and token if they don't exist yet.
	if (localStorage[packagePrefix + "uname"] == undefined) {
		localStorage[packagePrefix + "uname"] = "";
	}
	if (localStorage[packagePrefix + "token"] == undefined) {
		localStorage[packagePrefix + "token"] = "";
	}
	startupCheck();
}