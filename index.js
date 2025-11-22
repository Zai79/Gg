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
    console.log(`🔰 Logged in as ${client.user.tag}`);

    // جلب الروم من خلال الـ CHANNEL_ID
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);

    if (!channel) {
        console.log("⚠️ الروم غير موجود أو الايدي غلط!");
        return;
    }

    // إرسال رسالة عند تشغيل البوت
    channel.send("✅ البوت اشتغل بنجاح!").catch(console.error);
});

// تفعيل الأوامر
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    return interaction.reply({ content: "❌ صار خطأ أثناء تنفيذ الأمر!", ephemeral: true });
  }
});

client.login(process.env.TOKEN);
