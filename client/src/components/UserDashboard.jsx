import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";
import { use } from "react";



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

import { useSelector } from "react-redux";
import { useState } from "react";
import Header from "../layout/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


const UserDashboard = () => {

  const {settingPopup} = useSelector((state)=> state.popup);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    let numberOfTotalBorrowedBooks = userBorrowedBooks.filter(
      (book) => book.returned === false
    );
    
    let numberOfTotalReturnedBooks = userBorrowedBooks.filter(
      (book) => book.returned === true
    );

    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3#", "151619"],
        borderWidth: 4,
      },
    ],
  };


  return (
  <>
    <main className="flex-1 p-4 sm:p-6 pt-24 sm:pt-28">
      <Header />

      <div className="flex flex-col-reverse xl:flex-row gap-6">

        {/* Left Side */}
        <div className="flex flex-[4] flex-col gap-6 xl:min-h-[85vh]">

          <div className="flex flex-col gap-6">

            {/* Borrowed Books */}
            <div className="flex items-center gap-4 bg-white p-4 sm:p-5 min-h-[110px] rounded-xl transition hover:shadow-inner duration-300">
              
              <span className="w-[2px] h-16 sm:h-20 bg-black"></span>

              <span className="bg-gray-200 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shrink-0">
                <img
                  src={bookIcon}
                  alt="book-icon"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                />
              </span>

              <p className="text-base sm:text-lg xl:text-xl font-semibold">
                Your Borrowed Book List
              </p>
            </div>

            {/* Returned Books */}
            <div className="flex items-center gap-4 bg-white p-4 sm:p-5 min-h-[110px] rounded-xl transition hover:shadow-inner duration-300">
              
              <span className="w-[2px] h-16 sm:h-20 bg-black"></span>

              <span className="bg-gray-200 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shrink-0">
                <img
                  src={returnIcon}
                  alt="return-icon"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                />
              </span>

              <p className="text-base sm:text-lg xl:text-xl font-semibold">
                Your Returned Book List
              </p>
            </div>

          </div>

          {/* Browse Section */}
          <div className="flex flex-col lg:flex-row items-center gap-6">

            <div className="flex-1 flex items-center gap-4 bg-white p-4 sm:p-5 min-h-[110px] rounded-xl transition hover:shadow-inner duration-300 w-full">

              <span className="w-[2px] h-16 sm:h-20 bg-black"></span>

              <span className="bg-gray-200 w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center shrink-0">
                <img
                  src={browseIcon}
                  alt="browse-icon"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />
              </span>

              <p className="text-base sm:text-lg xl:text-xl font-semibold">
                Let's browse books inventory
              </p>

            </div>

            <img
              src={logo_with_title}
              alt="logo"
              className="hidden lg:block w-52 xl:w-72 object-contain shrink-0"
            />
          </div>

          {/* Bottom Quote Box */}
          <div className="bg-white p-6 sm:p-7 min-h-[180px] font-semibold relative flex justify-center items-center rounded-2xl">

            <h4 className="text-lg sm:text-xl xl:text-3xl 2xl:text-4xl text-center">
              
            </h4>

            <p className="text-gray-700 text-sm sm:text-base absolute right-5 sm:right-8 bottom-4">
              ~ Bookworm Team
            </p>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex-[2] flex flex-col lg:flex-row xl:flex-col gap-6 xl:gap-10 py-2">

          {/* Pie Chart */}
          <div className="flex justify-center items-center w-full min-w-[320px] bg-white rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <Pie
              data={data}
              options={{ cutout: 0 }}
              className="w-[260px] sm:w-[320px] md:w-[350px] shrink-0"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center bg-white p-5 sm:p-6 gap-5 rounded-2xl w-full">

            <img
              src={logo}
              alt="logo"
              className="h-12 sm:h-16 object-contain"
            />

            <span className="w-[2px] bg-black self-stretch"></span>

            <div className="flex flex-col gap-4 text-sm sm:text-base">

              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#3D3E3E]"></span>
                <span>Total Borrowed Books</span>
              </p>

              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
                <span>Total Returned Books</span>
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  </>
);
};

export default UserDashboard;
