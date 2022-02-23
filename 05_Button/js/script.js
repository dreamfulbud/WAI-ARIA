const btnKor = document.querySelector("#lang-kor");
const btnEng = document.querySelector("#lang-eng");

btnKor.addEventListener("keyup", handleKeyup);
btnEng.addEventListener("keyup", handleKeyup);
btnKor.addEventListener("click", handleClick);
btnEng.addEventListener("click", handleClick);

function handleKeyup(e) {
	if (e.keyCode === 32) {
		handleClick(e);
	} else if (e.keyCode === 13) {
		handleClick(e);
	}
}

function handleClick(e) {
	const targetId = e.currentTarget.id;
	let buttonText = "";
	if (targetId === "lang-kor") buttonText = "한국어";
	else if (targetId === "lang-eng") buttonText = "영어";
	alert(`'${buttonText}'버튼을 클릭했습니다.`);
}
