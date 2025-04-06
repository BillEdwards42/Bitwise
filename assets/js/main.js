/****************************************************
 * UTILITY FUNCTIONS
 ****************************************************/
// Debug logger
function debugLog(...args) {
  console.log("[DEBUG]", ...args);
}

// Local storage utilities
const STORAGE_KEYS = {
  THEME: 'blogTheme',
  SIDEBAR: 'sidebarState'
};

const THEME = {
  DARK: 'dark',
  LIGHT: 'light'
};

const SIDEBAR = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded'
};

/****************************************************
 * SIDEBAR UTILITIES
 ****************************************************/
function isSidebarCollapsed() {
  return localStorage.getItem(STORAGE_KEYS.SIDEBAR) === SIDEBAR.COLLAPSED;
}

function setSidebarCollapsed(collapsed) {
  localStorage.setItem(STORAGE_KEYS.SIDEBAR, collapsed ? SIDEBAR.COLLAPSED : SIDEBAR.EXPANDED);
}

/****************************************************
 * DARK MODE UTILITIES
 ****************************************************/
function isDarkMode() {
  return true; // Always return true as we're always in dark mode
}

function getMoonIconPath() {
  return `
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
      d="M21.752 15.002A9.718 9.718 0 0112.478 3.274
        c-.347-.034-.69.16-.88.478a.933.933 0 00.108 1.05
        c1.05 1.233 1.618 2.779 1.618 4.398 0 3.866-3.14 7-7.006 7
        -.737 0-1.46-.107-2.146-.31a.905.905
        0 00-.98.257.94.94 0 00.02 1.2
        9.715 9.715 0 008.083 3.238
        9.75 9.75 0 007.451-4.148
        c.26-.367.176-.88-.176-1.2z"
    />
  `;
}

function getSunIconPath() {
  return `
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
      d="M12 3v1.5m6.364.636l-1.06 1.06
         M21 12h-1.5m-.636 6.364l-1.06-1.06
         M12 21v-1.5m-4.95-2.914l-1.06 1.06
         M3 12h1.5m.636-6.364l1.06 1.06
         M12 8.25a3.75 3.75 0 100 7.5
         3.75 3.75 0 000-7.5z"
    />
  `;
}

/****************************************************
 * ARTICLE FILTERING
 ****************************************************/
function setupArticleFiltering(searchInput, yearDropdown) {
  let selectedYear = null;

  // Filter articles based on search text and selected year
  function filterArticles() {
    const articles = document.querySelectorAll('.article-item');
    if (!articles.length) return;

    const query = (searchInput?.value || "").trim().toLowerCase();

    articles.forEach(article => {
      const dataYear = parseInt(article.getAttribute('data-year'), 10);
      const titleEl = article.querySelector('h2');
      
      // Match search query
      let matchSearch = true;
      if (query) {
        const titleText = titleEl?.textContent.toLowerCase() || "";
        matchSearch = titleText.includes(query);
      }
      
      // Match year filter
      let matchYear = true;
      if (selectedYear !== null) {
        matchYear = (dataYear === selectedYear);
      }
      
      // Show/hide based on combined criteria
      article.style.display = (matchSearch && matchYear) ? "" : "none";
    });
  }

  // Populate the year dropdown with available years
  function populateYearDropdown() {
    if (!yearDropdown) return;
    yearDropdown.innerHTML = "";

    const articles = document.querySelectorAll('.article-item');
    const years = new Set();
    
    articles.forEach(article => {
      const year = parseInt(article.getAttribute('data-year'), 10);
      if (!isNaN(year)) years.add(year);
    });
    
    const uniqueYears = Array.from(years).sort((a, b) => b - a); // Newest first
    
    // Add "All Years" option
    const allLabel = document.createElement('label');
    allLabel.textContent = "All Years";
    const allRadio = document.createElement('input');
    allRadio.type = "radio";
    allRadio.name = "yearFilter";
    allRadio.value = "all";
    allRadio.checked = (selectedYear === null);
    allRadio.addEventListener('change', () => {
      selectedYear = null;
      filterArticles();
    });
    allLabel.prepend(allRadio);
    yearDropdown.appendChild(allLabel);

    // Add each year as a radio option
    uniqueYears.forEach(year => {
      const label = document.createElement('label');
      label.textContent = year;

      const radio = document.createElement('input');
      radio.type = "radio";
      radio.name = "yearFilter";
      radio.value = year;
      radio.checked = (selectedYear === year);

      radio.addEventListener('change', () => {
        selectedYear = parseInt(radio.value, 10);
        filterArticles();
      });

      label.prepend(radio);
      yearDropdown.appendChild(document.createElement('br'));
      yearDropdown.appendChild(label);
    });
  }

  // Set up search input
  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  // Run initial filtering
  filterArticles();

  return {
    filterArticles,
    populateYearDropdown
  };
}

