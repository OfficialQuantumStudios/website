import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const WATCHED_USERS = [
  '615607763736985601', // mysterek
  '766993386112286793' // wes
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

app.get('/status', async (req, res) => {
  try {
    const guild = await client.guilds.fetch('1279563548019916851');
    await guild.members.fetch(); // refresh member cache

    const results = WATCHED_USERS.map(id => {
      const member = guild.members.cache.get(id);
      const username = member?.user?.username || `Unknown (${id})`;
      const status = member?.presence?.status || 'offline';
      return { username, status };
    });

    res.json(results);
  } catch (err) {
    console.error('Error fetching status:', err);
    res.status(500).json({ error: 'Failed to fetch presence data' });
  }
});

app.get('/avatars', async (req, res) => {
  try {
    const guild = await client.guilds.fetch('1279563548019916851');
    await guild.members.fetch();

    const results = WATCHED_USERS.map(id => {
      const member = guild.members.cache.get(id);
      const username = member?.user?.username || `Unknown (${id})`;
      const avatarUrl = member?.user?.displayAvatarURL({ size: 512, extension: 'png' }) || null;
      return { username, avatar: avatarUrl };
    });

    res.json(results);
  } catch (err) {
    console.error('Error fetching avatars:', err);
    res.status(500).json({ error: 'Failed to fetch avatars' });
  }
});

client.login(process.env.DISCORD_TOKEN);
app.listen(port, () => {
  console.log(`server is probably running on http://localhost:${port}/status`);
});