import React, { useEffect } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { fetchAllBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import ReturnBookPopup from "../popups/ReturnBookPopup";

const Catalog = () => {

  const dispatch = useDispatch();

  const {returnBookPopup} = useSelector((state) => state.popup);

  const {loading, error, allBorrowedBooks, message} = useSelector((state) => state.borrow);

  const [filter, setFilter] = useState("borrowed");

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);
    
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    const result = `${formattedDate}  ${formattedTime}`;
    return result;
  };

  const currentDate = new Date();
  
  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  const overdueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;  

  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  useEffect(() => {
    if(message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if(error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, loading]);
    

  return <>
    
    <main className="flex-1 p-6 pt-28">
        <Header/>
    
        {/* Sub Header */}
        {/* <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center ">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold ">My Borrowed Books</h2>
        </header> */}
    
        <header className="flex flex-row gap-3 sm:flex-row md:items-center">
    
          <button className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
            filter === "borrowed" 
            ? "bg-black text-white border-black " 
            : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`} 
            onClick={() => setFilter("borrowed")}>
            Borrowed Books
          </button>
    
          <button className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${
            filter === "overdue" 
            ? "bg-black text-white border-black " 
            : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`} 
            onClick={() => setFilter("overdue")}>
            Overdue Borrowers
          </button>
        </header>
    
        {
          booksToDisplay && booksToDisplay.length > 0 ? (
            <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
    
              <table className="min-w-full border-collapse">
    
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Username</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Due Date</th>
                    <th className="py-2 px-4 text-left">Date & Time</th>
                    <th className="py-2 px-4 text-left">Return</th>
                  </tr>
                </thead>
    
                <tbody>
                  {
                    booksToDisplay.map((book, index) => (
                      <tr key={book._id} className={(index+1)%2 === 0 ? "bg-gray-50" : ""}> 
                        <td className="py-2 px-4 text-left">{index+1}</td>
                        <td className="py-2 px-4 text-left">{book?.user.name}</td>
                        <td className="py-2 px-4 text-left">{book?.user.email}</td> 
                        <td className="py-2 px-4 text-left">{formatDate(book.dueDate)}</td>
                        <td className="py-2 px-4 text-left">{formatDateAndTime(book.createdAt)}</td>
                        <td className="py-2 px-4 text-left">
                          {
                            book.returnDate ? (
                              <FaSquareCheck className="w-6 h-6"/>
                            ) : (
                              <PiKeyReturnBold 
                                onClick={()=> openReturnBookPopup(book.book, book?.user.email)} 
                                className="w-6 h-6"
                              />
                            )
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
    
              </table>
            </div>
          ) : (
            <h3 className="text-3xl mt-5 font-medium">No {filter === "borrowed" ? "borrowed" : "overdue"} books found!</h3>
          )
        }
    </main>
    
    {returnBookPopup && <ReturnBookPopup bookId={borrowedBookId} email={email}/>}
  
  </>;
};

export default Catalog;
