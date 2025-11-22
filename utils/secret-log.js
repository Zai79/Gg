const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "log-secret-message",

    async log(client, senderId, receiverId, content) {

        // 🔒 هنا تحط ID قناة اللوق بنفسك
        const logChannelId = "1441647248684617749"; // ← غيّر هذا فقط

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle("📩 لوق رسالة مخفية")
            .setColor("#ff4d6d")
            .addFields(
                { name: "👤 المرسل", value: `<@${senderId}>`, inline: true },
                { name: "🎯 المستلم", value: `<@${receiverId}>`, inline: true },
                {
                    name: "💬 محتوى الرسالة",
                    value: `\`\`\`${content}\`\`\``
                }
            )
            .setTimestamp(Date.now());

        logChannel.send({ embeds: [embed] });
    }
};
