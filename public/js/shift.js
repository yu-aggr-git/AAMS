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
        document.getElementById("modal").style.display = 'none';
        document.getElementById("adminLogin").style.display = 'none';
        document.body.style.overflow = 'visible';
    }
    document.getElementById("closeStaffLogin").onclick = function() {
        document.getElementById("modal").style.display = 'none';
        document.getElementById("staffLogin").style.display = 'none';
        document.body.style.overflow = 'visible';
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
        document.getElementById("modal").style.display = 'none';
        document.getElementById("formNameInfo").style.display = 'none';
        document.body.style.overflow = 'visible';
    }

    // 応募者ステータスの編集
    document.getElementById("editFormInfo").onclick = function() {
        editStatus();
    }
    document.getElementById("cancelFormInfo").onclick = function() {
        var event = document.getElementById("eventName").innerText;

        document.getElementById("formInfoMsg").innerText = '';
        document.getElementById("editFormInfo").style.display = "block";
        document.getElementById("cancelFormInfo").style.display = "none";
        document.getElementById("updateFormInfo").style.display = "none";
        getItem("formInfoOpen", event);
    }
    
    // シフトの編集
    document.getElementById("editShiftInfo").onclick = function() {
        editShift();
    }
    document.getElementById("cancelShiftInfo").onclick = function() {
        var event = document.getElementById("eventName").innerText;

        document.getElementById("shiftInfoMsg").innerText = '';
        document.getElementById("editShiftInfo").style.display = "block";
        document.getElementById("cancelShiftInfo").style.display = "none";
        document.getElementById("updateShiftInfo").style.display = "none";
        document.getElementById("selectBooth").style.display = "block";
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
        document.getElementById("modal").style.display = 'none';
        document.getElementById("shiftDayInfo").style.display = 'none';
        document.body.style.overflow = 'visible';
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

}



// ──────────────────────────────────────────────────────
//  管理者判定
// ………………………………………………………………………………………………………………………………………………

function checkAdmin() {
    const adminUser = window.localStorage.getItem("adminUser");
    const staffUser = window.localStorage.getItem("staffUser");

    if (adminUser) {
        document.getElementById("adminLogout").style.display     = 'block';
        document.getElementById("selectEventArea").style.display = 'flex';
        document.getElementById("eventInfoArea").style.display   = 'flex';
        
        // イベント取得
        opDB('getEventListShift');
    } else {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        if (staffUser && params.get('event')) {
            // 名前の取得
            var paramDB = {
                'event' : params.get('event'),
                'mail'  : staffUser
            }; 
            opDB('getStaffListName', paramDB);
        } else {
            document.getElementById("shiftLoginArea").style.display  = 'flex';
        }
    }
}



// ──────────────────────────────────────────────────────
//  ログイン
// ………………………………………………………………………………………………………………………………………………

function login(id) {
    document.getElementById("staffLoginMsg").innerText = '';
    document.getElementById("adminMsg").innerText = '';

    switch (id) {
        case 'loginStaff':
            document.getElementById("modal").style.display      = 'flex';
            document.getElementById("staffLogin").style.display = 'flex';
            document.body.style.overflow                        = 'hidden';

            // イベントリストの取得
            opDB('getEventListShift', null);

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
            break;
    
        case 'loginAdmin':
            document.getElementById("modal").style.display      = 'flex';
            document.getElementById("adminLogin").style.display = 'flex';
            document.body.style.overflow                        = 'hidden';

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
            break;
    }

}



// ──────────────────────────────────────────────────────
//  イベント選択
// ………………………………………………………………………………………………………………………………………………

function eventSelect() {
    document.getElementById("selectItemArea").style.display = 'flex';

    var selectEvent = document.getElementById("selectEvent").value;
    var paramDB = {
        'event' : selectEvent
    };

    // イベント情報の取得
    opDB('getEvent', paramDB);

    // シフト情報の表示
    getItem("shiftInfoOpen", selectEvent);
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


    switch (id) {
        case 'shiftInfoOpen':
            if (shiftInfoValue == 'false') {
                document.getElementById("shiftInfoArea").style.display = 'flex';
                shiftInfo.value = 'true';
                shiftInfo.style.color = '#fff';
                shiftInfo.style.background = '#dc4618ff';

                document.getElementById("formInfoArea").style.display = 'none';
                formInfo.value = 'false';
                formInfo.style.color = '#000';
                formInfo.style.background = '#fff';

                document.getElementById("shiftChangeInfoArea").style.display = 'none';
                shiftChangeInfo.value = 'false';
                shiftChangeInfo.style.color = '#000';
                shiftChangeInfo.style.background = '#fff';
            }

            if (adminUser) {
                document.getElementById("addStaff").style.display = 'flex';
            }

            // シフトの取得
            paramDB['booth'] = 'ALL';
            opDB('getStaffListShift', paramDB);

            break;

        case 'shiftChangeInfoOpen':
            if (shiftChangeInfoValue == 'false') {
                document.getElementById("shiftChangeInfoArea").style.display = 'flex';
                shiftChangeInfo.value = 'true';
                shiftChangeInfo.style.color = '#fff';
                shiftChangeInfo.style.background = '#dc4618ff';

                document.getElementById("shiftInfoArea").style.display = 'none';
                shiftInfo.value = 'false';
                shiftInfo.style.color = '#000';
                shiftInfo.style.background = '#fff';

                document.getElementById("formInfoArea").style.display = 'none';
                formInfo.value = 'false';
                formInfo.style.color = '#000';
                formInfo.style.background = '#fff';
            }

            // シフト変更希望の取得
            paramDB['name'] = adminUser
                ? 'ALL' 
                : document.getElementById("displayName").innerText
            ;
            opDB('getShiftChangeList', paramDB);


            if (!adminUser) {
                document.getElementById("shiftChangeInfoRequest").style.display = 'flex';
                document.getElementById("availableRequest").style.display = 'flex';

                opDB('getShiftChangeListSelect', paramDB);
            }

            break;

        case 'formInfoOpen':
            if (formInfoValue == 'false') {
                document.getElementById("formInfoArea").style.display = 'flex';
                formInfo.value = 'true';
                formInfo.style.color = '#fff';
                formInfo.style.background = '#dc4618ff';

                document.getElementById("shiftInfoArea").style.display = 'none';
                shiftInfo.value = 'false';
                shiftInfo.style.color = '#000';
                shiftInfo.style.background = '#fff';

                document.getElementById("shiftChangeInfoArea").style.display = 'none';
                shiftChangeInfo.value = 'false';
                shiftChangeInfo.style.color = '#000';
                shiftChangeInfo.style.background = '#fff';
            }

            // 応募情報の取得
            if (adminUser) {
                opDB('getApplicationListALL', paramDB);
            }
            break;
    }

    // 管理者判定
    if (!adminUser) {
        document.getElementById("shiftInfoMenu").style.display       = 'none';
        document.getElementById("shiftChangeInfoMenu").style.display = 'none';
    }

}



