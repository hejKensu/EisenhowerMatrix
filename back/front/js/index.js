setHeader();

async function setHeader() {
  // Local Storage 에 Token 존재 여부 감사
  const token = localStorage.getItem("x-access-token");

  //Token 이 없다면 signed 에 hidden Class 붙이기
  if (!token) {
    const signed = document.querySelector(".signed");
    signed.classList.add("hidden");
    return;
  }

  const config = {
    method: "get",
    url: url + "/jwt",
    headers: {
      "x-access-token": token,
    },
  };
  const res = await axios(config);

  if (res.data.code !== 200) {
    console.log("잘못된 토큰 입니다.");
    return;
  }

  const nickname = res.data.result.nickname;
  const spanNickname = document.querySelector("#nickname");
  spanNickname.innerText = nickname;

  //Token 이 있다면 signed 에 hidden Class 붙이기
  const unsigned = document.querySelector(".unsigned");
  unsigned.classList.add("hidden");
}


// ##### LOG OUT.

const buttonSignout = document.getElementById("sign-out");
buttonSignout.addEventListener("click", signout);

function signout(){
    localStorage.removeItem("x-access-token");
    location.reload();
}