document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addButton');
  const updateButton = document.getElementById('updateButton');
  const deleteButton = document.getElementById('deleteButton');
  const searchButton = document.getElementById('searchButton');
  const bookTableBody = document.getElementById('bookTableBody');

  // Function to add a book
  const addBook = async (event) => {
    event.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const publishedYear = document.getElementById('publishedYear').value;
    const author = document.getElementById('author').value;
    const price = document.getElementById('price').value;

    try {
      // Send a POST request to add the book to the database
      await fetch('/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, publishedYear, author, price }),
      });

      // Clear form inputs
      document.getElementById('title').value = '';
      document.getElementById('publishedYear').value = '';
      document.getElementById('author').value = '';
      document.getElementById('price').value = '';

      // Refresh book table
      refreshBookTable();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  // Function to update a book
  const updateBook = async () => {
    const selectedRow = document.querySelector('.selected-row');

    if (selectedRow) {
      const bookId = selectedRow.dataset.id;
      const title = document.getElementById('title').value;
      const publishedYear = document.getElementById('publishedYear').value;
      const author = document.getElementById('author').value;
      const price = document.getElementById('price').value;

      try {
        // Send a PUT request to update the book in the database
        await fetch(`/books/${bookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, publishedYear, author, price }),
        });

        // Clear form inputs
        document.getElementById('title').value = '';
        document.getElementById('publishedYear').value = '';
        document.getElementById('author').value = '';
        document.getElementById('price').value = '';

        // Deselect the row
        selectedRow.classList.remove('selected-row');

        // Refresh book table
        refreshBookTable();
      } catch (error) {
        console.error('Error updating book:', error);
      }
    } else {
      alert('Please select a book to update.');
    }
  };

  // Function to delete a book
  const deleteBook = async () => {
    const selectedRow = document.querySelector('.selected-row');

    if (selectedRow) {
      const bookId = selectedRow.dataset.id;

      try {
        // Send a DELETE request to delete the book from the database
        await fetch(`/books/${bookId}`, {
          method: 'DELETE',
        });

        // Clear form inputs
        document.getElementById('title').value = '';
        document.getElementById('publishedYear').value = '';
        document.getElementById('author').value = '';
        document.getElementById('price').value = '';

        // Deselect the row
        selectedRow.classList.remove('selected-row');

        // Refresh book table
        refreshBookTable();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    } else {
      alert('Please select a book to delete.');
    }
  };

// Function to search books
const searchBooks = async () => {
  const searchTerm = prompt('Enter the title to search:');

  if (searchTerm) {
    try {
      // Send a GET request to search for books by title
      const response = await fetch(`/books?title=${searchTerm}`);
      const data = await response.json();

      // Clear form inputs
      document.getElementById('title').value = '';
      document.getElementById('publishedYear').value = '';
      document.getElementById('author').value = '';
      document.getElementById('price').value = '';

      // Clear book table
      bookTableBody.innerHTML = '';

      // Check if search results are empty
      if (data.length === 0) {
        alert('No books found.');
      } else {
        // Display search results in the book table
        data.forEach((book) => {
          const row = document.createElement('tr');
          row.dataset.id = book.BookId;

          const idCell = document.createElement('td');
          idCell.textContent = book.BookId;
          row.appendChild(idCell);

          const titleCell = document.createElement('td');
          titleCell.textContent = book.Title;
          row.appendChild(titleCell);

          const yearCell = document.createElement('td');
          yearCell.textContent = book.PublishedYear;
          row.appendChild(yearCell);

          const authorCell = document.createElement('td');
          authorCell.textContent = book.Author;
          row.appendChild(authorCell);

          const priceCell = document.createElement('td');
          priceCell.textContent = book.Price;
          row.appendChild(priceCell);

          // Add click event listener to select a book
          row.addEventListener('click', () => {
            // Deselect previously selected row (if any)
            const selectedRow = document.querySelector('.selected-row');
            if (selectedRow) {
              selectedRow.classList.remove('selected-row');
            }

            // Select the clicked row
            row.classList.add('selected-row');

            // Fill form inputs with selected book data
            document.getElementById('title').value = book.Title;
            document.getElementById('publishedYear').value = book.PublishedYear;
            document.getElementById('author').value = book.Author;
            document.getElementById('price').value = book.Price;
          });

          bookTableBody.appendChild(row);
        });
      }
    } catch (error) {
      console.error('Error searching books:', error);
    }
  }
};


  // Function to refresh the book table
  const refreshBookTable = async () => {
    try {
      // Send a GET request to retrieve all books
      const response = await fetch('/books');
      const data = await response.json();

      // Clear form inputs
      document.getElementById('title').value = '';
      document.getElementById('publishedYear').value = '';
      document.getElementById('author').value = '';
      document.getElementById('price').value = '';

      // Clear book table
      bookTableBody.innerHTML = '';

      // Display all books in the book table
      data.forEach((book) => {
        const row = document.createElement('tr');
        row.dataset.id = book.BookId;

        const idCell = document.createElement('td');
        idCell.textContent = book.BookId;
        row.appendChild(idCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = book.Title;
        row.appendChild(titleCell);

        const yearCell = document.createElement('td');
        yearCell.textContent = book.PublishedYear;
        row.appendChild(yearCell);

        const authorCell = document.createElement('td');
        authorCell.textContent = book.Author;
        row.appendChild(authorCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = book.Price;
        row.appendChild(priceCell);

        // Add click event listener to select a book
        row.addEventListener('click', () => {
          // Deselect previously selected row (if any)
          const selectedRow = document.querySelector('.selected-row');
          if (selectedRow) {
            selectedRow.classList.remove('selected-row');
          }

          // Select the clicked row
          row.classList.add('selected-row');

          // Fill form inputs with selected book data
          document.getElementById('title').value = book.Title;
          document.getElementById('publishedYear').value = book.PublishedYear;
          document.getElementById('author').value = book.Author;
          document.getElementById('price').value = book.Price;
        });

        bookTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error retrieving books:', error);
    }
  };

  // Add event listeners to buttons
  addButton.addEventListener('click', addBook);
  updateButton.addEventListener('click', updateBook);
  deleteButton.addEventListener('click', deleteBook);
  searchButton.addEventListener('click', searchBooks);

  // Refresh book table on page load
  refreshBookTable();
});