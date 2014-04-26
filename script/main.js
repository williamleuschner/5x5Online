var five = new Framework7();
var $$ = Framework7.$;
var mainView = five.addView('.view-main', {
	dynamicNavbar: true
});
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
	//Success variable
	console.log("Defining variables for form fields...");
	//text boxen
	var name = document.getElementById("teacherName").value;
	var subject = document.getElementById("subject").value;
	var time = document.getElementById("time").value;
	//dropdowns
	var studentEngagement = document.getElementById("studentEngagement").value;
	var teacherBehavior = document.getElementById("teacherBehavior").value;
	var essentialQuestion = document.getElementById("essentialQuestion").value;
	//section 1
	var rulesPosted = document.getElementById("rulesPosted").value;
	var teacherMobile = document.getElementById("teacherMobile").value;
	var appropriateTone = document.getElementById("appropriateTone").value;
	var usedPraise = document.getElementById("usedPraise").value;
	var usedMotivation = document.getElementById("usedMotivation").value;
	var conseqPosted = document.getElementById("conseqPosted").value;
	var positiveRapport = document.getElementById("positiveRapport").value;
	//section 2
	var diffInstruction = document.getElementById("diffInstruction").value;
	var activeStudentPart = document.getElementById("activeStudentPart").value;
	var collabLearnStrat = document.getElementById("collabLearnStrat").value;
	var activationStrat = document.getElementById("activationStrat").value;
	var summStrat = document.getElementById("summStrat").value;
	var criticalThinking = document.getElementById("criticalThinking").value;
	//section 3
	var creating = document.getElementById("creating").value;
	var evaluating = document.getElementById("evaluating").value;
	var analyzing = document.getElementById("analyzing").value;
	var applying = document.getElementById("applying").value;
	var understanding = document.getElementById("understanding").value;
	var remembering = document.getElementById("remembering").value;
	//section 4
	var essays = document.getElementById("essays").value;
	var oeQuestions = document.getElementById("oeQuestions").value;
	var lessonDrivenPrompts = document.getElementById("lessonDrivenPrompts").value;
	//long fields
	var adminComments = document.getElementById("adminComments");
	var ponder = document.getElementById("ponder");
	console.log("Done");
	//Things that require calculation
	console.log("Getting period...");
	var period = getPeriod();
	console.log("Done");
	//did the user enter a name?
	console.log("Checking for name...");
	if (name == "") {
		five.alert('You must enter a teacher name.', 'Error')
		return;
	}
	console.log("Done");
	console.log("Checking for subject...");
	if (subject == "") {
		five.alert('You must enter a subject.', 'Error')
		return;
	}
	console.log("Done");
	//Did the user check any of the checkboxes?
	console.log("Checking for any checkbox checked...");
	if (
		rulesPosted ||
		teacherMobile ||
		appropriateTone ||
		usedPraise ||
		usedMotivation ||
		conseqPosted ||
		positiveRapport ||
		diffInstruction ||
		activeStudentPart ||
		collabLearnStrat ||
		activationStrat ||
		summStrat ||
		criticalThinking ||
		creating ||
		evaluating ||
		analyzing ||
		applying ||
		understanding ||
		remembering ||
		essays ||
		oeQuestions ||
		lessonDrivenPrompts ) {
		console.log("Displaying modal");
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
				onClick: handleData(name),
				close: false
			}]
		});
		//showNotification(,
		//	,
		//	[{action:"submitButton(true)", text:"Yes"}, {action:"hideNotification()", text:"No"}],
		//	false);
		return;
	}
	var nameSplit = name.split(", ");
	var email = findTeacher(nameSplit[0], nameSplit[1]);
	if (email == false) {
		five.alert('It appears as though that teacher doesn\'t exist. Did you misspell their name?', 'Error')
		return;
	}
	console.log("Done");
	console.log("Doing data handling...");
	handleData(name)
	console.log("Done");
}
function handleData(name) {
	five.alert("Email: " + email, "Debug")
}
function findTeacher(last, first) {
	//Find the teacher specified.
	//Returns false if no teacher found.
	//Returns email address if found.
	return "fgleuschner@cdschools.org"
}
window.onload = function() {
	//Set the time field when the page loads.
	setTimeField();
}