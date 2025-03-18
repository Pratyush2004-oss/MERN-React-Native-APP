import cloudinary from "../config/cloudinary.js";
import Book from "../models/books.model.js";

// upload book to the collection
export const addBook = async (req, res, next) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        // Save book to database
        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        });

        await newBook.save();

        res.status(200).json({ message: "Book added successfully", book: newBook });

        // upload image to cloudinary 
    } catch (error) {
        console.log("Error in adding book controller", error);
        next(error);
    }
};

// getting all the books with pagination
export const getAllBooks = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const totalBooks = await Book.countDocuments();

        const books = await Book.find().sort({ createdAt: -1 }).
            skip(skip).
            limit(limit).
            populate("user", "username profileImage");

        res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });

    } catch (error) {
        console.log("Error in getting all books controller", error);
        next(error);
    }

}

// get books by the loggedin user
export const getBooksByUser = async (req, res, next) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ books });        
    } catch (error) {
        console.log("Error in Getting books of user controller: ", error);
        next(error);
    }
}

// delete the book
export const deleteBook = async (req, res, next) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // check if the user is the creator of the book 
        if (!book.user.toString() === req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this book" });
        }

        // delete image from cloudinary as well
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.log("Error in deleting Image from Cloudinary: ", error);
            }
        }


        // delete book from database
        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        console.log("Error in Delete Book Controller : ", error);
        next(error);
    }
}