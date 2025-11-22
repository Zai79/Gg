const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("catch")
    .setDescription("تصيد البوكس إذا ظهر"),

  async execute(interaction) {
    const boxes = ["🎁 صندوق عادي", "🔵 صندوق نادر", "🟣 صندوق أسطوري", "⚡ Flash Rewards"];
    const box = boxes[Math.floor(Math.random() * boxes.length)];

    const embed = new EmbedBuilder()
      .setTitle("🎉 اصطدت صندوق!")
      .setDescription(`لقد حصلت على: **${box}**`)
      .setColor("#ffd86b");

    await interaction.reply({ embeds: [embed] });
  }
};
