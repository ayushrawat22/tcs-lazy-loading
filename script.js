const searchIcon = document.querySelector('.nav__wrapper--rightcontent-search');
const searchBar = document.querySelector('.nav__search');
const closeButton = document.querySelector('.nav__search-close');
const searchInput = document.querySelector('.nav__search-input');
const searchSuggestions = document.querySelector('.nav__search-suggestions');

// Hamburger / sidebar toggle
const hamburger = document.querySelector('.nav__wrapper--hamburger');
const sidebar = document.querySelector('.nav__sidebar');
const overlay = document.querySelector('.nav__overlay');

function toggleSidebar() {
  const opening = !sidebar.classList.contains('is-open');
  hamburger.classList.toggle('is-active');
  sidebar.classList.toggle('is-open');
  overlay.classList.toggle('is-open');

  if (opening) document.body.classList.add('no-scroll');
  else if (!modal.classList.contains('is-open')) document.body.classList.remove('no-scroll');
}

if (hamburger) {
  hamburger.addEventListener('click', toggleSidebar);
}
if (overlay) {
  overlay.addEventListener('click', toggleSidebar);
}

const sidebarItems = document.querySelectorAll('.nav__sidebar-list-item');
sidebarItems.forEach(item => {
  const link = item.querySelector('.nav__sidebar-list-link');
  const sub = item.querySelector('.nav__sidebar-sub');
  if (sub) item.classList.add('has-sub');

  link.addEventListener('click', (e) => {
    e.preventDefault();

    sidebarItems.forEach(other => {
      if (other !== item && other.classList.contains('is-expanded')) {
        other.classList.remove('is-expanded');
        const otherSub = other.querySelector('.nav__sidebar-sub');
        if (otherSub) otherSub.style.maxHeight = null;
        other.querySelectorAll('.nav__sidebar-sub-item.is-expanded').forEach(si => {
          si.classList.remove('is-expanded');
          const sc = si.querySelector('.nav__sidebar-sub-content');
          if (sc) sc.style.maxHeight = null;
        });
      }
    });

    // toggle current
    item.classList.toggle('is-expanded');
    if (item.classList.contains('is-expanded')) {
      sub.style.maxHeight = sub.scrollHeight + 'px';
    } else {
      item.querySelectorAll('.nav__sidebar-sub-item.is-expanded').forEach(si => {
        si.classList.remove('is-expanded');
        const sc = si.querySelector('.nav__sidebar-sub-content');
        if (sc) sc.style.maxHeight = null;
      });
      sub.style.maxHeight = null;
    }
  });
});


const subItems = document.querySelectorAll('.nav__sidebar-sub-item');
subItems.forEach(subItem => {
  const subLink = subItem.querySelector('.nav__sidebar-sub-link');
  const subContent = subItem.querySelector('.nav__sidebar-sub-content');
  if (subContent) subItem.classList.add('has-content');

  subLink.addEventListener('click', (e) => {
    if (!subContent) return;
    e.preventDefault();

    const parentSub = subItem.closest('.nav__sidebar-sub');

    parentSub.querySelectorAll('.nav__sidebar-sub-item').forEach(sibling => {
      if (sibling !== subItem && sibling.classList.contains('is-expanded')) {
        sibling.classList.remove('is-expanded');
        const sc = sibling.querySelector('.nav__sidebar-sub-content');
        if (sc) sc.style.maxHeight = null;
      }
    });

    subItem.classList.toggle('is-expanded');
    if (subItem.classList.contains('is-expanded')) {
      subContent.style.maxHeight = subContent.scrollHeight + 'px';
    } else {
      subContent.style.maxHeight = null;
    }

    if (parentSub) {
      parentSub.style.maxHeight = parentSub.scrollHeight + 'px';
      setTimeout(() => {
        if (parentSub.closest('.nav__sidebar-list-item')?.classList.contains('is-expanded')) {
          parentSub.style.maxHeight = parentSub.scrollHeight + 'px';
        }
      }, 350);
    }
  });
});

// Modal dropdown functionality
const whatWeDoLink = document.querySelector('.nav__wrapper--leftlinks-list-item--hasdropdown');
const whoNav = document.querySelector('[data-dropdown="who"]');
const insightsNav = document.querySelector('[data-dropdown="insights"]');
const careersNav = document.querySelector('[data-dropdown="careers"]');
const modal = document.querySelector('.modal');
const allLeftPanels = document.querySelectorAll('.modal__content-left');
const allRightPanels = document.querySelectorAll('.modal__content--right');
let hoverTimer = null;
let currentModal = 'what'; // used this to track which nav section is active

const navLinksMap = {
  'what': whatWeDoLink,
  'who': whoNav,
  'insights': insightsNav,
  'careers': careersNav
};

function clearActiveNavLinks() {
  document.querySelectorAll('.nav__wrapper--leftlinks-list-content').forEach(link => {
    link.classList.remove('is-active');
  });
}

