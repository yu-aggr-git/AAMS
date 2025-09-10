window.onload = () => {

    // ───ネットワーク判定────────────────────────────────────────
    var isOnline = navigator.onLine;
    isOnline ? online() : offline();

    window.addEventListener("online", function(){
        window.location.reload();
    }, false);

    window.addEventListener("offline", function() {
        window.location.reload();
    }, false)
}

// オフライン
function offline() {
    console.log('インターネットから切断されました');

    // 表示切替
    document.getElementById("modal").style.display = 'none';
    document.getElementById("networkStatus").textContent = 'off-line';
    document.getElementById("networkStatus").style.background = '#41438bff';
}

// オンライン
function online() {
    console.log('インターネットに接続中です');
    
    // 表示切替
    document.getElementById("networkStatus").textContent = 'on-line';
    document.getElementById("networkStatus").style.background = '#dc4618ff';


    // ───ログイン───────────────────────────────────────────────────────────────────
    const adminUser = window.localStorage.getItem("adminUser");
    if (!adminUser) {
        adminLogin();
    }


    // ───ログアウト──────────────────────────────────────────────────────────────────
    document.getElementById("adminLogout").onclick = function() {
        localStorage.removeItem('adminUser');
        window.location.reload();
    }


    // ───表示エリアの操作────────────────────────────────────────────────────────────
    document.getElementById("eventInfoAreaOpen").onclick = function() {
        areaOpen(this, ['eventInfoArea']);
    }
    document.getElementById("workReportInfoAreaOpen").onclick = function() {
        areaOpen(this, ['workReportInfoArea']);
    }
    document.getElementById("stampInfoAreaOpen").onclick = function() {
        areaOpen(this, ['stampInfoArea']);
    }
    document.getElementById("workReportInfoEditAreaOpen").onclick = function() {
        areaOpen(this, ['workReportInfoEditArea']);
    }


    // ───イベントの取得──────────────────────────────────────────────────────────────    
    opDB('getEventList', null);


    // ───イベントの選択──────────────────────────────────────────────────────────────
    document.getElementById("sendSelectEvent").onclick = function() {
        const selectEvent = document.getElementById("selectEvent").value;
        getSelectEvent(selectEvent);
    }


    // ───イベントの編集──────────────────────────────────────────────────────────────
    document.getElementById("registerEvent").onclick = function() {
        eventEdit(this.id);
    }
    document.getElementById("deleteEvent").onclick = function() {
        eventEdit(this.id);
    }
    document.getElementById("editEventEdit").onclick = function() {
        eventEdit(this.id);
    }
    document.getElementById("cancelEventEdit").onclick = function() {
        eventEdit(this.id);
    }
    document.getElementById("sendEventEdit").onclick = function() {
        eventEdit(this.id);
    }


    // ───打刻情報の表示──────────────────────────────────────────────────────────────
    document.getElementById("sendStampInfo").onclick = function() {
        document.getElementById("stampInfoEditMsg").innerHTML = '';

        const selectEvent = document.getElementById("eventName").textContent;
        const selectStaff = document.getElementById("selectStampInfoStaff").value;
        const selectDay = document.getElementById("selectStampInfoDay").value;

        var paramDB = {
            'event' : selectEvent,
            'name'  : selectStaff,
            'day'   : selectDay
        };
        opDB('getWorkReportDay', paramDB);
    }

    
    // ───打刻情報の修正──────────────────────────────────────────────────────────────
    document.getElementById("editStampInfoEdit").onclick = function() {
        stampInfoEdit(this.id);
    }
    document.getElementById("cancelStampInfoEdit").onclick = function() {
        stampInfoEdit(this.id);
    }
    document.getElementById("sendStampInfoEdit").onclick = function() {
        stampInfoEdit(this.id);
    }
   

    // ───勤怠修正情報の操作──────────────────────────────────────────────────────────────
    document.getElementById("approveWorkReportInfo").onclick = function() {
        workReportInfoEdit(this.id);
    }
    document.getElementById("rejectWorkReportInfo").onclick = function() {
        workReportInfoEdit(this.id);
    }
}


// 管理者ログイン
function adminLogin() {
    document.getElementById("modal").style.display = 'flex';
    document.body.style.overflow = 'hidden';

    document.getElementById("sendAdminUser").onclick = function() {
        var inputAdminUser = document.getElementById("adminUser").value;
        var inputAdminUserPass = document.getElementById("adminUserPass").value;

        if (!inputAdminUser || !inputAdminUserPass) {
            document.getElementById("adminMsg").innerText = 'すべての項目に入力が必要です。';
        } else {
            var paramDB = {
                'inputAdminUser'     : inputAdminUser,
                'inputAdminUserPass' : inputAdminUserPass
            };
            opDB('adminLogin', paramDB);
        }
    }    
}


// 表示／非表示の操作
function opView(itemList) {
    Object.keys(itemList).forEach(function(op) {
        Object.keys(itemList[op]).forEach(function(item) {
            document.getElementById(itemList[op][item]).style.display = op;
        });
    });
}


