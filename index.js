const model = require('./modle'),
    basicPath = "http://www.mzitu.com/page/";
let start = 1,
    end = 10;
const main = async url => {
    let list = [],
        index = 0;
    const data = await model.getPage(url);
    list = model.getUrl(data);
    downLoadImage(list, index); // 下载
};
// 下载
const downLoadImage = async (list, index) => {
    if (index == list.length) {
        start ++;
        if (start < end) {
            main(basicPath + start); // 进行下一页图片爬去...
        }
        return false;
    }
    if (model.getTitle(list[index])) {
        let item = await model.getPage(list[index].url), //url
            imageNum = model.getItemNum(item.res, list[index].name); // num
        for (var i = 1; i <= imageNum; i ++) {
            let page = await model.getPage(list[index].url + `/${i}`)
            await model.downLoadImage(page, i); // 下载
        }
        index ++;
        downLoadImage(list, index); // next
    } else {
        index ++;
        downLoadImage(list, index); // next
    }
};
main(basicPath + start);
