const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jsonFile = require('jsonfile');
const Promise = require('promise');
const iconv = require('iconv');
const geojson = require('geojson')

const dateUtil = require('./public/date');
const dateRanges = dateUtil.getDates();

const prefixUrl = 'http://www.kma.go.kr/weather/earthquake_volcano/domesticlist.jsp?';

const ic = new iconv.Iconv('EUC-KR', 'utf-8');

const serializeURL = (obj) => {
  var str = [];
  for (var p in obj) {
    // Nulls or undefined is just empty string
    if (obj[p] === null || typeof obj[p] === 'undefined') {
      obj[p] = '';
    }
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}


const getURL= (dateObj, pageIndex) => {
  const newParam = {};

  newParam.startTm = dateObj.startTm;
  newParam.endTm = dateObj.endTm;
  newParam.pNo = pageIndex;
  return `${prefixUrl}${serializeURL(newParam)}`;
}


const getEachPageTable = (url) =>
  new Promise((resolve, reject) => {
    request.get({
    url: url,
    encoding: null
    }, function (err, response, html) {
        if (err) reject(err);
        const buf = ic.convert(html);

        const dom = new JSDOM(buf.toString('utf-8'));
        const table = dom.window.document.getElementsByClassName('table_develop')[0];
        resolve(table);
    });
  });



const getPages = () => {
  // This delay may not even be necessary.
  const delayTime = 50;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms, 'dumb'));

  let pageUrls = [];
  for (const date of dateRanges) {
    for (let index = 1; index <= date.endPg; index++) {
      pageUrls.push(getURL(date, index));
    }
  }

  let tableArray = [];

  return pageUrls.reduce(function (promise, item, index, array) {
    return promise.then(values => {
      return Promise.all([getEachPageTable(item), delay(delayTime)]).then((values) => {
        if (values[0]) tableArray.push(values[0]);
        return tableArray;
      })
    })
  }, Promise.resolve());
}

const extractData = (tableArray) => {
  let totalRows = [];
  let dataWithoutGeo = [];
  let dataRows = [];
  let headContents = [];
  console.log('extracting started');

  for (const table of tableArray) {
    if(!headContents.length) {
      const heads = table.getElementsByTagName('th');
      for (const head of heads) {
        headContents.push(head.textContent);
      }
    }
    const body = table.getElementsByTagName('tbody')[0];

    const rows = body.getElementsByTagName('tr');

    // Skip the last row
    for (let rowIndex = 0; rowIndex < rows.length-1; rowIndex++) {
      const cols = rows[rowIndex].getElementsByTagName('td');
      const oneRow = {};
      // Skip the last col ( 지도보기 )
      for (let colIndex = 0; colIndex < cols.length-1; colIndex++) {
        if (colIndex == 4 || colIndex == 5 ) oneRow[headContents[colIndex]] = Number(cols[colIndex].textContent.split(' ')[0]);
        else oneRow[headContents[colIndex]] = cols[colIndex].textContent;
      }
      // Let's just push when there is geodata
      if (oneRow['경도'] && oneRow['위도']) dataRows.push(oneRow);
      else dataWithoutGeo.push(oneRow);
    }

  }

  var timeStamp = new Date();

  var filePath = `./public/earthquake-data.json`;
  var filePathWOGeo = `./public/datawogeo.json`;
  console.log(filePath);

  const finalGeojson = geojson.parse(dataRows, {Point:['위도', '경도']})
  jsonFile.writeFileSync(filePath, finalGeojson, {spaces: 2});
  jsonFile.writeFileSync(filePathWOGeo, dataWithoutGeo, {spaces: 2});
  console.log('done')
}


getPages()
  .then((result) => extractData(result))

