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

// 曜日
function common_getDOW(day) {
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
function common_getAge(birthday){
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


// 半角変換
function common_replaceStr(str) {
    return str.replace(/[０-９：]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^\d:]/g, '');
}


// 印刷
function common_print(target, noneList) {
    common_op_view({
        'none' : noneList
    });

    // ページ全体の調整
    common_set_element({
        'element'   : document.getElementById("main"),
        'padding'   : '0',
        'overflowY' : 'visible',
    });

    // 表示領域の幅
    const winWidth = window.innerWidth;

    // テーブル幅
    const eleWidth = document.getElementById(target).querySelector('table').getBoundingClientRect().right

    // テーブルの調整
    common_set_element({
        'element'           : document.getElementById(target),
        'maxHeight'         : '100%',
        'transformOrigin'   : 'top left',
        'transform'         : 'scale(' + (winWidth / eleWidth - 0.085) + ')',
        'overflow'          : 'visible',
    });

    window.print();
}


// 別タブでテーブルを開く
function common_open_table(dispArea, noneList, table) {
    common_op_view({
        'none'  : noneList,
        'flex'   : [dispArea]
    });

    // ページ全体の調整
    common_set_element({
        'element'   : document.getElementById("main"),
        'width'     : '100%',
        'height'    : '85vh',
        'margin'    : '5vh 0 10vmin 0',
        'padding'   : '0',
        'overflowY' : 'hidden',
    });

    // 表示エリアの調整
    common_set_element({
        'element'   : document.getElementById(dispArea),
        'padding'   : '0 2vmin',
    });

    // テーブルの調整
    common_set_element({
        'element'           : document.getElementById(table).parentNode,
        'width'             : '195vw',
        'maxHeight'         : '140vh',
        'transformOrigin'   : 'top left',
        'transform'         : 'scale(0.5)',
    });
}



// ──────────────────────────────────────────────────────
//  計算
// ………………………………………………………………………………………………………………………………………………
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
    let sumTime = '';
    if (common_validation_time(start) && common_validation_time(end) && common_validation_time(breakTime)) {
        // 拘束時間
        sumTime = common_clac(day, start, end, 'diff');

        if (!sumTime.includes('-')) {
            // 実働時間
            workTime = common_clac(day, breakTime, sumTime, 'diff');
        }
    }

    return {
        "breakTime" : breakTime,
        "workTime"  : workTime,
        "sumTime"   : sumTime
    }
}

// 時間変換
function common_convert_time(time) {
    let note = '';

    if (time.startsWith('＊')) {
        note = '＊';
        time = time.replaceAll("＊", "")
    }

    const timeA = time.split(/:/);

    return note + (Number(timeA[0]) + (Number(timeA[1]) / 60));
}

// 出勤率の算出
function common_clac_attendance(eventTime, workTime) {
    if (workTime && workTime.startsWith('＊')) {
        workTime = workTime.replaceAll("＊", "")
    }

    return (
        eventTime > 0
            ? Math.round((Number(workTime) / Number(eventTime)) * 100) + '%'
            : '- %'
    );
}



// ──────────────────────────────────────────────────────
//  バリデーション
// ………………………………………………………………………………………………………………………………………………
// 15分単位
function common_validation_minutes(value) {
    const regex = ['00', '15', '30', '45'];

    return regex.includes(value);
}

// h:mm
function common_validation_hhmm(value) {
    const regex = /\d{1,2}:\d{2}/;

    return regex.test(value);
}

// h:mm または h:mm:ss
function common_validation_time(value) {
    const regex = /^[0-9]{1,2}:[0-9]{2}$|^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$/;

    return regex.test(value);
}

// メールアドレス
function common_validation_mail(value) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return regex.test(value);
}

// yyyy-mm-dd
function common_validation_day(value) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    return regex.test(value);
}



// ──────────────────────────────────────────────────────
//  背景色の判定
// ………………………………………………………………………………………………………………………………………………
// 勤怠修正情報のステータス
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

// 応募リストのステータス
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

// シフト変更希望のステータス
function common_shiftChangeStatus_color(status) {
    let color = '';

    switch (status) {
        case '申請中':
                color = "#87bd9eff";
            break;

        case '却下済':
        case '承認済':
        case '可能日変更':
                color = "#a5a5a5ff";
            break;
    } 

    return color;
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

                case 'textContent':
                    document.getElementById(id).textContent = item;
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

            case 'htmlFor':
                e.htmlFor = value;
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

            case 'maxLength':
                e.maxLength = value;
                break;


            // CSS
            case 'color':
                e.style.color = value;
                break;

            case 'width':
                e.style.width = value;
                break;

            case 'height':
                e.style.height = value;
                break;

            case 'maxHeight':
                e.style.maxHeight = value;
                break;

            case 'margin':
                e.style.margin = value;
                break;

            case 'padding':
                e.style.padding = value;
                break;

            case 'overflow':
                e.style.overflow = value;
                break;

            case 'overflowY':
                e.style.overflowY = value;
                break;

            case 'transform':
                e.style.transform = value;
                break;

            case 'transformOrigin':
                e.style.transformOrigin = value;
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

            case 'border':
                e.style.border = value;
                break;

            case 'border':
                e.style.border = value;
                break;

            case 'borderBottom':
                e.style.borderBottom = value;
                break;
        }
    });
}