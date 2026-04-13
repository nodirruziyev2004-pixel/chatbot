bot.command("quti", (ctx) => {
  const id = ctx.from.id;

  if (!users[id]) {
    users[id] = { coin: 100, freeBox: true };
  }

  // Bepul quti
  if (users[id].freeBox) {
    users[id].freeBox = false;
    return openBox(ctx, id, true);
  }

  // Coin tekshirish
  if (users[id].coin < 50) {
    return ctx.reply("❌ Quti ochish uchun 50 coin kerak");
  }

  users[id].coin -= 50;
  openBox(ctx, id, false);
});

// Quti logikasi
function openBox(ctx, id, isFree) {
  let rand = Math.random() * 100;

  let message = isFree
    ? "🎁 Bepul quti ochdingiz!\n\n"
    : "🎁 Quti ochdingiz!\n\n";

  // 50% coin
  if (rand < 50) {
    let coin = Math.floor(Math.random() * 700) + 100;
    users[id].coin += coin;
    return ctx.reply(message + `💰 Siz ${coin} coin yutdingiz!`);
  }

  // 20% pul
  else if (rand < 70) {
    let money = Math.floor(Math.random() * 4000) + 1000;
    return ctx.reply(message + `💵 Siz ${money} so‘m yutdingiz!`);
  }

  // 5% premium
  else if (rand < 75) {
    return ctx.reply(message + "💎 Tabriklaymiz! Telegram Premium yutdingiz!");
  }

  // 25% yutqazish
  else {
    return ctx.reply(message + "😢 Afsus, hech narsa chiqmadi");
  }
}
