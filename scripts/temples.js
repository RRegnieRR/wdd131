const menuButton = document.querySelector('#menu');
const mainNav = document.querySelector('#mainNav');

menuButton.addEventListener('click', function () {
    mainNav.classList.toggle('open');

    if (mainNav.classList.contains('open')) {
        menuButton.textContent = '✖';
    } else {
        menuButton.textContent = '☰';
    }
});

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = 'Last Modified: ' + document.lastModified;
