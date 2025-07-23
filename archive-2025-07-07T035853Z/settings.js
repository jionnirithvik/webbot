const fs = require('fs');
const chalk = require('chalk');

//——————————[ Owner Config ]——————————//

global.owner = ["13056978303"] // Additional Owner 
global.ownerUtama = "13056978303" // Change with your number
global.namaOwner = "Mrlit Andy" // Change with your name
global.email = "usaa6916@gmail.com" // Change with your email
 

//——————————[ Bot Config ]——————————//

global.botname = 'LazerBot 700' // Bot Name
global.versi = '700.1' // Version 
global.tempatDB = 'database.json' // Database

global.welcome = false
global.autoread = false
global.autoreadsw = false
global.anticall = false
global.antilink = false
global.autodownload = true


//——————————[ SocialMedia Config ]——————————//

global.web = "-"
global.linkSaluran = "https://whatsapp.com/channel/0029Vb5wvtY9mrGfcR8QTA46" // Your WhatsApp Channel Link (optional but don't leave it blank!)
global.idSaluran = "120363195304315@newsletter" // Your WhatsApp Channel ID (optional but don't leave it blank!)
global.nameSaluran = "LazerBot 700 BY Mrlit" // WhatsApp Channel Name (you can custom it whatever you want)


//——————————[ Sticker Watermark ]——————————//

global.packname = 'Sticker by:'
global.author = "Mrlit.a"


//——————————[ Apikey Config ]——————————// DON'T TOUCH IF DOESN'T KNOW WHAT IT IS!

global.apibot2 = "https://newapibot.rikishopreal.my.id"
global.apiSimpleBot = "newapi2025"
global.neoxr = "iamgay" // neoxr apikey


//——————————[ Media Config ]——————————//

global.img = "https://files.catbox.moe/kkk04u.jpg"
global.thumb =  [
    'https://files.catbox.moe/kkk04u.jpg',
    'https://files.catbox.moe/kkk04u.jpg',
    'https://files.catbox.moe/kkk04u.jpg',
    'https://files.catbox.moe/kkk04u.jpg',
    'https://files.catbox.moe/kkk04u.jpg',
    'https://files.catbox.moe/kkk04u.jpg',
    'https://files.catbox.moe/kkk04u.jpg'
]
global.vn = [
    'https://i.top4top.io/m_33982amwv0.mp3',
    'https://k.top4top.io/m_3398lc27s1.mp3',
    'https://l.top4top.io/m_33987plx32.mp3',
    'https://a.top4top.io/m_3398v29sy3.mp3',
    'https://b.top4top.io/m_3398ez4xe4.mp3',
    'https://c.top4top.io/m_3398h1c6n5.mp3',
    'https://d.top4top.io/m_33984hs9e6.mp3',
    'https://e.top4top.io/m_3398xk1qb7.mp3',
    'https://f.top4top.io/m_339817znt8.mp3',
    'https://g.top4top.io/m_33985tylr9.mp3'
]

//——————————[ Config Message ]——————————//

global.mess = {
	owner: "  \`</> [ Owner Only! ]\`\n- This Feature Is For Owner Only!",
	admin: "  \`</> [ Admin Only! ]\`\n- This Feature Is For Admins Only!",
	botAdmin: "  \`</> [ Bot Admin! ]\`\n- Bots Are Not Admins!",
	group: "  \`</> [ Group Only! ]\`\n- This Feature Is For Groups Only!",
	private: "  \`</> [ Private Only! ]\`\n- This Feature Is For Private Chat Only!",
	prem: "  \`</> [ Premium Only! ]\`\n- This Feature Is For Premium Users Only!",
	wait: 'Loading...',
	error: 'Error!',
	done: 'Done'
}

//——————————[ System ]——————————// DON'T TOUCH THIS

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});