// Login and Book Search Integration
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login.html') {
        window.location.href = '/login.html';
    }

    // Initialize elements
    const loginForm = document.getElementById('login-form');
    const searchForm = document.getElementById('search-form');
    const booksList = document.getElementById('booksList');
    let libraryBooks = [];

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorMessage = document.getElementById('error-message');

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/dashboard.html';
                } else {
                    showError(errorMessage, data.error || 'Login failed');
                }
            } catch (error) {
                showError(errorMessage, 'Connection error');
            }
        });
    }

    // Book Search Handler
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });

        // Load books after login
        loadBooks().then(books => {
            libraryBooks = books;
            displayBooks(libraryBooks);
        });
    }

    // Core Functions
    async function loadBooks() {
        try {
            const response = await fetch('/books', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Error loading books:', error);
            return [];
        }
    }

    function performSearch() {
        const query = document.getElementById('searchQuery').value.toLowerCase().trim();
        const results = libraryBooks.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        displayBooks(results.length > 0 ? results : libraryBooks);
    }

    function displayBooks(books) {
        booksList.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="category-emoji">
                    ${getCategoryEmoji(book.category)}
                </div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p>✍️ ${book.author}</p>
                    <div class="book-meta">
                        <span class="book-status">📚 ${book.category}</span>
                        <span class="book-status">🆔 ${book.isbn}</span>
                        <span class="book-status">📦 ${book.copies} available</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Helper Functions
    function getCategoryEmoji(category) {
        const emojiMap = {
            'Finance': '📈',
            'Story book': '📖',
            'Interview': '📝',
            'default': '📘'
        };
        return emojiMap[category] || emojiMap.default;
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => element.style.display = 'none', 3000);
    }
});