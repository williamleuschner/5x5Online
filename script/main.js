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
	b["rulesPosted"] = document.getElementById("rulesPosted").checked;
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
	var adminComments = document.getElementById("adminComments");
	var ponder = document.getElementById("ponder");
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
	//Did the user check any of the checkboxes?
	if ( !(b["rulesPosted"] || b["teacherMobile"] || b["appropriateTone"] || b["usedPraise"] || b["usedMotivation"] || b["conseqPosted"] || b["positiveRapport"] || b["diffInstruction"] || b["activeStudentPart"] || b["collabLearnStrat"] || b["activationStrat"] || b["summStrat"] || b["criticalThinking"] || b["creating"] || b["evaluating"] || b["analyzing"] || b["applying"] || b["understanding"] || b["remembering"] || b["essays"] || b["oeQuestions"] || b["lessonDrivenPrompts"]) ) {
		five.modal({
			title:"Are You Sure?",
			text:"You have not selected any checkboxes. Are you sure you want to sumbit?",
			afterText: "",
			buttons:[{
				text:"No",
				bold: true,
				onClick: yesNoHandler1(false)
				close: false
			},{
				text:"Yes",
				bold: false,
				onClick: yesNoHandler1(true),
				close: false
			}]
		});
	}
	/*if (email == false || email == undefined) {
		five.alert('It appears as though that teacher doesn\'t exist. Did you misspell their name?', 'Error');
		return;
	}*/
	handleData(name, subject, time, b, behaviors, adminComments, ponder)
}
function handleData(name, subject, time, b, behaviors, adminComments, ponder) {
	console.log("Handle function called.");
	while (!modalCallbackFinished) {
		console.log("Waiting for user...");
	}
	if (!userDidSkipYesNo) {
		return;
	}
	bJSON = JSON.stringify(b);
	behaviorsJSON = JSON.stringify(behaviors);
	var submitAjax = new XMLHttpRequest();
	submitAjax.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			five.alert(submitAjax.responseText);
		}
	}
	submitAjax.open("POST", "/5x5Online/send5x5", true);
	submitAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	submitAjax.send("name=" + name + "&subject=" + subject + "&time=" + time + "&adminComments=" + adminComments + "&ponder=" + ponder + "&b=" + bJSON + "&behaviors=" + behaviorsJSON);
}
function yesNoHandler1(userDidSkip) {
	five.closeModal();
	userDidSkipYesNo = userDidSkip;
	modalCallbackFinished = true;
}
function save5x5() {
	five.alert("I haven't written this yet.");
}
function load5x5() {
	five.alert("I haven't written this yet.");
}
function connectionState(bool) {
	if (bool) {
		connected = true;
		banner("Internet connected.");
	} else {
		connected = false;
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
        setTimeout(function() {
            notification.remove();
        }, 300 );
    });

}
window.onload = function() {
	//Set the time field when the page loads.
	setTimeField();
	//document.getElementById("teacherName").value = "Leuschner, Frederick";
	//document.getElementById("subject").value = "AP Chemistry";
	//document.getElementById("rulesPosted").checked = true;
	if (!navigator.onLine) {
		five.alert("You appear to be offline. Sending 5x5s will not be possible until you reconnect.");
		connected = false;
	} else {
		connected = true;
	}
	window.addEventListener("offline", connectionState(false));
	window.addEventListener("online", connectionState(true));
}