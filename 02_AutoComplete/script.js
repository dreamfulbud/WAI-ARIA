const autoComplte = document.querySelector("#autocomplete");
const txtField = autoComplte.querySelector("input[type='text']");
const statusInfo = document.createElement("div");
const count = 10;
let orgKeyword = "";
let delayTimer = null;
let suggestedList = null;

// Input 속성지정
txtField.setAttribute("role", "combobox");
txtField.setAttribute("aria-haspopup", "true");
txtField.setAttribute("aira-autocomplete", "list");
txtField.setAttribute("autocomplete", "off");

// 추천 리스트 정보 속성 지정
statusInfo.setAttribute("role", "status");
statusInfo.setAttribute("aria-live", "polite");
statusInfo.setAttribute("aria-relevant", "additions");

function updateList(event) {
	event.stopImmediatePropagation();
	const key = event.key;
	const keyword = txtField.value;
	if (orgKeyword === keyword) {
		return;
	}
	switch (key) {
		case "Enter":
		case "Escape":
		case "ArrowUp":
		case "ArrowDown":
			event.preventDefault();
			break;
		default:
			orgKeyword = keyword;
			clearTimeout(delayTimer);
			delayTimer = setTimeout(function () {
				if (keyword === "") {
					//빈 Input 일때,
					removeList();
					return;
				}
				autoComplte.appendChild(statusInfo);
				callAPI(keyword);
			}, 400);
	}
}

function bindKeyEvent(event) {
	event.stopImmediatePropagation();
	if (event.isComposing || event.keyCode === 229) return; // 한글 중복 버그 제거
	const key = event.key;
	let idx = 0;
	const activatedItem = txtField.getAttribute("aria-activedescendant");

	switch (key) {
		case "Enter":
			/* 
			enter : 선택된 항목의 텍스트를 가지고 양식 전송, 선택항목이 없거나, 
			추천 검색어가 없을 시 사용자가 입력한 키워드를 가지고 양식 전송
			*/
			if (activatedItem !== null) {
				//선택항목이 있는 경우 경우
				event.preventDefault();
				txtField.value = suggestedList.querySelector(`#${activatedItem}`).textContent;
				txtField.closest("form").submit();
			} else {
				//선택항목이 없는 경우
				txtField.closest("form").submit();
			}
			break;
		case "Escape": //Esc : 추천 검색어 목록을 닫고 문서에서 제거한다.
			event.preventDefault();
			txtField.value = orgKeyword;
			removeList();
			break;

		// up arrow 위로 : 이전항목 선택
		case "ArrowUp":
			event.preventDefault();

			if (suggestedList === null) {
				//일치하는 리스트 없음
				return;
			}
			if (txtField.getAttribute("aria-activedescendant") === null) {
				//인풋에 위치 : 가장 마지막 목록 선택
				idx = suggestedList.getAttribute("data-count") * 1 - 1;
			} else {
				idx = txtField.getAttribute("aria-activedescendant").split("item")[1] * 1 - 1;
			}
			if (idx !== suggestedList.getAttribute("data-count") * 1 - 1) {
				deSelectItem(`item${idx + 1}`);
			}

			selectItem(idx);
			console.log("idx :", idx, "key :", key);
			break;

		case "ArrowDown": // down arrow 아래로 : 다음 항목 선택
			event.preventDefault();
			if (suggestedList === null) {
				return;
			}
			if (txtField.getAttribute("aria-activedescendant") === null) {
				//인풋에 위치
				orgKeyword = txtField.value;
				idx = 0;
			} else {
				idx = txtField.getAttribute("aria-activedescendant").split("item")[1] * 1 + 1;
			}
			if (idx !== 0) {
				deSelectItem(`item${idx - 1}`);
			}
			selectItem(idx);
			break;
	}
}

function callAPI(keyword, count) {
	let source = [];

	$.ajax({
		method: "GET", //전송방식
		url: "https://dapi.kakao.com/v3/search/book", //전송주소 : 데이터를 전달할 URL
		headers: { Authorization: "KakaoAK 90e47056ec95327be8bc8044ba3fcd33" },
		data: { query: keyword, page: 1, size: count, sort: "accuracy", target: "title" }, //보낼 데이터
	}).done(function (data) {
		for (let i = -1, item = null; (item = data.documents[++i]); ) {
			source.push(item["title"]);
		}
		renderList(source);
	});
}

