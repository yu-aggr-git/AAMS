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

    let paramDB = {};
    
    // 表示切替
    document.getElementById("networkStatus").textContent = 'on-line';
    document.getElementById("networkStatus").style.background = '#dc4618ff';


    // ログイン
    let staffUser = window.localStorage.getItem("staffUser");
    if (!staffUser) {
        staffLogin();
    } else {
        // イベントリストの取得
        paramDB = { 'staffUser': staffUser };
        opDB('getStaffListEvent', paramDB);
    }

    // パスワードのリセット
    document.getElementById("resetPassword").onclick = function() {
        resetPassword();
    }

    // ログアウト
    document.getElementById("staffLogout").onclick = function() {
        localStorage.removeItem('staffUser');
        window.location.reload();
    }


    // お知らせ
    document.getElementById("openNews").onclick = function() {
        dispNews();
    }
    document.getElementById("closeNews").onclick = function() {
        document.getElementById("modal").style.display = 'none';
        document.getElementById("news").style.display = 'none';
        document.body.style.overflow = 'visible';
    }
    document.getElementById("newsList").addEventListener('click', (e) => {
        const newsId = e.target.id;

        if (newsId.startsWith("newsTitle_")) {
            document.getElementById(newsId.replace("Title", "Body")).style.display = 'block';
            document.getElementById(newsId.replace("Title", "Link")).style.display = 'block';   
        } else if (newsId.startsWith("newsBody_")) {
            document.getElementById(newsId).style.display = 'none';
            document.getElementById(newsId.replace("Body", "Link")).style.display = 'none';   
        }
    });
    

    // パスワードの設定
    document.getElementById("setPassOpen").onclick = function() {
        staffUser = window.localStorage.getItem("staffUser");
        paramDB = {
            'mail'  : staffUser,
            'pass'  : document.getElementById("inputStaffPass").value
        };
        opDB('registerStaffListPass', paramDB);
    }


    // イベントの選択
    document.getElementById("sendSelectStaffEvent").onclick = function() {
        staffUser = window.localStorage.getItem("staffUser");
        const selectEvent = document.getElementById("selectStaffEvent").value;
        getSelectEvent(selectEvent, staffUser);
    }


    // 勤怠情報の取得
    document.getElementById("workReportOpen").onclick = function() {
        var event = document.getElementById("eventName").textContent;
        var name = document.getElementById("staffName").textContent;
        getWorkReport(this.id, event, name);
    }
    document.getElementById("workReportEditOpen").onclick = function() {
        var event = document.getElementById("eventName").textContent;
        var name = document.getElementById("staffName").textContent;
        getWorkReport(this.id, event, name);
    }
    document.getElementById("stampEditOpen").onclick = function() {
        var event = document.getElementById("eventName").textContent;
        var name = document.getElementById("staffName").textContent;
        getWorkReport(this.id, event, name);
    }


    // 勤怠情報の取得
    document.getElementById("sendStaffStampEdit").onclick = function() {
        stampInfoEdit();
    }
}


// スタッフログイン
function staffLogin() {
    document.getElementById("modal").style.display = 'flex';
    document.getElementById("staffLogin").style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // イベントリストの取得
    opDB('getEventList', null);

    document.getElementById("sendStaffLogin").onclick = function() {
        var inputStaffEventName = document.getElementById("staffEventName").value;
        var inputStaffMail      = document.getElementById("staffMail").value;
        var inputStaffPass      = document.getElementById("staffPass").value;

        if (!inputStaffMail || !inputStaffPass) {
            document.getElementById("staffLoginMsg").innerText = 'すべての項目に入力が必要です。';
        } else {
            var paramDB = {
                'inputStaffEventName'   : inputStaffEventName,
                'inputStaffMail'        : inputStaffMail,
                'inputStaffPass'        : inputStaffPass
            };
            opDB('staffLogin', paramDB);
        }
    }    
}


