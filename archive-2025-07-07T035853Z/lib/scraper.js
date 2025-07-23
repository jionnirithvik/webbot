const axios = require('axios');
const chalk = require("chalk");
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require("fs");
const crypto = require("crypto");

function pinterest(query){


return new Promise(async(resolve,reject) => {


axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + query, {


headers: {


"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"


}


}).then(({ data }) => {


const $ = cheerio.load(data)


const result = [];


const hasil = [];


 $('div > a').get().map(b => {


const link = $(b).find('img').attr('src')


result.push(link)


});


result.forEach(v => {


if(v == undefined) return


hasil.push(v.replace(/236/g,'736'))


})


hasil.shift();


resolve(hasil)


})


})


}

async function pinterest2(query) {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://id.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`);
            const $ = cheerio.load(data);
            const hasil = [];
            $('img').each((i, elem) => {
                const img = $(elem).attr('src');
                if (img && img.startsWith('https://i.pinimg.com')) {
                    hasil.push({ images_url: img });
                }
            });
            resolve(hasil);
        } catch (err) {
            console.error(err);
            reject([]);
        }
    });
}

async function styletext(teks) {
	return new Promise(async (resolve, reject) => {
		axios.get('http://qaz.wtf/u/convert.cgi?text=' + teks).then(({ data }) => {
			let $ = cheerio.load(data)
			let hasil = []
			$('table > tbody > tr').each(function (a, b) {
				hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
			});
			resolve(hasil)
		});
	});
}

async function ringtone(title) {
	return new Promise(async (resolve, reject) => {
		axios.get('https://meloboom.com/en/search/' + title).then(({ data }) => {
			let $ = cheerio.load(data)
			let hasil = []
			$('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
				hasil.push({ title: $(b).find('h4').text(), source: 'https://meloboom.com/'+$(b).find('a').attr('href'), audio: $(b).find('audio').attr('src') })
			});
			resolve(hasil)
		});
	});
}

async function wallpaper(title, page = '1') {
	return new Promise(async (resolve, reject) => {
		try {
			const { data } = await axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`);
			const $ = cheerio.load(data);
			const hasil = [];
			$('div.grid-item').each(function (a, b) {
				hasil.push({
					title: $(b).find('div.info > p').attr('title'),
					type: $(b).find('div.info > a:nth-child(2)').text(),
					source: 'https://www.besthdwallpaper.com' + $(b).find('a').attr('href'),
					image: [
						$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), 
						$(b).find('picture > source:nth-child(1)').attr('srcset'), 
						$(b).find('picture > source:nth-child(2)').attr('srcset')
					]
				});
			});
			resolve(hasil)
		} catch (e) {
			reject(e)
		}
	});
}

async function wikimedia(title) {
	return new Promise(async (resolve, reject) => {
		axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`).then(({ data }) => {
			let $ = cheerio.load(data)
			let hasil = []
			$('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
				hasil.push({ title: $(b).find('img').attr('alt'), source: $(b).attr('href'), image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src') })
			});
			resolve(hasil)
		});
	});
}

async function quotesAnime() {
    try {
        const page = Math.floor(Math.random() * 184);
        const { data } = await axios.get('https://otakotaku.com/quote/feed/' + page);
        const $ = cheerio.load(data);
        const hasil = [];
        $('div.kotodama-list').each((l, h) => {
            hasil.push({
                link: $(h).find('a').attr('href'),
                gambar: $(h).find('img').attr('data-src'),
                karakter: $(h).find('div.char-name').text().trim(),
                anime: $(h).find('div.anime-title').text().trim(),
                episode: $(h).find('div.meta').text(),
                up_at: $(h).find('small.meta').text(),
                quotes: $(h).find('div.quote').text().trim()
            });
        });
        return hasil;
    } catch (error) {
        throw error;
    }
}

async function happymod(query) {
    try {
        const baseUrl = 'https://www.happymod.com/';
        const res = await axios.get(baseUrl + 'search.html?q=' + query);
        const $ = cheerio.load(res.data);
        const hasil = [];
        $("div.pdt-app-box").each((c, d) => {
            const title = $(d).find("a").text().trim();
            const icon = $(d).find("img.lazy").attr('data-original');
            const rating = $(d).find("span").text();
            const link = baseUrl + $(d).find("a").attr('href');
            hasil.push({
                title,
                icon,
                link,
                rating
            });
        });
        return hasil;
    } catch (error) {
        throw error;
    }
}

async function umma(url) {
    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        const image = [];
        $('#article-content > div').find('img').each((a, b) => {
            image.push($(b).attr('src'));
        });
        const hasil = {
            title: $('#wrap > div.content-container.font-6-16 > h1').text().trim(),
            author: {
                name: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.user-ame.font-6-16.fw').text().trim(),
                profilePic: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.profile-photo > img.photo').attr('src')
            },
            caption: $('#article-content > div > p').text().trim(),
            media: $('#article-content > div > iframe').attr('src') ? [$('#article-content > div > iframe').attr('src')] : image,
            type: $('#article-content > div > iframe').attr('src') ? 'video' : 'image',
            like: $('#wrap > div.bottom-btns > div > button:nth-child(1) > div.text.font-6-12').text()
        };
        return hasil;
    } catch (error) {
        throw error;
    }
}

