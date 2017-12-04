(function (root, factory) {
  // Universal Module Definition (UMD)
  // via https://github.com/umdjs/umd/blob/master/templates/returnExports.js
  if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(this, function () {
  var getEndDate = function () {
    const now = new Date();
    const cYear = now.getFullYear();
    const day = now.getDate();
    let cMonth = now.getMonth() +1;
    let cDay = now.getDate() ;
    if (cMonth < 10) cMonth = '0' + cMonth;
    if (cDay < 10) cDay = '0' + day;
    console.log
    return `${cYear}-${cMonth}-${cDay}`;
  }
  var getDates = function () {
    // TODO =>  This is not very scalable solution. Since KMA only returns 999 results at maximum
    // When the result between 2010 and endDate becomes more than 999,
    // this script will start missing some results from that period.
    var dateArray = [{startTm: '1979-01-01', endTm: '2009-12-31', endPg: 44 }, {startTm: '2010-01-01', endTm: getEndDate(), endPg: 44}];
    return dateArray
  }

  return {
    getDates: getDates
  }
}));