// パスワードリセット
function resetPassword() {
    const inputStaffEventName = document.getElementById("staffEventName").value;
    const inputStaffMail = document.getElementById("staffMail").value;

    if (!inputStaffMail) {
        document.getElementById("resetPasswordMsg").innerText = 'リセットしたいメールアドレスを入力してください。';
    } else {
        const result = window.confirm(
                'パスワードをリセットすると初期値に変更されます。' + '\n' 
            + '\n'
            + '※初期値は、イベントのLINEグループでお知らせされたものです。' + '\n'
            + '\n'
            + '※初期値が分からない場合' + '\n'
            + '「イベント名」「氏名」「メールアドレス」を記入の上、' + '\n'
            + 'baito-staff@aggr.jpまでお問い合わせください。' + '\n'
            + '\n'
            + 'パスワードをリセットしてよろしいですか？'
        );

        if (result) {   
            var paramDB = {
                'inputStaffEventName'   : inputStaffEventName,
                'inputStaffMail'        : inputStaffMail,
            };
            opDB('resetPassword', paramDB);
        }

    }
}

// お知らせの表示
function dispNews() {
    document.getElementById("modal").style.display = 'flex';
    document.getElementById("news").style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // お知らせの取得
    var paramDB = {
        'status'   : '公開' ,
        'op'       : 'disp' ,
    };
    opDB('getNewsList', paramDB);
}

// イベントの選択
function getSelectEvent(selectEvent, staffUser) {
    let paramDB = {};

    paramDB = { 'event': selectEvent };
    opDB('getEvent', paramDB);

    paramDB = {
        'event' : selectEvent,
        'mail'  : staffUser
    };
    opDB('getStaffListName', paramDB);

    paramDB = {
        'event' : selectEvent,
        'mail'  : staffUser
    };
    opDB('checkStaffListPass', paramDB);

    document.getElementById("selectItemArea").style.display = 'flex';

    // お知らせ確認
    paramDB = {
        'status'   : '公開' ,
        'op'       : 'check' ,
    };
    opDB('getNewsList', paramDB);
}


// 勤怠情報の取得
function getWorkReport(id, event, name) {
    const workReport            = document.getElementById('workReportOpen');
    const workReportValue       = workReport.value;
    const workReportEdit        = document.getElementById('workReportEditOpen');
    const workReportEditValue   = workReportEdit.value;
    const stampEdit             = document.getElementById('stampEditOpen');
    const stampEditValue        = stampEdit.value;
    
    switch (id) {
        case 'workReportOpen':
            if (workReportValue == 'false') {
                document.getElementById("staffWorkReportInfoArea").style.display = 'flex';
                workReport.value = 'true';
                workReport.style.color = '#fff';
                workReport.style.background = '#dc4618ff';

                document.getElementById("staffworkReportEditInfoArea").style.display = 'none';
                workReportEdit.value = 'false';
                workReportEdit.style.color = '#000';
                workReportEdit.style.background = '#fff';

                document.getElementById("staffStampEditArea").style.display = 'none';
                stampEdit.value = 'false';
                stampEdit.style.color = '#000';
                stampEdit.style.background = '#fff';

                // 勤怠情報の表示
                var paramDB = {
                    'event' : event,
                    'name'  : name
                };
                opDB('getWorkReport', paramDB);
            }
            break;

        case 'workReportEditOpen':
            if (workReportEditValue == 'false') {
                document.getElementById("staffWorkReportInfoArea").style.display = 'none';
                workReport.value = 'false';
                workReport.style.color = '#000';
                workReport.style.background = '#fff';

                document.getElementById("staffworkReportEditInfoArea").style.display = 'flex';
                workReportEdit.value = 'true';
                workReportEdit.style.color = '#fff';
                workReportEdit.style.background = '#dc4618ff';

                document.getElementById("staffStampEditArea").style.display = 'none';
                stampEdit.value = 'false';
                stampEdit.style.color = '#000';
                stampEdit.style.background = '#fff';

                // 修正申請情報の表示
                var paramDB = {
                    'event' : event,
                    'name'  : name
                };
                opDB('getWorkReportEdit', paramDB);
            }
            break;

        case 'stampEditOpen':
            if (stampEditValue == 'false') {
                document.getElementById("staffWorkReportInfoArea").style.display = 'none';
                workReport.value = 'false';
                workReport.style.color = '#000';
                workReport.style.background = '#fff';

                document.getElementById("staffworkReportEditInfoArea").style.display = 'none';
                workReportEdit.value = 'false';
                workReportEdit.style.color = '#000';
                workReportEdit.style.background = '#fff';

                document.getElementById("staffStampEditArea").style.display = 'flex';
                stampEdit.value = 'true';
                stampEdit.style.color = '#fff';
                stampEdit.style.background = '#dc4618ff';

            }
            break;
    }
}


