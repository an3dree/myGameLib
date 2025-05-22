export interface GameStatus {
    id: number;
    name: string
    slug: string;
}

/*
🟡 ⏸️ On-hold

🟢 🎮 Playing

🔴 🗑️ Dropped

🔵 ⏳ Plan-to-play

🟣 🏆 Completed

🟤 💾 Owned

*/

//"playing" | "toplay" | "completed" | "on-hold" | "dropped" | "owned" | "";