// 表示エリアの操作
function areaOpen(item, opItemList) {
    var mark    = item.querySelector("span").textContent;
    var op      = mark == '▼' ? 'none' : 'flex';
    var markC   = mark == '▼' ? '▲' : '▼';
    var color   = mark == '▼' ? '#000' : '#dc4618ff';

    var itemList = { [op] : opItemList };
    opView(itemList);
    item.querySelector("span").innerText = markC;
    item.querySelector("span").style.color = color;
}


// イベントの選択
function getSelectEvent(selectEvent) {
    document.getElementById("eventEditMsg").innerText           = '';
    document.getElementById("stampInfoEvent").innerText         = '';
    document.getElementById("stampInfoStaff").innerText         = '';
    document.getElementById("stampInfoDay").innerText           = '';
    document.getElementById("stampInfoStart").innerText         = '';
    document.getElementById("stampInfoBreak1s").innerText       = '';
    document.getElementById("stampInfoBreak1e").innerText       = '';
    document.getElementById("stampInfoBreak2s").innerText       = '';
    document.getElementById("stampInfoBreak2e").innerText       = '';
    document.getElementById("stampInfoBreak3s").innerText       = '';
    document.getElementById("stampInfoBreak3e").innerText       = '';
    document.getElementById("stampInfoEnd").innerText           = '';
    document.getElementById("workReportInfoEditMsg").innerText  = '';
    const approve = document.getElementById('approveWorkReportInfo');
    approve.value            = 'false';
    approve.style.color      = '#000';
    approve.style.background = '#fff';
    const reject = document.getElementById('rejectWorkReportInfo');
    reject.value            = 'false';
    reject.style.color      = '#000';
    reject.style.background = '#fff';
    

    if (selectEvent) {
        var itemList = {
            'block' : [
                'eventName',
                'pass',
                'firstDay',
                'endDay',
                'shiftUrl',
                'staff',
                'deleteEvent',
                'editEventEdit'
            ],
            'none'  : [
                'inputEventName',
                'inputPass',
                'inputFirstDayArea',
                'inputEndDayArea',
                'inputShiftUrl',
                'inputStaff',
                'registerEvent',
                'cancelEventEdit',
                'sendEventEdit'
            ],
            'flex'  : [
                'workReportInfoAreaOpen',
                'stampInfoAreaOpen',
                'workReportInfoEditAreaOpen',
            ]
        }
        opView(itemList);

        var paramDB = { 'event': selectEvent, };
        opDB('getEvent', paramDB);
        opDB('getStaffList', paramDB);
        opDB('getWorkReportEditAll', paramDB);
    } else {
        window.location.reload();
    }
}


// イベントの編集
function eventEdit(id) {
    document.getElementById("eventEditMsg").innerText = '';

    const inputEvent        = document.getElementById("eventName").textContent;
    const inputStaff        = document.getElementById("inputStaff").value.replace(/(\t| +|　+)/g, "");
    const inputStaffList    = inputStaff.split(/\n/);

    var paramDB = {
        'eventName' : inputEvent,
        'pass'      : document.getElementById("inputPass").value,
        'firstDay'  :
              document.getElementById("inputFirstYear").value + '-'
            + document.getElementById("inputFirstMonth").value + '-'
            + document.getElementById("inputFirstDay").value,
        'endDay'  :
              document.getElementById("inputEndYear").value + '-'
            + document.getElementById("inputEndMonth").value + '-'
            + document.getElementById("inputEndDay").value,
        'shiftUrl'  : document.getElementById("inputShiftUrl").value,
        'staffList' : inputStaffList,
    };

    switch (id) {
        case 'registerEvent':
            paramDB['eventName'] = document.getElementById("inputEventName").value;

            if (!paramDB['eventName'] || !paramDB['pass']) {
                document.getElementById("eventEditMsg").innerText = '*イベント名とパスワードの入力は必須です。';
            } else {
                var result = window.confirm('イベントを登録してよろしいですか？');

                if (result) {
                    opDB('registerEvent', paramDB);
                }
            }
            break;

        case 'deleteEvent':
            var result = window.confirm('イベントを削除すると、\n関連する打刻データなどがすべて消去されます。\nイベントを削除してよろしいですか？');

            if (result) {
                opDB('deleteEvent', paramDB);
            }
            break;

        case 'editEventEdit':
            var itemList = {
                'block' : ['eventName', 'inputPass', 'inputShiftUrl', 'inputStaff', 'cancelEventEdit' ,'sendEventEdit'],
                'none'  : ['pass', 'firstDay', 'endDay', 'shiftUrl', 'staff', 'inputEventName', 'deleteEvent', 'editEventEdit'],
                'flex'  : ['inputFirstDayArea', 'inputEndDayArea']
            }
            opView(itemList);

            document.getElementById("inputPass").placeholder = '変更しない場合は入力しないこと';

            const selectFirstYear = document.getElementById("inputFirstYear");
            const firstDay = document.getElementById("firstDay").textContent;
            const firstDayA = firstDay.split(/-/);
            Array.from(selectFirstYear.querySelectorAll("option")).forEach(function(e) {
                e.remove();
            });
            for (let i = 0; i <= 1; i++) {
                var option = document.createElement("option"); 
                option.text = Number(firstDayA[0]) + i;
                option.value = Number(firstDayA[0]) + i;
                selectFirstYear.appendChild(option);
            }

            const selectEndYear = document.getElementById("inputEndYear");
            const endDay = document.getElementById("endDay").textContent;
            const endDayA = endDay.split(/-/);
            Array.from(selectEndYear.querySelectorAll("option")).forEach(function(e) {
                e.remove();
            });
            for (let i = 0; i <= 1; i++) {
                var option = document.createElement("option"); 
                option.text = Number(endDayA[0]) + i;
                option.value = Number(endDayA[0]) + i;
                selectEndYear.appendChild(option);
            }
            break;

        case 'cancelEventEdit':
            var itemList = {
                'block' : ['pass', 'firstDay', 'endDay', 'shiftUrl', 'staff', 'deleteEvent', 'editEventEdit'],
                'none'  : ['inputPass', 'inputFirstDayArea', 'inputEndDayArea', 'inputShiftUrl', 'inputStaff', 'cancelEventEdit' ,'sendEventEdit']
            }
            opView(itemList);
            break;

        case 'sendEventEdit':
            var result = window.confirm('イベントを更新してよろしいですか？');
            if (result) {
                opDB('updateEvent', paramDB);
            }
            break;
    }
}