// ──────────────────────────────────────────────────────
//  応募者詳細の取得
// ………………………………………………………………………………………………………………………………………………

function getFormNameInfo(value) {
    const adminUser = window.localStorage.getItem("adminUser");

    if (adminUser) {
        document.getElementById("modal").style.display = 'flex';
        document.getElementById("formNameInfo").style.display = 'flex';
        document.body.style.overflow = 'hidden';

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
    document.getElementById("formInfoMsg").innerText = '';

    document.getElementById("editFormInfo").style.display = "none";
    document.getElementById("cancelFormInfo").style.display = "block";
    document.getElementById("updateFormInfo").style.display = "block";

    // pタグ非表示
    const statusP = document.querySelectorAll('.statusP');
    statusP.forEach(function(e) {
        e.style.display = 'none';
    });

    // selectタグ非表示
    let applicationStatus = [];
    const statusS = document.querySelectorAll('.statusS');
    statusS.forEach(function(e) {
        e.style.display = 'block';

        var valueA =  e.value.split(/:/);
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
    
};



// ──────────────────────────────────────────────────────
//  シフトの編集
// ………………………………………………………………………………………………………………………………………………

function editShift() {
    document.getElementById("shiftInfoMsg").innerText = '';
    document.getElementById("editShiftInfo").style.display = "none";
    document.getElementById("cancelShiftInfo").style.display = "block";
    document.getElementById("updateShiftInfo").style.display = "block";
    document.getElementById("selectBooth").style.display = "none";

    const shiftInfoTable = document.getElementById("shiftInfoTable");

    // pタグ非表示
    Array.from(shiftInfoTable.getElementsByClassName("shiftDisplay")).forEach(function(e) {
        e.style.display = 'none';
    });

    // inputタグの表示
    Array.from(shiftInfoTable.getElementsByClassName("shiftEdit")).forEach(function(e) {
        e.style.display = 'block';
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
            const regex = /\d{1,2}:\d{2}/;
            const minutes = ['00', '15', '30', '45'];
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
                    var time = e.value == '' ? '×' : replaceStr(e.value);

                    if (time != '×' && !(regex.test(time))) {
                        // 形式チェック
                        emsg = '「hh:mm形式」かつ「15分単位」で入力してください。';
                        document.getElementById(e.id).style.borderColor = '#ff0000';  
                    } else {
                        var timeA = time.split(/:/);

                        // 単位チェック
                        if (time != '×' && !(minutes.includes(timeA[1]))) {
                            emsg = '「hh:mm形式」かつ「15分単位」で入力してください。';
                            document.getElementById(e.id).style.borderColor = '#ff0000';  
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
                document.getElementById("shiftInfoMsg").innerText = emsg;
            } else {
                // 更新実行
                if (updateShift.length === 0) {
                    document.getElementById("cancelShiftInfo").click();
                } else {
                    var paramDB = {
                        'event'             : event,
                        'updateList'        : updateShift,
                        'updateNum'         : updateNum,
                        'shiftUpdatedDt'    : date().yyyymmddhhmmss
                    };
                    opDB('updateStaffListShift', paramDB);
                }
            }
        }
    }
};



// ──────────────────────────────────────────────────────
//  シフト変更希望の操作
// ………………………………………………………………………………………………………………………………………………

function shiftChangeInfoEdit(id) {
    document.getElementById("shiftChangeInfoMsg").innerText = '';

    const approve       = document.getElementById('approveShiftChangeInfo');
    const approveValue  = approve.value;
    const reject        = document.getElementById('rejectWorkShiftChangeInfo');
    const rejectValue   = reject.value;
    
    switch (id) {
        case 'approveShiftChangeInfo':
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
    
        case 'rejectWorkShiftChangeInfo':
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
                        // opDB('updateShiftChangeInfo', paramDB);
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
    document.getElementById("modal").style.display = 'flex';
    document.getElementById("shiftDayInfo").style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const tbl = document.getElementById("shiftDayInfoTable").querySelector("tbody");
    Array.from(tbl.querySelectorAll("tr")).forEach(function(e) {
        if (!e.id) {
            e.remove();
        }
    });

    const shiftDayInfoHeader = document.getElementById("shiftDayInfoHeader");
    Array.from(shiftDayInfoHeader.querySelectorAll("th")).forEach(function(e) {
        if (!e.id) {
            e.remove();
        }
    });

    let displayDay = [];
    Array.from(shiftInfoTable.querySelectorAll("input")).forEach(function(e) {
        var idA = e.id.split(/_/);
        var no  = idA[0];
        var day = idA[1];
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
        th.innerText = key;
        th.className = 'sticky2';
        shiftDayInfoHeader.appendChild(th);

        // 表示時間
        var timeA = displayDay[key].split(/_/);
        var timeSH = Number(timeA[0].split(/:/)[0]);
        var timeEH = Number(timeA[1].split(/:/)[0]);
        startTimeH  = startTimeH < timeSH ? startTimeH : timeSH;
        endTimeH    = endTimeH > timeEH ? endTimeH : timeEH;
    }

    for (let h = Number(startTimeH); h <= Number(endTimeH); h++) {
         
        for (let m = 0; m <= 45; m += 15) {
            var tr = document.createElement("tr");

            // 時間
            var th = document.createElement("th");
            th.innerText = h + ':' + m.toString().padStart(2, '0');
            th.className = 'sticky3';
            tr.appendChild(th);

            // スタッフ
            displayDay.forEach(function(time) {
                var timeA = time.split(/_/);
                var startA = timeA[0].split(/:/);
                var endA   = timeA[1].split(/:/);

                var td = document.createElement("td");
                td.innerText = "　";
                if (
                    h >= Number(startA[0]) &&
                    (
                        h < Number(endA[0]) || 
                        (h == Number(endA[0]) && m <= Number(endA[1]))
                    )
                ) {
                    td.style.background = "#fff000";
                }
                tr.appendChild(td);
            });


            tbl.appendChild(tr);
        }
    }
};



// ──────────────────────────────────────────────────────
//  シフト変更希望の提出
// ………………………………………………………………………………………………………………………………………………

function registerShiftChangeInfo(id) {
    document.getElementById("shiftChangeInfoRequestMsg").innerText = '';
    document.getElementById("availableRequestMsg").innerText = '';

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
                document.getElementById("shiftChangeInfoRequestMsg").innerText = msg;
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
                var beforeA = before.split(/_/);
                
                const selectShiftDay = document.getElementById("selectShiftDay");
                let selectDay = '';
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

                if (!selectDay && inputS == '×' && inputE == '×') {
                    // 内容確認
                    msg = '内容が変更されていません。';
                }
            }

            if (msg) {
                document.getElementById("availableRequestMsg").innerText = msg;
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
                'requestDt'     : date().yyyymmddhhmmss,
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

                        location.assign('shift.php?event=' + encodeURI(paramDB['inputStaffEventName']));
                    } else {
                        msg = '入力値が誤っています。';
                    }
                    document.getElementById("staffLoginMsg").innerHTML = msg;
                }
            }
            break;

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

        case 'getStaffListName':
            var param   = "function=" + "get_staff_list_name"
                + "&event=" + encodeURIComponent(paramDB['event']) 
                + "&mail="  + encodeURIComponent(paramDB['mail']) 
            ;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        document.getElementById("displayName").innerText  = data.name;
                        document.getElementById("displayName").style.display  = 'block';

                        // イベント情報の取得
                        document.getElementById("eventInfoArea").style.display   = 'flex';
                        var nextParam = {
                            'event' : paramDB['event'],
                        };           
                        opDB('getEvent', nextParam);

                        // 項目の表示
                        document.getElementById("formInfoOpen").style.display   = 'none';
                        document.getElementById("selectItemArea").style.display = 'flex';

                        // シフト情報の表示
                        getItem("shiftInfoOpen", paramDB['event']);
                    } else {
                        document.getElementById("shiftLoginArea").style.display  = 'flex';
                    }
                }
            }
            break;

        case 'getEventListShift':
            var param   = "function=" + "get_event_list_shift";
            xmlhttp.onreadystatechange = function() {

                // イベント選択
                const selectEvent = document.getElementById("selectEvent");
                Array.from(selectEvent.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                // スタッフログイン選択
                const staffEventName = document.getElementById("staffEventName");
                Array.from(staffEventName.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Object.keys(data).forEach(function(key) {
                        // イベント選択
                        var option = document.createElement("option");
                        option.text = data[key];
                        option.value = data[key];
                        selectEvent.appendChild(option);

                        // スタッフログイン選択
                        var option2 = document.createElement("option");
                        option2.text = data[key];
                        option2.value = data[key];
                        staffEventName.appendChild(option2);
                    });                    
                }
            }
            break;

        case 'getEvent':
            var param   = "function=" + "get_event"
                + "&event=" + encodeURIComponent(paramDB['event']) 
            ;

            xmlhttp.onreadystatechange = function() {
    
                    // 応募状況
                    const formInfoTr = document.getElementById("formInfoHeader");
                    Array.from(formInfoTr.querySelectorAll("th")).forEach(function(e) {
                        if (!e.id) {
                            e.remove();
                        }
                    });

                    // シフト
                    const shiftInfoTr = document.getElementById("shiftInfoHeader");
                    Array.from(shiftInfoTr.getElementsByClassName("sticky3")).forEach(function(e) {
                        e.remove();
                    });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        // イベント情報
                        document.getElementById("eventName").innerText  = data.event;
                        document.getElementById("firstDay").innerText   = data.first_day;
                        document.getElementById("endDay").innerText     = data.end_day;
                        document.getElementById("startTime").innerText  = data.start_time;
                        document.getElementById("endTime").innerText    = data.end_time;
                        
                        const firstDay  = data.first_day.split(/-/);
                        const endDay    = data.end_day.split(/-/);                    
                        for (
                            let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                            date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                            date.setDate(date.getDate() + 1)
                        ){
                            var day = date.toLocaleDateString('sv-SE');

                            // 応募状況
                            var formInfoTh          = document.createElement("th");
                            formInfoTh.innerHTML    = day + '<br>' + getDOW(day).dow;
                            formInfoTh.colSpan      = "2";
                            formInfoTh.className    = "sticky3 " + getDOW(day).dowClass;
                            formInfoTr.appendChild(formInfoTh);

                            // シフト
                            var shiftInfoTh          = document.createElement("th");
                            shiftInfoTh.colSpan      = "2";
                            shiftInfoTh.className    = "sticky3 " + getDOW(day).dowClass;
                            shiftInfoTh.id           = day + '_th';
                            var shiftInfoB           = document.createElement("button");
                            shiftInfoB.innerHTML     = day + '<br>' + getDOW(day).dow;
                            shiftInfoB.value         = day;
                            shiftInfoB.className     = "shiftInfoB";
                            shiftInfoTh.appendChild(shiftInfoB);
                            shiftInfoTr.appendChild(shiftInfoTh);
                        }
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

                const tbl = document.getElementById("formInfoTable").querySelector("tbody");
                Array.from(tbl.querySelectorAll("tr")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }
                    
                });
                document.getElementById("formInfoMsg").innerText = '';
                document.getElementById("editFormInfo").style.display = "block";
                document.getElementById("cancelFormInfo").style.display = "none";
                document.getElementById("updateFormInfo").style.display = "none";

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        Object.keys(data).forEach(function(key) {
                            var tr = document.createElement("tr");
                            var tdClass = "";

                            // ステータス：表示
                            var status          = document.createElement("td");
                            var statusP         = document.createElement("p");
                            statusP.innerText   = data[key].status;
                            statusP.className   = "statusP";
                            switch (data[key].status) {
                                case '保留':
                                        statusP.style.background   = "#dbebc4";
                                    break;

                                case '不採用':
                                        statusP.style.background   = "#8da0b6";
                                        tdClass = "completed";
                                    break;

                                case '採用':
                                        statusP.style.background   = "#debecc";
                                    break;
                            
                                case '採用通知済み':
                                        statusP.style.background   = "#e3d7a3";
                                    break;

                                case '追加済み':
                                        statusP.style.background   = "#ef857d";
                                    break;

                                case '辞退':
                                case '不通':
                                case '無断蒸発':
                                        statusP.style.background   = "#e1e1e1";
                                        tdClass = "completed";
                                    break;
                            }
                            status.appendChild(statusP);

                            // 氏名
                            var name        = document.createElement("td");
                            var nameB       = document.createElement("button");
                            nameB.innerText = data[key].no + '.' + data[key].name;
                            nameB.value     = data[key].event + ":" + data[key].mail;
                            nameB.className = "nameB";
                            name.className  = "sticky2 " + tdClass;
                            name.appendChild(nameB);
                            tr.appendChild(name);
                            
                            // ステータス：編集
                            var statusSelect    = document.createElement("select");
                            var statusOption    = ['応募受付', '保留', '不採用', '採用', '採用通知済み', '辞退', '不通', '追加済み', '無断蒸発'];
                            statusOption.forEach(function(o) {
                                var option = document.createElement("option");
                                option.text = o;
                                option.value = data[key].event + ":" + data[key].mail + ":" + o;
                                statusSelect.appendChild(option);
                            });
                            statusSelect.value          = data[key].event + ":" + data[key].mail + ":" + data[key].status;
                            statusSelect.style.display  = "none";
                            statusSelect.className      = "statusS";
                            status.className            = "sticky4 " + tdClass;
                            status.appendChild(statusSelect);
                            tr.appendChild(status);

                            // 応募メモ
                            var memo        = document.createElement("td");
                            memo.innerHTML  = 
                                '応募：' + data[key].created_dt.slice(5, 11).replace('-', '/')
                                + '<br>' + data[key].memo.replaceAll("\n", "<br>")
                            ;
                            memo.className = "textLeft " + tdClass;
                            tr.appendChild(memo);

                            // シフト希望
                            var availableA  = data[key].available.split(/,/);
                            availableA.forEach(function(d) {
                                var availablD = d.split(/_/);

                                var dowClass = getDOW(availablD[0]).dowClass;

                                var availableS          = document.createElement("td");
                                availableS.innerText    = availablD[1];
                                availableS.className    = "rightBorder " + dowClass + " " + tdClass;
                                tr.appendChild(availableS);

                                var availableE          = document.createElement("td");
                                availableE.innerText    = availablD[2];
                                availableE.className    = "leftBorder " + dowClass + " " + tdClass;
                                tr.appendChild(availableE);
                            });


                            tbl.appendChild(tr);
                        });

                        document.getElementById("formInfoArea").style.display = 'flex';
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

                document.getElementById("formInfoName").innerText           = "";
                document.getElementById("formInfoMail").innerText           = "";
                document.getElementById("formInfoBirthday").innerText       = "";
                document.getElementById("formInfoAge").innerText            = "";
                document.getElementById("formInfoJob").innerText            = "";
                document.getElementById("formInfoTell").innerText           = "";
                document.getElementById("formInfoClosestStation").innerText = "";
                document.getElementById("formInfoMemo").innerText           = "";
                document.getElementById("formInfoPlatform").innerText       = "";
                const a = document.getElementById("formInfoPlatformUrl").querySelector("a");
                a.innerText     = "";
                a.href          = "";
                a.styledisplay  = "none";
                document.getElementById("formInfoLog").innerHTML            = "";
                document.getElementById("formInfoCreatedDt").innerText      = "";
                document.getElementById("formInfoUpdatedDt").innerText      = "";

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);
                    const application = data.application;

                    if (application) {
                        document.getElementById("formInfoName").innerText           = application.name;
                        document.getElementById("formInfoMail").innerText           = application.mail;
                        document.getElementById("formInfoBirthday").innerText       = application.birthday;
                        document.getElementById("formInfoAge").innerText            = getAge(application.birthday);
                        document.getElementById("formInfoJob").innerText            = application.job;
                        document.getElementById("formInfoTell").innerText           = application.tell;
                        document.getElementById("formInfoClosestStation").innerText = application.closest_station;
                        document.getElementById("formInfoMemo").innerHTML           = application.memo.replaceAll("\n", "<br>");
                        document.getElementById("formInfoPlatform").innerText       = application.platform;
                        if (data.platform_url) {
                            a.innerText     = data.platform_url;
                            a.href          = data.platform_url;
                            a.style.display = "block";
                        }
                        document.getElementById("formInfoLog").innerHTML            = '・' + application.log.replaceAll(",", "<br>・");
                        document.getElementById("formInfoCreatedDt").innerText      = application.created_dt;
                        document.getElementById("formInfoUpdatedDt").innerText      = application.updated_dt;
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

                        document.getElementById("editFormInfo").style.display = "block";
                        document.getElementById("cancelFormInfo").style.display = "none";
                        document.getElementById("updateFormInfo").style.display = "none";
                        getItem("formInfoOpen", event);
                    } else {
                        document.getElementById("formInfoMsg").innerText = 'ステータス変更ができませんでした。';
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

                const tbl = document.getElementById("shiftInfoTable").querySelector("tbody");
                Array.from(tbl.querySelectorAll("tr")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }
                });

                const selectBooth = document.getElementById("selectBooth");
                Array.from(selectBooth.querySelectorAll("option")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }
                });

                const shiftInfoTr = document.getElementById("shiftInfoHeader");
                Array.from(shiftInfoTr.getElementsByClassName("numP")).forEach(function(e) {
                    e.remove();
                });
                Array.from(shiftInfoTr.getElementsByClassName("numEdit")).forEach(function(e) {
                    e.remove();
                });
                Array.from(shiftInfoTr.getElementsByClassName("textDiv")).forEach(function(e) {
                    e.remove();
                });


                document.getElementById("shiftInfoMsg").innerText = '';
                document.getElementById("editShiftInfo").style.display = "block";
                document.getElementById("cancelShiftInfo").style.display = "none";
                document.getElementById("updateShiftInfo").style.display = "none";
                document.getElementById("selectBooth").style.display = "block";

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
                            var name        = document.createElement("td");
                            name.rowSpan    = "2";
                            name.className  = "sticky2 textLeft";
                            var nameB       = document.createElement("button");
                            nameB.innerText = staff.no + '.' + staff.name;
                            nameB.value     = paramDB['event'] + ':' + staff.mail;
                            nameB.className = "nameB";
                            name.appendChild(nameB);
                            tr1.appendChild(name);

                            // ブース
                            var booth           = document.createElement("td");
                            booth.rowSpan       = "2";
                            booth.className     = "sticky4"; 
                            var boothP          = document.createElement("p");
                            boothP.innerText    = staff.booth;                            
                            boothP.className    = "shiftDisplay"; 
                            booth.appendChild(boothP);  
                            if (
                                staff.booth &&
                                !(boothA.includes(staff.booth))
                            ) {
                                boothA.push(staff.booth);
                            }

                            // ブース：編集
                            var boothS              = document.createElement("input");
                            boothS.value            = staff.booth;
                            boothS.style.display    = 'none';
                            boothS.id               = staff.no + '_boothS';
                            boothS.className        = 'boothEdit shiftEdit';
                            boothS.maxLength        = 20;
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
                                var dowClass = getDOW(day).dowClass;

                                var tr1S = document.createElement("td");
                                var tr1E = document.createElement("td");
                                var tr2B = document.createElement("td");
                                var tr2W = document.createElement("td");
                                tr1S.className = "rightBorder bottomBorder " + dowClass;
                                tr1E.className = "leftBorder bottomBorder " + dowClass;
                                tr2B.className = "rightBorder topBorder " + dowClass;
                                tr2W.className = "leftBorder topBorder " + dowClass;

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
                                    var numP        = document.createElement("p");
                                    numP.className  = "numP shiftDisplay";
                                    numP.id         = "totalNum_" + day;

                                    // 必要人数：編集
                                    var numB              = document.createElement("input");
                                    numB.value            = requiredNumÅ[day];
                                    numB.style.display    = 'none';
                                    numB.id               = day + '_inputNum';
                                    numB.className        = 'numEdit shiftEdit';
                                    numB.maxLength        = 5;

                                    // 説明
                                    var textD       = document.createElement("div");
                                    textD.className = 'textDiv';
                                    var text1 = document.createElement("p");
                                    var text2 = document.createElement("p");
                                    var text3 = document.createElement("p");
                                    var text4 = document.createElement("p");
                                    text1.innerText   = '出勤';
                                    text2.innerText   = '退勤';
                                    text3.innerText   = '休憩';
                                    text4.innerText   = '実働';
                                    text1.className   = "shiftDisplay rightBorder bottomBorder " + dowClass;
                                    text2.className   = "shiftDisplay leftBorder bottomBorder " + dowClass;
                                    text3.className   = "shiftDisplay rightBorder topBorder " + dowClass;
                                    text4.className   = "shiftDisplay leftBorder topBorder " + dowClass;
                                    textD.appendChild(text1);
                                    textD.appendChild(text2);
                                    textD.appendChild(text3);
                                    textD.appendChild(text4);

                                    dayth.appendChild(numP);
                                    dayth.appendChild(numB);
                                    dayth.appendChild(textD);
                                }

                                // シフト：開始
                                var startP = document.createElement("p");
                                if (day in shiftÅ && 0 in shiftÅ[day] && shiftÅ[day][0] !== '×') {
                                    valueS = shiftÅ[day][0];
                                }
                                startP.innerText = valueS;
                                startP.className = 'shiftDisplay';
                                tr1S.appendChild(startP);

                                // シフト：終了
                                var endP = document.createElement("p");
                                if (day in shiftÅ && 1 in shiftÅ[day] && shiftÅ[day][1] !== '×') {
                                    valueE = shiftÅ[day][1];
                                }
                                endP.innerText = valueE;
                                endP.className = 'shiftDisplay';
                                tr1E.appendChild(endP);

                                // シフト：休憩
                                var breakP = document.createElement("p");
                                if (valueS !== '-' && valueE !== '-') {
                                    valueW = clac(day, (valueS + ':00'), (valueE + ':00'), 'diff');

                                    var valueWA = valueW.split(/:/);
                                    valueB = valueWA[0] < 6
                                        ? '0:00'
                                        : valueWA[0] < 8
                                            ? '1:00'
                                            : '1:30'
                                        ;
                                }                                
                                breakP.innerText = valueB;
                                breakP.className = 'shiftDisplay';
                                tr2B.appendChild(breakP);

                                // シフト：実働
                                var workP = document.createElement("p");
                                if (valueS !== '-' && valueE !== '-' && valueB != '0:00') {
                                    valueW = clac(day, (valueB + ':00'), (valueW + ':00'), 'diff');
                                    workP.style.fontWeight = 'bold';
                                }
                                workP.innerText = valueW;
                                workP.className = 'shiftDisplay';
                                tr2W.appendChild(workP);

                                // シフト希望：開始
                                var availableS          = document.createElement("p");
                                availableS.innerText    = day in availableÅ
                                    ? 0 in availableÅ[day] ? availableÅ[day][0] : "-"
                                    : "-"
                                ;
                                availableS.style.display    = 'none';
                                availableS.className        = 'shiftEdit';
                                tr1S.appendChild(availableS);

                                // シフト希望：終了
                                var availableE          = document.createElement("p");
                                availableE.innerText    = day in availableÅ
                                    ? 1 in availableÅ[day] ? availableÅ[day][1] : "-"
                                    : "-"
                                ;
                                availableE.style.display    = 'none';
                                availableE.className        = 'shiftEdit';
                                tr1E.appendChild(availableE);

                                // シフト編集：開始
                                var inputS              = document.createElement("input");
                                inputS.value            = valueS == '-' ? '' : valueS;
                                inputS.style.display    = 'none';
                                inputS.id               = staff.no + '_' + day + '_inputS';
                                inputS.className        = 'shiftEdit';
                                inputS.maxLength        = 5;
                                tr1S.appendChild(inputS);

                                // シフト編集：終了
                                var inputE              = document.createElement("input");
                                inputE.value            = valueE == '-' ? '' : valueE;
                                inputE.style.display    = 'none';
                                inputE.id               = staff.no + '_' + day + '_inputE';
                                inputE.className        = 'shiftEdit';
                                inputE.maxLength        = 5;
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

                            tbl.appendChild(tr1);
                            tbl.appendChild(tr2);

                            i++;
                        });

                        // ブース
                        boothA.forEach(function(booth) {
                            var option      = document.createElement("option");
                            option.text     = booth;
                            option.value    = booth;
                            if (booth == paramDB['booth']) {
                                option.selected = 'true';
                            }
                            selectBooth.appendChild(option);
                        });

                        // 合計人数
                        for (let key in sum) {
                            var clacNum = Number(sum[key]) - Number(requiredNumÅ[key]);

                            document.getElementById("totalNum_" + key).innerHTML = 
                                '必要:' + requiredNumÅ[key] + '<br>'
                                + '出:' + sum[key]
                                + ' 差:' + clacNum
                            ;
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
                if (this.readyState == 4 && this.status == 200) {
                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        var event = document.getElementById("eventName").innerText;

                        document.getElementById("shiftInfoMsg").innerText = '';
                        document.getElementById("editShiftInfo").style.display = "block";
                        document.getElementById("cancelShiftInfo").style.display = "none";
                        document.getElementById("updateShiftInfo").style.display = "none";
                        document.getElementById("selectBooth").style.display = "block";
                        getItem("shiftInfoOpen", event);
                    } else {
                        document.getElementById("shiftInfoMsg").innerText = 'シフト変更ができませんでした。';
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
                document.getElementById("shiftChangeInfoRequestMsg").innerText = '';
                document.getElementById("availableRequestMsg").innerText = '';

                const tbl = document.getElementById("shiftChangeInfoTable").querySelector("tbody");
                Array.from(tbl.querySelectorAll("tr")).forEach(function(e) {
                    if (!e.id) {
                        e.remove();
                    }                 
                });

                const approve       = document.getElementById('approveShiftChangeInfo');
                const reject        = document.getElementById('rejectWorkShiftChangeInfo');
                approve.value            = 'false';
                approve.style.color      = '#000';
                approve.style.background = '#fff';
                reject.value             = 'false';
                reject.style.color       = '#000';
                reject.style.background  = '#fff';
                document.getElementById("shiftChangeInfoMsg").innerText = '';

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        Object.keys(data).forEach(function(key) {
                            var shiftBeforeA = data[key].shift_before.split(/_/);
                            var shiftAfterA = data[key].shift_after.split(/_/);

                            var tr = document.createElement("tr");
                            var tdClass = "";

                            // ステータス
                            var status          = document.createElement("td");
                            var statusB         = document.createElement("button");
                            statusB.innerText   = data[key].status;
                            statusB.value       = data[key].request_dt
                                + ',' + paramDB['event'] 
                                + ',' + data[key].name
                                + ',' + shiftAfterA[0]
                                + ',' + data[key].shift_after
                            ;
                            switch (data[key].status) {
                                case '申請中':
                                        statusB.style.background   = "#87bd9eff";
                                    break;

                                case '却下':
                                case '承認済':
                                case '可能日変更':
                                        statusB.style.background   = "#a5a5a5ff";
                                        tdClass = "completed";
                                    break;
                            }
                            statusB.className   = 'selectStatusB';
                            status.className    = tdClass;
                            status.appendChild(statusB);
                            
                            // 申請日時
                            var requestDt       = document.createElement("td");
                            requestDt.innerText = data[key].request_dt;
                            requestDt.className = "sticky2 " + tdClass;
                            
                            // 氏名
                            var name        = document.createElement("td");
                            name.innerText  = data[key].name;
                            name.className  = "sticky4 " + tdClass;

                            // 対象日
                            var day          = document.createElement("td");
                            day.innerText    = shiftBeforeA[0];
                            day.className    = tdClass;

                            // 変更前
                            var before          = document.createElement("td");
                            before.innerText    = shiftBeforeA[1] + ' - ' + shiftBeforeA[2];
                            before.className    = tdClass;
                            
                            // 変更後
                            var after          = document.createElement("td");
                            after.innerText    = shiftAfterA[1] + ' - ' + shiftAfterA[2];
                            after.className    = tdClass;

                            // 処理日
                            var approvalD       = document.createElement("td");
                            approvalD.innerText = data[key].approval_d;
                            approvalD.className = tdClass;
                            
                            tr.appendChild(requestDt);
                            tr.appendChild(name);
                            tr.appendChild(status);
                            tr.appendChild(day);
                            tr.appendChild(before);
                            tr.appendChild(after);
                            tr.appendChild(approvalD);

                            tbl.appendChild(tr);
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

                const shiftChangeInfoRequest = document.getElementById("shiftChangeInfoRequest");
                Array.from(shiftChangeInfoRequest.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                const availableRequest = document.getElementById("availableRequest");
                Array.from(availableRequest.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {

                        // シフト
                        if (data.shift) {
                            const shiftA = data.shift.split(/\,/);
                            const selectShiftDay = document.getElementById("selectShiftDay");
                            Array.from(shiftA).forEach(function(day) {
                                if (!(day.includes('×'))) {
                                    var dayA =  day.split(/_/);

                                    var option = document.createElement("option"); 
                                    option.text = dayA[0] + ' ' + dayA[1] + ' - ' + dayA[2];
                                    option.value = day;
                                    selectShiftDay.appendChild(option);
                                } 
                            });
                        } else {
                            document.getElementById("shiftChangeInfoRequest").style.display = 'none';
                        }


                        // 出勤可能日
                        if (data.available) {
                            const availableA = data.available.split(/\,/);
                            const selectAvailableDay = document.getElementById("selectAvailableDay");
                            Array.from(availableA).forEach(function(day) {
                                var dayA =  day.split(/_/);

                                var option = document.createElement("option"); 
                                option.text = dayA[0] + ' ' + dayA[1] + ' - ' + dayA[2];
                                option.value = day;
                                selectAvailableDay.appendChild(option);
                            }); 
                        } else {
                            document.getElementById("availableRequest").style.display = 'none';
                        }

                        // 時間
                        const startTimeA = document.getElementById("startTime").innerText.split(/:/);
                        const endTimeA   = document.getElementById("endTime").innerText.split(/:/);
                        const selectShiftAfterS     = document.getElementById("selectShiftAfterS");
                        const selectShiftAfterE     = document.getElementById("selectShiftAfterE");
                        const selectAvailableAfterS = document.getElementById("selectAvailableAfterS");
                        const selectAvailableAfterE = document.getElementById("selectAvailableAfterE");

                        var optionSS    = document.createElement("option");
                        optionSS.text   = '×';
                        optionSS.value  = '×';
                        selectShiftAfterS.appendChild(optionSS);

                        var optionSE    = document.createElement("option");
                        optionSE.text   = '×';
                        optionSE.value  = '×';
                        selectShiftAfterE.appendChild(optionSE);

                        var optionAS    = document.createElement("option");
                        optionAS.text   = '×';
                        optionAS.value  = '×';
                        selectAvailableAfterS.appendChild(optionAS);

                        var optionAE    = document.createElement("option");
                        optionAE.text   = '×';
                        optionAE.value  = '×';
                        selectAvailableAfterE.appendChild(optionAE);

                        for (let h = Number(startTimeA[0]); h <= Number(endTimeA[0]); h++) {
                            var startM = 0;
                            var endM = 45;
                            if (h == Number(startTimeA[0])) {
                                startM = Number(startTimeA[1]);
                            }
                            if (h == Number(endTimeA[0])) {
                                endM = Number(endTimeA[1]);
                            }

                            for (let m = startM; m <= endM; m += 15) {
                                var time = h + ':' + m.toString().padStart(2, '0');

                                var optionSS    = document.createElement("option");
                                optionSS.text   = time;
                                optionSS.value  = time;
                                selectShiftAfterS.appendChild(optionSS);

                                var optionSE    = document.createElement("option");
                                optionSE.text   = time;
                                optionSE.value  = time;
                                selectShiftAfterE.appendChild(optionSE);

                                var optionAS    = document.createElement("option");
                                optionAS.text   = time;
                                optionAS.value  = time;
                                selectAvailableAfterS.appendChild(optionAS);

                                var optionAE    = document.createElement("option");
                                optionAE.text   = time;
                                optionAE.value  = time;
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
                + "&approvalD="     + encodeURIComponent(date().yyyymmdd)
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        document.getElementById("shiftChangeInfoMsg").innerText = '';

                        const approve       = document.getElementById('approveShiftChangeInfo');
                        const reject        = document.getElementById('rejectWorkShiftChangeInfo');
                        approve.value            = 'false';
                        approve.style.color      = '#000';
                        approve.style.background = '#fff';
                        reject.value             = 'false';
                        reject.style.color       = '#000';
                        reject.style.background  = '#fff';

                        var event = document.getElementById("eventName").innerText;
                        getItem("shiftChangeInfoOpen", event);
                    } else {
                        document.getElementById("shiftChangeInfoMsg").innerText = 'ステータス変更ができませんでした。';
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

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        document.getElementById("shiftChangeInfoRequestMsg").innerText = '';
                        document.getElementById("availableRequestMsg").innerText = '';

                        var event = document.getElementById("eventName").innerText;
                        getItem("shiftChangeInfoOpen", event);
                    } else {
                        var msg = '変更希望の登録ができませんでした。'

                        if (paramDB.available) {
                            document.getElementById("shiftChangeInfoRequestMsg").innerText = msg;
                        } else {
                            document.getElementById("availableRequestMsg").innerText = msg;
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

                        document.getElementById("addStaffMsg").innerText = '';
                        document.getElementById("addStaffName").value = '';
                        document.getElementById("addStaffMail").value = '';
                        document.getElementById("addStaffBirthday").value = 'yyyymmdd';

                        var event = document.getElementById("eventName").innerText;
                        getItem("shiftInfoOpen", event);
                    } else {
                        document.getElementById("addStaffMsg").innerText = 'スタッフの追加ができませんでした。';
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

// 曜日
function getDOW(day) {
    const dayA = day.split(/-/);
    const yearStr   = dayA[0];
    const monthStr  = dayA[1];
    const dayStr    = dayA[2];

    // Dateオブジェクトには実際の月ー１の値を指定するため
    var jsMonth = monthStr - 1 ;

    // Dateオブジェクトは曜日情報を0から6の数値で保持しているため、翻訳する
    var dayOfWeekStrJP = [ "日", "月", "火", "水", "木", "金", "土" ] ;
    var className       = [ "sun", "", "", "", "", "", "sat" ] ;

    // 指定日付で初期化したDateオブジェクトのインスタンスを生成する
    var date = new Date( yearStr, jsMonth , dayStr );

    // 木曜日は数値の4として保持されているため、dayOfWeekStrJP[4]の値が出力される
    return {
        "dow"       : '(' + dayOfWeekStrJP[date.getDay()] + ')',
        "dowClass"  : className[date.getDay()]
    }
}

// 年齢
function getAge(birthday){
    const y = birthday.slice(0, 4);
    const m = birthday.slice(4, 6);
    const d = birthday.slice(6, 8);

    //今日
    var today = new Date();
 
    //今年の誕生日
    var thisYearsBirthday = new Date(today.getFullYear(), m - 1, d);
 
    //年齢
    var age = today.getFullYear() - y;

    if(today < thisYearsBirthday){
        //今年まだ誕生日が来ていない
        age--;
    }

    return age;
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

// 半角変換
function replaceStr(str) {
    return str.replace(/[０-９：]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^\d:]/g, '');
}