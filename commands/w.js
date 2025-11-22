const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('w')
    .setDescription('صورة بنت أنمي عشوائية'),

  async execute(interaction) {
    await interaction.deferReply();

    const res = await fetch('https://api.waifu.pics/sfw/waifu');
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setTitle('🌸 صورة بنت أنمي')
      .setImage(data.url)
      .setColor('#ff66b2');

    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('like_w')
        .setLabel('إعجاب 💖')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.editReply({ embeds: [embed], components: [btn] });
  },

  // ====== 🟣 هنا كود الإعجاب ======
  async button(interaction) {
    if (interaction.customId !== "like_w") return;

    const replies = [
      "ありがとう نيشان ✨💖! شكراً على الإعجاب يا أسطورة الأنمي!",
      "UwU شكراً على اللكة نيشان! 💗😳",
      "أريغاتووو! ✨ لمست زر الإعجاب مثل بطل شوجو! 💘",
      "كawaii منك والله 🌸💞! شكراً على الإعجاب يا نيشان!",
      "يا سلام! لمسة إعجاب أسطورية منك 😼🔥!"
    ];

    // اختيار رد عشوائي
    const msg = replies[Math.floor(Math.random() * replies.length)];

    await interaction.reply({
      content: msg,
      ephemeral: true // يظهر له فقط
    });
  }
};
