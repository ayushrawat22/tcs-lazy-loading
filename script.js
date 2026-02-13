const searchIcon = document.querySelector('.nav__wrapper--rightcontent-search');
const searchBar = document.querySelector('.nav__search');
const closeButton = document.querySelector('.nav__search-close');
const searchInput = document.querySelector('.nav__search-input');

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
  if (!link || !sub) return;

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
      // collapse all sub-items inside
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
  if (!subLink || !subContent) return;

  subLink.addEventListener('click', (e) => {
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

function openModal() {
  modal.classList.add('is-open');
}

function closeModal() {
  modal.classList.remove('is-open');
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

// "What we do" nav hover
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

// "Who we are" nav hover
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

// "Insights" nav hover
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

// "Careers" nav hover
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

function searchCards(query) {
  if (!cardsArr || !cardsArr.length) return;

  const text = String(query || "").trim().toLowerCase();

  if (!text) {
    filteredCards = cardsArr;

    selectors.forEach(btn => btn.classList.remove("active"));
    selectors[0].classList.add("active");
  } else {
    filteredCards = cardsArr.filter(card => {
      const title = (card.title || "").toLowerCase();
      const description = (card.description || "").toLowerCase();
      const category = (card.category || "").toLowerCase();

      return (
        title.includes(text) ||
        description.includes(text) ||
        category.includes(text)
      );
    });

    selectors.forEach(btn => btn.classList.remove("active"));
  }

  temp = 0;
  cardsload.innerHTML = "";

  if (filteredCards.length === 0) {
    cardsload.innerHTML = '<p class="no-results">No results found</p>';
    observer.disconnect();
    return;
  }

  observer.observe(observerTarget);
  renderNewCards();
}

const handleSearch = debounce(e => {
  searchCards(e.target.value);
}, 120);

if (searchInput) {
  searchInput.addEventListener("input", handleSearch);
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
          image: card.image,
          link: card.link
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

    const clickedText = selector.textContent.trim().toLowerCase();

    if (clickedText === "all") {
      selectors.forEach(btn => btn.classList.remove("active"));
      selector.classList.add("active");
      filteredCards = cardsArr;
    } else {
      selectors[0].classList.remove("active");
      selector.classList.toggle("active");

      const activeCategories = Array.from(selectors)
        .filter(btn =>
          btn.classList.contains("active") &&
          btn.textContent.trim().toLowerCase() !== "all"
        )
        .map(btn => btn.textContent.trim().toLowerCase());

      if (activeCategories.length === 4) {
        selectors.forEach(btn => btn.classList.remove("active"));
        selectors[0].classList.add("active");
        filteredCards = cardsArr;
      } else if (activeCategories.length === 0) {
        selectors[0].classList.add("active");
        filteredCards = cardsArr;
      } else {
        filteredCards = cardsArr.filter(card =>
          activeCategories.includes(card.category.toLowerCase())
        );
      }
    }

    temp = 0;
    cardsload.innerHTML = "";
    observer.observe(observerTarget);
    renderNewCards();
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
