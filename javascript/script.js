// Constants
const input = document.querySelector(".code");
// Settings
const autocomplete = [
	["[", "]"],
   ["(", ")"],
   ["{", "}"],
	[`"`, `"`],
	["`", "`"],
	["'", "'"]
];
const tabPairs = [
   ["(", ")"],
   ["{", "}"],
   ["[", "]"]
];
const tabSize = 4;
let updateSpeed = 1000;
// Variables
let tabs = 1;
let updated = true;
let updateChecker;
let carousel;
let codeShown = true;
let lastWasPair = false;

// TODO:
/*
-  Correct indentation
   -  Detect how many pairs it's wrapped in
-  Autocomplete
   -  Simple box matching typing
-  Auto update / update on code close
-  Parse quotes in
*/

input.addEventListener("keydown", (e) => {
   clearTimeout(updateChecker);
   updateChecker = setTimeout(checkForUpdate, updateSpeed);
   updated = false;
   checkForChar(input, 0);
   if (e.key == "Tab") {
      e.preventDefault();
      for (let a = 0; a < tabSize * tabs; a++) {
         insertAtCursor(" ", false);
      }
      return;
   }
   if (e.key == "Enter") {
      setTimeout(() => {
         for (let a = 0; a < tabSize * tabs; a++) {
            insertAtCursor(" ", false);
         }
      }, 0);
      calcTabs();
      lastWasPair = false;
      return;
   }
   if (e.key == "Backspace") {
      if (lastWasPair) {
         e.preventDefault();
         lastWasPair = false;
         insertAtCursor("DELETE", false, -1);
         insertAtCursor("DELETE", true, 0);
      }
   }
   let wasPair = false;
	autocomplete.forEach((pair) => {
		if (e.key == pair[0] && !checkForChar(1)) {
			e.preventDefault();
			insertAtCursor(pair[0], false);
         insertAtCursor(pair[1], true);
         lastWasPair = true;
         wasPair = true;
      }
   });
   console.log(wasPair);
   if (!wasPair) {
      lastWasPair = false;
   }
});

function insertAtCursor(val, isEnd, side) {
	//IE support
	if (document.selection) {
		input.focus();
		sel = document.selection.createRange();
		sel.text = val;
	}
	//MOZILLA and others
	else if (input.selectionStart || input.selectionStart == "0") {
		var startPos = input.selectionStart;
      var endPos = input.selectionEnd;
      if (val == "DELETE") {
         input.value = input.value.substring(0, startPos+side) + input.value.substring(endPos+side+1, input.value.length);
      } else {
         input.value = input.value.substring(0, startPos) + val + input.value.substring(endPos, input.value.length);
      }
		if (isEnd && val != "DELETE") {
			input.selectionStart = startPos + val.length - 1;
			input.selectionEnd = startPos + val.length - 1;
		} else if (val != "DELETE") {
			input.selectionStart = startPos + val.length;
			input.selectionEnd = startPos + val.length;
      } else if (val == "DELETE" && !isEnd) {
         input.selectionStart = startPos-1;
         input.selectionEnd = startPos-1;
      } else if (val == "DELETE" && isEnd) {
         input.selectionStart = startPos;
         input.selectionEnd = startPos;
      }
	} else {
		input.value += val;
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

function calcTabs() {
   let chars = input.value.slice(0, input.selectionStart).split("");
   let pairs = 0;
   chars.forEach((codeChar) => {
      tabPairs.forEach((tabChar) => {
         if (codeChar == tabChar[0]) {
            pairs++;
         }
         if (codeChar == tabChar[1]) {
            pairs--;
         }
      });
   });
   tabs = pairs - 1;
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