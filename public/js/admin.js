window.onload = () => {

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
    document.getElementById("payslipAreaOpen").onclick = function() {
        areaOpen(this, ['payslipArea']);
    }
    document.getElementById("newsAreaOpen").onclick = function() {
        areaOpen(this, ['newsArea']);
    }


    // ───イベントの取得──────────────────────────────────────────────────────────────    
    opDB('getEventList', null);
    opDB('getEventNotice', null);


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


    // ───スタッフリストの操作──────────────────────────────────────────────────────────────
    document.getElementById("editPayslip").onclick = function() {
        payslipEdit(this.id);
    }
    document.getElementById("cancelPayslip").onclick = function() {
        payslipEdit(this.id);
    }
    document.getElementById("updatePayslip").onclick = function() {
        payslipEdit(this.id);
    }


    // ───お知らせの操作──────────────────────────────────────────────────────────────
    document.getElementById("newsMenu").addEventListener('click', (e) => {
        id = e.target.id;
        if (id) {
            news(id);
        }
    })
    document.getElementById("newsSelect").addEventListener('click', (e) => {
        id = e.target.id;
        if (id) {
            news(id);
        }
    })
    document.getElementById("newsTable").addEventListener('click', (e) => {
        id = e.target.id;
        if (e.target.tagName  === 'BUTTON') {
            news(id);
        }
    })


    // ───スタッフ削除──────────────────────────────────────────────────────────────
    document.getElementById("sendDeleteStaff").onclick = function() {
        sendDeleteStaff();
    }


    // ───スタッフ追加──────────────────────────────────────────────────────────────
    document.getElementById("sendAddStaff").onclick = function() {
        sendAddStaff();
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
    document.getElementById("payslipMsg").innerText             = '';
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
                'recruit',
                'eventName',
                'pass',
                'firstDay',
                'endDay',
                'time',
                'hourlyWage',
                'transportationLimit',
                'mealAllowance',
                'manager',
                'shiftUrl',
                'payDay',
                'deleteEvent',
                'editEventEdit',
                'editPayslip'
            ],
            'none'  : [
                'eventInfoNoticeArea',
                'inputRecruit',
                'inputEventName',
                'inputPass',
                'inputFirstDayArea',
                'inputEndDayArea',
                'inputTimeArea',
                'inputHourlyWage',
                'inputTransportationLimit',
                'inputMealAllowance',
                'inputMealManager',
                'inputShiftUrl',
                'inputPayDayArea',
                'registerEvent',
                'cancelEventEdit',
                'sendEventEdit',
                'newsAreaOpen',
                'newsArea',
                'cancelPayslip',
                'updatePayslip'
            ],
            'flex'  : [
                'workReportInfoAreaOpen',
                'stampInfoAreaOpen',
                'workReportInfoEditAreaOpen',
                'payslipAreaOpen'
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

    const inputEvent = document.getElementById("eventName").textContent;
    var paramDB = {
        'recruit'   : document.getElementById("inputRecruit").value,
        'eventName' : inputEvent,
        'pass'      : document.getElementById("inputPass").value,
        'firstDay'  :
              document.getElementById("inputFirstYear").value + '-'
            + document.getElementById("inputFirstMonth").value + '-'
            + document.getElementById("inputFirstDay").value,
        'endDay' :
              document.getElementById("inputEndYear").value + '-'
            + document.getElementById("inputEndMonth").value + '-'
            + document.getElementById("inputEndDay").value,
        'startTime'             : document.getElementById("inputTimeS").value,
        'endTime'               : document.getElementById("inputTimeE").value,
        'hourlyWage'            : document.getElementById("inputHourlyWage").value,
        'transportationLimit'   : document.getElementById("inputTransportationLimit").value,
        'mealAllowance'         : document.getElementById("inputMealAllowance").value,
        'manager'               : document.getElementById("inputMealManager").value,
        'shiftUrl'              : document.getElementById("inputShiftUrl").value,
        'payDay'                : ''
    };

   let payDayA = [];
   let iPayDayArea = 0;
    Array.from(document.getElementById("inputPayDayArea").querySelectorAll("select")).forEach(function(e) {
        switch (iPayDayArea) {
            case 0:
            case 1:
                payDayA[0] = 0 in payDayA ? payDayA[0] + e.value + '-' : e.value + '-';
                break;
            case 2:
                payDayA[0] = 0 in payDayA ? payDayA[0] + e.value : e.value;
                ; 
                break;
            
            case 3:
            case 4:
                payDayA[1] = 1 in payDayA ? payDayA[1] + e.value + '-' : e.value + '-';
                break;
            case 5:
                payDayA[1] = 1 in payDayA ? payDayA[1] + e.value : e.value;
                break;

            case 6:
            case 7:
                payDayA[2] = 2 in payDayA ? payDayA[2] + e.value + '-' : e.value + '-';
                break;
            case 8:
                payDayA[2] = 2 in payDayA ? payDayA[2] + e.value : e.value;
                break;
        }
        iPayDayArea++;
    });
    Array.from(payDayA).forEach(function(e) {
        paramDB['payDay'] = e.length != 10
            ? paramDB['payDay']
            : !paramDB['payDay']
                ? e
                : paramDB['payDay'] + ',' + e
        ;
    }); 


    switch (id) {
        case 'registerEvent':
            paramDB['eventName'] = document.getElementById("inputEventName").value;

            if (!paramDB['eventName'] || !paramDB['pass']) {
                document.getElementById("eventEditMsg").innerText = '*イベント名とパスワードの入力は必須です。';
            } else if (
                (payDayA[0].length != 2 && payDayA[0].length != 10) ||
                (payDayA[1].length != 2 && payDayA[1].length != 10) ||
                (payDayA[2].length != 2 && payDayA[2].length != 10)
            ) {
                document.getElementById("eventEditMsg").innerText = '*支払い日を正しい日付で入力ミスしてください。';
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
                var result2 = window.confirm('「' + inputEvent + '」を\n本当に削除してよろしいですか・・・？');

                if (result2) {
                    opDB('deleteEvent', paramDB);
                }
            }
            break;           
            
        case 'editEventEdit':
            var itemList = {
                'block' : ['inputRecruit', 'eventName', 'inputPass',  'inputHourlyWage', 'inputTransportationLimit', 'inputMealAllowance', 'inputMealManager', 'inputShiftUrl', 'inputPayDayArea', 'cancelEventEdit' ,'sendEventEdit'],
                'none'  : ['recruit','pass', 'firstDay', 'endDay', 'time', 'hourlyWage', 'transportationLimit', 'mealAllowance', 'manager', 'shiftUrl', 'payDay', 'inputEventName', 'deleteEvent', 'editEventEdit'],
                'flex'  : ['inputFirstDayArea', 'inputEndDayArea', 'inputTimeArea']
            }
            opView(itemList);

            document.getElementById("inputPass").value                  = '';
            document.getElementById("inputRecruit").value               = '';
            document.getElementById("inputFirstYear").value             = '';
            document.getElementById("inputFirstMonth").value            = '';
            document.getElementById("inputFirstDay").value              = '';
            document.getElementById("inputEndYear").value               = '';
            document.getElementById("inputEndMonth").value              = '';
            document.getElementById("inputEndDay").value                = '';
            document.getElementById("inputTimeS").value                 = '';
            document.getElementById("inputTimeE").value                 = '';
            document.getElementById("inputHourlyWage").value            = '';
            document.getElementById("inputTransportationLimit").value   = '';
            document.getElementById("inputMealAllowance").value         = '';
            document.getElementById("inputMealManager").value           = '';
            document.getElementById("inputShiftUrl").value              = '';
            document.getElementById("inputPayDay1Year").value           = '';
            document.getElementById("inputPayDay1Month").value          = '';
            document.getElementById("inputPayDay1Day").value            = '';
            document.getElementById("inputPayDay2Year").value           = '';
            document.getElementById("inputPayDay2Month").value          = '';
            document.getElementById("inputPayDay2Day").value            = '';
            document.getElementById("inputPayDay3Year").value           = '';
            document.getElementById("inputPayDay3Month").value          = '';
            document.getElementById("inputPayDay3Day").value            = '';


            // 値取得
            const firstDayText  = document.getElementById("firstDay").textContent.split(/-/);
            const endDayText    = document.getElementById("endDay").textContent.split(/-/);
            const timeText      = document.getElementById("time").textContent.split(/ /);
            const payDayText    = document.getElementById("payDay").innerHTML.split('<br>');

            document.getElementById("inputPass").placeholder            = '変更しない場合は入力しないこと';
            document.getElementById("inputRecruit").value               = document.getElementById("recruit").textContent;
            document.getElementById("inputFirstYear").value             = firstDayText[0];
            document.getElementById("inputFirstMonth").value            = firstDayText[1];
            document.getElementById("inputFirstDay").value              = firstDayText[2];
            document.getElementById("inputEndYear").value               = endDayText[0];
            document.getElementById("inputEndMonth").value              = endDayText[1];
            document.getElementById("inputEndDay").value                = endDayText[2];
            document.getElementById("inputTimeS").value                 = timeText[0];
            document.getElementById("inputTimeE").value                 = timeText[2];
            document.getElementById("inputHourlyWage").value            = document.getElementById("hourlyWage").textContent;
            document.getElementById("inputTransportationLimit").value   = document.getElementById("transportationLimit").textContent;
            document.getElementById("inputMealAllowance").value         = document.getElementById("mealAllowance").textContent;
            document.getElementById("inputMealManager").value           = document.getElementById("manager").textContent;
            document.getElementById("inputShiftUrl").value              = document.getElementById("shiftUrl").querySelector('a').textContent;
            let iPayDayText = 1;
            Array.from(payDayText).forEach(function(e) {
                var payDayTextA = e.split(/-/);

                document.getElementById("inputPayDay" + iPayDayText + "Year").value = payDayTextA[0];
                document.getElementById("inputPayDay" + iPayDayText + "Month").value = payDayTextA[1];
                document.getElementById("inputPayDay" + iPayDayText + "Day").value = payDayTextA[2];

                iPayDayText++;
            }); 

            break;

        case 'cancelEventEdit':
            var itemList = {
                'block' : ['recruit', 'pass', 'firstDay', 'endDay', 'time', 'hourlyWage', 'transportationLimit', 'mealAllowance', 'manager', 'shiftUrl', 'payDay', 'deleteEvent', 'editEventEdit'],
                'none'  : ['inputRecruit', 'inputPass', 'inputFirstDayArea', 'inputEndDayArea', 'inputTimeArea',  'inputHourlyWage', 'inputTransportationLimit', 'inputMealAllowance', 'inputMealManager', 'inputShiftUrl', 'inputPayDayArea', 'cancelEventEdit' ,'sendEventEdit']
            }
            opView(itemList);
            break;

        case 'sendEventEdit':
            if (
                (payDayA[0].length != 2 && payDayA[0].length != 10) ||
                (payDayA[1].length != 2 && payDayA[1].length != 10) ||
                (payDayA[2].length != 2 && payDayA[2].length != 10)
            ) {
                document.getElementById("eventEditMsg").innerText = '*支払い日を正しい日付で入力ミスしてください。';
            } else {
                var result = window.confirm('イベントを更新してよろしいですか？');
                if (result) {
                    opDB('updateEvent', paramDB);
                }
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
                        'dataAfter'     : statusAfter == '却下済' ? valArray[5] : valArray[6],
                    };
                    opDB('updateWorkReport', paramDB);
                }
            }
        }
    });

}


