# About:

Herta.. An AI powered chatbot that makes your life hell.

Built with Bun, Openrouter and React (worst experience..)


# Features:

- **Message Relay System** – Forwards messages from the user to selected friends via Discord DM.
- **Realistic AI Persona** – Mimics a fictional character (like Herta) with curated prompts to sound convincing.
- **Typing Simulation** – Uses Discord's typing indicator to feel more human.
- **Manual Message Control** – Only sends messages the user approves; no unsolicited AI replies.
- **Command Execution** – can execute whitelisted commands on your machine (just making sure no one runs `rm -rf /`).
- **File opening** – via xdg-open. <!-- backend/src/modules/shell.ts -->
- **App launching** – via user defined commands. <!-- backend/src/modules/shell.ts -->
- **OpenRouter Integration** – Leverages OpenRouter to generate responses when needed.
- **No Smart Features** – Avoids advanced automation or data tracking by design.


# Requirements:

Bun installed (build with bun's native features)

```sh
curl -fsSL https://bun.sh/install | bash
```

Git (used to resolve your github username, can be omitted)

```sh
sudo pacman -S git 

# or
sudo apt install git

# or 
sudo xbps-install git

# or
sudo dnf install git

# or
echo "Fuck windows, don't use my tools on it"
```

Then set your username:

```sh
git config --global user.name "<your username>"
```


# Setup:

Clone the repository:

```sh
git clone https://github.com/yukiisen/herta.git
```

Build the frontend:

```sh
cd frontend
# install dependencies first.
bun install
bun run build
```

Then use a static server to run it:

```sh
cd build
wsrv --port 5000
```

Or run the development server directly (Not advised):

```sh
bun run dev
# or
vite
```

Next you need to run the backend:

Move to the backend directory and install deps:

```sh
cd backend
bun install
```

Create a `.env` file with your keys:

```env
API_KEY=openrouter-api-key
DISCORD_TOKEN=your-bot-token
```

Run the server:

```sh
bun run release

# or run the typescript files directly (fast boot but lower performance)
bun run dev
```


# Configuration:

There's no proper config files yet, but you can customize the bot by:

Changing the command whitelist:

```typescript
// file: backend/src/modules/shell.ts

// put your preferred commands here.
export const CommandWhiteList = ["cat", "pino", "pwd", "ls", "exa", "date", "whoami", "ps", "xclip"];
```

Change the app whitelist:

```typescript
// file: backend/src/modules/shell.ts

// Change or add commands to fit your needs
export const AppWhiteList: Record<AppName, Command> = {
    "btop": "st -e btop",
    "brave": "brave",
    "st": "st -e walrs -R",
    "vim": "st -e vim",
    "nvim": "st -e nvim",
    "neovim": "st -e nvim",
    "evince": "evince",
    "inkscape": "inkscape",
}
```

Finally, add your friends' Discord IDs:

```typescript
// file: backend/src/modules/discord.ts

const UserData: UserData = {
    "yukiisen": {
        id: "<ID>",
        name: "Yuki",
        timedout: false,
    },
    "someone": {
        id: "<ID>",
        name: "some person",
        timedout: false,
    }
}
```

Mention them again in the system prompts at `backend/src/config.ts`.

You can always tweak the code to fit your needs :)
