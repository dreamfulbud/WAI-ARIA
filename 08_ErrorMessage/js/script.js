const btn = document.querySelector(".btn");
const input = document.querySelector("#fname");
const error = document.querySelector(".error");
btn.addEventListener("click", testInput);

function testInput() {
	const value = input.value;

	if (value === "") {
		error.textContent = "성을 입력하여 주세요";
		input.setAttribute("aria-invalid", "true");
		input.setAttribute("aria-describedby", "error-text");
		input.focus();
	} else {
		//test() 메서드는 주어진 문자열이 정규 표현식을 만족하는지 판별하고, 그 여부를 true 또는 false로 반환.
		if (/[a-zA-Z]+$/.test(value)) {
			input.removeAttribute("aria-invalid");
			input.removeAttribute("aria-describedby");
			error.textContent = "";
		} else {
			error.textContent = "영문으로 입력하여 주세요";
			input.setAttribute("aria-invalid", "true");
			input.setAttribute("aria-describedby", "error-text");
			input.focus();
		}
	}
}

/*
aria-invalid: 에러가 발생하고 있음을 알림.
aria-describedby: 에러메세지(id)와 연결

특정 폼과 연결할 수 없는 에러가 발생했을 때는
role="alert" : 동적으로 삽입되는 중요한 정보를 사용자에게 전달할 때 사용한 역할. 
해당 요소 안에 텍스트가 삽입되면 스크린리더가 읽던 내용을 끊고 삽입된 텍스트를 스크린리더가 즉각적으로 읽게 되므로 주의!
aria-live="assertive" 

속성값은 polite, assertive를 사용할 수 있으며 assertive를 많이 사용

*/
