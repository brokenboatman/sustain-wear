# Sustain Wear

This is Group 14's Applied Software Engineering assessment project.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

Download and install and remember the password for postgresssql server

npm install

create a .env file in the root with a
DATABASE_URL="postgresql://postgres:PASSWORDFROMYOURPOSTGRESSQLSERVER@localhost:5432/sustain-wear"
JWT_SECRET="key"
GOOGLE_CLIENT_ID="334970749720-aia1uo57j1b6i24m92s23dc3mgdmpjv5.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
BACKEND_SERVER_URL="http://localhost:3000"
FRONTEND_SERVER_URL="http://localhost:5173"

cd server
npx prisma migrate dev
cd ..
npx prisma db seed
node index.js

cd ..
npm run dev
