/****************************************************
 * DEBUG UTILITY
 ****************************************************/
function debugLog(...args) {
  console.log("[DEBUG]", ...args);
}

/****************************************************
 * SIDEBAR UTILS
 ****************************************************/
function isSidebarCollapsed() {
  return localStorage.getItem('sidebarState') === 'collapsed';
}
function setSidebarCollapsed(collapsed) {
  localStorage.setItem('sidebarState', collapsed ? 'collapsed' : 'expanded');
}

/****************************************************
 * DARK MODE UTILS
 ****************************************************/
function isDarkMode() {
  return document.documentElement.classList.contains('dark-mode');
}
function setDarkMode(dark) {
  if (dark) {
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem('bitwiseTheme','dark');
  } else {
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('bitwiseTheme','light');
  }
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
 * DOMContentLoaded => attach listeners
 ****************************************************/
document.addEventListener('DOMContentLoaded', () => {
  debugLog("DOM fully loaded. Attempting to attach event listeners...");

  const modeToggle       = document.getElementById('modeToggle');
  const modeIcon         = document.getElementById('modeIcon');
  const sidebarToggleBtn = document.getElementById('sidebarToggle');
  const sortButton       = document.getElementById('sortButton');
  const searchInput      = document.getElementById('searchInput');
  const yearDropdown     = document.getElementById('yearDropdown');
  const starCanvas       = document.getElementById('starCanvas');

  debugLog("modeToggle =", modeToggle);
  debugLog("modeIcon   =", modeIcon);
  debugLog("sidebarToggleBtn =", sidebarToggleBtn);

  /****************************************************
   * DARK MODE INIT
   ****************************************************/
  if (modeIcon) {
    modeIcon.innerHTML = isDarkMode() ? getMoonIconPath() : getSunIconPath();
  }
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      setDarkMode(!isDarkMode());
      if (modeIcon) {
        modeIcon.innerHTML = isDarkMode()
          ? getMoonIconPath()
          : getSunIconPath();
      }
    });
  }

  /****************************************************
   * SIDEBAR COLLAPSE - DEFAULT ON PHONES IF UNSAVED
   ****************************************************/
  let savedSidebar = localStorage.getItem('sidebarState');
  // If no state is saved, decide default based on screen width
  if (!savedSidebar) {
    if (window.innerWidth < 768) {
      // On smaller screens => default collapsed
      document.body.classList.add('sidebar-collapsed');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.classList.remove('sidebar-open');
        sidebarToggleBtn.classList.add('sidebar-closed');
      }
      setSidebarCollapsed(true);
    } else {
      // Otherwise => default expanded
      document.body.classList.remove('sidebar-collapsed');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.classList.add('sidebar-open');
        sidebarToggleBtn.classList.remove('sidebar-closed');
      }
      setSidebarCollapsed(false);
    }
  }

  // Now, sync button classes (in case localStorage indicated collapsed/expanded)
  if (sidebarToggleBtn) {
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    if (isCollapsed) {
      sidebarToggleBtn.classList.add('sidebar-closed');
      sidebarToggleBtn.classList.remove('sidebar-open');
    } else {
      sidebarToggleBtn.classList.add('sidebar-open');
      sidebarToggleBtn.classList.remove('sidebar-closed');
    }

    // Attach click toggle
    sidebarToggleBtn.addEventListener('click', () => {
      const nowCollapsed = document.body.classList.contains('sidebar-collapsed');
      if (nowCollapsed) {
        // Expand
        document.body.classList.remove('sidebar-collapsed');
        sidebarToggleBtn.classList.remove('sidebar-closed');
        sidebarToggleBtn.classList.add('sidebar-open');
        setSidebarCollapsed(false);
      } else {
        // Collapse
        document.body.classList.add('sidebar-collapsed');
        sidebarToggleBtn.classList.remove('sidebar-open');
        sidebarToggleBtn.classList.add('sidebar-closed');
        setSidebarCollapsed(true);
      }
    });
  }

  /****************************************************
   * YEAR FILTER
   ****************************************************/
  let selectedYear = null;

  // This function hides/shows articles based on search + year
  function filterArticles() {
    const articles = document.querySelectorAll('.article-item');
    if (!articles) return;

    const query = (searchInput?.value || "").trim().toLowerCase();

    articles.forEach(article => {
      const dataYear  = parseInt(article.getAttribute('data-year'), 10);
      const titleEl   = article.querySelector('h2');
      let matchSearch = true;
      let matchYear   = true;

      // match search
      if (query) {
        const titleText = titleEl?.textContent.toLowerCase() || "";
        matchSearch = titleText.includes(query);
      }
      // match year
      if (selectedYear !== null) {
        matchYear = (dataYear === selectedYear);
      }
      article.style.display = (matchSearch && matchYear) ? "" : "none";
    });
  }

  // Populate the dropdown with available years
  function populateYearDropdown() {
    if (!yearDropdown) return;
    yearDropdown.innerHTML = "";

    const articles = document.querySelectorAll('.article-item');
    const years = new Set();
    articles.forEach(article => {
      const y = parseInt(article.getAttribute('data-year'), 10);
      if (!isNaN(y)) years.add(y);
    });
    const uniqueYears = Array.from(years).sort((a, b) => b - a);

    // "All Years"
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

  // Funnel-based toggle for the year filter
  const sortBtn = sortButton;
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      const articlesOnThisPage = document.querySelectorAll('.article-item');
      if (!articlesOnThisPage || articlesOnThisPage.length === 0) {
        alert("Filtering only works on the homepage. Please return to the homepage to search or filter.");
        return;
      }
      if (!yearDropdown) return;

      // Toggle yearDropdown's visibility
      if (yearDropdown.style.display === "none") {
        populateYearDropdown();
        yearDropdown.style.display = "block";
      } else {
        yearDropdown.style.display = "none";
      }
    });
  }

  // Default: keep the filter collapsed
  // => Do NOT call populateYearDropdown() here automatically
  // => Do NOT set yearDropdown.style.display = "block"
  // We'll let the funnel button handle the toggling

  // But do handle searching right away
  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  // Also filter any articles based on default states
  filterArticles();

  /****************************************************
   * STAR ANIMATION
   ****************************************************/
  let spawnTimeoutId   = null;
  let animationFrameId = null;
  let ctx              = null;
  let activeStar       = null;

  function initStarCanvas() {
    if (!starCanvas) return;
    ctx = starCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    scheduleNextStar();
    animateStar();
  }

  function resizeCanvas() {
    starCanvas.width  = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function scheduleNextStar() {
    // 5-8 minutes range
    const minDelay = 5 * 60 * 1000;
    const maxDelay = 8 * 60 * 1000;
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    spawnTimeoutId = setTimeout(() => {
      if (isDarkMode()) spawnStar();
      scheduleNextStar();
    }, delay);
  }

  function spawnStar() {
    if (activeStar) return;
    const x = Math.random() * starCanvas.width;
    const y = Math.random() * starCanvas.height;
    const angle = Math.random() * 2 * Math.PI;
    const speed = 0.5 + Math.random() * 0.5;
    activeStar = { x, y, radius:2, angle, speed };
  }

  function animateStar() {
    animationFrameId = requestAnimationFrame(animateStar);
    if (!ctx) return;
    ctx.clearRect(0,0, starCanvas.width, starCanvas.height);

    if (!isDarkMode() || !activeStar) {
      activeStar = null;
      return;
    }
    activeStar.x += Math.cos(activeStar.angle)*activeStar.speed;
    activeStar.y += Math.sin(activeStar.angle)*activeStar.speed;

    ctx.beginPath();
    ctx.arc(activeStar.x, activeStar.y, activeStar.radius, 0, 2*Math.PI);
    ctx.fillStyle="#fff";
    ctx.fill();

    // Remove star if it flies off-canvas
    if (
      activeStar.x < -10 || 
      activeStar.x > starCanvas.width+10 ||
      activeStar.y < -10 ||
      activeStar.y > starCanvas.height+10
    ) {
      activeStar = null;
    }
  }

  initStarCanvas();

  debugLog("All event listeners attached successfully.");
});
