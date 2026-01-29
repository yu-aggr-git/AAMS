window.onload = () => {

    // ログイン
    const adminUser = window.localStorage.getItem("adminUser");
    const url    = new URL(window.location.href);
    const params = url.searchParams;
    const event  = params.get('event');
    const name   = params.get('name');
    adminLogin(adminUser, event, name);

    // 支払日選択
    document.getElementById("payDaySelect").onchange = function() {
        common_text_entry({'value' : {'memoInput' : ''}});
        getDate('selectPayDay', event, name);
    }

    // 再取得
    document.getElementById("reGet").onclick = function() {
        getDate('reGet', event, name);
    }

    // 再計算
    document.getElementById("reCalc").onclick = function() {
        getDate('reCalc', event, name);
    }

    // PDF
    document.getElementById("pdf").onclick = function() {
        var dispList = ['header', 'footer', 'payslipInfoMenu'];
        common_op_view({
            'none' : dispList
        });
        window.print();
        common_op_view({
            'flex' : dispList
        });
    }

    // 給与計登録
    document.getElementById("registerPay").onclick = function() {
        registerPay(this.id, event, name);
    }
    document.getElementById("updatePay").onclick = function() {
        registerPay(this.id, event, name);
    }

    // 期間の選択変更時
    document.getElementById("days").querySelectorAll("select").forEach(function(e) {
        e.addEventListener('change',function(){
            const selectPayDay = document.getElementById("payDaySelect").value;

            if (selectPayDay) {
                dispMenu('reGet');
                common_set_element({
                    'element'   : e,
                    'border'    : '0.1vmin solid #000',
                });
            }
        });
    });
}


// ──────────────────────────────────────────────────────
//  管理者ログイン
// ………………………………………………………………………………………………………………………………………………
function adminLogin(adminUser, event, name) {

    if (adminUser && event && name) {
        // titleの変更
        document.title = name + '【' + event + '】給与明細';

        // 給与情報の取得
        getDate('get', event, name);
    } else {
        // 管理者ログイン画面へ遷移
        location.assign('admin.php');
    }
}


// ──────────────────────────────────────────────────────
//  メニュー表示切替
// ………………………………………………………………………………………………………………………………………………
function dispMenu(method) {
    let msg         = '';
    let viewBlock   = [];
    let viewNone    = [];

    switch (method) {
        case 'pdf':
            viewBlock   = ['pdf'];
            viewNone    = ['reGet', 'reCalc', 'registerPay', 'updatePay'];
            break;

        case 'registerPay':
            viewBlock   = ['registerPay'];
            viewNone    = ['reGet', 'reCalc', 'updatePay', 'pdf'];
            break;

        case 'updatePay':
            viewBlock   = ['updatePay'];
            viewNone    = ['reGet', 'reCalc', 'registerPay', 'pdf'];
            break;

        case 'reGet':
            msg         = '*期間が変更がされました。再取得してください。'
            viewBlock   = ['reGet'];
            viewNone    = ['reCalc', 'registerPay', 'updatePay', 'pdf'];
            break;

        case 'reCalc':
            msg         = '*手入力が行われました。再計算してください。'
            viewBlock   = ['reCalc'];
            viewNone    = ['reGet', 'registerPay', 'updatePay', 'pdf'];
            break;
    }

    common_text_entry({'innerText' : {'payslipInfoMenuMsg' : msg}});
    common_op_view({
        'block' : viewBlock,
        'none'  : viewNone,
    });
}