// スタッフリストの修正
function payslipEdit(id) {
    const selectEvent = document.getElementById("eventName").textContent;

    switch (id) {
        case 'editPayslip':
            var itemList = {
                'block' : ['cancelPayslip', 'updatePayslip'],
                'none'  : ['editPayslip']
            }
            opView(itemList);

            Array.from(document.getElementById("payslipTable").querySelectorAll("p")).forEach(function(e) {
                e.style.display = 'none';
            });
            Array.from(document.getElementById("payslipTable").querySelectorAll("a")).forEach(function(e) {
                e.style.display = 'none';
            });
            Array.from(document.getElementById("payslipTable").querySelectorAll("input")).forEach(function(e) {
                e.style.display = 'block';
            });
            Array.from(document.getElementById("payslipTable").querySelectorAll("textarea")).forEach(function(e) {
                e.style.display = 'block';
            });
            break;

        case 'cancelPayslip':
            getSelectEvent(selectEvent);
            break;

        case 'updatePayslip':
            let payslipList = [];
            Array.from(document.getElementById("payslipTable").querySelectorAll("tr")).forEach(function(e) {
                if (!e.id) {
                    var name        = e.querySelectorAll("td")[0].textContent.split(/\./)[1];
                    var workRules   = e.querySelectorAll("td")[1].querySelector("input").checked ? 'レ' : '';
                    var experience  = e.querySelectorAll("td")[2].querySelector("input").value;
                    var payslipUrl  = e.querySelectorAll("td")[6].querySelector("textarea").value;
                    var tShirt      = e.querySelectorAll("td")[7].querySelector("input").checked ? 'レ' : '';

                    payslipList.push(
                        name
                        + '|' + workRules
                        + '|' + experience
                        + '|' + payslipUrl
                        + '|' + tShirt
                    );
                }
            });

            const result = window.confirm('スタッフリストを更新してよろしいですか？\n*URLが入っているスタッフには給与明細を公開されます。');
            if (result) {
                var paramDB = {
                    'event'         : selectEvent,
                    'payslipList'   : payslipList
                };
                opDB('updateStaffListPayslip', paramDB);
            }
            break;
    }

}


