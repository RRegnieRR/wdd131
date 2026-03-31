const reviewCountElement = document.querySelector("#reviewCount");
const storageKey = "reviewCount";

let reviewCount = Number(localStorage.getItem(storageKey)) || 0;
reviewCount += 1;

localStorage.setItem(storageKey, reviewCount);
reviewCountElement.textContent = reviewCount;
