
const formElements = [
  "formMcNickname", 
  "formDiscordNickname", 
  "formEmail",
  "formAge",
  "formGodfathers",
  "formFoundOut",
  "formApply"
]

const regexMcNickname = RegExp("^[a-zA-Z0-9_]{1,16}$")
const regexDiscordNickname = RegExp("^.{2,32}#[0-9]{4}$")
const regexFormEmail = RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
const regexFormAge = RegExp("^[0-9]{1,2}$")

var form = document.getElementById("formulaireCandidature")
form.addEventListener('submit', function(e){
  // e.preventDefault()
  for(var i in formElements){
    // i is a counter
    buffer = document.getElementById(`${formElements[i]}`)
    // Buffer = content of the input N°i
    switch (i){
      case '0':
        if(regexMcNickname.test(buffer.value)){
          buffer.classList.add("is-valid")
        }else{
          buffer.classList.add("is-invalid")
          e.preventDefault()
        }
        break
      case '1':
        if(regexDiscordNickname.test(buffer.value)){
          buffer.classList.add("is-valid")
        }else{
          buffer.classList.add("is-invalid")
          e.preventDefault()
        }
        break
      case '2':
        if(regexFormEmail.test(buffer.value)){
          buffer.classList.add("is-valid")
        }else{
          buffer.classList.add("is-invalid")
          e.preventDefault()
        }
        break
      case '3':
        if(regexFormAge.test(buffer.value)){
          buffer.classList.add("is-valid")
        }else{
          buffer.classList.add("is-invalid")
          e.preventDefault()
        }
        break
      case '5':
        if(buffer.value !== ""){
          buffer.classList.add("is-valid")
        }else{
          buffer.classList.add("is-invalid")
        }
        break
      case '6':
        if(buffer.value !== ""){
          buffer.classList.add("is-valid")
        }else{
          buffer.classList.add("is-invalid")
        }
        break
    }
  }
})
