
require('./settings');
const fs = require('fs');
const pino = require('pino');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const readline = require('readline');
const figlet = require('figlet');
const CFonts = require('cfonts');
const gradient = require('gradient-string');
const FileType = require('file-type');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const { Boom } = require('@hapi/boom');
const NodeCache = require('node-cache');
const PhoneNumber = require('awesome-phonenumber');
const { default: WAConnection, jidDecode, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestWaWebVersion, proto, PHONENUMBER_MCC, getAggregateVotesInPollMessage } = require('@whiskeysockets/baileys');


const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const { color } = require('./lib/color.js');

const kuroinput = (query) => new Promise(resolve => rl.question(query, resolve));
const DataBase = require('./src/database');
const database = new DataBase();
(async () => {
	const loadData = await database.read()
	if (loadData && Object.keys(loadData).length === 0) {
		global.db = {
			users: {},
			game: {},
			groups: {},
			database: {},
			settings : {}, 
			...(loadData || {}),
		}
		await database.write(global.db)
	} else {
		global.db = loadData
	}
	
process.on('uncaughtException', logError);
process.on('unhandledRejection', logError);

	function logError(err) {
  const now = new Date();
  const tanggal = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const jam = now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour12: false });

  const garisAtas = chalk.hex('#FF6666')('═'.repeat(60));
  const garisBawah = chalk.hex('#FFB6C1')('─'.repeat(60));
  const merahTebal = chalk.hex('#FF0000').bold;
  const putih = chalk.hex('#FFFFFF');
  const terang = chalk.hex('#FFFF33');

  console.log(`\n${garisAtas}`);
  console.log(chalk.bgHex('#B22222').hex('#FFFFFF').bold('❌ AN ERROR OCCURRED'));
  console.log(`${putih('Date :')} ${putih(tanggal)}`);
  console.log(`${putih('Time     :')} ${terang(jam)}`);
  console.log(`${putih('Message   :')} ${merahTebal(err.message || err)}`);
  console.log(`${putih('Stack   :')}`);
  console.log(chalk.hex('#FFA07A')(err.stack || 'Stack not available'));
  console.log(garisBawah);
}
	
	setInterval(async () => {
		if (global.db) await database.write(global.db)
	}, 30000)
})();

const { GroupUpdate, GroupParticipantsUpdate, MessagesUpsert, Solving, initializer } = require('./src/message');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/function');

async function getPhoneNumber() {
    console.clear();
    console.log(gradient.instagram(figlet.textSync("LazerDim", { font: "ANSI Shadow" })))
    console.log(chalk.yellowBright('\nEnter your WhatsApp number to get the pairing code.'));
    console.log(chalk.cyanBright('Example: 1212xxxx'));

    const input = await kuroinput(chalk.blue('\n➤ WhatsApp Number: '));
    let phoneNumber = input.replace(/[^0-9]/g, '');

    if (!/^[1-9][0-9]{7,14}$/.test(phoneNumber)) {
        console.log(chalk.bgRed.white('\n[ERROR] Invalid number. Must start with country code and be at least 8 digits long!'));
        return await getPhoneNumber();
    }

    return phoneNumber;
}

async function startingBot(pairingCode) {
	const { state, saveCreds } = await useMultiFileAuthState('session');
console.log(chalk.yellowBright(pairingCode 
  ? '➤ Using the Pairing Code method (number and password)' 
  : '➤ Using the QR Code method. Scan the QR from the terminal...'));
	const { version } = await fetchLatestWaWebVersion()
	const msgRetryCounterCache = new NodeCache()
	
	const zassbtz = await WAConnection({
version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
browser: ['ios', 'Chrome', '10.15.7'],
printQRInTerminal: false, 
logger: pino({ level: "silent" }),
auth: state,
generateHighQualityLinkPreview: true,     
getMessage: async (key) => {
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
return msg?.message || undefined
}
return {
conversation: 'VynzzMD'
}}})
	
if (pairingCode && !zassbtz.authState.creds.registered) {

const phoneNumber = await getPhoneNumber();  
await exec('rm -rf ./session/*');  

// Pairing code animation 
let i = 0;  
const anim = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];  
process.stdout.write(chalk.blueBright(`\n Get pairing code `));  
const interval = setInterval(() => {  
    process.stdout.write('\r' + chalk.blueBright(` Get pairing code ${anim[i = ++i % anim.length]}`));  
}, 120);  


await new Promise(resolve => setTimeout(resolve, 2000));  

let code = await zassbtz.requestPairingCode(phoneNumber);  
clearInterval(interval);  
process.stdout.write('\n');  
code = code.match(/.{1,4}/g).join(" - ") || code;  