// ──────────────────────────────────────────────────────
//  データ取得
// ………………………………………………………………………………………………………………………………………………
function getDate(method, event, name) {
    let selectPayDay = '';
    let minDayRange  = '';
    let maxDayRange  = '';
    let dataI        = [];

    switch (method) {
        case 'get':
            // 値変更なし
            break;

        case 'selectPayDay':
            selectPayDay = document.getElementById("payDaySelect").value;
            break;

        case 'reGet':
            selectPayDay = document.getElementById("payDaySelect").value;
            minDayRange  = document.getElementById("minDaySelect").value;
            maxDayRange  = document.getElementById("maxDaySelect").value;
            break;

        case 'reCalc':
            selectPayDay = document.getElementById("payDaySelect").value;
            minDayRange  = document.getElementById("minDaySelect").value;
            maxDayRange  = document.getElementById("maxDaySelect").value;

            Array.from(document.getElementById("workReportTable").querySelectorAll("tr")).forEach(function(e) {
                if (!e.id) {
                    var timeA   = e.querySelectorAll("td")[1].innerHTML.split('<br>');
                    var start   = timeA[0].split(' - ')[0];
                    var end     = timeA[0].split(' - ')[1];

                    dataI.push({
                        'day'               : e.querySelectorAll("td")[0].textContent,
                        'start'             : start,
                        'end'               : end,
                        'sumTime'           : timeA[1].split(')')[1],
                        'breakTime'         : timeA[2].split(')')[1],
                        'workTime'          : timeA[3].split(')')[1],
                        'basic'             : e.querySelectorAll("td")[2].querySelector("input").value.replaceAll(",", ""),
                        'experience'        : e.querySelectorAll("td")[3].querySelector("input").value.replaceAll(",", ""),
                        'lateNight'         : e.querySelectorAll("td")[4].querySelector("input").value.replaceAll(",", ""),
                        'attendance'        : e.querySelectorAll("td")[5].querySelector("input").value.replaceAll(",", ""),
                        'allowances'        : e.querySelectorAll("td")[6].querySelector("input").value.replaceAll(",", ""),
                        'transportation'    : e.querySelectorAll("td")[7].querySelector("input").value.replaceAll(",", ""),
                    });
                }
            });
            break;
    }

    // 給与情報の取得
    var paramDB = {
        'event'         : event,
        'name'          : name,
        'method'        : method,
        'selectPayDay'  : selectPayDay,
        'minDayRange'   : minDayRange,
        'maxDayRange'   : maxDayRange,
        'dataI'         : dataI
    };
    opDB('getPayslipCreateInfo', paramDB);
}


