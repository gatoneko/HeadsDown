/* Creates a new choice form and inserts it into the poll creations */
function addChoice() {
	var newInput = document.createElement("input");
		newInput.setAttribute("type", "text");
		newInput.setAttribute("name", "choiceTitles");
		
	var newLabel = document.createElement("label");
		newLabel.setAttribute("for","choiceTitles");
		var text = document.createTextNode("Choice: ");
		newLabel.appendChild(text);

	var newDiv = document.createElement("div");
	newDiv.appendChild(newLabel);
	newDiv.appendChild(newInput);

	var choicesContainer = document.getElementById("choicesContainer");
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