console.clear();  
console.log(gradient.pastel(figlet.textSync('Pairing Code', { font: 'Big' })));  
console.log(chalk.cyanBright('\nPlease copy the following code and open your WhatsApp:\n'));  
console.log(chalk.whiteBright.bgMagenta.bold(`  ${code}  `));  
console.log(chalk.greenBright('\nOpen WhatsApp > Linked Devices > Add Device and enter the code above.\n'));

}
	
	store?.bind(zassbtz.ev)
	
	await Solving(zassbtz, store)
	
	zassbtz.ev.on('creds.update', saveCreds)

// Connection handler
zassbtz.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, receivedPendingNotifications, qr } = update;
if (qr && !pairingCode) {
  qrcode.generate(qr, { small: true });
}
    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        switch (reason) {
            case DisconnectReason.connectionLost:
                console.log(chalk.redBright('[✘] Connection lost. Reconnecting...'));
                startingBot();
                break;
            case DisconnectReason.connectionClosed:
                console.log(chalk.redBright('[✘] Connection closed. Reconnecting...'));
                startingBot();
                break;
            case DisconnectReason.restartRequired:
                console.log(chalk.yellowBright('[!] Connecting bot...'));
                startingBot();
                break;
            case DisconnectReason.timedOut:
                console.log(chalk.redBright('[✘] Connection timed out. Reconnecting...'));
                startingBot();
                break;
            case DisconnectReason.badSession:
                console.log(chalk.bgRed.white.bold('\n[!] Session corrupted. Delete session and rescan.\n'));
                startingBot();
                break;
            case DisconnectReason.connectionReplaced:
                console.log(chalk.bgRed.white.bold('\n[!] Connection replaced. Please type restart.\n'));
                startingBot();
                break;
            case DisconnectReason.loggedOut:
                console.log(chalk.redBright('[!] logged out. Deleting session...'));
                exec('rm -rf ./session/*');
                process.exit(1);
                break;
            case DisconnectReason.Multidevicemismatch:
                console.log(chalk.redBright('[!] Multi-device mismatch. Rescan...'));
                exec('rm -rf ./session/*');
                process.exit(0);
                break;
            default:
                console.log(chalk.bgRed.white.bold(`[UNKNOWN] Disconnect Reason: ${reason}`));
                zassbtz.end();
        }
    }

if (connection === 'open') {

    console.clear();
    console.log(gradient.rainbow(figlet.textSync('BOT CONNECTED', { horizontalLayout: 'default' })));

    CFonts.say('welcome', {
        font: 'block',
        align: 'center',
        gradient: ['cyan', 'blue'],
    });

    console.log(chalk.greenBright.bold('\n[√] CONNECTED SUCCESSFULLY!\n'));

    CFonts.say('VynzzMD', {
        font: 'chrome',
        align: 'center',
        gradient: ['red', 'magenta'],
    });
}

    await initializer(zassbtz);
    if (receivedPendingNotifications === 'true') {
        console.log(chalk.blue('[i] Please wait a moment (~1 minute)...'));
    }
});
	
	zassbtz.ev.on('contacts.update', (update) => {
		for (let contact of update) {
			let id = zassbtz.decodeJid(contact.id)
			if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
		}
	});
	
	zassbtz.ev.on('call', async (call) => {
  if (!global.anticall) return;

  let botNumber = await zassbtz.decodeJid(zassbtz.user.id);

  for (let id of call) {
    if (id.status === 'offer') {
      let msg = await zassbtz.sendMessage(id.from, {
        text: `Currently, We Cannot Accept Calls ${id.isVideo ? 'Video' : 'Voice'}.\nIf @${id.from.split('@')[0]} Need Help, Please Contact The Owner :)`,
        mentions: [id.from]
      });

      await zassbtz.sendContact(id.from, global.owner, msg);
      await zassbtz.rejectCall(id.id, id.from);
    }
  }
});
	
	zassbtz.ev.on('contacts.update', (update) => {
		for (let contact of update) {
			let id = 
zassbtz.decodeJid(contact.id)
			if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
		}
});

zassbtz.decodeJid = (jid) => {
  try {
    if (!jid || typeof jid !== 'string') return jid
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid)
      if (decode?.user && decode?.server) return `${decode.user}@${decode.server}`
    }
    return jid
  } catch {
    return jid
  }
}

    zassbtz.sendTextWithMentions = async (jid, text, quoted, options = {}) => zassbtz.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

