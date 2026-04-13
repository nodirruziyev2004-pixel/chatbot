const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// DATABASE
let users = {};
let payments = {};

const ADMIN_ID = 123456789; // <-- o'zingni ID

// START
bot.start((ctx) => {
  const id = ctx.from.id;
  const name = ctx.from.first_name;

  if (!users[id]) {
    users[id] = {
      coin: 100,
      freeBox: true,
      invited: 0
    };
  }

  ctx.reply(
`Salom, ${name}! 👋

🎮 Premium Box Bot`,
    Markup.keyboard([
      ["🎁 Omadli sovg'a", "💰 Balans"],
      ["🎰 777 Slot", "🎲 Zar o'yini"],
      ["👥 Taklif qilish", "💳 Coin sotib olish"],
      ["👨‍💼 Admin", "📞 Bog'lanish"]
    ]).resize()
  );
});


// BALANS
bot.hears("💰 Balans", (ctx) => {
  const id = ctx.from.id;
  ctx.reply(`💰 Balans: ${users[id]?.coin || 0} coin`);
});


// 🎁 OMADLI QUTI (ANIMATED + FREE)
bot.hears("🎁 Omadli sovg'a", async (ctx) => {
  const id = ctx.from.id;

  if (!users[id]) users[id] = { coin: 100, freeBox: true };

  let isFree = users[id].freeBox;

  if (!isFree) {
    if (users[id].coin < 50) return ctx.reply("❌ 50 coin kerak");
    users[id].coin -= 50;
  } else {
    users[id].freeBox = false;
  }

  let msg = await ctx.reply("🎁 Quti ochilmoqda...");
  await new Promise(r => setTimeout(r, 1000));

  await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, "🎲 Natija aniqlanmoqda...");
  await new Promise(r => setTimeout(r, 1500));

  let r = Math.random() * 100;
  let result = "";

  if (r < 50) {
    let coin = Math.floor(Math.random() * 700) + 100;
    users[id].coin += coin;
    result = `💰 +${coin} COIN`;
  }
  else if (r < 70) result = "💵 1000 - 5000 so'm";
  else if (r < 75) result = "💎 Telegram Premium";
  else result = "😢 Hech narsa";

  await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `🎁 NATIJA:\n\n${result}`);
});


// 🎰 SLOT
bot.hears("🎰 777 Slot", (ctx) => {
  let r = Math.random();

  if (r < 0.2) {
    ctx.reply("🍒🍒🍒 JACKPOT +500 coin!");
  } else {
    ctx.reply("😢 Yutqazdingiz");
  }
});


// 🎲 ZAR
bot.hears("🎲 Zar o'yini", (ctx) => {
  let u = Math.floor(Math.random() * 6) + 1;
  let b = Math.floor(Math.random() * 6) + 1;

  ctx.reply(`🎲 Siz: ${u} | Bot: ${b}`);
});


// 👥 REFERRAL
bot.hears("👥 Taklif qilish", (ctx) => {
  const id = ctx.from.id;

  const link = `https://t.me/${ctx.botInfo.username}?start=${id}`;

  ctx.reply(`👥 Taklif qiling:\n\n${link}`);
});


// 💳 COIN BUY REQUEST
bot.hears("💳 Coin sotib olish", (ctx) => {
  const id = ctx.from.id;

  ctx.reply(
`💳 COIN SOTIB OLISH

💳 Karta: 9860 0101 2668 4322

📸 To'lov qilib CHEK yuboring`,
  );

  payments[id] = true;
});


// 📞 ADMIN CONTACT
bot.hears("📞 Bog'lanish", (ctx) => {
  ctx.reply("📩 Admin: @ruziyevv_21\nReklama va takliflar uchun yozing");
});


// 👨‍💼 ADMIN PANEL
bot.hears("👨‍💼 Admin", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply("❌ Yo'q");

  ctx.reply(
`👨‍💼 ADMIN PANEL

/users - statistik
/broadcast - xabar`
  );
});


// 📊 USERS
bot.command("users", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  ctx.reply(JSON.stringify(users, null, 2));
});


// 📢 BROADCAST
bot.command("broadcast", async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  let text = ctx.message.text.replace("/broadcast", "");

  Object.keys(users).forEach(id => {
    bot.telegram.sendMessage(id, `📢 ADMIN XABAR:\n\n${text}`);
  });
});


// 📥 PAYMENT APPROVAL (manual demo)
bot.command("approve", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  ctx.reply("✅ To'lov tasdiqlandi (coin qo'shish logikasi qo'shiladi)");
});

bot.command("reject", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  ctx.reply("❌ To'lov rad etildi");
});

bot.launch();

console.log("🚀 FULL BOT RUNNING");
async function checkChannel(ctx) {
  try {
    const member = await ctx.telegram.getChatMember("@tgpremiumboxbot_cannel", ctx.from.id);

    if (["member", "administrator", "creator"].includes(member.status)) {
      return true;
    }
  } catch (e) {}

  return false;
}

bot.hears("📺 Kanalga azo bo'lish", async (ctx) => {
  const id = ctx.from.id;

  const joined = await checkChannel(ctx);

  if (!users[id]) users[id] = { coin: 100, withdraw: 0 };

  if (joined) {
    if (!users[id].channelBonus) {
      users[id].coin += 300;
      users[id].channelBonus = true;
      return ctx.reply("🎉 Sizga +300 coin berildi!");
    } else {
      return ctx.reply("⚠ Siz allaqachon bonus olgansiz");
    }
  } else {
    return ctx.reply("❌ Avval kanalga a’zo bo‘ling:\nhttps://t.me/tgpremiumboxbot_cannel");
  }
});
