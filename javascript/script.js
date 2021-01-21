const autocomplete = [
	["[", "]"],
	["(", ")"],
	[`"`, `"`],
	["`", "`"],
	["'", "'"],
];
const tabSize = 4;
let tabs = 1;
const input = document.querySelector(".code");

input.addEventListener("keydown", (e) => {
   if (e.key == "Tab") {
      e.preventDefault();
      for (let a = 0; a < tabSize * tabs; a++) {
         insertAtCursor(input, " ", false);
      }
      return;
   }
   if (e.key == "Enter") {
      setTimeout(() => {
         for (let a = 0; a < tabSize * tabs; a++) {
            insertAtCursor(input, " ", false);
         }
      }, 0);
      return;
   }
	autocomplete.forEach((pair) => {
		if (e.key == pair[0]) {
			e.preventDefault();
			insertAtCursor(input, pair[0], false);
         insertAtCursor(input, pair[1], true);
      }
	});
});

function insertAtCursor(myField, myValue, isEnd) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
	}
	//MOZILLA and others
	else if (myField.selectionStart || myField.selectionStart == "0") {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
		if (isEnd) {
			myField.selectionStart = startPos + myValue.length - 1;
			myField.selectionEnd = startPos + myValue.length - 1;
		} else {
			myField.selectionStart = startPos + myValue.length;
			myField.selectionEnd = startPos + myValue.length;
		}
	} else {
		myField.value += myValue;
	}
}
