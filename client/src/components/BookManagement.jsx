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

  return <>
    
    <main className="flex-1 p-6 pt-28">

      <Header></Header>

      {/* Sub Header */}
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center ">
        
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
          {user && user.role === 'Admin' ? "Book Management" : "Books"}
        </h2>

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {
            isAuthenticated && user.role === 'Admin' && (
              <button 
                onClick={()=> dispatch(toggleAddBookPopup())} 
                className="relative pl-14 w-full sm:w-52 gap-4 flex justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 "
              >
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">+</span>
                Add Book
              </button>
            )
          }

          <input 
            type="text" 
            placeholder="Search books..." 
            value={searchedKeyword}
            onChange={handleSearch}
            className="sm:w-52 border p-2 pl-4 border-gray-300 rounded-md"
          />
        </div>
      </header>

      {/* Table */}

      {
        books && books.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">

            <table className="min-w-full border-collapse">

              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  {
                    isAuthenticated && user.role === 'Admin' && (
                      <th className="px-4 py-2 text-left">Quantity</th>
                    )
                  }
                  <th className="px-4 py-2 text-left">Availability</th>
                  {
                    isAuthenticated && user.role === 'Admin' && (
                      <th className="px-4 py-2 text-center">Record Book</th>
                    )
                  }
                </tr>
              </thead>

              <tbody>
                {
                  searchedBooks.map((book, index)=>(
                    <tr 
                      key={book._id} 
                      className={(index+1) %2 === 0 ? "bg-gray-200" : "bg-white"} 
                      // onClick={() => openReadPopup(book._id)}
                    >
                      <td className="px-4 py-2">{index+1}</td>
                      <td className="px-4 py-2">{book.title}</td>
                      <td className="px-4 py-2">{book.author}</td>
                      {
                        isAuthenticated && user.role === 'Admin' && (
                          <td className="px-4 py-2">{book.quantity}</td>
                        )
                      }
                      <td className="px-4 py-2">{book.availability ? "Available" : "Not Available"}</td>
                      {
                        isAuthenticated && user.role === 'Admin' && (
                          <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                            <BookA 
                              className="cursor-pointer" 
                              onClick={() => openReadPopup(book._id)}>
                            </BookA>

                            <NotebookPen 
                              className="cursor-pointer" 
                              onClick={() => openRecordBookPopup(book._id)}>
                            </NotebookPen> 
                          </td>
                        )
                      }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        ) : 
        (
          <h3 className="text-3xl mt-5 font-medium">No books found in Library!</h3>
        )
      }
  
    </main>

    {addBookPopup && <AddBookPopup/>}
    {readBookPopup && <ReadBookPopup book={readBookData}/>}
    {recordBookPopup && <RecordBookPopup bookId={borrowBookId}/>}
  </>;
};

export default BookManagement;
