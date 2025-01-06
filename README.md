# Realms

## Make your Discord server open-world with fully customizable 2D game worlds to accompany your Discord channels. 

Realms is an application that is designed to transform a Discord server into a multiplayer web game. Realms are split up into rooms that can be customized with a wide variety of tiles. Connect rooms to each other with teleport tiles, and place colliders to set up blocked areas. 

Get the Discord bot to set up Discord integration. Use the `/link` command to link a server to your Realm, and the `/connect` command to pair a channel's text chat with the text chat of a specific room. 

Generate and copy your Realm's share link to play with your friends. Under the manage tab, set privacy settings to ensure only visitors from your Discord server can use your link, or leave it public. It's up to you!

83 skins to choose from!
Hundreds of tiles!
Fully customizable room layouts!
Realtime multiplayer chat!

This is a TypeScript web app primarily built with Next.js, Supabase, Socket.io, and TailwindCSS.

### How to install

First, clone the repo.
`git clone https://github.com/trevorwrightdev/realms.git`

Install client dependencies.
```bash
cd frontend
npm install
```

Install server dependencies.
```bash
cd backend
npm install
```

Since this project uses both Discord and Supabase, you will need to create a Discord bot and a Supabase project. 

Create a .env file in the `backend` directory with the following variables:
```
FRONTEND_URL=
SUPABASE_URL=
SERVICE_ROLE=
SERVER_ID=
CLIENT_ID=
LOGIN_BOT=true
```

Create a .env.local file in the `frontend` directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_BACKEND_URL=
SERVICE_ROLE=
```

Lastly, run `npm run dev` in both the `frontend` and `backend` directories.
