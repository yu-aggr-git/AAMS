window.onload = () => {

    // 管理者判定
    checkAdmin();


    // ログイン
    document.getElementById("loginStaff").onclick = function() {
        login(this.id);
    }
    document.getElementById("loginAdmin").onclick = function() {
        login(this.id);
    }
    document.getElementById("closeAdminLogin").onclick = function() {
        common_op_modal('adminLogin', 'close');
    }


    // ログアウト
    document.getElementById("adminLogout").onclick = function() {
        localStorage.removeItem('adminUser');
        window.location.reload();
    }


    // イベント選択
    document.getElementById("sendSelectEvent").onclick = function() {
        eventSelect();
    }


    // 項目の切り替え
    document.getElementById("formInfoOpen").onclick = function() {
        var event = document.getElementById("eventName").innerText;
        getItem(this.id, event);
    }
    document.getElementById("shiftInfoOpen").onclick = function() {
        var event = document.getElementById("eventName").innerText;
        getItem(this.id, event);
    }
    document.getElementById("shiftChangeInfoOpen").onclick = function() {
        var event = document.getElementById("eventName").innerText;
        getItem(this.id, event);
    }


    // 応募者詳細の取得
    document.getElementById("formInfoTable").addEventListener('click', (e) => {
        if (e.target.className == "nameB") {
            getFormNameInfo(e.target.value);
        }
    })
    document.getElementById("closeFormNameInfo").onclick = function() {
        common_op_modal('formNameInfo', 'close');
    }


    // 応募者ステータスの編集
    document.getElementById("editFormInfo").onclick = function() {
        editStatus();
    }
    document.getElementById("cancelFormInfo").onclick = function() {
        var event = document.getElementById("eventName").innerText;

        common_text_entry({'innerText' : {'formInfoMsg' : ''}});
        common_op_view({
            'block' : ['editFormInfo'],
            'none'  : ['cancelFormInfo', 'updateFormInfo']
        });

        getItem("formInfoOpen", event);
    }


    // シフトの編集
    document.getElementById("editShiftInfo").onclick = function() {
        editShift();
    }
    document.getElementById("cancelShiftInfo").onclick = function() {
        var event = document.getElementById("eventName").innerText;

        common_text_entry({'innerText' : {'shiftInfoMsg' : ''}});
        common_op_view({
            'block' : ['editShiftInfo', 'selectBooth', 'printShiftInfo'],
            'none'  : ['cancelShiftInfo', 'updateShiftInfo']
        });

        getItem("shiftInfoOpen", event);
    }


    // ブース絞り込み
    document.getElementById("selectBooth").onchange = function() {
        var event = document.getElementById("eventName").innerText;

        // シフトの取得
        var paramDB = {
            'event' : event,
            'booth' : document.getElementById("selectBooth").value
        };
        opDB('getStaffListShift', paramDB);
    }


    // シフト詳細の取得
    document.getElementById("shiftInfoTable").addEventListener('click', (e) => {
        if (e.target.className == "nameB") {
            getFormNameInfo(e.target.value);
        }

        if (e.target.className == "shiftInfoB") {
            getShiftDayInfo(e.target.value);
        }
    })
    document.getElementById("closeShiftDayInfo").onclick = function() {
        common_op_modal('shiftDayInfo', 'close');
    }


    // シフト変更希望の操作
    document.getElementById("approveShiftChangeInfo").onclick = function() {
        shiftChangeInfoEdit(this.id);
    }
    document.getElementById("rejectWorkShiftChangeInfo").onclick = function() {
        shiftChangeInfoEdit(this.id);
    }


    // シフト変更希望の提出
    document.getElementById("sendShiftChangeInfoRequest").onclick = function() {
        registerShiftChangeInfo(this.id);
    }
    document.getElementById("sendAvailableRequest").onclick = function() {
        registerShiftChangeInfo(this.id);
    }


    // スタッフ追加
    document.getElementById("sendAddStaff").onclick = function() {
        sendAddStaff();
    }


    // 印刷
    document.getElementById("printShiftInfo").onclick = function() {
        common_print(
            'printTarget',
            ['header', 'menuBar', 'selectEventArea', 'eventInfoArea', 'selectItemArea', 'shiftInfoMenu', 'addStaff', 'footer']
        );

        window.location.reload();
    }
}



// ──────────────────────────────────────────────────────
//  管理者判定
// ………………………………………………………………………………………………………………………………………………
function checkAdmin() {
    const adminUser = window.localStorage.getItem("adminUser");
    const staffUser = window.localStorage.getItem("staffUser");

    if (adminUser) {
        common_op_view({
            'block' : ['adminLogout'],
            'flex'  : ['selectEventArea', 'eventInfoArea']
        });

        // イベント取得
        opDB('getEventListShift');
    } else {
        const url    = new URL(window.location.href);
        const params = url.searchParams;

        if (staffUser && params.get('event')) {
            // 名前の取得
            var paramDB = {
                'event' : params.get('event'),
                'mail'  : staffUser
            }; 
            opDB('getStaffListName', paramDB);
        } else {
            // ログインエリアの表示
            common_op_view({
                'flex'  : ['shiftLoginArea']
            });
        }
    }
}



// ──────────────────────────────────────────────────────
//  ログイン
// ………………………………………………………………………………………………………………………………………………
function login(id) {
    common_text_entry({'innerText' : {'adminMsg' : ''}});

    switch (id) {
        case 'loginStaff':
            // スタッフ
            location.assign('staff.php');
            break;

        case 'loginAdmin':
            // 管理者
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
            break;
    }
}



// ──────────────────────────────────────────────────────
//  イベント選択
// ………………………………………………………………………………………………………………………………………………
function eventSelect() {
    common_op_view({
        'flex'  : ['selectItemArea']
    });

    var selectEvent = document.getElementById("selectEvent").value;
    var paramDB = {
        'event' : selectEvent
    };

    // イベント情報の取得
    opDB('getEvent', paramDB);
}



