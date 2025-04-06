/**
 * Dynamically loads the common header component for the blog.
 * Include this script in your HTML documents to ensure a consistent header.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get the current path to determine active navigation item
  const currentPath = window.location.pathname;
  const isHomepage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
  
  // Create the header element - removed dark mode toggle button
  const headerHTML = `
    <header class="site-header">
      <h1 class="site-title">
        <a href="${isHomepage ? 'index.html' : '../../index.html'}">Bill Edwards' Blog</a>
      </h1>
      <h2 class="site-subtitle">Thoughts & Perspectives</h2>
    </header>
  `;
  
  // Find the header container
  const headerContainer = document.querySelector('.site-header');
  
  if (headerContainer) {
    // Replace existing header
    headerContainer.outerHTML = headerHTML;
  } else {
    // If no header exists, insert after the canvas but before main content
    const starCanvas = document.getElementById('starCanvas');
    if (starCanvas) {
      starCanvas.insertAdjacentHTML('afterend', headerHTML);
    }
  }
});