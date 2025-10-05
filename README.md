# Streamers University

Welcome to **Streamers University**, a web application designed to help streamers manage their streaming profiles and content. Built with a modern stack, this app allows users to register, log in, create, view, edit, and delete streaming profiles with a sleek, responsive design.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **User Authentication**: Register and log in with a username, email, and password.
- **Profile Management**: Create, view, edit, and delete streaming profiles with details like title, platform, content type, and content.
- **Responsive Design**: Utilizes CSS Flexbox for a mobile-friendly layout.
- **Custom Background**: Features a streamers logo with a camera and TV as a background across all pages.
- **Error Handling**: Displays user-friendly error messages for invalid inputs or server issues.

## Technologies
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Templating**: EJS
- **Session Management**: Express-session with MongoStore
- **Other Dependencies**: dotenv, cors, method-override, bcryptjs, express-ejs-layouts
- **Styling**: CSS with Flexbox

## Installation

### Prerequisites
- Node.js (v14.x or higher recommended)
- MongoDB (local or remote instance, e.g., MongoDB Atlas)
- npm (comes with Node.js)

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/streamers-university.git
   cd streamers-university