// 打刻情報の修正
function stampInfoEdit() {
    document.getElementById("staffStampEditMsg").innerText = '';

    const event         = document.getElementById("eventName").textContent;
    const name          = document.getElementById("staffName").textContent;
    const inputDay      = document.getElementById("editStampDay").value;
    const inputItem     = document.getElementById("editStampItem").value;
    const inputHour     = document.getElementById("editStampHour").value;
    const inputMinutes  = document.getElementById("editStampMinutes").value;
    const inputReason   = document.getElementById("editStampReason").value;
    
    let msg = '';
    if (!inputReason) {
        msg = '申請理由に入力が必要です。';
    } else {
        if (
            (inputHour == '×' && inputMinutes != '×' ) ||
            (inputHour != '×' && inputMinutes == '×' )
        ) {
            msg = inputHour + ':' + inputMinutes + ' は申請できません。';
        } else {
            var stampId = 'stamp_' + inputDay + '_' + inputItem;
            var dataBefore  = document.getElementById(stampId).textContent;
            var dataAfter   = inputHour + ':' + inputMinutes;

            const result = window.confirm(
                    '【イベント】  '    + event     + '\n' 
                +   '【  名前  】  '    + name      + '\n' 
                +   '【  日付  】  '    + inputDay  + '\n' 
                +   '【  項目  】  '    + itemName(inputItem) + '\n' 
                +   '【  修正  】  '    + (dataBefore != '' ? dataBefore : '-') + '　→　' + dataAfter + '\n' 
                +   '【  理由  】  '    + inputReason + '\n' 
                +   '\n以上の内容で、打刻時間の修正申請をしてよろしいですか？'
            );

            if (result) {    
                var paramDB = {
                    'requestDt'  : date().yyyymmddhhmmss,
                    'event'      : event,
                    'name'       : name,
                    'day'        : inputDay, 
                    'item'       : inputItem,
                    'dataBefore' : dataBefore != '' ? dataBefore : '-',
                    'dataAfter'  : dataAfter,
                    'reason'     : inputReason,
                    'status'     : '申請中',
                };
                opDB('registerWorkReportEdit', paramDB);
            }
        }
    }
    document.getElementById("staffStampEditMsg").innerText = msg;
}


// ──────────────────────────────────────────────────────
//  DBの操作
// ………………………………………………………………………………………………………………………………………………

