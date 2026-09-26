require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

async function updateMemberCount() {
  const guild = client.guilds.cache.first();

  if (!guild) return;

  try {
    const totalMembers = guild.memberCount;

    const channel = await guild.channels.fetch(
      process.env.MEMBER_COUNT_CHANNEL_ID
    );

    if (!channel) return;

    const isVoice =
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice;

    if (isVoice) {
      const name = `👥・Members: ${totalMembers}`;

      if (channel.name !== name) {
        await channel.setName(name);
      }
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Member Counters:', error);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  await updateMemberCount();

  setInterval(updateMemberCount, 60000);
});

client.on('guildMemberAdd', async (member) => {
  try {
    await member.roles.add(process.env.MEMBER_ROLE_ID);
    console.log(`${member.user.tag} hat die automatische Rolle erhalten.`);
  } catch (error) {
    console.error('Rolle konnte nicht vergeben werden:', error);
  }
  await updateMemberCount();
});

client.on('guildMemberRemove', async () => {
  await updateMemberCount();
});

client.login(process.env.DISCORD_BOT_TOKEN);
