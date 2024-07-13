const TelegramBot = require('node-telegram-bot-api');
const token = '7132897002:AAE2VjzLmRzlWHgASe9xoxFK6y7w4shWIbE'; 
const bot = new TelegramBot(token, { polling: true });

const customers = []; 

// Function to send a message
const sendMessage = async (chatId, text) => {
  try {
    await bot.sendMessage(chatId, text);
    console.log(`Message sent to chat id ${chatId}`);
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
  }
};

// Listen for messages from users to register them
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const customer = customers.find(c => c.id === chatId);
  if (!customer) {
    customers.push({ id: chatId, name: msg.from.first_name });
    bot.sendMessage(chatId, 'You have been registered for reminders.');
  }
});

// Function to send reminders to all registered customers
const sendReminders = () => {
  customers.forEach(customer => {
    const message = `Hello ${customer.name}, this is your reminder! Kindly pay your bill at : https://rzp.io/l/rupeereminder101`;    sendMessage(customer.id, message);
  });
};

// Send reminders every day at a specific time
setInterval(sendReminders, 1 * 60 * 1000); 

console.log('Bot is running and waiting for messages...');