// 打刻情報の修正
function stampInfoEdit(id) {
    switch (id) {
        case 'editStampInfoEdit':
            document.getElementById("stampInfoEditMsg").innerHTML = '';

            var itemList = {
                'block' : [
                    'cancelStampInfoEdit',
                    'sendStampInfoEdit',
                ],
                'none'  : [
                    'editStampInfoEdit',
                    'stampInfoStart',
                    'stampInfoBreak1s',
                    'stampInfoBreak1e',
                    'stampInfoBreak2s',
                    'stampInfoBreak2e',
                    'stampInfoBreak3s',
                    'stampInfoBreak3e',
                    'stampInfoEnd',
                ],
                'table-row'  : [
                    'stampInfoReason'
                ],
                'table-cell'  : [
                    'editStampInfoStart',
                    'editStampInfoBreak1s',
                    'editStampInfoBreak1e',
                    'editStampInfoBreak2s',
                    'editStampInfoBreak2e',
                    'editStampInfoBreak3s',
                    'editStampInfoBreak3e',
                    'editStampInfoEnd',
                ]
            }
            opView(itemList);

            break;
    
        case 'cancelStampInfoEdit':
            var itemList = {
                'block' : [
                    'editStampInfoEdit',
                ],
                'none'  : [
                    'cancelStampInfoEdit',
                    'sendStampInfoEdit',
                    'editStampInfoStart',
                    'editStampInfoBreak1s',
                    'editStampInfoBreak1e',
                    'editStampInfoBreak2s',
                    'editStampInfoBreak2e',
                    'editStampInfoBreak3s',
                    'editStampInfoBreak3e',
                    'editStampInfoEnd',
                    'stampInfoReason',
                ],
                'table-cell'  : [
                    'stampInfoStart',
                    'stampInfoBreak1s',
                    'stampInfoBreak1e',
                    'stampInfoBreak2s',
                    'stampInfoBreak2e',
                    'stampInfoBreak3s',
                    'stampInfoBreak3e',
                    'stampInfoEnd',
                ]
            }
            opView(itemList);
            break;

        case 'sendStampInfoEdit':
            const inputEvent    = document.getElementById("stampInfoEvent").textContent;
            const inputStaff    = document.getElementById("stampInfoStaff").textContent;
            const inputDay      = document.getElementById("stampInfoDay").textContent;
            const inputReason   = document.getElementById("editStampInfoReason").value;
            const input = {
                'start' : {
                    "h" : document.getElementById("editStampInfoStartHour").value,
                    "m" : document.getElementById("editStampInfoStartMinutes").value,
                },
                'break1s' : {
                    "h" : document.getElementById("editStampInfoBreak1sHour").value,
                    "m" : document.getElementById("editStampInfoBreak1sMinutes").value,
                },
                'break1e' : {
                    "h" : document.getElementById("editStampInfoBreak1eHour").value,
                    "m" : document.getElementById("editStampInfoBreak1eMinutes").value,
                },
                'break2s' : {
                    "h" : document.getElementById("editStampInfoBreak2sHour").value,
                    "m" : document.getElementById("editStampInfoBreak2sMinutes").value,
                },
                'break2e' : {
                    "h" : document.getElementById("editStampInfoBreak2eHour").value,
                    "m" : document.getElementById("editStampInfoBreak2eMinutes").value,
                },
                'break3s' : {
                    "h" : document.getElementById("editStampInfoBreak3sHour").value,
                    "m" : document.getElementById("editStampInfoBreak3sMinutes").value,
                },
                'break3e' : {
                    "h" : document.getElementById("editStampInfoBreak3eHour").value,
                    "m" : document.getElementById("editStampInfoBreak3eMinutes").value,
                },
                'end' : {
                    "h" : document.getElementById("editStampInfoEndHour").value,
                    "m" : document.getElementById("editStampInfoEndMinutes").value,
                },
            }

            if (!inputReason) {
                document.getElementById("stampInfoEditMsg").innerText = '申請理由に入力が必要です。';
            } else {
                const item = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];

                const result = window.confirm('打刻時間を訂正してよろしいですか？');
                if (result) {
                    let msg = '';

                    let count = 0;                    
                    for(let i = 0; i < item.length; i++) {
                        let dataBefore = '';
                        let dataAfter = '';

                        if (input[item[i]].h != '-' && input[item[i]].m != '-' ) {
                            var itemU   = item[i].charAt(0).toUpperCase() + item[i].slice(1);

                            dataBefore  = document.getElementById('stampInfo' + itemU).textContent;
                            dataAfter   = input[item[i]].h + ':' + input[item[i]].m;
                
                            var paramDB = {
                                'requestDt'  : date().yyyymmddhhmmss,
                                'event'      : inputEvent,
                                'name'       : inputStaff,
                                'day'        : inputDay, 
                                'item'       : item[i],
                                'dataBefore' : dataBefore != '' ? dataBefore : '-',
                                'dataAfter'  : dataAfter,
                                'reason'     : inputReason,
                                'status'     : '訂正中',
                            };
                            opDB('registerWorkReportEdit', paramDB);
                        } else if (
                            (input[item[i]].h == '-' && input[item[i]].m != '-' ) ||
                            (input[item[i]].h != '-' && input[item[i]].m == '-' )
                        ) {
                            msg = msg
                                + '\n' + itemName(item[i]) + '=' + input[item[i]].h + ':' + input[item[i]].m 
                                + ' は訂正登録できません。';
                        } else if (
                            (input[item[i]].h == '×' && input[item[i]].m != '×' ) ||
                            (input[item[i]].h != '×' && input[item[i]].m == '×' )
                        ) {
                            msg = msg
                                + '\n' + itemName(item[i]) + '=' + input[item[i]].h + ':' + input[item[i]].m 
                                + ' は訂正登録できません。';
                        } else {
                            count++;
                            if (count == item.length) {
                                msg = '訂正する時刻と分数を入力してください。';
                            }
                        }
                    }

                    document.getElementById("stampInfoEditMsg").innerText = msg;
                }
            }
            break;
    }
}


