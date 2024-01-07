//##### 토큰 검사
const token = localStorage.getItem("x-access-token");
if (token) {
  alert("로그아웃 후 이용해 주세요.");
  location.href = "index.html";
}
//#####토큰 검사

const buttonSignin = document.getElementById("signin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

buttonSignin.addEventListener("click", signin);

//SIGN IN 처리 함수
async function signin(event) {
  const currentEmail = inputEmail.value;
  const currentPassword = inputPassword.value;

  if (!currentEmail || !currentPassword) {
    return false;
  }

  //SIGN IN API 요청
  const config = {
    method: "post",
    url: url + "/sign-in",
    data: {
      email: currentEmail,
      password: currentPassword,
    },
  };

  try {
    const res = await axios(config);
    console.log(res);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    localStorage.setItem("x-access-token", res.data.result.token);
    alert(res.data.message);
    location.href = "index.html";
    return true;
  } catch (err) {
    console.log(err);
  }
}