// ──────────────────────────────────────────────────────
//  項目の切り替え
// ………………………………………………………………………………………………………………………………………………
function getItem(id, event) {
    const adminUser = window.localStorage.getItem("adminUser");

    const shiftInfo             = document.getElementById('shiftInfoOpen');
    const shiftInfoValue        = shiftInfo.value;
    const shiftChangeInfo       = document.getElementById('shiftChangeInfoOpen');
    const shiftChangeInfoValue  = shiftChangeInfo.value;
    const formInfo              = document.getElementById('formInfoOpen');
    const formInfoValue         = formInfo.value;

    var paramDB = {
        'event' : event
    };

    // 変更希望の未承認確認
    if (adminUser) {
        opDB('checkShiftChangeList', paramDB);
    }


    // 表示切替
    switch (id) {
        case 'shiftInfoOpen':
            if (shiftInfoValue == 'false') {
                // シフトの表示
                common_op_view({
                    'none'  : ['formInfoArea', 'shiftChangeInfoArea'],
                    'flex'  : ['shiftInfoArea']
                });
                common_set_element({
                    'element'       : shiftInfo,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#dc4618ff',
                });
                common_set_element({
                    'element'       : formInfo,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : shiftChangeInfo,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
            }

            // 管理者用項目の表示
            if (adminUser) {
                common_op_view({
                    'flex'  : ['addStaff']
                });
            }

            // シフトの取得
            paramDB['booth'] = 'ALL';
            opDB('getStaffListShift', paramDB);

            break;

        case 'shiftChangeInfoOpen':
            if (shiftChangeInfoValue == 'false') {
                // 変更希望の表示
                common_op_view({
                    'none'  : ['formInfoArea', 'shiftInfoArea'],
                    'flex'  : ['shiftChangeInfoArea']
                });
                common_set_element({
                    'element'       : shiftInfo,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : shiftChangeInfo,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#dc4618ff',
                });
                common_set_element({
                    'element'       : formInfo,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
            }

            // シフト変更希望の取得
            paramDB['name'] = adminUser
                ? 'ALL' 
                : document.getElementById("displayName").innerText
            ;
            opDB('getShiftChangeList', paramDB);

            // スタッフ用項目の表示
            if (!adminUser) {
                common_op_view({
                    'flex'  : ['shiftChangeInfoRequest', 'availableRequest']
                });

                opDB('getShiftChangeListSelect', paramDB);
            }

            break;

        case 'formInfoOpen':
            if (formInfoValue == 'false') {
                // シフトの表示
                common_op_view({
                    'none'  : ['shiftInfoArea', 'shiftChangeInfoArea'],
                    'flex'  : ['formInfoArea']
                });
                common_set_element({
                    'element'       : shiftInfo,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : shiftChangeInfo,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : formInfo,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#dc4618ff',
                });
            }

            // 応募情報の取得
            if (adminUser) {
                opDB('getApplicationListALL', paramDB);
            }
            break;
    }


    // 管理者用項目の非表示
    if (!adminUser) {
        common_op_view({
            'none'  : ['shiftInfoMenu', 'shiftChangeInfoMenu'],
        });
    }
}



// ──────────────────────────────────────────────────────
//  応募者詳細の取得
// ………………………………………………………………………………………………………………………………………………
function getFormNameInfo(value) {
    const adminUser = window.localStorage.getItem("adminUser");

    if (adminUser) {
        common_op_modal('formNameInfo', 'open');

        const valueA = value.split(/:/);

        var paramDB = {
            'event' : valueA[0],
            'mail'  : valueA[1],
        };
        opDB('getApplicationInfo', paramDB);
    }
};



// ──────────────────────────────────────────────────────
//  応募者ステータスの編集
// ………………………………………………………………………………………………………………………………………………
function editStatus() {
    common_text_entry({'innerText' : {'formInfoMsg' : ''}});
    common_op_view({
        'block' : ['cancelFormInfo', 'updateFormInfo'],
        'none'  : ['editFormInfo']
    });

    // pタグ非表示
    const statusP = document.querySelectorAll('.statusP');
    statusP.forEach(function(e) {
        common_set_element({
            'element' : e,
            'display' : 'none'
        });
    });

    // selectタグ表示
    let applicationStatus = [];
    const statusS = document.querySelectorAll('.statusS');
    statusS.forEach(function(e) {
        common_set_element({
            'element' : e,
            'display' : 'block'
        });

        var valueA = e.value.split(/:/);
        applicationStatus[valueA[1]] = valueA[2];
    });

    // 更新
    const adminUser = window.localStorage.getItem("adminUser");
    if (adminUser) {
        const event = document.getElementById("eventName").innerText;
        let updateStatus = [];
        document.getElementById("updateFormInfo").onclick = function() {
            statusS.forEach(function(e) {
                var valueA =  e.value.split(/:/);

                // 更新値の設定
                if (applicationStatus[valueA[1]] != valueA[2]) {
                    updateStatus.push(
                        valueA[1]
                        + '|'
                        + valueA[2]
                    );
                }
            });

            const result = window.confirm('応募者のステータスを変更してよろしいですか？');
            if (result) {
                if (updateStatus.length === 0) {
                    document.getElementById("cancelFormInfo").click();
                } else {
                    var paramDB = {
                        'event'         : event,
                        'updateList'    : updateStatus,
                    };
                    opDB('updateApplicationStatus', paramDB);
                }
            }
        }
    }
};



// ──────────────────────────────────────────────────────
//  シフトの編集
// ………………………………………………………………………………………………………………………………………………
function editShift() {
    common_text_entry({'innerText' : {'shiftInfoMsg' : ''}});
    common_op_view({
        'block' : ['cancelShiftInfo', 'updateShiftInfo'],
        'none'  : ['editShiftInfo', 'selectBooth', 'printShiftInfo']
    });

    const shiftInfoTable = document.getElementById("shiftInfoTable");

    // pタグ非表示
    Array.from(shiftInfoTable.getElementsByClassName("shiftDisplay")).forEach(function(e) {
        common_set_element({
            'element' : e,
            'display' : 'none'
        });
    });

    // inputタグの表示
    Array.from(shiftInfoTable.getElementsByClassName("shiftEdit")).forEach(function(e) {
        common_set_element({
            'element' : e,
            'display' : 'block'
        });
    });

    // 更新
    const adminUser = window.localStorage.getItem("adminUser");
    if (adminUser) {
        const event = document.getElementById("eventName").innerText;
        let updateShift = [];
        let updateNum = '';
        document.getElementById("updateShiftInfo").onclick = function() {

            // 名前リスト
            Array.from(shiftInfoTable.getElementsByClassName("nameB")).forEach(function(e) {
                var nameA = e.innerText.split(/\./);
                updateShift[nameA[0]] = nameA[1];
            });

            // 更新値
            let emsg = '';
            Array.from(shiftInfoTable.querySelectorAll("input")).forEach(function(e) {
                var idA = e.id.split(/_/);

                if (e.className.includes('numEdit')) {
                    // 人数
                    var day  = idA[0];

                    var num = day + '_' + e.value;
                    updateNum = updateNum ? updateNum + ',' + num : num;  
                } else if (e.className.includes('boothEdit')) {
                    // ブース
                    var no  = idA[0];

                    var booth = e.value;
                    updateShift[no] = updateShift[no] + '|' + booth;
                } else {
                    // シフト
                    var no  = idA[0];
                    var day = idA[1];
                    var time = e.value == '' ? '×' : common_replaceStr(e.value);

                    if (time != '×' && !(common_validation_hhmm(time))) {
                        // 形式チェック
                        emsg = '「hh:mm形式」かつ「15分単位」で入力してください。';
                        common_set_element({
                            'element'       : e,
                            'borderColor'   : '#ff0000'
                        });
                    } else {
                        // 単位チェック
                        var timeA = time.split(/:/);
                        if (time != '×' && !(common_validation_minutes(timeA[1]))) {
                            emsg = '「hh:mm形式」かつ「15分単位」で入力してください。';
                            common_set_element({
                                'element'       : e,
                                'borderColor'   : '#ff0000'
                            });
                        }
                    }

                    if (updateShift[no].match(/\|/g).length == 1) {
                        updateShift[no] = updateShift[no] + '|' + day + '_' + time;
                    } else {
                        updateShift[no] = !(updateShift[no].includes(day))
                            ? updateShift[no] + '/' + day + '_' + time
                            : updateShift[no] + '_' + time
                        ;
                    }
                }
            });

            if (emsg != '') {
                common_text_entry({'innerText' : {'shiftInfoMsg' : emsg}});
            } else {
                // 更新実行
                const result = window.confirm('シフトを更新してよろしいですか？');

                if (result) {
                    if (updateShift.length === 0 && !updateNum) {
                        document.getElementById("cancelShiftInfo").click();
                    } else {
                        var paramDB = {
                            'event'             : event,
                            'updateList'        : updateShift,
                            'updateNum'         : updateNum,
                            'shiftUpdatedDt'    : common_date().yyyymmddhhmmss
                        };
                        opDB('updateStaffListShift', paramDB);
                    }
                }
            }
        }
    }
};



// ──────────────────────────────────────────────────────
//  シフト変更希望の操作
// ………………………………………………………………………………………………………………………………………………
function shiftChangeInfoEdit(id) {
    common_text_entry({'innerText' : {'shiftChangeInfoMsg' : ''}});

    const approve       = document.getElementById('approveShiftChangeInfo');
    const approveValue  = approve.value;
    const reject        = document.getElementById('rejectWorkShiftChangeInfo');
    const rejectValue   = reject.value;

    switch (id) {
        case 'approveShiftChangeInfo':
            if (approveValue == 'true') {
                common_set_element({
                    'element'       : approve,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
            } else {
                common_set_element({
                    'element'       : approve,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#000',
                });

                if (rejectValue == 'true') {
                    common_set_element({
                        'element'       : reject,
                        'value'         : 'false',
                        'color'         : '#000',
                        'background'    : '#fff',
                    });
                }
            }
            break;

        case 'rejectWorkShiftChangeInfo':
            if (rejectValue == 'true') {
                common_set_element({
                    'element'       : reject,
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
            } else {
                common_set_element({
                    'element'       : reject,
                    'value'         : 'true',
                    'color'         : '#fff',
                    'background'    : '#000',
                });

                if (approveValue == 'true') {
                    common_set_element({
                        'element'       : approve,
                        'value'         : 'false',
                        'color'         : '#000',
                        'background'    : '#fff',
                    });
                }
            }
            break;
    }


    const adminUser = window.localStorage.getItem("adminUser");
    if (adminUser) {
        const selectStatusB = document.querySelectorAll('.selectStatusB');
        selectStatusB.forEach(function(e) {
            e.onclick = function() {
                const statusBefore = e.innerText;
                let statusAfter = '';

                if (statusBefore == '申請中') {
                    if (approve.value == 'true' && reject.value == 'false') {
                        statusAfter = '承認済';
                    } else if (approve.value == 'false' && reject.value == 'true') {
                        statusAfter = '却下済';
                    }
                }

                if (statusAfter) {
                    const result = window.confirm('シフト変更希望のステータス変更をしてよろしいですか？');
                    if (result) {
                        var val =  e.value;
                        var valArray = val.split(/,/);

                        var paramDB = {
                            'statusAfter'   : statusAfter,
                            'requestDt'     : valArray[0],
                            'event'         : valArray[1],
                            'name'          : valArray[2],
                            'day'           : valArray[3],
                            'dataAfter'     : valArray[4],
                        };
                        opDB('updateShiftChangeInfo', paramDB);
                    }
                }
            }
        });
    }
}



// ──────────────────────────────────────────────────────
//  シフト詳細の取得
// ………………………………………………………………………………………………………………………………………………
function getShiftDayInfo(value) {
    common_op_modal('shiftDayInfo', 'open');
    common_clear_children({
        'notId' : {
            'shiftDayInfoTable'     : 'tr',
            'shiftDayInfoHeader'    : 'th',
        }
    });

    const shiftInfoTable = document.getElementById("shiftInfoTable");

    let displayDay = [];
    Array.from(shiftInfoTable.querySelectorAll("input")).forEach(function(e) {
        var idA  = e.id.split(/_/);
        var no   = idA[0];
        var day  = idA[1];
        var item = idA[2];
        var time = e.value;

        if (day == value && time) {
            displayDay[no] = item == 'inputS'
                ? time + '_'
                : no in displayDay
                    ? displayDay[no] + time
                    : displayDay[no] + '_' + time
            ;
        }
    });

    let startTimeH = Number(document.getElementById("startTime").innerText.split(/:/)[0]);
    let endTimeH   = Number(document.getElementById("endTime").innerText.split(/:/)[0]); 

    for(var key in displayDay){
        // 表示No.
        var th = document.createElement("th");
        common_set_element({
            'element'   : th,
            'className' : 'sticky2',
            'innerText' : key,
        });
        document.getElementById("shiftDayInfoHeader").appendChild(th);

        // 表示時間
        var timeA   = displayDay[key].split(/_/);
        var timeSH  = Number(timeA[0].split(/:/)[0]);
        var timeEH  = Number(timeA[1].split(/:/)[0]);
        startTimeH  = startTimeH < timeSH ? startTimeH : timeSH;
        endTimeH    = endTimeH > timeEH ? endTimeH : timeEH;
    }

    for (let h = Number(startTimeH); h <= Number(endTimeH); h++) {
        for (let m = 0; m <= 45; m += 15) {
            var tr = document.createElement("tr");

            // 時間
            var th = document.createElement("th");
            common_set_element({
                'element'   : th,
                'className' : 'sticky3',
                'innerText' : h + ':' + m.toString().padStart(2, '0'),
            });
            tr.appendChild(th);

            // スタッフ
            displayDay.forEach(function(time) {
                var timeA   = time.split(/_/);
                var startA  = timeA[0].split(/:/);
                var endA    = timeA[1].split(/:/);

                var td = document.createElement("td");
                common_set_element({
                    'element'       : td,
                    'innerText'     : "　",
                    'background'    : (
                        ((h > Number(startA[0]) ) || (h == Number(startA[0]) && m >= Number(startA[1]))) &&
                        ((h < Number(endA[0]) )   || (h == Number(endA[0]) && m <= Number(endA[1])))
                        ? '#fff000'
                        : '#fff'
                    ),
                });
                tr.appendChild(td);
            });

            document.getElementById("shiftDayInfoTable").querySelector("tbody").appendChild(tr);
        }
    }
};



// ──────────────────────────────────────────────────────
//  シフト変更希望の提出
// ………………………………………………………………………………………………………………………………………………
function registerShiftChangeInfo(id) {
    common_text_entry({
        'innerText' : {
            'shiftChangeInfoRequestMsg' : '',
            'availableRequestMsg'       : '',
        }
    });

    let before  = '';
    let after   = '';
    let status  = '';
    let inputS  = '';
    let inputE  = '';
    let msg     = '';
    let available = '';

    switch (id) {
        case 'sendShiftChangeInfoRequest':
            before = document.getElementById("selectShiftDay").value;
            inputS = document.getElementById("selectShiftAfterS").value;
            inputE = document.getElementById("selectShiftAfterE").value;

            if ((inputS == '×' && inputE != '×') || (inputS != '×' && inputE == '×')) {
                // 入力ミス
                msg = '出勤不可への変更は「×-×」と入力してください。';
            }

            if (msg) {
                common_text_entry({'innerText' : {'shiftChangeInfoRequestMsg' : msg}});
            } else {
                after = before.substring(0, 10)
                    + '_' + inputS
                    + '_' + inputE
                ;
                status = '申請中';
            }
            break;

        case 'sendAvailableRequest':
            before = document.getElementById("selectAvailableDay").value;
            inputS = document.getElementById("selectAvailableAfterS").value;
            inputE = document.getElementById("selectAvailableAfterE").value;

            if ((inputS == '×' && inputE != '×') || (inputS != '×' && inputE == '×')) {
                // 入力ミス
                msg = '出勤不可への変更は「×-×」と入力してください。';
            } else {
                var beforeA     = before.split(/_/);
                let selectDay   = '';

                const selectShiftDay = document.getElementById("selectShiftDay");
                Array.from(selectShiftDay.querySelectorAll("option")).forEach(function(e) {
                    var shiftDayA = e.value.split(/_/);

                    if (shiftDayA[0] == beforeA[0]) {
                        selectDay = shiftDayA[0];

                        if (beforeA[1] == inputS && beforeA[2] == inputE) {
                            // 内容判定
                            msg = '内容が変更されていません。';
                        } else {
                            if (inputS == '×' && inputE == '×') {
                                // 内容判定
                                msg = 'シフトより短い変更は、変更希望で提出してください。';
                            } else {
                                var shiftTimeSA = shiftDayA[1].split(/:/);
                                var shiftTimeEA = shiftDayA[2].split(/:/);
                                var inputSA     = inputS.split(/:/);
                                var inputEA     = inputE.split(/:/);

                                // 開始判定
                                if (
                                    (Number(inputSA[0]) > Number(shiftTimeSA[0])) || 
                                    (Number(inputSA[0]) == Number(shiftTimeSA[0]) && Number(inputSA[1]) > Number(shiftTimeSA[1]))
                                ) {
                                    msg = 'シフトより短い変更は、変更希望で提出してください。';
                                }

                                // 終了判定
                                if (
                                    (Number(inputEA[0]) < Number(shiftTimeEA[0])) || 
                                    (Number(inputEA[0]) == Number(shiftTimeEA[0]) && Number(inputEA[1]) < Number(shiftTimeEA[1]))
                                ) {
                                    msg = 'シフトより短い変更は、変更希望で提出してください。';
                                }
                            }
                        }
                    }
                });

                if (!selectDay && inputS == beforeA[1] && inputE == beforeA[2]) {
                    // 内容確認
                    msg = '内容が変更されていません。';
                }
            }

            if (msg) {
                common_text_entry({'innerText' : {'availableRequestMsg' : msg}});
            } else {
                selectDay = before.substring(0, 10);

                after = selectDay
                    + '_' + inputS
                    + '_' + inputE
                ;
                status = '可能日変更';

                const selectAvailableDay = document.getElementById("selectAvailableDay");
                Array.from(selectAvailableDay.querySelectorAll("option")).forEach(function(e) {
                    available = selectDay == e.value.substring(0, 10)
                        ? available ? available + ',' + after : after
                        : available ? available + ',' +  e.value : e.value
                    ;
                });
            }
            break;
    }

    if (!msg) {
        const result = window.confirm('変更希望の送信をしてよろしいですか？');
        if (result) {
            var paramDB = {
                'requestDt'     : common_date().yyyymmddhhmmss,
                'event'         : document.getElementById("eventName").innerText,
                'name'          : document.getElementById("displayName").innerText,
                'before'        : before,
                'after'         : after,
                'status'        : status,
                'available'     : available
            };
            opDB('registerShiftChangeInfo', paramDB);
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
                'event'         : document.getElementById("eventName").innerText,
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
                // 初期値
                common_text_entry({'innerText' : {'adminMsg' : ''}});

                if (this.readyState == 4 && this.status == 200) {
                    const result = this.responseText;

                    if (result == 'true') {
                        localStorage.setItem("adminUser", paramDB['inputAdminUser']);

                        window.location.reload();
                    } else {
                        common_text_entry({'innerText' : {'adminMsg' : '入力値が誤っています。'}});
                    }
                }
            }
            break;

        case 'getStaffListName':
            var param   = "function=" + "get_staff_list_name"
                + "&event=" + encodeURIComponent(paramDB['event']) 
                + "&mail="  + encodeURIComponent(paramDB['mail']) 
            ;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        common_text_entry({'innerText' : {'displayName' : data.name}});
                        common_op_view({
                            'block' : ['displayName'],
                            'none'  : ['formInfoOpen'],
                            'flex'  : ['eventInfoArea', 'selectItemArea']
                        });

                        // イベント情報の取得
                        var nextParam = {
                            'event' : paramDB['event'],
                        };
                        opDB('getEvent', nextParam);
                    } else {
                        common_op_view({
                            'flex'  : ['shiftLoginArea']
                        });
                    }
                }
            }
            break;

        case 'getEventListShift':
            var param   = "function=" + "get_event_list_shift";
            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_clear_children({
                    'all' : {
                        'selectEvent'       : 'option',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Object.keys(data).forEach(function(key) {
                        // イベント選択
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

        case 'getEvent':
            var param   = "function=" + "get_event"
                + "&event=" + encodeURIComponent(paramDB['event']) 
            ;

            xmlhttp.onreadystatechange = function() {
                    // 初期値
                    common_clear_children({
                        'all' : {
                            'shiftInfoHeader'   : '.sticky3',
                        },
                        'notId' : {
                            'formInfoHeader'    : 'th',
                        }
                    });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        // イベント情報
                        common_text_entry({
                            'innerText' : {
                                'eventName' : data.event,
                                'firstDay'  : data.first_day,
                                'endDay'    : data.end_day,
                                'startTime' : data.start_time,
                                'endTime'   : data.end_time,
                                'manager'   : '現場責任者：' + (data.manager ? data.manager : ''),
                            }
                        });

                        // 必要人数
                        var requiredNumÅ = [];
                        if (data.required_num) {
                            (data.required_num.split(/,/)).forEach(function(day) {
                                var dayA = day.split(/_/);
                                requiredNumÅ[dayA[0]] = dayA[1];
                            });
                        }

                        const firstDay  = data.first_day.split(/-/);
                        const endDay    = data.end_day.split(/-/);                    
                        for (
                            let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                            date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                            date.setDate(date.getDate() + 1)
                        ){
                            var day = date.toLocaleDateString('sv-SE');

                            // 応募状況
                            var formInfoTh = document.createElement("th");
                            common_set_element({
                                'element'   : formInfoTh,
                                'className' : "sticky3 " + common_getDOW(day).dowClass,
                                'innerHTML' : day + '<br>' + common_getDOW(day).dow,
                                'colSpan'   : '2',
                            });
                            document.getElementById("formInfoHeader").appendChild(formInfoTh);

                            // シフト
                            var shiftInfoTh = document.createElement("th");
                            common_set_element({
                                'element'   : shiftInfoTh,
                                'id'        : day + '_th',
                                'className' : "sticky3 " + common_getDOW(day).dowClass,
                                'colSpan'   : '2',
                            });
                            var shiftInfoB = document.createElement("button");
                            common_set_element({
                                'element'   : shiftInfoB,
                                'className' : 'shiftInfoB',
                                'innerHTML' : day + '<br>' + common_getDOW(day).dow,
                                'value'     : day,
                            });

                            // シフト：必要人数編集
                            var numB = document.createElement("input");
                            common_set_element({
                                'element'   : numB,
                                'id'        : day + '_inputNum',
                                'className' : 'numEdit shiftEdit',
                                'value'     : (day in requiredNumÅ ? requiredNumÅ[day] : 0),
                                'maxLength' : 5,
                                'display'   : 'none',
                            });

                            shiftInfoTh.appendChild(shiftInfoB);
                            shiftInfoTh.appendChild(numB);
                            document.getElementById("shiftInfoHeader").appendChild(shiftInfoTh);
                        }

                        // シフト情報の表示
                        getItem("shiftInfoOpen", data.event);
                    } else {
                        location.assign('shift.php');
                    }
                }
            }
            break;

        case 'getApplicationListALL':
            var param   = "function=" + "get_application_list_all"
                + "&event=" + encodeURIComponent(paramDB['event'])
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({'innerText' : {'formInfoMsg' : ''}});
                common_clear_children({
                    'notId' : {
                        'formInfoTable' : 'tr',
                    }
                });
                common_op_view({
                    'block' : ['editFormInfo'],
                    'none'  : ['cancelFormInfo', 'updateFormInfo']
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        // 顔写真
                        common_text_entry({'href' : {'photoList' : data.photoList}});

                        Object.keys(data.applicationList).forEach(function(key) {
                            var application = data.applicationList[key];

                            var tr = document.createElement("tr");
                            var tdClass = "";

                            // ステータス：表示
                            var status  = document.createElement("td");
                            var statusP = document.createElement("p");
                            common_set_element({
                                'element'       : statusP,
                                'className'     : "statusP",
                                'innerText'     : application.status,
                                'background'    : common_applicationStatus_color(application.status),
                            });
                            switch (application.status) {
                                case '不採用':
                                case '辞退':
                                case '不通':
                                case '無断蒸発':
                                        tdClass = "completed";
                                    break;
                            }
                            status.appendChild(statusP);

                            // 氏名
                            var name = document.createElement("td");
                            common_set_element({
                                'element'       : name,
                                'className'     : "sticky2 " + tdClass
                            });
                            var nameB = document.createElement("button");
                            common_set_element({
                                'element'   : nameB,
                                'className' : 'nameB',
                                'innerText' : application.no + '.' + application.name,
                                'value'     : application.event + ":" + application.mail,
                            });
                            name.appendChild(nameB);
                            tr.appendChild(name);

                            // ステータス：編集
                            var statusSelect = document.createElement("select");
                            var statusOption = ['応募受付', '保留', '不採用', '採用', '採用通知済み', '辞退', '不通', '追加済み', '無断蒸発'];
                            statusOption.forEach(function(o) {
                                var option = document.createElement("option");
                                common_set_element({
                                    'element'   : option,
                                    'text'      : o,
                                    'value'     : application.event + ":" + application.mail + ":" + o,
                                });
                                statusSelect.appendChild(option);
                            });
                            common_set_element({
                                'element'   : statusSelect,
                                'className' : 'statusS',
                                'value'     : application.event + ":" + application.mail + ":" + application.status,
                                'display'   : 'none',
                            });
                            common_set_element({
                                'element'   : status,
                                'className' : "sticky4 " + tdClass,
                            });
                            status.appendChild(statusSelect);
                            tr.appendChild(status);

                            // 応募メモ
                            var memo = document.createElement("td");
                            common_set_element({
                                'element'   : memo,
                                'className' : "textLeft " + tdClass,
                                'innerHTML' : (
                                    '応募：'
                                    + application.created_dt.slice(5, 11).replace('-', '/')
                                    + '<br>'
                                    + application.memo.replaceAll("\n", "<br>")
                                ),
                            });
                            tr.appendChild(memo);

                            // シフト希望
                            var availableA  = application.available.split(/,/);
                            availableA.forEach(function(d) {
                                var availablD = d.split(/_/);

                                var dowClass = common_getDOW(availablD[0]).dowClass;

                                var availableS = document.createElement("td");
                                common_set_element({
                                    'element'   : availableS,
                                    'className' : "rightBorder " + dowClass + " " + tdClass,
                                    'innerText' : availablD[1],
                                });
                                tr.appendChild(availableS);

                                var availableE = document.createElement("td");
                                common_set_element({
                                    'element'   : availableE,
                                    'className' : "leftBorder " + dowClass + " " + tdClass,
                                    'innerText' : availablD[2],
                                });
                                tr.appendChild(availableE);
                            });

                            document.getElementById("formInfoTable").querySelector("tbody").appendChild(tr);
                        });

                        common_op_view({
                            'flex' : ['formInfoArea'],
                        });
                    }
                }
            }
            break;

        case 'getApplicationInfo':
            var param   = "function=" + "get_application_Info"
                + "&event=" + encodeURIComponent(paramDB['event']) 
                + "&mail=" + encodeURIComponent(paramDB['mail']) 
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'formInfoName'              : '',
                        'formInfoMail'              : '',
                        'formInfoBirthday'          : '',
                        'formInfoAge'               : '',
                        'formInfoJob'               : '',
                        'formInfoTell'              : '',
                        'formInfoClosestStation'    : '',
                        'formInfoPlatform'          : '',
                        'formInfoCreatedDt'         : '',
                        'formInfoUpdatedDt'         : '',
                    },
                    'innerHTML' : {
                        'formInfoMemo'  : '',
                        'formInfoLog'   : '',
                    }
                });
                const a = document.getElementById("formInfoPlatformUrl").querySelector("a");
                common_set_element({
                    'element'   : a,
                    'innerText' : '',
                    'href'      : '',
                    'display'   : 'none',
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);
                    const application = data.application;

                    if (application) {
                        common_text_entry({
                            'innerText' : {
                                'formInfoName'              : application.name,
                                'formInfoMail'              : application.mail,
                                'formInfoBirthday'          : application.birthday,
                                'formInfoAge'               : common_getAge(application.birthday),
                                'formInfoJob'               : application.job,
                                'formInfoTell'              : application.tell,
                                'formInfoClosestStation'    : application.closest_station,
                                'formInfoPlatform'          : application.platform,
                                'formInfoCreatedDt'         : application.created_dt,
                                'formInfoUpdatedDt'         : application.updated_dt,
                            },
                            'innerHTML' : {
                                'formInfoMemo'  : application.memo.replaceAll("\n", "<br>"),
                                'formInfoLog'   : '・' + application.log.replaceAll(",", "<br>・"),
                            }
                        });
                        if (data.platform_url) {
                            common_set_element({
                                'element'   : a,
                                'innerText' : data.platform_url,
                                'href'      : data.platform_url,
                                'display'   : 'block',
                            });
                        }
                    }
                }
            }
            break;

        case 'updateApplicationStatus':
            var param   = "function=" + "update_application_status"
                + "&event=" + encodeURIComponent(paramDB['event']) 
                + "&updateList=" + encodeURIComponent(paramDB['updateList']) 
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');
                        var event = document.getElementById("eventName").innerText;

                        common_op_view({
                            'block' : ['editFormInfo'],
                            'none'  : ['cancelFormInfo', 'updateFormInfo']
                        });

                        getItem("formInfoOpen", event);
                    } else {
                        common_text_entry({'innerText' : {'formInfoMsg' : 'ステータス変更ができませんでした。'}});
                    }
                }
            }
            break;

        case 'getStaffListShift':
            var param   = "function=" + "get_staff_list_shift"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&booth=" + encodeURIComponent(paramDB['booth'])
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({'innerText' : {'shiftInfoMsg' : ''}});
                common_op_view({
                    'block' : ['editShiftInfo', 'selectBooth', 'printShiftInfo'],
                    'none'  : ['cancelShiftInfo', 'updateShiftInfo']
                });
                common_clear_children({
                    'all' : {
                        'shiftInfoHeader' : '.shiftInfoHeaderDisp',
                    },
                    'notId' : {
                        'shiftInfoTable' : 'tr',
                        'selectBooth'    : 'option',
                    }
                });
                const shiftInfoTr = document.getElementById("shiftInfoHeader");
                Array.from(shiftInfoTr.getElementsByClassName("numEdit")).forEach(function(e) {
                    e.style.display = 'none';
                });
 

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        const firstDay  = document.getElementById("firstDay").innerText.split(/-/);
                        const endDay    = document.getElementById("endDay").innerText.split(/-/);

                        // 更新日時
                        document.getElementById("shiftUpdatedDt").querySelector('span').innerText = data[0].shift_updated_dt;

                        // 必要人数
                        var requiredNumÅ = [];
                        if (data[0].required_num) {
                            (data[0].required_num.split(/,/)).forEach(function(day) {
                                var dayA = day.split(/_/);
                                requiredNumÅ[dayA[0]] = dayA[1];
                            });
                        }

                        let i = 0;
                        let sum = [];
                        let boothA = [];
                        data.forEach(function(staff) {

                            var tr1 = document.createElement("tr");
                            var tr2 = document.createElement("tr");

                            // 氏名
                            var name = document.createElement("td");
                            common_set_element({
                                'element'   : name,
                                'className' : "sticky2 textLeft",
                                'rowSpan'   : '2',
                            });
                            var nameB = document.createElement("button");
                            common_set_element({
                                'element'   : nameB,
                                'className' : "nameB",
                                'innerText' : staff.no + '.' + staff.name,
                                'value'     : paramDB['event'] + ':' + staff.mail,
                            });
                            name.appendChild(nameB);
                            tr1.appendChild(name);

                            // ブース
                            var booth = document.createElement("td");
                            common_set_element({
                                'element'   : booth,
                                'className' : "sticky4",
                                'rowSpan'   : '2',
                            });
                            var boothP = document.createElement("p");
                            common_set_element({
                                'element'   : boothP,
                                'className' : "shiftDisplay",
                                'innerText' : staff.booth,
                            });
                            booth.appendChild(boothP);  
                            if (staff.booth && !(boothA.includes(staff.booth))) {
                                boothA.push(staff.booth);
                            }

                            // ブース：編集
                            var boothS = document.createElement("input");
                            common_set_element({
                                'element'   : boothS,
                                'id'        : staff.no + '_boothS',
                                'className' : "boothEdit shiftEdit",
                                'value'     : staff.booth,
                                'maxLength' : 20,
                                'display'   : 'none',
                            });
                            booth.appendChild(boothS);  
                            tr1.appendChild(booth);

                            // シフト希望
                            var availableÅ = [];
                            if (staff.available) {
                                (staff.available.split(/,/)).forEach(function(day) {
                                    var dayA = day.split(/_/);
                                    availableÅ[dayA[0]] = [dayA[1], dayA[2]];
                                });
                            }

                            // シフト
                            var shiftÅ = [];
                            if (staff.shift) {
                                (staff.shift.split(/,/)).forEach(function(day) {
                                    var dayA = day.split(/_/);
                                    shiftÅ[dayA[0]] = [dayA[1], dayA[2]];
                                });
                            }

                            for (
                                let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                                date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                                date.setDate(date.getDate() + 1)
                            ){
                                var day = date.toLocaleDateString('sv-SE');
                                var dowClass = common_getDOW(day).dowClass;

                                var tr1S = document.createElement("td");
                                common_set_element({
                                    'element'   : tr1S,
                                    'className' : "rightBorder bottomBorder " + dowClass,
                                });
                                var tr1E = document.createElement("td");
                                common_set_element({
                                    'element'   : tr1E,
                                    'className' : "leftBorder bottomBorder " + dowClass,
                                });
                                var tr2B = document.createElement("td");
                                common_set_element({
                                    'element'   : tr2B,
                                    'className' : "rightBorder topBorder " + dowClass,
                                });
                                var tr2W = document.createElement("td");
                                common_set_element({
                                    'element'   : tr2W,
                                    'className' : "leftBorder topBorder " + dowClass,
                                });

                                var valueS = '-';
                                var valueE = '-';
                                var valueB = '-';
                                var valueW = '-';


                                if (i == 0) {
                                    sum[day] = 0;

                                    if (!(day in requiredNumÅ)) {
                                        requiredNumÅ[day] = 0;
                                    }

                                    var dayth = document.getElementById(day + '_th');

                                    // 合計人数
                                    var numP = document.createElement("p");
                                    common_set_element({
                                        'element'   : numP,
                                        'id'        : "totalNum_" + day,
                                        'className' : "numP shiftDisplay shiftInfoHeaderDisp",
                                    });

                                    // 必要人数：編集
                                    common_set_element({
                                        'element'   : document.getElementById(day + '_inputNum'),
                                        'value'     : requiredNumÅ[day],
                                    });

                                    // 説明
                                    var textD = document.createElement("div");
                                    common_set_element({
                                        'element'   : textD,
                                        'className' : 'textDiv shiftInfoHeaderDisp',
                                    });
                                    var text1 = document.createElement("p");
                                    common_set_element({
                                        'element'   : text1,
                                        'className' : "shiftDisplay rightBorder bottomBorder " + dowClass,
                                        'innerText' : '出勤',
                                    });
                                    var text2 = document.createElement("p");
                                    common_set_element({
                                        'element'   : text2,
                                        'className' : "shiftDisplay leftBorder bottomBorder " + dowClass,
                                        'innerText' : '退勤',
                                    });
                                    var text3 = document.createElement("p");
                                    common_set_element({
                                        'element'   : text3,
                                        'className' : "shiftDisplay rightBorder topBorder " + dowClass,
                                        'innerText' : '休憩',
                                    });
                                    var text4 = document.createElement("p");
                                    common_set_element({
                                        'element'   : text4,
                                        'className' : "shiftDisplay leftBorder topBorder " + dowClass,
                                        'innerText' : '実働',
                                    });
                                    textD.appendChild(text1);
                                    textD.appendChild(text2);
                                    textD.appendChild(text3);
                                    textD.appendChild(text4);

                                    dayth.appendChild(numP);
                                    dayth.appendChild(textD);
                                }

                                // シフト：開始
                                var startP = document.createElement("p");
                                if (day in shiftÅ && 0 in shiftÅ[day] && shiftÅ[day][0] !== '×') {
                                    valueS = shiftÅ[day][0];
                                }
                                common_set_element({
                                    'element'   : startP,
                                    'className' : 'shiftDisplay',
                                    'innerText' : valueS,
                                });
                                tr1S.appendChild(startP);

                                // シフト：終了
                                var endP = document.createElement("p");
                                if (day in shiftÅ && 1 in shiftÅ[day] && shiftÅ[day][1] !== '×') {
                                    valueE = shiftÅ[day][1];
                                }
                                common_set_element({
                                    'element'   : endP,
                                    'className' : 'shiftDisplay',
                                    'innerText' : valueE,
                                });
                                tr1E.appendChild(endP);

                                // 時間計算
                                if (valueS !== '-' && valueE !== '-') {
                                    var shiftTime = common_shift_time(day, valueS, valueE);
                                    valueB = shiftTime.breakTime;
                                    valueW = shiftTime.workTime;
                                }

                                // シフト：休憩
                                var breakP = document.createElement("p");
                                common_set_element({
                                    'element'   : breakP,
                                    'className' : 'shiftDisplay',
                                    'innerText' : valueB,
                                });
                                tr2B.appendChild(breakP);

                                // シフト：実働
                                var workP = document.createElement("p");
                                common_set_element({
                                    'element'       : workP,
                                    'className'     : 'shiftDisplay',
                                    'innerText'     : valueW,
                                    'fontWeight'    : (valueW != '-' ? 'bold': 'normal'),
                                });
                                tr2W.appendChild(workP);

                                // シフト希望：開始
                                var availableS = document.createElement("p");
                                common_set_element({
                                    'element'   : availableS,
                                    'className' : 'shiftEdit',
                                    'innerText' : (
                                        day in availableÅ
                                            ? 0 in availableÅ[day]
                                                ? availableÅ[day][0]
                                                : "-"
                                            : "-"
                                    ),
                                    'display'   : 'none',
                                });
                                tr1S.appendChild(availableS);

                                // シフト希望：終了
                                var availableE = document.createElement("p");
                                common_set_element({
                                    'element'   : availableE,
                                    'className' : 'shiftEdit',
                                    'innerText' : (
                                        day in availableÅ
                                            ? 1 in availableÅ[day]
                                                ? availableÅ[day][1]
                                                : "-"
                                            : "-"
                                    ),
                                    'display'   : 'none',
                                });
                                tr1E.appendChild(availableE);

                                // シフト編集：開始
                                var inputS = document.createElement("input");
                                common_set_element({
                                    'element'   : inputS,
                                    'id'        : staff.no + '_' + day + '_inputS',
                                    'className' : 'shiftEdit',
                                    'value'     : (valueS == '-' ? '' : valueS),
                                    'display'   : 'none',
                                    'maxLength' : 5,
                                });
                                tr1S.appendChild(inputS);

                                // シフト編集：終了
                                var inputE = document.createElement("input");
                                common_set_element({
                                    'element'   : inputE,
                                    'id'        : staff.no + '_' + day + '_inputE',
                                    'className' : 'shiftEdit',
                                    'value'     : (valueE == '-' ? '' : valueE),
                                    'display'   : 'none',
                                    'maxLength' : 5,
                                });
                                tr1E.appendChild(inputE);

                                // 合計人数の加算
                                if (valueW != '-' && valueW != '0:00') {
                                    // 合計人数の加算
                                    sum[day] = sum[day] + 1;
                                }


                                tr1.appendChild(tr1S);
                                tr1.appendChild(tr1E);
                                tr2.appendChild(tr2B);
                                tr2.appendChild(tr2W);
                            }

                            document.getElementById("shiftInfoTable").querySelector("tbody").appendChild(tr1);
                            document.getElementById("shiftInfoTable").querySelector("tbody").appendChild(tr2);

                            i++;
                        });

                        // ブース
                        boothA.forEach(function(booth) {
                            var option = document.createElement("option");
                            common_set_element({
                                'element'   : option,
                                'text'      : booth,
                                'value'     : booth,
                                'selected'  : (booth == paramDB['booth'] ? 'true' : ''),
                            });
                            document.getElementById("selectBooth").appendChild(option);
                        });

                        // 合計人数
                        const adminUser = window.localStorage.getItem("adminUser");
                        for (let key in sum) {
                            var clacNum = Number(sum[key]) - Number(requiredNumÅ[key]);

                            if (adminUser) {
                                common_set_element({
                                    'element'   : document.getElementById("totalNum_" + key),
                                    'innerHTML' : 
                                        '必要:'+ requiredNumÅ[key] + '<br>'
                                        + '出:' + sum[key]
                                        + ' 差:' + clacNum,
                                });
                            } else {
                                common_set_element({
                                    'element'   : document.getElementById("totalNum_" + key),
                                    'display'   : 'none',
                                });
                            }
                        }
                    }
                }
            }
            break;

        case 'updateStaffListShift':
            var param   = "function=" + "update_staff_list_shift"
                + "&event=" + encodeURIComponent(paramDB['event']) 
                + "&updateList=" + encodeURIComponent(paramDB['updateList'])
                + "&updateNum="  + encodeURIComponent(paramDB['updateNum'])
                + "&shiftUpdatedDt=" + encodeURIComponent(paramDB['shiftUpdatedDt'])
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({'innerText' : {'shiftInfoMsg' : ''}});


                if (this.readyState == 4 && this.status == 200) {
                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        var event = document.getElementById("eventName").innerText;

                        common_op_view({
                            'block' : ['editShiftInfo', 'selectBooth', 'printShiftInfo'],
                            'none'  : ['cancelShiftInfo', 'updateShiftInfo']
                        });

                        getItem("shiftInfoOpen", event);
                    } else {
                        common_text_entry({'innerText' : {'shiftInfoMsg' : 'シフト変更ができませんでした。'}});
                    }
                }
            }
            break;

        case 'getShiftChangeList':
            var param   = "function=" + "get_shift_change_list"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&name="  + encodeURIComponent(paramDB['name']) 
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'shiftChangeInfoMsg'        : '',
                        'shiftChangeInfoRequestMsg' : '',
                        'availableRequestMsg'       : '',
                    }
                });
                common_clear_children({
                    'notId' : {
                        'shiftChangeInfoTable' : 'tr',
                    }
                });
                common_set_element({
                    'element'       : document.getElementById('approveShiftChangeInfo'),
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });
                common_set_element({
                    'element'       : document.getElementById('rejectWorkShiftChangeInfo'),
                    'value'         : 'false',
                    'color'         : '#000',
                    'background'    : '#fff',
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        Object.keys(data).forEach(function(key) {
                            var shiftBeforeA = data[key].shift_before.split(/_/);
                            var shiftAfterA  = data[key].shift_after.split(/_/);

                            var tr = document.createElement("tr");
                            var tdClass = "";
                            switch (data[key].status) {
                                case '却下済':
                                case '承認済':
                                case '可能日変更':
                                        tdClass = "completed";
                                    break;
                            }

                            // 申請日時
                            var requestDt = document.createElement("td");
                            common_set_element({
                                'element'       : requestDt,
                                'className'     : "sticky2 " + tdClass,
                                'innerText'     : data[key].request_dt,
                            });
                            tr.appendChild(requestDt);

                            // 氏名
                            var name = document.createElement("td");
                            common_set_element({
                                'element'       : name,
                                'className'     : "sticky4 " + tdClass,
                                'innerText'     : data[key].name,
                            });
                            tr.appendChild(name);

                            // ステータス
                            var status = document.createElement("td");
                            common_set_element({
                                'element'       : status,
                                'className'     : tdClass,
                            });
                            var statusB = document.createElement("button");
                            common_set_element({
                                'element'       : statusB,
                                'className'     : 'selectStatusB',
                                'innerText'     : data[key].status,
                                'value'         : (
                                    data[key].request_dt
                                    + ',' + paramDB['event'] 
                                    + ',' + data[key].name
                                    + ',' + shiftAfterA[0]
                                    + ',' + data[key].shift_after
                                ),
                                'background'    : common_shiftChangeStatus_color(data[key].status),
                            });
                            status.appendChild(statusB);
                            tr.appendChild(status);

                            // 対象日
                            var day = document.createElement("td");
                            common_set_element({
                                'element'       : day,
                                'className'     : tdClass,
                                'innerText'     : shiftBeforeA[0],
                            });
                            tr.appendChild(day);

                            // 変更前
                            var before = document.createElement("td");
                            common_set_element({
                                'element'       : before,
                                'className'     : tdClass,
                                'innerText'     : shiftBeforeA[1] + ' - ' + shiftBeforeA[2],
                            });
                            tr.appendChild(before);

                            // 変更後
                            var after = document.createElement("td");
                            common_set_element({
                                'element'       : after,
                                'className'     : tdClass,
                                'innerText'     : shiftAfterA[1] + ' - ' + shiftAfterA[2],
                            });
                            tr.appendChild(after);

                            // 処理日
                            var approvalD = document.createElement("td");
                            common_set_element({
                                'element'       : approvalD,
                                'className'     : tdClass,
                                'innerText'     : data[key].approval_d,
                            });
                            tr.appendChild(approvalD);

                            document.getElementById("shiftChangeInfoTable").querySelector("tbody").appendChild(tr);
                        });
                    }
                }
            }
            break;

        case 'getShiftChangeListSelect':
            var param   = "function=" + "get_shift_change_list_select"
                + "&event=" + encodeURIComponent(paramDB['event'])
                + "&name="  + encodeURIComponent(paramDB['name']) 
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_clear_children({
                    'all' : {
                        'shiftChangeInfoRequest' : 'option',
                        'availableRequest'       : 'option',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {

                        // シフト
                        if (data.shift) {
                            const shiftA = data.shift.split(/\,/);
                            Array.from(shiftA).forEach(function(day) {
                                if (!(day.includes('×'))) {
                                    var dayA =  day.split(/_/);

                                    var option = document.createElement("option");
                                    common_set_element({
                                        'element'   : option,
                                        'text'      : dayA[0] + ' ' + dayA[1] + ' - ' + dayA[2],
                                        'value'     : day,
                                    });
                                    document.getElementById("selectShiftDay").appendChild(option);
                                } 
                            });
                        } else {
                            common_op_view({
                                'none'  : ['shiftChangeInfoRequest']
                            });
                        }


                        // 出勤可能日
                        if (data.available) {
                            const availableA = data.available.split(/\,/);
                            Array.from(availableA).forEach(function(day) {
                                var dayA =  day.split(/_/);

                                var option = document.createElement("option");
                                common_set_element({
                                    'element'   : option,
                                    'text'      : dayA[0] + ' ' + dayA[1] + ' - ' + dayA[2],
                                    'value'     : day,
                                });
                                document.getElementById("selectAvailableDay").appendChild(option);
                            }); 
                        } else {
                            common_op_view({
                                'none'  : ['availableRequest']
                            });
                        }

                        // 時間
                        const startTimeA = document.getElementById("startTime").innerText.split(/:/);
                        const endTimeA   = document.getElementById("endTime").innerText.split(/:/);
                        const selectShiftAfterS     = document.getElementById("selectShiftAfterS");
                        const selectShiftAfterE     = document.getElementById("selectShiftAfterE");
                        const selectAvailableAfterS = document.getElementById("selectAvailableAfterS");
                        const selectAvailableAfterE = document.getElementById("selectAvailableAfterE");

                        var optionSS = document.createElement("option");
                        common_set_element({
                            'element'   : optionSS,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        selectShiftAfterS.appendChild(optionSS);

                        var optionSE = document.createElement("option");
                        common_set_element({
                            'element'   : optionSE,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        selectShiftAfterE.appendChild(optionSE);

                        var optionAS = document.createElement("option");
                        common_set_element({
                            'element'   : optionAS,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        selectAvailableAfterS.appendChild(optionAS);

                        var optionAE = document.createElement("option");
                        common_set_element({
                            'element'   : optionAE,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        selectAvailableAfterE.appendChild(optionAE);

                        for (let h = Number(startTimeA[0]); h <= Number(endTimeA[0]); h++) {
                            var startM  = 0;
                            var endM    = 45;
                            if (h == Number(startTimeA[0])) {
                                startM = Number(startTimeA[1]);
                            }
                            if (h == Number(endTimeA[0])) {
                                endM = Number(endTimeA[1]);
                            }

                            for (let m = startM; m <= endM; m += 15) {
                                var time = h + ':' + m.toString().padStart(2, '0');

                                var optionSS = document.createElement("option");
                                common_set_element({
                                    'element'   : optionSS,
                                    'text'      : time,
                                    'value'     : time,
                                });
                                selectShiftAfterS.appendChild(optionSS);

                                var optionSE = document.createElement("option");
                                common_set_element({
                                    'element'   : optionSE,
                                    'text'      : time,
                                    'value'     : time,
                                });
                                selectShiftAfterE.appendChild(optionSE);

                                var optionAS = document.createElement("option");
                                common_set_element({
                                    'element'   : optionAS,
                                    'text'      : time,
                                    'value'     : time,
                                });
                                selectAvailableAfterS.appendChild(optionAS);

                                var optionAE = document.createElement("option");
                                common_set_element({
                                    'element'   : optionAE,
                                    'text'      : time,
                                    'value'     : time,
                                });
                                selectAvailableAfterE.appendChild(optionAE);
                            }
                        }
                    }
                }
            }
            break;

        case 'updateShiftChangeInfo':
            var param = "function=" + "update_shift_change_list"
                + "&statusAfter="   + encodeURIComponent(paramDB.statusAfter)
                + "&requestDt="     + encodeURIComponent(paramDB.requestDt)
                + "&event="         + encodeURIComponent(paramDB.event)
                + "&name="          + encodeURIComponent(paramDB.name)
                + "&day="           + encodeURIComponent(paramDB.day)
                + "&after="         + encodeURIComponent(paramDB.dataAfter)
                + "&approvalD="     + encodeURIComponent(common_date().yyyymmdd)
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({'innerText' : {'shiftChangeInfoMsg' : ''}});


                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        var event = document.getElementById("eventName").innerText;

                        common_set_element({
                            'element'       : document.getElementById('approveShiftChangeInfo'),
                            'value'         : 'false',
                            'color'         : '#000',
                            'background'    : '#fff',
                        });
                        common_set_element({
                            'element'       : document.getElementById('rejectWorkShiftChangeInfo'),
                            'value'         : 'false',
                            'color'         : '#000',
                            'background'    : '#fff',
                        });

                        getItem("shiftChangeInfoOpen", event);
                    } else {
                        common_text_entry({'innerText' : {'shiftChangeInfoMsg' : 'ステータス変更ができませんでした。'}});
                    }
                }
            }
            break;

        case 'checkShiftChangeList':
            var param   = "function=" + "check_shift_change_list"
                + "&event=" + encodeURIComponent(paramDB['event'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    var animeShiftChangeInfo = document.getElementById("shiftChangeInfoOpen").animate(
                        [{ borderColor : '#000' }, { borderColor : '#fff' }],
                        { duration: 2000, iterations: Infinity }
                    );
                    animeShiftChangeInfo.cancel();

                    if (this.response >= 1) {
                        animeShiftChangeInfo.play();
                    } else {
                        animeShiftChangeInfo.currentTime = 0;
                    }
                }
            }
            break;

        case 'registerShiftChangeInfo':
            var param = "function=" + "register_shift_change_list"
                + "&requestDt="     + encodeURIComponent(paramDB.requestDt)
                + "&event="         + encodeURIComponent(paramDB.event)
                + "&name="          + encodeURIComponent(paramDB.name)
                + "&day="           + encodeURIComponent(paramDB.day)
                + "&before="        + encodeURIComponent(paramDB.before)
                + "&after="         + encodeURIComponent(paramDB.after)
                + "&status="        + encodeURIComponent(paramDB.status)
                + "&available="     + encodeURIComponent(paramDB.available)                
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // 初期値
                    common_text_entry({
                        'innerText' : {
                            'shiftChangeInfoRequestMsg' : '',
                            'availableRequestMsg'       : '',
                        }
                    });


                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        var event = document.getElementById("eventName").innerText;
                        getItem("shiftChangeInfoOpen", event);
                    } else {
                        var msg = '変更希望の登録ができませんでした。'

                        if (paramDB.available) {
                            common_text_entry({'innerText' : {'shiftChangeInfoRequestMsg' : msg}});
                        } else {
                            common_text_entry({'innerText' : {'availableRequestMsg' : msg}});
                        }
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

                        var event = document.getElementById("eventName").innerText;

                        common_text_entry({
                            'innerText' : {
                                'addStaffMsg' : '',
                            },
                            'value' : {
                                'addStaffName'      : '',
                                'addStaffMail'      : '',
                                'addStaffBirthday'  : 'yyyymmdd',
                            }
                        });

                        getItem("shiftInfoOpen", event);
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

        }

    xmlhttp.open("POST", strUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}
