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
  console.log(`✅ Logged in as ${client.user.tag}`);
  
  console.log(`📊 Checking guilds...`);
  console.log(`Total guilds: ${client.guilds.cache.size}`);
  
  if (client.guilds.cache.size > 0) {
    const guild = client.guilds.cache.first();
    console.log(`🏆 First guild: ${guild.name} (${guild.id})`);
    
    try {
      await updateMemberCount();
      console.log(`✅ Member count updated successfully`);
    } catch (err) {
      console.error(`❌ Error updating member count:`, err.message);
    }
  } else {
    console.error(`❌ Bot is not in any guild! Make sure the bot is added to your server.`);
  }
  
  setInterval(updateMemberCount, 60000);
});

client.on('guildMemberAdd', updateMemberCount);
client.on('guildMemberRemove', updateMemberCount);
client.on('presenceUpdate', () => {
  setTimeout(updateMemberCount, 5000);
});

client.login(process.env.DISCORD_BOT_TOKEN);



