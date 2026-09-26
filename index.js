require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags
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

    if (!channel) return;

    const isVoice =
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice;

    if (!isVoice) return;

    const name = `👥・Members: ${guild.memberCount}`;

    if (channel.name !== name) {
      await channel.setName(name);
    }

  } catch (error) {
    console.error('Fehler beim Aktualisieren des Member Counters:', error);
  }
}

client.once('clientReady', async () => {
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
  } catch (error) {
    console.error('Fehler beim Vergeben der Rolle:', error);
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

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rules') {
    const rulesContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '# 📚 Allgemeine Serverregeln 📚\n\n' +
          '__**🔹 Verhalten & Respekt**__\n' +
          '• 🤝 Sei freundlich und respektvoll – Behandle alle Mitglieder so, wie du selbst behandelt werden möchtest.\n' +
          '• 🚫 Kein Mobbing, Hass oder Diskriminierung – Rassismus, Sexismus, Homophobie, Transphobie oder andere Formen von Hass sind streng verboten.\n' +
          '• 💬 Kein Spam oder Flooding – Vermeide wiederholte Nachrichten, übermäßige Emojis oder sinnlose Inhalte.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Inhalte & Kommunikation**__\n' +
          '• 🔞 Keine NSFW-Inhalte – Keine pornografischen, sexuell expliziten oder gewalttätigen Inhalte.\n' +
          '• 🚨 Keine illegalen Inhalte – Keine Links zu Raubkopien, Drogen, Waffen oder anderen illegalen Themen.\n' +
          '• 📢 Keine Werbung ohne Erlaubnis – Server-Einladungen oder Werbung nur in dafür vorgesehenen Kanälen.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Datenschutz & Sicherheit**__\n' +
          '• 🔒 Schütze deine Daten – Gib keine persönlichen Informationen (Adresse, Passwörter etc.) preis.\n' +
          '• 🚫 Kein Doxxing – Veröffentliche keine privaten Informationen anderer Personen.\n' +
          '• 🤖 Vorsicht vor Phishing – Klicke keine verdächtigen Links und melde sie den Moderatoren.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Moderation & Konsequenzen**__\n' +
          '• ⚠️ Warnungen & Kicks – Bei Verstößen gibt es zunächst eine Warnung, bei Wiederholung einen Kick.\n' +
          '• 🚪 Bans – Bei schweren Verstößen (z. B. Hass, illegale Inhalte) folgt ein sofortiger Ban.\n' +
          '• 📩 Melde User – Nutze den Report-Kanal um ein Missverhalten eines Users zu melden.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Sonstiges**__\n' +
          '• 🔄 Unwissenheit schützt nicht vor Strafen.\n' +
          '• 💙 Discord ToS: https://discord.com/terms\n' +
          '• 💙 Discord Guidelines: https://discord.com/guidelines'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '⚠️ Mit dem Beitritt auf den Server akzeptierst du diese Regeln.'
        )
      )

    await interaction.reply({
      components: [rulesContainer],
      flags: MessageFlags.IsComponentsV2
    });
  }
});

client.on('interactionCreate', async (interaction) =>{
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'our-team')  {
    const ourTeamContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          'Our Team'
        )
      )
    await interaction.reply({
    components: [ourTeamContainer],
    flags: MessageFlags.IsComponentsV2
    });
  }
});


client.on('interactionCreate', async (interaction) =>{
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'bot-shop') {
    const botShopContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          'Bot Shop'
        )
      )
    await interaction.reply({
    components: [botShopContainer],
    flags: MessageFlags.IsComponentsV2
    });
  }
});
client.login(process.env.DISCORD_BOT_TOKEN);
