// Create local variable to avoid global namespace.
var sqrl = {};
sqrl.teamMemberLimit = 7;

sqrl.teamRegistrationAdd = document.getElementById("team-registration-add");
sqrl.teamRegistrationCancel = document.getElementById("team-registration-cancel");
sqrl.teamRegistrationSubmit = document.getElementById("team-registration-submit");

sqrl.teamRegistrationTBody = document.getElementById("team-registration-table-body");
sqrl.resultsTable = document.querySelectorAll(".tab-title");
sqrl.modals = document.querySelectorAll(".modal");
sqrl.modalsClose = document.querySelectorAll(".modal .close-icon, .modal-footer button");

function validEmail(email) {
	// check regex command.
	// http://www.webmonkey.com/2008/08/four_regular_expressions_to_check_email_addresses/
	var regex = new RegExp(".+\@.+\..+");
	return regex.test(email);
}

function removeEmailEntry() {
	// remove table entry.
	// need to go two levels to delete table entry
	var tr = this.parentElement.parentElement;
	var tbody = tr.parentElement;
	
	tbody.removeChild(tr);
}

function empty(element) {
	while(element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function getChildElementCount(element) {
	var children = element.childNodes;
	var childrenCount = 0;
	
	for (var i = 0; i < children.length; i++) {
		childrenCount++;
	}
	return childrenCount;
}
function tabContentUpdate() {
	var tab_id = this.getAttribute("data-tab");

	var currentTabLink = document.querySelector(".tab-title.current");
	currentTabLink.className = "tab-title";

	var currentTabContent = document.querySelector(".content.current");
	currentTabContent.className = "content";

	this.className = "tab-title current";
	var tabContent = document.getElementById(tab_id);
	tabContent.className = "content current";
}

function addTeamEmailAddress(text) {
	var tbody = sqrl.teamRegistrationTBody;
	
	// appends email to table.
	// create tr element
	var tr = document.createElement("tr");
	
	// create td element to store email text.
	var tdEmail = document.createElement("td");
	tdEmail.innerHTML = text;
	
	// create td element to store close icon
	var tdClose = document.createElement("td");
	
	// create close icon. add class name and add eventlistener
	var span = document.createElement("span");
	span.className = "close-icon";
	span.innerHTML = "x";
	span.onclick = removeEmailEntry;
	
	// append elements.
	tdClose.appendChild(span);
	tr.appendChild(tdEmail);
	tr.appendChild(tdClose);
	
	tbody.appendChild(tr);
}

function showModal(selector, title, message) {
	var titleElement = document.querySelector("#" + selector.id + " .modal-title-message");
	var messageElement = document.querySelector("#" + selector.id + " .modal-body");

	// update modal content
	titleElement.innerHTML = title;
	messageElement.innerHTML = message;
	
	selector.style.display = "flex";
}

function hideModal(event) {
	var selector = event.target.selector;
	selector.style.display = "none";
}

// add event to team registration add button.
if (sqrl.teamRegistrationAdd !== null) {
	// add current email.
	addTeamEmailAddress("bobnut@hotmail.com");
	
	sqrl.teamRegistrationAdd.addEventListener("click", function() {
		var email = document.getElementById("team-registration-email");
		//get email address input values.
		var text = email.value;
		
		var modal = document.getElementById("modal-popup");
		
		// verify email address input
		if (validEmail(text)) {
			
			var childElements = getChildElementCount(sqrl.teamRegistrationTBody);
			
			// check how many people are in team. maximum of 7 people allowed
			if (childElements < sqrl.teamMemberLimit) {
				addTeamEmailAddress(text);
			} else {
				showModal(modal, "Team Registration", "You have 7 members in your team already");
			}

		} else {
				showModal(modal, "Team Registration", "Invalid email");
		}
	});
}

if (sqrl.teamRegistrationCancel !== null) {
	sqrl.teamRegistrationCancel.addEventListener("click", function() {
		empty(sqrl.teamRegistrationTBody);
	});
}

if (sqrl.teamRegistrationSubmit !== null) {
	sqrl.teamRegistrationSubmit.addEventListener("click", function() {
		
		var childElements = getChildElementCount(sqrl.teamRegistrationTBody);
		var teamText = document.getElementById("team-registration-teamname");
		var modal = document.getElementById("modal-popup");

		if (childElements === 0) {
			showModal(modal, "Team Registration", "Please enter email address");
		} else if (childElements > 0 && childElements < sqrl.teamMemberLimit) {
			showModal(modal, "Team Registration", "Thank you for team form submission. SQRL will now find other teammates for you and notify you when ready");
		} else if (childElements === sqrl.teamMemberLimit && teamText.value !== "") {
			showModal(modal, "Team Registration", "Thank you for your team registration");
		} else {
			showModal(modal, "Team Registration", "Please enter a team name");
		}
	});
}

// add mutation observer to table element
sqrl.mutationTarget = sqrl.teamRegistrationTBody;
sqrl.mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == "childList") {
		var childElements = getChildElementCount(sqrl.teamRegistrationTBody);
		var teamRegistrationTeamName = document.getElementById("team-registration-teamname");
		if (childElements === sqrl.teamMemberLimit) {
			teamRegistrationTeamName.removeAttribute("disabled");
		} else {
			var att = document.createAttribute("disabled");
			teamRegistrationTeamName.setAttributeNode(att);
		}
	}
  });    
});

// configuration of the observer:
sqrl.mutationConfig = { attributes: true, childList: true, characterData: true };

if (sqrl.mutationTarget !== null) {
	// pass in the target node, as well as the observer options
	sqrl.mutationObserver.observe(sqrl.mutationTarget, sqrl.mutationConfig);
}

if (sqrl.resultsTable.length > 0) {
	for (var i = 0; i < sqrl.resultsTable.length; i++) {
		sqrl.resultsTable[i].addEventListener("click", tabContentUpdate);
	}
}

if (sqrl.modalsClose.length > 0) {
	for (var i = 0; i < sqrl.modalsClose.length; i++) {
		sqrl.modalsClose[i].addEventListener("click", hideModal);
		sqrl.modalsClose[i].selector = sqrl.modalsClose[i].parentElement.parentElement;
	}
}