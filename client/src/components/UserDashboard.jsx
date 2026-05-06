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
    <main className="flex-1 p-3 sm:p-4 pt-20 sm:pt-24 bg-[#f5f5f5] min-h-screen overflow-hidden">

      <Header />

      <div className="flex flex-col-reverse xl:flex-row gap-3">

        {/* LEFT SIDE */}
        <div className="flex flex-[4] flex-col gap-3 xl:min-h-[85vh]">

          {/* TOP CARDS */}
          <div className="flex flex-col gap-3">

            {/* Borrowed Books */}
            <div className="flex items-center gap-4 bg-white p-3 min-h-[85px] rounded-2xl shadow-sm transition hover:shadow-inner duration-300">

              <span className="w-[2px] h-14 bg-black"></span>

              <span className="bg-gray-200 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <img
                  src={bookIcon}
                  alt="book-icon"
                  className="w-6 h-6 object-contain"
                />
              </span>

              <div>
                <h3 className="text-xl font-bold">
                  {totalBorrowedBooks}
                </h3>

                <p className="text-sm text-gray-500">
                  Borrowed Books
                </p>
              </div>

            </div>

            {/* Returned Books */}
            <div className="flex items-center gap-4 bg-white p-3 min-h-[85px] rounded-2xl shadow-sm transition hover:shadow-inner duration-300">

              <span className="w-[2px] h-14 bg-black"></span>

              <span className="bg-gray-200 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <img
                  src={returnIcon}
                  alt="return-icon"
                  className="w-6 h-6 object-contain"
                />
              </span>

              <div>
                <h3 className="text-xl font-bold">
                  {totalReturnedBooks}
                </h3>

                <p className="text-sm text-gray-500">
                  Returned Books
                </p>
              </div>

            </div>

          </div>

          {/* Browse Section */}
          <div className="flex flex-col lg:flex-row items-center gap-3">

            <div className="flex-1 flex items-center gap-4 bg-white p-3 min-h-[90px] rounded-2xl shadow-sm transition hover:shadow-inner duration-300 w-full">

              <span className="w-[2px] h-14 bg-black"></span>

              <span className="bg-gray-200 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <img
                  src={browseIcon}
                  alt="browse-icon"
                  className="w-6 h-6 object-contain"
                />
              </span>

              <p className="text-base sm:text-lg font-semibold">
                Let's browse books inventory
              </p>

            </div>

            <img
              src={logo_with_title}
              alt="logo"
              className="hidden lg:block w-44 xl:w-56 object-contain shrink-0"
            />

          </div>

          {/* QUOTE SECTION */}
          <div className="bg-white p-5 sm:p-6 min-h-[170px] rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">

            <h2 className="text-lg sm:text-xl xl:text-3xl font-semibold leading-snug max-w-[850px]">
              "Reading empowers the mind, sharpens perspective and opens the door to continuous growth and imagination."
            </h2>

            <p className="text-right text-gray-700 text-sm sm:text-base mt-4">
              ~ BookWorm Team
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex-[2] flex flex-col gap-3 py-1">

          {/* PIE CHART */}
          <div className="bg-white rounded-2xl p-4 flex justify-center items-center shadow-sm min-h-[290px] overflow-hidden">

            <Pie
              data={data}
              options={{
                cutout: 0,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
              className="w-[180px] sm:w-[240px] md:w-[300px] shrink-0"
            />

          </div>

          {/* STATS */}
          <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-sm w-full">

            <img
              src={logo}
              alt="logo"
              className="h-10 sm:h-12 object-contain"
            />

            <span className="w-[2px] bg-black self-stretch"></span>

            <div className="flex flex-col gap-2 text-sm">

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
