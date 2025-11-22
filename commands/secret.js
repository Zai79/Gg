const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('secret')
        .setDescription('إرسال رسالة مخفية لشخص أو عدة أشخاص')
        .addStringOption(option =>
            option.setName('الرسالة')
                .setDescription('الرسالة السرية')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('شخص1')
                .setDescription('الشخص المسموح له'))
        .addUserOption(option =>
            option.setName('شخص2')
                .setDescription('شخص إضافي'))
        .addIntegerOption(option =>
            option.setName('عدد')
                .setDescription('عدد الأشخاص الأوائل الذين يمكنهم فتح الرسالة')),

    async execute(interaction) {

        // البيانات
        const msg = interaction.options.getString('الرسالة');
        const user1 = interaction.options.getUser('شخص1');
        const user2 = interaction.options.getUser('شخص2');
        const countLimit = interaction.options.getInteger('عدد') || 0;

        // حفظ الأشخاص المسموح لهم
        const allowedUsers = [];
        if (user1) allowedUsers.push(user1.id);
        if (user2) allowedUsers.push(user2.id);

        // Embed عام
        const embed = new EmbedBuilder()
            .setTitle("رسالة مخفية 🔒")
            .setDescription(`لديك رسالة سرية!  
اضغط الزر أدناه لعرض الرسالة.`)
            .setColor("#7a00ff");

        // زر العرض
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("open_secret")
                .setLabel("عرض الرسالة 🔒")
                .setStyle(ButtonStyle.Primary)
        );

        // إرسال الرسالة العامة
        const sent = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        // حفظ بيانات الرسالة في ذاكرة مؤقتة
        global.secretData = global.secretData || {};
        global.secretData[sent.id] = {
            msg,
            allowedUsers,
            countLimit,
            opened: []
        };
    }
};
