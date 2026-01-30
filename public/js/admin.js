window.onload = () => {

    // ログイン
    const adminUser = window.localStorage.getItem("adminUser");
    adminLogin(adminUser);


    // ログアウト
    document.getElementById("adminLogout").onclick = function() {
        localStorage.removeItem('adminUser');
        window.location.reload();
    }


    // 表示エリアの操作
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


    // イベントの選択
    document.getElementById("sendSelectEvent").onclick = function() {
        const selectEvent = document.getElementById("selectEvent").value;
        getSelectEvent(selectEvent);
    }


    // イベントの編集
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


    // 日報の表示
    document.getElementById("dayReportSelect").onchange = function() {
        const selectEvent = document.getElementById("selectEvent").value;

        // シフトの取得
        var paramDB = {
            'event' : selectEvent,
            'day' : document.getElementById("dayReportSelect").value
        };
        opDB('getDayReport', paramDB);
    }


    // 打刻情報の表示
    document.getElementById("sendStampInfo").onclick = function() {
        common_text_entry({'innerText' : {'stampInfoEditMsg' : ''}});

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


    // 打刻情報の修正
    document.getElementById("sendStampInfoEdit").onclick = function() {
        stampInfoEdit();
    }


    // 勤怠修正情報の操作
    document.getElementById("approveWorkReportInfo").onclick = function() {
        workReportInfoEdit(this.id);
    }
    document.getElementById("rejectWorkReportInfo").onclick = function() {
        workReportInfoEdit(this.id);
    }


    // スタッフリストの操作
    document.getElementById("editPayslip").onclick = function() {
        payslipEdit(this.id);
    }
    document.getElementById("cancelPayslip").onclick = function() {
        payslipEdit(this.id);
    }
    document.getElementById("updatePayslip").onclick = function() {
        payslipEdit(this.id);
    }


    // お知らせの操作
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


    // 給与明細の作成
    document.getElementById("payslipTable").addEventListener('click', (e) => {
        if (e.target.className == "staffNameB") {
            window.open(
                (
                    (window.location.href).replaceAll("admin", "payslip")
                    + '?' + 'event=' + encodeURI(document.getElementById("eventName").textContent)
                    + '&' + 'name=' + e.target.value
                ),
                '_blank'
            );
        }
    })


    // スタッフ削除
    document.getElementById("sendDeleteStaff").onclick = function() {
        sendDeleteStaff();
    }


    // スタッフ追加
    document.getElementById("sendAddStaff").onclick = function() {
        sendAddStaff();
    }


    // 別タブで開く
    document.getElementById("newTabWorkReportInfo").onclick = function() {
        window.open(
            (
                window.location.href
                + '?' + 'event=' + encodeURI(document.getElementById("eventName").textContent)
                + '&' + 'newTab=' + encodeURI('workReportInfoArea')
            ),
            '_blank'
        );
    }
    document.getElementById("newTabWorkReportInfoEdit").onclick = function() {
        window.open(
            (
                window.location.href
                + '?' + 'event=' + encodeURI(document.getElementById("eventName").textContent)
                + '&' + 'newTab=' + encodeURI('workReportInfoEditArea')
            ),
            '_blank'
        );
    }
}


// ──────────────────────────────────────────────────────
//  管理者ログイン
// ………………………………………………………………………………………………………………………………………………
function adminLogin(adminUser) {
    if (adminUser) {
        const url    = new URL(window.location.href);
        const params = url.searchParams;

        if (params.get('event') && params.get('newTab')) {
            // イベントの選択
            getSelectEvent(params.get('event'));

            // テーブルを拡大して開く
            var noneList = [];
            var table = '';
            switch (params.get('newTab')) {
                case 'workReportInfoArea':
                    noneList = ['menuBar', 'selectEventArea', 'eventInfoNoticeArea', 'dayReportArea', 'eventInfoAreaOpen', 'workReportInfoAreaOpen', 'workReportInfoMenu', 'stampInfoAreaOpen', 'workReportInfoEditAreaOpen', 'payslipAreaOpen', 'newsAreaOpen'];
                    table = 'workReportInfoTable';
                    break;

                case 'workReportInfoEditArea':
                    noneList = ['menuBar', 'selectEventArea', 'eventInfoNoticeArea', 'dayReportArea', 'eventInfoAreaOpen', 'workReportInfoAreaOpen', 'stampInfoAreaOpen', 'workReportInfoEditAreaOpen', 'workReportInfoEditMenu', 'payslipAreaOpen', 'newsAreaOpen'];
                    table = 'workReportInfoEditTable';
                    break;
            }
            common_open_table(params.get('newTab'), noneList, table);
        } else {
            // イベントリストの取得
            opDB('getEventList', null);

            // イベントお知らせの取得
            opDB('getEventNotice', null);
        }
    } else {
        common_op_modal('adminLogin', 'open');

        document.getElementById("sendAdminUser").onclick = function() {
            var inputAdminUser      = document.getElementById("adminUser").value.trim();
            var inputAdminUserPass  = document.getElementById("adminUserPass").value.trim();

            if (!inputAdminUser || !inputAdminUserPass) {
                common_text_entry({'innerText' : {'adminMsg' : 'すべての項目に入力が必要です。'}});
            } else {
                var paramDB = {
                    'inputAdminUser'     : inputAdminUser,
                    'inputAdminUserPass' : inputAdminUserPass
                };
                opDB('adminLogin', paramDB);
            }
        }
    }
}


// ──────────────────────────────────────────────────────
//  表示エリアの操作
// ………………………………………………………………………………………………………………………………………………
function areaOpen(item, opItemList) {
    const span = item.querySelector("span");

    var mark    = span.textContent;
    var op      = mark == '▼' ? 'none' : 'flex';
    var markC   = mark == '▼' ? '▲' : '▼';
    var color   = mark == '▼' ? '#000' : '#dc4618ff';

    common_op_view({
        [op] : opItemList
    });
    common_set_element({
        'element'   : span,
        'innerText' : markC,
        'color'     : color,
    });
}


// ──────────────────────────────────────────────────────
//  イベントの選択
// ………………………………………………………………………………………………………………………………………………
function getSelectEvent(selectEvent) {
    common_text_entry({
        'innerText' : {
            // イベント情報
            'eventEditMsg' : '',

            // 打刻情報
            'startShift'        : '',
            'endShift'          : '',
            'stampInfoEvent'    : '',
            'stampInfoStaff'    : '',
            'stampInfoDay'      : '',
            'startStamp'        : '',
            'break1sStamp'      : '',
            'break1eStamp'      : '',
            'break2sStamp'      : '',
            'break2eStamp'      : '',
            'break3sStamp'      : '',
            'break3eStamp'      : '',
            'endStamp'          : '',
            'startWork'         : '',
            'break1sWork'       : '',
            'break1eWork'       : '',
            'break2sWork'       : '',
            'break2eWork'       : '',
            'break3sWork'       : '',
            'break3eWork'       : '',

            // 勤怠修正情報
            'workReportInfoEditMsg' : '',

            // スタッフリスト
            'payslipMsg' : '',
        },
        'value'      : {
            // 打刻情報
            'startEdit'             : '-',
            'break1sEdit'           : '-',
            'break1eEdit'           : '-',
            'break2sEdit'           : '-',
            'break2eEdit'           : '-',
            'break3sEdit'           : '-',
            'break3eEdit'           : '-',
            'endEdit'               : '-',
            'editStampInfoReason'   : '',
        }
    });

    if (selectEvent) {
        common_op_view({
            'block' : [
                // イベント情報
                'recruit',
                'eventName',
                'pass',
                'firstDay',
                'endDay',
                'time',
                'place',
                'hourlyWage',
                'transportationLimit',
                'manager',
                'shiftUrl',
                'payDay',
                'memo',
                'deleteEvent',
                'editEventEdit',

                // 勤怠修正情報
                'approveWorkReportInfo',
                'rejectWorkReportInfo',
                'newTabWorkReportInfoEdit',

                // スタッフリスト
                'editPayslip'
            ],
            'none'  : [
                // イベント情報
                'eventInfoNoticeArea',
                'inputRecruit',
                'inputEventName',
                'inputPass',
                'inputFirstDayArea',
                'inputEndDayArea',
                'inputTimeArea',
                'inputPlace',
                'inputHourlyWage',
                'inputTransportationLimit',
                'inputMealManager',
                'inputShiftUrl',
                'inputPayDayArea',
                'inputMemo',
                'registerEvent',
                'cancelEventEdit',
                'sendEventEdit',

                // 勤怠修正情報
                'cancelWorkReportInfo',
                'updateWorkReportInfo',

                // お知らせ
                'newsAreaOpen',
                'newsArea',

                // スタッフリスト
                'cancelPayslip',
                'updatePayslip'
            ],
            'flex'  : [
                // イベント情報
                'dayReportArea',

                // 開くボタン
                'workReportInfoAreaOpen',
                'stampInfoAreaOpen',
                'workReportInfoEditAreaOpen',
                'payslipAreaOpen'
            ]
        });

        var paramDB = {'event': selectEvent};
        opDB('getEvent', paramDB);
    } else {
        window.location.reload();
    }
}


// ──────────────────────────────────────────────────────
//  イベントの編集
// ………………………………………………………………………………………………………………………………………………
function eventEdit(id) {
    common_text_entry({'innerText' : {'eventEditMsg' : ''}});

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
        'place'                 : document.getElementById("inputPlace").value,
        'hourlyWage'            : document.getElementById("inputHourlyWage").value,
        'transportationLimit'   : document.getElementById("inputTransportationLimit").value,
        'manager'               : document.getElementById("inputMealManager").value,
        'shiftUrl'              : document.getElementById("inputShiftUrl").value,
        'payDay'                : '',
        'memo'                  : document.getElementById("inputMemo").value
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
                common_text_entry({'innerText' : {'eventEditMsg' : '*イベント名とパスワードの入力は必須です。'}});
            } else if (
                (payDayA[0].length != 2 && payDayA[0].length != 10) ||
                (payDayA[1].length != 2 && payDayA[1].length != 10) ||
                (payDayA[2].length != 2 && payDayA[2].length != 10)
            ) {
                common_text_entry({'innerText' : {'eventEditMsg' : '*支払い日を正しい日付で入力ミスしてください。'}});
            } else {
                var result = window.confirm('イベントを登録してよろしいですか？');
                if (result) {
                    opDB('registerEvent', paramDB);
                }
            }
            break;

        case 'deleteEvent':
            var result  = window.confirm('イベントを削除すると、\n関連する打刻データなどがすべて消去されます。\nイベントを削除してよろしいですか？');
            var result2 = window.confirm('「' + inputEvent + '」を\n本当に削除してよろしいですか・・・？');
            if (result) {
                if (result2) {
                    opDB('deleteEvent', paramDB);
                }
            }
            break;

        case 'editEventEdit':
            common_op_view({
                'block' : ['inputRecruit', 'eventName', 'inputPass',  'inputPlace', 'inputHourlyWage', 'inputTransportationLimit', 'inputMealManager', 'inputShiftUrl', 'inputPayDayArea', 'inputMemo', 'cancelEventEdit' ,'sendEventEdit'],
                'none'  : ['recruit','pass', 'firstDay', 'endDay', 'time', 'place', 'hourlyWage', 'transportationLimit', 'manager', 'shiftUrl', 'payDay', 'memo', 'inputEventName', 'deleteEvent', 'editEventEdit'],
                'flex'  : ['inputFirstDayArea', 'inputEndDayArea', 'inputTimeArea']
            });
            common_text_entry({
                'value' : {
                    'inputPass'                 : '',
                    'inputRecruit'              : '',
                    'inputFirstYear'            : '',
                    'inputFirstMonth'           : '',
                    'inputFirstDay'             : '',
                    'inputEndYear'              : '',
                    'inputEndMonth'             : '',
                    'inputEndDay'               : '',
                    'inputTimeS'                : '',
                    'inputTimeE'                : '',
                    'inputPlace'                : '',
                    'inputHourlyWage'           : '',
                    'inputTransportationLimit'  : '',
                    'inputMealManager'          : '',
                    'inputShiftUrl'             : '',
                    'inputPayDay1Year'          : '',
                    'inputPayDay1Month'         : '',
                    'inputPayDay1Day'           : '',
                    'inputPayDay2Year'          : '',
                    'inputPayDay2Month'         : '',
                    'inputPayDay2Day'           : '',
                    'inputPayDay3Year'          : '',
                    'inputPayDay3Month'         : '',
                    'inputPayDay3Day'           : '',
                    'inputMemo'                 : '',
                }
            });

            // 値取得
            const firstDayText  = document.getElementById("firstDay").textContent.split(/-/);
            const endDayText    = document.getElementById("endDay").textContent.split(/-/);
            const timeText      = document.getElementById("time").textContent.split(/ /);
            const payDayText    = document.getElementById("payDay").innerHTML.split('<br>');
            common_text_entry({
                'placeholder' : {
                    'inputPass' : '変更しない場合は入力しないこと',
                },
                'value' : {
                    'inputRecruit'              : document.getElementById("recruit").textContent,
                    'inputFirstYear'            : firstDayText[0],
                    'inputFirstMonth'           : firstDayText[1],
                    'inputFirstDay'             : firstDayText[2],
                    'inputEndYear'              : endDayText[0],
                    'inputEndMonth'             : endDayText[1],
                    'inputEndDay'               : endDayText[2],
                    'inputTimeS'                : timeText[0],
                    'inputTimeE'                : timeText[2],
                    'inputPlace'                : document.getElementById("place").textContent,
                    'inputHourlyWage'           : document.getElementById("hourlyWage").textContent,
                    'inputTransportationLimit'  : document.getElementById("transportationLimit").textContent,
                    'inputMealManager'          : document.getElementById("manager").textContent,
                    'inputShiftUrl'             : document.getElementById("shiftUrl").querySelector('a').textContent,
                    'inputMemo'                 : document.getElementById("memo").innerHTML.replaceAll("<br>", "\n"),
                }
            });

            let iPayDayText = 1;
            Array.from(payDayText).forEach(function(e) {
                var payDayTextA = e.split(/-/);

                common_text_entry({
                    'value' : {
                        ["inputPayDay" + iPayDayText + "Year"]  : payDayTextA[0],
                        ["inputPayDay" + iPayDayText + "Month"] : payDayTextA[1],
                        ["inputPayDay" + iPayDayText + "Day"]   : payDayTextA[2],
                    }
                });

                iPayDayText++;
            });
            break;

        case 'cancelEventEdit':
            common_op_view({
                'block' : ['recruit', 'pass', 'firstDay', 'endDay', 'time', 'place', 'hourlyWage', 'transportationLimit', 'manager', 'shiftUrl', 'payDay', 'memo', 'deleteEvent', 'editEventEdit'],
                'none'  : ['inputRecruit', 'inputPass', 'inputFirstDayArea', 'inputEndDayArea', 'inputTimeArea',  'inputPlace', 'inputHourlyWage', 'inputTransportationLimit', 'inputMealManager', 'inputShiftUrl', 'inputPayDayArea', 'inputMemo', 'cancelEventEdit' ,'sendEventEdit']
            });
            break;

        case 'sendEventEdit':
            if (
                (payDayA[0].length != 2 && payDayA[0].length != 10) ||
                (payDayA[1].length != 2 && payDayA[1].length != 10) ||
                (payDayA[2].length != 2 && payDayA[2].length != 10)
            ) {
                common_text_entry({'innerText' : {'eventEditMsg' : '*支払い日を正しい日付で入力ミスしてください。'}});
            } else {
                var result = window.confirm('イベントを更新してよろしいですか？');
                if (result) {
                    opDB('updateEvent', paramDB);
                }
            }
            break;
    }
}


