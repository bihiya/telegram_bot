const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
// Replace 'YOUR_BOT_TOKEN' with the token you obtained from BotFather
const bot = new TelegramBot('6556037691:AAGXjquR1wW4FO1Ebn4jyZ5VwjMHluahUSE', { polling: true });

// Function to load user data from a JSON file
function loadUserData() {
    try {
        const data = fs.readFileSync('user_data.json');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Function to save user data to a JSON file
function saveUserData(userData) {
    fs.writeFileSync('user_data.json', JSON.stringify(userData, null, 2));
}
// Function to log user messages and bot replies
function logMessageAndReply(userId, userMessage, botReply,msg) {
    // Load user data
    let userData = loadUserData();

    // Initialize user information if not already set
    if (!userData[userId]) {
        userData[userId] = {
            user_info: {
                id: userId,
                is_bot: false, 
                first_name: msg.from.first_name,
                last_name: msg.from.last_name, 
                username: msg.from.username, 
                language_code: msg.from.language_code,
            },
            messages: [],
        };
    }
    const timestamp = Date.now();
    const formattedTimestamp = new Date(timestamp).toLocaleString();
    // Log user message and bot reply
    userData[userId].messages.push({
        user_message: userMessage,
        bot_reply: botReply,
       timestamp: formattedTimestamp,
    });

    // Save updated user data
    saveUserData(userData);
}
// List of clickable suggestion buttons
const suggestionButtons = [
    [{ text: 'Tell me about your hobbies.' }],
    [{ text: "What's your favorite movie?" }],
    [{ text: 'Do you have any travel plans?' }],
    [{ text: 'Birthday' }],
    [{ text: 'What do you like to do in your free time?' }],
    [{ text: 'Tell me about a memorable experience you\'ve had.' }],
    // Add more suggestion buttons here
  ];
// Function to send a clickable suggestion keyboard to the user
function sendSuggestionKeyboard(chatId) {
    const keyboard = {
      keyboard: suggestionButtons,
      resize_keyboard: true,
      one_time_keyboard: true,
    };
    bot.sendMessage(chatId, 'Choose a question: or type your own Que:', { reply_markup: keyboard });
  }

// Handle user data and logging
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.toLowerCase();
    const userId = msg.from.id;
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name;

    // Concatenate the first and last names to create the username
    const username = `${firstName} ${lastName}`;
    let replyText="";

    const responses = {
        '/start': 'Hello! I am a bot who knows everything about Lav Gupta. Ask questions like "gf kaun hai?", "job kya hai?", "dob kya hai?", "home kaha hai?", "insta kya hai?" and more.',
        '/help': 'You can use this bot to know about Lav Gupta.',
        'gf| girl friend|girlfriend': 'Currently single. :)',
        'hobby|hobbies|free time':'Travelling|Cooking|Coding',
        'movie':'my favourite movie is DDLJ',
        'travel':'i want to travel foreign countries',
        'dob|date of birth|birthday|age': 'Born on 12th Feb 1998.',
        'home|village|city': 'From Bihiya, Bihar.',
        'address':'Bihiya,Bihar',
        'friend|best friend':'too many',
        'job|kaam': 'Software Engineer at Versa Networks.',
        'salary|package': 'Salary is in 6 digits per month.',
        'email|emails': 'Email addresses are lavguptabihiya@gmail.com and lav.1si16is027@gmail.com.',
        'phone|mobile|number': 'Mobile number is 9431032319.',
        'linkedin|linked in': 'LinkedIn: https://linkedin.com/in/lav-gupta-8b401138',
        'portfolio|about yourself|website': 'Portfolio: https://gupta-portfolio.web.app/',
        'summary': 'Summary: Software Engineer working in the networking computer industry. Skilled in REACTJS, Redux, HTML5, CSS3, Javascript.',
        'experience': 'Experience:\n' +
            'Software Engineer at Versa Networks\n' +
            'Jan 2020 - Aug 2020 (8 months) internship\n' +
            'Sep 2020 - Present  full time\n' +
            'Roles and Responsibilities:\n' +
            '• Supervised a team of software developers to create Versa Titan User Interface with a wide range of networking and security services through a cloud-managed platform, making it easy to deliver managed IT branch services to your customers.\n' +
            '• Collaborated with business stakeholders and teams to create and optimize versa Titan project interface in REACTJS, REDUX.',
        'education': 'Education:\n' +
            'Siddaganga Institute of Technology, TUMKUR\n' +
            'Bachelor of Engineering - BE, Information Science\n' +
            '2016 - 2020',
        'certification': 'Licenses & Certifications:\n' +
            '1. Ethical Hacking course - Udemy\nUC-K4NX9DQE\n' +
            '2. Database Design and Management - Udemy\nUC-LI6EK5V5\n' +
            '3. React for Web Designers - LinkedIn\n' +
            '4. React Hooks - LinkedIn\n' +
            '5. Modern HTML & CSS From The Beginning (Including Sass) - Udemy\nUC-abe1938b-3ef2-4a23-8f4d-4ee915c7a88e\n' +
            '6. Programming in HTML5 with JavaScript and CSS3 - SoloLearn\n3308967-1024\n' +
            '7. JavaScript - HackerRank\nd33d257ad0ca\n' +
            '8. React Js - HackerRank\nf86d5022f520',
        'skill': 'Skills:\n' +
            'React.js • HTML • JavaScript • Data Structures • Web Design • React Hooks • C++ • C (Programming Language) • Java • Unix',
        'social media': 'Here are Lav Gupta\'s social media profiles:\n' +
            'Facebook: https://www.facebook.com/bihiya\n' +
            'Instagram: https://www.instagram.com/_unknown_balak_/\n' +
            'LinkedIn: https://www.linkedin.com/in/lavguptabihiya/',
        'photo': 'https://scontent.fblr8-1.fna.fbcdn.net/v/t1.18169-9/12316188_911667118925314_8956269900071000622_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=cOTVPm8cTT4AX8y5Cyw&_nc_ht=scontent.fblr8-1.fna&oh=00_AfAGiIGWDCF5nejQAlDcdbOByW_aMmx4Zkau_tfLnkTCng&oe=65295252'
    };
    if (['hi', 'hello', 'hey'].some(greeting => messageText.includes(greeting))) {
        if (username) {
            replyText = `Hello, @${username}! How can I assist you today?`;
        } else {
            replyText = 'Hello! How can I assist you today?';
        }
        // Send clickable suggestion buttons
        setTimeout(() => { sendSuggestionKeyboard(chatId)},500)
    } else {
    for (const keywords in responses) {
        const keywordArray = keywords.split('|');
        let matchFound = false; // Flag to track if a match is found
        for (const keyword of keywordArray) {
            if (messageText.includes(keyword)) {
                replyText = responses[keywords];
                matchFound = true; // Set the flag to true when a match is found
                break; // Exit the loop if a match is found
            }
        }
        if (matchFound) {
            break; // Exit the outer loop if a match is found
        }
    }
}
    
    // Send the replyText if it's not empty
    if (replyText !== '') {
        bot.sendMessage(chatId, replyText);
    } else {
        bot.sendMessage(chatId, 'I do not understand your message.');
    }
     // Log the entire conversation
       logMessageAndReply(userId, messageText, replyText,msg);
    
    });
