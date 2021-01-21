// Constants
const input = document.querySelector(".code");
// Settings
const autocomplete = [
	["[", "]"],
	["(", ")"],
	[`"`, `"`],
	["`", "`"],
	["'", "'"],
	["{", "}"],
];
const tabSize = 4;
let updateSpeed = 1000;
// Variables
let tabs = 1;
let updated = true;
let updateChecker;
let carousel;
let codeShown = true;

input.addEventListener("keydown", (e) => {
   clearTimeout(updateChecker);
   updateChecker = setTimeout(checkForUpdate, updateSpeed);
   updated = false;
   checkForChar(input, 0);
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
		if (e.key == pair[0] && !checkForChar(1)) {
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

function checkForChar(position, value) {
   var pos = input.selectionStart + position;
   let char = input.value.substring(pos+position-2, pos+position-1);
   if (!value && char.trim() != "") {
      return true;
   } else if (value == char) {
      return true;
   }
   return false;
}

function checkForUpdate() {
   if (!updated) {
      console.log("Updating");
      carousel = null;
      let rawSettings = input.value.trim().substring(15, input.value.trim().length - 2);
      console.log(rawSettings);
      let settings = JSON.parse(input.value.trim().substring(15, input.value.trim().length - 2));
      console.log("Settings:");
      console.log(settings);
      let destroy = settings.id || ".myCarousel";
      if (document.querySelector(destroy)) {
         document.querySelector(destroy).remove();
      }
      if (document.querySelector(".carousel-error-message")) {
         document.querySelector(".carousel-error-message").remove();
      }
      roundabout.usedIds = [];
      roundabout.on = -1;
      carousel = new Roundabout(settings);
      updated = true;
   }
}

updateChecker = setTimeout(checkForUpdate, updateSpeed);

/*

new Roundabout({
    "pages": [
        {
            "background_image": "../images/numbers/0.png"
        },
    {
            "background_image": "../images/numbers/1.png"
        },
    {
            "background_image": "../images/numbers/2.png"
        }
    ]
});



*/

document.querySelector(".code-toggle").addEventListener("click", () => {
   if (codeShown) {
      input.style.display = "none";
      codeShown = false;
   } else {
      input.style.display = "inline-block";
      codeShown = true;
   }
});