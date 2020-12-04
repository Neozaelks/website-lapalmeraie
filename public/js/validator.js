const form = document.getElementById("formulaireCandidature");
const formMcNickname = document.getElementById("formMcNickname");
const formDiscordNickname = document.getElementById("formDiscordNickname");
const formAge = document.getElementById("formAge");
const formGodfathers = document.getElementById("formGodfathers");
const formFoundOut = document.getElementById("formFoundOut");
const formApply = document.getElementById("formApply");

const regexMcNickname = RegExp("^[a-zA-Z0-9_]{1,16}$");
const regexDiscordNickname = RegExp("^.{2,32}#[0-9]{4}$");
const regexFormAge = RegExp("^[0-9]{1,2}$");
const regexGodfathers = RegExp("^[a-zA-Z0-9_]{1,16}( [a-zA-Z0-9_]{1,16}){0,2}$");


$("#formApply, #formFoundOut").maxlength({
  threshold: 50,
  warningClass: "form-text text-warning mt-1",
  limitReachedClass: "form-text text-danger mt-1",
  placement: "bottom-right-inside"
});

autosize(formApply);


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

function checkFoundOutValidity() {
  if (formFoundOut.value === "") {
    formFoundOut.classList.remove("is-valid");
    formFoundOut.classList.remove("is-invalid");
    return true
  } else {
    return setInputFieldValidity(formFoundOut, formFoundOut.value.length <= 256)
  }
}


formMcNickname.addEventListener('focusout', (e) => {
  checkInputValidity(regexMcNickname, formMcNickname)
});

formDiscordNickname.addEventListener('focusout', (e) => {
  checkInputValidity(regexDiscordNickname, formDiscordNickname)
});

formAge.addEventListener('focusout', (e) => {
  checkInputValidity(regexFormAge, formAge)
});

formGodfathers.addEventListener('focusout', (e) => {
  checkGodfathersValidity()
});

formFoundOut.addEventListener('focusout', (e) => {
  checkFoundOutValidity()
});

formApply.addEventListener('focusout', (e) => {
  setInputFieldValidity(formApply, formApply.value !== "" && formApply.value.length <= 2048)
  autosize.update(formApply)
});


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const mcNicknameValidity = checkInputValidity(regexMcNickname, formMcNickname)
  const discordNicknameValidity = checkInputValidity(regexDiscordNickname, formDiscordNickname)
  const ageValidity = checkInputValidity(regexFormAge, formAge)
  const godfathersValidity = checkGodfathersValidity()
  const foundOutValidity = checkFoundOutValidity()
  const applyValidity = setInputFieldValidity(formApply, formApply.value !== "" && formApply.value.length <= 2048)

  if (mcNicknameValidity && discordNicknameValidity &&
    ageValidity && godfathersValidity && foundOutValidity && applyValidity) {
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
            setInputFieldValidity(formAge, data.form.age)
            setInputFieldValidity(formGodfathers, data.form.godfathers)
            setInputFieldValidity(formFoundOut, data.form.foundOut)
            setInputFieldValidity(formApply, data.form.apply)

            if (data.formValidity) {
              if (data.discordPresence) {
                alert('Le formulaire a bien été envoyé !'); // TODO add a real message
              } else {
                alert("Vous n'avez pas rejoint le Discord."); // TODO add a real message
              }
            } else {
              alert('Certains champs de texte sont invalides.'); // TODO add a real message
            }
          }
        });
      });
    });
  }
});
