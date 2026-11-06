// Starter data. Locations can be connected to a shared admin database in the next phase.
const brands = [
  { name: "Nike", aisle: "Aisle 1" },
  { name: "Adidas", aisle: "Aisle 2" },
  { name: "Rebook", aisle: "Aisle 3" }
];

const input = document.querySelector("#brand-search");
const options = document.querySelector("#brand-options");
const result = document.querySelector("#location-result");
const clearButton = document.querySelector("#clear-search");
let activeIndex = -1;
let visibleBrands = [];

function normalize(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = old;
    }
  }
  return row[b.length];
}

function rankBrands(query) {
  const q = normalize(query);
  if (!q) return brands;
  return brands.map(brand => {
    const name = normalize(brand.name);
    let score = name.startsWith(q) ? 0 : name.includes(q) ? 1 : editDistance(q, name.slice(0, Math.min(name.length, q.length))) <= 2 ? 2 : 99;
    return { ...brand, score };
  }).filter(brand => brand.score < 99).sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
}

function renderOptions(query) {
  visibleBrands = rankBrands(query);
  activeIndex = -1;
  options.innerHTML = "";
  if (!query.trim()) {
    options.hidden = true;
    input.setAttribute("aria-expanded", "false");
    return;
  }
  if (!visibleBrands.length) {
    const empty = document.createElement("li");
    empty.className = "no-match";
    empty.textContent = "No matching brand found. Try another spelling.";
    options.append(empty);
  } else {
    visibleBrands.forEach((brand, index) => {
      const item = document.createElement("li");
      item.setAttribute("role", "option");
      item.dataset.index = index;
      const name = document.createElement("span");
      name.textContent = brand.name;
      const aisle = document.createElement("small");
      aisle.textContent = brand.aisle;
      item.append(name, aisle);
      item.addEventListener("mousedown", event => event.preventDefault());
      item.addEventListener("click", () => chooseBrand(brand));
      options.append(item);
    });
  }
  options.hidden = false;
  input.setAttribute("aria-expanded", "true");
}

function chooseBrand(brand) {
  input.value = brand.name;
  options.hidden = true;
  input.setAttribute("aria-expanded", "false");
  clearButton.hidden = false;
  result.innerHTML = "";
  const content = document.createElement("div");
  content.className = "result-content";
  const top = document.createElement("div");
  top.className = "result-topline";
  top.textContent = "Your location";
  const name = document.createElement("div");
  name.className = "result-brand";
  name.textContent = brand.name;
  const panel = document.createElement("div");
  panel.className = "aisle-panel";
  const details = document.createElement("div");
  const label = document.createElement("div");
  label.className = "aisle-label";
  label.textContent = "Go to";
  const aisle = document.createElement("div");
  aisle.className = "aisle-value";
  aisle.textContent = brand.aisle;
  details.append(label, aisle);
  const symbol = document.createElement("div");
  symbol.className = "aisle-symbol";
  symbol.setAttribute("aria-hidden", "true");
  symbol.textContent = "⌖";
  panel.append(details, symbol);
  content.append(top, name, panel);
  result.append(content);
}

function reset() {
  input.value = "";
  clearButton.hidden = true;
  options.hidden = true;
  input.setAttribute("aria-expanded", "false");
  result.innerHTML = '<div class="result-placeholder"><span class="pin-icon">⌖</span><strong>Your aisle will appear here</strong><span>Select a brand to get started.</span></div>';
  input.focus();
}

input.addEventListener("input", () => {
  clearButton.hidden = !input.value;
  renderOptions(input.value);
});
input.addEventListener("focus", () => {
  if (input.value) renderOptions(input.value);
});
input.addEventListener("keydown", event => {
  if (options.hidden || !visibleBrands.length) {
    if (event.key === "Enter") {
      const best = rankBrands(input.value)[0];
      if (best) chooseBrand(best);
    }
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex = Math.min(activeIndex + 1, visibleBrands.length - 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (activeIndex >= 0) chooseBrand(visibleBrands[activeIndex]);
    else if (visibleBrands[0]) chooseBrand(visibleBrands[0]);
  } else if (event.key === "Escape") {
    options.hidden = true;
    input.setAttribute("aria-expanded", "false");
    return;
  } else return;
  [...options.querySelectorAll('[role="option"]')].forEach((item, index) => item.setAttribute("aria-selected", String(index === activeIndex)));
});
clearButton.addEventListener("click", reset);
document.addEventListener("click", event => {
  if (!event.target.closest(".search-wrap")) {
    options.hidden = true;
    input.setAttribute("aria-expanded", "false");
  }
});
