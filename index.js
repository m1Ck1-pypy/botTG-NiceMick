require('dotenv').config();

const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '5819285179:AAE-uVB5sfzroA7nCJH4TO0YTBgmmsmWcDQ';

const bot = new TelegramApi(token, { polling: true });

const chart = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю цифру от 0 до 9, попробуй угадать 😺`);
    const randomNumber = Math.floor(Math.random() * 10); // цифра от 0 до 9
    chart[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}
 
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие!' },
        { command: '/info', description: 'Информация о пользователе' },
        { command: '/game', description: 'Отгадать рандомную цифру' },
    ])

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/b/banditvk/banditvk_006.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать в нашего бота!');
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data; // кнопка, на которую нажали
        const chatId = msg.message.chat.id; // id чата
        
        if (data === '/again') {
            return startGame(chatId);
        }

        if (+data === chart[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chart[chatId]}`, againOptions) 
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chart[chatId]}`, againOptions) 
        }
    })
}

start()