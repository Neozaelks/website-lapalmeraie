const navbar = document.querySelector('.fixed-top');
const color = "#FA6C2C"
const noColor = "rgba(0, 0, 0, 0)"

window.onscroll = () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = color
    } else {
        navbar.style.backgroundColor = noColor
    }
};
