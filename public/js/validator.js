
const formElements = [
  "formMcNickname", 
  "formDiscordNickname", 
  "formEmail",
  "formAge",
  "formGodfathers",
  "formFoundOut",
  "formApply"
]

var form = document.getElementById("formulaireCandidature")
form.addEventListener('submit', function(e){
  e.preventDefault()
  for(var i in formElements){
    buffer = document.getElementById(`${formElements[i]}`)
    // buffer.value
    if(buffer.value == ''){
      e.preventDefault()
      buffer.classList.add("is-invalid")
    }
    else{
      buffer.classList.add("is-valid")
    }
  }
})
