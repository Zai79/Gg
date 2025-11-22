require("dotenv").config();
const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
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

client.commands = new Collection();

// تحميل أوامر السلاش تلقائياً
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`🔥 Logged in as ${client.user.tag}`);

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);

  if (!channel) {
    console.log("⚠️ الروم غير موجود أو الآيدي غلط!");
    return;
  }

  channel.send("✅ البوت اشتغل بنجاح!").catch(console.error);
});

// ===================== حدث السلاش =====================
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: "❌ صار خطأ أثناء تنفيذ الأمر!",
      ephemeral: true
    });
  }
});

// ===================== حدث الأزرار =====================
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const id = interaction.customId;

  // ---------------- زر الرسائل السرية ----------------
  if (id.startsWith("secret")) {
    const command = client.commands.get("secret");
    if (command?.button) return command.button(interaction);
  }

  // ---------------- زر الإعجاب في w ----------------
  if (id === "like_w") {
    const command = client.commands.get("w");
    if (command?.button) return command.button(interaction);
  }
});

// ===================== تسجيل أوامر السلاش =====================
(async () => {
  try {
    const { REST, Routes } = require("discord.js");

    const commands = [];
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("✔️ الأوامر تم تسجيلها تلقائياً!");
  } catch (error) {
    console.error("❌ خطأ أثناء تسجيل الأوامر:", error);
  }
})();

client.login(process.env.TOKEN);
