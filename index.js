const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// USER DATA (temporary memory)
let users = {};

// START MENU
bot.start((ctx) => {
  const id = ctx.from.id;
  const name = ctx.from.first_name;

  if (!users[id]) {
    users[id] = { coin: 100, freeBox: true };
  }

  ctx.reply(
`Salom, ${name}! 👋

🎮 Premium Box Botga xush kelibsiz!

Bu botda siz:
🎁 Omadli quti ochib coin va pul yutasiz
🎯 Kunlik bonus olasiz
🎰 Slot, Zar, Mines o'ynaysiz
👥 Do'st taklif qilib coin olasiz

Pastdagi menyudan tanlang 👇`,
    Markup.keyboard([
      ["🎁 Omadli sovg'a", "💰 Balans"],
      ["🎯 Kunlik bonus", "👥 Taklif qilish"],
      ["🎰 777 Slot", "🎲 Zar o'yini"],
      ["⛏ Mines", "💳 Coin sotib olish"],
      ["📜 Qoidalar", "👨‍💼 Admin"]
    ]).resize()
  );
});

// BALANS
bot.hears("💰 Balans", (ctx) => {
  const id = ctx.from.id;
  if (!users[id]) users[id] = { coin: 100, freeBox: true };

  ctx.reply(`💰 Sizning balansingiz: ${users[id].coin} coin`);
});

// BONUS
bot.hears("🎯 Kunlik bonus", (ctx) => {
  const id = ctx.from.id;
  if (!users[id]) users[id] = { coin: 100, freeBox: true };

  users[id].coin += 50;
  ctx.reply("🎁 Siz 50 coin kunlik bonus oldingiz!");
});

// OMADLI QUTI
bot.hears("🎁 Omadli sovg'a", (ctx) => {
  const id = ctx.from.id;
  if (!users[id]) users[id] = { coin: 100, freeBox: true };

  let rand = Math.random() * 100;

  let msg = "🎁 Quti ochildi!\n\n";

  // 50% coin
  if (rand < 50) {
    let coin = Math.floor(Math.random() * 700) + 100;
    users[id].coin += coin;
    return ctx.reply(msg + `💰 Siz ${coin} coin yutdingiz!`);
  }

  // 20% pul (text)
  else if (rand < 70) {
    let money = Math.floor(Math.random() * 4000) + 1000;
    return ctx.reply(msg + `💵 Siz ${money} so'm yutdingiz!`);
  }

  // 5% premium
  else if (rand < 75) {
    return ctx.reply(msg + "💎 Tabriklaymiz! Telegram Premium yutdingiz!");
  }

  // 25% lose
  else {
    return ctx.reply(msg + "😢 Afsus, hech narsa chiqmadi");
  }
});

// SLOT (oddiy)
bot.hears("🎰 777 Slot", (ctx) => {
  let r = Math.floor(Math.random() * 3);

  if (r === 0) ctx.reply("🎰 777 | 777 | 777 🎉 JACKPOT!");
  else ctx.reply("🎰 123 | 456 | 789 😢 Yutqazdingiz");
});

// ZAR
bot.hears("🎲 Zar o'yini", (ctx) => {
  let user = Math.floor(Math.random() * 6) + 1;
  let botRoll = Math.floor(Math.random() * 6) + 1;

  if (user > botRoll) ctx.reply(`🎲 Siz ${user}, Bot ${botRoll} — Siz yutdingiz 🎉`);
  else if (user < botRoll) ctx.reply(`🎲 Siz ${user}, Bot ${botRoll} — Siz yutqazdingiz 😢`);
  else ctx.reply(`🎲 Durrang! (${user})`);
});

// RULES
bot.hears("📜 Qoidalar", (ctx) => {
  ctx.reply(
`📜 QOIDALAR:

🎁 Quti — random yutuq
💰 Coinlar — ichki valyuta
❌ Cheat qilish taqiqlanadi
⚠ Bot test rejimda`
  );
});

// PLACEHOLDER
bot.hears(["👥 Taklif qilish", "💳 Coin sotib olish", "⛏ Mines", "👨‍💼 Admin"], (ctx) => {
  ctx.reply("🚧 Bu bo'lim tez orada qo'shiladi...");
});

bot.launch();
