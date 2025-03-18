# MERN React Native Backend

This is the backend for a MERN stack application with React Native. It includes endpoints for user authentication (signup and login) and book management.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```

2. Navigate to the backend directory:
    ```sh
    cd backend
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

4. Create a `.env` file in the `backend` directory and add the following environment variables:
    ```env
    PORT=3000
    MONGO_DB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

### Running the Server

To start the server in development mode, run:
```sh
npm run dev
```

The server will start on the port specified in the `.env` file (default is 3000).

## API Endpoints

### User Authentication

#### Signup

- **URL:** `/api/v1/auth/signup`
- **Method:** `POST`
- **Description:** Creates a new user account.
- **Request Body:**
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Response:**
    ```json
    {
        "message": "User created successfully",
        "token": "string",
        "user": {
            "username": "string",
            "email": "string",
            "profileImage": "string"
        }
    }
    ```

#### Login

- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Description:** Logs in an existing user.
- **Request Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response:**
    ```json
    {
        "message": "User logged in successfully",
        "token": "string",
        "user": {
            "username": "string",
            "email": "string",
            "profileImage": "string"
        }
    }
    ```

### Book Management

#### Add Book

- **URL:** `/api/v1/books`
- **Method:** `POST`
- **Description:** Adds a new book.
- **Request Body:**
    ```json
    {
        "title": "string",
        "author": "string",
        "description": "string"
    }
    ```
- **Response:**
    ```json
    {
        "message": "Book added successfully",
        "book": {
            "title": "string",
            "author": "string",
            "description": "string"
        }
    }
    ```

## Implementation Details

### Database Connection

The database connection is established using Mongoose. The connection details are specified in the `.env` file.

```javascript
// filepath: src/config/db.js
import mongoose from "mongoose";

export const connectToDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database Connected : ", connection.connection.host);
    } catch (error) {
        console.log("Error while connecting to database", error);
        process.exit(1); // exit with failure        
    }
};
```

### User Model

The user model includes fields for `username`, `email`, `password`, and `profileImage`. Passwords are hashed using bcrypt before being saved to the database.

```javascript
// filepath: src/models/user.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: "String",
        required: true,
        unique: true
    },
    email: {
        type: "String",
        required: true,
        unique: true
    },
    password: {
        type: "String",
        required: true,
        minlength: 6
    },
    profileImage: {
        type: "String",
        default: ""
    }
}, { timestamps: true });

// hashing the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
```

### Authentication Controller

The authentication controller handles user signup and login. It generates JWT tokens for authenticated users.

```javascript
// filepath: src/controller/auth.controller.js


```

### Routes

The routes for authentication and book management are defined in separate files.

```javascript
// filepath: src/routes/auth.routes.js
import express from "express";
import { login, logout, signup } from "../controller/auth.controller.js";

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

export default router;
```

```javascript
// filepath: src/routes/books.route.js
import express from 'express';
import { addBook } from '../controller/books.controller.js';

const router = express.Router();

router.post('/', addBook);
router.get('/',);

export default router;
```

## License

This project is licensed under the ISC License.