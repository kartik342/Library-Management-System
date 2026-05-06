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


  return <>

    <main className="flex-1 p-6 pt-28">

      <Header/>

      <div className="flex flex-col-reverse xl:flex-row">

        {/* Left Side */}
        
        <div className="flex-[2] flex-col gap-7 lg:flex-row lg:items-center xl:flex-col justify-between xl:gap-20 py-5">

          <div className="flex-[4] flex items-center w-full content-center">
            <Pie 
              data={data} 
              options={{cutout:0}} 
              className="mx-auto lg-mx-0 w-full h-auto"/>
          </div>

          <div className="flex items-center w-full p-8 sm:w-[400px] xl:w-fit mr-5 xl:p-3 2xl:p-6 gap-5 h-fit xl:min-h-[150px] bg-white xl:flex-1 rounded-lg">
            <img src={logo} alt="logo" className="w-auto xl:flex-1 rounded-lg" />
          </div>
        </div>

        {/* Right Side */}


      </div>
    </main>
  </>;
};

export default AdminDashboard;