/****************************************************
 * STAR ANIMATION - DISABLED
 ****************************************************/
function setupStarAnimation(starCanvas) {
  // Star animation disabled
  return;
}

/****************************************************
 * INITIALIZE WHEN DOM IS LOADED
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
  debugLog("DOM loaded. Initializing blog components...");

  // Get DOM elements
  const elements = {
    modeToggle: document.getElementById('modeToggle'),
    modeIcon: document.getElementById('modeIcon'),
    sidebarToggleBtn: document.getElementById('sidebarToggle'),
    sortButton: document.getElementById('sortButton'),
    searchInput: document.getElementById('searchInput'),
    yearDropdown: document.getElementById('yearDropdown'),
    starCanvas: document.getElementById('starCanvas')
  };

  // Dark mode is always on, no toggle needed

  // Handle sidebar state - default to collapsed on small screens
  let savedSidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR);
  
  // If no state is saved, decide default based on screen width
  if (!savedSidebar) {
    const isSmallScreen = window.innerWidth < 768;
    setSidebarCollapsed(isSmallScreen);
    
    if (isSmallScreen) {
      document.body.classList.add('sidebar-collapsed');
      if (elements.sidebarToggleBtn) {
        elements.sidebarToggleBtn.classList.remove('sidebar-open');
        elements.sidebarToggleBtn.classList.add('sidebar-closed');
      }
    } else {
      document.body.classList.remove('sidebar-collapsed');
      if (elements.sidebarToggleBtn) {
        elements.sidebarToggleBtn.classList.add('sidebar-open');
        elements.sidebarToggleBtn.classList.remove('sidebar-closed');
      }
    }
  }

  // Set toggle functionality (we don't need to set classes anymore as CSS handles this)
  if (elements.sidebarToggleBtn) {
    // Add toggle functionality
    elements.sidebarToggleBtn.addEventListener('click', () => {
      const nowCollapsed = document.body.classList.contains('sidebar-collapsed');
      
      // Toggle state
      document.body.classList.toggle('sidebar-collapsed', !nowCollapsed);
      
      // Save state to localStorage
      setSidebarCollapsed(!nowCollapsed);
    });
  }

  // Set up article filtering
  const filtering = setupArticleFiltering(elements.searchInput, elements.yearDropdown);

  // Set up year filter toggle button
  if (elements.sortButton && elements.yearDropdown) {
    // Initialize the year dropdown if we're on the homepage
    const articlesOnThisPage = document.querySelectorAll('.article-item');
    if (articlesOnThisPage && articlesOnThisPage.length > 0) {
      // We're on the homepage, initialize the dropdown with data
      filtering.populateYearDropdown();
    }
    
    elements.sortButton.addEventListener('click', () => {
      const articlesOnThisPage = document.querySelectorAll('.article-item');
      
      if (!articlesOnThisPage || articlesOnThisPage.length === 0) {
        alert("Filtering only works on the homepage. Please return to the homepage to search or filter.");
        return;
      }
      
      // Toggle dropdown visibility
      const isVisible = elements.yearDropdown.style.display !== "none";
      elements.yearDropdown.style.display = isVisible ? "none" : "block";
    });
  }

  // Initialize star animation for aesthetic effect
  setupStarAnimation(elements.starCanvas);

  debugLog("Blog initialization complete.");
});