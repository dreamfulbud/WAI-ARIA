const layer = document.querySelector(".layer-area");
const layerOpenBtn = document.querySelector(".layer-open");
const layerCloseBtn = document.querySelector(".layer-close");

//첫번째 요소
const firstEl = layer.querySelector("h2");
firstEl.setAttribute("tabindex", "0");

layer.addEventListener("keyup", handleESC);
layerOpenBtn.addEventListener("keydown", function (e) {
	if (e.key === "Enter" || e.keyCode === 32) {
		openLayer();
	}
});
layerOpenBtn.addEventListener("click", openLayer);

layerCloseBtn.addEventListener("keyup", function (e) {
	if (e.key === "Enter" || e.keyCode === 32) {
		closeLayer();
	}
});
layerCloseBtn.addEventListener("keydown", function (e) {
	if (e.shiftKey && e.key === "Tab") {
		//shift+tab
		this.previousElementSibling.focus();
	} else if (e.key === "Tab") {
		e.preventDefault();
		firstEl.focus();
	}
});
layerCloseBtn.addEventListener("click", closeLayer);

firstEl.addEventListener("keydown", function (e) {
	if (e.shiftKey && e.key === "Tab") {
		e.preventDefault();
		layer.setAttribute("aria-hidden", "true");
		layerOpenBtn.setAttribute("tabindex", "0");
		layerOpenBtn.focus();
		// layerCloseBtn.focus();
	}
});

function handleESC(e) {
	if (e.key === "Escape") {
		layer.setAttribute("aria-hidden", "true");
		layerOpenBtn.setAttribute("tabindex", "0");
		layerOpenBtn.focus();
	}
}

function openLayer() {
	layer.setAttribute("aria-hidden", "false");
	layerOpenBtn.setAttribute("tabindex", "-1");
	firstEl.focus();
}

function closeLayer() {
	layer.setAttribute("aria-hidden", "true");
	layerOpenBtn.setAttribute("tabindex", "0");
	layerOpenBtn.focus();
}

/*
alertdialog : 다이얼로그 역할을 정의
aria-labelledby : 팝업에 대한 제목을 기술해 둔 요소와 연결
aria-hidden="true" : 보조기기에서 들리지 않게 함.
aria-hidden="false" : 보조기기에서 들리게 함.
*/
