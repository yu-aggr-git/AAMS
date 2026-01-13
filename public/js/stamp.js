window.onload = () => {
    let paramIndexedDB = {};

    // 日時の表示
    document.getElementById("realday").innerHTML = common_date().yyyymmdd;
    setInterval(
        function() {
            document.getElementById("realtime").innerHTML = common_date().hhmmss;
        }, 1000
    );


    // イベントの取得
    let event = window.localStorage.getItem("event");
    common_text_entry({'innerHTML' : {'eventName' : (event ?? '　')}});


    // IndexedDBの接続
    paramIndexedDB = { 'event': event };
    opIndexedDB('open', paramIndexedDB);


    // オンライン／オフライン処理分岐
    var isOnline = navigator.onLine;
    isOnline
        ? online(event)
        : offline()
    ;
    window.addEventListener("online", function(){
        window.location.reload();
    }, false);
    window.addEventListener("offline", function() {
        window.location.reload();
    }, false);


    // 出勤状態
    if (event) {
        paramIndexedDB = {
            'event' : event,
            'day'   : common_date().yyyymmdd
        };
        opIndexedDB('getWorkStatus', paramIndexedDB);
    }


    // 打刻
    document.getElementById("stampButton").onclick = function() {
        stamp(event, isOnline);
    }
}


