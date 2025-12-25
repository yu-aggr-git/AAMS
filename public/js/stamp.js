window.onload = () => {
    let paramIndexedDB = {};

    // ───日時の表示─────────────────────────────────────────────────────────────────
    document.getElementById("realday").innerHTML = date().yyyymmdd;
    setInterval(
        function() {
            document.getElementById("realtime").innerHTML = date().hhmmss;
        }, 1000
    );


    // ───イベントの取得──────────────────────────────────────────────────────────────
    let event = window.localStorage.getItem("event");
    document.getElementById("eventName").innerHTML = event ?? '　';


    // ───出勤状態────────────────────────────────────────────────────────────────────────
    if (event) {
        paramIndexedDB = {
            'event' : event,
            'day'   : date().yyyymmdd
        };
        opIndexedDB('getWorkStatus', paramIndexedDB);
    }


    // ───IndexedDBの接続────────────────────────────────────────────────────────────
    paramIndexedDB = { 'event': event };
    opIndexedDB('open', paramIndexedDB);


    // ───打刻────────────────────────────────────────────────────────────────────────
    document.getElementById("stampButton").onclick = function() {
        stamp(event);
    }


    // ───オンラインかオフラインかで処理を分ける────────────────────────────────────────
    var isOnline = navigator.onLine;
    isOnline ? online(event) : offline();

    window.addEventListener("online", function(){
        window.location.reload();
    }, false);

    window.addEventListener("offline", function() {
        window.location.reload();
    }, false)
}


// ──────────────────────────────────────────────────────
//  共通
// ………………………………………………………………………………………………………………………………………………

// 現在日時
function date() {
    const d = new Date();
    d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
    const yyyymmdd = d.toISOString().replace('T', ' ').substring(0, 10);
    const hhmmss = d.toISOString().replace('T', ' ').substring(11, 19);

    return {
        "yyyymmdd"  : yyyymmdd,
        "hhmmss"    : hhmmss,
        "yyyymmddhhmmss"  : yyyymmdd + ' ' + hhmmss,
    }
}


// 打刻
function stamp(event) {
    document.getElementById("modal").style.display = 'flex';
    document.getElementById("stamp").style.display = 'flex';

    let paramIndexedDB = {};

    // スタッフリストの表示
    paramIndexedDB = {
        'id'    : 'stampSelectStaff',
        'event' : event,
    };
    opIndexedDB('getStaffList', paramIndexedDB);

    // 打刻スタッフの表示
    document.getElementById("stampSelectStaff").onchange = function() {       
        document.getElementById("selectEdit").style.display = 'none';

        const selectStaff = document.getElementById("stampSelectStaff").value;
        if (selectStaff) {
            paramIndexedDB = {
                'event' : event,
                'day'   : date().yyyymmdd,
                'name'  : selectStaff
            };
            opIndexedDB('getWorkReport', paramIndexedDB);

            document.getElementById("stampAreaButton").style.display = 'flex';
            document.getElementById("stampAreaEdit").style.display = 'flex';
            document.getElementById("stampAreaInfo").style.display = 'flex';
        }
    }

    // 打刻漏れ
    document.getElementById("stampEdit").onclick = function() {
        document.getElementById("selectEdit").style.display = 'flex';

        document.getElementById("sendStampEdit").onclick = function() {

            const day           = date().yyyymmdd;
            const selectStaff   = document.getElementById("stampSelectStaff").value;
            const item          = document.getElementById("editItem").value;
            const inputHour     = document.getElementById("editHour").value;
            const inputMinutes  = document.getElementById("editMinutes").value;

            paramIndexedDB = {
                'requestDt'  : date().yyyymmddhhmmss,
                'event'      : event,
                'day'        : day,
                'name'       : selectStaff,
                'item'       : item,
                'dataBefore' : '-',
                'dataAfter'  : inputHour + ':' + inputMinutes,
                'reason'     : '打刻漏れ',
            };

            var result  = window.confirm(
                    '【イベント】  '    + event     + '\n' 
                +   '【  名前  】  '    + selectStaff      + '\n' 
                +   '【  日付  】  '    + day  + '\n' 
                +   '【  項目  】  '    + common_itemName(item) + '\n' 
                +   '【  修正  】  '    + '-' + '　→　' + inputHour + ':' + inputMinutes + '\n' 
                +   '【  理由  】  '    + '打刻漏れ' + '\n' 
                +   '\n以上の内容で、打刻漏れ申請をしてよろしいですか？'
            );
            if (result) {
                opIndexedDB('putWorkReportEdit', paramIndexedDB);
            }
        }
    }

    // 打刻
    function putWorkReport(e) {
        const selectStaff = document.getElementById("stampSelectStaff").value;
        const item = e.target.value;

        paramIndexedDB = {
            'event' : event,
            'day'   : date().yyyymmdd,
            'name'  : selectStaff,
            'item'  : item,
            'value' : date().hhmmss
        };

        var result = window.confirm(
                '【イベント】  '    + event     + '\n' 
            +   '【  名前  】  '    + selectStaff      + '\n' 
            +   '【  日付  】  '    + date().yyyymmdd  + '\n' 
            +   '【  項目  】  '    + common_itemName(item) + '\n' 
            +   '\n以上の内容で、打刻をしてよろしいですか？'
        );
        if (result) {
            opIndexedDB('putWorkReport', paramIndexedDB);
        }
    }
    document.getElementById("stampWorkS").onclick = function(e) {
        putWorkReport(e);
    }
    document.getElementById("stampBreakS").onclick = function(e) {
        putWorkReport(e);
    }
    document.getElementById("stampBreakE").onclick = function(e) {
        putWorkReport(e);
    }
    document.getElementById("stampWorkE").onclick = function(e) {
        putWorkReport(e);
    }
    
    // 閉じる
    document.getElementById("closeStamp").onclick = function() {
        document.getElementById("modal").style.display = 'none';
        document.getElementById("stamp").style.display = 'none';
        document.getElementById("stampSelectStaff").options[0].selected = true;
        document.getElementById("stampAreaButton").style.display = 'none';
        document.getElementById("stampAreaEdit").style.display = 'none';
        document.getElementById("stampAreaInfo").style.display = 'none';
        document.getElementById("selectEdit").style.display = 'none';

        paramIndexedDB = {
            'event' : event,
            'day'   : date().yyyymmdd
        };
        opIndexedDB('getWorkStatus', paramIndexedDB);
    }
}



// ──────────────────────────────────────────────────────
//  オフライン
// ………………………………………………………………………………………………………………………………………………

function offline() {
    console.log('インターネットから切断されました');

    // 表示切替
    document.getElementById("modal").style.display = 'none';
    document.getElementById("networkStatus").textContent = 'off-line';
    document.getElementById("networkStatus").style.background = '#41438bff';
    Array.from(document.getElementById("workStatus").querySelectorAll("th")).forEach(function(e) {
        e.style.color = '#41438bff';
    });
}



// ──────────────────────────────────────────────────────
//  オンライン
// ………………………………………………………………………………………………………………………………………………

