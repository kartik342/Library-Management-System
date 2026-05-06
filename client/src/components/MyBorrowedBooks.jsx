import React from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { useEffect } from "react";
import { fetchAllBooks } from "../store/slices/bookSlice";
import Header  from "../layout/Header";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import ReadBookPopup from "../popups/ReadBookPopup";


const MyBorrowedBooks = () => {

  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const {userBorrowedBooks} = useSelector((state) => state.borrow);

  const {readBookPopup} = useSelector((state) => state.popup);

  const [readBookData, setReadBookData] = useState({});
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBookData(book);
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    const result = `${formattedDate}  ${formattedTime}`;
    return result;

  };

  const [filter, setFilter] = useState("returned");

  const returnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === true;
  });
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === false;
  });

  const booksToDisplay = filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
  <>
    <main className="flex-1 p-2 pt-16 sm:pt-18 bg-[#f7f7f7] min-h-screen">

      <Header />

      {/* TOP SECTION */}
      <div className="flex flex-col gap-2 mb-4">

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            My Borrowed Books
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track your borrowed and returned books
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">

          <button
            className={`py-1.5 px-3 text-xs sm:text-sm font-medium rounded-xl sm:rounded-r-none transition border ${
              filter === "returned"
                ? "bg-black text-white border-black"
                : "bg-white border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setFilter("returned")}
          >
            Returned Books
          </button>

          <button
            className={`py-1.5 px-3 text-xs sm:text-sm font-medium rounded-xl sm:rounded-l-none transition border ${
              filter === "nonReturned"
                ? "bg-black text-white border-black"
                : "bg-white border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setFilter("nonReturned")}
          >
            Not Returned
          </button>

        </div>

      </div>

      {/* TABLE */}
      {booksToDisplay && booksToDisplay.length > 0 ? (

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="min-w-full text-xs sm:text-sm">

              {/* HEADER */}
              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>

                  <th className="px-3 py-2.5 text-left font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold text-gray-700">
                    Book Title
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold text-gray-700">
                    Borrowed Date
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold text-gray-700">
                    Due Date
                  </th>

                  <th className="px-3 py-2.5 text-left font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-3 py-2.5 text-center font-semibold text-gray-700">
                    View
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {booksToDisplay.map((book, index) => (

                  <tr
                    key={book._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                  >

                    {/* ID */}
                    <td className="px-3 py-2.5 text-gray-500 font-medium">
                      {index + 1}
                    </td>

                    {/* TITLE */}
                    <td className="px-3 py-2.5">

                      <div className="flex items-center gap-2">

                        <span className="bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">

                          <BookA className="w-4 h-4 text-gray-700" />

                        </span>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {book.bookTitle}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* BORROW DATE */}
                    <td className="px-3 py-2.5 text-gray-600">
                      {formatDate(book.borrowedDate)}
                    </td>

                    {/* DUE DATE */}
                    <td className="px-3 py-2.5 text-gray-600">
                      {formatDate(book.dueDate)}
                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-2.5">

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          book.returned
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >

                        {book.returned
                          ? "Returned"
                          : "Pending"}

                      </span>

                    </td>

                    {/* VIEW */}
                    <td className="px-3 py-2.5">

                      <div className="flex justify-center">

                        <button
                          onClick={() => openReadPopup(book.bookId)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                        >

                          <BookA className="w-4 h-4 text-gray-700" />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">

          <h3 className="text-lg font-semibold text-gray-700">

            {filter === "returned"
              ? "No returned books found!"
              : "No non-returned books found!"}

          </h3>

          <p className="text-gray-500 mt-1 text-sm">
            Your borrowed books will appear here.
          </p>

        </div>

      )}

    </main>

    {readBookPopup && (
      <ReadBookPopup book={readBookData} />
    )}
  </>
);
};

export default MyBorrowedBooks;
