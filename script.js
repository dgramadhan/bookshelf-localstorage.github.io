const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS_APPS';

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchBook();
  })

   if (isStorageExist()) {
     loadDataFromStorage();
    }
});


function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  }
}

function searchBook () {
  const searchBookTitle = document.getElementById('searchBookTitle').value;
  for (let i = 0; i <= books.length; i++) {
    const itemTitle = books[i].title;
      if (searchBookTitle.toLowerCase() === itemTitle.toLowerCase()) {
        itemFind = books[i].title;
        console.log(itemFind);
        const find = document.getElementById('searchs');
        const textTitle = document.createElement('p');
         var status;
         if (books[i].isCompleted) {
              status = "Selesai Dibaca";  
            } else {
              status = "Belum Selesai Dibaca";
            };
        var text = "<h3>Found</h3><hr>" 
          + "<br>Judul : " + books[i].title 
          + "<br> Penulis : " + books[i].author 
          + "<br> Tahun : " + books[i].year
          + "<br> Status / Rak : " + status;           
        textTitle.innerHTML = text;
        find.replaceChild(textTitle, find.childNodes[0]);
        return;
      } else if (searchBookTitle != itemTitle){
        const find = document.getElementById('searchs');
        const textTitle = document.createElement('h3');
        var text = "Not Found";
        textTitle.innerText = text;
        find.replaceChild(textTitle, find.childNodes[0]);
      }
  }
  
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
  const uncompletedReadBook = document.getElementById('books');
  uncompletedReadBook.innerHTML = '';

  const completedReadBook = document.getElementById('books-done');
  completedReadBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = showBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedReadBook.append(bookElement);
    }
    else {
      completedReadBook.append(bookElement);
    }
  }
});


function showBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = "Penulis : " + bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = "Tahun : " + bookObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoneButton = document.createElement('button');
    undoneButton.classList.add('selesai-button');
    undoneButton.innerText = "Belum Selesai"

    undoneButton.addEventListener('click', function() {
      removeTaskCompleted(bookObject.id);
    });


    const deleteButton = document.createElement('button');
    deleteButton.classList.add('hapus-button');
    deleteButton.innerText = "Hapus"

    deleteButton.addEventListener('click', function() {
      deleteBookList(bookObject.id);
    });

    container.append(undoneButton, deleteButton);
  } else {
    const doneButton = document.createElement('button');
    doneButton.classList.add('selesai-button');
    doneButton.innerText = "Selesai";

    doneButton.addEventListener('click', function() {
      addTaskCompleted(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('hapus-button');
    deleteButton.innerText = "Hapus"

    deleteButton.addEventListener('click', function() {
      deleteBookList(bookObject.id);
    });


    container.append(doneButton, deleteButton);
  }

   return container;
}


function addTaskCompleted (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent (new Event(RENDER_EVENT));
  saveData();
}

function removeTaskCompleted (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent (new Event(RENDER_EVENT));
  saveData();
}

function deleteBookList (bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent (new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex (bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }

  return -1;
}


function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

