const placeholder = document.querySelector("#placeholder-name").textContent;
const inputName = document.querySelector("#user-name");

inputName.value = placeholder;

inputName.addEventListener("focusin", function () {
	// input과 placeholder의 내용이 같으면.
	if (inputName.value === placeholder) {
		inputName.setAttribute("style", "color:#000;");
		inputName.value = "";
	}
});

inputName.addEventListener("focusout", function () {
	console.log("포커스 아웃", inputName.value === "");
	if (inputName.value === "") {
		inputName.value = placeholder;
		inputName.setAttribute("style", "color:#767676; opacity:1;");
	} else {
		inputName.setAttribute("style", "color:#000;");
	}
});
