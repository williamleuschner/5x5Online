var five = new Framework7();
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
five.params["modalTitle"] = '5x5 Online';
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
	var timestring = (d.getMonth()+1) + "/"
		+ d.getDate() + "/"
		+ d.getFullYear() + " "
		+ d.getHours() + ":";
	if (d.getMinutes() < 10) {
		timestring = timestring + "0" + d.getMinutes();
	} else {
		timestring = timestring + d.getMinutes();
	};
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
	var behaviors = new Object();
	behaviors["studentEngagement"] = document.getElementById("studentEngagement").value;
	behaviors["teacherBehavior"] = document.getElementById("teacherBehavior").value;
	behaviors["essentialQuestion"] = document.getElementById("essentialQuestion").value;
	//section 1
	var b = new Object();
	b["procedureManagement"] = document.getElementById("procedureManagement").checked;
	b["teacherMobile"] = document.getElementById("teacherMobile").checked;
	b["appropriateTone"] = document.getElementById("appropriateTone").checked;
	b["usedPraise"] = document.getElementById("usedPraise").checked;
	b["usedMotivation"] = document.getElementById("usedMotivation").checked;
	b["conseqPosted"] = document.getElementById("conseqPosted").checked;
	b["positiveRapport"] = document.getElementById("positiveRapport").checked;
	//section 2
	b["diffInstruction"] = document.getElementById("diffInstruction").checked;
	b["activeStudentPart"] = document.getElementById("activeStudentPart").checked;
	b["collabLearnStrat"] = document.getElementById("collabLearnStrat").checked;
	b["activationStrat"] = document.getElementById("activationStrat").checked;
	b["summStrat"] = document.getElementById("summStrat").checked;
	b["criticalThinking"] = document.getElementById("criticalThinking").checked;
	b["feedback"] = document.getElementById("feedback").checked;
	b["assessment"] = document.getElementById("assessment").checked;
	//section 3
	b["creating"] = document.getElementById("creating").checked;
	b["evaluating"] = document.getElementById("evaluating").checked;
	b["analyzing"] = document.getElementById("analyzing").checked;
	b["applying"] = document.getElementById("applying").checked;
	b["understanding"] = document.getElementById("understanding").checked;
	b["remembering"] = document.getElementById("remembering").checked;
	//section 4
	b["essays"] = document.getElementById("essays").checked;
	b["oeQuestions"] = document.getElementById("oeQuestions").checked;
	b["lessonDrivenPrompts"] = document.getElementById("lessonDrivenPrompts").checked;
	//long fields
	var adminComments = document.getElementById("adminComments").value;
	var ponder = document.getElementById("ponder").value;
	//Things that require calculation
	var period = getPeriod();
	//did the user enter a name?
	if (name == "") {
		five.alert('You must enter a teacher name.', 'Error')
		return;
	}
	if (subject == "") {
		five.alert('You must enter a subject.', 'Error')
		return;
	}
	if (rrQuadrant == '0'){
		five.alert('You must select a Rigor/Relevance Framework quadrant.', 'Error');
		return;
	}
	//Did the user check any of the checkboxes?
	if ( !(b["procedureManagement"] || b["teacherMobile"] || b["appropriateTone"] || b["usedPraise"] || b["usedMotivation"] || b["conseqPosted"] || b["positiveRapport"] || b["diffInstruction"] || b["activeStudentPart"] || b["collabLearnStrat"] || b["activationStrat"] || b["summStrat"] || b["criticalThinking"] || b["creating"] || b["evaluating"] || b["analyzing"] || b["applying"] || b["understanding"] || b["remembering"] || b["essays"] || b["oeQuestions"] || b["lessonDrivenPrompts"]) ) {
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
	handleData(name, subject, period, time, b, behaviors, rrQuadrant, adminComments, ponder)
}
function handleData(name, subject, period, time, b, behaviors, quad, adminComments, ponder) {
	bJSON = JSON.stringify(b);
	behaviorsJSON = JSON.stringify(behaviors);
	var submitAjax = new XMLHttpRequest();
	submitAjax.onreadystatechange = function() {
		if (submitAjax.readyState == 4 && submitAjax.status == 200) {
			responseObj = JSON.parse(submitAjax.responseText);
			five.hideIndicator()
			if (responseObj['s']) {
				clearForm()
			} else {
				console.log("AJAX Error.");
			}
			five.alert(responseObj['message'], responseObj['title']);
		}
	}
	five.showIndicator()
	submitAjax.open("POST", "http://s0ph0s.linuxd.net/5x5Online/ajax", true);
	submitAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	submitAjax.send("name=" + name +
		"&subject=" + subject +
		"&period=" + period +
		"&time=" + time +
		"&quad=" + quad +
		"&adminComments=" + adminComments +
		"&ponder=" + ponder +
		"&b=" + bJSON +
		"&behaviors=" + behaviorsJSON +
		"&uname=" + localStorage['username'] +
		"&token=" + localStorage['token']);
}
function save5x5() {
	five.showIndicator();
	//text boxen
	var name = document.getElementById("teacherName").value;
	var subject = document.getElementById("subject").value;
	var time = document.getElementById("time").value;
	//dropdowns
	var behaviors = new Object();
	behaviors["studentEngagement"] = document.getElementById("studentEngagement").value;
	behaviors["teacherBehavior"] = document.getElementById("teacherBehavior").value;
	behaviors["essentialQuestion"] = document.getElementById("essentialQuestion").value;
	//section 1
	var b = new Object();
	b["procedureManagement"] = document.getElementById("procedureManagement").checked;
	b["teacherMobile"] = document.getElementById("teacherMobile").checked;
	b["appropriateTone"] = document.getElementById("appropriateTone").checked;
	b["usedPraise"] = document.getElementById("usedPraise").checked;
	b["usedMotivation"] = document.getElementById("usedMotivation").checked;
	b["conseqPosted"] = document.getElementById("conseqPosted").checked;
	b["positiveRapport"] = document.getElementById("positiveRapport").checked;
	//section 2
	b["diffInstruction"] = document.getElementById("diffInstruction").checked;
	b["activeStudentPart"] = document.getElementById("activeStudentPart").checked;
	b["collabLearnStrat"] = document.getElementById("collabLearnStrat").checked;
	b["activationStrat"] = document.getElementById("activationStrat").checked;
	b["summStrat"] = document.getElementById("summStrat").checked;
	b["criticalThinking"] = document.getElementById("criticalThinking").checked;
	b["feedback"] = document.getElementById("feedback").checked;
	b["assessment"] = document.getElementById("assessment").checked;
	//section 3
	b["creating"] = document.getElementById("creating").checked;
	b["evaluating"] = document.getElementById("evaluating").checked;
	b["analyzing"] = document.getElementById("analyzing").checked;
	b["applying"] = document.getElementById("applying").checked;
	b["understanding"] = document.getElementById("understanding").checked;
	b["remembering"] = document.getElementById("remembering").checked;
	//section 4
	b["essays"] = document.getElementById("essays").checked;
	b["oeQuestions"] = document.getElementById("oeQuestions").checked;
	b["lessonDrivenPrompts"] = document.getElementById("lessonDrivenPrompts").checked;
	//long fields
	var adminComments = document.getElementById("adminComments").value;
	var ponder = document.getElementById("ponder").value;
	//Calculated values
	var period = getPeriod();
	otherSaves = localStorage["5x5saves"].split(",");
	console.log(toString(otherSaves));
	if (otherSaves.indexOf(name) != -1) {
		five.hideIndicator();
		five.alert("A 5x5 with this name is already saved.", "Save Error")
		return;
	}
	console.log("Writing save...")
	localStorage[name] = JSON.stringify({'name':name, 'subject':subject, 'period':period, 'time':time, 'behaviors':behaviors, 'b':b, 'quad':rrQuadrant, 'adminComments':adminComments, 'ponder':ponder});
	otherSaves.push(name);
	localStorage['5x5saves'] = otherSaves.toString();
	five.hideIndicator();
	five.alert("5x5 Saved as \"" + name + "\".");
}
function load5x5() {
	five.showIndicator();
	otherSaves = localStorage["5x5saves"].split(",");

	//Ask which one here later.
	/*
	selectedSave = getUserInupt()
	*/

	selectedSave = "Admin Admin";
	toLoad = JSON.parse(localStorage[selectedSave]);

	document.getElementById("teacherName").value = toLoad['name'];
	document.getElementById("subject").value = toLoad['subject'];
	document.getElementById("time").value = toLoad['time'];
	//dropdowns
	document.getElementById("studentEngagement").value = toLoad['behaviors']['studentEngagement'];
	document.getElementById("teacherBehavior").value = toLoad['behaviors']['teacherBehavior'];
	document.getElementById("essentialQuestion").value = toLoad['behaviors']['essentialQuestion'];
	//section 1
	document.getElementById("procedureManagement").checked = toLoad['b']['procedureManagement'];
	document.getElementById("teacherMobile").checked = toLoad['b']['teacherMobile'];
	document.getElementById("appropriateTone").checked = toLoad['b']['appropriateTone'];
	document.getElementById("usedPraise").checked = toLoad['b']['usedPraise'];
	document.getElementById("usedMotivation").checked = toLoad['b']['usedMotivation'];
	document.getElementById("conseqPosted").checked = toLoad['b']['conseqPosted'];
	document.getElementById("positiveRapport").checked = toLoad['b']['positiveRapport'];
	//section 2
	document.getElementById("diffInstruction").checked = toLoad['b']['diffInstruction'];
	document.getElementById("activeStudentPart").checked = toLoad['b']['activeStudentPart'];
	document.getElementById("collabLearnStrat").checked = toLoad['b']['collabLearnStrat'];
	document.getElementById("activationStrat").checked = toLoad['b']['activationStrat'];
	document.getElementById("summStrat").checked = toLoad['b']['summStrat'];
	document.getElementById("criticalThinking").checked = toLoad['b']['criticalThinking'];
	document.getElementById("feedback").checked = toLoad['b']['feedback'];
	document.getElementById("assessment").checked = toLoad['b']['assessment'];
	//section 3
	document.getElementById("creating").checked = toLoad['b']['creating'];
	document.getElementById("evaluating").checked = toLoad['b']['evaluating'];
	document.getElementById("analyzing").checked = toLoad['b']['analyzing'];
	document.getElementById("applying").checked = toLoad['b']['applying'];
	document.getElementById("understanding").checked = toLoad['b']['understanding'];
	document.getElementById("remembering").checked = toLoad['b']['remembering'];
	//section 4
	document.getElementById("essays").checked = toLoad['b']['essays'];
	document.getElementById("oeQuestions").checked = toLoad['b']['oeQuestions'];
	document.getElementById("lessonDrivenPrompts").checked = toLoad['b']['lessonDrivenPrompts'];
	//rrFramework
	rrQuadrant = toLoad['quad'];
	for (var i = 0; i < 4; i++) {
		if (rrQuads[i].getAttribute("value") == rrQuadrant) {
			rrQuads[i].classList.toggle("selected", true);
		} else {
			rrQuads[i].classList.toggle("selected", false);
		}
	}
	//long fields
	document.getElementById("adminComments").value = toLoad['adminComments'];
	document.getElementById("ponder").value = toLoad["ponder"];
	otherSaves = otherSaves.pop(otherSaves.indexOf(selectedSave));
	five.hideIndicator();
	localStorage['5x5saves'] = otherSaves.toString();
}
function connectionStateOn() {
	++didJustStart;
	connected = true;
	if (didJustStart > 1) {
		banner("Internet connected.");
	}
}
function connectionStateOff() {
	++didJustStart
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
    notification.id = "banner"
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
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}
function saveSettings() {
	var username = $$("#username").val();
	var token = $$("#token").val();
	localStorage['username'] = username;
	localStorage['token'] = token;
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
			localStorage['com.5x5Online.updateReady'] = 1;
			window.applicationCache.swapCache();
		}
	}, false);
}, false);
window.onload = function() {
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
	if (localStorage['5x5saves'] == undefined) {
		localStorage['5x5saves'] = [""].toString();
	}
	//Binding click event to RR framework quads
	rrQuads = document.getElementsByClassName("rrQuad");
	for (var anchor in rrQuads) {
		rrQuads[anchor].onclick = rr;
	}
	//Notify if update installed
	if (localStorage['com.5x5Online.updateReady'] == 1) {
		localStorage['com.5x5Online.updateReady'] = 0;
		banner("Update installed!")
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
}
$$(document).on('pageInit', '.page[data-page="settings"]', function (e) {
	$$("#username").val(localStorage['username']);
	$$("#token").val(localStorage['token']);
})