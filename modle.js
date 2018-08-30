const rp = require('request-promise'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    depositPath = "E:/blog/reptile/meizi/"; //存放照片的地址

let downLoadPath; // imgPath

module.exports = {
    async getPage(url) {
        const data = {
            url,
            res: await rp({
                url: url
            })
        };
        return data;
    },
    getUrl(data) {
        let list = [];
        const $ = cheerio.load(data.res) // 将html转为可用节点
        $('#pins li a')
            .children()
            .each(async (i, e) => {
                let obj = {
                    name: e.attribs.alt, // name
                    url: e.parent.attribs.href // url
                };
                list.push(obj); // url
            })
            return list;
    },
    getTitle(obj) {
        downloadPath = depositPath + obj.name;
        if (!fs.existsSync(downLoadPath)) { // 查看是否有这个文件夹
            fs.mkdirSync(downLoadPath); // 如果不存在，创建一个文件夹
            console.log(`${obj.name}文件夹创建成功`)
            return true;
        } else {
            console.log(`${obj.name}文件夹已存在`)
            return false;
        }
    },
    getItemNum(res, name) {
        if (res) {
            let $ = cheerio.load(res);
            let len = $('.pagenavi')
                .find('a')
                .find('span').length;
            if (len == 0) {
                fs.rmdirSync(`${depositPath}${name}`); // 删除无法下载的文件
                return 0;
            }
            let pageIndex = $('.pagenavi') // nodePage
                .find('a')
                .find('span')[len-2].children[0].data;
            return pageIndex;    
        }
    },
    // 下载照片
    async downloadImage (data, index) {
        if (data.res) {
            var $ = cheerio.load(data.res)
            if ($('.main-image').find('img')[0]) {
                let imgSrc = $('.main-image').find('img')[0].attribs.src; // 图片路径
                let headers = { // 请求头
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Cache-Control": "no-cache",
                    Host: "i.meizitu.net",
                    Pragma: "no-cache",
                    "Proxy-Connection": "keep-alive",
                    Referer: data.url,
                    "Upgrade-Insecure-Requests": 1,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
                };// 反盗连接
                await rp({
                    url: imgSrc,
                    resolveWithFullResponse: true,
                    headers
                }).pipe(fs.createWriteStream(`${downLoadPath}/${index}.jpg`)); // 下载
                    console.log(`${downLoadPath}/${index}.jpg下载成功`)
            } else {
                console.log(`${downLoadPath}/${index}.jpg下载失败`)
            }
        }
    }
}
