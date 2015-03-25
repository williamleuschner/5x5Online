var five = new Framework7();
/*{
	swipePanel:'left'
}*/
var $$ = Framework7.$;
var leftView = five.addView('.view-left', {
	dynamicNavbar: true
});
var mainView = five.addView('.view-main', {
	dynamicNavbar: true
});
$$('.panel-left').on('open', function() {
	five.sizeNavbars($$('.view-left'));
});
five.params.modalTitle = '5x5 Online';
ajaxURL = "http://s0ph0s.linuxd.org/5x5Online.dev/ajax";
packagePrefix = "com.5x5Online.";
var connected = false;
var modalCallbackFinished = false;
var userDidSkipYesNo = false;
var hasHTML5Storage = false;
var rrQuadrant = '0';
var rrQuads = [];
var didJustStart = 0;
function setTimeField() {
	//Make a date
	var d = new Date();
	//Make a string with the current time and date
	var timestring = (d.getMonth()+1) + "/" +
		d.getDate() + "/" +
		d.getFullYear() + " " +
		d.getHours() + ":";
	if (d.getMinutes() < 10) {
		timestring = timestring + "0" + d.getMinutes();
	} else {
		timestring = timestring + d.getMinutes();
	}
	//Get the date field
	var timeField = document.getElementById("time");
	//Set the value of the date field to timestring
	timeField.value = timestring;
	//Debugging
	//console.log("Logging the current time as " + timestring);
}
function getPeriod() {
	//Get the time now
	var now = new Date();
	//Get a time for midnight this morning
	var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	//Get the difference between those two times
	var diff = now - midnight;
	//Figure out what period that is
	if (diff < 27600000) { //before pd 1
		return -1;
	} else if (diff <= 30600000) { //pd 1
		return 1;
	} else if (diff <= 33300000) { //pd 2
		return 2;
	} else if (diff <= 36000000) { //pd 3
		return 3;
	} else if (diff <= 38700000) { //pd 4
		return 4;
	} else if (diff <= 41400000) { //pd 5
		return 5;
	} else if (diff <= 44100000) { //pd 6
		return 6;
	} else if (diff <= 46800000) { //pd 7
		return 7;
	} else if (diff <= 49500000) { //pd 8
		return 8;
	} else if (diff <= 52200000) { //pd 9
		return 9;
	} else if (diff > 52200000) { //after pd 9
		return -1;
	} else { //not a number
		return -1;
	}
}/*
function getPeriodDebug(testDate) {
	//Get the time for the test date
	var now = testDate;
	//Get a time for midnight this morning
	var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	//Get the difference between those two times
	var diff = now - midnight
	//Figure out what period that is
	if (diff < 27600000) { //before pd 1
		return -1;
	} else if (diff <= 30600000) { //pd 1
		return 1;
	} else if (diff <= 33300000) { //pd 2
		return 2;
	} else if (diff <= 36000000) { //pd 3
		return 3;
	} else if (diff <= 38700000) { //pd 4
		return 4;
	} else if (diff <= 41400000) { //pd 5
		return 5;
	} else if (diff <= 44100000) { //pd 6
		return 6;
	} else if (diff <= 46800000) { //pd 7
		return 7;
	} else if (diff <= 49500000) { //pd 8
		return 8;
	} else if (diff <= 52200000) { //pd 9
		return 9;
	} else if (diff > 52200000) { //after pd 9
		return -1;
	} else { //not a number
		return -1;
	}
}*/
function submitCheck() {
	//Checks the submission before it is submitted.
	//Is the user online?
	if (!connected) {
		five.alert("You are not online. Save the 5x5 and reconnect to submit.", "Error");
		return;
	}
	//Success variable for yes/no box
	//text boxen
	var name = document.getElementById("teacherName").value;
	var subject = document.getElementById("subject").value;
	var time = document.getElementById("time").value;
	//dropdowns
	var behaviors = {};
	behaviors.studentEngagement = document.getElementById("studentEngagement").value;
	behaviors.teacherBehavior = document.getElementById("teacherBehavior").value;
	behaviors.essentialQuestion = document.getElementById("essentialQuestion").value;
	//section 1
	var b = {};
	b.procedureManagement = document.getElementById("procedureManagement").checked;
	b.teacherMobile = document.getElementById("teacherMobile").checked;
	b.appropriateTone = document.getElementById("appropriateTone").checked;
	b.usedPraise = document.getElementById("usedPraise").checked;
	b.usedMotivation = document.getElementById("usedMotivation").checked;
	b.conseqPosted = document.getElementById("conseqPosted").checked;
	b.positiveRapport = document.getElementById("positiveRapport").checked;
	//section 2
	b.diffInstruction = document.getElementById("diffInstruction").checked;
	b.activeStudentPart = document.getElementById("activeStudentPart").checked;
	b.collabLearnStrat = document.getElementById("collabLearnStrat").checked;
	b.activationStrat = document.getElementById("activationStrat").checked;
	b.summStrat = document.getElementById("summStrat").checked;
	b.criticalThinking = document.getElementById("criticalThinking").checked;
	b.feedback = document.getElementById("feedback").checked;
	b.assessment = document.getElementById("assessment").checked;
	//section 3
	b.creating = document.getElementById("creating").checked;
	b.evaluating = document.getElementById("evaluating").checked;
	b.analyzing = document.getElementById("analyzing").checked;
	b.applying = document.getElementById("applying").checked;
	b.understanding = document.getElementById("understanding").checked;
	b.remembering = document.getElementById("remembering").checked;
	//section 4
	b.essays = document.getElementById("essays").checked;
	b.oeQuestions = document.getElementById("oeQuestions").checked;
	b.lessonDrivenPrompts = document.getElementById("lessonDrivenPrompts").checked;
	//long fields
	var adminComments = document.getElementById("adminComments").value;
	var ponder = document.getElementById("ponder").value;
	//Things that require calculation
	var period = getPeriod();
	//did the user enter a name?
	if (name === "") {
		five.alert('You must enter a teacher name.', 'Error');
		return;
	}
	if (subject === "") {
		five.alert('You must enter a subject.', 'Error');
		return;
	}
	if (rrQuadrant == '0'){
		five.alert('You must select a Rigor/Relevance Framework quadrant.', 'Error');
		return;
	}
	//Did the user check any of the checkboxes?
	if ( !(b.procedureManagement || b.teacherMobile || b.appropriateTone || b.usedPraise || b.usedMotivation || b.conseqPosted || b.positiveRapport || b.diffInstruction || b.activeStudentPart || b.collabLearnStrat || b.activationStrat || b.summStrat || b.criticalThinking || b.creating || b.evaluating || b.analyzing || b.applying || b.understanding || b.remembering || b.essays || b.oeQuestions || b.lessonDrivenPrompts) ) {
		five.modal({
			title:"Are You Sure?",
			text:"You have not selected any checkboxes. Are you sure you want to sumbit?",
			afterText: "",
			buttons:[{
				text:"No",
				bold: true,
				close:true
			},{
				text:"Yes",
				bold: false,
				onClick: handleData(name, subject, period, time, b, behaviors, rrQuadrant, adminComments, ponder),
				close: true
			}]
		});
		return;
	}
	handleData(name, subject, period, time, b, behaviors, rrQuadrant, adminComments, ponder);
}
function handleData(name, subject, period, time, b, behaviors, quad, adminComments, ponder) {
	var reqData = {
		method:"send",
		contents:{
			name:name,
			subject:subject,
			period:period,
			time:time,
			quad:quad,
			adminComments:adminComments,
			ponder:ponder,
			b:b,
			behaviors:behaviors
		},
		uname:localStorage[packagePrefix + 'uname'],
		token:localStorage[packagePrefix + 'token']
	};
	five.showIndicator();
	micropost(ajaxURL, reqData, function(response){
		five.hideIndicator();
		if (response.s) {
			clearForm();
		} else {
			console.log("AJAX Error.");
		}
		five.alert(response.message, response.title);
	}, function(src, errorCode){
		five.hideIndicator();
		if (errorCode === "") {
			errorString = " error";
		} else {
			errorString = " error ";
		}
		five.alert("Sending the 5x5 failed (" + src + errorString + errorCode + ").", "Error");
	});
}
function save5x5() {
	five.showIndicator();
	//text boxen
	var name = document.getElementById("teacherName").value;
	var subject = document.getElementById("subject").value;
	var time = document.getElementById("time").value;
	//dropdowns
	var behaviors = new Object();
	behaviors.studentEngagement = document.getElementById("studentEngagement").value;
	behaviors.teacherBehavior = document.getElementById("teacherBehavior").value;
	behaviors.essentialQuestion = document.getElementById("essentialQuestion").value;
	//section 1
	var b = new Object();
	b.procedureManagement = document.getElementById("procedureManagement").checked;
	b.teacherMobile = document.getElementById("teacherMobile").checked;
	b.appropriateTone = document.getElementById("appropriateTone").checked;
	b.usedPraise = document.getElementById("usedPraise").checked;
	b.usedMotivation = document.getElementById("usedMotivation").checked;
	b.conseqPosted = document.getElementById("conseqPosted").checked;
	b.positiveRapport = document.getElementById("positiveRapport").checked;
	//section 2
	b.diffInstruction = document.getElementById("diffInstruction").checked;
	b.activeStudentPart = document.getElementById("activeStudentPart").checked;
	b.collabLearnStrat = document.getElementById("collabLearnStrat").checked;
	b.activationStrat = document.getElementById("activationStrat").checked;
	b.summStrat = document.getElementById("summStrat").checked;
	b.criticalThinking = document.getElementById("criticalThinking").checked;
	b.feedback = document.getElementById("feedback").checked;
	b.assessment = document.getElementById("assessment").checked;
	//section 3
	b.creating = document.getElementById("creating").checked;
	b.evaluating = document.getElementById("evaluating").checked;
	b.analyzing = document.getElementById("analyzing").checked;
	b.applying = document.getElementById("applying").checked;
	b.understanding = document.getElementById("understanding").checked;
	b.remembering = document.getElementById("remembering").checked;
	//section 4
	b.essays = document.getElementById("essays").checked;
	b.oeQuestions = document.getElementById("oeQuestions").checked;
	b.lessonDrivenPrompts = document.getElementById("lessonDrivenPrompts").checked;
	//long fields
	var adminComments = document.getElementById("adminComments").value;
	var ponder = document.getElementById("ponder").value;
	//Calculated values
	var period = getPeriod();
	//Swap name back to First Last to keep the save part from breaking
	nameSplit = name.split(", ");
	name = nameSplit.reverse().join(" ");
	otherSaves = localStorage[packagePrefix + "5x5saves"].split(",");
	if (otherSaves.indexOf(name) != -1) {
		five.hideIndicator();
		five.alert("A 5x5 with this name is already saved.", "Save Error");
		return;
	}
	localStorage[packagePrefix + name] = JSON.stringify({'name':name, 'subject':subject, 'period':period, 'time':time, 'behaviors':behaviors, 'b':b, 'quad':rrQuadrant, 'adminComments':adminComments, 'ponder':ponder});
	otherSaves.push(name);
	localStorage[packagePrefix + '5x5saves'] = otherSaves.toString();
	five.hideIndicator();
	five.alert("5x5 Saved as \"" + name + "\".");
}
function openLoadModal() {
	var segment1 = '<div class="popup load_popup"><div class="view navbar-fixed"><div class="page"><div class="navbar"><div class="navbar-inner"><div class="center">Load 5x5</div><div class="right"><a href="#" class="link close-popup">Cancel</a></div></div></div><div class="page-content">';
	var segment2_withItems = '<div class="list-block"><ul>';
	var segment2_withoutItems = '<div class="content-block"><div class="content-block-inner"><p>No saved 5x5s.</p></div></div>';
	var listItem = '<li><a href="#" onclick="load5x5(\'{0}\')" class="item-link close-popup"><div class="item-content"><div class="item-inner"><div class="item-title">{0}</div></div></div></a></li>';
	var items = '';
	var segment3_withItems = '</ul></div>';
	var segment4 = '</div></div></div>';
	var otherSaves = localStorage[packagePrefix + '5x5saves'].split(",");
	for (var item in otherSaves) {
		if (otherSaves[item] != "dummy") {
			items += listItem.format(otherSaves[item]);
		}
	}
	var modalHTML = "";
	if (otherSaves.length == 1) {
		modalHTML = segment1 + segment2_withoutItems + segment4;
	} else if (otherSaves.length > 1) {
		modalHTML = segment1 + segment2_withItems + items + segment3_withItems + segment4;
	}
	five.popup(modalHTML);
}
function load5x5(selectedSave) {
	five.showIndicator();
	otherSaves = localStorage[packagePrefix + "5x5saves"].split(",");
	toLoad = JSON.parse(localStorage[packagePrefix + selectedSave]);

	document.getElementById("teacherName").value = toLoad.name;
	document.getElementById("subject").value = toLoad.subject;
	document.getElementById("time").value = toLoad.time;
	//dropdowns
	document.getElementById("studentEngagement").value = toLoad.behaviors.studentEngagement;
	document.getElementById("teacherBehavior").value = toLoad.behaviors.teacherBehavior;
	document.getElementById("essentialQuestion").value = toLoad.behaviors.essentialQuestion;
	fixSmartSelect("#selectEngagement");
	fixSmartSelect("#selectTeacher");
	fixSmartSelect("#selectEQ");
	//section 1
	document.getElementById("procedureManagement").checked = toLoad.b.procedureManagement;
	document.getElementById("teacherMobile").checked = toLoad.b.teacherMobile;
	document.getElementById("appropriateTone").checked = toLoad.b.appropriateTone;
	document.getElementById("usedPraise").checked = toLoad.b.usedPraise;
	document.getElementById("usedMotivation").checked = toLoad.b.usedMotivation;
	document.getElementById("conseqPosted").checked = toLoad.b.conseqPosted;
	document.getElementById("positiveRapport").checked = toLoad.b.positiveRapport;
	//section 2
	document.getElementById("diffInstruction").checked = toLoad.b.diffInstruction;
	document.getElementById("activeStudentPart").checked = toLoad.b.activeStudentPart;
	document.getElementById("collabLearnStrat").checked = toLoad.b.collabLearnStrat;
	document.getElementById("activationStrat").checked = toLoad.b.activationStrat;
	document.getElementById("summStrat").checked = toLoad.b.summStrat;
	document.getElementById("criticalThinking").checked = toLoad.b.criticalThinking;
	document.getElementById("feedback").checked = toLoad.b.feedback;
	document.getElementById("assessment").checked = toLoad.b.assessment;
	//section 3
	document.getElementById("creating").checked = toLoad.b.creating;
	document.getElementById("evaluating").checked = toLoad.b.evaluating;
	document.getElementById("analyzing").checked = toLoad.b.analyzing;
	document.getElementById("applying").checked = toLoad.b.applying;
	document.getElementById("understanding").checked = toLoad.b.understanding;
	document.getElementById("remembering").checked = toLoad.b.remembering;
	//section 4
	document.getElementById("essays").checked = toLoad.b.essays;
	document.getElementById("oeQuestions").checked = toLoad.b.oeQuestions;
	document.getElementById("lessonDrivenPrompts").checked = toLoad.b.lessonDrivenPrompts;
	//rrFramework
	rrQuadrant = toLoad.quad;
	for (var i = 0; i < 4; i++) {
		if (rrQuads[i].getAttribute("value") == rrQuadrant) {
			rrQuads[i].classList.toggle("selected", true);
		} else {
			rrQuads[i].classList.toggle("selected", false);
		}
	}
	//long fields
	document.getElementById("adminComments").value = toLoad.adminComments;
	document.getElementById("ponder").value = toLoad.ponder;
	console.log(otherSaves.indexOf(selectedSave));
	otherSaves.splice(otherSaves.indexOf(selectedSave), 1);
	localStorage.removeItem(selectedSave);
	five.hideIndicator();
	localStorage[packagePrefix + '5x5saves'] = otherSaves.toString();
}
// Requests teacher list for autocomplete
// function fillAutocompleteSelect() {
// 	var uname = localStorage[packagePrefix + 'uname'];
// 	var token = localStorage[packagePrefix + 'token'];
// 	if (uname == undefined || token == undefined || uname == null || token == null) {
//
// 	}
// 	var reqData = {
// 		method:"auth",
// 		contents:{
// 			uname:uname,
// 			token:token
// 		}
// 	};
// 	five.showIndicator();
// 	micropost("http://s0ph0s.linuxd.org/5x5Online/manage", reqData, function(response) {
// 		// Hide the loading indicator
// 		five.hideIndicator();
// 		// If the login attempt succeeded,
// 		if (response.s == true) {
// 			// Fill in the lists of stuff with the data the server sent.
// 			populateList(response.data);
// 		} else {
// 			// Otherwise, tell the user they dun goofed.
// 			five.alert(response.message,response.title);
// 		}
// 	}, function(src, errorCode) {
// 		five.hideIndicator();
// 		five.alert("Sending credentials failed. (" + src + " error " + errorCode + ")","Error");
// 	});
// }
// Populates the autocomplete list
function populateList(data) {
	var optionString = '<option value="{0}" class="delete_me_sel">{0}</option>';
	var options = "";
  console.log(data);
	for (var i = 0; i < data.length; i++) {
			options += optionString.format(data[i][2] + ", " + data[i][1]);
	}
	$$(".delete_me_sel").remove();
	$$("#teacherName").append(options);
	fixSmartSelect('#ssFix');
}
function undoNameSplit(toFix) {
	return toFix.split(", ").reverse().join(" ");
}
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
		localStorage[packagePrefix + "uname"] = uname;
		localStorage[packagePrefix + "token"] = token;
	} else {
		// read the values from local storage
		uname = localStorage[packagePrefix + "uname"];
		token = localStorage[packagePrefix + "token"];
	}
	// Make an object to hold the startup request data
	var reqData = {
		method:"startup",
		uname:uname,
		token:token
	};
	// Show a loading indicator
	five.showIndicator();
	// Send the request
	micropost(ajaxURL, reqData, function(response) {
		// Hide the loading indicator
		five.hideIndicator();
		// If the login attempt succeeded,
		if (response.s === true) {
			// Close the login modal, if open.
			five.closeModal(".auth_popup");
			// Fill in the lists of stuff with the data the server sent.
			populateList(response.data.teachers);
			//
			if (parseInt(response.data.msgId) > parseInt(localStorage[packagePrefix + '5x5msg'])) {
				five.alert(response.data.message,response.data.title);
				localStorage[packagePrefix + '5x5msg'] = parseInt(response.data.msgId);
			}
		} else {
			// Otherwise, tell the user they dun goofed.
			popupError(response.message);
			five.popup(".auth_popup");
		}
	}, function(src, errorCode) {
		five.hideIndicator();
		popupError("Sending credentials failed. (" + src + " error " + errorCode + ")");
		five.popup(".auth_popup");
	});
}
function popupError(text) {
	if (text === undefined) text = "undefined";
	$$(".error").text(text);
	setTimeout(function(){$$(".error").text("");}, 5000);
}
function fixSmartSelect(smartSelect) {
	var selectElement = $$(smartSelect).children("select");
	var selectText = $$(smartSelect).children('.item-content').children('.item-inner').children('.item-after');
	var selectElementSelectedOption = selectElement.children('option[value=\"'+selectElement.val()+'\"]').text();
	selectText.text(selectElementSelectedOption);
}
function logOut() {
	localStorage[packagePrefix + 'uname'] = "";
	localStorage[packagePrefix + 'token'] = "";
	authenticate(true);
}
function connectionStateOn() {
	++didJustStart;
	connected = true;
	if (didJustStart > 1) {
		banner("Internet connected.");
	}
}
function connectionStateOff() {
	++didJustStart;
	connected = false;
	if (didJustStart > 0) {
		banner("Internet disconnected.");
	}
}
function banner(text) {
    if ($$('#banner').length > 0) {
        $$('#banner').remove();
        clearTimeout(timeout);
    }

    $$('.views').addClass('reduce');

    var notification = document.createElement('div');
    notification.id = "banner";
    notification.innerHTML = text;
    $$('body').prepend(notification);

    notification = $$("#banner");
    timeout = setTimeout(function () {
        notification.addClass('close');
        $$('.views').removeClass('reduce');
        setTimeout(function() {
            notification.remove();
        }, 300 );
    }, 6000);

    notification.on('touchstart', function() {
        notification.addClass('close');
        $$('.views').removeClass('reduce');
        setTimeout(function() {
            notification.remove();
        }, 300 );
    });

}
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window.localStorage !== null;
	} catch (e) {
		return false;
	}
}
function saveSettings() {
	var username = $$("#username").val();
	var token = $$("#token").val();
	localStorage[packagePrefix + 'uname'] = username;
	localStorage[packagePrefix + 'token'] = token;
	mainView.goBack();
}
function clearForm() {
	document.getElementById("teacherName").value = "";
	document.getElementById("subject").value = "";
	document.getElementById("time").value = "";
	//dropdowns
	document.getElementById("studentEngagement").value = "engaged";
	document.getElementById("teacherBehavior").value = "explaining";
	document.getElementById("essentialQuestion").value = "posted";
	$$("#formPage").trigger('pageInit');
	//section 1
	document.getElementById("procedureManagement").checked = false;
	document.getElementById("teacherMobile").checked = false;
	document.getElementById("appropriateTone").checked = false;
	document.getElementById("usedPraise").checked = false;
	document.getElementById("usedMotivation").checked = false;
	document.getElementById("conseqPosted").checked = false;
	document.getElementById("positiveRapport").checked = false;
	//section 2
	document.getElementById("diffInstruction").checked = false;
	document.getElementById("activeStudentPart").checked = false;
	document.getElementById("collabLearnStrat").checked = false;
	document.getElementById("activationStrat").checked = false;
	document.getElementById("summStrat").checked = false;
	document.getElementById("criticalThinking").checked = false;
	document.getElementById("feedback").checked = false;
	document.getElementById("assessment").checked = false;
	//section 3
	document.getElementById("creating").checked = false;
	document.getElementById("evaluating").checked = false;
	document.getElementById("analyzing").checked = false;
	document.getElementById("applying").checked = false;
	document.getElementById("understanding").checked = false;
	document.getElementById("remembering").checked = false;
	//section 4
	document.getElementById("essays").checked = false;
	document.getElementById("oeQuestions").checked = false;
	document.getElementById("lessonDrivenPrompts").checked = false;
	//rrFramework
	for (var i = 0; i < 4; i++) {
		rrQuads[i].classList.toggle("selected", false);
	}
	//long fields
	document.getElementById("adminComments").value = "";
	document.getElementById("ponder").value = "";
	setTimeField();
}
function rr() {
	rrQuadrant = this.getAttribute("value");
	for (var i = 0; i < 4; i++) {
		rrQuads[i].classList.toggle("selected", false);
	}
	this.classList.toggle("selected", true);
}
window.addEventListener('load', function(e) {
	window.applicationCache.addEventListener('updateready', function(e) {
		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			banner("Update downloaded. Restart to install...");
			localStorage[packagePrefix + 'com.5x5Online.updateReady'] = 1;
			window.applicationCache.swapCache();
		}
	}, false);
}, false);
window.onload = function() {
	$$('.view').addClass('theme-' + localStorage[packagePrefix + 'theme']);
	$$('.view').addClass(localStorage[packagePrefix + 'layout']);
	//Set the time field when the page loads.
	setTimeField();
	//Connection checking
	if(window.addEventListener) {
	    window.addEventListener('offline', connectionStateOff);
	    window.addEventListener('online', connectionStateOn);
	} else {
	    document.body.attachEvent('onoffline', connectionStateOff);
	    document.body.attachEvent('ononline', connectionStateOn);
	}
	if (!navigator.onLine) {
		five.alert("You appear to be offline. Sending 5x5s will not be possible until you reconnect.");
		connected = false;
	} else {
		connected = true;
	}
	//HTML5 offline storage support
	if (supports_html5_storage()) {
		hasHTML5Storage = true;
	} else {
		hasHTML5Storage = false;
		five.alert("Your browser does not support HTML5 local storage. This web app WILL NOT work.");
	}
	//Initializing saves
	if (localStorage[packagePrefix + '5x5saves'] === undefined) {
		localStorage[packagePrefix + '5x5saves'] = [""].toString();
	}
  //Initializing last message keeper
  if (localStorage[packagePrefix + '5x5msg'] === undefined) {
    console.log("Setting local storage for last message to 0.");
    localStorage[packagePrefix + '5x5msg'] = 0;
  }
	//Create local storage for uname and token
	if (localStorage[packagePrefix + "uname"] === undefined) {
		localStorage[packagePrefix + "uname"] = "";
	}
	if (localStorage[packagePrefix + "token"] === undefined) {
		localStorage[packagePrefix + "token"] = "";
	}
	// Log the user in
	if (localStorage[packagePrefix + 'uname'] !== "" && localStorage[packagePrefix + 'token'] !== "") {
		console.log("User identity fields not blank. Attempting login...");
		authenticate(false);
	} else {
		five.popup(".auth_popup");
	}
	//Binding click event to RR framework quads
	rrQuads = document.getElementsByClassName("rrQuad");
	for (var anchor in rrQuads) {
		rrQuads[anchor].onclick = rr;
	}
	//Notify if update installed
	if (localStorage[packagePrefix + 'com.5x5Online.updateReady'] == 1) {
		localStorage[packagePrefix + 'com.5x5Online.updateReady'] = 0;
		banner("Update installed!");
	}
	if (localStorage[packagePrefix + '5x5saves'] === "") {
		console.log("Local storage array of saves was empty. Inserting dummy value...");
		localStorage[packagePrefix + '5x5saves'] = "dummy";
	}
    /*******************
	*                  *
	* RRR Grid Flipper *
	*                  *
	*******************/
	 // Checking for CSS 3D transformation support
    css3dSupport = supportsCSS3D();

    var formContainer = $$('#flipHolder');

    // Listening for clicks on the ribbon links
    $$('.flipLink').click(function(e){

        // Flipping the forms
        formContainer.toggleClass('flipped');

        // If there is no CSS3 3D support, simply
        // hide the login form (exposing the recover one)
        if(!css3dSupport){
            $$('#rrframeworkSelect').toggle();
        }
        e.preventDefault();
    });

    // A helper function that checks for the
    // support of the 3D CSS3 transformations.
    function supportsCSS3D() {
        var props = [
            'perspectiveProperty', 'WebkitPerspective', 'MozPerspective'
        ], testDom = document.createElement('a');

        for(var i=0; i<props.length; i++){
            if(props[i] in testDom.style){
                return true;
            }
        }

        return false;
    }
};
$$(document).on('pageInit', '.page[data-page="settings"]', function (e) {
	$$('input[name="color-radio"]').on('change', function () {
		if (this.checked) {
			$$('.view').removeClass('theme-pink theme-blue theme-red theme-black theme-gray theme-orange theme-yellow theme-lightblue theme-green');
			$$('.view').addClass('theme-' + $$(this).val());
			localStorage[packagePrefix + 'theme'] = $$(this).val();
		}
	});
	$$('input[name="layout-radio"]').on('change', function () {
		if (this.checked) {
			$$('.view').removeClass('layout-dark layout-white');
			$$('.view').addClass(this.value);
			localStorage[packagePrefix + 'layout'] = this.value;
		}
	});
});
