const navbar = document.querySelector('.fixed-top');
const color = "#FA6C2C"
const noColor = "rgba(0, 0, 0, 0)"
const buttonBoutique = document.querySelector('.buttonBoutique')

window.onscroll = () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = color
    } else {
        navbar.style.backgroundColor = noColor
    }
};

buttonBoutique.addEventListener('click', (e) => {
  e.preventDefault()
  alert("La boutique n'est pas encore ouverte. Contactez le staff sur le Discord !  :)")
})