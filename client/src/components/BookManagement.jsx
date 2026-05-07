import React, { useEffect } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup } from "../store/slices/popUpSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { resetBorrowSlice } from "../store/slices/borrowSlice";
import  Header  from "../layout/Header";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";


const BookManagement = () => {

  const dispatch = useDispatch();

  const { books, loading, error, message } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector((state) => state.popup);

  const { 
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage
   } = useSelector((state) => state.borrow);

  const [readBookData, setReadBookData] = useState({});
  
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBookData(book);
    dispatch(toggleReadBookPopup());
  };

  const [borrowBookId, setBorrowBookId] = useState("");
    const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  useEffect(() => {
    
    if(message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if(error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, loading, borrowSliceMessage, borrowSliceError, borrowSliceLoading]);


  const [searchedKeyword, setSearchedKeyword] = useState("");

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  }

  const searchedBooks = books.filter((book) => {
    return book.title.toLowerCase().includes(searchedKeyword) || book.author.toLowerCase().includes(searchedKeyword)
  });

  return (
  <>
    <main className="flex-1 p-3 sm:p-4 pt-20 sm:pt-24 bg-[#f5f5f5] min-h-screen">

      <Header />

      {/* SUB HEADER */}
      <header className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">

        <h2 className="text-lg sm:text-xl xl:text-2xl font-semibold">
          {user && user.role === "Admin"
            ? "Book Management"
            : "Books"}
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">

          {/* ADD BOOK BUTTON */}
          {isAuthenticated && user.role === "Admin" && (
            <button
              onClick={() => dispatch(toggleAddBookPopup())}
              className="relative pl-12 w-full sm:w-44 flex justify-center items-center py-2.5 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition duration-300 shadow-sm"
            >

              <span className="bg-white flex justify-center items-center rounded-full text-black w-6 h-6 text-sm font-bold absolute left-4">
                +
              </span>

              <span className="text-sm sm:text-base">
                Add Book
              </span>

            </button>
          )}

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search books..."
            value={searchedKeyword}
            onChange={handleSearch}
            className="w-full sm:w-52 border border-gray-300 bg-white p-2.5 pl-4 rounded-xl outline-none focus:ring-2 focus:ring-black/10 text-sm"
          />

        </div>

      </header>

      {/* TABLE SECTION */}
      {books && books.length > 0 ? (

        <div className="mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="min-w-full border-collapse text-sm sm:text-base">

              {/* TABLE HEAD */}
              <thead>

                <tr className="bg-gray-100 border-b border-gray-200">

                  <th className="px-4 py-3 text-left font-semibold">
                    ID
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Author
                  </th>

                  {isAuthenticated && user.role === "Admin" && (
                    <th className="px-4 py-3 text-left font-semibold">
                      Quantity
                    </th>
                  )}

                  <th className="px-4 py-3 text-left font-semibold">
                    Availability
                  </th>

                  {isAuthenticated && user.role === "Admin" && (
                    <th className="px-4 py-3 text-center font-semibold">
                      Actions
                    </th>
                  )}

                </tr>

              </thead>

              {/* TABLE BODY */}
              <tbody>

                {searchedBooks.map((book, index) => (

                  <tr
                    key={book._id}
                    className={`border-b border-gray-100 transition duration-200 hover:bg-gray-50 ${
                      (index + 1) % 2 === 0
                        ? "bg-gray-50"
                        : "bg-white"
                    }`}
                  >

                    <td className="px-4 py-3">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {book.title}
                    </td>

                    <td className="px-4 py-3">
                      {book.author}
                    </td>

                    {isAuthenticated && user.role === "Admin" && (
                      <td className="px-4 py-3">
                        {book.quantity}
                      </td>
                    )}

                    <td className="px-4 py-3">

                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          book.availability
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.availability
                          ? "Available"
                          : "Not Available"}
                      </span>

                    </td>

                    {isAuthenticated && user.role === "Admin" && (

                      <td className="px-4 py-3">

                        <div className="flex justify-center items-center gap-4">

                          <button
                            onClick={() => openReadPopup(book._id)}
                            className="p-2 rounded-lg hover:bg-gray-200 transition"
                          >
                            <BookA className="w-5 h-5 cursor-pointer" />
                          </button>

                          <button
                            onClick={() => openRecordBookPopup(book._id)}
                            className="p-2 rounded-lg hover:bg-gray-200 transition"
                          >
                            <NotebookPen className="w-5 h-5 cursor-pointer" />
                          </button>

                        </div>

                      </td>

                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow-sm mt-5 p-8 text-center">

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
            No books found in Library!
          </h3>

        </div>

      )}

    </main>

    {addBookPopup && <AddBookPopup />}
    {readBookPopup && <ReadBookPopup book={readBookData} />}
    {recordBookPopup && (
      <RecordBookPopup bookId={borrowBookId} />
    )}
  </>
);
};

export default BookManagement;
