//Initialize Framework7
var five = new Framework7();
var $$ = Framework7.$;
var teacherView = five.addView('.view-teach', {
	dynamicNavbar: true
});
var adminView = five.addView('.view-admin', {
	dynamicNavbar: true
});
var addAdminView = five.addView('.view-add-admin',{
	dynamicNavbar: true
});
var addTeacherView = five.addView('.view-add-teach', {
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
	// Send the request
	micropost(ajaxURL, reqData, function(response) {
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
		five.hideIndicator();
		popupError("Sending credentials failed. (" + src + " error " + errorCode + ")");
		five.popup(".auth_popup");
	});
}
function popupError(text) {
	if (text == undefined) text = "undefined";
	$$(".error").text(text);
	setTimeout(function(){$$(".error").text("")}, 5000);
}
// Populates the lists of administrators and teachers
function populateLists(which, data) {
	five.destroySearchbar("#mainPage");
	// List string bits
	var part1 = '<div class="list-block list-block-search searchbar-found delete_me_{0}"><ul>';
	var listItemTemplate = '<li class="swipeout {2}-remove-call"><div class="item-content swipeout-content"><div class="item-inner"><div class="item-title">{0}</div><div class="item-after">{1}</div></div></div><div class="swipeout-actions"><div class="swipeout-actions-inner"><a href="#" class="swipeout-delete">Delete</a></div></div></li>';
	var part2 = '</ul></div>';
	var listItems = "";
	var optionTemplate = '<option value="{0}" class="delete_me_sel">{0}</option>';
	var optionList = "";
	switch (which) {
		case "all":
			populateLists("schools", data["schools"]);
			populateLists("admins", data["admins"]);
			populateLists("teachers", data["teachers"]);
			break;
		case "admins":
			for (var key in data) {
				listItems += listItemTemplate.format(key, safe_tags(data[key]['token']), "admin");
			}
			listContent = part1.format("a") + listItems + part2;
			listItems = "";
			$$(".delete_me_a").remove();
			$$("#insert_list_here_a").append(listContent);
			break;
		case "teachers":
			for (var key in data) {
				listItems += listItemTemplate.format(key, data[key]['email'], "teacher");
			}
			listContent = part1.format("t") + listItems + part2;
			listItems = "";
			$$(".delete_me_t").remove();
			$$("#insert_list_here_t").append(listContent);
			break;
		case "schools":
			for (var key in data) {
				listItems += listItemTemplate.format(key, data[key]['token'], "school");
				optionList += optionTemplate.format(key);
			}
			listContent = part1.format("s") + listItems + part2;
			listItems = "";
			$$(".delete_me_s").remove();
			$$("#insert_list_here_s").append(listContent);
			$$(".delete_me_sel").remove();
			$$(".insert_schoolSelect").prepend(optionList);
			five.initSmartSelects($$(".page"));
			five.initClickEvents();
			break;
	}
	five.initSearchbar("#mainPage");
}
//Adds an event listener to all list items with the correct classes to send a remove request to the server.
function bindItems() {
	$$(".admin-remove-call").on("deleted", function(){removeAdministrator(this)});
	$$(".teacher-remove-call").on("deleted", function(){removeTeacher(this)});
	$$(".school-remove-call").on("deleted", function(){removeSchool(this)});
}
// Removes an administrator.
function removeAdministrator(e) {
	delName = e.childNodes[0].childNodes[0].childNodes[0].innerHTML;
	// Make request object
	var reqData = {
		method:"del_admin",
		contents: {
			uname:localStorage[packagePrefix + "uname"],
			token:localStorage[packagePrefix + "token"],
			delUname:delName
		}
	};
	// Send request
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response) {
		five.hideIndicator();
		if (response['s'] == true) {	
			populateLists("admins", response['data']);
			bindItems();
		} else {
			five.alert(response['message'],response['title']);
		}
	}, function(src,errorCode) {
		five.hideIndicator();
		five.alert("Sending the administrator removal request failed. (" + src + " error " + errorCode + ")");
	});
}
// Removes a teacher.
function removeTeacher(e) {
	delName = e.childNodes[0].childNodes[0].childNodes[0].innerHTML;
	// Make request object
	var reqData = {
		method:"del_teacher",
		contents: {
			uname:localStorage[packagePrefix + "uname"],
			token:localStorage[packagePrefix + "token"],
			delName:delName
		}
	};
	// Send request
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response) {
		five.hideIndicator();
		if (response['s'] == true) {	
			populateLists("teachers", response['data']);
			bindItems();
		} else {
			five.alert(response['message'],response['title']);
		}
	}, function(src,errorCode) {
		five.hideIndicator();
		five.alert("Sending the teacher removal request failed. (" + src + " error " + errorCode + ")");
	});
}
// Removes a school
function removeSchool() {
	delSchool = e.childNodes[0].childNodes[0].childNodes[0].innerHTML;
	// Make request object
	var reqData = {
		method:"del_school",
		contents: {
			uname:localStorage[packagePrefix + "uname"],
			token:localStorage[packagePrefix + "token"],
			delSchool:delSchool
		}
	};
	// Send request
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response) {
		five.hideIndicator();
		if (response['s'] == true) {	
			populateLists("schools", response['data']);
			bindItems();
		} else {
			five.alert(response['message'],response['title']);
		}
	}, function(src,errorCode) {
		five.hideIndicator();
		five.alert("Sending the school removal request failed. (" + src + " error " + errorCode + ")");
	});
}
// Adds an administrator
function addAdministrator() {
	// Get form data
	var newAFname = $$("#addAFname").val();
	var newALname = $$("#addALname").val();
	var newASchool = $$("#newASchool").val();
	// Validate form data
	if (newAFname == "") {
		five.alert("You must enter a first name.");
		return;
	}
	if (newALname == "") {
		five.alert("You must enter a last name.");
		return;
	}
	if (newASchool == "") {
		five.alert("You must select a school.");
		return;
	}
	// Make request object
	var reqData = {
		method:"add_admin",
		contents: {
			uname:localStorage[packagePrefix + "uname"],
			token:localStorage[packagePrefix + "token"],
			fname:newAFname,
			lname:newALname,
			school:newASchool
		}
	};
	// Send request
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response) {
		five.hideIndicator();
		if (response['s'] == true) {	
			populateLists("admins", response['data']);
			bindItems();
			five.closeModal(".new_admin_popup");
		} else {
			five.alert(response['message'],response['title']);
		}
	}, function(src,errorCode) {
		five.hideIndicator();
		five.alert("Sending the administrator add request failed. (" + src + " error " + errorCode + ")");
	});
}
// Adds a teacher
function addTeacher() {
	// Get form data
	var fname = $$("#fname").val();
	var lname = $$("#lname").val();
	var email = $$("#email").val();
	var school = $$("#newTSchool").val();
	// Validate form data
	if (fname == "" || lname == "" || email == "") {
		five.alert("None of the fields can be blank.","Error");
		return;
	}
	if (school == "") {
		five.alert("You must select a school.");
	}
	// Make request object
	var reqData = {
		method:"add_teacher",
		contents: {
			uname:localStorage[packagePrefix + "uname"],
			token:localStorage[packagePrefix + "token"],
			fname:fname,
			lname:lname,
			email:email,
			school:school
		}
	};
	// Send request
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response) {
		five.hideIndicator();
		if (response['s'] == true) {	
			populateLists("teachers", response['data']);
			bindItems();
			five.closeModal(".new_teacher_popup");
		} else {
			five.alert(response['message'],response['title']);
		}
	}, function(src,errorCode) {
		five.hideIndicator();
		five.alert("Sending the teacher add request failed. (" + src + " error " + errorCode + ")");
	});
}
// Adds a school
function addSchool() {
	var abbr = $$("#abbr").val();
	if (abbr == "") {
		five.alert("You must enter a school name.");
		return;
	}
	var reqData = {
		method:"add_school",
		contents: {
			uname:localStorage[packagePrefix + "uname"],
			token:localStorage[packagePrefix + "token"],
			abbr:abbr
		}
	};
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response) {
		five.hideIndicator();
		if (response['s'] == true) {	
			populateLists("schools", response['data']);
			bindItems();
			five.closeModal(".new_school_popup");
		} else {
			five.alert(response['message'],response['title']);
		}
	}, function(src,errorCode) {
		five.hideIndicator();
		five.alert("Sending the school add request failed. (" + src + " error " + errorCode + ")");
	});
}
function logOut() {
	localStorage[packagePrefix + "uname"] = "";
	localStorage[packagePrefix + "token"] = "";
	startupCheck();
}
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
// Function to replace special characters in passwords to prevent form derping.
function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
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