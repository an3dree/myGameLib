export interface GameStatus {
    id: number;
    name: string
    slug: string;
}


/*
const statuses = [
    { id: 1, name: 'Playing', slug: 'playing' },
    { id: 2, name: 'Plan-to-play', slug: 'toplay' },
    { id: 3, name: 'Completed', slug: 'completed' },
    { id: 4, name: 'On-hold', slug: 'on-hold' },
    { id: 5, name: 'Dropped', slug: 'dropped' },
    { id: 6, name: 'Owned', slug: 'owned' },
];
*/

/*
🟡 ⏸️ On-hold

🟢 🎮 Playing

🔴 🗑️ Dropped

🔵 ⏳ Plan-to-play

🟣 🏆 Completed

🟤 💾 Owned

*/

//"playing" | "toplay" | "completed" | "on-hold" | "dropped" | "owned" | "";