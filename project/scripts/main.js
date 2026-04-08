const storageKeys = {
  plan: "lift-to-grow-plan"
};

const focusLibrary = [
  {
    id: "consistency",
    title: "Work on consistency first",
    summary: "Keep your routine simple and easier to follow each week.",
    tips: [
      "Try to train on the same days every week.",
      "Use a simple split you can repeat.",
      "Track your main lifts before worrying about advanced stuff."
    ]
  },
  {
    id: "nutrition",
    title: "Work on nutrition",
    summary: "Your training will usually feel better when your eating is more consistent.",
    tips: [
      "Try to include protein in more of your meals.",
      "Do not skip meals after training if possible.",
      "Use simple foods you can eat regularly."
    ]
  },
  {
    id: "recovery",
    title: "Work on recovery",
    summary: "If sleep and fatigue are bad, adding more work usually will not help much.",
    tips: [
      "Try to get closer to seven to nine hours of sleep.",
      "Do not take every set to total failure.",
      "Lower extra work if soreness keeps lasting too long."
    ]
  },
  {
    id: "intensity",
    title: "Improve your training effort",
    summary: "You may not need a whole new plan. You may just need clearer goals.",
    tips: [
      "Pick a rep range and try to do a little better than last week.",
      "Focus on good form and full range of motion.",
      "Do not let accessories just become random extra fatigue."
    ]
  },
  {
    id: "balanced",
    title: "You have a good base",
    summary: "Your main habits are in a decent place, so now the goal is steady progress.",
    tips: [
      "Add reps first, then add weight later.",
      "Keep your routine the same for a while before changing it.",
      "Pay attention to sleep, soreness, and energy."
    ]
  }
];

const mythLibrary = [
  {
    prompt: "You need to destroy muscles to make them grow.",
    answer: "Hard training can make you sore, but muscle growth comes more from good training and recovery than from trying to destroy a muscle."
  },
  {
    prompt: "If a workout does not leave you sore, it did not work.",
    answer: "Soreness can happen, but it is not required. Getting stronger over time matters more."
  },
  {
    prompt: "Protein shakes matter more than total eating habits.",
    answer: "A protein shake is just an easy food option. Your overall eating habits matter more."
  }
];

document.addEventListener("DOMContentLoaded", initSite);

function initSite() {
  setYear();
  initMenu();
  markCurrentPage();
  renderSavedSummary();
  renderMyths();
  initPlanForm();
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = `${new Date().getFullYear()}`;
  });
}

function initMenu() {
  const button = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!button || !nav) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", `${isOpen}`);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function markCurrentPage() {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav] a").forEach((link) => {
    const linkFile = link.getAttribute("href");

    if (linkFile === currentFile) {
      link.classList.add("current");
      link.setAttribute("aria-current", "page");
    }
  });
}

function renderSavedSummary() {
  const savedPlan = getSavedPlan();
  const summaryTargets = document.querySelectorAll("[data-saved-summary]");

  if (!summaryTargets.length) {
    return;
  }

  if (!savedPlan) {
    summaryTargets.forEach((element) => {
      element.textContent = "No saved plan yet. Go to the starter plan page to make one.";
    });
    return;
  }

  summaryTargets.forEach((element) => {
    element.textContent = `Last saved focus: ${savedPlan.focusTitle.toLowerCase()}. Saved on ${savedPlan.savedOn}.`;
  });
}

function renderMyths() {
  const mythGrid = document.querySelector("[data-myth-grid]");

  if (!mythGrid) {
    return;
  }

  mythGrid.innerHTML = mythLibrary.map((item, index) => `
    <article class="myth-card">
      <p class="eyebrow">Myth ${index + 1}</p>
      <h3>${item.prompt}</h3>
      <button class="button button-secondary" type="button" data-myth-toggle aria-expanded="false">Show answer</button>
      <p class="myth-answer" hidden>${item.answer}</p>
    </article>
  `).join("");

  mythGrid.querySelectorAll("[data-myth-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", `${!isOpen}`);
      button.textContent = isOpen ? "Show answer" : "Hide answer";
      answer.hidden = isOpen;
    });
  });
}

function initPlanForm() {
  const form = document.querySelector("[data-plan-form]");
  const resetButton = document.querySelector("[data-reset-plan]");

  if (!form) {
    return;
  }

  hydrateForm(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const plan = buildPlan(new FormData(form));
    renderPlan(plan);
    savePlan(plan);
    renderSavedSummary();
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      form.reset();
      removeStorage(storageKeys.plan);
      renderEmptyPlan();
      renderSavedSummary();
    });
  }
}

