const fetch = require('node-fetch');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('h')
        .setDescription('صورة ولد أنمي عشوائية'),

    async execute(interaction) {
        await interaction.deferReply();

        const res = await fetch('https://api.waifu.pics/sfw/neko'); 
        const data = await res.json();

        const embed = new EmbedBuilder()
            .setTitle('💙 صورة ولد أنمي')
            .setImage(data.url)
            .setColor('#0099ff');

        const btn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('like_h')
                .setLabel('إعجاب 👍')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.editReply({ embeds: [embed], components: [btn] });
    }
};
