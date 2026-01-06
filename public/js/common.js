// 現在日時
function common_date() {
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


// 項目名
function common_itemName(item) {
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


// 時間計算
function common_clac(day, bt, at, method) {
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


// 切り上げ（開始、休憩）
function common_ceil(data) {
    var dataA  = data.split(/:/);

    var min  = Math.ceil(dataA[1] / 15) * 15;
    var hour = Number(dataA[0]) + Number((min == 60 ? 1 : 0));
    dataClac = hour + ':' + (min == 60 ? '00' : min.toString().padStart(2, '0'));

    return dataClac;
}


// 切り捨て（退勤）
function common_floor(start, end) {
    var endA    = end.split(/:/);

    var min  = Math.floor(endA[1] / 15) * 15;
    var hour = Number(endA[0]);

    if (start && common_validation_time(start)) {
        var startA = start.split(/:/);
        hour = hour + (Number(startA[0]) > hour ? 24 : 0);
    }

    dataClac = hour + ':' + min.toString().padStart(2, '0');

    return dataClac;
}


// シフト時間の算出
function common_shift_time(day, start, end) {

    // 拘束時間
    const sumTime   = common_clac(day, start, end, 'diff');
    const sumTimeA  = sumTime.split(/:/);

    // 休憩時間
    const breakTime = (sumTimeA[0] < 6)
        ? '0:00'
        : (sumTimeA[0] < 8)
            ? '1:00'
            : '1:30'
    ;

    // 実働時間
    const workTime = common_clac(day, breakTime, sumTime, 'diff');

    return {
        "breakTime" : breakTime,
        "workTime"  : workTime
    }
}


// 勤怠時間の算出
function common_report_time(day, start, break1s, break1e, break2s, break2e, break3s, break3e, end) {

    // 休憩
    let breakTime = '0:00';
    if (
        (common_validation_time(break1s) && !common_validation_time(break1e))  || 
        (common_validation_time(break2s) && !common_validation_time(break2e))  ||
        (common_validation_time(break3s) && !common_validation_time(break3e))  ||
        (!common_validation_time(break1s) && common_validation_time(break1e))  || 
        (!common_validation_time(break2s) && common_validation_time(break3e))  || 
        (!common_validation_time(break2s) && common_validation_time(break3e))
    ) {
        breakTime = '＊';
    } else {
        // 1
        if (common_validation_time(break1s) && common_validation_time(break1e)) {
            breakTime = common_clac(day, break1s, break1e, 'diff');
        }

        // 2
        if (common_validation_time(break2s) && common_validation_time(break2e)) {
            breakTime = common_clac(
                day,
                breakTime,
                common_clac(day, break2s, break2e, 'diff'),
                'sum'
            );
        }

        // 3
        if (common_validation_time(break3s) && common_validation_time(break3e)) {
            breakTime = common_clac(
                day,
                breakTime,
                common_clac(day, break3s, break3e, 'diff'),
                'sum'
            );
        }
    }

    var workTime = '＊';
    if (common_validation_time(start) && common_validation_time(end) && common_validation_time(breakTime)) {
        // 拘束時間
        const sumTime = common_clac(day, start, end, 'diff');

        if (!sumTime.includes('-')) {
            // 実働時間
            workTime = common_clac(day, breakTime, sumTime, 'diff');
        }
    }

    return {
        "breakTime" : breakTime,
        "workTime"  : workTime
    }
}


// バリデーション＿h:mm または h:mm:ss
function common_validation_time(time) {
    const regex = /^[0-9]{1,2}:[0-9]{2}$|^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$/;

    return regex.test(time);
}



// バリデーション＿メールアドレス
function common_validation_mail(mail) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return regex.test(mail);
}



// 勤怠修正情報のステータス背景色
function common_workReportEditStatus_color(status) {
    let color = '';

    switch (status) {
        case '申請中':
            color = '#87bd9eff'
            break;

        case '訂正中':
            color = '#cbcd88ff'
            break;

        case '訂正済':
        case '承認済':
        case '却下済':
            color = '#a5a5a5ff'
            break;
    } 

    return color;
}


// 応募リストのステータス背景色
function common_applicationStatus_color(status) {
    let color = '';

    switch (status) {
        case '保留':
                color = "#dbebc4";
            break;

        case '不採用':
                color = "#8da0b6";
            break;

        case '採用':
                color = "#debecc";
            break;

        case '採用通知済み':
                color = "#e3d7a3";
            break;

        case '追加済み':
                color = "#ef857d";
            break;

        case '辞退':
        case '不通':
        case '無断蒸発':
                color = "#e1e1e1";
            break;
    } 

    return color;
}



// modalの表示／非表示
function common_op_modal(id, op) {
    switch (op) {
        case 'open':
            document.getElementById("modal").style.display  = 'flex';
            document.getElementById(id).style.display       = 'flex';
            document.body.style.overflow                    = 'hidden';
            break;

        case 'close':
            document.getElementById("modal").style.display  = 'none';
            document.getElementById(id).style.display       = 'none';
            document.body.style.overflow                    = 'visible';
            break;
    }
}


// 表示／非表示の操作
// ──────────────────────
// itemList = {
//     'block' : [],
//     'none'  : [],
//     'flex'  : []
// }
// …………………………………………………………
function common_op_view(itemList) {
    let id = '';

    Object.keys(itemList).forEach(function(op) {
        Object.keys(itemList[op]).forEach(function(item) {
            id = itemList[op][item];

            document.getElementById(id).style.display = op;
        });
    });
}


// テキストの入力
// ──────────────────────
// itemList = {
//     'innerText'  : { 'id' : 'item' },
//     'innerHTML'  : { 'id' : 'item' },
//     'value'      : { 'id' : 'item' },
//     'href'       : { 'id' : 'item' }
// }
// …………………………………………………………
function common_text_entry(itemList) {
    let item = '';

    Object.keys(itemList).forEach(function(op) {
        Object.keys(itemList[op]).forEach(function(id) {  
            item = itemList[op][id];

            switch (op) {
                case 'innerText':
                    document.getElementById(id).innerText = item;
                    break;

                case 'innerHTML':
                    document.getElementById(id).innerHTML = item;
                    break;

                case 'value':
                    document.getElementById(id).value = item;
                    break;

                case 'href':
                    document.getElementById(id).href = item;
                    break;

                case 'placeholder':
                    document.getElementById(id).placeholder = item;
                    break;
            }
        });
    });
}


// 子要素のクリア
// ──────────────────────
// itemList = {
//     'all'    : { 'id' : 'element' },
//     'notId'  : { 'id' : 'element' }
// }
// …………………………………………………………
function common_clear_children(itemList) {
    let item = '';

    Object.keys(itemList).forEach(function(target) {
        Object.keys(itemList[target]).forEach(function(id) {
            item = itemList[target][id];

            switch (target) {
                case 'all':
                    Array.from(document.getElementById(id).querySelectorAll(item)).forEach(function(e) {
                        e.remove();
                    });
                    break;

                case 'notId':
                    Array.from(document.getElementById(id).querySelectorAll(item)).forEach(function(e) {
                        if (!e.id) {
                            e.remove();
                        }
                    });
                    break
            }
        });
    });
}


// 要素の設定
// ──────────────────────
// itemList = {
//     'element'        : e,
//     'textContent'    : v,
// }
// …………………………………………………………
function common_set_element(item) {
    let e = item['element'];

    Object.keys(item).forEach(function(op) {
        var value = item[op];

        switch (op) {
            case 'id':
                e.id = value;
                break

            case 'className':
                e.className = value;
                break

            case 'textContent':
                e.textContent = value;
                break;

            case 'innerText':
                e.innerText = value;
                break;

            case 'innerHTML':
                e.innerHTML = value;
                break;

            case 'text':
                e.text = value;
                break;

            case 'value':
                e.value = value;
                break;

            case 'href':
                e.href = value;
                break;

            case 'target':
                e.target = value;
                break;

            case 'colSpan':
                e.colSpan = value;
                break;

            case 'rowSpan':
                e.rowSpan = value;
                break;

            case 'type':
                e.type = value;
                break;

            case 'checked':
                e.checked = value;
                break;

            case 'name':
                e.name = value;
                break;

            case 'disabled':
                e.disabled = value;
                break;

            case 'selected':
                e.selected = value;
                break;

            case 'color':
                e.style.color = value;
                break;

            case 'fontWeight':
                e.style.fontWeight = value;
                break;

            case 'background':
                e.style.background = value;
                break;

            case 'borderColor':
                e.style.borderColor = value;
                break;

            case 'hidden':
                e.style.hidden = value;
                break;

            case 'display':
                e.style.display = value;
                break;
        }
    });
}