function hydrateForm(form) {
  const savedPlan = getSavedPlan();

  if (!savedPlan) {
    renderEmptyPlan();
    return;
  }

  form.elements.firstName.value = savedPlan.name;
  form.elements.days.value = `${savedPlan.days}`;
  form.elements.proteinMeals.value = `${savedPlan.proteinMeals}`;
  form.elements.sleep.value = `${savedPlan.sleep}`;
  form.elements.challenge.value = savedPlan.challenge;

  const savedExperience = form.querySelector(`input[name="experience"][value="${savedPlan.experience}"]`);

  if (savedExperience) {
    savedExperience.checked = true;
  }

  renderPlan(savedPlan);
}

function buildPlan(formData) {
  const name = `${formData.get("firstName")}`.trim() || "You";
  const days = Number(formData.get("days"));
  const proteinMeals = Number(formData.get("proteinMeals"));
  const sleep = Number(formData.get("sleep"));
  const experience = `${formData.get("experience")}`;
  const challenge = `${formData.get("challenge")}`;

  const primaryFocusId = getPrimaryFocus(days, proteinMeals, sleep, challenge, experience);
  const focus = focusLibrary.find((item) => item.id === primaryFocusId) || focusLibrary[focusLibrary.length - 1];

  const completedPillars = [
    days >= 3,
    proteinMeals >= 3,
    sleep >= 7
  ].filter(Boolean).length;

  const statusMessage = completedPillars === 3
    ? "Your basics look pretty solid."
    : completedPillars === 2
      ? "You have a decent base, but one area still needs work."
      : "Start by getting the basics more consistent.";

  const weeklyTargets = [
    `${days <= 3 ? "Use mostly full-body workouts." : "Use a simple split you can repeat each week."}`,
    `${proteinMeals < 3 ? "Try to add one more meal with protein." : "Keep eating protein in most meals."}`,
    `${sleep < 7 ? "Try to improve your sleep before adding more work." : "Keep your sleep routine consistent."}`
  ];

  return {
    name,
    days,
    proteinMeals,
    sleep,
    experience,
    challenge,
    focusId: focus.id,
    focusTitle: focus.title,
    focusSummary: focus.summary,
    tips: focus.tips,
    weeklyTargets,
    statusMessage,
    savedOn: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date())
  };
}

function getPrimaryFocus(days, proteinMeals, sleep, challenge, experience) {
  if (challenge === "recovery" || sleep < 7) {
    return "recovery";
  }

  if (challenge === "nutrition" || proteinMeals < 3) {
    return "nutrition";
  }

  if (challenge === "consistency" || days < 3 || experience === "new") {
    return "consistency";
  }

  if (challenge === "intensity") {
    return "intensity";
  }

  return "balanced";
}

function renderPlan(plan) {
  const container = document.querySelector("[data-plan-result]");

  if (!container) {
    return;
  }

  const metaItems = [
    `${plan.days} workout days`,
    `${plan.proteinMeals} protein meals`,
    `${plan.sleep} hours of sleep`
  ];

  container.innerHTML = `
    <div class="result-card">
      <p class="eyebrow">Plan for ${escapeHtml(plan.name)}</p>
      <h2>${plan.focusTitle}</h2>
      <p>${plan.focusSummary}</p>
      <div class="result-meta">
        ${metaItems.map((item) => `<span class="meta-pill">${item}</span>`).join("")}
      </div>
      <p><strong>Status:</strong> ${plan.statusMessage}</p>
      <h3>Next steps</h3>
      <ul>
        ${plan.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
      <h3>Weekly goals</h3>
      <ul>
        ${plan.weeklyTargets.map((target) => `<li>${target}</li>`).join("")}
      </ul>
      <p><strong>Last saved:</strong> ${plan.savedOn}</p>
    </div>
  `;
}

function renderEmptyPlan() {
  const container = document.querySelector("[data-plan-result]");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="result-empty">
      <p class="eyebrow">Saved Result</p>
      <h2>No plan generated yet</h2>
      <p>Fill out the form to get a focus and a few next steps.</p>
    </div>
  `;
}

function savePlan(plan) {
  writeStorage(storageKeys.plan, JSON.stringify(plan));
}

function getSavedPlan() {
  const savedValue = readStorage(storageKeys.plan);

  if (!savedValue) {
    return null;
  }

  try {
    return JSON.parse(savedValue);
  } catch (error) {
    removeStorage(storageKeys.plan);
    return null;
  }
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    return null;
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    return null;
  }
}

function escapeHtml(value) {
  return `${value}`
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}
