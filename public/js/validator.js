const form = document.getElementById("formulaireCandidature");
const formMcNickname = document.getElementById("formMcNickname");
const formDiscordNickname = document.getElementById("formDiscordNickname");
const formEmail = document.getElementById("formEmail");
const formAge = document.getElementById("formAge");
const formGodfathers = document.getElementById("formGodfathers");
const formFoundOut = document.getElementById("formFoundOut");
const formApply = document.getElementById("formApply");

const regexMcNickname = RegExp("^[a-zA-Z0-9_]{1,16}$");
const regexDiscordNickname = RegExp("^.{2,32}#[0-9]{4}$");
const regexFormEmail = RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
const regexFormAge = RegExp("^[0-9]{1,2}$");
const regexGodfathers = RegExp("^[a-zA-Z0-9_]{1,16}( [a-zA-Z0-9_]{1,16})* ?$");


function setInputFieldValidity(inputField, isValid) {
  if (isValid) {
    setInputFieldValid(inputField)
  } else {
    setInputFieldInvalid(inputField)
  }
  return isValid
}

function setInputFieldValid(inputField) {
  inputField.classList.add("is-valid")
  inputField.classList.remove("is-invalid")
}

function setInputFieldInvalid(inputField) {
  inputField.classList.remove("is-valid");
  inputField.classList.add("is-invalid");
}

function checkInputValidity(regex, inputField) {
  if (regex.test(inputField.value)) {
    setInputFieldValid(inputField)
    return true
  } else {
    setInputFieldInvalid(inputField)
    return false
  }
}

function checkGodfathersValidity() {
  if (formGodfathers.value === "") {
    formGodfathers.classList.remove("is-valid");
    formGodfathers.classList.remove("is-invalid");
    return true
  } else {
    return checkInputValidity(regexGodfathers, formGodfathers)
  }
}


formMcNickname.addEventListener('focusout', (e) => {
  checkInputValidity(regexMcNickname, formMcNickname)
});

formDiscordNickname.addEventListener('focusout', (e) => {
  checkInputValidity(regexDiscordNickname, formDiscordNickname)
});

formEmail.addEventListener('focusout', (e) => {
  checkInputValidity(regexFormEmail, formEmail)
});

formAge.addEventListener('focusout', (e) => {
  checkInputValidity(regexFormAge, formAge)
});

formGodfathers.addEventListener('focusout', (e) => {
  checkGodfathersValidity()
});

formFoundOut.addEventListener('focusout', (e) => {
  if (formFoundOut.value !== "") {
    formFoundOut.classList.add("is-valid");
  } else {
    formFoundOut.classList.remove("is-valid");
  }
});

formApply.addEventListener('focusout', (e) => {
  setInputFieldValidity(formApply, formApply.value !== "")
});


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const mcNicknameValidity = checkInputValidity(regexMcNickname, formMcNickname)
  const discordNicknameValidity = checkInputValidity(regexDiscordNickname, formDiscordNickname)
  const emailValidity = checkInputValidity(regexFormEmail, formEmail)
  const ageValidity = checkInputValidity(regexFormAge, formAge)
  const godfathersValidity = checkGodfathersValidity()
  const applyValidity = setInputFieldValidity(formApply, formApply.value !== "")

  if (mcNicknameValidity && discordNicknameValidity && emailValidity &&
    ageValidity && godfathersValidity && applyValidity) {
    grecaptcha.ready(function () {
      grecaptcha.execute('6Lf7IvEZAAAAAPzloUcoWk5DaaurFUmRsK7CVUtu', { action: 'submit' })
      .then(function (token) {
        let fetchInit = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            form: {
              mcNickname: formMcNickname.value,
              discordNickname: formDiscordNickname.value,
              email: formEmail.value,
              age: formAge.value,
              godfathers: formGodfathers.value,
              foundOut: formFoundOut.value,
              apply: formApply.value
            }
          })
        };

        fetch("/candidater", fetchInit)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setInputFieldValidity(formMcNickname, data.form.mcNickname)
            setInputFieldValidity(formDiscordNickname, data.form.discordNickname)
            setInputFieldValidity(formEmail, data.form.email)
            setInputFieldValidity(formAge, data.form.age)
            setInputFieldValidity(formGodfathers, data.form.godfathers)
            setInputFieldValidity(formApply, data.form.apply)

            if (data.formValidity) {
              if (data.discordPresence) {
                alert('the form has been successfully sent'); // TODO add a real message
              } else {
                alert('you are not on discord'); // TODO add a real message
              }
            } else {
              alert('there is invalid fields in your form'); // TODO add a real message
            }
          }
        });
      });
    });
  }
});