zassbtz.sendText = (jid, text, quoted = '', options) => zassbtz.sendMessage(jid, { text: text, ...options }, { quoted })

	
	zassbtz.ev.on('group-participants.update', async (anu) => {
if (!global.welcome) return
let botNumber = await zassbtz.decodeJid(zassbtz.user.id)
if (anu.participants.includes(botNumber)) return
try {
let metadata = await zassbtz.groupMetadata(anu.id)
let namagc = metadata.subject
let participants = anu.participants
for (let num of participants) {
let check = anu.author !== num && anu.author.length > 1
let tag = check ? [anu.author, num] : [num]
try {
ppuser = await zassbtz.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://files.catbox.moe/sb3xx9.jpg'
}
if (anu.action == 'add') {
zassbtz.sendMessage(anu.id, {text: check ? `@${anu.author.split("@")[0]} Has Added @${num.split("@")[0]} Into This Group` : `┅═❏ *Hi @${num.split("@")[0]}* ❏═┅‎\n▭▬▭▬▭▬▭▬▭▬▭▬▭\nWelcome to\nGroup : *${namagc}*\n▭▬▭▬▭▬▭▬▭▬▭▬▭\nThank you for joining our group. Don't forget to read the group description.\n\n> BE A GOOD MEMBER and OBSERVE THE RULES`,
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '漏 Welcome Message', body: '', renderLargerThumbnail: true, sourceUrl: `${global.channellink}`, mediaType: 1}}})
} 
if (anu.action == 'remove') { 
zassbtz.sendMessage(anu.id, {text: check ? `@${anu.author.split("@")[0]} Telah Mengeluarkan @${num.split("@")[0]} Dari Grup Ini
` : `Goodbye @${num.split("@")[0]}\nSad to see you go 😓`,  
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '漏 Leaving Message', body: '', renderLargerThumbnail: true, sourceUrl: `${global.channellink}`, mediaType: 1}}})
}
if (anu.action == "promote") {
zassbtz.sendMessage(anu.id, {text: `@${anu.author.split("@")[0]} Just promote @${num.split("@")[0]} to be admin in this group.
`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '漏 Promote Message', body: '', renderLargerThumbnail: true, sourceUrl: `${global.channellink}`, mediaType: 1}}})
}
if (anu.action == "demote") {
zassbtz.sendMessage(anu.id, {text: `@${anu.author.split("@")[0]} Just demote @${num.split("@")[0]} As Admin of This Group
`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '漏 Demote Message', body: '', renderLargerThumbnail: true, sourceUrl: `${global.channellink}`, mediaType: 1}}})
}
} 
} catch (err) {
logError(err)
}})

// Fungsi delay kecil (jika belum ada)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

zassbtz.ev.on('messages.upsert', async ({ messages, type }) => {
  const m = messages?.[0];
  if (!m?.message) return;

  try {

        // 🔴 Presence (Auto-recording)
    await zassbtz.sendPresenceUpdate('recording', m.key.remoteJid);
    await sleep(1000);
    await zassbtz.sendPresenceUpdate('paused', m.key.remoteJid);
    const jid = m.key.remoteJid;

    if (!jid || (m.isBaileys && !m.key.fromMe) || jid.endsWith('@server')) return;

    if (jid !== 'status@broadcast' && global.autoread) {
      await zassbtz.readMessages([m.key]).catch(() => {});
    }

    await MessagesUpsert(zassbtz, { messages, type: 'notify' }, store);

  } catch (err) {
    console.error('❌ Error in messages.upsert:', err);
  }
});

	
zassbtz.sendTextWithMentions = async (jid, text, quoted, options = {}) => zassbtz.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

	return zassbtz
}

const SESSION_PATH = path.join(__dirname, 'session', 'creds.json');
if (fs.existsSync(SESSION_PATH)) {
  console.log(chalk.greenBright('✓ Session found. Reconnecting to WhatsApp...'));
  startingBot(true); 
  return; 
}

setTimeout(() => {
  console.clear();


  console.log(gradient.instagram(figlet.textSync("VynzzMD", { font: "ANSI Shadow" })))


  const boxContent = [
    'Thank you for purchasing my script!',
    'Please select the login method you wish to use:',
    '',
    '1. Login with Pairing Code',
    '2. Login with QR Code'
  ];

  const boxWidth = 60;

  console.log(chalk.cyanBright(`╔${'═'.repeat(boxWidth)}╗`));
  boxContent.forEach(line => {
    const paddedLine = line.padStart(((boxWidth + line.length) / 2), ' ');
    console.log(chalk.cyanBright(`║${paddedLine.padEnd(boxWidth, ' ')}║`));
  });
  console.log(chalk.cyanBright(`╚${'═'.repeat(boxWidth)}╝\n`));


  setTimeout(() => {
    console.log(chalk.magentaBright('➤ Please select a login method (1 / 2):'));
    rl.question(chalk.greenBright('• Your choice: '), async (answer) => {
      const pairingCode = answer.trim() === '1';
      await startingBot(pairingCode);
    });
  }, 300);

}, 1000);

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});