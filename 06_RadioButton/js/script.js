const buttons = document.querySelectorAll('li[role="radio"]');
const checked = document.querySelector('li[aria-checked="true"]');

buttons.forEach((item) => {
	item.addEventListener("click", function () {
		selectButton(item);
	});
	item.addEventListener("keydown", handleKeyDown);
});

function selectButton(item) {
	const flag = item.getAttribute("aria-checked");
	console.log(flag);
	if (flag) {
		buttons.forEach((item) => {
			item.setAttribute("aria-checked", false);
			item.setAttribute("tabindex", "-1");
		});
		item.setAttribute("aria-checked", true);
		item.setAttribute("tabindex", "0");
	} else {
	}
}

function handleKeyDown(e) {
	console.log(e.keyCode);
	if (e.altKey) {
		return true;
	}
	// console.log(e.keyCode);
	switch (e.keyCode) {
		case 32: //스페이스
			selectButton(e.target);
			return true;
		case 37: //왼쪽
		case 38: // 위
			let prev = e.target.previousElementSibling;
			if (e.shiftKey) {
				return true;
			}
			if (e.target.id === buttons[0].id) {
				prev = buttons[buttons.length - 1];
			}
			prev.focus();
			e.stopPropagation();
			return false;

		case 39: // 오른쪽
		case 40: // 아래
			let next = e.target.nextElementSibling;
			if (e.shiftKey) {
				return true;
			}
			if (e.target.id === buttons[buttons.length - 1].id) {
				next = buttons[0];
			}
			next.focus();
			e.stopPropagation();
			return false;
	}
	return true;
}
