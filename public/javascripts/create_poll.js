/* Creates a new choice form and inserts it into the poll creations */
function addChoice() {
	
	var newInput = document.createElement("input");
		newInput.setAttribute("type", "text");
		newInput.setAttribute("name", "choices");
		
	var newLabel = document.createElement("label");
		newLabel.setAttribute("for","choices");
		var text = document.createTextNode("Choice: ");
		newLabel.appendChild(text);

	var newDiv = document.createElement("div");
	newDiv.appendChild(newLabel);
	newDiv.appendChild(newInput);

	var choicesContainer = document.getElementById("choicesContainer");
	choicesContainer.appendChild(newDiv);
}