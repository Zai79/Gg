const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("secret")
    .setDescription("إرسال رسالة سرية")
    .addUserOption(option =>
      option.setName("user").setDescription("الشخص اللي ترسل له الرسالة").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("message").setDescription("محتوى الرسالة").setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const msg = interaction.options.getString("message");

    const embed = new EmbedBuilder()
      .setTitle("🔒 رسالة مخفية")
      .setDescription(`لديك رسالة سرية من **${interaction.user.username}**`)
      .setColor("#b57bff");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`open_secret_${interaction.id}`)
        .setLabel("عرض الرسالة السرية 🔒")
        .setStyle(ButtonStyle.Secondary)
    );

    await user.send({ embeds: [embed], components: [row] }).catch(() => null);

    await interaction.reply({ content: "✔️ تم إرسال الرسالة المخفية", ephemeral: true });

    // نخزن الرسالة في لوق (نكمل هذي بعدين)
    client.secretMessages = client.secretMessages || {};
    client.secretMessages[interaction.id] = msg;
  },
};