function online(event) {
    console.log('インターネットに接続中です');
    
    // 表示切替
    document.getElementById("networkStatus").textContent = 'on-line';
    document.getElementById("networkStatus").style.background = '#dc4618ff';
    Array.from(document.getElementById("workStatus").querySelectorAll("th")).forEach(function(e) {
        e.style.color = '#dc4618ff';
    });

    let paramDB = {};
    if (event == null) {
        // ログイン
        checkLoginEvent(); 
    } else {
        // Service Worker 登録スクリプト
        navigator.serviceWorker.register('./sw.js').catch(console.error.bind(console));

        // スタッフリストの取得
        paramDB = { 'event': event, };
        opDB('getStaffList', paramDB);

        // メニューの表示
        dispMenu();

        // イベントの切換え
        document.getElementById("changeEvent").onclick = function() {
            var paramIndexedDB = {event : event};
            opIndexedDB('deleteStaffList', paramIndexedDB);
            localStorage.removeItem('event');
            window.location.reload();
        }

        // ローカルデータをDBに反映（5分毎）
        registerData(event);
        setInterval(
            function() {
                registerData(event);
            }, 300000
        );

        // 勤怠修正
        document.getElementById("openEdit").onclick = function() {
            editData(event);
        }

        // 日報選択
        document.getElementById("openDayReport").onclick = function() {
            sendDayReport(event);
        }
        document.getElementById("dayReportList").addEventListener('click', (e) => {
            if (e.target.tagName  === 'BUTTON') {
                // 日報記入
                const inputDayReport = document.getElementById("inputDayReport");
                var report = inputDayReport.value;

                var value = '・' + e.target.value + ' → 00:00(*理由)' + '\n';
                inputDayReport.value = report + value;
            }
        })
    }
}


// イベントログイン
function checkLoginEvent() {
    document.getElementById("modal").style.display = 'flex';
    document.getElementById("eventLogin").style.display = 'flex';

    // イベントリストの取得
    opDB('getEventList', null);

    // ログイン
    document.getElementById("sendUser").onclick = function() {
        const inputEvent  = document.getElementById("loginEventName").value;
        const inputPass   = document.getElementById("loginEventPass").value.trim();

        if (!inputEvent || !inputPass) {
            document.getElementById("loginMsg").innerHTML = 'すべての項目に入力が必要です。';
        } else {
            let paramDB = {
                'inputEvent' : inputEvent,
                'inputPass'  : inputPass,
            };
            opDB('checkLoginEvent', paramDB);
        }
    }
}


// メニューの表示
function dispMenu() {
    document.getElementById("menuOpen").style.display = 'block';

    document.getElementById("menuOpen").onclick = function() {
        document.getElementById("modal").style.display = 'flex';
        document.getElementById("menu").style.display = 'flex';
    }

    document.getElementById("closeMenu").onclick = function() {
        document.getElementById("modal").style.display = 'none';
        document.getElementById("menu").style.display = 'none';
    }
}


// 勤怠修正
function editData(event) {
    document.getElementById("menu").style.display = 'none';
    document.getElementById("edit").style.display = 'block';

    let paramIndexedDB = {};
    let paramDB = {};

    // スタッフリストの表示
    paramIndexedDB = {
        'id'    : 'editSelectStaff',
        'event' : event,
    };
    opIndexedDB('getStaffList', paramIndexedDB);

    // 勤怠修正スタッフの表示
    document.getElementById("editSelectStaff").onchange = function() {      
        const selectStaff = document.getElementById("editSelectStaff").value;

        if (selectStaff) {
            document.getElementById("editInput").style.display = 'flex';
            document.getElementById("editInfo").style.display = 'block';
            document.getElementById("editList").style.display = 'flex';
            document.getElementById("editMsg").innerHTML = '';

            paramDB = {
                'event' : event,
                'name'  : selectStaff
            };

            // 修正対象日リストの作成            
            opDB('getWorkReport', paramDB);


            // 勤怠修正情報の取得
            opDB('getWorkReportEdit', paramDB);
        }
    }

    // 勤怠修正の登録
    document.getElementById("sendEdit").onclick = function() {
        const selectStaff  = document.getElementById("editSelectStaff").value;
        const inputDay     = document.getElementById("editWorkReportDay").value;
        const inputItem    = document.getElementById("editWorkReportItem").value;
        const inputHour    = document.getElementById("editWorkReportHour").value;
        const inputMinutes = document.getElementById("editWorkReportMinutes").value;
        const inputReason  = document.getElementById("editWorkReportReason").value;

        if (!inputReason || !inputDay) {
            document.getElementById("editMsg").innerHTML = 'すべての項目に入力が必要です。';
        } else if (
            (inputHour == '×' && inputMinutes != '×') || 
            (inputHour != '×' && inputMinutes == '×')
        ) {
            document.getElementById("editMsg").innerHTML = '打刻データ取消し申請は「×：×」と入力してください。';
        } else {
            const regDay     = new RegExp("day" + "\\[(.*?)\\]" + "day");
            const regItem    = new RegExp(inputItem + "\\[(.*?)\\]" + inputItem);
            const selectDay  = inputDay.match(regDay)[1];
            const dataBefore = inputDay.match(regItem)[1] == 'null' ? '-' : inputDay.match(regItem)[1];
            const dataAfter = inputHour + ':' + inputMinutes;

            var result = window.confirm(
                    '【イベント】  '    + event     + '\n' 
                +   '【  名前  】  '    + selectStaff      + '\n' 
                +   '【  日付  】  '    + selectDay  + '\n' 
                +   '【  項目  】  '    + common_itemName(inputItem) + '\n' 
                +   '【  修正  】  '    + (dataBefore != '' ? dataBefore : '-') + '　→　' + dataAfter + '\n' 
                +   '【  理由  】  '    + inputReason + '\n' 
                +   '\n以上の内容で、打刻修正の申請をしてよろしいですか？'
            );

            if (result) {
                paramDB = {
                    'localClear' : 'false',
                    'data' : {
                        'requestDt'  : date().yyyymmddhhmmss,
                        'event'      : event,
                        'name'       : selectStaff,
                        'day'        : selectDay, 
                        'item'       : inputItem,
                        'dataBefore' : dataBefore,
                        'dataAfter'  : dataAfter,
                        'reason'     : inputReason
                    }
                };
                opDB('registerWorkReportEdit', paramDB);

                paramDB = {
                    'event' : event,
                    'name'  : selectStaff
                };
                opDB('getWorkReportEdit', paramDB);
            }
        }
    }

    // 閉じる
    document.getElementById("closeEdit").onclick = function() {
        document.getElementById("modal").style.display = 'none';
        document.getElementById("edit").style.display = 'none';
        document.getElementById("editSelectStaff").options[0].selected = true;
        document.getElementById("editInput").style.display = 'none';
        document.getElementById("editInfo").style.display = 'none';
        document.getElementById("editList").style.display = 'none';
        document.getElementById("editWorkReportReason").value = '';
    }
}


// 日報報告
function sendDayReport(event) {
    document.getElementById("dayReportMsg").innerText   =  '';
    document.getElementById("inputDayReport").value     =  '';
    document.getElementById("inputEventPass").value     =  '';

    document.getElementById("menu").style.display       = 'none';
    document.getElementById("dayReport").style.display  = 'block';

    // ローカルデータをDBに反映
    registerData(event);

    // 日付リストの表示
    paramDB = {
        'event' : event,
        'day'   : date().yyyymmdd,
    };
    opDB('getWorkReportDayAll', paramDB);

    // 選択肢切り替え
    let selectDay =  '';
    document.getElementById("dayReportSelect").onchange = function() {      
        selectDay = document.getElementById("dayReportSelect").value;

        paramDB['day'] = selectDay;
        opDB('getWorkReportDayAll', paramDB);

    }

    // 送信
    const inputDayReport = document.getElementById("inputDayReport");
    document.getElementById("sendDayReport").onclick = function() {
        var eventPass = document.getElementById("inputEventPass").value;

        if (!selectDay || !inputDayReport.value || !eventPass) {
            document.getElementById("dayReportMsg").innerText = 'すべての項目に入力が必要です。';
        } else {
            let dayReportEditList = [];
            for(let status of document.getElementById("dayReportEditList").querySelectorAll("input[type=radio]")) {
                if(status.checked) {
                    dayReportEditList.push(status.value);
                }
            }

            var result = window.confirm(
                    '【イベント】  '    + event     + '\n' 
                +   '【  日付  】  '    + selectDay  + '\n' 
                +   '\n日報の送信をしてよろしいですか？'
            );
            if (result) {
                paramDB['dayReport']    = inputDayReport.value;
                paramDB['updateList']   = dayReportEditList;
                paramDB['approvalD']    = date().yyyymmdd;
                paramDB['eventPass']    = eventPass;
                opDB('registerDayReport', paramDB);
            }
        }
    }


    // 閉じる
    document.getElementById("closeDayReport").onclick = function() {
        document.getElementById("modal").style.display      = 'none';
        document.getElementById("dayReport").style.display  = 'none';
        document.getElementById("dayReportMsg").innerText   =  '';
        document.getElementById("inputDayReport").value     =  '';
        document.getElementById("inputEventPass").value     =  '';
    }
}



