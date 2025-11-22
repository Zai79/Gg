
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("secret")
        .setDescription("إرسال رسالة سرية لشخص")
        .addUserOption(o =>
            o.setName("target")
                .setDescription("الشخص الذي سترسل له الرسالة")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("message")
                .setDescription("محتوى الرسالة السرية")
                .setRequired(true)
        ),

    async execute(interaction) {
        const sender = interaction.user;
        const target = interaction.options.getUser("target");
        const secretMessage = interaction.options.getString("message");

        // الإمبيد الظاهر للجميع
        const embed = new EmbedBuilder()
            .setTitle("🔒 رسالة مخفية")
            .setDescription(
                `لديك رسالة سرية!\n\n` +
                `📩 **من:** <@${sender.id}>\n` +
                `👤 **إلى:** <@${target.id}>\n\n` +
                `اضغط الزر أدناه لعرض الرسالة.`
            )
            .setColor("#9b59b6");

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`secret-${sender.id}-${target.id}`)
                .setLabel("🔒 عرض الرسالة")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [button]
        });

        // حفظ الرسالة داخل الأوبجكت (بدون قاعدة بيانات)
        interaction.client.secretMessages ??= {};
        interaction.client.secretMessages[`secret-${sender.id}-${target.id}`] = secretMessage;
    },

    // معالجة الزر
    async button(interaction) {
        const [_, senderId, targetId] = interaction.customId.split("-");

        // السماح فقط للمرسل أو المستلم
        if (interaction.user.id !== senderId && interaction.user.id !== targetId) {
            return interaction.reply({
                content: "❌ الرسالة مو لك يا غبي 🤓",
                ephemeral: true
            });
        }

        // جلب الرسالة
        const msg = interaction.client.secretMessages?.[interaction.customId];

        if (!msg) {
            return interaction.reply({
                content: "⚠️ ما لقيت الرسالة! يمكن تم إعادة تشغيل البوت.",
                ephemeral: true
            });
        }

        return interaction.reply({
            content: `💬 **رسالتك:**\n${msg}`,
            ephemeral: true
        });
    }
};
