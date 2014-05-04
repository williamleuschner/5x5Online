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
var firstOpen = true;
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
	$("#time").val(timestring);
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
	var name = $$("#teacherName").val();
	var subject = $$("#subject").val();
	var time = $$("#time").val();
	//dropdowns
	var behaviors = new Object();
	behaviors["studentEngagement"] = $$("#studentEngagement").val();
	behaviors["teacherBehavior"] = $$("#teacherBehavior").val();
	behaviors["essentialQuestion"] = $$("#essentialQuestion").val();
	//section 1
	var b = new Object();
	b["rulesPosted"] = $("#rulesPosted").prop("checked");
	b["teacherMobile"] = $("#teacherMobile").prop("checked");
	b["appropriateTone"] = $("#appropriateTone").prop("checked");
	b["usedPraise"] = $("#usedPraise").prop("checked");
	b["usedMotivation"] = $("#usedMotivation").prop("checked");
	b["conseqPosted"] = $("#conseqPosted").prop("checked");
	b["positiveRapport"] = $("#positiveRapport").prop("checked");
	//section 2
	b["diffInstruction"] = $("#diffInstruction").prop("checked");
	b["activeStudentPart"] = $("#activeStudentPart").prop("checked");
	b["collabLearnStrat"] = $("#collabLearnStrat").prop("checked");
	b["activationStrat"] = $("#activationStrat").prop("checked");
	b["summStrat"] = $("#summStrat").prop("checked");
	b["criticalThinking"] = $("#criticalThinking").prop("checked");
	//section 3
	b["creating"] = $("#creating").prop("checked");
	b["evaluating"] = $("#evaluating").prop("checked");
	b["analyzing"] = $("#analyzing").prop("checked");
	b["applying"] = $("#applying").prop("checked");
	b["understanding"] = $("#understanding").prop("checked");
	b["remembering"] = $("#remembering").prop("checked");
	//section 4
	b["essays"] = $("#essays").prop("checked");
	b["oeQuestions"] = $("#oeQuestions").prop("checked");
	b["lessonDrivenPrompts"] = $("#lessonDrivenPrompts").prop("checked");
	//long fields
	var adminComments = $$("#adminComments");
	var ponder = $$("#ponder");
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
				close: true
			},{
				text:"Yes",
				bold: false,
				onClick: handleData(name, subject, time, b, behaviors, adminComments, ponder),
				close: false
			}]
		});
		return;
	}
	/*if (email == false || email == undefined) {
		five.alert('It appears as though that teacher doesn\'t exist. Did you misspell their name?', 'Error');
		return;
	}*/
	handleData(name, subject, time, b, behaviors, adminComments, ponder)
}
function handleData(name, subject, time, b, behaviors, adminComments, ponder) {
	console.log("Handle function called.");
	/*if (!userDidSkipYesNo) {
		return;
	}*/
	bJSON = JSON.stringify(b);
	behaviorsJSON = JSON.stringify(behaviors);
	ajaxString = "name=" + encodeURIComponent(name) +
				 "&subject=" + encodeURIComponent(subject);
	$.post("https://s0ph0s.linuxd.net/5x5Online/ajax", {
		name:name,
		subject:subject,
		time:time,
		b:b,
		behaviors:behaviors,
		adminComments:adminComments,
		ponder:ponder
	}, function(data, status) {
			five.alert(String(data), status);
	});
}
function yesNoHandler1(userDidSkip) {
	five.closeModal();
	console.log("Modal button handler did stuff.");
	userDidSkipYesNo = userDidSkip;
	modalCallbackFinished = true;
	handleData()
}
function connectionState(bool) {
	console.log("Connection event: " + bool)
	if (bool & !firstOpen) {
		connected = true;
		banner("Connected to server.");
	} else if (bool & firstOpen) {
		connected = true;
		firstOpen = false;
	} else if (!bool & firstOpen) {
		connected = false;
		firstOpen = false;
	} else {
		connected = false;
		banner("Disconnected from server.");
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
$(function() {
	//Set the time field when the page loads.
	setTimeField();
	//$$("#teacherName").value = "Leuschner, Frederick";
	//$$("#subject").value = "AP Chemistry";
	//$$("#rulesPosted").checked = true;
	if (!navigator.onLine) {
		five.alert("You appear to be offline. Sending 5x5s will not be possible until you reconnect.");
		connected = false;
	} else {
		connected = true;
	}
	window.addEventListener("offline", connectionState(false));
	window.addEventListener("online", connectionState(true));
});