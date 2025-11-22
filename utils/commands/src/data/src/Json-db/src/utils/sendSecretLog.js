const { EmbedBuilder } = require("discord.js");

/**
 * إرسال لوق الرسالة السرية إلى قناة اللوق
 * @param {Client} client
 * @param {Object} data
 */
module.exports = async function sendSecretLog(client, data) {

    const LOG_CHANNEL_ID = "ضع_ايدي_قناة_اللوق"; // ← غيّره

    const channel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle("🔒 Secret Message Logged")
        .addFields(
            { name: "المرسل:", value: `<@${data.sender}>`, inline: true },
            { name: "المستلم:", value: `<@${data.receiver}>`, inline: true },
            { name: "الرسالة:", value: data.message || "غير متوفرة" }
        )
        .setColor("#2f3136")
        .setTimestamp();

    channel.send({ embeds: [embed] });
};
