/**
 * Dynamically loads the common sidebar component for the blog.
 * Include this script in your HTML documents to ensure a consistent sidebar.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Determine the correct path prefix based on current location
  const currentPath = window.location.pathname;
  const isArticlePage = currentPath.includes('/articles/');
  const pathPrefix = isArticlePage ? '../' : 'assets/';
  
  // Create correct home link based on current path
  const homeLink = isArticlePage ? '../../index.html' : 'index.html';
  
  // Create the sidebar HTML
  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="search-filter-container">
        <div class="search-row">
          <div class="search-container">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Search articles..."
              aria-label="Search"
            />
          </div>
        </div>
      </div>

      <div 
        id="yearDropdown" 
        class="year-dropdown" 
        style="display: none;"
      ></div>

      <div class="top-bar">
        <h3 class="top-bar-left">By Bill Edwards</h3>
        <button 
          id="sortButton" 
          type="button" 
          class="sort-btn" 
          aria-label="Filter Articles"
        >
          <!-- funnel icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon-24 filter-icon"
          >
            <path 
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 6h3m-7.5
                 0h-.75A2.25 2.25 0
                 003 8.25v.678c0
                 .414.162.81.452
                 1.103l5.098 5.098
                 c.291.291.45.687.45
                 1.1v2.271a1.125
                 1.125 0 001.688
                 .974l2.25-1.35a1.125
                 1.125 0 00.537-.974v-1.621
                 c0-.414.162-.81.452
                 -1.103l5.098-5.098
                 c.29-.294.452-.69.452
                 -1.103V8.25a2.25
                 2.25 0 00-2.25-2.25H6z"
            />
          </svg>
        </button>
      </div>

      <!-- Links section -->
      <div style="margin-top: 2rem;">
        <nav class="extra-links">
          <h3>Navigation</h3>
          <ul>
            <li><a href="${homeLink}">Home</a></li>
            ${isArticlePage ? '<li><a href="../../index.html#articles">All Articles</a></li>' : ''}
          </ul>
          <h3>More</h3>
          <ul>
            <li><a href="https://billedwards42.github.io/Bill_Edwards/">About Bill</a></li>
            <li><a href="https://twitter.com/CashPrinter3000">Twitter</a></li>
          </ul>
          <!-- Description Section -->
          <h3>About This Blog</h3>
          <p>
            This site is to record the thoughts of Bill Edwards. Thoughts on technology, AI, and the future.
          </p>
        </nav>
      </div>
    </aside>

    <!-- Sidebar Toggle Button -->
    <button 
      id="sidebarToggle" 
      class="sidebar-toggle-btn sidebar-open" 
      aria-label="Toggle Sidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor"
        class="icon-24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  `;
  
  // Find the sidebar container
  const sidebarContainer = document.getElementById('sidebar');
  
  if (sidebarContainer) {
    // Replace existing sidebar
    sidebarContainer.outerHTML = sidebarHTML;
  } else {
    // Insert after header
    const header = document.querySelector('.site-header');
    if (header) {
      header.insertAdjacentHTML('afterend', sidebarHTML);
    } else {
      // Fallback: insert at top of body
      document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    }
  }
  
  // Initialize sidebar functionality for article pages
  setTimeout(() => {
    // Re-initialize sidebar toggle functionality
    const sidebarToggleBtn = document.getElementById('sidebarToggle');
    const sortButton = document.getElementById('sortButton');
    const yearDropdown = document.getElementById('yearDropdown');
    
    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', () => {
        const isCollapsed = document.body.classList.contains('sidebar-collapsed');
        document.body.classList.toggle('sidebar-collapsed', !isCollapsed);
        
        // We don't need to toggle button classes anymore since CSS handles this
        // based on the body class
        
        // Save state to localStorage
        localStorage.setItem('sidebarState', !isCollapsed ? 'collapsed' : 'expanded');
      });
    }
    
    // For article pages, update the sort button to go back to home
    if (isArticlePage && sortButton) {
      sortButton.addEventListener('click', () => {
        window.location.href = homeLink;
      });
    } else if (sortButton && yearDropdown) {
      // For home page, make sure filter button works
      sortButton.addEventListener('click', () => {
        // Toggle dropdown visibility
        const isVisible = yearDropdown.style.display !== "none";
        yearDropdown.style.display = isVisible ? "none" : "block";
        
        // Force update and repopulate the dropdown
        if (!isVisible) {
          // Dispatch a custom event to populate the dropdown
          document.dispatchEvent(new CustomEvent('populateYearDropdown'));
        }
      });
    }
  }, 100);
});