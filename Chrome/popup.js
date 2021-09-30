var APIKeys = 'YOUR_API_KEY'

document.getElementById('iconCenter').onclick = function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
}

document.getElementById('settingIcon').onclick = function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
}

function setUpForHidden() {
    chrome.storage.sync.get('serveData', function(serveOut) {
        if(serveOut.serveData == null) {
            var serveData = 0;
        } else {
            var serveData = serveOut.serveData;
        }

        if(serveData == 0) {
            document.getElementById('kroeaInfPlusMy').hidden = false;
            getMyAreaInfected();
        } else if (serveData == 2) {
            document.getElementById('kroeaInfPlusMy').hidden = false;
            getMyDistInfected();
        } else if (serveData == 3) {
            document.getElementById('kroeaInfPlusMy').hidden = false;
            getMyDistInfected();
        }
    });
}

function getKoreaInfected() { // get Korea infected
    var requestURL = 'http://api.go-guma.com/Area0/?Key=' + APIKeys
    fetch(requestURL).then(res => res.json()).then((out) => {
        document.getElementById('koreaAreaInfected').innerText = out.Area0.infected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";
        //get new Data
        var newPeo = out.Area0.newInfected;

        let today = new Date();
        let date = today.getDate();

        if (newPeo <= 0) {
            document.getElementById('newkoreaAreaInfected').innerText = "0명";
            document.getElementById('upArrow').innerText = "horizontal_rule";
            document.getElementById('kroeaInfPlusMy').style.backgroundColor = "#E1E0F2"; //261BDE
            document.getElementById('newMyAreaInfected').style.color = "#261BDE"; //MyAreaUpArrow
            document.getElementById('MyAreaUpArrow').style.color = "#261BDE";
        } else {
            document.getElementById('newkoreaAreaInfected').innerText = out.Area0.newInfected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";
        }
    });
}

function getMyAreaInfected() { //getMyAreaInfected
    var areaArr = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"];
    var areaCode;

    chrome.storage.sync.get('area', function (outAreaCode) {
        areaCode = outAreaCode.area;
        if(areaCode == null) {
            areaCode = 1;
        }
        document.getElementById('MyAreaName').innerText = areaArr[areaCode - 1] + " 확진자";
    });

    var requestURL = 'http://api.go-guma.com/Area0/?Key=' + APIKeys
    fetch(requestURL).then(res => res.json()).then((out) => {
        var areaString = "Area" + areaCode;
        document.getElementById('myAreaInfected').innerText = out[areaString].infected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";

        var myAreaPlusPeo = out[areaString].newInfected;

        if (myAreaPlusPeo <= 0) {
            document.getElementById('newMyAreaInfected').innerText = "0명";
            document.getElementById('MyAreaUpArrow').innerText = "horizontal_rule"; //kroeaInfPlusMy
            document.getElementById('kroeaInfPlusKorea').style.backgroundColor = "#E1E0F2"; //261BDE
            document.getElementById('newkoreaAreaInfected').style.color = "#261BDE"; //MyAreaUpArrow
            document.getElementById('upArrow').style.color = "#261BDE";
        } else {
            document.getElementById('newMyAreaInfected').innerText = out[areaString].newInfected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";
        }

        var newInfCheck = out[DistrictString].newInfected;

        var year = out.timeStamp.substring(0, 4);
        var month = out.timeStamp.substring(4, 6);
        var date = out.timeStamp.substring(6, 8);
        var hour = out.timeStamp.substring(8, 10);
        var min = out.timeStamp.substring(10, 12);

        var gotDate = new Date();

        if(newInfCheck == 0 && gotDate.getDate() != date) {
            if(gotDate.getDate() > date) {
                month = (parseInt(month) + 1 > 12) ? "01" : month;
            }
            date = gotDate.getDate();
            hour = "00";
            min = "00";
        }

        var toString = year + "년 " + month + "월 " + date + "일 " + hour + ":" + min + " 기준";
        document.getElementById('loadDate').innerText = toString;
    });
}

function getMyDistInfected() {
    var areaArr = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치도", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"];
    var areaCode;

    chrome.storage.sync.get('area', function (outAreaCode) {
        areaCode = outAreaCode.area;
        if(areaCode == null) {
            areaCode = 1;
        }

        var requestURL = 'http://api.go-guma.com/Area' + areaCode + '/?Key=' + APIKeys;
        fetch(requestURL).then(res => res.json()).then((out) => {
            chrome.storage.sync.get('district', function (outDistCode) {
                DistrictString = "District" + (parseInt(outDistCode.district) - 2);

                if(DistrictString == "District-1") { // Naming
                    DistrictString = "District0";
                    document.getElementById('MyAreaName').innerText = areaArr[areaCode - 1] + " 확진자";
                } else {
                    document.getElementById('MyAreaName').innerText = areaArr[areaCode - 1] + " " + out[DistrictString].name + " 확진자";
                }

                var newInfectedPeo = out[DistrictString].newInfected;
                if(newInfectedPeo == 0) {
                    document.getElementById('MyAreaUpArrow').innerText = "horizontal_rule";
                    document.getElementById('kroeaInfPlusMy').style.backgroundColor = "#E1E0F2"; //261BDE
                    document.getElementById('newMyAreaInfected').style.color = "#261BDE"; //MyAreaUpArrow
                    document.getElementById('MyAreaUpArrow').style.color = "#261BDE";
                }

                document.getElementById('myAreaInfected').innerText = out[DistrictString].infected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";
                if(out.serveData.types == 3) {
                    document.getElementById('newMyAreaInfected').innerText = out[DistrictString].newInfected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";
                }


                var newInfCheck = out[DistrictString].newInfected;

                var year = out.timeStamp.substring(0, 4);
                var month = out.timeStamp.substring(4, 6);
                var date = out.timeStamp.substring(6, 8);
                var hour = out.timeStamp.substring(8, 10);
                var min = out.timeStamp.substring(10, 12);

                var gotDate = new Date();

                if(newInfCheck == 0 && gotDate.getDate() != date) {
                    if(gotDate.getDate() > date) {
                        month = (parseInt(month) + 1 > 12) ? "01" : month;
                    }
                    date = gotDate.getDate();
                    hour = "00";
                    min = "00";
                }

                var toString = year + "년 " + month + "월 " + date + "일 " + hour + ":" + min + " 기준";
                document.getElementById('loadDate').innerText = toString;
            });
        });
    });
}

window.onload = getKoreaInfected(),setUpForHidden();