// ──────────────────────────────────────────────────────
//  給与計算
// ………………………………………………………………………………………………………………………………………………
function clacPay(method, dataE, dataS, dataW, dataT, minDayRange, maxDayRange, registeredNetPay, registeredRange) {
    const workReportTableE  = document.getElementById("workReportTable");

    let clacMsg = '';
    let clacList = [];
    let totalList = {
        'days'           : 0,
        'basic'          : 0,
        'experience'     : 0,
        'lateNight'      : 0,
        'attendance'     : 0,
        'allowances'     : 0,
        'transportation' : 0,
        'tax'            : 0,
        'gross'          : 0,
        'deduction'      : 0,
        'netPay'         : 0,
    };


    Object.keys(dataW).forEach(function(key) {
        var dataWD = dataW[key];

        // 期間範囲のみ
        if (minDayRange <= dataWD.day && dataWD.day <= maxDayRange) {
            var sumTime     = '';
            var breakTime   = '';
            var workTime    = '';
            var tr          = document.createElement("tr");

            // 出勤日数の加算
            totalList['days'] = (totalList['days'] + 1);

            // 時間計算
            switch (method) {
                case 'get':
                case 'selectPayDay':
                case 'reGet':
                    // DBデータから計算
                    var start = common_validation_time(dataWD.start)
                        ? common_ceil(dataWD.start)
                        : '＊'
                    ;
                    var end = common_validation_time(dataWD.end)
                        ? common_floor(start, dataWD.end)
                        : '＊'
                    ;
                    var reportTime = common_report_time(
                        dataWD.day,
                        start,
                        common_validation_time(dataWD.break1s) ? common_ceil(dataWD.break1s) : '',
                        common_validation_time(dataWD.break1e) ? common_ceil(dataWD.break1e) : '',
                        common_validation_time(dataWD.break2s) ? common_ceil(dataWD.break2s) : '',
                        common_validation_time(dataWD.break2e) ? common_ceil(dataWD.break2e) : '',
                        common_validation_time(dataWD.break3s) ? common_ceil(dataWD.break3s) : '',
                        common_validation_time(dataWD.break3e) ? common_ceil(dataWD.break3e) : '',
                        end
                    );
                    sumTime     = reportTime.sumTime ? reportTime.sumTime.padStart(5, '0') : '＊';
                    breakTime   = common_validation_time(reportTime.breakTime) ? reportTime.breakTime.padStart(5, '0') : '＊';
                    workTime    = reportTime.workTime ? reportTime.workTime.padStart(5, '0') : '＊';

                    // 金額計算
                    if (common_validation_time(workTime)) {
                        var workTimeNum = common_convert_time(workTime);

                        // ［基本給］実働 × 時給
                        var basicVal = Math.round(Number(workTimeNum) * Number(dataE.hourly_wage));

                        // ［経験者手当］実働 × 経験者手当
                        var experienceVal = Math.round(Number(workTimeNum) * Number(dataS.experience));

                        // ［深夜手当］終了時間が22時以降の差分 × 時給 × 0.25
                        var diffTime = common_clac(dataWD.day, '22:00', end, 'diff');
                        var lateNightVal = common_validation_time(diffTime) 
                            ? Math.round(Number(common_convert_time(diffTime)) * Number(dataE.hourly_wage) * 0.25)
                            : 0
                        ;

                        // ［出勤手当］最終日に付与
                        var attendanceVal = (dataS.attendance && dataW.at(-1).day == dataWD.day) ? Number(dataS.attendance) : 0;

                        // ［諸手当］
                        var allowancesVal = 0;

                        // ［交通費］実働有
                        var transportationVal = workTimeNum > 0 ? Number(dataS.transportation) : 0;
                        if (dataE.transportation_limit && transportationVal > dataE.transportation_limit) {
                            var memoInput = document.getElementById("memoInput").value;
                            var transportationMemo =
                                '申請往復交通費(一日)：' + transportationVal.toLocaleString() + 'は、'
                                + '上限：' + dataE.transportation_limit.toLocaleString() + 'での支給になります。'
                            ;
                            if (!memoInput.includes("申請往復交通費")) {
                                document.getElementById("memoInput").value = memoInput
                                    ? memoInput + '\n' + transportationMemo
                                    : transportationMemo
                                ;
                            }

                            transportationVal = dataE.transportation_limit;
                        }

                        // ［源泉所得税］
                        var sumVal      = basicVal + experienceVal + lateNightVal + attendanceVal + allowancesVal;
                        var grossVal    = sumVal + transportationVal;
                        var taxVal      = 0;
                        var taxClac     = '';
                        Object.keys(dataT).forEach(function(year) {
                            if (dataT[year].min_range <= sumVal && sumVal < dataT[year].max_range) {
                                taxVal  = dataT[year].tax;
                                taxClac = dataT[year].min_range + ' <= z1.' + sumVal + ' < ' + dataT[year].max_range;
                            }
                        });

                        // ［一日合計］
                        var dayTotalVal = grossVal - taxVal;

                        // ログ用
                        clacList[dataWD.day] = {
                            'a1.basic__________' : basicVal          + ' … ' + workTimeNum + 'h * ' + dataE.hourly_wage,
                            'a2.experience_____' : experienceVal     + ' … ' + workTimeNum + 'h * ' + dataS.experience,
                            'a3.lateNight______' : lateNightVal      + ' … ' + common_convert_time(diffTime) + 'h * ' + dataE.hourly_wage + ' * 0.25',
                            'a4.attendance_____' : attendanceVal,
                            'a5.allowances_____' : allowancesVal,
                            'b1.transportation_' : transportationVal + ' … ' + workTimeNum + 'h > 0h ? '+ dataS.transportation + ' : 0',
                            'c1.tax____________' : taxVal            + ' … ' + taxClac,
                            'z1.sum____________' : sumVal            + ' … ' + 'sum(a)',
                            'z2.gross__________' : grossVal          + ' … ' + 'z1.' + sumVal + ' + b1.' + transportationVal,
                            'z3.dayTotal_______' : dayTotalVal       + ' … ' + 'z2.' + grossVal + ' - c1.' + taxVal,
                        }
                    } else {
                        clacMsg = '*出勤データが揃っていません。<br>'; 
                    }
                    break;

                case 'reCalc':
                    // 画面入力値から計算
                    start       = dataWD.start;
                    end         = dataWD.end;
                    sumTime     = dataWD.sumTime;
                    breakTime   = dataWD.breakTime;
                    workTime    = dataWD.workTime;

                    // 金額計算
                    if (common_validation_time(workTime)) {
                        var workTimeNum = common_convert_time(workTime);

                        var basicVal            = Number(dataWD.basic);
                        var experienceVal       = Number(dataWD.experience);
                        var lateNightVal        = Number(dataWD.lateNight);
                        var attendanceVal       = Number(dataWD.attendance);
                        var allowancesVal       = Number(dataWD.allowances);
                        var transportationVal   = Number(dataWD.transportation);

                        // ［源泉所得税］
                        var sumVal      = basicVal + experienceVal + lateNightVal + attendanceVal + allowancesVal;
                        var grossVal    = sumVal + transportationVal;
                        var taxVal      = 0;
                        var taxClac     = '';
                        Object.keys(dataT).forEach(function(year) {
                            if (dataT[year].min_range <= sumVal && sumVal < dataT[year].max_range) {
                                taxVal  = dataT[year].tax;
                                taxClac = dataT[year].min_range + ' <= z1.' + sumVal + ' < ' + dataT[year].max_range;
                            }
                        });

                        // ［一日合計］
                        var dayTotalVal = grossVal - taxVal;

                        // ログ用
                        clacList[dataWD.day] = {
                            'c1.tax____________' : taxVal            + ' … ' + taxClac,
                            'z1.sum____________' : sumVal            + ' … ' + 'sum(a)',
                            'z2.gross__________' : grossVal          + ' … ' + 'z1.' + sumVal + ' + b1.' + transportationVal,
                            'z3.dayTotal_______' : dayTotalVal       + ' … ' + 'z2.' + grossVal + ' - c1.' + taxVal,
                        }
                    }
                    break;
            }


            // 合計
            if (common_validation_time(workTime)) {
                totalList = {
                    'days'           : totalList['days'],
                    'basic'          : totalList['basic']           + basicVal,
                    'experience'     : totalList['experience']      + experienceVal,
                    'lateNight'      : totalList['lateNight']       + lateNightVal,
                    'attendance'     : totalList['attendance']      + attendanceVal,
                    'allowances'     : totalList['allowances']      + allowancesVal,
                    'transportation' : totalList['transportation']  + transportationVal,
                    'tax'            : totalList['tax']             + taxVal,
                    'gross'          : totalList['gross']           + grossVal,
                    'deduction'      : totalList['deduction']       + (taxVal),
                    'netPay'         : totalList['netPay']          + dayTotalVal,
                };
            }

            // 日付
            var data = document.createElement("td");
            common_set_element({
                'element'   : data,
                'innerText' : dataWD.day,
            });
            tr.appendChild(data);

            // 勤務時間
            var time = document.createElement("td");
            common_set_element({
                'element'   : time,
                'className' : 'w10 borderRight',
                'innerHTML' : (
                    start + ' - ' + end
                    + '<br>(拘束)' + sumTime
                    + '<br>(休憩)' + breakTime
                    + '<br>(実働)' + workTime
                )
            });
            tr.appendChild(time);

            // 基本給
            var basic = document.createElement("td");
            common_set_element({
                'element'   : basic,
                'className' : 'borderLeftNone',
            });
            var basicI = document.createElement("input");
            common_set_element({
                'element'   : basicI,
                'value'     : basicVal ? basicVal.toLocaleString() : '',
            });
            basic.appendChild(basicI);
            tr.appendChild(basic);

            // 経験者手当
            var experience = document.createElement("td");
            var experienceI = document.createElement("input");
            common_set_element({
                'element'   : experienceI,
                'value'     : experienceVal ? experienceVal.toLocaleString() : '',
            });
            experience.appendChild(experienceI);
            tr.appendChild(experience);

            // 深夜手当
            var lateNight = document.createElement("td");
            var lateNightI = document.createElement("input");
            common_set_element({
                'element'   : lateNightI,
                'value'     : lateNightVal ? lateNightVal.toLocaleString() : '',
            });
            lateNight.appendChild(lateNightI);
            tr.appendChild(lateNight);

            // 出勤手当
            var attendance  = document.createElement("td");
            var attendanceI = document.createElement("input");
            common_set_element({
                'element'   : attendanceI,
                'value'     : attendanceVal ? attendanceVal.toLocaleString() : '',
            });
            attendance.appendChild(attendanceI);
            tr.appendChild(attendance);

            // 諸手当
            var allowances = document.createElement("td");
            var allowancesI = document.createElement("input");
            common_set_element({
                'element'   : allowancesI,
                'value'     : allowancesVal ? allowancesVal.toLocaleString() : '',
            });
            allowances.appendChild(allowancesI);
            tr.appendChild(allowances);

            // 交通費
            var transportation = document.createElement("td");
            common_set_element({
                'element'   : transportation,
                'className' : 'borderRight',
            });
            var transportationI = document.createElement("input");
            common_set_element({
                'element'   : transportationI,
                'value'     : transportationVal ? transportationVal.toLocaleString() : '',
            });
            transportation.appendChild(transportationI);
            tr.appendChild(transportation);

            // 源泉所得税
            var tax = document.createElement("td");
            common_set_element({
                'element'   : tax,
                'className' : 'borderRight borderLeftNone',
                'innerText' : taxVal ? '-' + taxVal.toLocaleString() : '',
            });
            tr.appendChild(tax);

            // 合計
            var dayTotal = document.createElement("td");
            common_set_element({
                'element'   : dayTotal,
                'className' : 'borderLeftNone',
                'innerText' : dayTotalVal ? dayTotalVal.toLocaleString() : '',
            });
            tr.appendChild(dayTotal);

            workReportTableE.querySelector("tbody").appendChild(tr);
        }
    });


    // ログ出力
    console.log(clacList);
    // console.log(totalList);

    // 期間データなし
    if (Object.keys(clacList).length == 0) {
        clacMsg = clacMsg + '*設定期間の出勤データが存在しません。<br>';
    }

    // 登録値と計算値の比較
    if (!clacMsg) {
        if (!registeredNetPay) {
            // 登録ボタン
            dispMenu('registerPay');
        } else {
            if (
                registeredNetPay != totalList['netPay']                             ||
                (registeredRange.length != 0 && minDayRange != registeredRange[0])  ||
                (registeredRange.length != 0 && maxDayRange != registeredRange[1])
            ) {
                // 更新ボタン
                dispMenu('updatePay');
            } else {
                // PDFボタン
                dispMenu('pdf');
            }
        }
    }
    if (
        registeredNetPay && registeredNetPay != totalList['netPay']         ||
        (registeredRange.length != 0 && minDayRange != registeredRange[0])  ||
        (registeredRange.length != 0 && maxDayRange != registeredRange[1])
    ) {
        clacMsg = clacMsg + '*登録データと表示値が一致していません。<br>';
    }

    // 給与明細
    common_text_entry({
        'innerText' : {
            'daysInput'             : totalList['days'].toLocaleString(),
            'basicInput'            : totalList['basic'].toLocaleString(),
            'experienceInput'       : totalList['experience'].toLocaleString(),
            'lateNightInput'        : totalList['lateNight'].toLocaleString(),
            'attendanceInput'       : totalList['attendance'].toLocaleString(),
            'allowancesInput'       : totalList['allowances'].toLocaleString(),
            'transportationInput'   : totalList['transportation'].toLocaleString(),
            'taxInput'              : totalList['tax'].toLocaleString(),
            'grossInput'            : totalList['gross'].toLocaleString(),
            'deductionInput'        : totalList['deduction'].toLocaleString(),
            'netPayInput'           : totalList['netPay'].toLocaleString(),
        }
    });

    // 入力値変更の操作
    workReportTableE.querySelectorAll("input").forEach(function(e){
        e.addEventListener('change',function(){
            dispMenu('reCalc');
            common_set_element({
                'element'       : e,
                'borderBottom'  : '0.1vmin solid #000',
            });
        });
    });

    return clacMsg;
}


