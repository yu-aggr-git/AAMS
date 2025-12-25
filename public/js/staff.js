window.onload = () => {

    // ログイン
    let staffUser = window.localStorage.getItem("staffUser");
    staffLogin(staffUser);

    // パスワードのリセット
    document.getElementById("resetPassword").onclick = function() {
        resetPassword();
    }

    // パスワードの設定
    document.getElementById("setPassOpen").onclick = function() {
        setPass(staffUser);
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
        common_op_modal('news', 'close');
    }
    document.getElementById("newsList").addEventListener('click', (e) => {
        const newsId = e.target.id;

        if (newsId.startsWith("newsTitle_")) {
            common_op_view({
                'block' : [newsId.replace("Title", "Body"), newsId.replace("Title", "Link")]
            });
        } else if (newsId.startsWith("newsBody_")) {
            common_op_view({
                'none' : [newsId, newsId.replace("Body", "Link")]
            });
        }
    });

    // 登録情報の編集
    document.getElementById("editStaffInfo").onclick = function() {
        staffInfoEdit(this.id, staffUser);
    }
    document.getElementById("cancelStaffInfo").onclick = function() {
        staffInfoEdit(this.id, staffUser);
    }
    document.getElementById("updateStaffInfo").onclick = function() {
        staffInfoEdit(this.id, staffUser);
    }

    // イベントの選択
    document.getElementById("sendSelectStaffEvent").onclick = function() {
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


// ──────────────────────────────────────────────────────
//  スタッフログイン
// ………………………………………………………………………………………………………………………………………………
function staffLogin(staffUser) {
    let paramDB = {};

    if (staffUser) {
        // イベントリストの取得
        paramDB = { 'staffUser': staffUser };
        opDB('getStaffListEvent', paramDB);
    } else {
        common_op_modal('staffLogin', 'open');

        // イベントリストの取得
        opDB('getEventList', null);

        document.getElementById("sendStaffLogin").onclick = function() {
            var inputStaffEventName = document.getElementById("staffEventName").value;
            var inputStaffMail      = document.getElementById("staffMail").value.trim();
            var inputStaffPass      = document.getElementById("staffPass").value.trim();

            if (!inputStaffMail || !inputStaffPass) {
                common_text_entry({'innerText' : {'staffLoginMsg' : 'すべての項目に入力が必要です。'}});
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
}


// ──────────────────────────────────────────────────────
//  パスワードリセット
// ………………………………………………………………………………………………………………………………………………
function resetPassword() {
    const inputStaffMail = document.getElementById("staffMail").value;

    if (!inputStaffMail) {
        common_text_entry({'innerText' : {'resetPasswordMsg' : 'リセットしたいメールアドレスを入力してください。'}});
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
                'inputStaffMail' : inputStaffMail,
            };
            opDB('resetPassword', paramDB);
        }
    }
}


// ──────────────────────────────────────────────────────
//  パスワードの設定
// ………………………………………………………………………………………………………………………………………………
function setPass(staffUser) {
    var paramDB = {
        'mail'  : staffUser,
        'pass'  : document.getElementById("inputStaffPass").value
    };
    opDB('registerStaffListPass', paramDB);
}


// ──────────────────────────────────────────────────────
//  お知らせの表示
// ………………………………………………………………………………………………………………………………………………
function dispNews() {
    common_op_modal('news', 'open');

    // お知らせの取得
    var paramDB = {
        'status'   : '公開' ,
        'op'       : 'disp' ,
    };
    opDB('getNewsList', paramDB);
}


// ──────────────────────────────────────────────────────
//  イベントの選択
// ………………………………………………………………………………………………………………………………………………
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

    // 表示／非表示
    common_op_view({
        'block' : ['editStaffInfo', 'stationP', 'transportationP', 'bankP'],
        'none'  : ['cancelStaffInfo', 'updateStaffInfo', 'inputStationArea', 'inputTransportation', 'inputBankArea'],
        'flex'  : ['selectItemArea']
    });

    // お知らせ確認
    paramDB = {
        'status'   : '公開' ,
        'op'       : 'check' ,
    };
    opDB('getNewsList', paramDB);
}


// ──────────────────────────────────────────────────────
//  登録情報の編集
// ………………………………………………………………………………………………………………………………………………
function staffInfoEdit(id, staffUser) {
    const event = document.getElementById("eventName").textContent;
    const name  = document.getElementById("staffName").textContent;

    switch (id) {
        case 'editStaffInfo':
                common_op_view({
                    'block' : ['cancelStaffInfo', 'updateStaffInfo', 'inputBankArea', 'inputTransportation'],
                    'none'  : ['editStaffInfo', 'stationP', 'transportationP', 'bankP'],
                    'flex'  : ['inputStationArea', 'inputBankArea'],
                });

                var stationA = document.getElementById("stationP").textContent.split(/：/)[1].split(/～/);
                var transportationA = document.getElementById("transportationP").textContent.split(/：/);
                var bankA = document.getElementById("bankP").textContent.split(/：/)[1].split(/ /);
                common_text_entry({
                    'value' : {
                        'inputStation1'         : stationA[0] ?? '',
                        'inputStation2'         : stationA[1] ?? '',
                        'inputTransportation'   : transportationA[1] ? transportationA[1].slice(0, -1) : '',
                        'inputBank1'            : bankA[0] ?? '',
                        'inputBank2'            : bankA[1] ?? '',
                        'inputBank3'            : bankA[2] ?? '普通',
                        'inputBank4'            : bankA[3] ?? '',
                    }
                });
            break;

        case 'cancelStaffInfo':
                getSelectEvent(event, staffUser);
            break;

        case 'updateStaffInfo':
                var paramDB = {
                    'event'             : event,
                    'user'              : staffUser,
                    'name'              : name,
                    'station'           : 
                        document.getElementById("inputStation1").value
                        + '～' + document.getElementById("inputStation2").value
                    ,
                    'transportation'    : document.getElementById("inputTransportation").value,
                    'bank'              : 
                        document.getElementById("inputBank1").value
                        + '_' + document.getElementById("inputBank2").value
                        + '_' + document.getElementById("inputBank3").value
                        + '_' + document.getElementById("inputBank4").value
                    ,
                };
                opDB('updateStaffListInfo', paramDB);
            break;
    }

}


// ──────────────────────────────────────────────────────
//  勤怠情報の取得
// ………………………………………………………………………………………………………………………………………………
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
                common_op_view({
                    'none'  : ['staffworkReportEditInfoArea', 'staffStampEditArea'],
                    'flex'  : ['staffWorkReportInfoArea']
                });

                common_set_element({
                    'element'       : workReport,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#dc4618ff',
                });
                common_set_element({
                    'element'       : workReportEdit,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : stampEdit,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
            }

            // 勤怠情報の表示
            var paramDB = {
                'event' : event,
                'name'  : name
            };
            opDB('getWorkReport', paramDB);
            break;

        case 'workReportEditOpen':
            if (workReportEditValue == 'false') {
                common_op_view({
                    'none'  : ['staffWorkReportInfoArea', 'staffStampEditArea'],
                    'flex'  : ['staffworkReportEditInfoArea']
                });

                common_set_element({
                    'element'       : workReport,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : workReportEdit,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#dc4618ff',
                });
                common_set_element({
                    'element'       : stampEdit,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
            }

            // 修正申請情報の表示
            var paramDB = {
                'event' : event,
                'name'  : name
            };
            opDB('getWorkReportEdit', paramDB);
            break;

        case 'stampEditOpen':
            if (stampEditValue == 'false') {
                common_op_view({
                    'none'  : ['staffWorkReportInfoArea', 'staffworkReportEditInfoArea'],
                    'flex'  : ['staffStampEditArea']
                });

                common_set_element({
                    'element'       : workReport,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : workReportEdit,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : stampEdit,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#dc4618ff',
                });
            }
            break;
    }
}


// ──────────────────────────────────────────────────────
//  打刻情報の修正
// ………………………………………………………………………………………………………………………………………………
function stampInfoEdit() {
    common_text_entry({'innerText' : {'staffStampEditMsg' : ''}});

    const event         = document.getElementById("eventName").textContent;
    const name          = document.getElementById("staffName").textContent;
    const inputDay      = document.getElementById("editStampDay").value;
    const inputItem     = document.getElementById("editStampItem").value;
    const inputHour     = document.getElementById("editStampHour").value;
    const inputMinutes  = document.getElementById("editStampMinutes").value;
    const inputReason   = document.getElementById("editStampReason").value;

    if (!inputReason) {
        common_text_entry({'innerText' : {'staffStampEditMsg' : '申請理由に入力が必要です。'}});
    } else {
        if (
            (inputHour == '×' && inputMinutes != '×' ) ||
            (inputHour != '×' && inputMinutes == '×' )
        ) {
            common_text_entry({'innerText' : {'staffStampEditMsg' : inputHour + ':' + inputMinutes + ' は申請できません。'}});
        } else {
            var stampId = 'stamp_' + inputDay + '_' + inputItem;
            var dataBefore  = document.getElementById(stampId).textContent;
            var dataAfter   = inputHour + ':' + inputMinutes;

            const result = window.confirm(
                    '【イベント】  '    + event     + '\n' 
                +   '【  名前  】  '    + name      + '\n' 
                +   '【  日付  】  '    + inputDay  + '\n' 
                +   '【  項目  】  '    + common_itemName(inputItem) + '\n' 
                +   '【  修正  】  '    + (dataBefore != '' ? dataBefore : '-') + '　→　' + dataAfter + '\n' 
                +   '【  理由  】  '    + inputReason + '\n' 
                +   '\n以上の内容で、打刻時間の修正申請をしてよろしいですか？'
            );

            if (result) {
                var paramDB = {
                    'requestDt'  : common_date().yyyymmddhhmmss,
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
                + "&loginDt="               + encodeURIComponent(common_date().yyyymmddhhmmss) 
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({'innerText' : {'staffLoginMsg' : ''}});

                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    if (result == 'true') {
                        common_op_modal('staffLogin', 'close');
                        localStorage.setItem("staffUser", paramDB['inputStaffMail']);

                        // イベントリストの取得
                        var nextParamDB = { 'staffUser': paramDB['inputStaffMail'] };
                        opDB('getStaffListEvent', nextParamDB);

                        // イベントの選択
                        getSelectEvent(paramDB['inputStaffEventName'], paramDB['inputStaffMail']);
                    } else {
                        common_text_entry({'innerText' : {'staffLoginMsg' : '入力値が誤っています。'}});
                    }
                }
            }
            break;

        case 'resetPassword':
            var param   = "function=" + "reset_password"
                + "&inputStaffMail="        + encodeURIComponent(paramDB['inputStaffMail'])
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({'innerText' : {'resetPasswordMsg' : ''}});

                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    let msg = '';
                    if (result != 0) {
                        msg = 'パスワードがリセットされました。';
                    } else {
                        msg = 'このメールアドレスは未登録、またはパスワードは初期値に設定されています。';
                    }
                    common_text_entry({'innerText' : {'resetPasswordMsg' : msg}});
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
                        'eventName'     : '',
                        'eventPlace'    : '（）',
                        'eventDays'     : '期間：',
                        'eventPayDay'   : '支払日：'
                    },
                    'href'      : {
                        'aShift' : ''
                    }
                });
                common_clear_children({
                    'all'   : {
                        'staffWorkReportInfoArea'   : 'td',
                        'editStampDay'              : 'option',
                    },
                    'notId' : {
                        'staffWorkReportInfoArea' : 'th',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    // イベント情報
                    common_text_entry({
                        'innerText' : {
                            'eventName'     :  data.event,
                            'eventPlace'    :  '（' + (data.place ?? '') + '）',
                            'eventDays'     : '期間：' + data.first_day + ' ～ ' + data.end_day,
                            'eventPayDay'   : '支払日：' + (data.pay_day ?? ''),
                            'aShift'        : data.shift_url
                        },
                        'href' : {
                            'aShift' : data.shift_url
                        }
                    });

                    const firstDay  = data.first_day.split(/-/);
                    const endDay    = data.end_day.split(/-/);
                    for (
                        let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                        date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                        date.setDate(date.getDate() + 1)
                    ){
                        // 日付
                        var th = document.createElement("th");
                        common_set_element({
                            'element'       : th,
                            'innerText'     : date.toLocaleDateString('sv-SE'),
                            'colSpan'       : '2',
                        });
                        document.getElementById("dateHeader").appendChild(th);

                        // 項目
                        var th = document.createElement("th");
                        common_set_element({
                            'element'       : th,
                            'className'     : 'borderRight',
                            'innerText'     : '打刻',
                        });
                        var th2 = document.createElement("th");
                        common_set_element({
                            'element'       : th2,
                            'className'     : 'borderLeftNone',
                            'innerText'     : '勤怠',
                        });
                        document.getElementById("itemHeader").appendChild(th);
                        document.getElementById("itemHeader").appendChild(th2);

                        // 出勤
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_start',
                            'className'     : 'borderRight',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_start',
                            'className'     : 'borderLeftNone',
                        });
                        document.getElementById("startRow").appendChild(td);
                        document.getElementById("startRow").appendChild(td2);

                        // 休憩1：開始
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_break1s',
                            'className'     : 'borderRight borderBottom',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_break1s',
                            'className'     : 'borderLeftNone borderBottom',
                        });
                        document.getElementById("break1sRow").appendChild(td);
                        document.getElementById("break1sRow").appendChild(td2);

                        // 休憩1：終了
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_break1e',
                            'className'     : 'borderRight borderTopNone',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_break1e',
                            'className'     : 'borderLeftNone borderTopNone',
                        });
                        document.getElementById("break1eRow").appendChild(td);
                        document.getElementById("break1eRow").appendChild(td2);

                        // 休憩2：開始
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_break2s',
                            'className'     : 'borderRight borderBottom',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_break2s',
                            'className'     : 'borderLeftNone borderBottom',
                        });
                        document.getElementById("break2sRow").appendChild(td);
                        document.getElementById("break2sRow").appendChild(td2);

                        // 休憩2：終了
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_break2e',
                            'className'     : 'borderRight borderTopNone',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_break2e',
                            'className'     : 'borderLeftNone borderTopNone',
                        });
                        document.getElementById("break2eRow").appendChild(td);
                        document.getElementById("break2eRow").appendChild(td2);

                        // 休憩3：開始
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_break3s',
                            'className'     : 'borderRight borderBottom',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_break3s',
                            'className'     : 'borderLeftNone borderBottom',
                        });
                        document.getElementById("break3sRow").appendChild(td);
                        document.getElementById("break3sRow").appendChild(td2);

                        // 休憩3：終了
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_break3e',
                            'className'     : 'borderRight borderTopNone',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_break3e',
                            'className'     : 'borderLeftNone borderTopNone',
                        });
                        document.getElementById("break3eRow").appendChild(td);
                        document.getElementById("break3eRow").appendChild(td2);

                        // 退勤
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'stamp_' + date.toLocaleDateString('sv-SE') + '_end',
                            'className'     : 'borderRight',
                        });
                        var td2 = document.createElement("td");
                        common_set_element({
                            'element'       : td2,
                            'id'            : 'workReport_' + date.toLocaleDateString('sv-SE') + '_end',
                            'className'     : 'borderLeftNone',
                        });
                        document.getElementById("endRow").appendChild(td);
                        document.getElementById("endRow").appendChild(td2);

                        // 休憩時間
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'breakTime_' + date.toLocaleDateString('sv-SE'),
                            'colSpan'       : '2',
                        });
                        document.getElementById("breakTimeRow").appendChild(td);

                        // 実働時間
                        var td = document.createElement("td");
                        common_set_element({
                            'element'       : td,
                            'id'            : 'workTime_' + date.toLocaleDateString('sv-SE'),
                            'colSpan'       : '2',
                        });
                        document.getElementById("workTimeRow").appendChild(td);


                        // 修正対象日
                        var option = document.createElement("option");
                        common_set_element({
                            'element'   : option,
                            'text'      : date.toLocaleDateString('sv-SE'),
                            'value'     : date.toLocaleDateString('sv-SE'),
                        });
                        document.getElementById("editStampDay").appendChild(option);
                    }
                }
            }
            break;

        case 'getEventList':
            var param   = "function=" + "get_event_list";
            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_clear_children({
                    'all'   : {
                        'staffEventName' : 'option'
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        common_set_element({
                            'element'   : option,
                            'text'      : data[key],
                            'value'     : data[key],
                        });
                        document.getElementById("staffEventName").appendChild(option);
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
                // 初期値
                const table = document.getElementById("staffWorkReportInfoArea");
                Array.from(table.querySelectorAll("td")).forEach(function(e) {
                    e.innerText = '';
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        const itemList = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];

                        Object.keys(data).forEach(function(key) {
                            var clacList = {};

                            Object.keys(itemList).forEach(function(item) {
                                var itemName = itemList[item];
                                var itemData = data[key][itemName];

                                if (itemData) {
                                    var dataClac = itemData.startsWith('＊') ? '＊' : '';

                                    if (common_validation_time(itemData)) {
                                        if (itemName != 'end') {
                                            // 切り上げ
                                            dataClac = common_ceil(itemData);
                                        } else {
                                            // 切り捨て
                                            dataClac = common_floor(clacList.start, itemData);
                                        }
                                    }
                                    clacList[itemName] = dataClac; 

                                    // 打刻・勤怠入力
                                    var stampId      = 'stamp_' + data[key].day + '_' + itemName;
                                    var workReportId = 'workReport_' + data[key].day + '_' + itemName;
                                    common_text_entry({
                                        'innerText' : {
                                            [stampId]       : itemData,
                                            [workReportId]  : dataClac,
                                        }
                                    });
                                }
                            });

                            // 時間計算
                            var reportTime = common_report_time(
                                data[key].day,
                                clacList.start,
                                clacList.break1s,
                                clacList.break1e,
                                clacList.break2s,
                                clacList.break2e,
                                clacList.break3s,
                                clacList.break3e,
                                clacList.end
                            );
                            var reportTimeB = reportTime.breakTime;
                            var reportTimeW  = reportTime.workTime;

                            // 休憩・実働入力
                            var breakTimeId = 'breakTime_' + data[key].day;
                            var workTimeId  = 'workTime_' + data[key].day;
                            common_text_entry({
                                'innerText' : {
                                    [breakTimeId]   : reportTimeB,
                                    [workTimeId]    : reportTimeW,
                                }
                            });
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
                // 初期値
                common_clear_children({
                    'all'   : {
                        'selectStaffEvent' : 'option'
                    }
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        common_set_element({
                            'element'   : option,
                            'text'      : data[key],
                            'value'     : data[key],
                        });
                        document.getElementById("selectStaffEvent").appendChild(option);
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
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'staffName'         : '',
                        'birthday'          : '',
                        'mail'              : '',
                        'stationP'          : '利用駅：',
                        'transportationP'   : '往復：',
                        'bankP'             : '口座：',
                        'payslip'           : ''
                    }
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    // イベント情報
                    common_text_entry({
                        'innerText' : {
                            'staffName'         : data.name,
                            'birthday'          : data.birthday.substr(0, 4) + '年' + data.birthday.substr(4, 2) + '月' + data.birthday.substr(6, 2) + '日生',
                            'mail'              : data.mail,
                            'stationP'          : '利用駅：' + (data.station ?? ''),
                            'transportationP'   : '往復：' + (data.transportation ?? '') + '円',
                            'bankP'             : '口座：' + (data.bank ? data.bank.replaceAll("_", " ") : ''),
                        }
                    });
                    if (data.payslip) {
                        data.payslip.split(/\n/).forEach(function(val) {
                            var a = document.createElement("a");
                            common_set_element({
                                'element'       : a,
                                'innerText'     : val,
                                'href'          : val,
                                'target'        : '_blank',
                                'display'       : 'block',
                            });
                            document.getElementById("payslip").appendChild(a);
                        });
                    } else {
                        common_text_entry({'innerText' : {'payslip' : '＊給与明細は公開前です。'}});
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
                // 初期値
                common_op_view({'none' : ['staffEventInfoMsgArea']});

                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    if (result == 'false') {
                        common_op_view({'flex' : ['staffEventInfoMsgArea']});
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
                // 初期値
                common_text_entry({'innerText' : {'staffEventInfoMsg' : ''}});

                if (this.readyState == 4 && this.status == 200) {
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        common_op_view({'none' : ['staffEventInfoMsgArea']});
                    } else {
                        common_text_entry({'innerText' : {'staffEventInfoMsg' : 'パスワード設定ができませんでした。'}});
                    }
                }
            }
            break;

        case 'updateStaffListInfo':
            var param   = "function=" + "update_staff_list_info"
                + "&event="             + encodeURIComponent(paramDB['event']) 
                + "&name="              + encodeURIComponent(paramDB['name']) 
                + "&station="           + encodeURIComponent(paramDB['station']) 
                + "&transportation="    + encodeURIComponent(paramDB['transportation']) 
                + "&bank="              + encodeURIComponent(paramDB['bank']) 
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getSelectEvent(paramDB['event'], paramDB['user']);
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
                // 初期値
                common_clear_children({
                    'all'   : {
                        'staffworkReportEditInfoArea' : 'td'
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        const orderList = ['start', 'break1s', 'break1e', 'break2s', 'break2e', 'break3s', 'break3e', 'end'];

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
                                        var tr = document.createElement("tr");

                                        // 日付行
                                        dayNum[dayKey] = dayNum[dayKey] + 1;
                                        common_set_element({
                                            'element'   : day,
                                            'className' : (dayNum[dayKey] == 1) ? 'sticky1' : 'sticky1 valueTop',
                                            'rowSpan'   : dayNum[dayKey],
                                        });
                                        if (dayNum[dayKey] == 1) {
                                            common_set_element({
                                                'element'       : day,
                                                'innerText'     : dayKey,
                                                'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
                                            });
                                            tr.appendChild(day);
                                        }

                                        // 項目行
                                        itemNum[itemKey] = itemNum[itemKey] + 1;
                                        common_set_element({
                                            'element'   : item,
                                            'className' : (itemNum[itemKey] == 1) ? 'sticky2' : 'sticky2 valueTop',
                                            'rowSpan'   : itemNum[itemKey]
                                        });
                                        if (itemNum[itemKey] == 1) {
                                            common_set_element({
                                                'element'       : item,
                                                'innerText'     : common_itemName(itemKey),
                                                'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
                                            });
                                            tr.appendChild(item);
                                        }

                                        // ステータス
                                        var status = document.createElement("td");
                                        common_set_element({
                                            'element'       : status,
                                            'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
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
                                            'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
                                        });
                                        tr.appendChild(data_before);

                                        // 修正後
                                        var data_after = document.createElement("td");
                                        common_set_element({
                                            'element'       : data_after,
                                            'innerText'     : dataItem[key].data_after,
                                            'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
                                        });
                                        tr.appendChild(data_after);

                                        // 理由
                                        var reason = document.createElement("td");
                                        common_set_element({
                                            'element'       : reason,
                                            'className'     : 'reason textStart w25',
                                            'innerText'     : dataItem[key].reason,
                                            'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
                                        });
                                        tr.appendChild(reason);

                                        // 申請日
                                        var request_dt = document.createElement("td");
                                        common_set_element({
                                            'element'       : request_dt,
                                            'className'     : 'requestDt w25',
                                            'innerText'     : dataItem[key].request_dt,
                                            'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
                                        });
                                        tr.appendChild(request_dt);

                                        // 承認日
                                        var approval_d = document.createElement("td");
                                        common_set_element({
                                            'element'       : approval_d,
                                            'innerText'     : dataItem[key].approval_d,
                                            'background'    : (i % 2 == 0) ? '#f5f5f5ff' : '#fff',
                                        });
                                        tr.appendChild(approval_d);

                                        document.getElementById("staffworkReportEditInfoArea").querySelector("tbody").appendChild(tr);
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
                // 初期値
                common_text_entry({'innerText' : {'staffStampEditMsg' : ''}});

                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        getWorkReport('workReportEditOpen', paramDB.event, paramDB.name);
                    } else {
                        common_text_entry({'innerText' : {'staffStampEditMsg' : '申請登録できませんでした。'}});
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
                    'all' : {
                        'newsListDl' : '.newsDisplay'
                    }
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);
                    const dl = document.getElementById("newsList").querySelector("dl");

                    let i = 1;
                    Object.keys(data).forEach(function(key) {
                        animeNewsStart = document.getElementById("openNews").animate(
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
                            common_set_element({
                                'element'       : dt,
                                'className'     : 'newsDisplay',
                                'textContent'   : data[key].register_dt.substring(0, 10),
                            });

                            var dd = document.createElement("dd");
                            common_set_element({
                                'element'       : dd,
                                'className'     : 'newsDisplay',
                            });

                            var title = document.createElement("p");
                            common_set_element({
                                'element'       : title,
                                'id'            : 'newsTitle_' + i,
                                'className'     : 'newsTitle',
                                'textContent'   : '『 ' + data[key].title + ' 』',
                            });
                            dd.appendChild(title);

                            var body = document.createElement("p");
                            common_set_element({
                                'element'       : body,
                                'id'            : 'newsBody_' + i,
                                'innerHTML'     : data[key].body,
                                'display'       : 'none',
                            });
                            dd.appendChild(body);

                            var link = document.createElement("a");
                            common_set_element({
                                'element'       : link,
                                'id'            : 'newsLink_' + i,
                                'textContent'   : data[key].link,
                                'href'          : data[key].link,
                                'target'        : '_blank',
                                'display'       : 'none',
                            });
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