import React from "react";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";


const AddBookPopup = () => {

  const dispatch = useDispatch();

  const[title, setTitle] = useState("");
  const[author, setAuthor] = useState("");
  const[quantity, setQuantity] = useState("");
  const[description, setDescription] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("quantity", quantity);
    formData.append("description", description);
    dispatch(addBook(formData));
    dispatch(fetchAllBooks());
  };
  return <>
    
    <div className='fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50'>
      <div className='w-full bg-white rounded-lg shadow-lg md:w-1/3'>
        <div className='p-6'>
          <h2 className='text-xl font-bold mb-4'>Add Book</h2>
            <form onSubmit={handleAddBook}>
            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Book Title</label>
              <input
                type='text'
                className='w-full px-4 py-2 border-2 border-black rounded-md'
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Author</label>
              <input
                type='text'
                className='w-full px-4 py-2 border-2 border-black rounded-md'
                placeholder="Book Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Quantity</label>
              <input
                type='number'
                className='w-full px-4 py-2 border-2 border-black rounded-md'
                placeholder="Book Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>Description</label>
              <textarea
                className='w-full px-4 py-2 border-2 border-black rounded-md'
                placeholder="Book's Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            

              {/* Buttons */}
              <div className="flex justify-end space-x-4">

                <button 
                  type="button" 
                  onClick={()=> dispatch(toggleAddBookPopup())}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>

                <button 
                  type="submit" 
                  // disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Add Book
                </button>

              </div>
            </form>
        </div>
      </div>
    </div>
  
  
  </>;
};

export default AddBookPopup;
