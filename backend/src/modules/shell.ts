export async function openFile (filepath: string) {
    const exists: boolean = await Bun.file(filepath).exists();

    if (!exists) return;

    const process = Bun.spawn({
        cwd: import.meta.env.HOME,
        cmd: ["xdg-open", filepath],
        stdout: null,
        stderr: null,
    });

    process.unref();
}

export const AppWhiteList: Record<string, string> = {
    "btop": "st -e btop",
    "firefox": "firefox",
    "st": "st -e walrs -R",
    "vim": "st -e vim",
    "nvim": "st -e nvim",
    "neovim": "st -e nvim",
    "evince": "evince",
    "inkscape": "inkscape",
}

export async function openApp (app: string) {
    const cmd = AppWhiteList[app];
    if (!cmd) return;

    const process = Bun.spawn({
        cwd: import.meta.env.HOME,
        cmd: cmd.split(" "),
        stdout: null,
        stderr: null,
    });

    process.unref();
}

export const CommandWhiteList = ["cat", "pino", "pwd", "ls", "exa", "date", "whoami", "ps", "xclip"];

export async function executeCommand (command: string) {
    const cmd = command.split(" ");
    if (!CommandWhiteList.includes(cmd[0])) return "Unallowed command!";

    const process = Bun.spawn({
        cwd: import.meta.env.HOME,
        cmd: cmd,
        stdout: "pipe",
        stderr: "pipe"
    });

    const out = await Bun.readableStreamToText(process.stdout);
    return out;
}