// ──────────────────────────────────────────────────────
//  給与登録
// ………………………………………………………………………………………………………………………………………………
function registerPay(id, event, name) {
    const selectPayDay  = document.getElementById("payDaySelect").value;
    const minDayRange   = document.getElementById("minDaySelect").value;
    const maxDayRange   = document.getElementById("maxDaySelect").value;
    const netPay        = document.getElementById("netPayInput").textContent;

    const before = document.getElementById(id).value;
    let after    = '';
    let val      = selectPayDay + '_' + minDayRange + '|' + maxDayRange + '_' + netPay.replaceAll(",", "");

    if (before) {
        (before.split(/,/)).forEach(function(payDay) {
            var payDayA = payDay.split(/_/);

            if (payDayA[0] == selectPayDay) {
                // 更新
                after = after
                    ? after + ',' + val
                    : val
                ;
                val = '';
            } else {
                after = after
                    ? after + ',' + payDay
                    : payDay
                ;
            }
        });
    }

    if (val) {
        // 登録
        after = after
            ? after + ',' + val
            : val
        ;
    }

    var paramDB = {
        'event'         : event,
        'name'          : name,
        'after'         : after,
    };
    opDB('registerStaffListNetPay', paramDB);
}


// ──────────────────────────────────────────────────────
//  DBの操作
// ………………………………………………………………………………………………………………………………………………
function opDB(op, paramDB) {
    var strUrl      = "function/db.php";
    const xmlhttp   = new XMLHttpRequest();

    switch (op) {
        case 'getPayslipCreateInfo':
            var param   = "function=" + "get_payslip_create_info"
                + "&event="     + encodeURIComponent(paramDB['event'])
                + "&name="      + encodeURIComponent(paramDB['name'])
                + "&payYear="   + encodeURIComponent(paramDB['selectPayDay'] ? paramDB['selectPayDay'].substring(0, 4) : '')
            ;

            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_text_entry({
                    'innerText' : {
                        'payslipInfoMenuMsg'    : '',
                        'eventDisp'             : '',
                        'nameDisp'              : '',
                        'registeredNetPay'      : '',

                        // 出勤明細
                        'daysInput'             : '',
                        'basicInput'            : '',
                        'experienceInput'       : '',
                        'lateNightInput'        : '',
                        'attendanceInput'       : '',
                        'allowancesInput'       : '',
                        'transportationInput'   : '',
                        'taxInput'              : '',
                        'grossInput'            : '',
                        'deductionInput'        : '',
                        'netPayInput'           : '',
                    },
                    'value' : {
                        'minDaySelect' : '',
                        'maxDaySelect' : '',
                    },
                });
                common_clear_children({
                    'notId'   : {
                        'workReportTable'  : 'tr',
                    }
                });
                common_op_view({
                    'none'  : ['pdf', 'reGet', 'registerPay', 'updatePay', 'reCalc'],
                });
                common_set_element({
                    'element'   : document.getElementById("minDaySelect"),
                    'border'    : 'none',
                });
                common_set_element({
                    'element'   : document.getElementById("maxDaySelect"),
                    'border'    : 'none',
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        // element
                        const payDaySelectE     = document.getElementById("payDaySelect");
                        const minDaySelectE     = document.getElementById("minDaySelect");
                        const maxDaySelectE     = document.getElementById("maxDaySelect");

                        // 各データ
                        const dataE = data['event'];
                        const dataS = data['staff_list'];
                        const dataW = (paramDB['method'] == 'reCalc' ? paramDB['dataI'] : data['work_report']);
                        const dataT = data['withholding_tax_list'];

                        // 設定値用変数
                        let selectPayDay     = '';
                        let minDayRange      = '';
                        let maxDayRange      = '';
                        let registeredNetPay = '';
                        let registeredRange  = [];
                        let msg              = '';


                        // 方式別処理
                        switch (paramDB['method']) {
                            case 'get':
                                // 支払日
                                if (dataE.pay_day) {
                                    const payDayA   = dataE.pay_day.split(/,/);

                                    if (payDayA.length != 1) {
                                        var option = document.createElement("option");
                                        common_set_element({
                                            'element'   : option,
                                            'text'      : '',
                                            'value'     : '',
                                        });
                                        payDaySelectE.appendChild(option);
                                    } else {
                                        selectPayDay = payDayA[0];
                                        minDayRange  = dataE.first_day;
                                        maxDayRange  = dataE.end_day;
                                    }

                                    payDayA.forEach(function(d) {
                                        var option = document.createElement("option");
                                        common_set_element({
                                            'element'   : option,
                                            'text'      : d,
                                            'value'     : d,
                                        });
                                        payDaySelectE.appendChild(option);
                                    });
                                }

                                // 期間
                                if (dataE.first_day && dataE.end_day) {
                                    const firstDay  = dataE.first_day.split(/-/);
                                    const endDay    = dataE.end_day.split(/-/);

                                    for (
                                        let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                                        date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                                        date.setDate(date.getDate() + 1)
                                    ) {
                                        var option1 = document.createElement("option");
                                        common_set_element({
                                            'element'   : option1,
                                            'text'      : date.toLocaleDateString('sv-SE'),
                                            'value'     : date.toLocaleDateString('sv-SE'),
                                        });
                                        minDaySelectE.appendChild(option1);

                                        var option2 = document.createElement("option");
                                        common_set_element({
                                            'element'   : option2,
                                            'text'      : date.toLocaleDateString('sv-SE'),
                                            'value'     : date.toLocaleDateString('sv-SE'),
                                        });
                                        maxDaySelectE.appendChild(option2);
                                    }
                                }
                                break;

                            case 'selectPayDay':
                                selectPayDay = paramDB['selectPayDay'];
                                break;

                            case 'reGet':
                            case 'reCalc':
                                selectPayDay = paramDB['selectPayDay'];
                                minDayRange  = paramDB['minDayRange'];
                                maxDayRange  = paramDB['maxDayRange'];
                                break;
                        }


                        // 支払日別処理
                        if (!selectPayDay) {
                            msg = msg + '*支払日を選択してください<br>'; 
                        } else {
                            // 登録済み差引支給額
                            if (dataS.net_pay) {
                                (dataS.net_pay.split(/,/)).forEach(function(d) {
                                    var netPayDA = d.split(/_/);

                                    if (netPayDA[0] == selectPayDay) {
                                        registeredRange = netPayDA[1].split(/\|/)

                                        // 期間
                                        minDayRange     = minDayRange ? minDayRange : registeredRange[0];
                                        maxDayRange     = maxDayRange ? maxDayRange : registeredRange[1];

                                        // 差引支給額
                                        registeredNetPay = Number(netPayDA[2]);
                                    }
                                });

                                common_text_entry({
                                    'value' : {
                                        'registerPay'   : dataS.net_pay,
                                        'updatePay'     : dataS.net_pay
                                    }
                                });
                            }

                            // 給与計算
                            if (Object.keys(dataW).length != 0 && Object.keys(dataT).length != 0) {
                                const clacPayMsg = clacPay(
                                    paramDB['method'],
                                    dataE,
                                    dataS,
                                    dataW,
                                    dataT,
                                    minDayRange,
                                    maxDayRange,
                                    registeredNetPay,
                                    registeredRange
                                );
                                msg = msg + clacPayMsg;
                            } else {
                                if (Object.keys(dataW).length == 0) {
                                    // 出勤データなし
                                    msg = msg + '*出勤データが存在しません。<br>';
                                } else {
                                    if (Object.keys(dataT).length == 0) {
                                        // 源泉所得税データなし
                                        msg = msg + '*' + paramDB['selectPayDay'].substring(0, 4) + '年源泉所得税データが存在しません。<br>';
                                    }
                                }
                            }
                        }


                        // 各値の入力
                        common_text_entry({
                            'innerText' : {
                                'eventDisp'         : paramDB['event'],
                                'nameDisp'          : paramDB['name'],
                                'registeredNetPay'  : registeredNetPay ? registeredNetPay.toLocaleString() : ''
                            },
                            'value' : {
                                'payDaySelect' : selectPayDay,
                                'minDaySelect' : minDayRange,
                                'maxDaySelect' : maxDayRange,
                            },
                            'innerHTML' : {
                                'payslipInfoMenuMsg' : msg
                            },
                        });
                    }
                }
            }
            break;

        case 'registerStaffListNetPay':
        var param = "function=" + "register_staff_list_netPay"
            + "&event="         + encodeURIComponent(paramDB.event)
            + "&name="          + encodeURIComponent(paramDB.name)
            + "&after="         + encodeURIComponent(paramDB.after)
        ;

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // 登録完了
                if (this.response == 1) {
                    // console.log(this.response, '登録');

                    getDate('selectPayDay', paramDB['event'], paramDB['name']);
                } else {
                    common_text_entry({'innerText' : {'payslipInfoMenuMsg' : '*給与登録ができませんでした。'}});
                }
            }
        }
        break;
    }

    xmlhttp.open("POST", strUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}