// 勤怠修正情報の修正
function workReportInfoEdit(id) {
    const approve = document.getElementById('approveWorkReportInfo');
    const approveValue = approve.value;
    const reject = document.getElementById('rejectWorkReportInfo');
    const rejectValue = reject.value;
    
    switch (id) {
        case 'approveWorkReportInfo':
            if (approveValue == 'true') {
                approve.value = 'false';
                approve.style.color = '#000';
                approve.style.background = '#fff';
            } else {
                approve.value = 'true';
                approve.style.color = '#fff';
                approve.style.background = '#000';

                if (rejectValue == 'true') {
                    reject.value = 'false';
                    reject.style.color = '#000';
                    reject.style.background = '#fff';
                }
            }
            break;
    
        case 'rejectWorkReportInfo':
            if (rejectValue == 'true') {
                reject.value = 'false';
                reject.style.color = '#000';
                reject.style.background = '#fff';
            } else {
                reject.value = 'true';
                reject.style.color = '#fff';
                reject.style.background = '#000';

                if (approveValue == 'true') {
                    approve.value = 'false';
                    approve.style.color = '#000';
                    approve.style.background = '#fff';
                }
            }
            break;
    }

    
    const selectStatusB = document.querySelectorAll('.selectStatusB');
    selectStatusB.forEach(function(e) {
        e.onclick = function() {
            const statusBefore = e.innerText;
            let statusAfter = '';            

            if (approve.value == 'true' && reject.value == 'false') {
                switch (statusBefore) {
                    case '申請中':
                        statusAfter = '承認済';
                        break;

                    case '訂正中':
                        statusAfter = '訂正済';
                        break;
                }
            } else if (approve.value == 'false' && reject.value == 'true') {
                switch (statusBefore) {
                    case '申請中':
                    case '訂正中':
                        statusAfter = '却下済';
                        break;
                }
            }

            if (statusAfter) {
                const result = window.confirm('勤怠修正のステータス変更をしてよろしいですか？');
                if (result) {
                    var val =  e.value;
                    var valArray = val.split(/,/);

                    var paramDB = {
                        'statusAfter'   : statusAfter,
                        'requestDt'     : valArray[0],
                        'event'         : valArray[1],
                        'name'          : valArray[2],
                        'day'           : valArray[3],
                        'item'          : valArray[4],
                        'dataAfter'     : valArray[5],
                    };
                    opDB('updateWorkReport', paramDB);
                }
            }
        }
    });

}



// ──────────────────────────────────────────────────────
//  DBの操作
// ………………………………………………………………………………………………………………………………………………

