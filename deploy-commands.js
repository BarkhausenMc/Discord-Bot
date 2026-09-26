require('dotenv').config();

const {
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Schickt das Embed mit den Server Regeln in den Channel.')
        .toJSON(),

    new SlashCommandBuilder()
        .setName('our-team')
        .setDescription('Schickt das Embed mit der Team Vorstellung in den Channel.')
        .setJSON(),
];

const rest = new REST({ version: '10' })
  .setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands
      }
    );

    console.log('Guild Slash Command registriert.');
  } catch (error) {
    console.error(error);
  }
})();
