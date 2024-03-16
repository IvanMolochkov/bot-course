const { log } = require("console");
const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require("./options.js")
const token = "7020795171:AAHandpNBqg56jx7g9m_53ZQJtggxFx-DNc";

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Я сейчас загадаю цифру от 0 до 9, а ты попробуй ее отгадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  log(chats[chatId])
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        `https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/1.webp`
      );
      return bot.sendMessage(chatId, `Добрый день`);
    }
    if (text === "/info") {
      if (msg.from.last_name) {
        return bot.sendMessage(
          chatId,
          `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
        );
      } else {
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
      }
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю");
  });
  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению, ты не отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
