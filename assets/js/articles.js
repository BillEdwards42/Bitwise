/**
 * Utility functions for handling articles in the blog
 */

// Load article data from JSON file
async function loadArticlesData() {
  try {
    // Get the base URL path for the current site
    let basePath = document.location.pathname.split('/').slice(0, -1).join('/');
    if (!basePath.endsWith('/')) {
      basePath += '/';
    }
    
    // Build the complete path to the JSON file
    const jsonPath = `${basePath}assets/data/articles.json`;
    
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error('Failed to load articles data');
    }
    
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error loading articles:', error);
    // Fallback to hardcoded article data for testing
    return [
      {
        "id": "the-inevitable",
        "title": "The inevitable",
        "date": "February 12, 2025",
        "author": "Bill Edwards",
        "year": 2025,
        "excerpt": "Exploring the inevitable rise of AI and its impact on jobs and society.",
        "imagePath": "assets/images/A_new_generation.jpg",
        "articlePath": "assets/articles/The_inevitable.html",
        "tags": ["technology", "ai", "future"]
      }
    ];
  }
}

// Generate HTML for article list on homepage
function renderArticleList(articles, container) {
  if (!container) return;
  
  // Clear the container
  container.innerHTML = '';
  
  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Create article elements
  sortedArticles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.className = 'article-item';
    articleElement.setAttribute('data-year', article.year);
    
    // Format date nicely
    const dateObj = new Date(article.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
    
    articleElement.innerHTML = `
      <a href="${article.articlePath}" class="article-link">
        <img src="${article.imagePath}" alt="${article.title}" />
        <div class="article-item-content">
          <h2>${article.title}</h2>
          <div class="article-meta">
            <span class="date">${formattedDate}</span>
            <span class="author">by ${article.author}</span>
          </div>
          <p class="article-excerpt">${article.excerpt || ''}</p>
          <div class="read-more">Read article</div>
        </div>
      </a>
    `;
    
    container.appendChild(articleElement);
  });
}

// Initialize article display on homepage
async function initializeArticles() {
  const articlesContainer = document.querySelector('.articles-section');
  if (!articlesContainer) return;
  
  const articles = await loadArticlesData();
  renderArticleList(articles, articlesContainer);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeArticles();
  
  // Setup search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();
      
      document.querySelectorAll('.article-item').forEach(item => {
        const title = item.querySelector('h2').textContent.toLowerCase();
        const isVisible = title.includes(query);
        item.style.display = isVisible ? '' : 'none';
      });
    });
  }
});

// Listen for the custom event to populate year dropdown
document.addEventListener('populateYearDropdown', async function() {
  const yearDropdown = document.getElementById('yearDropdown');
  const articlesContainer = document.querySelector('.articles-section');
  
  if (yearDropdown && articlesContainer) {
    // Clear the dropdown first
    yearDropdown.innerHTML = '';
    
    // Get years from articles
    const articles = await loadArticlesData();
    const years = new Set();
    
    articles.forEach(article => {
      if (article.year) {
        years.add(article.year);
      }
    });
    
    // Sort years in descending order
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    
    // Add "All Years" option
    const allLabel = document.createElement('label');
    allLabel.textContent = 'All Years';
    const allRadio = document.createElement('input');
    allRadio.type = 'radio';
    allRadio.name = 'yearFilter';
    allRadio.value = 'all';
    allRadio.checked = true;
    allRadio.addEventListener('change', () => {
      // Show all articles
      document.querySelectorAll('.article-item').forEach(item => {
        item.style.display = '';
      });
    });
    allLabel.prepend(allRadio);
    yearDropdown.appendChild(allLabel);
    
    // Add year options
    sortedYears.forEach(year => {
      const label = document.createElement('label');
      label.textContent = year;
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'yearFilter';
      radio.value = year;
      
      radio.addEventListener('change', () => {
        // Filter articles by year
        document.querySelectorAll('.article-item').forEach(item => {
          const itemYear = parseInt(item.getAttribute('data-year'), 10);
          item.style.display = itemYear === year ? '' : 'none';
        });
      });
      
      label.prepend(radio);
      yearDropdown.appendChild(document.createElement('br'));
      yearDropdown.appendChild(label);
    });
  }
});