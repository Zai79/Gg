const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("w")
    .setDescription("يرسل صورة بنت أنمي عشوائية"),

  async execute(interaction) {
    const images = [
      "https://i.imgur.com/x1.jpg",
      "https://i.imgur.com/x2.jpg",
      "https://i.imgur.com/x3.jpg"
    ];

    const random = images[Math.floor(Math.random() * images.length)];

    const embed = new EmbedBuilder()
      .setTitle("💗 صورة بنت أنمي")
      .setImage(random)
      .setColor("#ff7bd3");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("vote_w")
        .setLabel("👍 إعجاب")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
