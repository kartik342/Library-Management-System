import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const recordBorrowedBook = catchAsyncErrors(async(req, res, next)=>{
    const {id} = req.params
    // Use the authenticated user instead of looking up by email from body
    const { email } = req.body || {}

    if (!email) {
        return next(new ErrorHandler("Email is required", 400))
    }
    
    const user = await User.findOne({email, accountVerified: true})
    // console.log("Record Borrowed Book - User Email from Body:", email)
    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }
    // console.log("User:", user)

    // console.log("Record Borrowed Book - User:", user.email, "Book ID:", id);
    const book = await Book.findById(id)
    if(!book){
        return next(new ErrorHandler("Book not found", 404))
    }

    if(book.quantity < 1){
        return next(new ErrorHandler("Book not available", 400))
    }

    const isAlreadyBorrowed = await user.borrowedBooks.find(
        (b) => b.bookId.toString() === id && b.returned === false
    )// check if the user has already borrowed the book and not returned it yet

    console.log("Is Already Borrowed:", isAlreadyBorrowed)

    // if isAlreadyBorrowed is not null, it means a user has already borrowed the book and not returned it yet, so we cannot allow the user to borrow the same book again until they return it
    if(isAlreadyBorrowed){
        return next(new ErrorHandler("Book Already Borrowed", 400))
    }

    book.quantity -= 1
    book.availability = book.quantity > 0 
    await book.save()

    user.borrowedBooks.push({
        bookId: book._id,
        bookTitle: book.title,
        borrowedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // due date is 7 days from now
    })
    await user.save()

    await Borrow.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        book: book._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // due date is 7 days from now
        price: book.price,
    })
    
    res.status(201).json({
        success: true,
        message: "Borrowed book recorded successfully",
    })
    
})

export const returnBorrowedBook = catchAsyncErrors(async(req, res, next)=>{

    // console.log("Res.Params:", req.params)
    const {bookId} = req.params
    const { email } = req.body || {}

    if (!email) {
        return next(new ErrorHandler("Email is required", 400))
    }

    const book = await Book.findById(bookId)
    console.log("Return Borrowed Book - Book ID from Params:", bookId)
    if(!book){
        return next(new ErrorHandler("Book not found", 404))
    }

    const user = await User.findOne({email, accountVerified: true})
    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }

    const borrowedBook = user.borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    )

    if(!borrowedBook){
        return next(new ErrorHandler("You have not borrowed this book", 404))
    }

    borrowedBook.returned = true
    // borrowedBook.returnDate = new Date()
    await user.save()

    book.quantity += 1
    book.availability = book.quantity > 0
    await book.save()

    const borrowRecord = await Borrow.findOne({
        book: bookId,
        "user.email": email,
        returnDate: null, // find the borrow record where returnDate is null, which means the book has not been returned yet
    })
    if(!borrowRecord){
        return next(new ErrorHandler("You have not borrowed this book", 404))
    }
    borrowRecord.returnDate = new Date()
    const fine = calculateFine(borrowRecord.dueDate)
    borrowRecord.fine = fine
    await borrowRecord.save()

    res.status(200).json({
        success: true,
        message: fine > 0 
        ? `The book has been returned successfully. The total charges, including a fine, are $${fine + book.price} ` 
        : `The book has been returned successfully. The total charges are $${book.price} `,
    })
})

export const borrowedBooks = catchAsyncErrors(async(req, res, next)=>{
    const { borrowedBooks} = req.user

    res.status(200).json({
        success: true,
        borrowedBooks,
    })
})

export const getBorrowedBooksForAdmin = catchAsyncErrors(async(req, res, next)=>{
    const borrowedBooks = await Borrow.find()  

    res.status(200).json({
        success: true,
        borrowedBooks,
    })
})