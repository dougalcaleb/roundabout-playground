// Constants
const input = document.querySelector(".code");
// Settings
const autocomplete = [
	["[", "]"],
	["(", ")"],
	["{", "}"],
	[`"`, `"`],
	["`", "`"],
	["'", "'"],
];
const tabPairs = [
	["(", ")"],
	["{", "}"],
	["[", "]"],
];
// [name, type, default]
const autoSettings = [
	["pages", "array", "[]"],
	["id", "string", ".myCarousel"],
	["type", "string", ""],
	["infinite", "", ""],
	["parent", "string", "body"],
	["autoGenCSS", "bool", "true"],
	["navigation", "bool", "true"],
	["navigationBehavior", "", ""],
	["autoscroll", "bool", "false"],
	["autoscrollSpeed", "integer", "5000"],
	["autoscrollTimeout", "integer", "15000"],
	["autoscrollPauseOnHover", "bool", "false"],
	["autoscrollStartAfter", "integer", "5000"],
	["autoscrollDirection", "string", "right"],
	["transition", "integer", "300"],
	["transitionFunction", "string", "ease"],
	["throttle", "bool", "true"],
	["throttleTimeout", "integer", "300"],
	["throttleMatchTransition", "bool", "true"],
	["throttleKeys", "bool", "true"],
	["throttleSwipe", "bool", "true"],
	["throttleButtons", "bool", "true"],
	["throttleNavigation", "bool", "true"],
	["keys", "bool", "true"],
	["swipe", "bool", "true"],
	["swipeThreshold", "integer", "300"],
	["swipeMultiplier", "number", "1"],
	["swipeResistance", "number", "0.95"],
	["pagesToShow", "integer", "1"],
	["--enlargeCenter", "integer", "100"],
	["--sizeFalloff", "integer", "0"],
	["pageSpacing", "integer", "0"],
	["pageSpacingUnits", "string", "px"],
	["spacingMode", "string", "fill"],
	["scrollBy", "integer", "1"],
	["showWrappedPage", "bool", "false"],
	["mobile", "object", "{swipeThreshold:50}"],
	["mobileBreakpoint", "integer", "700"],
	["--visualPreset", "integer", "0"],
];
const accepted = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const tabSize = 4;
let updateSpeed = 1000;
// Variables
let tabs = 1;
let updated = true;
let updateChecker;
let carousel;
let codeShown = true;
let lastWasPair = false;
let autocompleting = true;
let typing = "";
let matcher;

// TODO:
/*
-  Autocomplete
   -  Simple box matching typing
-  Auto update / update on code close
-  Parse quotes in
*/

input.addEventListener("keydown", (e) => {
	clearTimeout(updateChecker);
	updateChecker = setTimeout(checkForUpdate, updateSpeed);
	updated = false;

	if (autocompleting && accepted.includes(e.key.toString().toLowerCase())) {
		checkAutocomplete(e.key);
	}

	checkForChar(input, 0);
	if (e.key == "Tab") {
		e.preventDefault();
		for (let a = 0; a < tabSize; a++) {
			insertAtCursor(" ", false);
		}
		return;
	}
	if (e.key == "Enter") {
		setTimeout(() => {
			let pairCorrection = 0;
			tabPairs.forEach((char) => {
				if (checkForChar(0, char[0])) {
					pairCorrection = -1;
					console.log(`Found ${char[0]}. Not tabbing.`);
				}
				if (checkForChar(0, char[1])) {
					pairCorrection = -1;
					console.log(`Found ${char[1]}. Not tabbing.`);
				}
			});
			for (let a = 0; a < tabSize * tabs; a++) {
				insertAtCursor(" ", false);
			}
			let result = calcTabs(pairCorrection);
			console.log(`New tab distance is ${result}`);
			lastWasPair = false;
		}, 0);
		// return;
		autocompleting = true;
		typing = "";
	}
	if (e.key == "Backspace") {
		if (lastWasPair) {
			e.preventDefault();
			lastWasPair = false;
			insertAtCursor("DELETE", false, -1);
			insertAtCursor("DELETE", true, 0);
		}
      if (autocompleting) {
         if (typing.length > 0) {
            typing = typing.substr(0, typing.length - 1);
         }
         checkAutocomplete("BACKSPACE");
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
			input.value = input.value.substring(0, startPos + side) + input.value.substring(endPos + side + 1, input.value.length);
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
			input.selectionStart = startPos - 1;
			input.selectionEnd = startPos - 1;
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
	let char = input.value.substring(pos + position - 2, pos + position - 1);
	if (!value && char.trim() != "") {
		return true;
	} else if (value == char) {
		return true;
	}
	return false;
}

function checkForUpdate() {
	if (!updated) {
		carousel = null;
		// let rawSettings = input.value.trim().substring(15, input.value.trim().length - 2);
		let settings;
		try {
			settings = JSON.parse(input.value.trim().substring(15, input.value.trim().length - 2));
			document.querySelector(".code-toggle").style.color = "";
		} catch (e) {
			document.querySelector(".code-toggle").style.color = "red";
		}
		let destroy = settings.id || ".myCarousel";
		if (document.querySelector(destroy)) {
			document.querySelector(destroy).remove();
		}
		if (document.querySelector(".roundabout-error-message")) {
			document.querySelector(".roundabout-error-message").remove();
		}
		roundabout.usedIds = [];
		roundabout.on = -1;
		carousel = new Roundabout(settings);
		updated = true;
	}
}

function calcTabs(correction = 0) {
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
	tabs = pairs - 1 + correction;
	return tabs;
}

function checkAutocomplete(key) {
   if (key == "BACKSPACE") {
      typing = typing.substr(0, typing.length - 1);
   } else {
      typing += key;
   }
	matcher = new RegExp(`${typing}[a-z]*`, "ig");
	let matches = [];
	document.querySelector(".autocomplete").innerHTML = null;
	autoSettings.forEach((setting) => {
		if (setting[0].match(matcher) && setting[0].substr(0, 2) != "--") {
			matches.push(setting);
			if (document.querySelector(".auto-hint")) {
				document.querySelector(".auto-hint").style.opacity = "0";
			}
			let autoHint = document.createElement("div");
			autoHint.classList.add("auto-row");
			autoHint.innerHTML = `<div>${setting[0]}</div><div>${setting[1]}</div><div>${setting[2]}</div>`;
			document.querySelector(".autocomplete").appendChild(autoHint);
		}
   });
   if (typing.length == 0) {
	   document.querySelector(".autocomplete").innerHTML = null;
      let autoHintRestore = document.createElement("div");
      autoHintRestore.classList.add("auto-hint");
      autoHintRestore.innerText = "Start typing above. Any matching settings will appear here.";
      document.querySelector(".autocomplete").appendChild(autoHintRestore);
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
		document.querySelector(".code-editor").style.display = "none";
		codeShown = false;
	} else {
		document.querySelector(".code-editor").style.display = "inline-block";
		codeShown = true;
	}
});