// ──────────────────────────────────────────────────────
//  打刻
// ………………………………………………………………………………………………………………………………………………
function stamp(event, isOnline) {
    common_op_modal('stamp', 'open');

    let paramIndexedDB = {};

    // スタッフリストの表示
    paramIndexedDB = {
        'id'    : 'stampSelectStaff',
        'event' : event,
    };
    opIndexedDB('getStaffList', paramIndexedDB);

    // 打刻スタッフの表示
    document.getElementById("stampSelectStaff").onchange = function() {
        common_op_view({
            'none'  : ['selectEdit']
        });

        const selectStaff = document.getElementById("stampSelectStaff").value;
        if (selectStaff) {
            paramIndexedDB = {
                'event' : event,
                'day'   : common_date().yyyymmdd,
                'name'  : selectStaff
            };
            opIndexedDB('getWorkReport', paramIndexedDB);

            common_op_view({
                'flex'  : ['stampAreaButton', 'stampAreaEdit', 'stampAreaInfo']
            });
        }
    }

    // 打刻漏れ
    document.getElementById("stampEdit").onclick = function() {
        common_op_view({
            'flex'  : ['selectEdit']
        });

        document.getElementById("sendStampEdit").onclick = function() {

            const day           = common_date().yyyymmdd;
            const selectStaff   = document.getElementById("stampSelectStaff").value;
            const item          = document.getElementById("editItem").value;
            const inputHour     = document.getElementById("editHour").value;
            const inputMinutes  = document.getElementById("editMinutes").value;

            paramIndexedDB = {
                'requestDt'  : common_date().yyyymmddhhmmss,
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
            'day'   : common_date().yyyymmdd,
            'name'  : selectStaff,
            'item'  : item,
            'value' : common_date().hhmmss
        };

        var result = window.confirm(
                '【イベント】  '    + event     + '\n' 
            +   '【  名前  】  '    + selectStaff      + '\n' 
            +   '【  日付  】  '    + common_date().yyyymmdd  + '\n' 
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
        common_op_modal('stamp', 'close');
        common_op_view({
            'none'  : ['stampAreaButton', 'stampAreaEdit', 'stampAreaInfo', 'selectEdit']
        });

        // ローカルデータの反映
        if (isOnline) {
            registerData(event);
        }

        paramIndexedDB = {
            'event' : event,
            'day'   : common_date().yyyymmdd
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
    common_op_view({
        'none'  : ['modal']
    });
    common_set_element({
        'element'       : document.getElementById("networkStatus"),
        'textContent'   : 'off-line',
        'background'    : '#41438bff',
    });
    Array.from(document.getElementById("workStatus").querySelectorAll("th")).forEach(function(e) {
        common_set_element({
            'element'   : e,
            'color'     : '#41438bff',
        });
    });
}


// ──────────────────────────────────────────────────────
//  オンライン
// ………………………………………………………………………………………………………………………………………………
function online(event) {
    console.log('インターネットに接続中です');

    // 表示切替
    common_op_view({
        'block'  : ['menuOpen']
    });
    common_set_element({
        'element'       : document.getElementById("networkStatus"),
        'textContent'   : 'on-line',
        'background'    : '#dc4618ff',
    });
    Array.from(document.getElementById("workStatus").querySelectorAll("th")).forEach(function(e) {
        common_set_element({
            'element'   : e,
            'color'     : '#dc4618ff',
        });
    });


    if (event == null) {
        // ログイン
        checkLoginEvent(); 
    } else {
        // Service Worker 登録スクリプト
        navigator.serviceWorker.register('./sw.js').catch(console.error.bind(console));


        // スタッフリストの取得
        var paramDB = { 'event': event, };
        opDB('getStaffList', paramDB);


        // メニューの表示
        document.getElementById("menuOpen").onclick = function() {
            common_op_modal('menu', 'open');
        }
        document.getElementById("closeMenu").onclick = function() {
            common_op_modal('menu', 'close');
        }


        // イベントの切換え
        document.getElementById("changeEvent").onclick = function() {
            var paramIndexedDB = {event : event};
            opIndexedDB('deleteStaffList', paramIndexedDB);
            localStorage.removeItem('event');
            window.location.reload();
        }


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
                // 訂正内容に反映
                var value = 
                    document.getElementById("inputDayReport").value
                    + '・' 
                    + e.target.value 
                    + ' → 00:00(*理由)' 
                    + '\n'
                ;
                common_text_entry({'value' : {'inputDayReport' : value}});
            }
        })


        // ローカルデータをDBに反映（5分毎）
        registerData(event);
        setInterval(
            function() {
                registerData(event);
            }, 300000
        );
    }
}


// ──────────────────────────────────────────────────────
//  イベントログイン
// ………………………………………………………………………………………………………………………………………………
function checkLoginEvent() {
    common_op_modal('eventLogin', 'open');
    common_op_view({
        'none'  : ['stampButton', 'menuOpen']
    });

    // イベントリストの取得
    opDB('getEventList', null);

    // ログイン
    document.getElementById("sendUser").onclick = function() {
        const inputEvent  = document.getElementById("loginEventName").value;
        const inputPass   = document.getElementById("loginEventPass").value.trim();

        if (!inputEvent || !inputPass) {
            common_text_entry({'innerText' : {'loginMsg' : 'すべての項目に入力が必要です。'}});
        } else {
            let paramDB = {
                'inputEvent' : inputEvent,
                'inputPass'  : inputPass,
            };
            opDB('checkLoginEvent', paramDB);
        }
    }
}


// ──────────────────────────────────────────────────────
//  勤怠修正
// ………………………………………………………………………………………………………………………………………………
function editData(event) {
    common_op_modal('menu', 'close');
    common_op_modal('edit', 'open');

    let paramIndexedDB = {};
    let paramDB = {};
    let msg = '';

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
            common_op_view({
                'block' : ['editInfo'],
                'flex'  : ['editInput', 'editList']
            });
            common_text_entry({'innerText' : {'editMsg' : ''}});

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
            msg = 'すべての項目に入力が必要です。';
        } else if ((inputHour == '×' && inputMinutes != '×') || (inputHour != '×' && inputMinutes == '×')) {
            msg = '打刻データ取消し申請は「×：×」と入力してください。';
        } else {
            msg = '';
        }

        if (msg) {
            common_text_entry({'innerText' : {'editMsg' : msg}});
        } else {
            const regDay     = new RegExp("day" + "\\[(.*?)\\]" + "day");
            const regItem    = new RegExp(inputItem + "\\[(.*?)\\]" + inputItem);
            const selectDay  = inputDay.match(regDay)[1];
            const dataBefore = inputDay.match(regItem)[1] == 'null' ? '-' : inputDay.match(regItem)[1];
            const dataAfter  = inputHour + ':' + inputMinutes;

            var result = window.confirm(
                    '【イベント】  '    + event + '\n' 
                +   '【  名前  】  '    + selectStaff   + '\n' 
                +   '【  日付  】  '    + selectDay + '\n' 
                +   '【  項目  】  '    + common_itemName(inputItem)    + '\n' 
                +   '【  修正  】  '    + (dataBefore != '' ? dataBefore : '-') + '　→　' + dataAfter   + '\n'
                +   '【  理由  】  '    + inputReason   + '\n' 
                +   '\n以上の内容で、打刻修正の申請をしてよろしいですか？'
            );
            if (result) {
                // 勤怠修正の登録
                paramDB = {
                    'localClear' : 'false',
                    'data' : {
                        'requestDt'  : common_date().yyyymmddhhmmss,
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

                // 勤怠修正の表示
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
        common_op_modal('edit', 'close');
        common_op_view({
            'none'  : ['editInput', 'editInfo', 'editList']
        });
        common_text_entry({'value' : {'editWorkReportReason' : ''}});

        // ローカルデータの反映
        registerData(event);
    }
}


// ──────────────────────────────────────────────────────
//  日報報告
// ………………………………………………………………………………………………………………………………………………
function sendDayReport(event) {
    common_text_entry({
        'innerText' : {
            'dayReportMsg' : ''
        },
        'value' : {
            'inputDayReport' : '',
            'inputEventPass' : '',
        },
    });
    common_op_modal('menu', 'close');
    common_op_modal('dayReport', 'open');

    // ローカルデータをDBに反映
    registerData(event);

    // 日付リストの表示
    paramDB = {
        'event' : event,
        'day'   : common_date().yyyymmdd,
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
            common_text_entry({'innerText' : {'dayReportMsg' : 'すべての項目に入力が必要です。'}});
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
                paramDB['approvalD']    = common_date().yyyymmdd;
                paramDB['eventPass']    = eventPass;
                opDB('registerDayReport', paramDB);
            }
        }
    }

    // 閉じる
    document.getElementById("closeDayReport").onclick = function() {
        common_op_modal('dayReport', 'close');

        common_text_entry({
            'innerText' : {
                'dayReportMsg' : ''
            },
            'value' : {
                'inputDayReport' : '',
                'inputEventPass' : '',
            },
        });
    }
}


// ──────────────────────────────────────────────────────
//  ローカルデータをDBに反映
// ………………………………………………………………………………………………………………………………………………
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

                var putReq = index.getAll(paramIndexedDB['event']);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;

                    const select = document.getElementById(paramIndexedDB['id']);
                    while( select.firstChild ){
                        select.removeChild(select.firstChild);
                    }

                    var option = document.createElement("option");
                    common_set_element({
                        'element'   : option,
                        'text'      : '選択してください',
                        'value'     : '',
                        'hidden'   : true,
                    });
                    select.appendChild(option);

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        common_set_element({
                            'element'   : option,
                            'text'      : data[key].name,
                            'value'     : data[key].name,
                        });
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

                var putReq = index.getAll(paramIndexedDB['event']);

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

                var putReq = index.getAll([
                    paramIndexedDB['event'],
                    paramIndexedDB['day']
                ]);

                putReq.onsuccess = function(event) {
                    // console.log('put data success');
                    var data = event.target.result;

                    let startList   = '';
                    let breakList   = '';
                    let endList     = '';
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

                    common_text_entry({
                        'innerText' : {
                            'startList' : startList,
                            'breakList' : breakList,
                            'endList'   : endList,
                        }
                    });
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

                var putReq = store.get(data);

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
                    common_text_entry({
                        'innerText' : {
                            'stampAreaDay'      : paramIndexedDB['day'],
                            'stampAreaStart'    : '',
                            'stampAreaBreak1s'  : '',
                            'stampAreaBreak1e'  : '',
                            'stampAreaBreak2s'  : '',
                            'stampAreaBreak2e'  : '',
                            'stampAreaBreak3s'  : '',
                            'stampAreaBreak3e'  : '',
                            'stampAreaEnd'      : '',
                        }
                    });
                    if (data) {
                        common_text_entry({
                            'innerText' : {
                                'stampAreaStart'    : data.start ?? '',
                                'stampAreaBreak1s'  : data.break1s ?? '',
                                'stampAreaBreak1e'  : data.break1e ?? '',
                                'stampAreaBreak2s'  : data.break2s ?? '',
                                'stampAreaBreak2e'  : data.break2e ?? '',
                                'stampAreaBreak3s'  : data.break3s ?? '',
                                'stampAreaBreak3e'  : data.break3e ?? '',
                                'stampAreaEnd'      : data.end ?? '',
                            }
                        });
                    }

                    // 出勤
                    let animeStampAreaStart= document.getElementById("stampAreaStart").animate(
                        [{ background : '#fff' }, { background : stampAreaColor }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaStart.cancel();
                    if (!data || !data.start) {
                        common_set_element({
                            'element'       : stampWorkS,
                            'disabled'      : false,
                            'background'    : '#000',
                        });
                        animeStampAreaStart.play();

                        var startOp = document.createElement("option");
                        common_set_element({
                            'element'   : startOp,
                            'id'        : 'startOp',
                            'text'      : '出勤',
                            'value'     : 'start',
                        });
                        editItemSelect.appendChild(startOp);
                    } else {
                        animeStampAreaStart.currentTime = 0;
                        common_set_element({
                            'element'       : stampWorkS,
                            'disabled'      : true,
                            'background'    : '#919191',
                        });
                    }

                    // 休憩
                    if (data && data.start && !data.end) {
                        if (
                            (data.break1s && !data.break1e) ||
                            (data.break2s && !data.break2e) ||
                            (data.break3s && !data.break3e)
                        ) {
                            common_set_element({
                                'element'       : stampBreakS,
                                'disabled'      : true,
                                'background'    : '#919191',
                            });
                            common_set_element({
                                'element'       : stampBreakE,
                                'disabled'      : false,
                                'background'    : '#97d769',
                            });
                        } else if (data.break3e) {
                            common_set_element({
                                'element'       : stampBreakS,
                                'disabled'      : true,
                                'background'    : '#919191',
                            });
                            common_set_element({
                                'element'       : stampBreakE,
                                'disabled'      : true,
                                'background'    : '#919191',
                            });
                        } else {
                            common_set_element({
                                'element'       : stampBreakS,
                                'disabled'      : false,
                                'background'    : '#97d769',
                            });
                            common_set_element({
                                'element'       : stampBreakE,
                                'disabled'      : true,
                                'background'    : '#919191',
                            });
                        }
                    } else {
                        common_set_element({
                            'element'       : stampBreakS,
                            'disabled'      : true,
                            'background'    : '#919191',
                        });
                        common_set_element({
                            'element'       : stampBreakE,
                            'disabled'      : true,
                            'background'    : '#919191',
                        });
                    }

                    // 休憩1開始
                    let animeStampAreaBreak1s= document.getElementById("stampAreaBreak1s").animate(
                        [{ background : '#fff' }, { background : '#97d769' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeStampAreaBreak1s.cancel();
                    if (data && data.start && !data.end && !data.break1s) {
                        common_set_element({
                            'element'   : stampBreakS,
                            'value'     : 'break1s',
                        });
                        animeStampAreaBreak1s.play();

                        var break1sOp = document.createElement("option");
                        common_set_element({
                            'element'   : break1sOp,
                            'id'        : 'break1sOp',
                            'text'      : '休憩1：開始',
                            'value'     : 'break1s',
                        });
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
                        common_set_element({
                            'element'   : stampBreakE,
                            'value'     : 'break1e',
                        });
                        animeStampAreaBreak1e.play();

                        var break1eOp = document.createElement("option");
                        common_set_element({
                            'element'   : break1eOp,
                            'id'        : 'break1eOp',
                            'text'      : '休憩1：終了',
                            'value'     : 'break1e',
                        });
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
                        common_set_element({
                            'element'   : stampBreakS,
                            'value'     : 'break2s',
                        });
                        animeStampAreaBreak2s.play();

                        var break2sOp = document.createElement("option");
                        common_set_element({
                            'element'   : break2sOp,
                            'id'        : 'break2sOp',
                            'text'      : '休憩2：開始',
                            'value'     : 'break2s',
                        });
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
                        common_set_element({
                            'element'   : stampBreakE,
                            'value'     : 'break2e',
                        });
                        animeStampAreaBreak2e.play();

                        var break2eOp = document.createElement("option");
                        common_set_element({
                            'element'   : break2eOp,
                            'id'        : 'break2eOp',
                            'text'      : '休憩2：終了',
                            'value'     : 'break2e',
                        });
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
                        common_set_element({
                            'element'   : stampBreakS,
                            'value'     : 'break3s',
                        });
                        animeStampAreaBreak3s.play();

                        var break3sOp = document.createElement("option");
                        common_set_element({
                            'element'   : break3sOp,
                            'id'        : 'break3sOp',
                            'text'      : '休憩3：開始',
                            'value'     : 'break3s',
                        });
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
                        common_set_element({
                            'element'   : stampBreakE,
                            'value'     : 'break3e',
                        });
                        animeStampAreaBreak3e.play();

                        var break3eOp = document.createElement("option");
                        common_set_element({
                            'element'   : break3eOp,
                            'id'        : 'break3eOp',
                            'text'      : '休憩3：終了',
                            'value'     : 'break3e',
                        });
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
                        common_set_element({
                            'element'       : stampWorkE,
                            'disabled'      : false,
                            'background'    : '#000',
                        });
                        animeStampAreaEnd.play();

                        var endOp = document.createElement("option");
                        common_set_element({
                            'element'   : endOp,
                            'id'        : 'endOp',
                            'text'      : '退勤',
                            'value'     : 'end',
                        });
                        editItemSelect.appendChild(endOp);
                    } else {
                        animeStampAreaEnd.currentTime = 0;
                        common_set_element({
                            'element'       : stampWorkE,
                            'disabled'      : true,
                            'background'    : '#919191',
                        });
                    }

                    // 退勤打刻後
                    if (data && data.end) {
                        if (!data.break1s) {
                            var break1sOp = document.createElement("option");
                            common_set_element({
                                'element'   : break1sOp,
                                'id'        : 'break1sOp',
                                'text'      : '休憩1：開始',
                                'value'     : 'break1s',
                            });
                            editItemSelect.appendChild(break1sOp);
                        }
                        if (!data.break1e) {
                            var break1eOp = document.createElement("option");
                            common_set_element({
                                'element'   : break1eOp,
                                'id'        : 'break1eOp',
                                'text'      : '休憩1：終了',
                                'value'     : 'break1e',
                            });
                            editItemSelect.appendChild(break1eOp);
                        }
                        if (!data.break2s) {
                            var break2sOp = document.createElement("option");
                            common_set_element({
                                'element'   : break2sOp,
                                'id'        : 'break2sOp',
                                'text'      : '休憩2：開始',
                                'value'     : 'break2s',
                            });
                            editItemSelect.appendChild(break2sOp);
                        }
                        if (!data.break2e) {
                            var break2eOp = document.createElement("option");
                            common_set_element({
                                'element'   : break2eOp,
                                'id'        : 'break2eOp',
                                'text'      : '休憩2：終了',
                                'value'     : 'break2e',
                            });
                            editItemSelect.appendChild(break2eOp);
                        }
                        if (!data.break3s) {
                            var break3sOp = document.createElement("option");
                            common_set_element({
                                'element'   : break3sOp,
                                'id'        : 'break3sOp',
                                'text'      : '休憩3：開始',
                                'value'     : 'break3s',
                            });
                            editItemSelect.appendChild(break3sOp);
                        }
                        if (!data.break3e) {
                            var break3eOp = document.createElement("option");
                            common_set_element({
                                'element'   : break3eOp,
                                'id'        : 'break3eOp',
                                'text'      : '休憩3：終了',
                                'value'     : 'break3e',
                            });
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

                var putReq = index.getAll([paramIndexedDB['event']]);

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

                var putReq = index.getAll([paramIndexedDB['event']]);

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
                        common_set_element({
                            'element'   : option,
                            'text'      : data[key],
                            'value'     : data[key],
                        });
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
                // 初期値
                common_text_entry({'innerText' : {'loginMsg' : ''}});

                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    if (result == 'true') {
                        localStorage.setItem("event", paramDB['inputEvent']);

                        window.location.reload();
                    } else {
                        common_text_entry({'innerText' : {'loginMsg' : 'パスワードが誤っています。'}});
                    }
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
                            common_set_element({
                                'element'   : option,
                                'text'      : data[key].day,
                                'value'     : value,
                            });
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
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'dayReportMsg' : ''
                    },
                    'value' : {
                        'inputDayReport' : '',
                        'inputEventPass' : '',
                    },
                });
                common_clear_children({
                    'all'   : {
                        'dayReportSelect'   : 'option',
                        'dayReportList'     : 'td',
                    },
                    'notId' : {
                        'dayReportEditList' : 'tr',
                    }
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
                            common_set_element({
                                'element'   : option,
                                'text'      : date.toLocaleDateString('sv-SE'),
                                'value'     : date.toLocaleDateString('sv-SE'),
                            });
                            document.getElementById("dayReportSelect").appendChild(option);
                        }
                        common_set_element({
                            'element'   : document.getElementById("dayReportSelect"),
                            'value'     : paramDB['day'],
                        });


                        if (data.event.report) {
                            // 登録済み日報
                            common_op_view({
                                'flex'  : ['dayReportDispArea'],
                                'none'  : ['dayReportEditArea']
                            });
                            common_set_element({
                                'element'   : document.getElementById("dayReportDispList").querySelector('p'),
                                'innerHTML' : data.event.report.replaceAll("\n", "<br>"),
                            });
                        } else  {
                            common_op_view({
                                'none'  : ['dayReportDispArea'],
                                'flex'  : ['dayReportEditArea']
                            });

                            // 名前
                            const dayReportListA = document.getElementById("dayReportList").querySelectorAll("tr");
                            Object.keys(data.staffList).forEach(function(keyName) {
                                var namaData = data.staffList[keyName];

                                // 勤怠修正情報
                                if (Object.keys(namaData.workReportEdit).length) {
                                    Object.keys(namaData.workReportEdit).forEach(function(keyEdit) {
                                        var editData = namaData.workReportEdit[keyEdit];

                                        var workReportEditTr = document.createElement("tr");

                                        // ステータス
                                        var status = document.createElement("td");
                                        common_set_element({
                                            'element'   : status,
                                            'className' : 'sticky1',
                                        });
                                        var statusI1 = document.createElement("input");
                                        common_set_element({
                                            'element'   : statusI1,
                                            'id'        : 'approve' + keyEdit,
                                            'value'     :
                                                '承認済'
                                                + '|' + editData.request_dt
                                                + '|' + keyName
                                                + '|' + editData.day
                                                + '|' + editData.item
                                                + '|' + editData.data_after
                                            ,
                                            'name'      : 'status' + keyEdit,
                                            'type'      : 'radio',
                                        });
                                        var statusL1 = document.createElement("label");
                                        common_set_element({
                                            'element'   : statusL1,
                                            'innerText' : '承認',
                                            'htmlFor'   : 'approve' + keyEdit,
                                        });
                                        var statusI2 = document.createElement("input");
                                        common_set_element({
                                            'element'   : statusI2,
                                            'id'        : 'reject' + keyEdit,
                                            'value'     :
                                                '却下済'
                                                + '|' + editData.request_dt
                                                + '|' + keyName
                                                + '|' + editData.day
                                                + '|' + editData.item
                                                + '|' + editData.data_before
                                            ,
                                            'name'      : 'status' + keyEdit,
                                            'type'      : 'radio',
                                        });
                                        var statusL2 = document.createElement("label");
                                        common_set_element({
                                            'element'   : statusL2,
                                            'innerText' : '却下',
                                            'htmlFor'   : 'reject' + keyEdit,
                                        });
                                        status.appendChild(statusI1);
                                        status.appendChild(statusL1);
                                        status.appendChild(statusI2);
                                        status.appendChild(statusL2);
                                        workReportEditTr.appendChild(status);

                                        // 名前
                                        var reportEditname = document.createElement("td");
                                        common_set_element({
                                            'element'   : reportEditname,
                                            'innerText' : keyName,
                                        });
                                        workReportEditTr.appendChild(reportEditname);

                                        // 項目
                                        var item = document.createElement("td");
                                        common_set_element({
                                            'element'   : item,
                                            'innerText' : common_itemName(editData.item),
                                        });
                                        workReportEditTr.appendChild(item);

                                        // 修正前
                                        var before = document.createElement("td");
                                        common_set_element({
                                            'element'   : before,
                                            'innerHTML' : editData.day + '<br>' + editData.data_before,
                                        });
                                        workReportEditTr.appendChild(before);

                                        // 修正後
                                        var after = document.createElement("td");
                                        common_set_element({
                                            'element'   : after,
                                            'innerHTML' : editData.day + '<br>' + editData.data_after,
                                        });
                                        workReportEditTr.appendChild(after);

                                        // 理由
                                        var reason = document.createElement("td");
                                        common_set_element({
                                            'element'   : reason,
                                            'className' : 'w25',
                                            'innerText' : editData.reason,
                                        });
                                        workReportEditTr.appendChild(reason);

                                        document.getElementById("dayReportEditList").querySelector("tbody").appendChild(workReportEditTr);
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
                                    var name = document.createElement("td");
                                    common_set_element({
                                        'element'   : name,
                                        'className' : 'ececec bold',
                                        'innerText' : keyName,
                                        'colSpan'   : '3',
                                    });
                                    dayReportListA[0].appendChild(name);

                                    // 項目
                                    var item1 = document.createElement("td");
                                    common_set_element({
                                        'element'   : item1,
                                        'className' : 'ececec bold borderRight',
                                        'innerText' : 'シフト',
                                    });
                                    var item2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : item2,
                                        'className' : 'ececec bold borderRight borderLeftNone',
                                        'innerText' : '打刻',
                                    });
                                    var item3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : item3,
                                        'className' : 'ececec bold borderLeftNone',
                                        'innerText' : '勤怠',
                                    });
                                    dayReportListA[1].appendChild(item1);
                                    dayReportListA[1].appendChild(item2);
                                    dayReportListA[1].appendChild(item3);

                                    // 出勤
                                    var ceilWS = common_validation_time(dataWS) ? common_ceil(dataWS) : '-';
                                    var start1 = document.createElement("td");
                                    common_set_element({
                                        'element'   : start1,
                                        'className' : 'borderRight',
                                        'innerText' : dataSS,
                                    });
                                    var start2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : start2,
                                        'className' : 'borderRight borderLeftNone',
                                        'innerText' : dataWS,
                                    });
                                    var start3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : start3,
                                        'className' : 'borderLeftNone',
                                    });
                                    var start3B = document.createElement("button");
                                    common_set_element({
                                        'element'   : start3B,
                                        'innerText' : ceilWS,
                                        'value'     : keyName + '[出勤]' + ceilWS,
                                    });
                                    start3.appendChild(start3B);
                                    dayReportListA[2].appendChild(start1);
                                    dayReportListA[2].appendChild(start2);
                                    dayReportListA[2].appendChild(start3);

                                    // 休憩1：開始
                                    var ceilWB1s = common_validation_time(dataWB1s) ? common_ceil(dataWB1s) : '-';
                                    var break1s1 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break1s1,
                                        'className' : 'borderTopNone borderRight diagonalLine',
                                        'rowSpan'   : '6',
                                    });
                                    var break1s2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break1s2,
                                        'className' : 'borderBottom borderTopNone borderRight borderLeftNone',
                                        'innerText' : dataWB1s,
                                    });
                                    var break1s3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break1s3,
                                        'className' : 'borderBottom borderTopNone borderLeftNone',
                                    });
                                    var break1sB = document.createElement("button");
                                    common_set_element({
                                        'element'   : break1sB,
                                        'innerText' : ceilWB1s,
                                        'value'     : keyName + '[休憩1：開始]' + ceilWB1s,
                                    });
                                    break1s3.appendChild(break1sB);
                                    dayReportListA[3].appendChild(break1s1);
                                    dayReportListA[3].appendChild(break1s2);
                                    dayReportListA[3].appendChild(break1s3);

                                    // 休憩1：終了
                                    var ceilWB1e = common_validation_time(dataWB1e) ? common_ceil(dataWB1e) : '-';
                                    var break1e2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break1e2,
                                        'className' : 'borderTopNone borderRight borderLeftNone',
                                        'innerText' : dataWB1e,
                                    });
                                    var break1e3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break1e3,
                                        'className' : 'borderTopNone borderLeftNone',
                                    });
                                    var break1eB = document.createElement("button");
                                    common_set_element({
                                        'element'   : break1eB,
                                        'innerText' : ceilWB1e,
                                        'value'     : keyName + '[休憩1：終了]' + ceilWB1e,
                                    });
                                    break1e3.appendChild(break1eB);
                                    dayReportListA[4].appendChild(break1e2);
                                    dayReportListA[4].appendChild(break1e3);

                                    // 休憩2：開始
                                    var ceilWB2s = common_validation_time(dataWB2s) ? common_ceil(dataWB2s) : '-';
                                    var break2s2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break2s2,
                                        'className' : 'borderBottom borderTopNone borderRight borderLeftNone',
                                        'innerText' : dataWB2s,
                                    });
                                    var break2s3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break2s3,
                                        'className' : 'borderBottom borderTopNone borderLeftNone',
                                    });
                                    var break2sB = document.createElement("button");
                                    common_set_element({
                                        'element'   : break2sB,
                                        'innerText' : ceilWB2s,
                                        'value'     : keyName + '[休憩2：開始]' + ceilWB2s,
                                    });
                                    break2s3.appendChild(break2sB);
                                    dayReportListA[5].appendChild(break2s2);
                                    dayReportListA[5].appendChild(break2s3);

                                    // 休憩2：終了
                                    var ceilWB2e = common_validation_time(dataWB2e) ? common_ceil(dataWB2e) : '-';
                                    var break2e2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break2e2,
                                        'className' : 'borderTopNone borderRight borderLeftNone',
                                        'innerText' : dataWB2e,
                                    });
                                    var break2e3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break2e3,
                                        'className' : 'borderTopNone borderLeftNone',
                                    });
                                    var break2eB = document.createElement("button");
                                    common_set_element({
                                        'element'   : break2eB,
                                        'innerText' : ceilWB2e,
                                        'value'     : keyName + '[休憩2：終了]' + ceilWB2e,
                                    });
                                    break2e3.appendChild(break2eB);
                                    dayReportListA[6].appendChild(break2e2);
                                    dayReportListA[6].appendChild(break2e3);

                                    // 休憩3：開始
                                    var ceilWB3s = common_validation_time(dataWB3s) ? common_ceil(dataWB3s) : '-';
                                    var break3s2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break3s2,
                                        'className' : 'borderBottom borderTopNone borderRight borderLeftNone',
                                        'innerText' : dataWB3s,
                                    });
                                    var break3s3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break3s3,
                                        'className' : 'borderBottom borderTopNone borderLeftNone',
                                    });
                                    var break3sB = document.createElement("button");
                                    common_set_element({
                                        'element'   : break3sB,
                                        'innerText' : ceilWB3s,
                                        'value'     : keyName + '[休憩3：開始]' + ceilWB3s,
                                    });
                                    break3s3.appendChild(break3sB);
                                    dayReportListA[7].appendChild(break3s2);
                                    dayReportListA[7].appendChild(break3s3);

                                    // 休憩3：終了
                                    var ceilWB3e = common_validation_time(dataWB3e) ? common_ceil(dataWB3e) : '-';
                                    var break3e2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break3e2,
                                        'className' : 'borderTopNone borderRight borderLeftNone',
                                        'innerText' : dataWB3e,
                                    });
                                    var break3e3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : break3e3,
                                        'className' : 'borderTopNone borderLeftNone',
                                    });
                                    var break3eB = document.createElement("button");
                                    common_set_element({
                                        'element'   : break3eB,
                                        'innerText' : ceilWB3e,
                                        'value'     : keyName + '[休憩3：終了]' + ceilWB3e,
                                    });
                                    break3e3.appendChild(break3eB);
                                    dayReportListA[8].appendChild(break3e2);
                                    dayReportListA[8].appendChild(break3e3);

                                    // 退勤
                                    var ceilWE = common_validation_time(dataWE) ? common_floor(ceilWS, dataWE) : '-';
                                    var end1 = document.createElement("td");
                                    common_set_element({
                                        'element'   : end1,
                                        'className' : 'borderTopNone borderRight',
                                        'innerText' : dataSE,
                                    });
                                    var end2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : end2,
                                        'className' : 'borderTopNone borderRight borderLeftNone',
                                        'innerText' : dataWE,
                                    });
                                    var end3 = document.createElement("td");
                                    common_set_element({
                                        'element'   : end3,
                                        'className' : 'borderTopNone borderLeftNone',
                                    });
                                    var end3B = document.createElement("button");
                                    common_set_element({
                                        'element'   : end3B,
                                        'innerText' : ceilWE,
                                        'value'     : keyName + '[退勤]' + ceilWE,
                                    });
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
                                    var sumBreak1 = document.createElement("td");
                                    common_set_element({
                                        'element'   : sumBreak1,
                                        'className' : 'bold borderRight',
                                        'innerText' : shiftTimeB,
                                    });
                                    var sumBreak2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : sumBreak2,
                                        'className' : 'bold borderLeftNone',
                                        'innerText' : reportTimeB,
                                        'colSpan'   : '2',
                                    });
                                    dayReportListA[10].appendChild(sumBreak1);
                                    dayReportListA[10].appendChild(sumBreak2);

                                    // 実働時間
                                    var sumWork1 = document.createElement("td");
                                    common_set_element({
                                        'element'   : sumWork1,
                                        'className' : 'bold borderRight',
                                        'innerText' : shiftTimeW,
                                    });
                                    var sumWork2 = document.createElement("td");
                                    common_set_element({
                                        'element'   : sumWork2,
                                        'className' : 'bold borderLeftNone',
                                        'innerText' : reportTimeW,
                                        'colSpan'   : '2',
                                    });
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
                        if (paramDB['data'].day < common_date().yyyymmdd) {
                            var paramIndexedDB = {
                                event   : paramDB['data'].event,
                                day     : paramDB['data'].day,
                                name    : paramDB['data'].name,
                            };
                            opIndexedDB('deleteWorkReport', paramIndexedDB);
                        }

                        common_text_entry({'textContent' : {'reflevted' : '最終反映：' + common_date().yyyymmddhhmmss}});
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
                // 初期値
                common_clear_children({
                    'all'   : {
                        'editList'   : 'td',
                    },
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);
 
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

                                        // 対象日
                                        if (dayNum[dayKey] == 1) {
                                            common_set_element({
                                                'element'       : day,
                                                'className'     : 'sticky1',
                                                'innerText'     : dayKey,
                                                'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                'rowSpan'       : dayNum[dayKey],
                                            });
                                            tr.appendChild(day);
                                        } else {
                                            common_set_element({
                                                'element'       : day,
                                                'className'     : 'sticky1 valueTop',
                                                'rowSpan'       : dayNum[dayKey],
                                            });
                                        }

                                        // 項目
                                        if (itemNum[itemKey] == 1) {
                                            common_set_element({
                                                'element'       : item,
                                                'className'     : 'sticky2',
                                                'innerText'     : common_itemName(itemKey),
                                                'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                'rowSpan'       : itemNum[itemKey],
                                            });
                                            tr.appendChild(item);
                                        } else {
                                            common_set_element({
                                                'element'       : item,
                                                'className'     : 'sticky2 valueTop',
                                                'rowSpan'       : itemNum[itemKey],
                                            });
                                        }

                                        // 状態
                                        var status = document.createElement("td");
                                        common_set_element({
                                            'element'       : status,
                                            'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                        });
                                        var statusB = document.createElement("p");
                                        common_set_element({
                                            'element'       : statusB,
                                            'className'     : 'statusB',
                                            'innerText'     : dataItem[key].status,
                                            'background'    : common_workReportEditStatus_color(dataItem[key].status),
                                            });
                                        status.appendChild(statusB);
                                        tr.appendChild(status);

                                        // 修正前
                                        var data_before = document.createElement("td");
                                        common_set_element({
                                            'element'       : data_before,
                                            'innerText'     : dataItem[key].data_before,
                                            'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                        });
                                        tr.appendChild(data_before);

                                        // 修正後
                                        var data_after = document.createElement("td");
                                        common_set_element({
                                            'element'       : data_after,
                                            'innerText'     : dataItem[key].data_after,
                                            'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                        });
                                        tr.appendChild(data_after);

                                        // 理由
                                        var reason = document.createElement("td");
                                        common_set_element({
                                            'element'       : reason,
                                            'className'     : 'reason textStart w25',
                                            'innerText'     : dataItem[key].reason,
                                            'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                        });
                                        tr.appendChild(reason);

                                        // 申請日
                                        var request_dt = document.createElement("td");
                                        common_set_element({
                                            'element'       : request_dt,
                                            'className'     : 'requestDt w25',
                                            'innerText'     : dataItem[key].request_dt,
                                            'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                        });
                                        tr.appendChild(request_dt);

                                        // 承認日
                                        var approval_d = document.createElement("td");
                                        common_set_element({
                                            'element'       : approval_d,
                                            'innerText'     : dataItem[key].approval_d,
                                            'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                        });
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
                            if (paramDB['data'].requestDt.substr(0, 8) < common_date().yyyymmdd) {
                                var paramIndexedDB = {
                                    event   : paramDB['data'].event,
                                    day     : paramDB['data'].day,
                                    name    : paramDB['data'].name,
                                    item    : paramDB['data'].item,
                                };
                                opIndexedDB('deleteWorkReportEdit', paramIndexedDB);

                                common_text_entry({'textContent' : {'reflevted' : '最終反映：' + common_date().yyyymmddhhmmss}});
                            }
                        } else {
                            var nextParamDB = {
                                'event' : paramDB['data'].event,
                                'name'  : paramDB['data'].name
                            };
                            opDB('getWorkReportEdit', nextParamDB);
                        }

                        common_text_entry({
                            'innerText' : {
                                'editMsg' : ''
                            },
                            'value' : {
                                'editWorkReportReason' : ''
                            },
                        });
                    } else {
                        common_text_entry({'innerText' : {'editMsg' : '申請登録できませんでした。'}});
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
                        common_text_entry({'innerText' : {'dayReportMsg' : 'パスワードが誤っています。'}});
                    }else {
                        common_text_entry({'innerText' : {'dayReportMsg' : '日報の登録ができませんでした。'}});
                    }
                }
            }
            break;
    }

    xmlhttp.open("POST", strUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}