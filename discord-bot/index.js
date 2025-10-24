import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
})

const WATCH_FOR_USERS = [
    '615607763736985601',
    '766993386112286793'
]

const userStatusCache = new Map();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
}
);

for (const userId of WATCH_FOR_USERS) {
    try {
        const user = await client.users.fetch(userId);
        userStatusCache.set(userId, {
            username: user.username,
            status: user.presence?.status || 'offline'
        });
    } catch (error) {
        console.error(`Failed to fetch user with ID ${userId}:`, error);
    }
}

client.on('presenceUpdate', (oldPresence, newPresence) => {
    const userId = newPresence.userId;
    if (WATCH_FOR_USERS.includes(userId)) {
        const status = newPresence.status || 'offline';
        const username = newPresence.user?.username || 'unknown';
        userStatusCache.set(userId, { username, status });
        console.log(`Updated status for ${username}: ${status}`);
    }
});

app.get('/status', (req, res) => {
    const statuses = [];

    for (const userId of WATCH_FOR_USERS) {
        try
        {
            const user = client.users.cache.get(userId);
            const presence = user?.presence.status || userStatusCache.get(userId)?.status || 'offline';
            statuses.push({
                id: userId,
                username: user?.username || userStatusCache.get(userId)?.username || 'unknown',
                status: presence
            });
        } catch (error) {
            console.error(`Failed to get status for user with ID ${userId}:`, error);
        }
    }

    res.json(statuses);
});

client.login(process.env.DISCORD_BOT_TOKEN);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});