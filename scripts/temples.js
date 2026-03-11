const menuButton = document.querySelector('#menu');
const mainNav = document.querySelector('#mainNav');

// menu button for small screens
menuButton.addEventListener('click', function () {
    mainNav.classList.toggle('open');

    if (mainNav.classList.contains('open')) {
        menuButton.textContent = '✖';
    } else {
        menuButton.textContent = '☰';
    }
});

// footer dates
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = 'Last Modified: ' + document.lastModified;
