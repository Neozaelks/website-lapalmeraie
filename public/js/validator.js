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


formMcNickname.addEventListener('focusout', (e) => {
    if (regexMcNickname.test(formMcNickname.value)) {
        formMcNickname.classList.add("is-valid");
        formMcNickname.classList.remove("is-invalid");
    } else {
        formMcNickname.classList.remove("is-valid");
        formMcNickname.classList.add("is-invalid");
    }
});

formDiscordNickname.addEventListener('focusout', (e) => {
    if (regexDiscordNickname.test(formDiscordNickname.value)) {
        formDiscordNickname.classList.add("is-valid");
        formDiscordNickname.classList.remove("is-invalid");
    } else {
        formDiscordNickname.classList.remove("is-valid");
        formDiscordNickname.classList.add("is-invalid");
    }
});

formEmail.addEventListener('focusout', (e) => {
    if (regexFormEmail.test(formEmail.value)) {
        formEmail.classList.add("is-valid");
        formEmail.classList.remove("is-invalid");
    } else {
        formEmail.classList.remove("is-valid");
        formEmail.classList.add("is-invalid");
    }
});

formAge.addEventListener('focusout', (e) => {
    if (regexFormAge.test(formAge.value)) {
        formAge.classList.add("is-valid");
        formAge.classList.remove("is-invalid");
    } else {
        formAge.classList.remove("is-valid");
        formAge.classList.add("is-invalid");
    }
});

formGodfathers.addEventListener('focusout', (e) => {
    if (formGodfathers.value === "") {
        formGodfathers.classList.remove("is-valid");
        formGodfathers.classList.remove("is-invalid");
    } else if (regexGodfathers.test(formGodfathers.value)) {
        formGodfathers.classList.add("is-valid");
        formGodfathers.classList.remove("is-invalid");
    } else {
        formGodfathers.classList.remove("is-valid");
        formGodfathers.classList.add("is-invalid");
    }
});

formFoundOut.addEventListener('focusout', (e) => {
    if (formFoundOut.value !== "") {
        formFoundOut.classList.add("is-valid");
    } else {
        formFoundOut.classList.remove("is-valid");
    }
});

formApply.addEventListener('focusout', (e) => {
    if (formApply.value !== "") {
        formApply.classList.add("is-valid");
        formApply.classList.remove("is-invalid");
    } else {
        formApply.classList.remove("is-valid");
        formApply.classList.add("is-invalid");
    }
});


form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormInvalid = false;

    if (formMcNickname.value === "" || formMcNickname.classList.contains("is-invalid")) {
        formMcNickname.classList.add("is-invalid");
        isFormInvalid = true;
    }
    if (formDiscordNickname.value === "" || formDiscordNickname.classList.contains("is-invalid")) {
        formDiscordNickname.classList.add("is-invalid");
        isFormInvalid = true;
    }
    if (formEmail.value === "" || formEmail.classList.contains("is-invalid")) {
        formEmail.classList.add("is-invalid");
        isFormInvalid = true;
    }
    if (formAge.value === "" || formAge.classList.contains("is-invalid")) {
        formAge.classList.add("is-invalid");
        isFormInvalid = true;
    }
    if (formGodfathers.classList.contains("is-invalid")) {
        formGodfathers.classList.add("is-invalid");
        isFormInvalid = true;
    }
    if (formApply.value === "") {
        formApply.classList.add("is-invalid");
        isFormInvalid = true;
    }

    if (!isFormInvalid) {
        let fetchInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formMcNickname: formMcNickname.value,
                formDiscordNickname: formDiscordNickname.value,
                formEmail: formEmail.value,
                formAge: formAge.value,
                formGodfathers: formGodfathers.value,
                formFoundOut: formFoundOut.value,
                formApply: formApply.value
            })
        };

        fetch("/candidater", fetchInit)
        .then(res => res.json())
        .then(data => {
            let isResponseValid = true;

            if (!data.formMcNickname) {
                formMcNickname.classList.remove("is-valid");
                formMcNickname.classList.add("is-invalid");
                isResponseValid = false;
            }
            if (!data.formDiscordNickname) {
                formDiscordNickname.classList.remove("is-valid");
                formDiscordNickname.classList.add("is-invalid");
                isResponseValid = false;
            }
            if (!data.formEmail) {
                formEmail.classList.remove("is-valid");
                formEmail.classList.add("is-invalid");
                isResponseValid = false;
            }
            if (!data.formAge) {
                formAge.classList.remove("is-valid");
                formAge.classList.add("is-invalid");
                isResponseValid = false;
            }
            if (!data.formGodfathers) {
                formGodfathers.classList.remove("is-valid");
                formGodfathers.classList.add("is-invalid");
                isResponseValid = false;
            }
            if (!data.formApply) {
                formApply.classList.remove("is-valid");
                formApply.classList.add("is-invalid");
                isResponseValid = false;
            }

            if (isResponseValid) {
                alert('the form has been successfully sent'); // TODO add a real message
            } else {
                alert('the form could not be sent'); // TODO add a real message
            }
        });
    }
});
