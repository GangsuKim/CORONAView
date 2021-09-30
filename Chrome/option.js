window.open = setUp();
var APIKeys = 'YOUR_API_KEY'

function setUp() { //get selected data when it's started
    var areaArr = ["서울특별시","부산광역시","대구광역시","인천광역시","광주광역시","대전광역시","울산광역시","세종특별자치시","경기도","강원도","충청북도","충청남도","전라북도","전라남도","경상북도","경상남도","제주특별자치도"];

    chrome.storage.sync.get('area', function(out) {
        areaCode = out.area;
        if(isNaN(areaCode) == true) {
            areaCode = 1;
        }

        document.getElementById('area').getElementsByTagName('option')[areaCode - 1].selected = true;
        
        var districtCount = [0,25,16,8,10,5,6,6,0,31,18,11,15,13,22,22,18,0];
        var requestURL = 'http://api.go-guma.com/Area' + areaCode + '/?Key=' + APIKeys;
        fetch(requestURL).then(res => res.json()).then((out) => {
            if(out.resultCode == 0) {
                for(var i = 0; i<districtCount[areaCode]; i++) {
                    disString = "District" + (i+1);
                    document.getElementById('district').getElementsByTagName('option')[(i+2)].innerText = out[disString].name;
                    document.getElementById('district').getElementsByTagName('option')[(i+2)].hidden = false;
                }

                for(var i = (districtCount[areaCode] + 2); i<30; i++) {
                    document.getElementById('district').getElementsByTagName('option')[i].hidden = true;
                }

                document.getElementById('district').disabled = false;
            } else {
                for(var i = 1; i<30; i++) {
                    document.getElementById('district').getElementsByTagName('option')[i].hidden = true;
                }
                document.getElementById('district').disabled = true;
            }
        });

        chrome.storage.sync.get('district', function(out) {
            var gotByData = parseInt(out.district) - 1;
            document.getElementById('district').getElementsByTagName('option')[gotByData].selected = true;
        })

        if(areaCode == 6 || areaCode == 9) {
            document.getElementById('district').disabled = false;
        }

        if(areaCode == 6) {
            for(var i = 7; i<30; i++) {
                document.getElementById('district').getElementsByTagName('option')[i].hidden = true;
            }
        }
    });;
}

document.getElementById('selectArea').onclick = function() { // Select new data
    var sel = document.getElementById('area').value;
    var disSel = document.getElementById('district').value;
    var disSelInner = document.getElementById('district').getElementsByTagName('option')[disSel - 1].innerText;

    var areaArr = ["서울특별시","부산광역시","대구광역시","인천광역시","광주광역시","대전광역시","울산광역시","세종특별자치시","경기도","강원도","충청북도","충청남도","전라북도","전라남도","경상북도","경상남도","제주특별자치도"];

    chrome.storage.sync.set({'area':sel});
    chrome.storage.sync.set({'district':disSel});

    chrome.storage.sync.get('serveData', function(serveOut) {
        if(serveOut.serveData == null) {
            var requestURL = 'http://api.go-guma.com/Area' + sel + '/?Key=' + APIKeys;
            fetch(requestURL).then(res => res.json()).then((out) => {
                chrome.storage.sync.set({'serveData':out.serveData.types});
            });
        }
    });

    if(disSel == 1) {
        alert('사용자의 기본 지역이 ' + areaArr[sel-1] + ' 전체로 설정되었습니다.');
        var toString = areaArr[sel-1] + ' 전체';
    } else {
        alert('사용자의 기본 지역이 ' + areaArr[sel-1] + ' ' + disSelInner + '(으)로 설정되었습니다.');
        var toString = areaArr[sel-1] + ' ' + disSelInner;
    }

    chrome.storage.sync.set({'toString':toString});
}



document.getElementById('area').onchange = function() {
    var areaCode = document.getElementById('area').value;
    var districtCount = [0,25,16,8,10,5,6,6,0,31,18,11,15,13,22,22,18,0];
    document.getElementById('district').getElementsByTagName('option')[0].selected = true;

    var requestURL = 'http://api.go-guma.com/Area' + areaCode + '/?Key=' + APIKeys;
    fetch(requestURL).then(res => res.json()).then((out) => {
        if(out.resultCode == 0) {
            for(var i = 0; i<districtCount[areaCode]; i++) {
                disString = "District" + (i+1);
                document.getElementById('district').getElementsByTagName('option')[(i+2)].innerText = out[disString].name;
                document.getElementById('district').getElementsByTagName('option')[(i+2)].hidden = false;
            }

            for(var i = (districtCount[areaCode] + 2); i<30; i++) {
                document.getElementById('district').getElementsByTagName('option')[i].hidden = true;
            }

            document.getElementById('district').disabled = false;
            chrome.storage.sync.set({'serveData':out.serveData.types});
        } else {
            for(var i = 1; i<30; i++) {
                document.getElementById('district').getElementsByTagName('option')[i].hidden = true;
            }
            document.getElementById('district').disabled = true;
            chrome.storage.sync.set({'serveData':0});
        }
    });

    if(areaCode == 6 || areaCode == 7) {
        document.getElementById('district').disabled = false;
        for(var i = 7; i<30; i++) {
            document.getElementById('district').getElementsByTagName('option')[i].hidden = true;
        }
    }
}