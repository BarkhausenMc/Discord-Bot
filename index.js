require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

async function updateMemberCount() {
  const guild = client.guilds.cache.first();
  
  if (!guild) return;
  
  await guild.members.fetch();
  
  const totalMembers = guild.memberCount;
  const onlineMembers = guild.presences.cache.size;
  
  const channel = await guild.channels.fetch(process.env.MEMBER_COUNT_CHANNEL_ID);
  
  if (channel && channel.type === ChannelType.Voice) {
    const name = `👥・Members: ${totalMembers} | 🟢・Online: ${onlineMembers}`;
    
    if (channel.name !== name) {
      await channel.setName(name);
    }
  }
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  await updateMemberCount();
  
  setInterval(updateMemberCount, 60000);
});

client.on('guildMemberAdd', updateMemberCount);
client.on('guildMemberRemove', updateMemberCount);
client.on('presenceUpdate', () => {
  setTimeout(updateMemberCount, 5000);
});

client.login(process.env.DISCORD_BOT_TOKEN);