// ──────────────────────────────────────────────────────
//  打刻情報の修正
// ………………………………………………………………………………………………………………………………………………
function stampInfoEdit() {
    common_text_entry({'innerText' : {'stampInfoEditMsg' : ''}});

    const inputEvent    = document.getElementById("stampInfoEvent").textContent;
    const inputStaff    = document.getElementById("stampInfoStaff").textContent;
    const inputDay      = document.getElementById("stampInfoDay").textContent;

    if (!inputEvent || !inputStaff || !inputDay) {
        common_text_entry({'innerText' : {'stampInfoEditMsg' : '訂正したいスタッフと日付を選択してください。'}});
    } else {
        const inputReason = document.getElementById("editStampInfoReason").value;
        const input = {
            'start'     : document.getElementById("startEdit").value,
            'break1s'   : document.getElementById("break1sEdit").value,
            'break1e'   : document.getElementById("break1eEdit").value,
            'break2s'   : document.getElementById("break2sEdit").value,
            'break2e'   : document.getElementById("break2eEdit").value,
            'break3s'   : document.getElementById("break3sEdit").value,
            'break3e'   : document.getElementById("break3eEdit").value,
            'end'       : document.getElementById("endEdit").value,
        }

        if (!inputReason) {
            common_text_entry({'innerText' : {'stampInfoEditMsg' : '申請理由に入力が必要です。'}});
        } else {
            const item = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];

            const result = window.confirm('打刻時間を訂正してよろしいですか？');
            if (result) {
                let msg = '';

                let count = 0;
                for(let i = 0; i < item.length; i++) {
                    let dataBefore = '';
                    let dataAfter = '';

                    if (input[item[i]] && input[item[i]] != '-') {
                        dataBefore  = document.getElementById(item[i] + 'Stamp').textContent;
                        dataAfter   = input[item[i]];

                        var paramDB = {
                            'requestDt'  : common_date().yyyymmddhhmmss,
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
                    } else {
                        count++;
                        if (count == item.length) {
                            msg = '訂正する項目が1つも入力されていません。';
                        }
                    }
                }

                common_text_entry({'innerText' : {'stampInfoEditMsg' : msg}});
            }
        }
    }
}