function openModal() {
  modal.classList.add('is-open');
}

function closeModal() {
  modal.classList.remove('is-open');
  clearActiveNavLinks();
}

function showLeft(modalName) {
  allLeftPanels.forEach(p => p.classList.toggle('is-active', p.dataset.modal === modalName));
}

function showRight(viewName) {
  allRightPanels.forEach(p => p.classList.toggle('is-active', p.dataset.view === viewName));
}

function activateModal(modalName, defaultView) {
  currentModal = modalName;
  showLeft(modalName);
  showRight(defaultView);

  clearActiveNavLinks();
  const activeNavItem = navLinksMap[modalName];
  if (activeNavItem) {
    const link = activeNavItem.querySelector('.nav__wrapper--leftlinks-list-content');
    if (link) link.classList.add('is-active');
  }

  document.querySelectorAll('.modal__content-left-list-item').forEach(li => li.classList.remove('is-active'));
}

function scheduleRestore(delay = 180) {
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => {
    const activeLeft = document.querySelector('.modal__content-left.is-active');
    const anyActiveItem = activeLeft?.querySelector('.modal__content-left-list-item.is-active');
    if (!anyActiveItem) {
      if (activeLeft?.dataset.modal === 'what') showRight('overview');
      else if (activeLeft?.dataset.modal === 'who') showRight('who-overview');
      else if (activeLeft?.dataset.modal === 'insights') showRight('insights-overview');
      else if (activeLeft?.dataset.modal === 'careers') showRight('careers-overview');
    }
  }, delay);
}

document.querySelectorAll('.modal__content-left-list-item').forEach(li => {
  li.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimer);
    const parent = li.closest('.modal__content-left');
    parent.querySelectorAll('.modal__content-left-list-item').forEach(x => x.classList.remove('is-active'));
    li.classList.add('is-active');
    showRight(li.dataset.view);
  });

  li.addEventListener('mouseleave', () => {
    li.classList.remove('is-active');
    scheduleRestore(180);
  });
});

// keep right pane open while hovered
allRightPanels.forEach(panel => {
  panel.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
  panel.addEventListener('mouseleave', () => scheduleRestore(180));
});

// What we do nav hover
if (whatWeDoLink && modal) {
  whatWeDoLink.addEventListener('mouseenter', () => {
    activateModal('what', 'overview');
    openModal();
  });

  whatWeDoLink.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!modal.matches(':hover') && !whatWeDoLink.matches(':hover') && !whoNav?.matches(':hover') && !insightsNav?.matches(':hover') && !careersNav?.matches(':hover')) closeModal();
    }, 150);
  });
}

// Who we are nav hover
if (whoNav && modal) {
  whoNav.addEventListener('mouseenter', () => {
    activateModal('who', 'who-overview');
    openModal();
  });

  whoNav.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!modal.matches(':hover') && !whoNav.matches(':hover') && !whatWeDoLink?.matches(':hover') && !insightsNav?.matches(':hover') && !careersNav?.matches(':hover')) closeModal();
    }, 150);
  });
}

// Insights nav hover
if (insightsNav && modal) {
  insightsNav.addEventListener('mouseenter', () => {
    activateModal('insights', 'insights-overview');
    openModal();
  });

  insightsNav.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!modal.matches(':hover') && !insightsNav.matches(':hover') && !whatWeDoLink?.matches(':hover') && !whoNav?.matches(':hover') && !careersNav?.matches(':hover')) closeModal();
    }, 150);
  });
}

// Careers nav hover
if (careersNav && modal) {
  careersNav.addEventListener('mouseenter', () => {
    activateModal('careers', 'careers-overview');
    openModal();
  });

  careersNav.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!modal.matches(':hover') && !careersNav.matches(':hover') && !whatWeDoLink?.matches(':hover') && !whoNav?.matches(':hover') && !insightsNav?.matches(':hover')) closeModal();
    }, 150);
  });
}

// modal keep open on hover close on leave
if (modal) {
  modal.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimer);
    openModal();
  });
  modal.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!modal.matches(':hover') && !whatWeDoLink?.matches(':hover') && !whoNav?.matches(':hover') && !insightsNav?.matches(':hover') && !careersNav?.matches(':hover')) {
        closeModal();
        activateModal('what', 'overview');
      }
    }, 150);
  });
}

function openSearch() {
  searchBar.classList.add('is-open');
  searchInput.focus();
}

function closeSearch() {
  searchBar.classList.remove('is-open');
}

searchIcon.addEventListener('click', openSearch);
closeButton.addEventListener('click', closeSearch);

//found out that this debounce function is really useful to optimize search performance and avoid unnecessary function calls while the user is typing. It ensures that the search function is only called after the user has stopped typing for a specified delay, which can improve the overall user experience and reduce server load if the search involves API calls or complex computations.

//ref : https://youtu.be/yBFHwJgqLD4