function renderList(source) {
	if (suggestedList === null) {
		suggestedList = document.createElement("ul");
		suggestedList.classList.add("listbox");
		suggestedList.setAttribute("role", "listbox");
		suggestedList.setAttribute("data-count", source.length);
	}
	autoComplte.appendChild(suggestedList);

	suggestedList.addEventListener("mousedown", function (event) {
		event.stopPropagation();
		const activatedItem = txtField.getAttribute("aria-activedescendant");

		//활성화 된제안 목록으로 연결
		const itemId = event.target.getAttribute("id");
		const itemIndex = itemId.split("item")[1]; //숫자

		deSelectItem(itemId);
		selectItem(itemIndex);
		removeList();
	});

	//추천 검색어 목록 외  영역 클릭시 초기화 처리
	document.addEventListener("mousedown", function (event) {
		if (event.target === txtField[0]) {
			return;
		}
		removeList();
	});

	//soure로부터 추천 검색어 항목 생성
	let docFrag = document.createDocumentFragment();
	for (let i = -1, item = null; (item = source[++i]); ) {
		const listItem = document.createElement("li");
		listItem.setAttribute("id", `item${i}`);
		listItem.setAttribute("role", "option");
		listItem.textContent = item;
		docFrag.appendChild(listItem);
	}
	suggestedList.setAttribute("data-count", source.length);
	suggestedList.innerHTML = "";
	suggestedList.appendChild(docFrag);

	txtField.removeAttribute("aria-activedescendant");
	txtField.setAttribute("aria-expanded", "true");
	const state = document.createElement("div");
	/* 추가되는 요소가 Phrasing 콘텐츠 요소(예를 들어 span)인 경우 
	일부 스크린 리더에서 노드 추가 상황을 인식하지 못하는 이슈가 있으므로
	가급적 Flow 콘텐츠 모델의 요소를 사용하되 자체적으로 나타내는 의미가 없는 div 요소 사용.
	*/
	state.textContent = source.length + "개의 추천 검색어가 있습니다.";
	statusInfo.innerHTML = "";
	statusInfo.appendChild(state);

	if (source.length === 0) {
		suggestedList.remove();
	}
}

function selectItem(idx) {
	if (idx < 0 || suggestedList === null || idx >= suggestedList.getAttribute("data-count")) {
		txtField.value = orgKeyword;
		removeList();
		return;
	}

	const valueItem = suggestedList.querySelector(`#item${idx}`);
	valueItem.classList.add("active");
	txtField.setAttribute("aria-activedescendant", `item${idx}`);
	txtField.value = valueItem.textContent;
}

function deSelectItem(id) {
	document.querySelector(`#${id}`).classList.remove("active");
}

function removeList() {
	if (suggestedList !== null) {
		suggestedList.remove();
		suggestedList = null;
		txtField.removeAttribute("aria-activedescendant");
		txtField.getAttribute("aria-expand", false);
		statusInfo.innerHTML = "";
	}
}

txtField.addEventListener("keyup", updateList);
txtField.addEventListener("keydown", bindKeyEvent);

/*
	if (event.isComposing || event.keyCode === 229) return;
	한글 중복 입력 버그 해결 코드

	event.stopPropagation();
	버블리이나 캡쳐링 단계에서 그 다음으로 이벤트를 전파하고 싶지 않을 때 부르는 메소드!
	addEventListener 로 등록된 이벤트 핸들러에서 
	stopPropagation 을 실행해도 인라인으로 등록된 콜백은 멈출 수 없다.

	event.stopImmediatePropagation()
	해당 이벤트 핸들러를 마지막으로 그 뒤에 실행 예정이었던 
	이벤트 핸들러는 그 어떤 것도 실행되지 않는다.
	이벤트 캡쳐링이나 버블링과 같은 전파를 막기 위함이 아니라 캡쳐링과 버블링을 포함해 다른 모든 이벤트 핸들러의 실행을 막는다. 
	그래서 최상위 DOM 엘리먼트에서stopImmediatePropagation 실행해버리면
	해당 핸들러만 실행되고 그 이벤트는 핸들러의 실행이 종료됨과 
	동시에 같이 전파도 끝났다고 보면 된다.


	stopPropagation 과 stopImmediatePropagation 은 동작이 서로 달라 사용할 때 주의가 필요하다.
	stopPropgagation 은 이벤트의 캡쳐링과 버블링의 전파만 막고 싶을 때 사용하면 좋다. 
	그리고 stopImmediatePropgation 은 이벤트 캡쳐링과 버블링 뿐만 아니라 현재 실행중인 이벤트 핸들러
	이후에 그 어떤 이벤트 핸들러도 실행시키고 싶지 않을 때 사용하면 유용하다.

	출처 : https://medium.com/%EC%98%A4%EB%8A%98%EC%9D%98-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/stoppropagation-vs-stopimmediatepropagation-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-75edaaed7841
*/
