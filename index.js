require("dotenv").config();
const { Client, GatewayIntentBits, Collection, Partials, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.Channel]
});

// ======================================================
// تحميل الأوامر
// ======================================================
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ======================================================
// تشغيل البوت
// ======================================================
client.on("ready", () => {
  console.log(`🔥 Logged in as ${client.user.tag}`);

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (channel) {
    channel.send("✅ البوت اشتغل بنجاح!").catch(() => {});
  } else {
    console.log("⚠️ CHANNEL_ID غلط أو غير موجود");
  }
});

// ======================================================
// أوامر السلاش
// ======================================================
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      interaction.reply({
        content: "❌ صار خطأ أثناء تنفيذ الأمر!",
        ephemeral: true
      });
    }
  }
});

// ======================================================
// أزرار (w + secret)
// ======================================================
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const id = interaction.customId;

  // زر الرسائل السرية
  if (id.startsWith("secret")) {
    const secretCmd = client.commands.get("secret");
    if (secretCmd?.button) return secretCmd.button(interaction);
  }

  // زر الإعجاب في w
  if (id === "like_w") {
    const wCmd = client.commands.get("w");
    if (wCmd?.button) return wCmd.button(interaction);
  }
});

// ======================================================
// تسجيل أوامر السلاش تلقائياً
// ======================================================
(async () => {
  try {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    const commandsJSON = commandFiles.map(file => {
      const cmd = require(`./commands/${file}`);
      return cmd.data.toJSON();
    });

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commandsJSON }
    );

    console.log("✔️ تم تسجيل الأوامر بنجاح!");
  } catch (error) {
    console.error("❌ خطأ أثناء تسجيل الأوامر:", error);
  }
})();

client.login(process.env.TOKEN);
