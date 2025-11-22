const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("h")
    .setDescription("يرسل صورة ولد أنمي عشوائية"),

  async execute(interaction) {
    const images = [
      "https://i.imgur.com/y1.jpg",
      "https://i.imgur.com/y2.jpg",
      "https://i.imgur.com/y3.jpg"
    ];

    const random = images[Math.floor(Math.random() * images.length)];

    const embed = new EmbedBuilder()
      .setTitle("💙 صورة ولد أنمي")
      .setImage(random)
      .setColor("#6eb6ff");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("vote_h")
        .setLabel("👍 إعجاب")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