function opDB(op, paramDB) {
    var strUrl      = "function/db.php";
    const xmlhttp   = new XMLHttpRequest();

    switch (op) {
        case 'staffLogin':
            var param   = "function=" + "check_staff_list"
                + "&inputStaffEventName="   + encodeURIComponent(paramDB['inputStaffEventName']) 
                + "&inputStaffMail="        + encodeURIComponent(paramDB['inputStaffMail']) 
                + "&inputStaffPass="        + encodeURIComponent(paramDB['inputStaffPass']) 
                + "&loginDt="               + encodeURIComponent(date().yyyymmddhhmmss) 
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    let msg = '';
                    if (result == 'true') {
                        localStorage.setItem("staffUser", paramDB['inputStaffMail']);


                        // 初期表示
                        document.getElementById("modal").style.display = 'none';
                        document.getElementById("staffLogin").style.display = 'none';
                        document.body.style.overflow = 'visible';

                        var nextParamDB = { 'staffUser': paramDB['inputStaffMail'] };
                        opDB('getStaffListEvent', nextParamDB);

                        getSelectEvent(paramDB['inputStaffEventName'], paramDB['inputStaffMail']);
                    } else {
                        msg = '入力値が誤っています。';
                    }
                    document.getElementById("staffLoginMsg").innerHTML = msg;
                }
            }
            break;

        case 'resetPassword':
            var param   = "function=" + "reset_password"
                + "&inputStaffEventName="   + encodeURIComponent(paramDB['inputStaffEventName'])
                + "&inputStaffMail="        + encodeURIComponent(paramDB['inputStaffMail'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    let msg = '';
                    if (result != 0) {
                        msg = 'パスワードがリセットされました。';
                    } else {
                        msg = 'このメールアドレスは未登録、またはパスワードは初期値に設定されています。';
                    }
                    document.getElementById("resetPasswordMsg").innerHTML = msg;
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
                document.getElementById("shift").querySelector("a").href = '';
                document.getElementById("shift").querySelector("a").style.display = 'none';


                const table = document.getElementById("staffWorkReportInfoArea");
                Array.from(table.querySelectorAll("th")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }
                });
                Array.from(table.querySelectorAll("td")).forEach(function(e) {
                    e.remove();
                });

                const select = document.getElementById("editStampDay");
                Array.from(select.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    document.getElementById("eventName").innerText  = data.event;
                    document.getElementById("firstDay").innerText   = data.first_day;
                    document.getElementById("endDay").innerText     = data.end_day;
                    if (data.shift_url) {
                        document.getElementById("shift").querySelector("a").href = data.shift_url;
                        document.getElementById("shift").querySelector("a").style.display = 'block';
                    }
                    

                    const firstDay  = data.first_day.split(/-/);
                    const endDay    = data.end_day.split(/-/);

                    const dateHeader    = document.getElementById("dateHeader");
                    const itemHeader    = document.getElementById("itemHeader");
                    const startRow      = document.getElementById("startRow");
                    const break1sRow    = document.getElementById("break1sRow");
                    const break1eRow    = document.getElementById("break1eRow");
                    const break2sRow    = document.getElementById("break2sRow");
                    const break2eRow    = document.getElementById("break2eRow");
                    const break3sRow    = document.getElementById("break3sRow");
                    const break3eRow    = document.getElementById("break3eRow");
                    const endRow        = document.getElementById("endRow");
                    const breakTimeRow  = document.getElementById("breakTimeRow");
                    const workTimeRow   = document.getElementById("workTimeRow");
                    
                    for (
                        let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                        date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                        date.setDate(date.getDate() + 1)
                    ){
                        var th = document.createElement("th");
                        th.innerText = date.toLocaleDateString('sv-SE');
                        th.colSpan = "2";
                        dateHeader.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '打刻';
                        th.className = 'borderRight';
                        itemHeader.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '勤怠';
                        th.className = 'borderLeftNone';
                        itemHeader.appendChild(th);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_start';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_start';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        startRow.appendChild(td);
                        startRow.appendChild(td2);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_break1s';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_break1s';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        break1sRow.appendChild(td);
                        break1sRow.appendChild(td2);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_break1e';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_break1e';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        break1eRow.appendChild(td);
                        break1eRow.appendChild(td2);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_break2s';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_break2s';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        break2sRow.appendChild(td);
                        break2sRow.appendChild(td2);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_break2e';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_break2e';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        break2eRow.appendChild(td);
                        break2eRow.appendChild(td2);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_break3s';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_break3s';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        break3sRow.appendChild(td);
                        break3sRow.appendChild(td2);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_break3e';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_break3e';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        break3eRow.appendChild(td);
                        break3eRow.appendChild(td2);

                        var td = document.createElement("td");
                        var td2 = document.createElement("td");
                        td.id = 'stamp_' + date.toLocaleDateString('sv-SE') + '_end';
                        td2.id = 'workReport_' + date.toLocaleDateString('sv-SE') + '_end';
                        td.className = 'borderRight';
                        td2.className = 'borderLeftNone';
                        endRow.appendChild(td);
                        endRow.appendChild(td2);

                        var td = document.createElement("td");
                        td.id = 'breakTime_' + date.toLocaleDateString('sv-SE');
                        td.colSpan = 2;
                        breakTimeRow.appendChild(td);

                        var td = document.createElement("td");
                        td.id = 'workTime_' + date.toLocaleDateString('sv-SE');
                        td.colSpan = 2;
                        workTimeRow.appendChild(td);

                        var option = document.createElement("option");
                        option.text = date.toLocaleDateString('sv-SE');
                        option.value = date.toLocaleDateString('sv-SE');
                        select.appendChild(option);
                    }
                }
            }
            break;

        case 'getEventList':
            var param   = "function=" + "get_event_list";
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);
                    const select = document.getElementById("staffEventName");

                    Array.from(select.querySelectorAll("option")).forEach(function(e) {
                        e.remove();
                    });

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        option.text = data[key];
                        option.value = data[key];
                        select.appendChild(option);
                    });
                }
            }
            break;

        case 'getWorkReport':
            var param   = "function=" + "get_work_report"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&name="  + encodeURIComponent(paramDB['name'])
            ;

            xmlhttp.onreadystatechange = function() {
                const itemList = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];
                const table = document.getElementById("staffWorkReportInfoArea");

                Array.from(table.querySelectorAll("td")).forEach(function(e) {
                    e.innerText = '';
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        Object.keys(data).forEach(function(key) {

                            var clacList = {};
                            Object.keys(itemList).forEach(function(item) {
                                var itemName = itemList[item];
                                var itemData = data[key][itemName];

                                if (itemData) {
                                    var stampId = 'stamp_' + data[key].day + '_' + itemName;
                                    document.getElementById(stampId).innerText = itemData;

                                    if (itemData != '-') {
                                        var workReportId = 'workReport_' + data[key].day + '_' + itemName;
                                        var dataClac = '＊';
                                        if (!itemData.startsWith('＊')) {
                                            var itemDataA   = itemData.split(/:/);
                                            if (itemName != 'end') {
                                                // 切り上げ
                                                var min         = Math.ceil(itemDataA[1] / 15) * 15;
                                                var hour        = Number(itemDataA[0]) + Number((min == 60 ? 1 : 0));
                                                dataClac = hour + ':' + (min == 60 ? '00' : min.toString().padStart(2, '0'));
                                            } else {
                                                // 切り捨て
                                                var min         = Math.floor(itemDataA[1] / 15) * 15;
                                                var hour        = Number(itemDataA[0]);
                                                if (clacList.start) {
                                                    var clacStartA = clacList.start.split(/:/);
                                                    hour = hour + (Number(clacStartA[0]) > hour ? 24 : 0);
                                                }
                                                dataClac = hour + ':' + min.toString().padStart(2, '0');
                                            }
                                        }
                                        clacList[itemName] = dataClac; 
                                        document.getElementById(workReportId).innerText = dataClac;
                                    }
                                }
                            });

                            // 休憩
                            var dataB = '';
                            if (
                                (clacList.break1s && clacList.break1s.startsWith('＊')) ||
                                (clacList.break1e && clacList.break1e.startsWith('＊')) ||
                                (clacList.break2s && clacList.break2s.startsWith('＊')) ||
                                (clacList.break2e && clacList.break2e.startsWith('＊')) ||
                                (clacList.break3s && clacList.break3s.startsWith('＊')) ||
                                (clacList.break3e && clacList.break3e.startsWith('＊')) ||
                                (clacList.break1s && !clacList.break1e) ||
                                (clacList.break2s && !clacList.break2e) ||
                                (clacList.break3s && !clacList.break3e) 
                            ) {
                                dataB = '＊';
                            } else {
                                dataB = '0:00';

                                if (clacList.break1s && clacList.break1e) {
                                    var break1 = clac(data[key].day, clacList.break1s, clacList.break1e, 'diff');
                                    dataB = break1;
                                }                                                

                                if (clacList.break2s && clacList.break2e) {
                                    var break2 = clac(data[key].day, clacList.break2s, clacList.break2e, 'diff');
                                    dataB = clac(data[key].day, dataB, break2, 'sum');
                                }

                                if (clacList.break3s && clacList.break3e) {
                                    var break3 = clac(data[key].day, clacList.break3s, clacList.break3e, 'diff');
                                    dataB = clac(data[key].day, dataB, break3, 'sum');;
                                }
                            }

                            // 実働
                            var dataW = '';
                            if (
                                clacList.start && !clacList.start.startsWith('＊') &&
                                clacList.end && !clacList.end.startsWith('＊') &&
                                dataB != '＊'
                            ) {
                                dataW = clac(data[key].day, (clacList.start + ':00'), (clacList.end + ':00'), 'diff');

                                if (dataB != '0:00') {
                                    dataW = clac(data[key].day, (dataB + ':00'), (dataW + ':00'), 'diff');
                                }
                            } else if (!clacList.start && !clacList.end && !dataB) {
                                // 
                            } else {
                                dataW = '＊';
                            }

                            var breakTimeId = 'breakTime_' + data[key].day;
                            var workTimeId = 'workTime_' + data[key].day;
                            document.getElementById(breakTimeId).innerText  = dataB;
                            document.getElementById(workTimeId).innerText  = dataW;
                        });
                        

                    }
                }
            }
            break;
            
        case 'getStaffListEvent':
            var param   = "function=" + "get_staff_list_event"
                + "&staffUser="       + encodeURIComponent(paramDB['staffUser']) 
            ;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    const select = document.getElementById("selectStaffEvent");

                    Array.from(select.querySelectorAll("option")).forEach(function(e) {
                        e.remove();
                    });

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        option.text = data[key];
                        option.value = data[key];
                        select.appendChild(option);
                    });
                }
            }
            break;

        case 'getStaffListName':
            var param   = "function=" + "get_staff_list_name"
                + "&event=" + encodeURIComponent(paramDB['event']) 
                + "&mail="  + encodeURIComponent(paramDB['mail']) 
            ;
            xmlhttp.onreadystatechange = function() {
                document.getElementById("mail").innerText = '';
                document.getElementById("staffName").innerText  = '';
                document.getElementById("birthday").innerText  = '';
                document.getElementById("payslip").innerText  = '';

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    document.getElementById("staffName").innerText  = data.name;
                    document.getElementById("mail").innerText = data.mail;
                    document.getElementById("birthday").innerText  = data.birthday.substr(0, 4) + '年' 
                        + data.birthday.substr(4, 2) + '月' 
                        + data.birthday.substr(6, 2) + '日生';


                    if (data.payslip) {
                        data.payslip.split(/\n/).forEach(function(val) {
                            var a = document.createElement("a");
                            a.innerText = val;
                            a.href = val;
                            a.target = "_blank";
                            a.style.display = "block";
                            document.getElementById("payslip").appendChild(a);
                        });
                    } else {
                        document.getElementById("payslip").innerText  = '＊給与明細は公開前です。';
                    }
                    
                    

                    // 勤怠情報の表示
                    getWorkReport("workReportOpen", paramDB['event'], data.name);
                }
            }
            break;

        case 'checkStaffListPass':
            var param   = "function=" + "check_staff_list_pass"
                + "&mail="  + encodeURIComponent(paramDB['mail']) 
            ;
            xmlhttp.onreadystatechange = function() {
                document.getElementById("staffEventInfoMsgArea").style.display = 'none';

                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    if (result == 'false') {
                        document.getElementById("staffEventInfoMsgArea").style.display = 'flex';
                    }
                }
            }
            break;

        case 'registerStaffListPass':
            var param   = "function=" + "register_staff_list_pass"
                + "&mail="  + encodeURIComponent(paramDB['mail']) 
                + "&pass="  + encodeURIComponent(paramDB['pass']) 
            ;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        document.getElementById("staffEventInfoMsgArea").style.display = 'none';
                    } else {
                        document.getElementById("staffEventInfoMsg").innerText = 'パスワード設定ができませんでした。';
                    }
                }
            }
            break;

        case 'getWorkReportEdit':
            var param   = "function=" + "get_work_report_edit"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&name="  + encodeURIComponent(paramDB['name'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Array.from(document.getElementById("staffworkReportEditInfoArea").querySelectorAll("td")).forEach(function(e) {
                        e.remove();
                    });
                    
                    if (data) {
                        const orderList = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];
                        const tbl = document.getElementById("staffworkReportEditInfoArea").querySelector("tbody");

                        let i = 0;
                        let dayNum = [];
                        let itemNum = [];
                        Object.keys(data).forEach(function(dayKey) {
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
                                            item.innerText = itemName(itemKey);
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

                        getWorkReport('workReportEditOpen', paramDB.event, paramDB.name);
                    } else {
                        document.getElementById("staffStampEditMsg").innerText = '申請登録できませんでした。';
                    }
                }
            }
            break;

        case 'getNewsList':
            var param   = "function=" + "get_news_list"
                + "&status=" + encodeURIComponent(paramDB['status'])
            ;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);
                    const dl = document.getElementById("newsList").querySelector("dl");

                    Array.from(dl.querySelectorAll("dt")).forEach(function(e) {
                        e.remove();
                    });
                    Array.from(dl.querySelectorAll("dd")).forEach(function(e) {
                        e.remove();
                    });

                    let i = 1;
                    Object.keys(data).forEach(function(key) {

                        animeNewsStart= document.getElementById("openNews").animate(
                            [{ background : '#fff' }, { background : '#dc4618ff' }],
                            { duration: 2000, iterations: Infinity }
                        );
                        animeNewsStart.cancel();

                        if (paramDB['op'] == 'check') {

                            // 既読チェック
                            if (i == 1) {
                                if (localStorage.getItem("readNews") != data[key].register_dt) {
                                    animeNewsStart.play();
                                }
                            }

                        } else if (paramDB['op'] == 'disp') {

                            // 既読フラグ
                            if (i == 1) {
                                localStorage.setItem("readNews", data[key].register_dt);
                                animeNewsStart.currentTime = 0;
                            }


                            // お知らせリスト表示
                            var dt = document.createElement("dt");
                            dt.textContent = data[key].register_dt.substring(0, 10);

                            var dd = document.createElement("dd");

                            var title = document.createElement("p");
                            title.textContent = '『 ' + data[key].title + ' 』';
                            title.className = 'newsTitle';
                            title.id = 'newsTitle_' + i;
                            dd.appendChild(title);

                            var body = document.createElement("p");
                            body.innerHTML = data[key].body;
                            body.style.display = 'none';
                            body.id = 'newsBody_' + i;
                            dd.appendChild(body);

                            var link = document.createElement("a");
                            link.textContent = data[key].link;
                            link.href = data[key].link;
                            link.target = "_blank";
                            link.style.display = 'none';
                            link.id = 'newsLink_' + i;
                            dd.appendChild(link);
                            
                            dl.appendChild(dt);
                            dl.appendChild(dd);

                        }

                        i++;
                    });
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