function opDB(op, paramDB) {
    var strUrl      = "function/db.php";
    const xmlhttp   = new XMLHttpRequest();

    switch (op) {
        case 'adminLogin':
            var param   = "function=" + "check_admin_login"
                + "&inputAdminUser="     + encodeURIComponent(paramDB['inputAdminUser']) 
                + "&inputAdminUserPass=" + encodeURIComponent(paramDB['inputAdminUserPass']) 
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;
                    
                    let msg = '';
                    if (result == 'true') {
                        localStorage.setItem("adminUser", paramDB['inputAdminUser']);

                        window.location.reload();
                    } else {
                        msg = 'パスワードが誤っています。';
                    }
                    document.getElementById("adminMsg").innerHTML = msg;
                }
            }
            break;

        case 'getEvent':
            var param   = "function=" + "get_event"
                + "&event=" + encodeURIComponent(paramDB['event']) 
            ;

            xmlhttp.onreadystatechange = function() {
                document.getElementById("eventName").innerText = '';
                document.getElementById("firstDay").innerText  = '';
                document.getElementById("endDay").innerText  = '';
                document.getElementById("shiftUrl").innerText  = '';

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    // イベント情報
                    document.getElementById("eventName").innerText  = data.event;
                    document.getElementById("firstDay").innerText   = data.first_day;
                    document.getElementById("endDay").innerText     = data.end_day;
                    document.getElementById("shiftUrl").innerText   = data.shift_url;


                    // イベント情報修正
                    const firstDay = data.first_day.split(/-/);
                    const endDay = data.end_day.split(/-/);
                    document.getElementById("inputFirstYear").value  = firstDay[0];
                    document.getElementById("inputFirstMonth").value = firstDay[1];
                    document.getElementById("inputFirstDay").value   = firstDay[2];                    
                    document.getElementById("inputEndYear").value    = endDay[0];
                    document.getElementById("inputEndMonth").value   = endDay[1];
                    document.getElementById("inputEndDay").value     = endDay[2];
                    document.getElementById("inputShiftUrl").value   = data.shift_url;


                    // 勤怠情報・打刻情報
                    const tr = document.getElementById("workReportInfoHeader");
                    const tr2 = document.getElementById("workReportInfoHeader2");
                    const tr3 = document.getElementById("workReportInfoHeader3");
                    const selectDay = document.getElementById("selectStampInfoDay");

                    Array.from(tr.querySelectorAll("th")).forEach(function(e) {
                        e.remove();
                    });
                    Array.from(tr2.querySelectorAll("th")).forEach(function(e) {
                        e.remove();
                    });
                    Array.from(tr3.querySelectorAll("th")).forEach(function(e) {
                        e.remove();
                    });
                    Array.from(selectDay.querySelectorAll("option")).forEach(function(e) {
                        e.remove();
                    });

                    var th = document.createElement("th");
                    th.innerText = 'スタッフ名';
                    th.rowSpan = "3";
                    th.className = "sticky";
                    tr.appendChild(th);

                    for (
                        let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                        date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                        date.setDate(date.getDate() + 1)
                    ){
                        var th = document.createElement("th");
                        th.innerText = date.toLocaleDateString('sv-SE');
                        th.colSpan = "2";
                        tr.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '出勤';
                        th.className = 'borderRight borderBottom';
                        tr2.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '退勤';
                        th.className = 'borderLeft borderBottom';
                        tr2.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '休憩';
                        th.className = 'borderTop borderRight';
                        tr3.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '実働';
                        th.className = 'borderTop borderLeft';
                        tr3.appendChild(th);

                        var option = document.createElement("option");
                        option.text = date.toLocaleDateString('sv-SE');
                        option.value = date.toLocaleDateString('sv-SE');
                        selectDay.appendChild(option);
                    }
                }
            }
            break;

        case 'getEventList':
            var param   = "function=" + "get_event_list";
            xmlhttp.onreadystatechange = function() {
                const select = document.getElementById("selectEvent");

                Array.from(select.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    var option = document.createElement("option"); 
                    option.text = '（新規登録）';
                    option.value = '';
                    select.appendChild(option);

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        option.text = data[key];
                        option.value = data[key];
                        select.appendChild(option);
                    });
                }
            }
            break;

        case 'registerEvent':
            var param = "function=" + "register_event"
                + "&event="         + encodeURIComponent(paramDB.eventName)
                + "&pass="          + encodeURIComponent(paramDB.pass)
                + "&firstDay="      + encodeURIComponent(paramDB.firstDay)
                + "&endDay="        + encodeURIComponent(paramDB.endDay)
                + "&shiftUrl="      + encodeURIComponent(paramDB.shiftUrl)
                + "&staffList="     + encodeURIComponent(paramDB.staffList)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        opDB('getEventList', null);
                        getSelectEvent(paramDB.eventName);
                    } else {
                        document.getElementById("eventEditMsg").innerText = '*イベントの登録に失敗しました。';
                    }
                }
            }
            break;

        case 'updateEvent':
            var param = "function=" + "update_event"
                + "&event="         + encodeURIComponent(paramDB.eventName)
                + "&pass="          + encodeURIComponent(paramDB.pass)
                + "&firstDay="      + encodeURIComponent(paramDB.firstDay)
                + "&endDay="        + encodeURIComponent(paramDB.endDay)
                + "&shiftUrl="      + encodeURIComponent(paramDB.shiftUrl)
                + "&staffList="     + encodeURIComponent(paramDB.staffList)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getSelectEvent(paramDB.eventName);
                    } else {
                        document.getElementById("eventEditMsg").innerText = '*イベントの更新に失敗しました。';
                    }
                }
            }
            break;

        case 'deleteEvent':
            var param = "function=" + "delete_event"
                + "&event="         + encodeURIComponent(paramDB.eventName)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        window.location.reload();
                    } else {
                        document.getElementById("eventEditMsg").innerText = '*イベントの削除に失敗しました。';
                    }
                }
            }
            break;

        case 'getStaffList':
            var param = "function=" + "get_staff_list"
                + "&event=" + encodeURIComponent(paramDB['event'])
            ;

            xmlhttp.onreadystatechange = function() {
                // document.getElementById("staff").innerText = '';
                const staff = document.getElementById("staff");
                Array.from(staff.querySelectorAll("div")).forEach(function(e) {
                    e.remove();
                });

                const selectStaff = document.getElementById("selectStampInfoStaff");
                Array.from(selectStaff.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                const tbl = document.getElementById("workReportInfoArea").querySelector("tbody");
                Array.from(tbl.querySelectorAll("tr")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    let staffList = '';
                    if (data) {
                        Object.keys(data).forEach(function(key) {

                            staffList = staffList 
                                + data[key].no + ':' 
                                + data[key].name + ':' 
                                + data[key].mail + ':' 
                                + data[key].birthday + '\n' ;
                            
                            var div = document.createElement("div");
                            var name = document.createElement("p");
                            var mail = document.createElement("p");
                            var birthday = document.createElement("p");
                            name.innerText = data[key].no + '.' + data[key].name;
                            name.id = 'staffName';
                            mail.innerText = data[key].mail;
                            mail.id = 'staffMail';
                            birthday.innerText = data[key].birthday.substr(0, 4) 
                                + '-' + data[key].birthday.substr(4, 2)
                                + '-' + data[key].birthday.substr(6, 2);
                            birthday.id = 'staffBirthday';
                            div.appendChild(name);
                            div.appendChild(mail);
                            div.appendChild(birthday);
                            staff.appendChild(div);

                            // 勤怠情報表示
                            var tr = document.createElement("tr");
                            var tr2 = document.createElement("tr");
                            tbl.appendChild(tr);
                            tbl.appendChild(tr2);

                            var nextParamDB = {
                                'event' : paramDB['event'],
                                'name'  : data[key].name,
                                'tr'    : tr,
                                'tr2'   : tr2
                            };
                            opDB('getWorkReport', nextParamDB);


                            // 打刻情報表示
                            var option = document.createElement("option");
                            option.text = data[key].name;
                            option.value = data[key].name;
                            selectStaff.appendChild(option);
                        });
                    }

                    // イベント情報表示
                    document.getElementById("inputStaff").innerHTML = staffList;
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

                    if (data) {
                        var tr = paramDB['tr'];
                        var tr2 = paramDB['tr2'];

                        var name = document.createElement("td");
                        name.innerText = paramDB['name'];
                        name.rowSpan = "2";
                        name.className = "sticky";
                        tr.appendChild(name);

                        Array.from(document.getElementById("workReportInfoHeader").querySelectorAll("th")).forEach(function(e) {
                            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                            if (e.textContent.match(dateRegex) != null) {
                                var start = document.createElement("td");
                                var end = document.createElement("td");                            
                                var breaTime = document.createElement("td");
                                var workTime = document.createElement("td");
                                start.className     = 'borderRight borderBottom';
                                end.className       = 'borderLeft borderBottom';
                                breaTime.className  = 'borderTop borderRight';
                                workTime.className  = 'borderTop borderLeft';

                                Object.keys(data).forEach(function(key) {
                                    if (e.textContent == data[key].day) {
                                        var dataS = '';
                                        var dataE = '';
                                        var dataB = '';
                                        var dataW = '';

                                        // 出勤
                                        if (data[key].start) {
                                            dataS = data[key].start;

                                            if (!dataS.startsWith('＊')) {
                                                var startA  = dataS.split(/:/);
                                                var min     = Math.ceil(startA[1] / 15) * 15;
                                                var hour    = Number(startA[0]) + Number((min == 60 ? 1 : 0));

                                                dataS = hour + ':' + (min == 60 ? '00' : min.toString().padStart(2, '0'));
                                            }
                                        }

                                        // 退勤
                                        if (data[key].end) {
                                            dataE = data[key].end;

                                            if (!dataE.startsWith('＊')) {
                                                var endA    = dataE.split(/:/);
                                                var min         = Math.floor(endA[1] / 15) * 15;
                                                var hour        = Number(endA[0]);
                                                if (dataS) {
                                                    var clacStartA = dataS.split(/:/);
                                                    hour = hour + (Number(clacStartA[0]) > hour ? 24 : 0);
                                                }
                                                dataE = hour + ':' + min.toString().padStart(2, '0');
                                            }
                                        }

                                        // 休憩
                                        var break1s = data[key].break1s ?? '';
                                        var break1e = data[key].break1e ?? '';
                                        var break2s = data[key].break2s ?? '';
                                        var break2e = data[key].break2e ?? '';
                                        var break3s = data[key].break3s ?? '';
                                        var break3e = data[key].break3e ?? '';
                                        if (data[key].start) {
                                            if (
                                                (break1s && break1s.startsWith('＊')) ||
                                                (break1e && break1e.startsWith('＊')) ||
                                                (break2s && break2s.startsWith('＊')) ||
                                                (break2e && break2e.startsWith('＊')) ||
                                                (break3s && break3s.startsWith('＊')) ||
                                                (break3e && break3e.startsWith('＊')) ||
                                                (break1s && !break1e) ||
                                                (break2s && !break2e) ||
                                                (break3s && !break3e) 
                                            ) {
                                                dataB = '＊';
                                            } else {
                                                dataB = '0:00';

                                                if (break1s && break1e) {
                                                    var break1 = clac(e.textContent, break1s, break1e, 'diff');
                                                    dataB = break1;
                                                }                                                

                                                if (break2s && break2e) {
                                                    var break2 = clac(e.textContent, break2s, break2e, 'diff');
                                                    dataB = clac(e.textContent, dataB, break2, 'sum');
                                                }

                                                if (break3s && break3e) {
                                                    var break3 = clac(e.textContent, break3s, break3e, 'diff');
                                                    dataB = clac(e.textContent, dataB, break3, 'sum');;
                                                }
                                            }
                                        }

                                        // 実働
                                        if (
                                            dataS && !dataS.startsWith('＊') &&
                                            dataE && !dataE.startsWith('＊') &&
                                            dataB != '＊'
                                        ) {
                                            dataW = clac(e.textContent, (dataS + ':00'), (dataE + ':00'), 'diff');

                                            if (dataB != '0:00') {
                                                dataW = clac(e.textContent, (dataB + ':00'), (dataW + ':00'), 'diff');
                                            }
                                        } else if (!dataS && !dataE && !dataB) {
                                            // 
                                        } else {
                                            dataW = '＊';
                                        }

                                        start.innerText     = dataS;
                                        end.innerText       = dataE;
                                        breaTime.innerText  = dataB;
                                        workTime.innerText  = dataW;
                                    }                                
                                });

                                tr.appendChild(start);
                                tr.appendChild(end);
                                tr2.appendChild(breaTime);
                                tr2.appendChild(workTime);
                            }
                        });
                    }
                }
            }
            break;

        case 'getWorkReportDay':
            var param   = "function=" + "get_work_report_day"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&name="  + encodeURIComponent(paramDB['name'])
                + "&day="   + encodeURIComponent(paramDB['day'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    stampInfoEdit('cancelStampInfoEdit');

                    document.getElementById("stampInfoEvent").innerText     = paramDB['event'];
                    document.getElementById("stampInfoStaff").innerText     = paramDB['name'];
                    document.getElementById("stampInfoDay").innerText       = paramDB['day'];
                    document.getElementById("stampInfoStart").innerText     = '';
                    document.getElementById("stampInfoBreak1s").innerText   = '';
                    document.getElementById("stampInfoBreak1e").innerText   = '';
                    document.getElementById("stampInfoBreak2s").innerText   = '';
                    document.getElementById("stampInfoBreak2e").innerText   = '';
                    document.getElementById("stampInfoBreak3s").innerText   = '';
                    document.getElementById("stampInfoBreak3e").innerText   = '';
                    document.getElementById("stampInfoEnd").innerText       = '';

                    if (this.response) {
                        const data = JSON.parse(this.response);

                        document.getElementById("stampInfoStart").innerText     = data.start;
                        document.getElementById("stampInfoBreak1s").innerText   = data.break1s;
                        document.getElementById("stampInfoBreak1e").innerText   = data.break1e;
                        document.getElementById("stampInfoBreak2s").innerText   = data.break2s;
                        document.getElementById("stampInfoBreak2e").innerText   = data.break2e;
                        document.getElementById("stampInfoBreak3s").innerText   = data.break3s;
                        document.getElementById("stampInfoBreak3e").innerText   = data.break3e;
                        document.getElementById("stampInfoEnd").innerText       = data.end;
                    }
                    
                }
            }
            break;

        case 'getWorkReportEditAll':
            var param   = "function=" + "get_work_report_edit_all"
                + "&event=" + encodeURIComponent(paramDB['event'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Array.from(document.getElementById("workReportInfoEditArea").querySelectorAll("td")).forEach(function(e) {
                        e.remove();
                    });
                    
                    if (data) {
                        const orderList = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];
                        const tbl = document.getElementById("workReportInfoEditArea").querySelector("tbody");

                        let i = 0;
                        let nameKeyNum = [];
                        let dayNum = [];
                        let itemNum = [];
                        Object.keys(data).forEach(function(nameKey) {
                            i++;
                            nameKeyNum[nameKey] = 0;
                            var dataName = data[nameKey];
                            var name = document.createElement("td");

                            Object.keys(dataName).forEach(function(dayKey) {
                                dayNum[dayKey] = 0;
                                var dataDay = dataName[dayKey];
                                var day = document.createElement("td");
                                
                                Object.keys(orderList).forEach(function(orderName) {
                                    var itemKey = orderList[orderName];

                                    if (dataDay[itemKey]) {
                                        itemNum[itemKey] = 0;
                                        var dataItem = dataDay[itemKey];
                                        var item = document.createElement("td");
                                        
                                        Object.keys(dataItem).forEach(function(key) {
                                            nameKeyNum[nameKey] = nameKeyNum[nameKey] + 1;
                                            dayNum[dayKey]      = dayNum[dayKey] + 1;
                                            itemNum[itemKey]    = itemNum[itemKey] + 1;
                                            var tr = document.createElement("tr");

                                            name.rowSpan = nameKeyNum[nameKey];
                                            if (nameKeyNum[nameKey] == 1) {                                            
                                                name.innerText = nameKey;
                                                name.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                                name.className = "sticky1";
                                                tr.appendChild(name);
                                            } else {
                                                name.className = 'sticky1 valueTop';
                                            }

                                            day.rowSpan = dayNum[dayKey];
                                            if (dayNum[dayKey] == 1) {
                                                day.innerText = dayKey;
                                                day.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                                day.className = "sticky2";
                                                tr.appendChild(day);
                                            } else {
                                                day.className = 'sticky2 valueTop';
                                            }

                                            item.rowSpan = itemNum[itemKey];
                                            if (itemNum[itemKey] == 1) {
                                                item.innerText = itemName(itemKey);
                                                item.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                                item.className = "sticky3";
                                                tr.appendChild(item);
                                            } else {
                                                item.className = 'sticky3 valueTop';
                                            }

                                            var status = document.createElement("td");
                                            var statusB = document.createElement("button");
                                            statusB.innerText = dataItem[key].status;
                                            statusB.value = dataItem[key].request_dt
                                                + ',' + paramDB['event'] 
                                                + ',' + nameKey
                                                + ',' + dayKey
                                                + ',' + itemKey
                                                + ',' + dataItem[key].data_after
                                            ;
                                            statusB.className = 'statusB selectStatusB';
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
                                            reason.className = "w25 textLeft";
                                            tr.appendChild(reason);

                                            var request_dt = document.createElement("td");
                                            request_dt.innerText = dataItem[key].request_dt;
                                            request_dt.style.background = (i % 2 == 0) ? '#f5f5f5ff' : '#fff';
                                            request_dt.className = "w25";
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
                        });
                    }
                }
            }
            break;

        case 'registerWorkReportEdit':
            var param = "function=" + "register_work_report_edit"
                + "&requestDt=" + encodeURIComponent(paramDB.requestDt)
                + "&event="     + encodeURIComponent(paramDB.event)
                + "&name="      + encodeURIComponent(paramDB.name)
                + "&day="       + encodeURIComponent(paramDB.day)
                + "&item="      + encodeURIComponent(paramDB.item)
                + "&before="    + encodeURIComponent(paramDB.dataBefore)
                + "&after="     + encodeURIComponent(paramDB.dataAfter)
                + "&reason="    + encodeURIComponent(paramDB.reason)
                + "&status="    + encodeURIComponent(paramDB.status)
                + "&approvalD=" + encodeURIComponent('')
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getSelectEvent(paramDB.event);
                        stampInfoEdit('cancelStampInfoEdit');
                    } else {
                        const msg = document.getElementById("stampInfoEditMsg").textContent;
                        document.getElementById("stampInfoEditMsg").innerText = msg 
                            + '\n' + itemName(paramDB.item) + '=' + paramDB.dataAfter + ' は訂正登録できませんでした。';
                    }
                }
            }
            break;

        case 'updateWorkReport':
            var param = "function=" + "update_work_report"
                + "&statusAfter="   + encodeURIComponent(paramDB.statusAfter)
                + "&requestDt="     + encodeURIComponent(paramDB.requestDt)
                + "&event="         + encodeURIComponent(paramDB.event)
                + "&name="          + encodeURIComponent(paramDB.name)
                + "&day="           + encodeURIComponent(paramDB.day)
                + "&item="          + encodeURIComponent(paramDB.item)
                + "&after="         + encodeURIComponent(paramDB.dataAfter)
                + "&approvalD="     + encodeURIComponent(date().yyyymmdd)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        stampInfoEdit('cancelStampInfoEdit');
                        getSelectEvent(paramDB.event);
                    }
                } else {
                    document.getElementById("workReportInfoEditMsg").innerText = 'ステータス変更ができませんでした。';
                }
            }
            break;
    }

    xmlhttp.open("POST", strUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}



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


