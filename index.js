require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

async function updateMemberCount() {
  console.log('[DEBUG] updateMemberCount called');
  
  const guild = client.guilds.cache.first();
  console.log('[DEBUG] Guild:', guild ? guild.name : 'NONE');
  
  if (!guild) {
    console.log('[ERROR] No guild found! Is bot invited to a server?');
    return;
  }
  
  await guild.members.fetch();
  console.log('[DEBUG] Members fetched. Total:', guild.memberCount);
  
  const channelID = process.env.MEMBER_COUNT_CHANNEL_ID;
  console.log('[DEBUG] Channel ID from env:', channelID);
  
  const channel = await guild.channels.fetch(channelID);
  console.log('[DEBUG] Fetched channel:', channel ? channel.name : 'NOT FOUND');
  
  if (!channel) {
    console.log('[ERROR] Could not find channel with that ID');
    return;
  }
  
  if (channel.type !== ChannelType.Voice) {
    console.log('[ERROR] Channel is not a voice channel! Type:', channel.type);
    return;
  }
  
  const totalMembers = guild.memberCount;
  const onlineMembers = guild.presences.cache.size;
  
  const name = `👥・Members: ${totalMembers} | 🟢・Online: ${onlineMembers}`;
  
  console.log('[DEBUG] Current channel name:', channel.name);
  console.log('[DEBUG] New name would be:', name);
  
  if (channel.name === name) {
    console.log('[INFO] Name already correct, skipping update');
    return;
  }
  
  await channel.setName(name);
  console.log('[SUCCESS] Channel name updated to:', name);
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Bot is in', client.guilds.cache.size, 'server(s)');
  
  await updateMemberCount();
  
  setInterval(updateMemberCount, 60000);
});

client.on('guildMemberAdd', updateMemberCount);
client.on('guildMemberRemove', updateMemberCount);
client.on('presenceUpdate', () => {
  setTimeout(updateMemberCount, 5000);
});

client.login(process.env.DISCORD_BOT_TOKEN);