const checkbox = document.querySelectorAll('li[role="checkbox"]');
const checked = document.querySelector('li[aria-checked="true"]');
const allCheck = document.querySelector("#allCheck");

checkbox.forEach((item) => {
	item.addEventListener("click", function () {
		handlechecked(item);
	});
	item.addEventListener("keydown", function (e) {
		if (e.keyCode === 32) {
			handlechecked(item);
		}
	});
});

allCheck.addEventListener("click", handeleAllCheck);
allCheck.addEventListener("keydown", function (e) {
	if (e.keyCode === 32) {
		handeleAllCheck(e);
	}
});

function handeleAllCheck(e) {
	if (e.target.getAttribute("aria-checked") === "true") {
		checkbox.forEach((item) => item.setAttribute("aria-checked", "true"));
	} else {
		checkbox.forEach((item) => item.setAttribute("aria-checked", "false"));
	}
}

function handlechecked(item) {
	let arr = [];

	if (item.getAttribute("aria-checked") === "true") {
		item.setAttribute("aria-checked", "false");
		allCheck.setAttribute("aria-checked", "false");
	} else {
		item.setAttribute("aria-checked", "true");
	}
	checkbox.forEach((item) => arr.push(item.getAttribute("aria-checked")));

	if (item !== allCheck && arr.slice(1).includes("false") === false) {
		allCheck.setAttribute("aria-checked", "true");
	}
}
