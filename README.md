Sustain Wear - Group 14 Applied Software Engineering Assessment

Sustain Wear is a web application focused on sustainable clothing donation and distribution. This repository contains the source code for both the client-side interface and the server-side logic.

Prerequisites

Before beginning the installation, ensure you have the following installed on your local machine:Node.js (Latest LTS version recommended)PostgreSQL (Ensure the service is running and you have access to a superuser account)

Configuration

To run this project locally, you must set up the environment variables.

Create a file named .env in the root directory of the project.
Copy the contents below and replace the placeholders (values starting with YOUR\_) with your own credentials.

Note: Ensure that BACKEND_SERVER_URL and FRONTEND_SERVER_URL do not contain trailing slashes.

# Replace 'YOUR_DB_PASSWORD' with your actual Postgres password

DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/sustain-wear"

# Authentication Secrets

# You can generate a random string for this

JWT_SECRET="YOUR_SECURE_RANDOM_STRING"

# Google OAuth Configuration

# See instructions below to obtain these

GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Server URLs

BACKEND_SERVER_URL="http://localhost:3000"
FRONTEND_SERVER_URL="http://localhost:5173"

# Cloudinary Configuration (For Image Uploads)

# See instructions below to obtain these

CLOUDINARY_CLOUD_NAME="YOUR_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_API_KEY"
CLOUDINARY_API_SECRET="YOUR_API_SECRET"

# Google GenAI API

# Obtain from Google AI Studio

GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Nodemailer Setup (Gmail App Password)

EMAIL_USER="YOUR_GMAIL_ADDRESS"
EMAIL_PASS="YOUR_APP_PASSWORD"

How to Obtain API Keys1.

1. Google OAuth (Client ID & Secret)

To allow users to log in with Google:

Go to the Google Cloud Console.

Create a new project.

Navigate to APIs & Services > Credentials.

Click Create Credentials -> OAuth Client ID.

Application Type: Web Application.

Authorized JavaScript Origins: http://localhost:5173

Authorized Redirect URIs: http://localhost:3000/auth/google/callback.

Copy the Client ID and Client Secret into your .env file.

2. Cloudinary (Image Hosting)

Sign up for a free account at Cloudinary.

Go to your Dashboard.

Copy the Cloud Name, API Key, and API Secret into your .env file.

3. Google Gemini (AI Features)

Go to Google AI Studio.

Click Get API Key.

Copy the key into your .env file.

4. Nodemailer (Email Features)

Go to your Google Account App Passwords.

Create a new app-specific password (custom name: "SustainWear").

Copy the 16-character password (e.g., xxxx xxxx xxxx xxxx) into EMAIL_PASS in your .env file.

In the end the .env file should be set as:

DATABASE_URL=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
BACKEND_SERVER_URL="http://localhost:3000"
FRONTEND_SERVER_URL="http://localhost:5173"
JWT_SECRET=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
GEMINI_API_KEY=""
EMAIL_USER=""
EMAIL_PASS=""

Installation & Setup

1. Install Dependencies

npm install

2. Database Setup & Backend Initialization

cd server

npx prisma migrate dev

npx prisma db seed

3. Running the Application

You will need two terminals open

Terminal 1 (Backend):

cd server

node index.js

Terminal 2 (Frontend):

npm run dev

The application will be accessible at http://localhost:5173

User Credentials (Seed Data)

The database seed provides the following accounts for testing:

Role

Role,Email,Password
Donor,SuperDonor@sustainwear.com,SuperPassword123
Charity Staff,SuperStaff@sustainwear.com,SuperPassword123
Administrator,SuperAdmin@sustainwear.com,SuperPassword123

Troubleshooting PostgreSQL

Sequence Error

If you encounter an error when trying to login or register, it is likely due to the primary key sequence being out of sync.

# ERROR START

PrismaClientKnownRequestError:
Invalid `prisma.user.create()` invocation:

Unique constraint failed on the fields: (`userId`)
at ei.handleRequestError (E:\University\Year 2\Applied Software Engineering\Assesment\sustain-wear\node_modules\@prisma\client\runtime\library.js:121:7268)
at ei.handleAndLogRequestError (E:\University\Year 2\Applied Software Engineering\Assesment\sustain-wear\node_modules\@prisma\client\runtime\library.js:121:6593)
at ei.request (E:\University\Year 2\Applied Software Engineering\Assesment\sustain-wear\node_modules\@prisma\client\runtime\library.js:121:6300)
at async a (E:\University\Year 2\Applied Software Engineering\Assesment\sustain-wear\node_modules\@prisma\client\runtime\library.js:130:9551)
at async Strategy.\_verify (file:///E:/University/Year%202/Applied%20Software%20Engineering/Assesment/sustain-wear/server/routes/auth.js:54:16)

# ERROR END

Open pgAdmin4 (or your preferred SQL tool).

Run the following query: SELECT setval(pg_get_serial_sequence('"User"', 'userId'), 4, false);

his resets the ID counter to accommodate the seeded users.
