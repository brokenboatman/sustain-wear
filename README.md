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

create a .env file in the root with a 
DATABASE_URL="postgresql://postgres:PASSWORDFROMTHEPOSTGRESQLDATABASE@localhost:5432/sustain-wear"
JWT_SECRET="key"

cd server
node index.js

cd ..
npm run dev
