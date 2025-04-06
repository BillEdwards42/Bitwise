/**
 * Dynamically loads the common footer component for the blog.
 * Include this script in your HTML documents to ensure a consistent footer.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Create the footer HTML
  const footerHTML = `
    <footer class="site-footer">
      <p>© Bill Edwards' Blog, ${currentYear}. All rights reserved.</p>
    </footer>
  `;
  
  // Find the footer container
  const footerContainer = document.querySelector('.site-footer');
  
  if (footerContainer) {
    // Replace existing footer
    footerContainer.outerHTML = footerHTML;
  } else {
    // If no footer exists, append to body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }
});