// ローカルデータをDBに反映
function registerData(event) {
    let paramIndexedDB = {'event' : event};

    opIndexedDB('registerWorkReport', paramIndexedDB);

    opIndexedDB('registerWorkReportEdit', paramIndexedDB);
}



// ──────────────────────────────────────────────────────
//  IndexedDBの操作
// ………………………………………………………………………………………………………………………………………………

function opIndexedDB(op, paramIndexedDB) {
    const dbName         = 'aamsIndexedDB';
    const staffList      = 'localStaffList';
    const workReport     = 'localWorkReport';
    const workReportEdit = 'localWorkReportEdit';

    // 接続
    let openReq = indexedDB.open(dbName);

    switch (op) {
        case 'open':
            // store作成
            openReq.onupgradeneeded = function(event) {
                var db = event.target.result;

                // スタッフリスト
                if (!db.objectStoreNames.contains(staffList)) {
                    const storeStaffList = db.createObjectStore(
                        staffList,
                        { keyPath:  ['event', 'name'] }
                    );
                    storeStaffList.createIndex('eventIndex', 'event');
                }                

                // 勤怠情報
                if (!db.objectStoreNames.contains(workReport)) {
                    const storeWorkReport = db.createObjectStore(
                        workReport,
                        { keyPath:  ['event', 'day', 'name'] }
                    );
                    storeWorkReport.createIndex('eventIndex', ['event']);
                    storeWorkReport.createIndex('eventDayIndex', ['event', 'day']);
                }

                // 勤怠修正情報
                if (!db.objectStoreNames.contains(workReportEdit)) {
                    const storeworkReportEdit = db.createObjectStore(
                        workReportEdit,
                        { keyPath:  ['event', 'day', 'name', 'item'] }
                    );
                    storeworkReportEdit.createIndex('eventIndex', ['event']);
                }                
            }
            
            openReq.onsuccess = function(event) {
                // console.log('db open success');
                var db = event.target.result;
                db.close();
            }
            openReq.onerror = function(event) {
                // console.log('db open error');
            }
            break;

        case 'setStaffList':
            var data = {
                event   : paramIndexedDB['event'], 
                name    : paramIndexedDB['name'].name,
            };

            openReq.onsuccess = function(event) {
                var db      = event.target.result;
                var trans   = db.transaction(staffList, 'readwrite');
                var store   = trans.objectStore(staffList);
                var putReq  = store.put(data);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                }
                trans.oncomplete = function(event) {
                    // console.log('transaction complete');
                }
            }
            break;
        
        case 'getStaffList':
            openReq.onsuccess = function(event) {
                var db    = event.target.result;
                var trans = db.transaction(staffList, 'readonly');
                var store = trans.objectStore(staffList);
                var index = store.index('eventIndex');

                var putReq  = index.getAll(paramIndexedDB['event']);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;

                    const select = document.getElementById(paramIndexedDB['id']);
                    while( select.firstChild ){
                        select.removeChild(select.firstChild);
                    }

                    var option = document.createElement("option"); 
                    option.text = '選択してください';
                    option.value = '';
                    option.hidden = true;
                    select.appendChild(option);

                    Object.keys(data).forEach(function(key) {     
                        var option = document.createElement("option"); 
                        option.text = data[key].name;
                        option.value = data[key].name;
                        select.appendChild(option);
                    });
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;

        case 'deleteStaffList':
            openReq.onsuccess = function(event) {
                var db    = event.target.result;
                var trans = db.transaction(staffList, 'readwrite');
                var store = trans.objectStore(staffList);
                var index = store.index('eventIndex');

                var putReq  = index.getAll(paramIndexedDB['event']);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;

                    Object.keys(data).forEach(function(key) { 
                        store.delete([
                            paramIndexedDB['event'],
                            data[key].name
                        ]);
                    });
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;

        case 'getWorkStatus':
            openReq.onsuccess = function(event) {
                var db    = event.target.result;
                var trans = db.transaction(workReport, 'readonly');
                var store = trans.objectStore(workReport);
                var index = store.index('eventDayIndex');

                var putReq  = index.getAll([
                    paramIndexedDB['event'],
                    paramIndexedDB['day']
                ]);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;
                    
                    let startList = ''
                    let breakList = ''
                    let endList = ''
                    Object.keys(data).forEach(function(key) {
                        if (data[key].start) {
                            if (data[key].end) {
                                endList = endList + data[key].name + `\n`;
                            } else {
                                if (
                                    (data[key].break1s && !data[key].break1e) ||
                                    (data[key].break2s && !data[key].break2e) ||
                                    (data[key].break3s && !data[key].break3e)
                                ) {
                                    breakList = breakList + data[key].name + `\n`;
                                } else {
                                    startList = startList + data[key].name + `\n`;
                                }
                            }
                        }
                    });
                    document.getElementById("startList").innerText = startList;
                    document.getElementById("breakList").innerText = breakList;
                    document.getElementById("endList").innerText = endList;
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;   

        case 'getWorkReport':
            var data = [
                paramIndexedDB['event'],
                paramIndexedDB['day'],
                paramIndexedDB['name']
            ];

            openReq.onsuccess = function(event) {
                var db    = event.target.result;
                var trans = db.transaction(workReport, 'readonly');
                var store = trans.objectStore(workReport);

                var putReq  = store.get(data);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;

                    var stampAreaColor = navigator.onLine ? '#dc4618ff' : '#41438bff';

                    const stampWorkS = document.getElementById("stampWorkS");
                    const stampWorkE = document.getElementById("stampWorkE");
                    const stampBreakS = document.getElementById("stampBreakS");
                    const stampBreakE = document.getElementById("stampBreakE");

                    // 打刻漏れ選択リセット
                    const editItemSelect = document.getElementById("editItem");
                    while( editItemSelect.firstChild ){
                        editItemSelect.removeChild(editItemSelect.firstChild);
                    }

                    // 初期表示
                    document.getElementById("stampAreaDay").innerText     = paramIndexedDB['day'];
                    document.getElementById("stampAreaStart").innerText   = '';
                    document.getElementById("stampAreaBreak1s").innerText = '';
                    document.getElementById("stampAreaBreak1e").innerText = '';
                    document.getElementById("stampAreaBreak2s").innerText = '';
                    document.getElementById("stampAreaBreak2e").innerText = '';
                    document.getElementById("stampAreaBreak3s").innerText = '';
                    document.getElementById("stampAreaBreak3e").innerText = '';
                    document.getElementById("stampAreaEnd").innerText     = '';
                    if (data) {
                        document.getElementById("stampAreaStart").innerText   = data.start ?? '';
                        document.getElementById("stampAreaBreak1s").innerText = data.break1s ?? '';
                        document.getElementById("stampAreaBreak1e").innerText = data.break1e ?? '';
                        document.getElementById("stampAreaBreak2s").innerText = data.break2s ?? '';
                        document.getElementById("stampAreaBreak2e").innerText = data.break2e ?? '';
                        document.getElementById("stampAreaBreak3s").innerText = data.break3s ?? '';
                        document.getElementById("stampAreaBreak3e").innerText = data.break3e ?? '';
                        document.getElementById("stampAreaEnd").innerText     = data.end ?? '';
                    }

                    // 出勤
                    let animeStampAreaStart= document.getElementById("stampAreaStart").animate(
                        [{ background : '#fff' }, { background : stampAreaColor }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaStart.cancel();
                    if (!data || !data.start) {
                        stampWorkS.disabled = false;
                        stampWorkS.style.background = '#000';
                        animeStampAreaStart.play();

                        var startOp = document.createElement("option");
                        startOp.text  = '出勤';
                        startOp.value = 'start';
                        startOp.id    = 'startOp';
                        editItemSelect.appendChild(startOp);
                    } else {
                        animeStampAreaStart.currentTime = 0;
                        stampWorkS.disabled = true;
                        stampWorkS.style.background = '#919191';
                    }

                    // 休憩
                    if (data && data.start && !data.end) {
                        if (
                            (data.break1s && !data.break1e) ||
                            (data.break2s && !data.break2e) ||
                            (data.break3s && !data.break3e)
                        ) {
                            stampBreakS.disabled = true;
                            stampBreakS.style.background = '#919191';
                            stampBreakE.disabled = false;
                            stampBreakE.style.background = '#97d769';                        
                        } else if (data.break3e) {
                            stampBreakS.disabled = true;
                            stampBreakS.style.background = '#919191';
                            stampBreakE.disabled = true;
                            stampBreakE.style.background = '#919191';
                        } else {
                            stampBreakS.disabled = false;
                            stampBreakS.style.background = '#97d769';
                            stampBreakE.disabled = true;
                            stampBreakE.style.background = '#919191';
                        }
                    } else {
                        stampBreakS.disabled = true;
                        stampBreakS.style.background = '#919191';
                        stampBreakE.disabled = true;
                        stampBreakE.style.background = '#919191';
                    }

                    // 休憩1開始
                    let animeStampAreaBreak1s= document.getElementById("stampAreaBreak1s").animate(
                        [{ background : '#fff' }, { background : '#97d769' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaBreak1s.cancel();
                    if (data && data.start && !data.end && !data.break1s) {
                        stampBreakS.value = 'break1s';
                        animeStampAreaBreak1s.play();

                        var break1sOp = document.createElement("option");
                        break1sOp.text  = '休憩1：開始';
                        break1sOp.value = 'break1s';
                        break1sOp.id    = 'break1sOp';
                        editItemSelect.appendChild(break1sOp);
                    } else {
                        animeStampAreaBreak1s.currentTime = 0;
                    }

                    // 休憩1終了
                    let animeStampAreaBreak1e= document.getElementById("stampAreaBreak1e").animate(
                        [{ background : '#fff' }, { background : '#97d769' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaBreak1e.cancel();
                    if (data && data.break1s && !data.end && !data.break1e) {
                        stampBreakE.value = 'break1e';
                        animeStampAreaBreak1e.play();

                        var break1eOp = document.createElement("option");
                        break1eOp.text  = '休憩1：終了';
                        break1eOp.value = 'break1e';
                        break1eOp.id    = 'break1eOp';
                        editItemSelect.appendChild(break1eOp);
                    } else {
                        animeStampAreaBreak1e.currentTime = 0;
                    }

                    // 休憩2開始
                    let animeStampAreaBreak2s= document.getElementById("stampAreaBreak2s").animate(
                        [{ background : '#fff' }, { background : '#97d769' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaBreak2s.cancel();
                    if (data && data.break1e && !data.end && !data.break2s) {
                        stampBreakS.value = 'break2s';
                        animeStampAreaBreak2s.play();

                        var break2sOp = document.createElement("option");
                        break2sOp.text  = '休憩2：開始';
                        break2sOp.value = 'break2s';
                        break2sOp.id    = 'break2sOp';
                        editItemSelect.appendChild(break2sOp);
                    } else {
                        animeStampAreaBreak2s.currentTime = 0;
                    }

                    // 休憩2終了
                    let animeStampAreaBreak2e= document.getElementById("stampAreaBreak2e").animate(
                        [{ background : '#fff' }, { background : '#97d769' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaBreak2e.cancel();
                    if (data && data.break2s && !data.end && !data.break2e) {
                        stampBreakE.value = 'break2e';
                        animeStampAreaBreak2e.play();

                        var break2eOp = document.createElement("option");
                        break2eOp.text  = '休憩2：終了';
                        break2eOp.value = 'break2e';
                        break2eOp.id    = 'break2eOp';
                        editItemSelect.appendChild(break2eOp);
                    } else {
                        animeStampAreaBreak2e.currentTime = 0;
                    }

                    // 休憩3開始
                    let animeStampAreaBreak3s= document.getElementById("stampAreaBreak3s").animate(
                        [{ background : '#fff' }, { background : '#97d769' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaBreak3s.cancel();
                    if (data && data.break2e && !data.end && !data.break3s) {
                        stampBreakS.value = 'break3s';
                        animeStampAreaBreak3s.play();

                        var break3sOp = document.createElement("option");
                        break3sOp.text  = '休憩3：開始';
                        break3sOp.value = 'break3s';
                        break3sOp.id    = 'break3sOp';
                        editItemSelect.appendChild(break3sOp);
                    } else {
                        animeStampAreaBreak3s.currentTime = 0;
                    }

                    // 休憩3終了
                    let animeStampAreaBreak3e= document.getElementById("stampAreaBreak3e").animate(
                        [{ background : '#fff' }, { background : '#97d769' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaBreak3e.cancel();
                    if (data && data.break3s && !data.end && !data.break3e) {
                        stampBreakE.value = 'break3e';
                        animeStampAreaBreak3e.play();

                        var break3eOp = document.createElement("option");
                        break3eOp.text  = '休憩3：終了';
                        break3eOp.value = 'break3e';
                        break3eOp.id    = 'break3eOp';
                        editItemSelect.appendChild(break3eOp);
                    } else {
                        animeStampAreaBreak3e.currentTime = 0;
                    }                    

                    // 終了
                    let animeStampAreaEnd= document.getElementById("stampAreaEnd").animate(
                        [{ background : '#fff' }, { background : stampAreaColor }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaEnd.cancel();
                    if (data && data.start && !data.end) {
                        stampWorkE.disabled = false;
                        stampWorkE.style.background = '#000';
                        animeStampAreaEnd.play();

                        var endOp = document.createElement("option");
                        endOp.text  = '退勤';
                        endOp.value = 'end';
                        endOp.id    = 'endOp';
                        editItemSelect.appendChild(endOp);
                    } else {
                        animeStampAreaEnd.currentTime = 0;
                        stampWorkE.disabled = true;
                        stampWorkE.style.background = '#919191';
                    }

                    // 退勤打刻後
                    if (data && data.end) {
                        if (!data.break1s) {
                            var break1sOp = document.createElement("option");
                            break1sOp.text  = '休憩1：開始';
                            break1sOp.value = 'break1s';
                            break1sOp.id    = 'break1sOp';
                            editItemSelect.appendChild(break1sOp);
                        }
                        if (!data.break1e) {
                            var break1eOp = document.createElement("option");
                            break1eOp.text  = '休憩1：終了';
                            break1eOp.value = 'break1e';
                            break1eOp.id    = 'break1eOp';
                            editItemSelect.appendChild(break1eOp);
                        }
                        if (!data.break2s) {
                            var break2sOp = document.createElement("option");
                            break2sOp.text  = '休憩2：開始';
                            break2sOp.value = 'break2s';
                            break2sOp.id    = 'break2sOp';
                            editItemSelect.appendChild(break2sOp);
                        }
                        if (!data.break2e) {
                            var break2eOp = document.createElement("option");
                            break2eOp.text  = '休憩2：終了';
                            break2eOp.value = 'break2e';
                            break2eOp.id    = 'break2eOp';
                            editItemSelect.appendChild(break2eOp);
                        }
                        if (!data.break3s) {
                            var break3sOp = document.createElement("option");
                            break3sOp.text  = '休憩3：開始';
                            break3sOp.value = 'break3s';
                            break3sOp.id    = 'break3sOp';
                            editItemSelect.appendChild(break3sOp);
                        }
                        if (!data.break3e) {
                            var break3eOp = document.createElement("option");
                            break3eOp.text  = '休憩3：終了';
                            break3eOp.value = 'break3e';
                            break3eOp.id    = 'break3eOp';
                            editItemSelect.appendChild(break3eOp);
                        }
                    }
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break; 

        case 'putWorkReport':
            var data = {
                'event'     : paramIndexedDB['event'], 
                'day'       : paramIndexedDB['day'],
                'name'      : paramIndexedDB['name'], 
                'start'     : document.getElementById("stampAreaStart").textContent, 
                'break1s'   : document.getElementById("stampAreaBreak1s").textContent, 
                'break1e'   : document.getElementById("stampAreaBreak1e").textContent, 
                'break2s'   : document.getElementById("stampAreaBreak2s").textContent, 
                'break2e'   : document.getElementById("stampAreaBreak2e").textContent, 
                'break3s'   : document.getElementById("stampAreaBreak3s").textContent, 
                'break3e'   : document.getElementById("stampAreaBreak3e").textContent, 
                'end'       : document.getElementById("stampAreaEnd").textContent, 
            };
            data[paramIndexedDB['item']] = paramIndexedDB['value'];

            openReq.onsuccess = function(event) {
                var db = event.target.result;
                var trans = db.transaction(workReport, 'readwrite');
                var store = trans.objectStore(workReport);
                var putReq = store.put(data);

                putReq.onsuccess = function() {
                    // console.log('put data success');
                    opIndexedDB('getWorkReport', paramIndexedDB);
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;

        case 'deleteWorkReport':
            var data = [
                paramIndexedDB['event'],
                paramIndexedDB['day'],
                paramIndexedDB['name'], 
            ];

            openReq.onsuccess = function(event) {
                var db = event.target.result;
                var trans = db.transaction(workReport, 'readwrite');
                var store = trans.objectStore(workReport);
                var deleteReq = store.delete(data);

                deleteReq.onsuccess = function() {
                    // console.log('delete data success');
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;

        case 'registerWorkReport':
            openReq.onsuccess = function(event) {
                var db    = event.target.result;
                var trans = db.transaction(workReport, 'readonly');
                var store = trans.objectStore(workReport);
                var index = store.index('eventIndex');

                var putReq  = index.getAll([paramIndexedDB['event']]);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;

                    Object.keys(data).forEach(function(key) {
                        var paramDB = { 'data': data[key] };
                        opDB('registerWorkReport', paramDB);
                    });
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;

        case 'putWorkReportEdit':
            var data = {
                'event'      : paramIndexedDB['event'], 
                'day'        : paramIndexedDB['day'],
                'name'       : paramIndexedDB['name'], 
                'item'       : paramIndexedDB['item'],
                'dataBefore' : paramIndexedDB['dataBefore'],
                'dataAfter'  : paramIndexedDB['dataAfter'],
                'reason'     : paramIndexedDB['reason'],
                'requestDt'  : paramIndexedDB['requestDt'],
            };

            openReq.onsuccess = function(event) {
                var db = event.target.result;
                var trans = db.transaction(workReportEdit, 'readwrite');
                var store = trans.objectStore(workReportEdit);
                var putReq = store.put(data);

                putReq.onsuccess = function() {
                    // console.log('put data success');
                    var editData = {
                        'event' : paramIndexedDB['event'],
                        'day'   : paramIndexedDB['day'],
                        'name'  : paramIndexedDB['name'],
                        'item'  : paramIndexedDB['item'],
                        'value' : '＊' + paramIndexedDB['dataAfter']
                    };
                    opIndexedDB('putWorkReport', editData);
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;

        case 'deleteWorkReportEdit':
            var data = [
                paramIndexedDB['event'],
                paramIndexedDB['day'],
                paramIndexedDB['name'], 
                paramIndexedDB['item'], 
            ];

            openReq.onsuccess = function(event) {
                var db = event.target.result;
                var trans = db.transaction(workReport, 'readwrite');
                var store = trans.objectStore(workReport);
                var deleteReq = store.delete(data);

                deleteReq.onsuccess = function() {
                    // console.log('delete data success');
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;

        case 'registerWorkReportEdit':
            openReq.onsuccess = function(event) {
                var db    = event.target.result;
                var trans = db.transaction(workReportEdit, 'readonly');
                var store = trans.objectStore(workReportEdit);
                var index = store.index('eventIndex');

                var putReq  = index.getAll([paramIndexedDB['event']]);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;

                    Object.keys(data).forEach(function(key) {
                        var paramDB = {
                            'localClear' : 'true',
                            'data'       : data[key]
                        };
                        opDB('registerWorkReportEdit', paramDB);
                    });
                }
                trans.oncomplete = function() {
                    // console.log('transaction complete');
                }
            }
            break;






    }
}


// ──────────────────────────────────────────────────────
//  DBの操作
// ………………………………………………………………………………………………………………………………………………

function opDB(op, paramDB) {
    var strUrl      = "function/db.php";
    const xmlhttp   = new XMLHttpRequest();

    switch (op) {
        case 'getEventList':
            var param   = "function=" + "get_event_list";
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);
                    const select = document.getElementById("loginEventName");

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        option.text = data[key];
                        option.value = data[key];
                        select.appendChild(option);
                    });
                }
            }
            break;

        case 'checkLoginEvent':
            var param = "function=" + "check_login_event"
                + "&event=" + encodeURIComponent(paramDB['inputEvent']) 
                + "&pass=" + encodeURIComponent(paramDB['inputPass']) 
            ;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;
                    
                    let msg = '';
                    if (result == 'true') {
                        localStorage.setItem("event", paramDB['inputEvent']);

                        window.location.reload();
                    } else {
                        msg = 'パスワードが誤っています。';
                    }
                    document.getElementById("loginMsg").innerHTML = msg;
                }
            }
            break;

        case 'getStaffList':
            var param = "function=" + "get_staff_list"
                + "&event=" + encodeURIComponent(paramDB['event'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Object.keys(data).forEach(function(key) {
                        var paramIndexedDB = {
                            event   : paramDB['event'],
                            name    : data[key],
                        };
                        opIndexedDB('setStaffList', paramIndexedDB);
                    });
                }
            }
            break;

        case 'getWorkReport':
            var param   = "function=" + "get_work_report"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&name=" + encodeURIComponent(paramDB['name'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    const select = document.getElementById("editWorkReportDay");
                    while( select.firstChild ){
                        select.removeChild(select.firstChild);
                    }

                    if (data) {
                        Object.keys(data).reverse().forEach(function(key) {
                            var value = "day["      + data[key].day     +  "]day_"
                                +       "start["    + data[key].start   +  "]start_"
                                +       "end["      + data[key].end     +  "]end_"
                                +       "break1s["  + data[key].break1s +  "]break1s_"
                                +       "break1e["  + data[key].break1e +  "]break1e_"
                                +       "break2s["  + data[key].break2s +  "]break2s_"
                                +       "break2e["  + data[key].break2e +  "]break2e_"
                                +       "break3s["  + data[key].break3s +  "]break3s_"
                                +       "break3e["  + data[key].break3e +  "]break3e_"
                            ;
                            
                            var option = document.createElement("option");
                            option.text = data[key].day;
                            option.value = value;
                            select.appendChild(option);
                        });
                    }
                }
            }
            break;

        case 'getWorkReportDayAll':
            var param   = "function=" + "get_work_report_day_all"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&day="   + encodeURIComponent(paramDB['day'])
            ;

            xmlhttp.onreadystatechange = function() {
                document.getElementById("dayReportMsg").innerText   =  '';
                document.getElementById("inputDayReport").value     =  '';
                document.getElementById("inputEventPass").value     =  '';

                const dayReportSelect = document.getElementById("dayReportSelect");
                Array.from(dayReportSelect.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                const dayReportEditList = document.getElementById("dayReportEditList").querySelector("tbody");
                Array.from(dayReportEditList.querySelectorAll("tr")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }               
                });

                const dayReportList = document.getElementById("dayReportList");
                Array.from(dayReportList.querySelectorAll("td")).forEach(function(e) {
                    e.remove();                  
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {

                        // 日付選択肢
                        const firstDay  = data.event.first_day.split(/-/);
                        const endDay    = data.event.end_day.split(/-/);
                        for (
                            let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                            date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                            date.setDate(date.getDate() + 1)
                        ){
                            var option = document.createElement("option");
                            option.text = date.toLocaleDateString('sv-SE');
                            option.value = date.toLocaleDateString('sv-SE');
                            dayReportSelect.appendChild(option);
                        }
                        dayReportSelect.value = paramDB['day'];

                        if (data.event.report) {
                            document.getElementById("dayReportDispArea").style.display = 'flex';
                            document.getElementById("dayReportEditArea").style.display = 'none';

                            document.getElementById("dayReportDispList").querySelector('p').innerHTML = data.event.report.replaceAll("\n", "<br>");
                        } else  {
                            document.getElementById("dayReportDispArea").style.display = 'none';
                            document.getElementById("dayReportEditArea").style.display = 'flex';

                            // 名前
                            const dayReportListA = dayReportList.querySelectorAll("tr");
                            Object.keys(data.staffList).forEach(function(keyName) {
                                var namaData = data.staffList[keyName];

                                // 勤怠修正情報
                                if (Object.keys(namaData.workReportEdit).length) {
                                    Object.keys(namaData.workReportEdit).forEach(function(keyEdit) {
                                        var editData = namaData.workReportEdit[keyEdit];

                                        var workReportEditTr = document.createElement("tr");

                                        // ステータス
                                        var status       = document.createElement("td");
                                        status.className = 'sticky1';
                                        var statusI1    = document.createElement("input");
                                        statusI1.type   = 'radio';
                                        statusI1.name   = 'status' + keyEdit;
                                        statusI1.value  = 
                                            '承認済'
                                            + '|' + editData.request_dt
                                            + '|' + keyName
                                            + '|' + editData.day
                                            + '|' + editData.item
                                            + '|' + editData.data_after
                                        ;
                                        statusI1.id     = 'approve' + keyEdit;
                                        var statusL1        = document.createElement("label");
                                        statusL1.htmlFor    = 'approve' + keyEdit;
                                        statusL1.innerText  = '承認';
                                        var statusI2    = document.createElement("input");
                                        statusI2.type   = 'radio';
                                        statusI2.name   = 'status' + keyEdit;
                                        statusI2.value  = 
                                            '却下済'
                                            + '|' + editData.request_dt
                                            + '|' + keyName
                                            + '|' + editData.day
                                            + '|' + editData.item
                                            + '|' + editData.data_before
                                        ;
                                        statusI2.id     = 'reject' + keyEdit;
                                        var statusL2        = document.createElement("label");
                                        statusL2.htmlFor    = 'reject' + keyEdit;
                                        statusL2.innerText  = '却下';
                                        status.appendChild(statusI1);
                                        status.appendChild(statusL1);
                                        status.appendChild(statusI2);
                                        status.appendChild(statusL2);
                                        workReportEditTr.appendChild(status);


                                        // 名前
                                        var reportEditname        = document.createElement("td");
                                        reportEditname.innerText  = keyName;
                                        workReportEditTr.appendChild(reportEditname);

                                        // 項目
                                        var item        = document.createElement("td");
                                        item.innerText  = common_itemName(editData.item);
                                        workReportEditTr.appendChild(item);

                                        // 修正前
                                        var before        = document.createElement("td");
                                        before.innerHTML  = 
                                            editData.day 
                                            + '<br>' 
                                            + editData.data_before
                                        ;
                                        workReportEditTr.appendChild(before);

                                        // 修正後
                                        var after        = document.createElement("td");
                                        after.innerHTML  = 
                                            editData.day 
                                            + '<br>' 
                                            + editData.data_after
                                        ;
                                        workReportEditTr.appendChild(after);

                                        // 理由
                                        var reason        = document.createElement("td");
                                        reason.innerText  = editData.reason;
                                        reason.className = 'w25';
                                        workReportEditTr.appendChild(reason);

                                        dayReportEditList.appendChild(workReportEditTr);
                                    });
                                }

                                // 勤怠情報
                                if (
                                    Object.keys(namaData.workReport).length ||
                                    common_validation_time(namaData.shift.start) ||
                                    common_validation_time(namaData.shift.end)
                                ) {
                                    var dataSS = 'start' in namaData.shift ? namaData.shift.start : '';
                                    var dataSE = 'end' in namaData.shift ? namaData.shift.end : '';

                                    var dataWS   = 'start' in namaData.workReport ? namaData.workReport.start : '';
                                    var dataWB1s = 'break1s' in namaData.workReport ? namaData.workReport.break1s : '';
                                    var dataWB1e = 'break1e' in namaData.workReport ? namaData.workReport.break1e : '';
                                    var dataWB2s = 'break2s' in namaData.workReport ? namaData.workReport.break2s : '';
                                    var dataWB2e = 'break2e' in namaData.workReport ? namaData.workReport.break2e : '';
                                    var dataWB3s = 'break3s' in namaData.workReport ? namaData.workReport.break3s : '';
                                    var dataWB3e = 'break3e' in namaData.workReport ? namaData.workReport.break3e : '';
                                    var dataWE   = 'end' in namaData.workReport ? namaData.workReport.end : '';
                                    
                                    // 名前
                                    var name        = document.createElement("td");
                                    name.colSpan    = '3';
                                    name.innerText  = keyName;
                                    name.className  = 'ececec bold';
                                    dayReportListA[0].appendChild(name);

                                    // 項目
                                    var item1               = document.createElement("td");
                                    item1.innerText         = 'シフト';
                                    item1.className         = 'ececec bold borderRight';
                                    var item2               = document.createElement("td");
                                    item2.innerText         = '打刻';
                                    item2.className         = 'ececec bold borderRight borderLeftNone';
                                    var item3               = document.createElement("td");                                
                                    item3.innerText         = '勤怠';
                                    item3.className         = 'ececec bold borderLeftNone';
                                    dayReportListA[1].appendChild(item1);
                                    dayReportListA[1].appendChild(item2);
                                    dayReportListA[1].appendChild(item3);
                                    
                                    // 出勤
                                    var start1       = document.createElement("td");
                                    start1.innerText = dataSS;
                                    start1.className = 'borderRight';
                                    var start2       = document.createElement("td");
                                    start2.innerText = dataWS;
                                    start2.className = 'borderRight borderLeftNone';
                                    var start3       = document.createElement("td");
                                    start3.className = 'borderLeftNone';
                                    var start3B      = document.createElement("button");
                                    var ceilWS       = common_validation_time(dataWS)
                                        ? common_ceil(dataWS)
                                        : '-'
                                    ;
                                    start3B.innerText = ceilWS;
                                    start3B.value = keyName + '[出勤]' + ceilWS;
                                    start3.appendChild(start3B);
                                    dayReportListA[2].appendChild(start1);
                                    dayReportListA[2].appendChild(start2);
                                    dayReportListA[2].appendChild(start3);

                                    // 休憩1：開始
                                    var break1s1        = document.createElement("td");
                                    break1s1.rowSpan    = '6';
                                    break1s1.className  = 'borderTopNone borderRight diagonalLine';
                                    var break1s2        = document.createElement("td");
                                    break1s2.innerText  = dataWB1s;
                                    break1s2.className  = 'borderBottom borderTopNone borderRight borderLeftNone';
                                    var break1s3        = document.createElement("td");
                                    break1s3.className  = 'borderBottom borderTopNone borderLeftNone';
                                    var break1sB        = document.createElement("button");
                                    var ceilWB1s        = common_validation_time(dataWB1s)
                                        ? common_ceil(dataWB1s)
                                        : '-'
                                    ;
                                    break1sB.innerText = ceilWB1s;
                                    break1sB.value = keyName + '[休憩1：開始]' + ceilWB1s;
                                    break1s3.appendChild(break1sB);
                                    dayReportListA[3].appendChild(break1s1);
                                    dayReportListA[3].appendChild(break1s2);
                                    dayReportListA[3].appendChild(break1s3);

                                    // 休憩1：終了
                                    var break1e2        = document.createElement("td");
                                    break1e2.innerText  = dataWB1e;
                                    break1e2.className  = 'borderTopNone borderRight borderLeftNone';
                                    var break1e3        = document.createElement("td");
                                    break1e3.className  = 'borderTopNone borderLeftNone';
                                    var break1eB        = document.createElement("button");
                                    var ceilWB1e        = common_validation_time(dataWB1e)
                                        ? common_ceil(dataWB1e)
                                        : '-'
                                    ;
                                    break1eB.innerText = ceilWB1e;
                                    break1eB.value = keyName + '[休憩1：終了]' + ceilWB1e;
                                    break1e3.appendChild(break1eB);
                                    dayReportListA[4].appendChild(break1e2);
                                    dayReportListA[4].appendChild(break1e3);

                                    // 休憩2：開始
                                    var break2s2        = document.createElement("td");
                                    break2s2.innerText  = dataWB2s;
                                    break2s2.className  = 'borderBottom borderTopNone borderRight borderLeftNone';
                                    var break2s3        = document.createElement("td");
                                    break2s3.className  = 'borderBottom borderTopNone borderLeftNone';
                                    var break2sB        = document.createElement("button");
                                    var ceilWB2s        = common_validation_time(dataWB2s)
                                        ? common_ceil(dataWB2s)
                                        : '-'
                                    ;
                                    break2sB.innerText = ceilWB2s;
                                    break2sB.value = keyName + '[休憩2：開始]' + ceilWB2s;
                                    break2s3.appendChild(break2sB);
                                    dayReportListA[5].appendChild(break2s2);
                                    dayReportListA[5].appendChild(break2s3);

                                    // 休憩2：終了
                                    var break2e2        = document.createElement("td");
                                    break2e2.innerText  = dataWB2e;
                                    break2e2.className  = 'borderTopNone borderRight borderLeftNone';
                                    var break2e3        = document.createElement("td");
                                    break2e3.className  = 'borderTopNone borderLeftNone';
                                    var break2eB        = document.createElement("button");
                                    var ceilWB2e =      common_validation_time(dataWB2e)
                                        ? common_ceil(dataWB2e)
                                        : '-'
                                    ;
                                    break2eB.innerText = ceilWB2e;
                                    break2eB.value = keyName + '[休憩2：終了]' + ceilWB2e;
                                    break2e3.appendChild(break2eB);
                                    dayReportListA[6].appendChild(break2e2);
                                    dayReportListA[6].appendChild(break2e3);

                                    // 休憩3：開始
                                    var break3s2        = document.createElement("td");
                                    break3s2.innerText  = dataWB3s;
                                    break3s2.className  = 'borderBottom borderTopNone borderRight borderLeftNone';
                                    var break3s3        = document.createElement("td");
                                    break3s3.className  = 'borderBottom borderTopNone borderLeftNone';
                                    var break3sB        = document.createElement("button");
                                    var ceilWB3s        = common_validation_time(dataWB3s)
                                        ? common_ceil(dataWB3s)
                                        : '-'
                                    ;
                                    break3sB.innerText = ceilWB3s;
                                    break3sB.value = keyName + '[休憩3：開始]' + ceilWB3s;
                                    break3s3.appendChild(break3sB);
                                    dayReportListA[7].appendChild(break3s2);
                                    dayReportListA[7].appendChild(break3s3);

                                    // 休憩3：終了
                                    var break3e2        = document.createElement("td");
                                    break3e2.innerText  = dataWB3e;
                                    break3e2.className  = 'borderTopNone borderRight borderLeftNone';
                                    var break3e3        = document.createElement("td");
                                    break3e3.className  = 'borderTopNone borderLeftNone';
                                    var break3eB        = document.createElement("button");
                                    var ceilWB3e        = common_validation_time(dataWB3e)
                                        ? common_ceil(dataWB3e)
                                        : '-'
                                    ;
                                    break3eB.innerText = ceilWB3e;
                                    break3eB.value = keyName + '[休憩3：終了]' + ceilWB3e;
                                    break3e3.appendChild(break3eB);
                                    dayReportListA[8].appendChild(break3e2);
                                    dayReportListA[8].appendChild(break3e3);

                                    // 退勤
                                    var end1       = document.createElement("td");
                                    end1.innerText = dataSE;
                                    end1.className = 'borderTopNone borderRight';
                                    var end2       = document.createElement("td");
                                    end2.innerText = dataWE;
                                    end2.className = 'borderTopNone borderRight borderLeftNone';
                                    var end3       = document.createElement("td");
                                    end3.className = 'borderTopNone borderLeftNone';
                                    var end3B      = document.createElement("button");
                                    var ceilWE     = common_validation_time(dataWE)
                                        ? common_floor(ceilWS, dataWE)
                                        : '-'
                                    ;
                                    end3B.innerText = ceilWE;
                                    end3B.value = keyName + '[退勤]' + ceilWE;
                                    end3.appendChild(end3B);
                                    dayReportListA[9].appendChild(end1);
                                    dayReportListA[9].appendChild(end2);
                                    dayReportListA[9].appendChild(end3);


                                    // 時間計算
                                    var shiftTimeB = '';
                                    var shiftTimeW = '';
                                    if (common_validation_time(dataSS) && common_validation_time(dataSE)) {
                                        var shiftTime = common_shift_time(paramDB['day'], dataSS, dataSE);
                                        shiftTimeB = shiftTime.breakTime;
                                        shiftTimeW = shiftTime.workTime;
                                    }
                                    var reportTime = common_report_time(
                                        paramDB['day'],
                                        ceilWS,
                                        ceilWB1s,
                                        ceilWB1e,
                                        ceilWB2s,
                                        ceilWB2e,
                                        ceilWB3s,
                                        ceilWB3e,
                                        ceilWE
                                    );
                                    var reportTimeB = reportTime.breakTime;
                                    var reportTimeW  = reportTime.workTime;

                                    // 休憩時間
                                    var sumBreak1       = document.createElement("td");
                                    sumBreak1.innerText = shiftTimeB;
                                    sumBreak1.className = 'bold borderRight';
                                    var sumBreak2       = document.createElement("td");
                                    sumBreak2.colSpan   = '2';
                                    sumBreak2.innerText = reportTimeB;
                                    sumBreak2.className = 'bold borderLeftNone';
                                    dayReportListA[10].appendChild(sumBreak1);
                                    dayReportListA[10].appendChild(sumBreak2);

                                    // 実働時間
                                    var sumWork1       = document.createElement("td");
                                    sumWork1.innerText = shiftTimeW;
                                    sumWork1.className = 'bold borderRight';
                                    var sumWork2       = document.createElement("td");
                                    sumWork2.colSpan   = '2';
                                    sumWork2.innerText = reportTimeW;
                                    sumWork2.className = 'bold borderLeftNone';
                                    dayReportListA[11].appendChild(sumWork1);
                                    dayReportListA[11].appendChild(sumWork2);
                                }
                            });
                        }
                    }

                }
            }
            break;

        case 'registerWorkReport':
            var param = "function=" + "register_work_report"
                + "&event="     + encodeURIComponent(paramDB['data'].event)
                + "&name="      + encodeURIComponent(paramDB['data'].name)
                + "&day="       + encodeURIComponent(paramDB['data'].day)
                + "&start="     + encodeURIComponent(paramDB['data'].start)
                + "&end="       + encodeURIComponent(paramDB['data'].end)
                + "&break1s="   + encodeURIComponent(paramDB['data'].break1s)
                + "&break1e="   + encodeURIComponent(paramDB['data'].break1e)
                + "&break2s="   + encodeURIComponent(paramDB['data'].break2s)
                + "&break2e="   + encodeURIComponent(paramDB['data'].break2e)
                + "&break3s="   + encodeURIComponent(paramDB['data'].break3s)
                + "&break3e="   + encodeURIComponent(paramDB['data'].break3e)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        // 前日以前のローカルデータをクリア
                        if (paramDB['data'].day < date().yyyymmdd) {
                            var paramIndexedDB = {
                                event   : paramDB['data'].event,
                                day     : paramDB['data'].day,
                                name    : paramDB['data'].name,
                            };
                            opIndexedDB('deleteWorkReport', paramIndexedDB);
                        }

                        document.getElementById("reflevted").textContent = '最終反映：' + date().yyyymmddhhmmss;
                    }
                }
            }
            break;

        case 'getWorkReportEdit':
            var param   = "function=" + "get_work_report_edit"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&name=" + encodeURIComponent(paramDB['name'])
            ;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Array.from(document.getElementById("editList").querySelectorAll("td")).forEach(function(e) {
                        e.remove();
                    });
                    
                    if (data) {
                        const orderList = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];
                        const tbl = document.getElementById("editList").querySelector("tbody");

                        let i = 0;
                        let dayNum = [];
                        let itemNum = [];
                        Object.keys(data).reverse().forEach(function(dayKey) {
                            i++;
                            dayNum[dayKey] = 0;
                            var dataDay = data[dayKey];
                            var day = document.createElement("td");
                            
                            Object.keys(orderList).forEach(function(orderName) {
                                var itemKey = orderList[orderName];

                                if (dataDay[itemKey]) {
                                    itemNum[itemKey] = 0;
                                    var dataItem = dataDay[itemKey];
                                    var item = document.createElement("td");
                                    
                                    Object.keys(dataItem).forEach(function(key) {
                                        dayNum[dayKey]      = dayNum[dayKey] + 1;
                                        itemNum[itemKey]    = itemNum[itemKey] + 1;
                                        var tr = document.createElement("tr");

                                        day.rowSpan = dayNum[dayKey];
                                        if (dayNum[dayKey] == 1) {
                                            day.innerText = dayKey;
                                            day.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                            day.className = 'sticky1';
                                            tr.appendChild(day);
                                        } else {
                                            day.className = 'sticky1 valueTop';
                                        }

                                        item.rowSpan = itemNum[itemKey];
                                        if (itemNum[itemKey] == 1) {
                                            item.innerText = common_itemName(itemKey);
                                            item.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                            item.className = 'sticky2';
                                            tr.appendChild(item);
                                        } else {
                                            item.className = 'sticky2 valueTop';
                                        }

                                        var status = document.createElement("td");
                                        var statusB = document.createElement("p");
                                        statusB.innerText = dataItem[key].status;
                                        statusB.className = 'statusB';
                                        switch (dataItem[key].status) {
                                            case '申請中':
                                                statusB.style.background = '#87bd9eff'
                                                break;
                                        
                                            case '訂正中':
                                                statusB.style.background = '#cbcd88ff'
                                                break;

                                            case '訂正済':
                                            case '承認済':
                                            case '却下済':
                                                statusB.style.background = '#a5a5a5ff'
                                                break;
                                        }                           
                                        status.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';             
                                        status.appendChild(statusB);
                                        tr.appendChild(status);

                                        var data_before = document.createElement("td");
                                        data_before.innerText = dataItem[key].data_before;
                                        data_before.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                        tr.appendChild(data_before);

                                        var data_after = document.createElement("td");
                                        data_after.innerText = dataItem[key].data_after;
                                        data_after.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                        tr.appendChild(data_after);

                                        var reason = document.createElement("td");
                                        reason.innerText = dataItem[key].reason;
                                        reason.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                        reason.className = 'reason textStart w25';
                                        tr.appendChild(reason);

                                        var request_dt = document.createElement("td");
                                        request_dt.innerText = dataItem[key].request_dt;
                                        request_dt.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                        request_dt.className = 'requestDt w25';
                                        tr.appendChild(request_dt);

                                        var approval_d = document.createElement("td");
                                        approval_d.innerText = dataItem[key].approval_d;
                                        approval_d.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                        tr.appendChild(approval_d);

                                        tbl.appendChild(tr);
                                    });
                                }
                            });
                        });
                    }
                }
            }
            break;

        case 'registerWorkReportEdit':
            var param = "function=" + "register_work_report_edit"
                + "&requestDt=" + encodeURIComponent(paramDB['data'].requestDt)
                + "&event="     + encodeURIComponent(paramDB['data'].event)
                + "&name="      + encodeURIComponent(paramDB['data'].name)
                + "&day="       + encodeURIComponent(paramDB['data'].day)
                + "&item="      + encodeURIComponent(paramDB['data'].item)
                + "&before="    + encodeURIComponent(paramDB['data'].dataBefore)
                + "&after="     + encodeURIComponent(paramDB['data'].dataAfter)
                + "&reason="    + encodeURIComponent(paramDB['data'].reason)
                + "&status="    + encodeURIComponent('申請中')
                + "&approvalD=" + encodeURIComponent('')
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        // 前日以前のローカルデータをクリア
                        if (paramDB['localClear'] == 'true') {
                            if (paramDB['data'].requestDt.substr(0, 8) < date().yyyymmdd) {
                                var paramIndexedDB = {
                                    event   : paramDB['data'].event,
                                    day     : paramDB['data'].day,
                                    name    : paramDB['data'].name,
                                    item    : paramDB['data'].item,
                                };
                                opIndexedDB('deleteWorkReportEdit', paramIndexedDB);

                                document.getElementById("reflevted").textContent = '最終反映：' + date().yyyymmddhhmmss;
                            }
                        } else {
                            var nextParamDB = {
                                'event' : paramDB['data'].event,
                                'name'  : paramDB['data'].name
                            };
                            opDB('getWorkReportEdit', nextParamDB);
                        }

                        document.getElementById("editWorkReportReason").value = '';
                        document.getElementById("editMsg").innerHTML = '';
                    } else {
                        document.getElementById("editMsg").innerHTML = '申請登録できませんでした。';
                    }
                }
            }
            break;

        case 'registerDayReport':
            var param = "function=" + "register_day_report"
                + "&event="         + encodeURIComponent(paramDB['event'])
                + "&day="           + encodeURIComponent(paramDB['day'])
                + "&dayReport="     + encodeURIComponent(paramDB['dayReport'])
                + "&updateList="    + encodeURIComponent(paramDB['updateList'])
                + "&approvalD="     + encodeURIComponent(paramDB['approvalD'])
                + "&eventPass="     + encodeURIComponent(paramDB['eventPass'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        nextParamDB = {
                            'event' : paramDB['event'],
                            'day'   : paramDB['day'],
                        };
                        opDB('getWorkReportDayAll', nextParamDB);
                    } else if (this.response == 'false') {
                        document.getElementById("dayReportMsg").innerHTML = 'パスワードが誤っています。';
                    }else {
                        document.getElementById("dayReportMsg").innerHTML = '日報の登録ができませんでした。';
                    }
                }
            }
            break;


    }

    xmlhttp.open("POST", strUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}