// お知らせ
function news(id) {
    const disp = document.getElementById('dispNews');
    const dispValue = disp.value;
    const none = document.getElementById('noneNews');
    const noneValue = none.value;

    let inputTitle    = '';
    let inputBody     = document.getElementById("inputBody").value.replaceAll("\n", "<br>");
    let inputLink     = document.getElementById("inputLink").value;
    let status = document.getElementsByName('inputStatus');
    let inputStatus = '';
    for (let i = 0; i < status.length; i++){
        if (status.item(i).checked){
            inputStatus = status.item(i).value;
        }
    }
    
    switch (id) {
        case 'dispNews':
            if (dispValue != 'true') {
                disp.value = 'true';
                disp.style.color = '#fff';
                disp.style.background = '#000';

                if (noneValue == 'true') {
                    none.value = 'false';
                    none.style.color = '#000';
                    none.style.background = '#fff';
                }

                // お知らせの取得
                var paramDB = { 'status': '公開' };
                opDB('getNewsList', paramDB);
            }
            break;
    
        case 'noneNews':
            if (noneValue != 'true') {
                none.value = 'true';
                none.style.color = '#fff';
                none.style.background = '#000';

                if (dispValue == 'true') {
                    disp.value = 'false';
                    disp.style.color = '#000';
                    disp.style.background = '#fff';
                }

                // お知らせの取得
                var paramDB = { 'status': '非公開' };
                opDB('getNewsList', paramDB);
            }
            break;

        case 'registerNews':
            document.getElementById("newsMsg").innerText = '';
            inputTitle = document.getElementById("inputTitle").value;

            if (inputTitle) {
                var result = window.confirm('お知らせを登録してよろしいですか？');

                if (result) {
                    var paramDB = {
                        'title' : inputTitle,
                        'body'  : inputBody,
                        'link'  : inputLink,
                        'status': inputStatus,
                    };
                    opDB('registerNews', paramDB);
                }
            } else {
                document.getElementById("newsMsg").innerText = '*タイトルの入力は必須です。';
            }
            break;

        case 'updateNews':
            document.getElementById("newsMsg").innerText = '';
            inputTitle = document.getElementById("newsTitle").innerText;

            if (inputTitle) {
                var result = window.confirm('お知らせを更新してよろしいですか？');

                if (result) {
                    var paramDB = {
                        'title' : inputTitle,
                        'body'  : inputBody,
                        'link'  : inputLink,
                        'status': inputStatus,
                    };
                    opDB('registerNews', paramDB);
                }
            }
            break;

        case 'deleteNews':
            document.getElementById("newsMsg").innerText = '';

            inputTitle = document.getElementById("newsTitle").innerText;
            if (inputTitle) {
                var result = window.confirm('お知らせを削除してよろしいですか？');

                if (result) {
                    var paramDB = {
                        'title' : inputTitle
                    };
                    opDB('deleteNews', paramDB);
                }
            }
            break;
    }


    // 編集モード
    if (id.startsWith("news_")) {
        document.getElementById("newsTitle").style.display      = 'block';
        document.getElementById("inputTitle").style.display     = 'none';
        document.getElementById("registerNews").style.display   = 'none';
        document.getElementById("deleteNews").style.display     = 'block';
        document.getElementById("updateNews").style.display     = 'block';

        document.getElementById("newsTitle").innerText = document.getElementById(id).innerText;
        document.getElementById("inputBody").value = document.getElementById(id.replace("title", "body")).innerText;
        document.getElementById("inputLink").value = document.getElementById(id.replace("title", "link")).innerText;
        if (dispValue == 'true') {
            document.getElementsByName('inputStatus').item(0).checked = true;
        } else if (noneValue == 'true') {
            document.getElementsByName('inputStatus').item(1).checked = true;
        }
    }
}