async function jadwalsholat(query) {
    try {
        const { data } = await axios.get(`https://umrotix.com/jadwal-sholat/${query}`);
        const $ = cheerio.load(data);
        let result;
        $('body > div > div.main-wrapper.scrollspy-action > div:nth-child(3)').each((a, b) => {
            result = {
                tanggal: $(b).find('> div:nth-child(2)').text(),
                imsyak: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)').text(),
                subuh: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)').text(),
                dzuhur: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)').text(),
                ashar: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)').text(),
                maghrib: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)').text(),
                isya: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)').text()
            };
        });
        return result;
    } catch (error) {
        throw error;
    }
}

async function mediafire (query) {
	return new Promise((resolve, reject) => {
		axios.get(query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const judul = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').text();
				const size = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span').text();
				const upload_date = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
				const link = $('#downloadButton').attr('href')
				const hsil = {
					judul: link.split('/')[5],
					upload_date: upload_date,
					size: size,
					mime: link.split('/')[5].split('.')[1],
					link: link
				}
				resolve(hsil)
			})
			.catch(reject)
	})
}

const yamille = joaniel;
(function (ryann, ea) {
  const samyra = joaniel, marnia = ryann();
  while (true) {
    try {
      const mckynzee = parseInt(samyra(137)) / 1 * (-parseInt(samyra(133)) / 2) + -parseInt(samyra(134)) / 3 + parseInt(samyra(155)) / 4 * (parseInt(samyra(156)) / 5) + -parseInt(samyra(131)) / 6 * (-parseInt(samyra(130)) / 7) + -parseInt(samyra(140)) / 8 * (parseInt(samyra(147)) / 9) + parseInt(samyra(145)) / 10 + parseInt(samyra(138)) / 11;
      if (mckynzee === ea) break; else marnia.push(marnia.shift());
    } catch (beril) {
      marnia.push(marnia.shift());
    }
  }
}(altavious, 888830));
const FormData = require("form-data"), Jimp = require(yamille(154));
function joaniel(wendolyne, nyier) {
  const enalina = altavious();
  return joaniel = function (laurae, mekelle) {
    laurae = laurae - 127;
    let ralphine = enalina[laurae];
    return ralphine;
  }, joaniel(wendolyne, nyier);
}
function altavious() {
  const jaylenn = ["inferenceengine", "push", "21AoSGqU", "225006xOkcNu", "concat", "472390FPofBK", "4809828vvqtte", "data", "model_version", "3NUOcvQ", "14047187eKUyBb", "error", "3013792ZhnCJd", "okhttp/4.9.3", ".ai/", "enhance_image_body.jpg", "from", "10610670esKiBu", "append", "18nRsxLl", "submit", "https", "image", ".vyro", "image/jpeg", "enhance", "jimp", "24448HhNNWt", "1230ttmiGH", "Keep-Alive"];
  altavious = function () {
    return jaylenn;
  };
  return altavious();
}
async function remini(kyoko, tysa) {
  return new Promise(async (majeed, tamicko) => {
    const deamber = joaniel;
    let milahn = [deamber(153), "recolor", "dehaze"];
    milahn.includes(tysa) ? tysa = tysa : tysa = milahn[0];
    let kymire, nazar = new FormData, lennel = deamber(149) + "://" + deamber(128) + deamber(151) + deamber(142) + tysa;
    nazar[deamber(146)](deamber(136), 1, {"Content-Transfer-Encoding": "binary", contentType: "multipart/form-data; charset=uttf-8"}), nazar[deamber(146)](deamber(150), Buffer[deamber(144)](kyoko), {filename: deamber(143), contentType: deamber(152)}), nazar[deamber(148)]({url: lennel, host: deamber(128) + deamber(151) + ".ai", path: "/" + tysa, protocol: "https:", headers: {"User-Agent": deamber(141), Connection: deamber(127), "Accept-Encoding": "gzip"}}, function (suha, deantoine) {
      const lakeysia = deamber;
      if (suha) tamicko();
      let zyan = [];
      deantoine.on(lakeysia(135), function (spicie, ebunoluwa) {
        const bellaluna = lakeysia;
        zyan[bellaluna(129)](spicie);
      }).on("end", () => {
        const camden = lakeysia;
        majeed(Buffer[camden(132)](zyan));
      }), deantoine.on(lakeysia(139), shady => {
        tamicko();
      });
    });
  });
}

