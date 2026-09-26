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

async function updateMemberCount(guild) {
  try {
    if (!guild) return;

    const channel = await guild.channels.fetch(
      process.env.MEMBER_COUNT_CHANNEL_ID
    );

    if (!channel) {
      console.log('Member-Count-Channel wurde nicht gefunden.');
      return;
    }

    const isVoice =
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice;

    if (!isVoice) {
      console.log('Der Member-Count-Channel ist kein Voice/Stage Channel.');
      return;
    }

    const totalMembers = guild.memberCount;
    const name = `👥・Members: ${totalMembers}`;

    console.log(`Member Count: ${totalMembers}`);

    if (channel.name !== name) {
      await channel.setName(name);
      console.log(`Counter aktualisiert: ${name}`);
    }

  } catch (error) {
    console.error('Fehler beim Aktualisieren des Member Counters:', error);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.first();

  if (guild) {
    await updateMemberCount(guild);
  }

  setInterval(() => {
    if (guild) {
      updateMemberCount(guild);
    }
  }, 60000);
});

client.on('guildMemberAdd', async (member) => {

  try {
    await member.roles.add(process.env.MEMBER_ROLE_ID);

    console.log(
      `${member.user.tag} hat die automatische Rolle erhalten.`
    );
  } catch (error) {
    console.error('Rolle konnte nicht vergeben werden:', error);
  }

  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
});

client.on('guildMemberRemove', async (member) => {

  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
});

client.login(process.env.DISCORD_BOT_TOKEN);
