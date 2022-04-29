import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import 'dotenv/config';
// TOKEN & VARIABLES
const emoji = {
    Clouds: "☁️",
    Rain    : "🌧️",
    Drizzle: "🌧️",
    Clear: "🌤",
    Snow: "❄",
    Thunderstorm: "🌩️",
    Mist: "🌫️",
    Tornado: "🌪",
}
const bot = new Telegraf(process.env.TOKEN); // Telegram Bot API. @BotFather
const weather = process.env.WEATHER; // used Open Weather Map
const buttons = [
    [{ text: "Toshkent" }, { text: "Namangan" }, { text: "Samarqand" }],
    [{ text: "Andijon" }, { text: "Nukus" }, { text: "Farg'ona" }],
    [{ text: "Buxoro" }, { text: "Qarshi" }, { text: "Kokand" }],
    [{ text: "Marg'ilon" }, { text: "Angren" }, { text: "Termiz" }],
    [{ text: "Jizzah" }, { text: "Chirchiq" }, { text: "Navoiy" }],
    [{ text: "Urganch" }, { text: "Shahrisabz" }, { text: "Olmaliq" }],
];

// FUNTION
function toCapit(data) {
    let words = data.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join(" ");
    return words
}
function generateEmoji(stats) {

    for (let i in emoji) {
        if (i == stats) {
            return emoji[i]
        }  
    }
    return emoji["Mist"]
}
async function getData(city) {
    let api = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather}`); // Get Json Data
    let res = await api.json(); // 
    // result variable equal tp need data for use it
    let result = await [res.weather[0].main, res.main.temp - 273, res.main.humidity, res.wind.speed, res.main.temp_min - 273, res.main.temp_max - 273, city]
    return await result;
}
function sendMessage(arr) {
    const status = arr[0] // Get weather
    const degree = Math.floor(arr[1]); // Get degree
    const humidity = arr[2];  // Get humidity
    const speed = arr[3]; // Get Wind Speed
    const min = Math.round(arr[4])  // Get min degree 
    const max = Math.round(arr[5]) // Get max degree
    const loc = arr[6] // Get Location
    return `
📍 Location: ${loc}, Uz
${generateEmoji(status)} Weather: ${toCapit(status)} 
🌡 Degrees: ${min === max ? max : degree}°
💦 humidity: ${humidity}%
💨 Wind Speed: ${speed} m/s 

<i>Created by @AsqarArslonov</i>
    ` 
}
// BOT START && ON
bot.start(ctx => ctx.reply("Salom bu botda siz ob havo haqida malumot ololasiz", {reply_markup:{resize_keyboard: true, keyboard:buttons}}))

bot.on("text",async (ctx) => {
    const text = ctx.update.message.text;
    for (let i = 0; i < buttons.length; i++){ 
        for (let a = 0; a < buttons[i].length; a++){        
            if (buttons[i][a].text.includes(text)) {
                ctx.replyWithHTML(sendMessage(await getData(text)))
                return ;
            }
        }
    }
    ctx.replyWithHTML(`
Sorry, Siz izlagan shahar topilmadi

<i>P.S Siz faqat O'zbekiston hududidagi shaharlar haqida malumot ololasiz!</i>`)
})
 
 
// BOT LAUNCH
bot.launch()