// ──────────────────────────────────────────────────────
//  勤怠修正情報の修正
// ………………………………………………………………………………………………………………………………………………
function workReportInfoEdit(id) {
    const selectEvent   = document.getElementById("eventName").textContent;
    const selectStatusB = document.querySelectorAll('.selectStatusB');

    common_op_view({
        'block' : ['updateWorkReportInfo', 'cancelWorkReportInfo'],
        'none'  : ['approveWorkReportInfo','rejectWorkReportInfo', 'newTabWorkReportInfoEdit'],
    });

    let updateList = [];
    selectStatusB.forEach(function(e) {
        e.onclick = function() {
            const statusBefore = e.innerText;
            let statusAfter = '';
            let valueAfter = '';

            if (!statusBefore.includes('済')) {
                var valArray = e.value.split(/\|/);

                // 更新ステータス
                switch (statusBefore) {
                    case '申請中':
                    case '承認':
                    case '却下':
                        statusAfter = id == 'approveWorkReportInfo' ? '承認済' : '却下済';
                        break;

                    case '訂正中':
                    case '訂正':
                    case '取消':
                        statusAfter = id == 'approveWorkReportInfo' ? '訂正済' : '取消済';
                        break;
                }

                // 一時表示
                switch (statusBefore) {
                    case '申請中':
                        e.innerText = id == 'approveWorkReportInfo' ? '承認' : '却下';
                        break;

                    case '訂正中':
                        e.innerText = id == 'approveWorkReportInfo' ? '訂正' : '取消';
                        break;

                    case '承認':
                    case '却下':
                        e.innerText = '申請中';
                        break;

                    case '訂正':
                    case '取消':
                        e.innerText = '訂正中';
                        break;
                }

                // 配列値の設定
                switch (statusBefore) {
                    case '申請中':
                        valueAfter = statusAfter == '却下済' ? '|' + valArray[4] : '|' + valArray[5];
                        break;

                    case '訂正中':
                        valueAfter = statusAfter == '取消済' ? '' : '|' + valArray[5];
                        break;

                    case '承認':
                    case '訂正':
                        valueAfter = '|' + valArray[5];
                        break;

                    case '却下':
                        valueAfter = '|' + valArray[4];
                        break;

                    case '取消':
                        valueAfter = '';
                        break;
                } 
                var addVal =
                    statusAfter 
                    + '|' + valArray[0] 
                    + '|' + valArray[1]
                    + '|' + valArray[2]
                    + '|' + valArray[3]
                    + valueAfter
                ;

                // 配列の追加・削除
                if (statusBefore == '申請中' || statusBefore == '訂正中') {
                    updateList.push(addVal);
                } else {
                    var found = updateList.indexOf(addVal)
                    updateList.splice(found, 1);
                }

                // 更新
                document.getElementById('updateWorkReportInfo').onclick = function() {
                    if (updateList.length) {

                        const result = window.confirm('勤怠修正のステータス変更をしてよろしいですか？');
                        if (result) {
                            var paramDB = {
                                'event'         : selectEvent,
                                'updateList'    : updateList
                            };
                            opDB('updateWorkReport', paramDB);
                        }
                    }
                }
            }
        }
    });

    // 取消
    document.getElementById('cancelWorkReportInfo').onclick = function() {
        updateList = [];

        getSelectEvent(selectEvent);
    }
}


