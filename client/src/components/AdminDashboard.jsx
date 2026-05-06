import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
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

import { useSelector, useDispatch } from "react-redux";
import Header from "../layout/Header";

const AdminDashboard = () => {

  const {user} = useSelector(state=> state.auth);
  const {users} = useSelector(state=> state.user);
  const {books} = useSelector(state=> state.book);
  const {allBorrowedBooks} = useSelector(state=> state.borrow);
  const {settingPopup} = useSelector(state=> state.popup);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length) || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);


  useEffect(()=>{
    let numberOfUsers = users.filter(user => user.role === 'User')
    let numberOfAdmin = users.filter(user => user.role === 'Admin')
    setTotalUsers(numberOfUsers)
    setTotalAdmin(numberOfAdmin)

    let numberOfTotalBorrowedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate === null
    );
    let numberOfTotalReturnedBooks = allBorrowedBooks.filter(
      (book) => book.returnDate !== true
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);

  }, [users, allBorrowedBooks])
  
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

      <div className="flex flex-col xl:flex-row gap-3">

        {/* LEFT SIDE */}
        <div className="flex-[2] flex flex-col gap-3">

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

          {/* STATS LEGEND */}
          <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-sm w-full sm:w-fit">

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

        {/* RIGHT SIDE */}
        <div className="flex-[3] flex flex-col gap-3">

          {/* TOP SECTION */}
          <div className="flex flex-col lg:flex-row gap-3">

            {/* CARDS */}
            <div className="flex flex-col gap-3 flex-1">

              {/* USERS */}
              <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-sm min-h-[80px]">

                <span className="bg-gray-200 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src={usersIcon}
                    alt="users-icon"
                    className="w-6 h-6 object-contain"
                  />
                </span>

                <span className="w-[2px] bg-black self-stretch"></span>

                <div>
                  <h3 className="text-xl font-bold">
                    {totalUsers.length}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Total User Base
                  </p>
                </div>

              </div>

              {/* BOOKS */}
              <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-sm min-h-[80px]">

                <span className="bg-gray-200 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src={bookIcon}
                    alt="book-icon"
                    className="w-6 h-6 object-contain"
                  />
                </span>

                <span className="w-[2px] bg-black self-stretch"></span>

                <div>
                  <h3 className="text-xl font-bold">
                    {totalBooks}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Total Book Count
                  </p>
                </div>

              </div>

              {/* ADMINS */}
              <div className="bg-white rounded-2xl p-3 flex items-center gap-4 shadow-sm min-h-[80px]">

                <span className="bg-gray-200 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src={adminIcon}
                    alt="admin-icon"
                    className="w-6 h-6 object-contain"
                  />
                </span>

                <span className="w-[2px] bg-black self-stretch"></span>

                <div>
                  <h3 className="text-xl font-bold">
                    {totalAdmin.length}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Total Admin Count
                  </p>
                </div>

              </div>

            </div>

            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center flex-1 min-h-[260px]">

              <img
                src={user?.avatar?.url}
                alt="admin-avatar"
                className="w-20 h-20 rounded-full object-cover mb-3"
              />

              <h2 className="text-lg sm:text-xl font-semibold">
                {user?.name}
              </h2>

              <p className="text-gray-500 mt-2 max-w-[300px] text-sm leading-relaxed">
                Welcome to your admin dashboard. Here you can manage all the settings and monitor the statistics.
              </p>

            </div>

          </div>

          {/* QUOTE SECTION */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[180px] overflow-hidden">

            <h2 className="text-lg sm:text-xl xl:text-3xl font-semibold leading-snug max-w-[800px]">
              "Embarking on the journey of reading fosters personal growth, nurturing a path towards excellence and the refinement of character."
            </h2>

            <p className="text-right text-gray-700 text-sm sm:text-base mt-4">
              ~ BookWorm Team
            </p>

          </div>

        </div>

      </div>

    </main>
  </>
);
};

export default AdminDashboard;
