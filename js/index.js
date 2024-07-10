document.addEventListener('DOMContentLoaded', () => {
    const URL_PREFIX = 'http://localhost:3000/books';
    const user = { id: 1, username: 'pouros' };
    const listPanel = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
  
    // Fetch and display book titles
    const fetchBooks = () => {
      fetch(URL_PREFIX)
        .then(response => response.json())
        .then(books => {
          displayBooks(books);
        });
    };
  
    const displayBooks = (books) => {
      listPanel.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = book.title;
        li.addEventListener('click', () => showBookDetails(book));
        listPanel.appendChild(li);
      });
    };
  
    const showBookDetails = (book) => {
      showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.img_url}" alt="${book.title}" />
        <p>${book.description}</p>
        <h3>Liked by:</h3>
        <ul id="user-list">
          ${book.users.map(user => `<li>${user.username}</li>`).join('')}
        </ul>
        <button id="like-button">${book.users.some(u => u.id === user.id) ? 'Unlike' : 'Like'}</button>
      `;
  
      document.getElementById('like-button').addEventListener('click', () => toggleLikeBook(book));
    };
  
    const toggleLikeBook = (book) => {
      const likedByUser = book.users.some(u => u.id === user.id);
  
      const updatedUsers = likedByUser
        ? book.users.filter(u => u.id !== user.id)
        : [...book.users, user];
  
      fetch(`${URL_PREFIX}/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ users: updatedUsers })
      })
        .then(response => response.json())
        .then(updatedBook => {
          showBookDetails(updatedBook);
        });
    };
  
    // Initial fetch of all books
    fetchBooks();
  });
  