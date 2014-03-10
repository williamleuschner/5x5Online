function showNotification(title, message, buttons, hasTable) {
	//Declare element variables
	backgroundOverlay = document.getElementById('notificationHolder');
	notification = document.getElementById('notification');
	nTitle = document.getElementById('notification--title');
	nTable = document.getElementById('notification--table');
	nMessage = document.getElementById('notification--message');
	nButtonHolder = document.getElementById('notification--buttonHolder');
	//Set notification text
	nTitle.innerHTML = title;
	nMessage.innerHTML = message;
	populateButtons(nButtonHolder, buttons);
	if (hasTable) {
		loadHandler(nTable);
	}
	//Set notification to be visible
	backgroundOverlay.classList.remove("noDisplay");
	notification.classList.remove('noDisplay');
	nTitle.classList.remove('noDisplay');
	//nTable.classList.remove('noDisplay');
	nMessage.classList.remove('noDisplay');
	nButtonHolder.classList.remove('noDisplay');
}
function hideNotification() {
	backgroundOverlay = document.getElementById('notificationHolder');
	notification = document.getElementById('notification');
	nTitle = document.getElementById('notification--title');
	//nTable = document.getElementById('notification--table');
	nMessage = document.getElementById('notification--message');
	nButtonHolder = document.getElementById('notification--buttonHolder');
	backgroundOverlay.classList.add("noDisplay");
	notification.classList.add('noDisplay');
	nTitle.classList.add('noDisplay');
	//nTable.classList.add('noDisplay');
	nMessage.classList.add('noDisplay');
	nButtonHolder.classList.add('noDisplay');
	nButtonHolder.innerHTML = '';
}
function loadHandler(tableVar) {
	
}
function populateButtons(containerVar, buttons) {
	var classToAdd = null
	switch(buttons.length) {
		case 1:
			classToAdd = "oneButton";
			break;
		case 2:
			classToAdd = "twoButton";
			break;
		case 3:
			classToAdd = "threeButton";
			break;
		default:
			classToAdd = "threeButton";
			break;
	}
	for (button in buttons) {
		link = document.createElement('a');
		temp = containerVar.appendChild(link);
		temp.innerHTML = buttons[button].text;
		temp.classList.add('notification--button');
		temp.setAttribute("onclick", buttons[button].action);
		temp.classList.add(classToAdd);
		if (buttons[button].isHarmful) {
			temp.classList.add("harmfulButton");
		}
	}
}
function submitButton() {
	showNotification('Sent', 'The 5x5 has been sent successfully.', [{action:'hideNotification()', text:'OK'}], false);
}