function debounce(func, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  let activeCategories = [];
  if (selectors) {
    selectors.forEach(btn => {
      if (btn.classList.contains("active") && btn.textContent.trim().toLowerCase() !== "all") {
        activeCategories.push(btn.textContent.trim().toLowerCase());
      }
    });
  }

  filteredCards = cardsArr.filter(card => {
    const cardCategory = (card.category || "").toLowerCase();
    const cardTitle = (card.title || "").toLowerCase();
    const cardDesc = (card.description || "").toLowerCase();

    const matchesCategory = activeCategories.length === 0 || activeCategories.includes(cardCategory);
    const matchesQuery = !query || (
      cardTitle.includes(query) ||
      cardDesc.includes(query) ||
      cardCategory.includes(query)
    );

    return matchesCategory && matchesQuery;
  });

  temp = 0;
  cardsload.innerHTML = "";

  if (filteredCards.length === 0) {
    cardsload.innerHTML = '<p class="no-results">No results found</p>';
    if (observer) observer.disconnect();
  } else {
    if (observer && observerTarget) observer.observe(observerTarget);
    renderNewCards();
  }
}

function updateSuggestions(query) {
  if (!query) {
    searchSuggestions.innerHTML = '';
    searchSuggestions.classList.remove('has-results');
    return;
  }

  const maxSuggestions = 5;
  const topMatches = filteredCards.slice(0, maxSuggestions);

  if (topMatches.length === 0) {
    searchSuggestions.innerHTML = '';
    searchSuggestions.classList.remove('has-results');
    return;
  }

  const html = topMatches.map(card => `
    <div class="nav__search-suggestions-item" data-title="${card.title}">
      <span class="nav__search-suggestions-item-title">${card.title}</span>
    </div>
  `).join('');

  searchSuggestions.innerHTML = html;
  searchSuggestions.classList.add('has-results');

  searchSuggestions.querySelectorAll('.nav__search-suggestions-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const title = item.dataset.title;
      searchInput.value = title;
      updateSuggestions(null);
      applyFilters();
    });
  });
}

const handleSearch = debounce(e => {
  applyFilters();
  updateSuggestions(e.target.value.trim().toLowerCase());
}, 120);

if (searchInput) {
  searchInput.addEventListener("input", handleSearch);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__search-inner')) {
      updateSuggestions(null);
    }
  });
}



// lazy loading implementation (learnt from a yt video)
const initial_cards = 3;

let temp = 0;
let cardsArr = [];
let filteredCards = [];

const cardsload = document.querySelector('#cardsload');
const observerTarget = document.querySelector('#cardsObserver');
const selectors = document.querySelectorAll('.selectors__wrapper--cta');

fetch("./cards.json")
  .then(response => response.json())
  .then(data => {
    const originalCards = data.cards;
    cardsArr = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < originalCards.length; j++) {
        const card = originalCards[j];
        const cardNumber = (i * originalCards.length) + j + 1;

        const newCard = {
          id: "card-" + cardNumber,
          title: card.title,
          description: card.description,
          category: card.category,
          image: card.image
        };

        cardsArr.push(newCard);
      }
    }

    filteredCards = cardsArr;

    selectors[0].classList.add("active");

    renderNewCards();
    observer.observe(observerTarget);
  });

function renderNewCards() {
  const newCards = filteredCards.slice(temp, temp + initial_cards);

  newCards.forEach(card => {
    cardsload.insertAdjacentHTML(
      "beforeend",
      createCardMarkup(card)
    );
  });

  temp += initial_cards;

  if (temp >= filteredCards.length) {
    observer.disconnect();
  }
}

selectors.forEach(selector => {
  selector.addEventListener("click", () => {
    searchInput.value = "";
    updateSuggestions(null);

    const clickedText = selector.textContent.trim().toLowerCase();

    if (clickedText === "all") {
      selectors.forEach(btn => btn.classList.remove("active"));
      selector.classList.add("active");
    } else {
      selectors[0].classList.remove("active");
      selector.classList.toggle("active");

      const anyActive = Array.from(selectors).some(btn =>
        btn.classList.contains("active") && btn.textContent.trim().toLowerCase() !== "all"
      );

      if (!anyActive) {
        selectors[0].classList.add("active");
      }
    }

    applyFilters();
  });
});

const observer = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      renderNewCards();
    }
  },
  {
    root: null,
    rootMargin: "200px",
    threshold: 0
  }
);

function createCardMarkup(card) {
  return `
    <article class="card">
      <div class="card_image">
        <img
          class="card_image-media"
          src="${card.image.src}"
          alt="${card.image.alt}"
          loading="lazy"
        />
      </div>

      <div class="card__content">
        <h3 class="card__title">${card.title}</h3>
        <p class="card__description">${card.description}</p>
        <span class="card__category">${card.category}</span>
      </div>
    </article>
  `;
}