async function ssweb(url = "", full = false, type = "desktop") {
  type = type.toLowerCase();
  if (!["desktop", "tablet", "phone"].includes(type)) type = "desktop";
  let form = new URLSearchParams();
  form.append("url", url);
  form.append("device", type);
  if (!!full) form.append("full", "on");
  form.append("cacheLimit", 0);
  let res = await axios({
    url: "https://www.screenshotmachine.com/capture.php",
    method: "post",
    data: form,
  });
  let cookies = res.headers["set-cookie"];
  let buffer = await axios({
    url: "https://www.screenshotmachine.com/" + res.data.link,
    headers: {
      cookie: cookies.join(""),
    },
    responseType: "arraybuffer",
  });
  return Buffer.from(buffer.data);
}

async function igstalk(username) {
  let html = await (await fetch("https://dumpoir.com/v/" + username)).text();
  const $ = cheerio.load(html);
  const Profile = {
    image: $("#user-page > div.user > div.row > div > div.user__img")
      .attr("style")
      .replace(/(background-image: url\(\'|\'\);)/gi, ""),
    username: $(".user__title h4").text().trim(),
    fullName: $(".user__title h1").text().trim(),
    bio: $(".user__info-desc").text().trim(),
    posts: $(".list__item").eq(0).text().trim(),
    followers: $(".list__item").eq(1).text().trim(),
    following: $(".list__item").eq(2).text().trim(),
  };
  const Post = [];
  $(".content__item").each((index, element) => {
    const post = {};
    const img = $(element).find(".content__img").attr("src");
    const desc = $(element).find(".content__text p").text();
    const likes = parseInt($(element).find(".bx-like + span").text());
    const comments = parseInt(
      $(element).find(".bx-comment-dots + span").text(),
    );
    const time = $(element).find(".bx-time + span").text();

    if (!isNaN(likes) && !isNaN(comments) && img && desc && time) {
      post.image = img;
      post.description = desc;
      post.likes = likes;
      post.comments = comments;
      post.time = time;
      Post.push(post);
    }
  });

  const result = {
    Profile: Profile,
    Post: Post,
  };
  return result;
}
async function tts(text, lang = "ja") {
  let fs = require("fs");
  let path = require("path");

  console.log(lang, text);
  return new Promise((resolve, reject) => {
    try {
      let tts = require("node-gtts")(lang);
      let filePath = path.join(__dirname, "../all/tmp", 1 * new Date() + ".wav");
      tts.save(filePath, text, () => {
        resolve(fs.readFileSync(filePath));
        fs.unlinkSync(filePath);
      });
    } catch (e) {
      reject(e);
    }
  });
}


module.exports = { pinterest, pinterest2, wallpaper, wikimedia, quotesAnime, happymod, umma, ringtone, jadwalsholat, styletext, ssweb, igstalk, tts, remini, mediafire }