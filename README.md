Sustain WearGroup 14 Applied Software Engineering Assessment

Sustain Wear is a web application focused on sustainable clothing donation and distribution. This repository contains the source code for both the client-side interface and the server-side logic.

Prerequisites: before beginning the installation, ensure you have the following installed on your local machine: Node.js (Latest LTS version recommended) PostgreSQL (Ensure the service is running and you have access to a superuser account)

Configuration: Create a .env file in the root directory of the project. Populate it with the following environment variables.

Note: Ensure that BACKEND_SERVER_URL and FRONTEND_SERVER_URL do not contain trailing slashes.Bash# Database Configuration

# Replace 'PASSWORDFROMYOURPOSTGRESSQLSERVER' with your actual Postgres password

DATABASE_URL="postgresql://postgres:PASSWORDFROMYOURPOSTGRESSQLSERVER@localhost:5432/sustain-wear"

# Authentication Secrets

JWT_SECRET="key"

# OAuth Configuration

GOOGLE_CLIENT_ID="334970749720-aia1uo57j1b6i24m92s23dc3mgdmpjv5.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"

# Server URLs

BACKEND_SERVER_URL="http://localhost:3000"
FRONTEND_SERVER_URL="http://localhost:5173"

# Cloudinary Virtual Images

CLOUDINARY_CLOUD_NAME=dtckq9bj4
CLOUDINARY_API_KEY=452996932715446
CLOUDINARY_API_SECRET=UpwnhGtAPW9r9kQT6E-B5KFaOzU

Installation & Setup

1. Install Dependencies
   npm install
2. Database Setup & Backend Initialization
   cd server
   npx prisma migrate dev
   npx prisma db seed
3. Running the Application
   cd server
   node index.js
   cd ..
   npm run dev

The application will be accessible at http://localhost:5173.

User Credentials:

Donor Superdonor@sustainwear.com SuperPassword123

Charity Staff SuperStaff@sustainwear.com SuperPassword123

Administrator SuperAdmin@sustainwear.com SuperPassword123
