/* Creates a new choice form and inserts it into the poll creations */

var choiceIndex = 2;

function addChoice() {
	choiceIndex += 1;
	var placeholderText = "Choice " + choiceIndex;

	var newInput = document.createElement("input");
		newInput.setAttribute("class", "form-control");
		newInput.setAttribute("type", "text");
		newInput.setAttribute("name", "choiceTitles");
		newInput.setAttribute("placeholder", placeholderText);
		
	// var newLabel = document.createElement("label");
	// 	newLabel.setAttribute("for","choiceTitles");
	// 	var text = document.createTextNode("Choice: ");
	// 	newLabel.appendChild(text);

	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "form-group");
	// newDiv.appendChild(newLabel);
	newDiv.appendChild(newInput);

	var choicesContainer = document.getElementById("choicesGroup");
	choicesContainer.appendChild(newDiv);
}

function expandOptions() {
	var element = document.querySelector("#adv-features");
	if (element.style.visibility === "hidden") {
		element.style.visibility = "visible";
	} else {
		element.style.visibility = "hidden";
	}
}
