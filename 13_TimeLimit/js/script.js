const popContent = document.querySelector("#popContent");
const extendBtn = popContent.querySelector(".extend");
const lastBtn = popContent.querySelector("button:last-child");
let shiftPress = false;
popContent.setAttribute("tabindex", "-1");
extendBtn.focus();

function focuslockKeyUp(event) {
	if (event.shiftKey) {
		shiftPress = false;
	}
}
function focuslockKeyDown(event) {
	console.log(event.key);
	if (event.shiftKey) {
		shiftPress = true;
	}
	if (shiftPress && event.key === "Tab" && event.target === popContent) {
		event.preventDefault();
		lastBtn.focus();
	} else if (shiftPress && event.key === "Tab" && event.target === extendBtn) {
		event.preventDefault();
		popContent.focus();
	} else if (!shiftPress && event.key === "Tab" && event.target === lastBtn) {
		event.preventDefault();
		popContent.focus();
	}
}
popContent.addEventListener("keydown", focuslockKeyDown);
popContent.addEventListener("keyup", focuslockKeyUp);

document.addEventListener("keydown", function (event) {
	if (event.key === "Backspace") {
		// timeExtend();
		console.log("연장");
	}
});
