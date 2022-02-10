const tabs = document.querySelectorAll('[role="tab"]');
const firstTab = tabs[0];
const lastTab = tabs[tabs.length - 1];
const panels = document.querySelectorAll(".tab-panel");
const moreBtns = document.querySelectorAll(".more-btn");
tabs.forEach((tab) => {
	tab.addEventListener("keyup", function (e) {
		const keyCode = e.keyCode;

		// 39 : 오른쪽 방향키 / 40: 아래쪽 방향키
		if (keyCode === 39 || keyCode === 40) {
			e.preventDefault();
			this.setAttribute("aria-selected", false);

			panels.forEach((panel) => {
				panel.classList.add("hidden");
			});

			//마지막 탭일경우
			if (this.getAttribute("aria-controls") === "tab-section3") {
				firstTab.setAttribute("aria-selected", true);
				firstTab.focus();
				panels[0].classList.remove("hidden");
			} else {
				this.nextElementSibling.setAttribute("aria-selected", true);
				this.nextElementSibling.focus();

				const selectedId = this.nextElementSibling.getAttribute("aria-controls");
				document.getElementById(selectedId).classList.remove("hidden");
			}
		}
		// 37 : 왼쪽 방향키 / 38: 위쪽 방향키
		if (keyCode === 37 || keyCode === 38) {
			e.preventDefault();
			this.setAttribute("aria-selected", false);

			panels.forEach((panel) => {
				panel.classList.add("hidden");
			});

			//첫번째 탭일경우
			if (this.getAttribute("aria-controls") === "tab-section1") {
				lastTab.setAttribute("aria-selected", true);
				lastTab.focus();
				panels[panels.length - 1].classList.remove("hidden");
			} else {
				this.previousElementSibling.setAttribute("aria-selected", true);
				this.previousElementSibling.focus();
				const selectedId = this.previousElementSibling.getAttribute("aria-controls");
				document.getElementById(selectedId).classList.remove("hidden");
			}
		}

		//end 키
		if (keyCode === 35) {
			this.setAttribute("aria-selected", false);

			panels.forEach((panel) => {
				panel.classList.add("hidden");
			});
			lastTab.setAttribute("aria-selected", true);
			lastTab.focus();
			panels[panels.length - 1].classList.remove("hidden");
		}

		//Home 키
		if (keyCode === 36) {
			this.setAttribute("aria-selected", false);

			panels.forEach((panel) => {
				panel.classList.add("hidden");
			});
			firstTab.setAttribute("aria-selected", true);
			firstTab.focus();
			panels[0].classList.remove("hidden");
		}
	});

	tab.addEventListener("keydown", function (e) {
		const keyCode = e.keyCode;
		console.log(keyCode);
		//tab키
		if (keyCode === 9) {
			e.preventDefault();
			const selectedPanel = document.getElementById(this.getAttribute("aria-controls")).querySelector(".more-btn");
			console.log(selectedPanel);
			selectedPanel.focus();
		}
	});

	tab.addEventListener("click", function (e) {
		e.preventDefault();
		tabs.forEach((tab) => {
			tab.setAttribute("aria-selected", false);
		});
		this.setAttribute("aria-selected", true);

		panels.forEach((panel) => {
			panel.classList.add("hidden");
		});

		const selectedId = this.getAttribute("aria-controls");
		document.getElementById(selectedId).classList.remove("hidden");
	});
});

moreBtns.forEach((moreBtn) => {
	moreBtn.addEventListener("keydown", function (e) {
		const keyCode = e.keyCode;
		if (keyCode === 9 && e.shiftKey) {
			e.preventDefault();
			const selectedNum = this.closest("section").getAttribute("id").split("tab-section")[1] - 1;
			console.log(selectedNum);
			tabs[selectedNum].focus();
		}
	});
});
