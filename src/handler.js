const { nanoid } = require("nanoid");
const books = require("./book");


//----------------------addBook------------------------
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = readPage === pageCount ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const addNewBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    
    books.push(addNewBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    
    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
};

//----------------------getBook------------------------

const getAllBookHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    if (name) {
        const result = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        const listBook = result.map((book) => {
            return {
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }
        })
        return {
            status: "success",
            data: {
                books: listBook
            }
        }
    }  
    if (reading === '1') {
        const result = books.filter((book) => book.reading === true)
        const listBook = result.map((book) => {
        return {
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }  
        })
        return{
            status: "success",
            data: {
                books: listBook
            }
        }
    }
    if (reading === '0') {
        const result = book.filter((book) => book.reading === false)
        const listBook = result.map((book) => {
            return{
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }
        })
        return{
            status: "success",
            data: {
                books: listBook
            }
        }
    }

    if (finished === '0') {
        const result = books.filter((book) => book.finished === false)
        const listBook = result.map((book) => {
            return{
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }
        })

        return{
            status: "success",
            data: {
                books: listBook
            }
        }
    }

    const listBook = books.map((book) => {
        return{
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }
    })

    return {
        status: "success",
        data: {
            books: listBook
        }
    }
};

//----------------------getAllBookById------------------------
const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return{
            status: "success",
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

//----------------------putBookHandler------------------------
const putBookHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    if (!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message:
                "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }
    const index = books.findIndex((book) => book.id === bookId);
    const updatedAt = new Date().toISOString();
    const finished = readPage === pageCount ? true : false;
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };
        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }
    if (index === -1) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
        });
        response.code(404);
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku.",
    });
    response.code(500);
    return response;
};


//----------------------deleteBookById------------------------
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, putBookHandler, deleteBookByIdHandler };