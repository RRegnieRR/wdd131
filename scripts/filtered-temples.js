const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg",
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg",
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg",
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg",
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg",
  },
  {
    templeName: "Lima Peru",
    location: "Lima, Peru",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg",
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg",
  },
  {
    templeName: "Anchorage Alaska",
    location: "Anchorage, Alaska, United States",
    dedicated: "1999, January, 9",
    area: 11937,
    imageUrl:
      "https://churchofjesuschristtemples.org/assets/img/temples/anchorage-alaska-temple/anchorage-alaska-temple-57454-main.jpg",
  },
  {
    templeName: "Paris France",
    location: "Le Chesnay, France",
    dedicated: "2017, May, 21",
    area: 44175,
    imageUrl:
      "https://churchofjesuschristtemples.org/assets/img/temples/paris-france-temple/paris-france-temple-2056-main.jpg",
  },
  {
    templeName: "Logan Utah",
    location: "Logan, Utah, United States",
    dedicated: "1884, May, 17",
    area: 119619,
    imageUrl:
      "https://churchofjesuschristtemples.org/assets/img/temples/logan-utah-temple/logan-utah-temple-40550-main.jpg",
  },
];

const menuButton = document.querySelector("#menu");
const mainNav = document.querySelector("#mainNav");
const pageTitle = document.querySelector("#pageTitle");
const templeCards = document.querySelector("#templeCards");
const navLinks = document.querySelectorAll(".nav-link");
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");
const numberFormatter = new Intl.NumberFormat("en-US");

const filters = {
  home: {
    title: "Home",
    predicate: () => true,
  },
  old: {
    title: "Old Temples",
    predicate: (temple) => getTempleYear(temple) < 1900,
  },
  new: {
    title: "New Temples",
    predicate: (temple) => getTempleYear(temple) > 2000,
  },
  large: {
    title: "Large Temples",
    predicate: (temple) => temple.area > 90000,
  },
  small: {
    title: "Small Temples",
    predicate: (temple) => temple.area < 10000,
  },
};

menuButton.addEventListener("click", () => {
  mainNav.classList.toggle("open");
  const navIsOpen = mainNav.classList.contains("open");

  menuButton.textContent = navIsOpen ? "✖" : "☰";
  menuButton.setAttribute("aria-expanded", String(navIsOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const filterName = link.dataset.filter;
    const selectedFilter = filters[filterName];
    const filteredTemples = temples.filter(selectedFilter.predicate);

    displayTemples(filteredTemples);
    pageTitle.textContent = selectedFilter.title;
    updateActiveLink(link);
    closeMobileMenu();
  });
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
  lastModified.textContent = `Last Modified: ${document.lastModified}`;
}

displayTemples(temples);

function displayTemples(filteredTemples) {
  templeCards.innerHTML = "";

  filteredTemples.forEach((temple) => {
    const card = document.createElement("article");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const name = document.createElement("h3");
    const location = document.createElement("p");
    const dedicated = document.createElement("p");
    const area = document.createElement("p");

    card.className = "temple-card";
    content.className = "temple-card__content";

    image.src = temple.imageUrl;
    image.alt = `${temple.templeName} Temple`;
    image.loading = "lazy";
    image.decoding = "async";
    image.fetchPriority = "low";
    image.width = 400;
    image.height = 250;

    name.textContent = temple.templeName;
    location.innerHTML = `<span class="label">Location:</span> ${temple.location}`;
    dedicated.innerHTML = `<span class="label">Dedicated:</span> ${temple.dedicated}`;
    area.innerHTML = `<span class="label">Area:</span> ${numberFormatter.format(
      temple.area
    )} sq ft`;

    content.append(name, location, dedicated, area);
    card.append(image, content);
    templeCards.append(card);
  });
}

function getTempleYear(temple) {
  return Number(temple.dedicated.split(",")[0]);
}

function updateActiveLink(activeLink) {
  navLinks.forEach((link) => {
    const isActive = link === activeLink;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function closeMobileMenu() {
  mainNav.classList.remove("open");
  menuButton.textContent = "☰";
  menuButton.setAttribute("aria-expanded", "false");
}