// ──────────────────────────────────────────────────────
//  スタッフリストの修正
// ………………………………………………………………………………………………………………………………………………
function payslipEdit(id) {
    const selectEvent   = document.getElementById("eventName").textContent;
    const payslipTable  = document.getElementById("payslipTable");

    switch (id) {
        case 'editPayslip':
            common_op_view({
                'block' : ['cancelPayslip', 'updatePayslip'],
                'none'  : ['editPayslip']
            });

            Array.from(payslipTable.querySelectorAll("p")).forEach(function(e) {
                e.style.display = 'none';
            });
            Array.from(payslipTable.querySelectorAll("a")).forEach(function(e) {
                e.style.display = 'none';
            });
            Array.from(payslipTable.querySelectorAll("input")).forEach(function(e) {
                e.style.display = 'block';
            });
            Array.from(payslipTable.querySelectorAll("textarea")).forEach(function(e) {
                e.style.display = 'block';
            });
            break;

        case 'cancelPayslip':
            getSelectEvent(selectEvent);
            break;

        case 'updatePayslip':
            let payslipList = [];
            Array.from(payslipTable.querySelectorAll("tr")).forEach(function(e) {
                if (!e.id) {
                    var name        = e.querySelectorAll("td")[0].textContent.split(/\./)[1];
                    var workRules   = e.querySelectorAll("td")[3].querySelector("input").checked ? 'レ' : '';
                    var experience  = e.querySelectorAll("td")[4].querySelector("input").value;
                    var attendance  = e.querySelectorAll("td")[5].querySelector("input").value;
                    var payslipUrl  = e.querySelectorAll("td")[11].querySelector("textarea").value;
                    var tShirt      = e.querySelectorAll("td")[12].querySelector("input").checked ? 'レ' : '';

                    payslipList.push(
                        name
                        + '|' + workRules
                        + '|' + experience
                        + '|' + attendance
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


// ──────────────────────────────────────────────────────
//  お知らせ
// ………………………………………………………………………………………………………………………………………………
function news(id) {
    const disp      = document.getElementById('dispNews');
    const dispValue = disp.value;
    const none      = document.getElementById('noneNews');
    const noneValue = none.value;

    let inputTitle  = '';
    let inputBody   = document.getElementById("inputBody").value.replaceAll("\n", "<br>");
    let inputLink   = document.getElementById("inputLink").value;
    let status      = document.getElementsByName('inputStatus');
    let inputStatus = '';
    for (let i = 0; i < status.length; i++){
        if (status.item(i).checked){
            inputStatus = status.item(i).value;
        }
    }

    switch (id) {
        case 'dispNews':
            if (dispValue != 'true') {
                common_set_element({
                    'element'       : disp,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#000',
                });

                if (noneValue == 'true') {
                    common_set_element({
                        'element'       : none,
                        'value'         : 'false',
                        'color'         : '#000',
                        'background'    : '#fff',
                    });
                }

                // お知らせの取得
                var paramDB = { 'status': '公開' };
                opDB('getNewsList', paramDB);
            }
            break;

        case 'noneNews':
            if (noneValue != 'true') {
                common_set_element({
                    'element'       : none,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#000',
                });

                if (dispValue == 'true') {
                    common_set_element({
                        'element'       : disp,
                        'value'         : 'false',
                        'color'         : '#000',
                        'background'    : '#fff',
                    });
                }

                // お知らせの取得
                var paramDB = { 'status': '非公開' };
                opDB('getNewsList', paramDB);
            }
            break;

        case 'registerNews':
            common_text_entry({'innerText' : {'newsMsg' : ''}});

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
                common_text_entry({'innerText' : {'newsMsg' : '*タイトルの入力は必須です。'}});
            }
            break;

        case 'updateNews':
            common_text_entry({'innerText' : {'newsMsg' : ''}});

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
            common_text_entry({'innerText' : {'newsMsg' : ''}});

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
        common_op_view({
            'block' : ['newsTitle', 'deleteNews', 'updateNews'],
            'none'  : ['inputTitle','registerNews'],
        });
        common_text_entry({
            'innerText' : {
                'newsTitle' : document.getElementById(id).innerText
            },
            'value' : {
                'inputBody' : document.getElementById(id.replace("title", "body")).innerText,
                'inputLink' : document.getElementById(id.replace("title", "link")).innerText,
            }
        });

        if (dispValue == 'true') {
            document.getElementsByName('inputStatus').item(0).checked = true;
        } else if (noneValue == 'true') {
            document.getElementsByName('inputStatus').item(1).checked = true;
        }
    }
}


// ──────────────────────────────────────────────────────
//  スタッフ削除
// ………………………………………………………………………………………………………………………………………………
function sendDeleteStaff() {
    common_text_entry({'innerText' : {'deleteStaffMsg' : ''}});

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


// ──────────────────────────────────────────────────────
//  スタッフ追加
// ………………………………………………………………………………………………………………………………………………
function sendAddStaff() {
    common_text_entry({'innerText' : {'addStaffMsg' : ''}});

    const name = document.getElementById("addStaffName").value;
    const mail = document.getElementById("addStaffMail").value;
    const birthday = document.getElementById("addStaffBirthday").value;

    if (!name || !mail || !birthday) {
        common_text_entry({'innerText' : {'addStaffMsg' : 'すべての項目に入力が必要です。'}});
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
                    common_text_entry({'innerText' : {'adminMsg' : msg}});
                }
            }
            break;

        case 'getEvent':
            var param   = "function=" + "get_event"
                + "&event=" + encodeURIComponent(paramDB['event']) 
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'recruit'               : '',
                        'eventName'             : '',
                        'firstDay'              : '',
                        'endDay'                : '',
                        'time'                  : '',
                        'place'                 : '',
                        'hourlyWage'            : '',
                        'transportationLimit'   : '',
                        'manager'               : '',
                        'aShiftUrl'             : '',
                        'payDay'                : '',
                        'memo'                  : '',
                    },
                    'href' : {
                        'aShiftUrl' : '',
                    }
                });
                common_clear_children({
                    'all'   : {
                        'workReportInfoHeader'  : 'th',
                        'selectStampInfoDay'    : 'option',
                        'dayReportSelect'       : 'option',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    // イベント情報
                    common_text_entry({
                        'innerText' : {
                            'recruit'               : data.recruit,
                            'eventName'             : data.event,
                            'firstDay'              : data.first_day,
                            'endDay'                : data.end_day,
                            'time'                  : data.start_time + ' ～ ' + data.end_time,
                            'place'                 : data.place,
                            'hourlyWage'            : data.hourly_wage,
                            'transportationLimit'   : data.transportation_limit,
                            'manager'               : data.manager,
                            'aShiftUrl'             : (data.shift_url ? data.shift_url : ''),
                            'memo'                  : data.memo,
                        },
                        'href' : {
                            'aShiftUrl' : (data.shift_url ? data.shift_url : ''),
                        },
                        'innerHTML' : {
                            'payDay' : (data.pay_day ? data.pay_day.replaceAll(",", "<br>") : ''),
                        }
                    });

                    // 勤怠情報・打刻情報
                    var th = document.createElement("th");
                    common_set_element({
                        'element'       : th,
                        'className'     : 'sticky3',
                        'innerText'     : 'スタッフ名',
                    });
                    document.getElementById("workReportInfoHeader").appendChild(th);

                    const dayOfTime = common_clac(data.first_day, data.start_time, data.end_time, 'diff');
                    let eventDay    = 0;
                    let eventTime   = '0:00';

                    const firstDay = data.first_day.split(/-/);
                    const endDay = data.end_day.split(/-/);
                    for (
                        let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                        date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                        date.setDate(date.getDate() + 1)
                    ){
                        eventDay++;
                        eventTime = common_clac(data.first_day, dayOfTime, eventTime, 'sum');

                        var th = document.createElement("th");
                        common_set_element({
                            'element'       : th,
                            'className'     : 'sticky1',
                            'colSpan'       : '2',
                        });

                        // 日付
                        var day = document.createElement("p");
                        common_set_element({
                            'element'       : day,
                            'innerText'     : date.toLocaleDateString('sv-SE'),
                        });
                        th.appendChild(day);

                        // 項目
                        var div = document.createElement("div");
                        var item1 = document.createElement("p");
                        common_set_element({
                            'element'       : item1,
                            'className'     : 'borderRight borderBottom',
                            'innerText'     : '出勤',
                        });
                        var item2 = document.createElement("p");
                        common_set_element({
                            'element'       : item2,
                            'className'     : 'borderLeft borderBottom',
                            'innerText'     : '退勤',
                        });
                        var item3 = document.createElement("p");
                        common_set_element({
                            'element'       : item3,
                            'className'     : 'borderTop borderRight',
                            'innerText'     : '休憩',
                        });
                        var item4 = document.createElement("p");
                        common_set_element({
                            'element'       : item4,
                            'className'     : 'borderTop borderLeft',
                            'innerText'     : '実働',
                        });
                        div.appendChild(item1);
                        div.appendChild(item2);
                        div.appendChild(item3);
                        div.appendChild(item4);
                        th.appendChild(div);
                        document.getElementById("workReportInfoHeader").appendChild(th);

                        // 打刻修正選択
                        var option = document.createElement("option");
                        common_set_element({
                            'element'   : option,
                            'text'      : date.toLocaleDateString('sv-SE'),
                            'value'     : date.toLocaleDateString('sv-SE'),
                        });
                        document.getElementById("selectStampInfoDay").appendChild(option);

                        // 日報
                        var option2 = document.createElement("option");
                        common_set_element({
                            'element'   : option2,
                            'text'      : date.toLocaleDateString('sv-SE'),
                            'value'     : date.toLocaleDateString('sv-SE'),
                        });
                        document.getElementById("dayReportSelect").appendChild(option2);
                    }


                    // スタッフリストの出勤率
                    eventTime = common_convert_time(eventTime);
                    common_text_entry({'innerHTML' : {
                        'attendanceRate' : '出勤率<br>(全' + eventDay + '日・' + eventTime + 'h)'
                    }});


                    // スタッフリストの取得
                    var nextParamDB = {
                        'event'     : paramDB['event'],
                        'eventTime' : eventTime
                    };
                    opDB('getStaffList', nextParamDB);


                    // 日報の取得
                    let yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    common_text_entry({
                        'value' : {'dayReportSelect' : yesterday.toISOString().split("T")[0]}
                    });
                    var nextParamDB2 = {
                        'event' : paramDB['event'],
                        'day'   : yesterday.toISOString().split("T")[0]
                    };
                    opDB('getDayReport', nextParamDB2);
                }
            }
            break;

        case 'getEventList':
            var param   = "function=" + "get_event_list";
            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_clear_children({
                    'all'   : {
                        'selectEvent' : 'option',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    var option = document.createElement("option"); 
                    common_set_element({
                        'element'   : option,
                        'text'      : '（新規登録）',
                        'value'     : '',
                    });
                    document.getElementById("selectEvent").appendChild(option);

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        common_set_element({
                            'element'   : option,
                            'text'      : data[key],
                            'value'     : data[key],
                        });
                        document.getElementById("selectEvent").appendChild(option);
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
                        common_op_view({
                            'flex'  : ['eventInfoNoticeArea']
                        });

                        for (let event in data) {
                            var dt = document.createElement("dt");
                            common_set_element({
                                'element'   : dt,
                                'innerText' : event,
                            });
                            var dd = document.createElement("dd");

                            // 募集状況
                            if ('recruit' in data[event]) {
                                var div1 = document.createElement("div");

                                var title1 = document.createElement("din");
                                common_set_element({
                                    'element'   : title1,
                                    'className' : 'noticeTitle',
                                });
                                var title1P = document.createElement("p");
                                common_set_element({
                                    'element'   : title1P,
                                    'innerText' : '募集',
                                });
                                title1.appendChild(title1P);

                                var item1 = document.createElement("p");
                                common_set_element({
                                    'element'   : item1,
                                    'className' : 'noticeItem',
                                    'innerHTML' : data[event].recruit,
                                });

                                div1.appendChild(title1);
                                div1.appendChild(item1);
                                dd.appendChild(div1);
                            }

                            // 応募リスト
                            if ('al_status' in data[event]) {
                                var div2 = document.createElement("div");

                                var title2 = document.createElement("div");
                                common_set_element({
                                    'element'   : title2,
                                    'className' : 'noticeTitle',
                                });
                                var title2P = document.createElement("p");
                                common_set_element({
                                    'element'   : title2P,
                                    'innerText' : '応募',
                                });
                                title2.appendChild(title2P);

                                var item2 = document.createElement("div");
                                common_set_element({
                                    'element'   : item2,
                                    'className' : 'noticeItem',
                                });

                                for (let name in data[event].al_status) {
                                    var nameP = document.createElement("p");
                                    common_set_element({
                                        'element'   : nameP,
                                        'className' : 'noticeTitleA',
                                        'innerText' : name,
                                    });

                                    var nameS = document.createElement("span");
                                    common_set_element({
                                        'element'       : nameS,
                                        'innerText'     : data[event].al_status[name],
                                        'background'    : common_applicationStatus_color(data[event].al_status[name]),
                                    });
                                    nameP.appendChild(nameS);
                                    item2.appendChild(nameP);
                                }
                                div2.appendChild(title2);
                                div2.appendChild(item2);
                                dd.appendChild(div2);
                            }


                            // シフト変更希望リスト
                            if ('sl_change' in data[event]) {
                                var div3 = document.createElement("div");

                                var title3 = document.createElement("div");
                                common_set_element({
                                    'element'       : title3,
                                    'className'     : 'noticeTitle',
                                });
                                var title3P = document.createElement("p");
                                common_set_element({
                                    'element'       : title3P,
                                    'innerText'     : '出勤変更',
                                });
                                title3.appendChild(title3P);

                                var item3 = document.createElement("p");
                                common_set_element({
                                    'element'       : item3,
                                    'className'     : 'noticeItem',
                                    'innerText'     : '未承認： ' + data[event].sl_change + ' 件',
                                });

                                div3.appendChild(title3);
                                div3.appendChild(item3);
                                dd.appendChild(div3);
                            }


                            // 勤怠修正情報
                            if ('wr_request' in data[event]) {
                                var div4 = document.createElement("div");

                                var title4 = document.createElement("div");
                                common_set_element({
                                    'element'       : title4,
                                    'className'     : 'noticeTitle',
                                });
                                var title4P = document.createElement("p");
                                common_set_element({
                                    'element'       : title4P,
                                    'innerText'     : '打刻修正',
                                });
                                title4.appendChild(title4P);

                                var item4 = document.createElement("p");
                                common_set_element({
                                    'element'       : item4,
                                    'className'     : 'noticeItem',
                                    'innerText'     : '未承認： ' + data[event].wr_request + ' 件',
                                });

                                div4.appendChild(title4);
                                div4.appendChild(item4);
                                dd.appendChild(div4);
                            }


                            // 支払日
                            if ('pay_day' in data[event]) {
                                var div5 = document.createElement("div");

                                var title5 = document.createElement("din");
                                common_set_element({
                                    'element'       : title5,
                                    'className'     : 'noticeTitle',
                                });
                                var title5P = document.createElement("p");
                                common_set_element({
                                    'element'       : title5P,
                                    'innerText'     : '支払日',
                                });
                                title5.appendChild(title5P);

                                let payDayList = '';
                                for (let pD in data[event].pay_day) {
                                    payDayList = payDayList
                                        ? payDayList + '<br>' + data[event].pay_day[pD] 
                                        : data[event].pay_day[pD]
                                    ;
                                }

                                var item5 = document.createElement("p");
                                common_set_element({
                                    'element'       : item5,
                                    'className'     : 'noticeItem',
                                    'innerHTML'     : payDayList,
                                });


                                div5.appendChild(title5);
                                div5.appendChild(item5);
                                dd.appendChild(div5);
                            }

                            document.getElementById("eventInfoNoticeArea").querySelector('dl').appendChild(dt);
                            document.getElementById("eventInfoNoticeArea").querySelector('dl').appendChild(dd);
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
                + "&place="                 + encodeURIComponent(paramDB.place)
                + "&hourlyWage="            + encodeURIComponent(paramDB.hourlyWage)
                + "&transportationLimit="   + encodeURIComponent(paramDB.transportationLimit)
                + "&manager="               + encodeURIComponent(paramDB.manager)
                + "&shiftUrl="              + encodeURIComponent(paramDB.shiftUrl)
                + "&payDay="                + encodeURIComponent(paramDB.payDay)
                + "&memo="                  + encodeURIComponent(paramDB.memo)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        opDB('getEventList', null);
                        getSelectEvent(paramDB.eventName);
                    } else {
                        common_text_entry({'innerText' : {'eventEditMsg' : '*イベントの登録に失敗しました。'}});
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
                + "&place="                 + encodeURIComponent(paramDB.place)
                + "&hourlyWage="            + encodeURIComponent(paramDB.hourlyWage)
                + "&transportationLimit="   + encodeURIComponent(paramDB.transportationLimit)
                + "&manager="               + encodeURIComponent(paramDB.manager)
                + "&shiftUrl="              + encodeURIComponent(paramDB.shiftUrl)
                + "&payDay="                + encodeURIComponent(paramDB.payDay)
                + "&memo="                  + encodeURIComponent(paramDB.memo)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getSelectEvent(paramDB.eventName);
                    } else {
                        common_text_entry({'innerText' : {'eventEditMsg' : '*イベントの更新に失敗しました。'}});
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
                        common_text_entry({'innerText' : {'eventEditMsg' : '*イベントの削除に失敗しました。'}});
                    }
                }
            }
            break;

        case 'getStaffList':
            var param = "function=" + "get_staff_list_admin"
                + "&event=" + encodeURIComponent(paramDB['event'])
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_clear_children({
                    'all'   : {
                        'selectStampInfoStaff'      : 'option',
                        'deleteStaffName'           : 'option',
                        'workReportInfoEditArea'    : 'td'
                    },
                    'notId' : {
                        'workReportInfoTable'   : 'tr',
                        'payslipTable'          : 'tr',
                    }
                });

                var InitialV = document.createElement("option"); 
                common_set_element({
                    'element'   : InitialV,
                    'text'      : '',
                    'value'     : '',
                    'hidden'    : true,
                });
                document.getElementById("deleteStaffName").appendChild(InitialV);


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        const orderList = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];
                        let nameKeyNum  = [];
                        let dayNum      = [];
                        let itemNum     = [];
                        let i           = 0;

                        Object.keys(data).forEach(function(name) {
                            var sl  = data[name]['staff_list'];
                            var wr  = data[name]['work_report'];
                            var wre = data[name]['work_report_edit'];

                            // スタッフNo.
                            var no = sl['no'];

                            // 出勤数
                            var workNum = [];

                            // シフト
                            var notWork = 0;
                            var shift = [];
                            if (sl.shift) {
                                (sl.shift.split(/,/)).forEach(function(d) {
                                    var dA = d.split(/_/);
                                    var shiftTime =  dA[1] + '_' + dA[2]

                                    if (shiftTime != '×_×') {
                                        shift[dA[0]] = shiftTime;
                                        notWork++;
                                    }
                                });
                            }

                            // 打刻情報表示
                            var stamp_option = document.createElement("option");
                            common_set_element({
                                'element'   : stamp_option,
                                'text'      : no + '.' + name,
                                'value'     : name,
                            });
                            document.getElementById("selectStampInfoStaff").appendChild(stamp_option);

                            // スタッフ削除
                            var deleteStaff_option = document.createElement("option");
                            common_set_element({
                                'element'   : deleteStaff_option,
                                'text'      : no + '.' + name,
                                'value'     : name,
                            });
                            document.getElementById("deleteStaffName").appendChild(deleteStaff_option);


                            // 勤怠情報
                            if (Object.keys(wr).length != 0) {
                                var totalDay    = 0;
                                var totalTime   = '0:00';
                                var note        = '';

                                var wr_tr  = document.createElement("tr");
                                var wr_tr2 = document.createElement("tr");
                                document.getElementById("workReportInfoTable").querySelector("tbody").appendChild(wr_tr);
                                document.getElementById("workReportInfoTable").querySelector("tbody").appendChild(wr_tr2);

                                // 名前
                                var wr_name = document.createElement("td");
                                common_set_element({
                                    'element'   : wr_name,
                                    'className' : 'sticky2',
                                    'innerText' : no + '.' + name,
                                    'rowSpan'   : '2',
                                });
                                wr_tr.appendChild(wr_name);

                                Array.from(document.getElementById("workReportInfoHeader").querySelectorAll("th")).forEach(function(e) {
                                    var day = e.querySelector("p") ? e.querySelector("p").textContent : '';

                                    if (common_validation_day(day)) {
                                        var start = document.createElement("td");
                                        common_set_element({
                                            'element'   : start,
                                            'className' : 'borderRight borderBottom',
                                        });
                                        var end = document.createElement("td");
                                        common_set_element({
                                            'element'   : end,
                                            'className' : 'borderLeft borderBottom',
                                        });
                                        var breaTime = document.createElement("td");
                                        common_set_element({
                                            'element'   : breaTime,
                                            'className' : 'borderTop borderRight',
                                        });
                                        var workTime = document.createElement("td");
                                        common_set_element({
                                            'element'   : workTime,
                                            'className' : 'borderTop borderLeft',
                                        });


                                        if (day in wr) {
                                            var wrDay   = wr[day];
                                            var dataS   = '';
                                            var dataE   = '';
                                            var dataB   = '';
                                            var dataW   = '';
                                            var sumTime = '';

                                            // 出勤
                                            if (wrDay.start && wrDay.start != '-') {
                                                dataS = wrDay.start;

                                                if (!dataS.startsWith('＊')) {
                                                    // 切り上げ
                                                    dataS = common_ceil(dataS);
                                                }
                                            }

                                            // 退勤
                                            if (wrDay.end && wrDay.end != '-') {
                                                dataE = wrDay.end;

                                                if (!dataE.startsWith('＊')) {
                                                    // 切り捨て
                                                    dataE = common_floor(dataS, dataE);
                                                }
                                            }

                                            // 時間計算
                                            var reportTime = common_report_time(
                                                day,
                                                dataS,
                                                common_validation_time(wrDay.break1s) ? common_ceil(wrDay.break1s) : '',
                                                common_validation_time(wrDay.break1e) ? common_ceil(wrDay.break1e) : '',
                                                common_validation_time(wrDay.break2s) ? common_ceil(wrDay.break2s) : '',
                                                common_validation_time(wrDay.break2e) ? common_ceil(wrDay.break2e) : '',
                                                common_validation_time(wrDay.break3s) ? common_ceil(wrDay.break3s) : '',
                                                common_validation_time(wrDay.break3e) ? common_ceil(wrDay.break3e) : '',
                                                dataE
                                            );

                                            // 拘束・休憩・実働
                                            var dataB   = reportTime.breakTime;
                                            var dataW   = reportTime.workTime;
                                            var sumTime = reportTime.sumTime;


                                            // 値の設定
                                            start.innerText     = dataS;
                                            end.innerText       = dataE;
                                            breaTime.innerText  = dataB;
                                            workTime.innerText  = dataW;
                                        }

                                        wr_tr.appendChild(start);
                                        wr_tr.appendChild(end);
                                        wr_tr2.appendChild(breaTime);
                                        wr_tr2.appendChild(workTime);

                                        // 各値の設定
                                        if (dataS) {
                                            // 勤務総日数
                                            totalDay++;

                                            // 拘束総時間
                                            totalTime = common_validation_hhmm(sumTime) ? common_clac(day, sumTime, totalTime, 'sum') : totalTime;
                                            if (dataW.startsWith('＊')) {
                                                note = '＊';
                                            }
                                        }
                                        if (day in shift) {
                                            // 前日までの欠勤日数
                                            notWork = (day >= common_date().yyyymmdd)
                                                ? notWork - 1
                                                : dataS ? notWork - 1 : notWork
                                            ;
                                        }
                                    }
                                });

                                // 出勤率の設定
                                workNum = {
                                    'totalDay'  : totalDay,
                                    'totalTime' : note + totalTime,
                                    'notWork'   : notWork,
                                } 
                            }


                            // 勤怠修正情報
                            if (Object.keys(wre).length != 0) {
                                i++;
                                nameKeyNum[no] = 0;

                                var wre_name = document.createElement("td");

                                Object.keys(wre).forEach(function(day) {
                                    // 日付データ
                                    dayNum[day] = 0;
                                    var wreDay  = wre[day];
                                    var wre_day = document.createElement("td");

                                    Object.keys(orderList).forEach(function(orderName) {
                                        // 項目名
                                        var itemKey = orderList[orderName];

                                        // 項目データ
                                        var wreDayItem = wreDay[itemKey];
                                        if (wreDayItem) {
                                            itemNum[itemKey] = 0;
                                            var wre_item     = document.createElement("td");

                                            Object.keys(wreDayItem).forEach(function(request) {
                                                // 申請日データ
                                                nameKeyNum[no]          = nameKeyNum[no] + 1;
                                                dayNum[day]             = dayNum[day] + 1;
                                                itemNum[itemKey]        = itemNum[itemKey] + 1;
                                                var wreDayItemRequest   = wreDayItem[request];
                                                var wre_tr              = document.createElement("tr");

                                                // スタッフ名
                                                if (nameKeyNum[no] == 1) {
                                                    common_set_element({
                                                        'element'       : wre_name,
                                                        'className'     : 'sticky1',
                                                        'innerText'     : no + '.' + name,
                                                        'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                        'rowSpan'       : nameKeyNum[no],
                                                    });
                                                    wre_tr.appendChild(wre_name);
                                                } else {
                                                    common_set_element({
                                                        'element'       : wre_name,
                                                        'className'     : 'sticky1 valueTop',
                                                        'rowSpan'       : nameKeyNum[no],
                                                    });
                                                }

                                                // 対象日
                                                if (dayNum[day] == 1) {
                                                    common_set_element({
                                                        'element'       : wre_day,
                                                        'className'     : 'sticky2',
                                                        'innerText'     : day,
                                                        'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                        'rowSpan'       : dayNum[day],
                                                    });
                                                    wre_tr.appendChild(wre_day);
                                                } else {
                                                    common_set_element({
                                                        'element'       : wre_day,
                                                        'className'     : 'sticky2 valueTop',
                                                        'rowSpan'       : dayNum[day],
                                                    });
                                                }

                                                // 項目
                                                if (itemNum[itemKey] == 1) {
                                                    common_set_element({
                                                        'element'       : wre_item,
                                                        'className'     : 'sticky3',
                                                        'innerText'     : common_itemName(itemKey),
                                                        'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                        'rowSpan'       : itemNum[itemKey],
                                                    });
                                                    wre_tr.appendChild(wre_item);
                                                } else {
                                                    common_set_element({
                                                        'element'       : wre_item,
                                                        'className'     : 'sticky3 valueTop',
                                                        'rowSpan'       : itemNum[itemKey],
                                                    });
                                                }

                                                // 状態
                                                var wre_status = document.createElement("td");
                                                common_set_element({
                                                    'element'       : wre_status,
                                                    'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                });
                                                var wre_statusB = document.createElement("button");
                                                common_set_element({
                                                    'element'       : wre_statusB,
                                                    'className'     : 'statusB selectStatusB',
                                                    'innerText'     : wreDayItemRequest.status,
                                                    'value'         : (
                                                        wreDayItemRequest.request_dt
                                                        + '|' + name
                                                        + '|' + day
                                                        + '|' + itemKey
                                                        + '|' + wreDayItemRequest.data_before
                                                        + '|' + wreDayItemRequest.data_after
                                                    ),
                                                    'background'    : common_workReportEditStatus_color(wreDayItemRequest.status),
                                                });
                                                wre_status.appendChild(wre_statusB);
                                                wre_tr.appendChild(wre_status);

                                                // 修正前
                                                var wre_data_before = document.createElement("td");
                                                common_set_element({
                                                    'element'       : wre_data_before,
                                                    'innerText'     : wreDayItemRequest.data_before,
                                                    'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                });
                                                wre_tr.appendChild(wre_data_before);

                                                // 修正後
                                                var wre_data_after = document.createElement("td");
                                                common_set_element({
                                                    'element'       : wre_data_after,
                                                    'innerText'     : wreDayItemRequest.data_after,
                                                    'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                });
                                                wre_tr.appendChild(wre_data_after);

                                                // 理由
                                                var wre_reason = document.createElement("td");
                                                common_set_element({
                                                    'element'       : wre_reason,
                                                    'className'     : 'w25 textLeft',
                                                    'innerText'     : wreDayItemRequest.reason,
                                                    'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                });
                                                wre_tr.appendChild(wre_reason);

                                                // 申請日
                                                var wre_request_dt = document.createElement("td");
                                                common_set_element({
                                                    'element'       : wre_request_dt,
                                                    'className'     : 'w25',
                                                    'innerText'     : wreDayItemRequest.request_dt,
                                                    'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                });
                                                wre_tr.appendChild(wre_request_dt);

                                                // 処理日
                                                var wre_approval_d = document.createElement("td");
                                                common_set_element({
                                                    'element'       : wre_approval_d,
                                                    'innerText'     : wreDayItemRequest.approval_d,
                                                    'background'    : (i % 2 == 0 ? '#f5f5f5ff' : '#fff'),
                                                });
                                                wre_tr.appendChild(wre_approval_d);

                                                document.getElementById("workReportInfoEditArea").querySelector("tbody").appendChild(wre_tr);
                                            });
                                        }
                                    });
                                });
                            }


                            // スタッフリスト
                            if (sl.length != 0) {
                                var sl_tr = document.createElement("tr");

                                // 氏名
                                var sl_staffName = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_staffName,
                                    'className' : 'w20 sticky3 textLeft',
                                });
                                var sl_staffNameB = document.createElement("button");
                                common_set_element({
                                    'element'   : sl_staffNameB,
                                    'className' : 'staffNameB',
                                    'innerText' : no + '.' + name,
                                    'value'     : name,
                                });
                                sl_staffName.appendChild(sl_staffNameB);
                                sl_tr.appendChild(sl_staffName);


                                // メール
                                var sl_mail = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_mail,
                                    'className' : 'w30 textLeft',
                                    'innerText' : sl.mail,
                                });
                                sl_tr.appendChild(sl_mail);


                                // 生年月日
                                var sl_birthday = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_birthday,
                                    'className' : 'w15 borderRight',
                                    'innerText' : sl.birthday,
                                });
                                sl_tr.appendChild(sl_birthday);


                                // 就業規則
                                var sl_workRules = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_workRules,
                                    'className' : 'w10 borderRight borderLeftNone',
                                });
                                var sl_workRulesP = document.createElement("p");
                                common_set_element({
                                    'element'       : sl_workRulesP,
                                    'innerText'     : sl.work_rules,
                                    'fontWeight'    : 'bold',
                                });
                                var sl_workRulesI = document.createElement('input');
                                common_set_element({
                                    'element'   : sl_workRulesI,
                                    'type'      : "checkbox",
                                    'checked'   : (sl.work_rules == 'レ' ? true : false),
                                });
                                sl_workRules.appendChild(sl_workRulesP);
                                sl_workRules.appendChild(sl_workRulesI);
                                sl_tr.appendChild(sl_workRules);


                                // 経験者手当
                                var sl_experience = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_experience,
                                    'className' : 'w10 borderLeftNone',
                                });
                                var sl_experienceP = document.createElement("p");
                                common_set_element({
                                    'element'   : sl_experienceP,
                                    'innerText' : (sl.experience ? sl.experience + '円' : ''),
                                });
                                var sl_experienceI = document.createElement('input');
                                common_set_element({
                                    'element'   : sl_experienceI,
                                    'value'     : sl.experience,
                                    'type'      : "text",
                                });
                                sl_experience.appendChild(sl_experienceP);
                                sl_experience.appendChild(sl_experienceI);
                                sl_tr.appendChild(sl_experience);


                                // 出勤手当
                                var sl_attendance = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_attendance,
                                    'className' : 'w10',
                                });
                                var sl_attendanceP = document.createElement("p");
                                common_set_element({
                                    'element'   : sl_attendanceP,
                                    'innerHTML' : (sl.attendance ? sl.attendance + '円' : ''),
                                });
                                var sl_attendanceI = document.createElement('input');
                                common_set_element({
                                    'element'   : sl_attendanceI,
                                    'value'     : sl.attendance,
                                    'type'      : "text",
                                });
                                sl_attendance.appendChild(sl_attendanceP);
                                sl_attendance.appendChild(sl_attendanceI);
                                sl_tr.appendChild(sl_attendance);


                                // 出勤率
                                var workTime = ('totalTime' in workNum ? common_convert_time(workNum['totalTime']) : 0);
                                var sl_attendanceRate = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_attendanceRate,
                                    'className' : 'w30 textLeft borderRight',
                                    'innerHTML' :  (
                                        '出：' + common_clac_attendance(paramDB['eventTime'], workTime)
                                        + ' (' + ('totalDay' in workNum ? workNum['totalDay'] : 0) + '日'
                                        + '・' + workTime + 'h)'
                                        + '<br>欠：' + notWork + '日'
                                    ),
                                });
                                sl_tr.appendChild(sl_attendanceRate);


                                // 利用駅
                                var sl_station = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_station,
                                    'className' : 'w10 borderLeftNone',
                                    'innerText' : sl.station,
                                });
                                sl_tr.appendChild(sl_station);


                                // 交通費
                                var sl_transportation = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_transportation,
                                    'innerText' : (sl.transportation ? sl.transportation + '円' : ''),
                                });
                                sl_tr.appendChild(sl_transportation);


                                // 銀行口座
                                var bankA = sl.bank ? sl.bank.split(/_/) : '';
                                var sl_bank = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_bank,
                                    'className' : 'w30 textLeft borderRight',
                                    'innerHTML' : (sl.bank ? bankA[0] + ' ' + bankA [1] + '<br>' + bankA[2] + ' ' + bankA[3] : ''),
                                });
                                sl_tr.appendChild(sl_bank);


                                // 差引支給額
                                var netPay = ''; 
                                if (sl.net_pay) {
                                    sl.net_pay.split(/,/).forEach(function(val) {
                                        var netPayA = val.split(/_/);
                                        netPay = netPay + (netPayA[0] + '支払 : ' + Number(netPayA[2]).toLocaleString() + '円<br>');
                                    });
                                }
                                var sl_netPay = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_netPay,
                                    'className' : 'w30 borderLeftNone',
                                    'innerHTML' : netPay,
                                });
                                sl_tr.appendChild(sl_netPay);


                                // 給与明細URL
                                var sl_payslipUrl = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_payslipUrl,
                                    'className' : 'w30 textLeft borderRight nowrap',
                                });
                                if (sl.payslip) {
                                    sl.payslip.split(/\n/).forEach(function(val) {
                                        var sl_payslipUrlA = document.createElement("a");
                                        common_set_element({
                                            'element'   : sl_payslipUrlA,
                                            'innerText' : val,
                                            'href'      : val,
                                            'target'    : '_blank',
                                            'display'   : 'block',
                                        });
                                        sl_payslipUrl.appendChild(sl_payslipUrlA);
                                    });
                                }
                                var sl_payslipUrlT = document.createElement("textarea");
                                common_set_element({
                                    'element'   : sl_payslipUrlT,
                                    'innerHTML' : sl.payslip,
                                    'name'      : 'payslip',
                                });
                                sl_payslipUrl.appendChild(sl_payslipUrlT);
                                sl_tr.appendChild(sl_payslipUrl);


                                // Tシャツ
                                var sl_tShirt = document.createElement("td");
                                common_set_element({
                                    'element'   : sl_tShirt,
                                    'className' : 'w10 borderLeftNone',
                                });
                                var sl_tShirtP = document.createElement("p");
                                common_set_element({
                                    'element'       : sl_tShirtP,
                                    'innerText'     : sl.t_shirt,
                                    'fontWeight'    : 'bold',
                                });
                                var sl_tShirtI = document.createElement('input');
                                common_set_element({
                                    'element'   : sl_tShirtI,
                                    'type'      : "checkbox",
                                    'checked'   : (sl.t_shirt == 'レ' ? true : false),
                                });
                                sl_tShirt.appendChild(sl_tShirtP);
                                sl_tShirt.appendChild(sl_tShirtI);
                                sl_tr.appendChild(sl_tShirt);


                                document.getElementById("payslipTable").querySelector("tbody").appendChild(sl_tr);
                            }
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
                // 初期値
                common_text_entry({'innerText' : {'deleteStaffMsg' : ''}});


                if (this.readyState == 4 && this.status == 200) {
                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getSelectEvent(paramDB.event);
                    } else {
                        common_text_entry({'innerText' : {'deleteStaffMsg' : '*スタッフの削除に失敗しました。'}});
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
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'addStaffMsg' : ''
                    },
                    'value' : {
                        'addStaffName'      : '',
                        'addStaffMail'      : '',
                        'addStaffBirthday'  : 'yyyymmdd',
                    },
                });

                if (this.readyState == 4 && this.status == 200) {
                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getSelectEvent(paramDB.event);
                    } else {
                        if (this.response == 'false') {
                            common_text_entry({'innerText' : {'addStaffMsg' : '既に登録されているメールアドレスです。'}});
                        } else {
                            common_text_entry({'innerText' : {'addStaffMsg' : 'スタッフの追加ができませんでした。'}});
                        }
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
                        common_text_entry({'innerText' : {'payslipMsg' : '*スタッフリストが更新できませんでした。'}});
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
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'stampInfoEvent'    : paramDB['event'],
                        'stampInfoStaff'    : paramDB['name'],
                        'stampInfoDay'      : paramDB['day'],
                        'startShift'        : '',
                        'endShift'          : '',
                        'startStamp'        : '',
                        'break1sStamp'      : '',
                        'break1eStamp'      : '',
                        'break2sStamp'      : '',
                        'break2eStamp'      : '',
                        'break3sStamp'      : '',
                        'break3eStamp'      : '',
                        'endStamp'          : '',
                        'startWork'         : '',
                        'break1sWork'       : '',
                        'break1eWork'       : '',
                        'break2sWork'       : '',
                        'break2eWork'       : '',
                        'break3sWork'       : '',
                        'break3eWork'       : '',
                        'endWork'           : '',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    if (this.response) {
                        const data = JSON.parse(this.response);

                        // 勤怠
                        var startWork   = common_validation_time(data.start)    ? common_ceil(data.start)   : '';
                        var break1sWork = common_validation_time(data.break1s)  ? common_ceil(data.break1s) : '';
                        var break1eWork = common_validation_time(data.break1e)  ? common_ceil(data.break1e) : '';
                        var break2sWork = common_validation_time(data.break2s)  ? common_ceil(data.break2s) : '';
                        var break2eWork = common_validation_time(data.break2e)  ? common_ceil(data.break2e) : '';
                        var break3sWork = common_validation_time(data.break3s)  ? common_ceil(data.break3s) : '';
                        var break3eWork = common_validation_time(data.break3e)  ? common_ceil(data.break3e) : '';
                        var endWork     = common_validation_time(data.end)      ? common_floor(startWork, data.end) : '';

                        common_text_entry({
                            'innerText' : {
                                // シフト
                                'startShift'    : data.start_shift,
                                'endShift'      : data.end_shift,

                                // 打刻
                                'startStamp'    : data.start,
                                'break1sStamp'  : data.break1s,
                                'break1eStamp'  : data.break1e,
                                'break2sStamp'  : data.break2s,
                                'break2eStamp'  : data.break2e,
                                'break3sStamp'  : data.break3s,
                                'break3eStamp'  : data.break3e,
                                'endStamp'      : data.end,

                                // 勤怠
                                'startWork'     : startWork,
                                'break1sWork'   : break1sWork,
                                'break1eWork'   : break1eWork,
                                'break2sWork'   : break2sWork,
                                'break2eWork'   : break2eWork,
                                'break3sWork'   : break3sWork,
                                'break3eWork'   : break3eWork,
                                'endWork'       : endWork,
                            }
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
                    } else {
                        const msg =
                            document.getElementById("stampInfoEditMsg").textContent 
                            + '\n' 
                            + common_itemName(paramDB.item) 
                            + '=' + paramDB.dataAfter 
                            + ' は訂正登録できませんでした。'
                        ;
                        common_text_entry({'innerText' : {'stampInfoEditMsg' : msg}});
                    }
                }
            }
            break;

        case 'updateWorkReport':
            var param = "function=" + "update_work_report"
                + "&event="         + encodeURIComponent(paramDB.event)
                + "&updateList="    + encodeURIComponent(paramDB.updateList)
                + "&approvalD="     + encodeURIComponent(common_date().yyyymmdd)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        common_text_entry({
                            'innerText' : {
                                'startShift'        : '',
                                'endShift'          : '',
                                'stampInfoEvent'    : '',
                                'stampInfoStaff'    : '',
                                'stampInfoDay'      : '',
                                'startStamp'        : '',
                                'break1sStamp'      : '',
                                'break1eStamp'      : '',
                                'break2sStamp'      : '',
                                'break2eStamp'      : '',
                                'break3sStamp'      : '',
                                'break3eStamp'      : '',
                                'endStamp'          : '',
                                'startWork'         : '',
                                'break1sWork'       : '',
                                'break1eWork'       : '',
                                'break2sWork'       : '',
                                'break2eWork'       : '',
                                'break3sWork'       : '',
                                'break3eWork'       : '',
                                'endWork'           : '',
                            }
                        });

                        getSelectEvent(paramDB.event);
                    } else {
                        common_text_entry({'innerText' : {'workReportInfoEditMsg' : 'ステータス変更ができませんでした。'}});
                    }
                }
            }
            break;

        case 'getNewsList':
            var param   = "function=" + "get_news_list"
                + "&status=" + encodeURIComponent(paramDB['status'])
            ;
            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_clear_children({
                    'notId'   : {
                        'newsTable' : 'tr',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        let i = 0;
                        Object.keys(data).forEach(function(key) {
                            i++;

                            var tr = document.createElement("tr");

                            // 登録日 
                            var registerDt = document.createElement("td");
                            common_set_element({
                                'element'   : registerDt,
                                'id'        : 'news_' + i + '_registerDt',
                                'innerText' : data[key].register_dt,
                            });
                            tr.appendChild(registerDt);

                            // タイトル
                            var title = document.createElement("td");
                            common_set_element({
                                'element'   : title,
                                'className' : 'w50 textLeft',
                            });
                            var button = document.createElement("button");
                            common_set_element({
                                'element'   : button,
                                'id'        : 'news_' + i + '_title',
                                'innerText' : data[key].title,
                            });
                            title.appendChild(button);
                            tr.appendChild(title);

                            // 内容
                            var body = document.createElement("td");
                            common_set_element({
                                'element'   : body,
                                'id'        : 'news_' + i + '_body',
                                'className' : 'w70 textLeft',
                                'innerHTML' : data[key].body,
                            });
                            tr.appendChild(body);

                            // URL
                            var link = document.createElement("td");
                            common_set_element({
                                'element'   : link,
                                'className' : 'w50 textLeft',
                            });
                            var a = document.createElement("a");
                            common_set_element({
                                'element'   : a,
                                'id'        : 'news_' + i + '_link',
                                'innerText' : data[key].link,
                                'href'      : data[key].link,
                                'target'    : '_blank',
                            });
                            link.appendChild(a);
                            tr.appendChild(link);

                            document.getElementById("newsTable").querySelector("tbody").appendChild(tr);
                        });
                    }
                }
            }
            break;

        case 'registerNews':
            var param = "function=" + "register_news"
                + "&requestDt=" + encodeURIComponent(common_date().yyyymmddhhmmss)
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
                                common_set_element({
                                    'element'       : disp,
                                    'value'         : 'true',
                                    'color'         : '#fff',
                                    'background'    : '#000',
                                });
                                common_set_element({
                                    'element'       : none,
                                    'value'         : 'false',
                                    'color'         : '#000',
                                    'background'    : '#fff',
                                });
                                break;

                            case '非公開':
                                common_set_element({
                                    'element'       : none,
                                    'value'         : 'true',
                                    'color'         : '#fff',
                                    'background'    : '#000',
                                });
                                common_set_element({
                                    'element'       : disp,
                                    'value'         : 'false',
                                    'color'         : '#000',
                                    'background'    : '#fff',
                                });
                                break;
                        }
                        var nextParam = { 'status': inputStatus };
                        opDB('getNewsList', nextParam);


                        common_set_element({
                            'element'   : document.getElementsByName('inputStatus').item(0),
                            'checked'   : true,
                        });
                        common_text_entry({
                            'innerText' : {
                                'newsMsg'   : '',
                                'newsTitle' : '',
                            },
                            'value' : {
                                'inputTitle'    : '',
                                'inputBody'     : '',
                                'inputLink'     : '',
                            }
                        });
                        common_op_view({
                            'block'  : ['inputTitle', 'registerNews'],
                            'none'  : ['newsTitle', 'deleteNews', 'updateNews'],
                        });
                    } else {
                        common_text_entry({'innerText' : {'newsMsg' : 'お知らせの登録ができませんでした。'}});
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
                                common_set_element({
                                    'element'       : disp,
                                    'value'         : 'true',
                                    'color'         : '#fff',
                                    'background'    : '#000',
                                });
                                common_set_element({
                                    'element'       : none,
                                    'value'         : 'false',
                                    'color'         : '#000',
                                    'background'    : '#fff',
                                });
                                break;

                            case '非公開':
                                common_set_element({
                                    'element'       : none,
                                    'value'         : 'true',
                                    'color'         : '#fff',
                                    'background'    : '#000',
                                });
                                common_set_element({
                                    'element'       : disp,
                                    'value'         : 'false',
                                    'color'         : '#000',
                                    'background'    : '#fff',
                                });
                                break;
                        }
                        var nextParam = { 'status': inputStatus };
                        opDB('getNewsList', nextParam);

                        document.getElementsByName('inputStatus').item(0).checked = true;
                        common_text_entry({
                            'innerText' : {
                                'newsMsg'   : '',
                                'newsTitle' : '',
                            },
                            'value' : {
                                'inputTitle'    : '',
                                'inputBody'     : '',
                                'inputLink'     : '',
                            }
                        });
                        common_op_view({
                            'block'  : ['inputTitle', 'registerNews'],
                            'none'  : ['newsTitle', 'deleteNews', 'updateNews'],                            
                        });
                    } else {
                        common_text_entry({'innerText' : {'newsMsg' : '*お知らせの削除に失敗しました。'}});
                    }
                }
            }
            break;

        case 'getDayReport':
            var param   = "function=" + "get_day_report"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&day="   + encodeURIComponent(paramDB['day'])
            ;

            xmlhttp.onreadystatechange = function() {
                common_text_entry({'innerText' : {'dayReport' : ''}});
                common_op_view({
                    'none'  : ['dayReportDl']
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        common_text_entry({'innerHTML' : {'dayReport' : data.report.replaceAll("\n", "<br>")}});
                        common_op_view({
                            'flex'  : ['dayReportDl']
                        });
                    }
                }
            }
            break;

    }

    xmlhttp.open("POST", strUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}
