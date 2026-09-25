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
  
  const channel = await guild.channels.fetch(process.env.MEMBER_COUNT_CHANNEL_ID);
  
  if (!channel) return;
  
  const isVoice = channel.type === ChannelType.GuildVoice || 
                  channel.type === ChannelType.GuildStageVoice;
  
  if (isVoice) {
    const name = `👥・Members: ${totalMembers}`;
    
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