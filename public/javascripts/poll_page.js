function showHideResults() {
	var results = document.querySelector("#results");
	if (results.style.display === "none") {
		results.style.display = "block";
	} else {
		results.style.display = "none";
	}
}

function f() {}

function checkOff(elem) {
	var buttonElements = document.querySelectorAll("input");
	buttonElements.forEach ( (element) => {
		if (element.checked === true) {
			element.checked = false;
		}
	});
	
	var newSelection = elem.firstChild;
	while(newSelection != null && newSelection.nodeType == 3){ // skip TextNodes
		newSelection = newSelection.nextSibling;
	}
	newSelection.checked = true;
}