// スタッフ削除
function sendDeleteStaff() {
    document.getElementById("deleteStaffMsg").innerText = '';

    const name = document.getElementById("deleteStaffName").value;

    if (name) {
        const result = window.confirm('スタッフの削除をしてよろしいですか？');
        if (result) {
            var paramDB = {
                'event'         : document.getElementById("eventName").textContent,
                'name'          : name
            };
            opDB('deleteStaffList', paramDB);
        }
    }
};


// スタッフ追加
function sendAddStaff() {
    document.getElementById("addStaffMsg").innerText = '';

    const name = document.getElementById("addStaffName").value;
    const mail = document.getElementById("addStaffMail").value;
    const birthday = document.getElementById("addStaffBirthday").value;

    if (!name || !mail || !birthday) {
        document.getElementById("addStaffMsg").innerText = 'すべての項目に入力が必要です。';   
    } else {
        const result = window.confirm('スタッフの追加をしてよろしいですか？');
        if (result) {
            var paramDB = {
                'event'         : document.getElementById("eventName").textContent,
                'name'          : name,
                'mail'          : mail.trim(),
                'birthday'      : birthday
            };
            opDB('registerStaffListAdd', paramDB);
        }
    }
};



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
                document.getElementById("recruit").innerText = '';
                document.getElementById("eventName").innerText = '';
                document.getElementById("firstDay").innerText  = '';
                document.getElementById("endDay").innerText  = '';
                document.getElementById("time").innerText  = '';
                document.getElementById("hourlyWage").innerText  = '';
                document.getElementById("transportationLimit").innerText  = '';
                document.getElementById("mealAllowance").innerText  = '';
                document.getElementById("manager").innerText  = '';
                document.getElementById("shiftUrl").querySelector("a").href = '';
                document.getElementById("shiftUrl").querySelector("a").innerText = '';
                document.getElementById("payDay").innerText  = '';

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    // イベント情報
                    document.getElementById("recruit").innerText             = data.recruit;
                    document.getElementById("eventName").innerText           = data.event;
                    document.getElementById("firstDay").innerText            = data.first_day;
                    document.getElementById("endDay").innerText              = data.end_day;
                    document.getElementById("time").innerText                = data.start_time + ' ～ ' + data.end_time;
                    document.getElementById("hourlyWage").innerText          = data.hourly_wage;
                    document.getElementById("transportationLimit").innerText = data.transportation_limit;
                    document.getElementById("mealAllowance").innerText       = data.meal_allowance;
                    document.getElementById("manager").innerText             = data.manager;
                    if (data.shift_url) {
                        document.getElementById("shiftUrl").querySelector("a").href = data.shift_url;
                        document.getElementById("shiftUrl").querySelector("a").innerText = data.shift_url;
                    }
                    if (data.pay_day) {
                        document.getElementById("payDay").innerHTML = data.pay_day.replaceAll(",", "<br>");
                    }


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
                    th.className = "sticky3";
                    tr.appendChild(th);

                    const firstDay = data.first_day.split(/-/);
                    const endDay = data.end_day.split(/-/);
                    for (
                        let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                        date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                        date.setDate(date.getDate() + 1)
                    ){
                        var th = document.createElement("th");
                        th.innerText = date.toLocaleDateString('sv-SE');
                        th.colSpan = "2";
                        th.className = "sticky1_1";
                        tr.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '出勤';
                        th.className = 'borderRight borderBottom sticky1_2';
                        tr2.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '退勤';
                        th.className = 'borderLeft borderBottom sticky1_2';
                        tr2.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '休憩';
                        th.className = 'borderTop borderRight sticky1_3';
                        tr3.appendChild(th);

                        var th = document.createElement("th");
                        th.innerText = '実働';
                        th.className = 'borderTop borderLeft sticky1_3';
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

        case 'getEventNotice':
            var param   = "function=" + "get_event_notice";
            xmlhttp.onreadystatechange = function() {

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        document.getElementById("eventInfoNoticeArea").style.display = 'flex';

                        const dl = document.getElementById("eventInfoNoticeArea").querySelector('dl');

                        for (let event in data) {
                            var dt = document.createElement("dt");
                            dt.innerText = event;

                            var dd = document.createElement("dd");

                            // 応募リスト
                            if ('al_status' in data[event]) {
                                var div1 = document.createElement("div");

                                var title1        = document.createElement("div");
                                var title1P       = document.createElement("p");
                                title1P.innerText = '応募';
                                title1.className = 'noticeTitle';
                                title1.appendChild(title1P);

                                var item1       = document.createElement("div");
                                item1.className = 'noticeItem';
                                for (let name in data[event].al_status) {
                                    var nameP = document.createElement("p");
                                    nameP.innerText = name;
                                    nameP.className = 'noticeTitleA';

                                    var nameS               = document.createElement("span");
                                    nameS.innerText         = data[event].al_status[name];
                                    nameS.style.background  = data[event].al_status[name]  == '採用' 
                                        ? "#debecc"
                                        : "#e3d7a3"
                                    ;

                                    nameP.appendChild(nameS);
                                    item1.appendChild(nameP);
                                }
                                div1.appendChild(title1);
                                div1.appendChild(item1);
                                dd.appendChild(div1);
                            }

                            // シフト変更希望リスト
                            if ('sl_change' in data[event]) {
                                var div2 = document.createElement("div");

                                var title2        = document.createElement("div");
                                var title2P       = document.createElement("p");
                                title2P.innerText = '変更';
                                title2.className = 'noticeTitle';
                                title2.appendChild(title2P);

                                var item2       = document.createElement("p");
                                item2.className = 'noticeItem';
                                item2.innerText = '未承認： ' + data[event].sl_change + ' 件';

                                div2.appendChild(title2);
                                div2.appendChild(item2);
                                dd.appendChild(div2);
                            }


                            // 支払日
                            if ('pay_day' in data[event]) {
                                var div3 = document.createElement("div");

                                var title3        = document.createElement("din");
                                var title3P       = document.createElement("p");
                                title3P.innerText = '支払日';
                                title3.className = 'noticeTitle';
                                title3.appendChild(title3P);

                                var item3       = document.createElement("p");
                                item3.className = 'noticeItem';
                                let payDayList = '';
                                for (let pD in data[event].pay_day) {
                                    payDayList = payDayList
                                        ? payDayList + '<br>' + data[event].pay_day[pD] 
                                        : data[event].pay_day[pD]
                                    ;
                                }
                                item3.innerHTML = payDayList;

                                div3.appendChild(title3);
                                div3.appendChild(item3);
                                dd.appendChild(div3);
                            }                            

                            dl.appendChild(dt);
                            dl.appendChild(dd);
                        }
                    }
                }
            }
            break;

        case 'registerEvent':
            var param = "function=" + "register_event"
                + "&recruit="               + encodeURIComponent(paramDB.recruit)
                + "&event="                 + encodeURIComponent(paramDB.eventName)
                + "&pass="                  + encodeURIComponent(paramDB.pass)
                + "&firstDay="              + encodeURIComponent(paramDB.firstDay)
                + "&endDay="                + encodeURIComponent(paramDB.endDay)
                + "&startTime="             + encodeURIComponent(paramDB.startTime)
                + "&endTime="               + encodeURIComponent(paramDB.endTime)
                + "&hourlyWage="            + encodeURIComponent(paramDB.hourlyWage)
                + "&transportationLimit="   + encodeURIComponent(paramDB.transportationLimit)
                + "&mealAllowance="         + encodeURIComponent(paramDB.mealAllowance)
                + "&manager="               + encodeURIComponent(paramDB.manager)
                + "&shiftUrl="              + encodeURIComponent(paramDB.shiftUrl)
                + "&payDay="                + encodeURIComponent(paramDB.payDay)
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
                + "&recruit="               + encodeURIComponent(paramDB.recruit)
                + "&event="                 + encodeURIComponent(paramDB.eventName)
                + "&pass="                  + encodeURIComponent(paramDB.pass)
                + "&firstDay="              + encodeURIComponent(paramDB.firstDay)
                + "&endDay="                + encodeURIComponent(paramDB.endDay)
                + "&startTime="             + encodeURIComponent(paramDB.startTime)
                + "&endTime="               + encodeURIComponent(paramDB.endTime)
                + "&hourlyWage="            + encodeURIComponent(paramDB.hourlyWage)
                + "&transportationLimit="   + encodeURIComponent(paramDB.transportationLimit)
                + "&mealAllowance="         + encodeURIComponent(paramDB.mealAllowance)
                + "&manager="               + encodeURIComponent(paramDB.manager)
                + "&shiftUrl="              + encodeURIComponent(paramDB.shiftUrl)
                + "&payDay="                + encodeURIComponent(paramDB.payDay)
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
                const selectStaff = document.getElementById("selectStampInfoStaff");
                Array.from(selectStaff.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                const workReportInfoTable = document.getElementById("workReportInfoArea").querySelector("tbody");
                Array.from(workReportInfoTable.querySelectorAll("tr")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }
                });

                const deleteStaffName = document.getElementById("deleteStaffName");
                Array.from(deleteStaffName.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });
                var InitialV = document.createElement("option"); 
                InitialV.text = '';
                InitialV.value = '';
                InitialV.hidden = true;
                deleteStaffName.appendChild(InitialV);

                const payslipTable = document.getElementById("payslipArea").querySelector("tbody");
                Array.from(payslipTable.querySelectorAll("tr")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        Object.keys(data).forEach(function(key) {

                            // 勤怠情報表示
                            var tr = document.createElement("tr");
                            var tr2 = document.createElement("tr");
                            workReportInfoTable.appendChild(tr);
                            workReportInfoTable.appendChild(tr2);
                            var nextParamDB = {
                                'event' : paramDB['event'],
                                'no'    : data[key].no,
                                'name'  : data[key].name,
                                'tr'    : tr,
                                'tr2'   : tr2
                            };
                            opDB('getWorkReport', nextParamDB);


                            // 打刻情報表示
                            var option = document.createElement("option");
                            option.text = data[key].no + '.' + data[key].name;
                            option.value = data[key].name;
                            selectStaff.appendChild(option);


                            // スタッフ削除
                            var option2 = document.createElement("option");
                            option2.text = data[key].no + '.' + data[key].name;
                            option2.value = data[key].name;
                            deleteStaffName.appendChild(option2);


                            // スタッフリスト
                            var tr3 = document.createElement("tr");

                            // 氏名
                            var staffName = document.createElement("td");
                            staffName.innerText = data[key].no + '.' + data[key].name;
                            staffName.className = 'w15 sticky3 textLeft';
                            
                            // 就業規則
                            var workRules       = document.createElement("td");
                            workRules.className = 'w10';
                            var workRulesP              = document.createElement("p");
                            workRulesP.innerText        = data[key].work_rules;
                            workRulesP.style.fontWeight = 'bold';
                            var workRulesI           = document.createElement('input');
                            workRulesI.type          = "checkbox";
                            workRulesI.checked       = data[key].work_rules == 'レ' ? true : false; 
                            workRules.appendChild(workRulesP);
                            workRules.appendChild(workRulesI);
                            
                            // 経験者手当
                            var experience       = document.createElement("td");
                            experience.className = 'w10';
                            var experienceP       = document.createElement("p");
                            if (data[key].experience) {
                                experienceP.innerText = data[key].experience + '円';
                            }
                            var experienceI             = document.createElement('input');
                            experienceI.value           = data[key].experience;
                            experienceI.type            = "text";
                            experience.appendChild(experienceP);
                            experience.appendChild(experienceI);
                            
                            // 利用駅
                            var station = document.createElement("td");
                            station.innerText = data[key].station;
                            station.className = 'w10';

                            // 交通費
                            var transportation = document.createElement("td");
                            if (data[key].transportation) {
                                transportation.innerText = data[key].transportation + '円';
                            }
                            transportation.className = 'w10';

                            // 銀行口座
                            var bank = document.createElement("td");
                            if (data[key].bank) {
                                bank.innerHTML = data[key].bank.replaceAll("_", "<br>");   
                            }
                            bank.className = 'w30 textLeft';                            

                            // 給与明細URL
                            var payslipUrl       = document.createElement("td");
                            payslipUrl.className = 'w30 textLeft';
                            if (data[key].payslip) {
                                data[key].payslip.split(/\n/).forEach(function(val) {
                                    var payslipUrlA             = document.createElement("a");
                                    payslipUrlA.innerText       = val;
                                    payslipUrlA.href            = val;
                                    payslipUrlA.target          = "_blank";
                                    payslipUrlA.style.display   = "block";
                                    payslipUrl.appendChild(payslipUrlA);
                                });
                            }
                            var payslipUrlT         = document.createElement("textarea");
                            payslipUrlT.innerHTML   = data[key].payslip;
                            payslipUrlT.name        = "payslip";
                            payslipUrl.appendChild(payslipUrlT);

                            // Tシャツ
                            var tShirt       = document.createElement("td");
                            tShirt.className = 'w10';
                            var tShirtP              = document.createElement("p");
                            tShirtP.innerText        = data[key].t_shirt;
                            tShirtP.style.fontWeight = 'bold';
                            var tShirtI           = document.createElement('input');
                            tShirtI.type          = "checkbox";
                            tShirtI.checked       = data[key].t_shirt == 'レ' ? true : false; 
                            tShirt.appendChild(tShirtP);
                            tShirt.appendChild(tShirtI);


                            tr3.appendChild(staffName);
                            tr3.appendChild(workRules);
                            tr3.appendChild(experience);
                            tr3.appendChild(station);
                            tr3.appendChild(transportation);
                            tr3.appendChild(bank);
                            tr3.appendChild(payslipUrl);
                            tr3.appendChild(tShirt);

                            payslipTable.appendChild(tr3);
                        });
                    }
                }
            }
            break;
            
        case 'deleteStaffList':
            var param = "function=" + "delete_staff_list"
                + "&event="         + encodeURIComponent(paramDB.event)
                + "&name="         + encodeURIComponent(paramDB.name)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        document.getElementById("deleteStaffMsg").innerText = '';

                        getSelectEvent(paramDB.event);
                    } else {
                        document.getElementById("deleteStaffMsg").innerText = '*スタッフの削除に失敗しました。';
                    }
                }
            }
            break;

        case 'registerStaffListAdd':
            var param = "function=" + "register_staff_list_add"
                + "&event="         + encodeURIComponent(paramDB.event)
                + "&name="          + encodeURIComponent(paramDB.name)
                + "&mail="          + encodeURIComponent(paramDB.mail)
                + "&birthday="      + encodeURIComponent(paramDB.birthday)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        document.getElementById("addStaffMsg").innerText = '';
                        document.getElementById("addStaffName").value = '';
                        document.getElementById("addStaffMail").value = '';
                        document.getElementById("addStaffBirthday").value = 'yyyymmdd';

                        getSelectEvent(paramDB.event);
                    } else {
                        document.getElementById("addStaffMsg").innerText = 'スタッフの追加ができませんでした。';
                    }
                }
            }
            break;

        case 'updateStaffListPayslip':
            var param = "function=" + "update_staff_list_payslip"
                + "&event="         + encodeURIComponent(paramDB.event)
                + "&payslipList="   + encodeURIComponent(paramDB.payslipList)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getSelectEvent(paramDB.event);
                    } else {
                        document.getElementById("payslipMsg").innerText = 'スタッフリストが更新できませんでした。';
                    }
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
                        name.innerText = paramDB['no'] + '.' + paramDB['name'];
                        name.rowSpan = "2";
                        name.className = "sticky2";
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
                                        if (data[key].start && data[key].start != '-') {
                                            dataS = data[key].start;

                                            if (!dataS.startsWith('＊')) {
                                                // 切り上げ
                                                dataS = ceil(dataS);
                                            }
                                        }

                                        // 退勤
                                        if (data[key].end && data[key].end != '-') {
                                            dataE = data[key].end;

                                            if (!dataE.startsWith('＊')) {
                                                // 切り捨て
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
                                        var break1s = data[key].break1s && data[key].break1s != '-' ? data[key].break1s : '';
                                        var break1e = data[key].break1e && data[key].break1e != '-' ? data[key].break1e : '';
                                        var break2s = data[key].break2s && data[key].break2s != '-' ? data[key].break2s : '';
                                        var break2e = data[key].break2e && data[key].break2e != '-' ? data[key].break2e : '';
                                        var break3s = data[key].break3s && data[key].break3s != '-' ? data[key].break3s : '';
                                        var break3e = data[key].break3e && data[key].break3e != '-' ? data[key].break3e : '';
                                        if (data[key].start && data[key].start != '-') {
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
                                                    // 切り上げ
                                                    break1s = ceil(break1s);
                                                    break1e = ceil(break1e);

                                                    var break1 = clac(e.textContent, break1s, break1e, 'diff');
                                                    dataB = break1;
                                                }                                                

                                                if (break2s && break2e) {
                                                    // 切り上げ
                                                    break2s = ceil(break2s);
                                                    break2e = ceil(break2e);

                                                    var break2 = clac(e.textContent, break2s, break2e, 'diff');
                                                    dataB = clac(e.textContent, dataB, break2, 'sum');
                                                }

                                                if (break3s && break3e) {
                                                    // 切り上げ
                                                    break3s = ceil(break3s);
                                                    break3e = ceil(break3e);

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
                                                + ',' + dataItem[key].data_before
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
                    } else {
                        document.getElementById("workReportInfoEditMsg").innerText = 'ステータス変更ができませんでした。';
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
                    const tbl = document.getElementById("newsTable").querySelector("tbody");

                    Array.from(tbl.querySelectorAll("tr")).forEach(function(e) {
                        if (!e.id) {
                            e.remove();
                        }
                    });

                    if (data) {  
                        let i = 0;                      
                        Object.keys(data).forEach(function(key) {
                            i++;

                            var tr = document.createElement("tr");

                            var registerDt = document.createElement("td");
                            registerDt.innerText = data[key].register_dt;
                            registerDt.id = 'news_' + i + '_registerDt';
                            tr.appendChild(registerDt);

                            var button = document.createElement("button");
                            button.innerText = data[key].title;
                            button.id = 'news_' + i + '_title';
                            var title = document.createElement("td");
                            title.className = 'w50 textLeft';
                            title.appendChild(button);
                            tr.appendChild(title);

                            var body = document.createElement("td");
                            body.innerHTML = data[key].body;
                            body.className = 'w70 textLeft';
                            body.id = 'news_' + i + '_body';
                            tr.appendChild(body);

                            var a = document.createElement("a");
                            a.innerText = data[key].link;
                            a.href = data[key].link;
                            a.target = "_blank";
                            a.id = 'news_' + i + '_link';
                            var link = document.createElement("td");
                            link.className = 'w50 textLeft';
                            link.appendChild(a);
                            tr.appendChild(link);

                            tbl.appendChild(tr);
                        });
                    }
                }
            }
            break;

        case 'registerNews':
            var param = "function=" + "register_news"
                + "&requestDt=" + encodeURIComponent(date().yyyymmddhhmmss)
                + "&title="     + encodeURIComponent(paramDB.title)
                + "&body="      + encodeURIComponent(paramDB.body)
                + "&link="      + encodeURIComponent(paramDB.link)
                + "&status="    + encodeURIComponent(paramDB.status)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        let status = document.getElementsByName('inputStatus');
                        let inputStatus = '';
                        for (let i = 0; i < status.length; i++){
                            if (status.item(i).checked){
                                inputStatus = status.item(i).value;
                            }
                        }

                        const disp = document.getElementById('dispNews');
                        const none = document.getElementById('noneNews');
                        switch (inputStatus) {
                            case '公開':
                                disp.value = 'true';
                                disp.style.color = '#fff';
                                disp.style.background = '#000';
                                none.value = 'false';
                                none.style.color = '#000';
                                none.style.background = '#fff';
                                break;
                        
                            case '非公開':
                                none.value = 'true';
                                none.style.color = '#fff';
                                none.style.background = '#000';
                                disp.value = 'false';
                                disp.style.color = '#000';
                                disp.style.background = '#fff';
                                break;
                        }
                        var nextParam = { 'status': inputStatus };
                        opDB('getNewsList', nextParam);

                        document.getElementById("newsMsg").innerText = '';
                        document.getElementById("newsTitle").innerText = '';
                        document.getElementById("inputTitle").value = '';
                        document.getElementById("inputBody").value = '';
                        document.getElementById("inputLink").value = '';
                        document.getElementsByName('inputStatus').item(0).checked = true;

                        document.getElementById("newsTitle").style.display      = 'none';
                        document.getElementById("inputTitle").style.display     = 'block';
                        document.getElementById("registerNews").style.display   = 'block';
                        document.getElementById("deleteNews").style.display     = 'none';
                        document.getElementById("updateNews").style.display     = 'none';
                    } else {
                        document.getElementById("newsMsg").innerText = 'お知らせの登録ができませんでした。';
                    }
                }
            }
            break;

        case 'deleteNews':
            var param = "function=" + "delete_news"
                + "&title="     + encodeURIComponent(paramDB.title)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        let status = document.getElementsByName('inputStatus');
                        let inputStatus = '';
                        for (let i = 0; i < status.length; i++){
                            if (status.item(i).checked){
                                inputStatus = status.item(i).value;
                            }
                        }

                        const disp = document.getElementById('dispNews');
                        const none = document.getElementById('noneNews');
                        switch (inputStatus) {
                            case '公開':
                                disp.value = 'true';
                                disp.style.color = '#fff';
                                disp.style.background = '#000';
                                none.value = 'false';
                                none.style.color = '#000';
                                none.style.background = '#fff';
                                break;
                        
                            case '非公開':
                                none.value = 'true';
                                none.style.color = '#fff';
                                none.style.background = '#000';
                                disp.value = 'false';
                                disp.style.color = '#000';
                                disp.style.background = '#fff';
                                break;
                        }
                        var nextParam = { 'status': inputStatus };
                        opDB('getNewsList', nextParam);

                        document.getElementById("newsMsg").innerText = '';
                        document.getElementById("newsTitle").innerText = '';
                        document.getElementById("inputTitle").value = '';
                        document.getElementById("inputBody").value = '';
                        document.getElementById("inputLink").value = '';
                        document.getElementsByName('inputStatus').item(0).checked = true;

                        document.getElementById("newsTitle").style.display      = 'none';
                        document.getElementById("inputTitle").style.display     = 'block';
                        document.getElementById("registerNews").style.display   = 'block';
                        document.getElementById("deleteNews").style.display     = 'none';
                        document.getElementById("updateNews").style.display     = 'none';
                    } else {
                        document.getElementById("newsMsg").innerText = '*お知らせの削除に失敗しました。';
                    }
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


// 切り上げ
function ceil(data) {
    var dataA  = data.split(/:/);

    var min  = Math.ceil(dataA[1] / 15) * 15;
    var hour = Number(dataA[0]) + Number((min == 60 ? 1 : 0));
    dataClac = hour + ':' + (min == 60 ? '00' : min.toString().padStart(2, '0'));
    
    return dataClac;
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