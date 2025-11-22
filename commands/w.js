const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
            .setTitle('💗 صورة بنت أنمي')
            .setImage(data.url)
            .setColor('#ff66b2');

        const btn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('like_w')
                .setLabel('إعجاب 👍')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.editReply({ embeds: [embed], components: [btn] });
    }
};
