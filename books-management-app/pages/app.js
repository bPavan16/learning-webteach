const baseURL = 'http://localhost:3000';

// Fetch and display all books
function fetchBooks() {
    fetch(`${baseURL}/books`)
        .then((response) => response.json())
        .then((books) => {
            const tbody = document.querySelector('#book-list tbody');
            tbody.innerHTML = '';
            books.forEach((book) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.published_date}</td>
                    <td>${book.quantity}</td>
                    <td>
                        <button onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch((error) => console.error('Error fetching books:', error));
}

// Add a new book
document.querySelector('#add-book-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const publishedDate = document.querySelector('#published-date').value;
    const quantity = document.querySelector('#quantity').value;

    fetch(`${baseURL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, authorName: author, publishedDate, quantity }),
    })
        .then((response) => response.json())
        .then(() => {
            fetchBooks();
            document.querySelector('#add-book-form').reset();
        })
        .catch((error) => console.error('Error adding book:', error));
});

// Update book quantity
document.querySelector('#update-book-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const bookId = document.querySelector('#update-book-id').value;
    const quantity = document.querySelector('#update-quantity').value;

    fetch(`${baseURL}/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
    })
        .then((response) => response.json())
        .then(() => {
            fetchBooks();
            document.querySelector('#update-book-form').reset();
        })
        .catch((error) => console.error('Error updating book:', error));
});

// Delete a book
function deleteBook(bookId) {
    fetch(`${baseURL}/books/${bookId}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then(() => fetchBooks())
        .catch((error) => console.error('Error deleting book:', error));
}

// Initial fetch
fetchBooks();