// 時間計算
function clac(day, bt, at, method) {
    const dayA = day.split(/-/);
    const btA = bt.split(/:/);
    const atA = at.split(/:/);

    let dayBy = new Date(dayA[0], dayA[1], dayA[2], btA[0], btA[1], '00');
    let dayAt = new Date(dayA[0], dayA[1], dayA[2], atA[0], atA[1], '00');

    switch (method) {
        case 'diff':
            var result = dayAt.getTime() - dayBy.getTime();

            var min = Math.floor(result / 1000 / 60 % 60);
            var hour = Math.floor(result / 1000 / 60 / 60 % 24);

            min = Math.ceil(min / 15) * 15;
            hour = Number(hour) + Number((min == 60 ? 1 : 0)); 
            break;
    
        case 'sum':
            var totalMinutes = Number(btA[1]) + Number(atA[1]);
            var carryHours = Math.floor(totalMinutes / 60);

            var min = totalMinutes % 60;
            var hour = Number(btA[0]) + Number(atA[0]) + Number(carryHours);

            min = (Math.ceil(min / 15) * 15);
            break;
    }
    
    return hour + ':' +  (min == 60 ? '00' : min.toString().padStart(2, '0'));
}


// 項目名
function itemName(item) {
    const name = {
        'start'     : '出勤',
        'break1s'   : '休憩1：開始',
        'break1e'   : '休憩1：終了',
        'break2s'   : '休憩2：開始',
        'break2e'   : '休憩2：終了',
        'break3s'   : '休憩3：開始',
        'break3e'   : '休憩3：終了',
        'end'       : '退勤'
    };

    return name[item];
}