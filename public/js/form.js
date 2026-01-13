window.onload = () => {

    // イベント取得
    opDB('getEventListRecruit');

    // イベント選択
    document.getElementById("sendEventSelect").onclick = function() {
        eventSelect();
    }

    // 応募登録
    document.getElementById("sendApplicationInfo").onclick = function() {
        registerApplication();
    }

    // 応募取消
    document.getElementById("cancelApplicationInfo").onclick = function() {
        window.location.reload();
    }

    // 応募編集
    document.getElementById("editApplicationInfo").onclick = function() {
        editApplication();
    }
}


// ──────────────────────────────────────────────────────
//  イベント選択
// ………………………………………………………………………………………………………………………………………………
function eventSelect() {
    common_text_entry({'innerText' : {'eventSelectMsg' : ''}});

    var selectEventName = document.getElementById("selectEventName").value;
    var inputMail       = document.getElementById("inputMail").value;

    if (!selectEventName || !inputMail) {
        document.getElementById("eventSelectMsg").innerText = 'すべての項目に入力が必要です。';
    } else {
        if (!common_validation_mail(inputMail)) {
            // メールバリデーション
            common_text_entry({'innerText' : {'eventSelectMsg' : 'メールアドレスは半角かつ正しい形式で入力してください。'}});
        } else {
            // 表示切替
            common_op_view({
                'flex'  : ['applicationInfoInputArea'],
                'none'  : ['eventSelectArea', 'lineGroupArea']
            });
            common_text_entry({
                'innerText' : {
                    'eventName' : selectEventName,
                    'mail'      : inputMail.trim(),
                }
            });

            // イベント情報の取得
            var paramDB = {
                'event' : selectEventName,
                'mail'  : inputMail
            };
            opDB('getEvent', paramDB);
        }
    }
}


// ──────────────────────────────────────────────────────
//  応募登録
// ………………………………………………………………………………………………………………………………………………
function registerApplication() {
    common_text_entry({'innerText' : {'applicationInfotMsg' : ''}});

    const eventName             = document.getElementById("eventName").textContent;
    const mail                  = document.getElementById("mail").textContent.trim();
    const inputName             = document.getElementById("inputName").value;
    const inputBirthday         = 
        document.getElementById("inputBirthdayYear").value
        + document.getElementById("inputBirthdayMonth").value
        + document.getElementById("inputBirthdayDay").value
    ;
    const inputJob              = document.getElementById("inputJob").value;
    const inputTell             = document.getElementById("inputTell").value;
    const inputClosestStation   = document.getElementById("inputClosestStation").value;
    let available = '';
    Array.from(document.getElementById("availableInputArea").querySelectorAll("div")).forEach(function(e) {
        var day = e.querySelector("p").textContent;
        var time = '';
        Array.from(e.querySelectorAll("select")).forEach(function(s) {
            time = time + '_' + s.value;
        });
        time = time.includes('×') ? '_×_×' : time;
        available = available == '' 
            ?  day + time
            : available + ',' + day + time
        ;
    });
    const inputMemo             = document.getElementById("inputMemo").value;
    const inputPlatform         = document.getElementById("inputPlatform").value;

    if (
        !eventName ||
        !mail ||
        !inputName ||
        !inputBirthday ||
        !inputJob ||
        !inputTell ||
        !inputClosestStation ||
        !available ||
        !inputPlatform
    ) {
        common_text_entry({'innerText' : {'applicationInfotMsg' : '備考以外のすべての項目に入力が必要です。'}});
    } else {
        var paramDB = {
            'event'             : eventName,
            'mail'              : mail,
            'name'              : inputName,
            'birthday'          : inputBirthday,
            'job'               : inputJob,
            'tell'              : inputTell,
            'closestStation'    : inputClosestStation,
            'available'         : available,
            'memo'              : inputMemo,
            'platform'          : inputPlatform,
            'applicationDt'     : common_date().yyyymmddhhmmss
        };
        opDB('registerApplication', paramDB);
    }
}


// ──────────────────────────────────────────────────────
//  応募編集
// ………………………………………………………………………………………………………………………………………………
function editApplication() {
    const name              = document.getElementById("name").textContent;
    const birthday          = document.getElementById("birthday").textContent;
    const job               = document.getElementById("job").textContent;
    const tell              = document.getElementById("tell").textContent;
    const closestStation    = document.getElementById("closestStation").textContent;
    const available         = document.getElementById("available").innerText;
    const memo              = document.getElementById("memo").innerText;
    const platform          = document.getElementById("platform").textContent;

    // 入力欄の表示
    common_text_entry({
        'innerText' : {
            'inputText' : '下記、必要項目を入力してください。',
        },
        'value' : {
            'inputName'             : name,
            'inputBirthdayYear'     : birthday.slice(0, 4),
            'inputBirthdayMonth'    : birthday.slice(4, 6),
            'inputBirthdayDay'      : birthday.slice(6, 8),
            'inputJob'              : job,
            'inputTell'             : tell,
            'inputClosestStation'   : closestStation,
            'inputMemo'             : memo,
            'inputPlatform'         : platform,
        }
    });
    const availableA = available.split(/\n/);
    let i = 0;
    Array.from(document.getElementById("availableInputArea").querySelectorAll("div")).forEach(function(e) {
        if (availableA[i]) {
            var times   = availableA[i].slice(10).split(/～/)
            var select  = e.querySelectorAll("select");
            select[0].value = times[0].trim();
            select[1].value = times[1].trim();
        }

        i++;
    });

    dispInput();
}


// ──────────────────────────────────────────────────────
//  DBの操作
// ………………………………………………………………………………………………………………………………………………
function opDB(op, paramDB) {
    var strUrl      = "function/db.php";
    const xmlhttp   = new XMLHttpRequest();

    switch (op) {
        case 'getEventListRecruit':
            var param   = "function=" + "get_event_list_recruit";
            xmlhttp.onreadystatechange = function() {
                // 初期値
                common_clear_children({
                    'all'   : {
                        'selectEventName' : 'option',
                    }
                });


                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    if (data) {
                        Object.keys(data).forEach(function(key) {
                            var option = document.createElement("option");
                            common_set_element({
                                'element'   : option,
                                'text'      : data[key],
                                'value'     : data[key]
                            });
                            document.getElementById("selectEventName").appendChild(option);
                        });
                    } else {
                        common_set_element({
                            'element'       : document.getElementById("sendEventSelect"),
                            'disabled'      : true,
                            'background'    : '#ececec',
                            'borderColor'   : '#ececec',
                        });
                        common_text_entry({'innerText' : {'eventSelectMsg' : '※現在、募集中のイベントはございません。'}});
                    }
                }
            }
            break;

        case 'getEvent':
            var param   = "function=" + "get_event"
                + "&event=" + encodeURIComponent(paramDB['event']) 
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    const firstDay  = data.first_day.split(/-/);
                    const endDay    = data.end_day.split(/-/);
                    const startTime = data.start_time.split(/:/);
                    const endTime   = data.end_time.split(/:/);

                    for (
                        let date = new Date(firstDay[0], firstDay[1] - 1 , firstDay[2]);
                        date <= new Date(endDay[0], endDay[1] - 1, endDay[2]);
                        date.setDate(date.getDate() + 1)
                    ){
                        var div = document.createElement("div");
                        common_set_element({
                            'element'   : div,
                            'display'   : 'none',
                        });

                        // 日付
                        var p = document.createElement("p");
                        common_set_element({
                            'element'   : p,
                            'innerText' : date.toLocaleDateString('sv-SE'),
                        });

                        // 開始時間
                        var select1 = document.createElement("select");
                        var option1 = document.createElement("option");
                        common_set_element({
                            'element'   : option1,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        select1.appendChild(option1);

                        // 区切り
                        var span = document.createElement("span");
                        common_set_element({
                            'element'   : span,
                            'innerText' : '～',
                        });

                        // 終了時間
                        var select2 = document.createElement("select");
                        var option2 = document.createElement("option");
                        common_set_element({
                            'element'   : option2,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        select2.appendChild(option2);


                        // 時間選択肢
                        startTime[0] = Number(startTime[0]);
                        startTime[1] = Number(startTime[1]);
                        endTime[0]   = Number(endTime[0]);
                        endTime[1]   = Number(endTime[1]);
                        for (let h = startTime[0]; h <= endTime[0]; h++) {
                            var s = h == startTime[0] ? startTime[1] : 0;
                            var e = h == endTime[0] ? endTime[1] : 45;

                            // 開始
                            for (let m = s; m <= e; m += 15) {
                                option1 = document.createElement("option");
                                common_set_element({
                                    'element'   : option1,
                                    'text'      : h + ':' + m.toString().padStart(2, '0'),
                                    'value'     : h + ':' + m.toString().padStart(2, '0'),
                                    'selected'  : (h == startTime[0] && m == startTime[1] ? 'ture' : ''),
                                });
                                select1.appendChild(option1);
                            }

                            // 終了
                            for (let m = s; m <= e; m += 15) {
                                option2 = document.createElement("option");
                                common_set_element({
                                    'element'   : option2,
                                    'text'      : h + ':' + m.toString().padStart(2, '0'),
                                    'value'     : h + ':' + m.toString().padStart(2, '0'),
                                    'selected'  : (h == endTime[0] && m == endTime[1] ? 'ture': ''),
                                });
                                select2.appendChild(option2);
                            }
                        }

                        // 時間選択肢
                        option1 = document.createElement("option");
                        common_set_element({
                            'element'   : option1,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        option2 = document.createElement("option");
                        common_set_element({
                            'element'   : option2,
                            'text'      : '×',
                            'value'     : '×',
                        });
                        select1.appendChild(option1);
                        select2.appendChild(option2);

                        // 追加
                        div.appendChild(p);
                        div.appendChild(select1);
                        div.appendChild(span);
                        div.appendChild(select2);
                        document.getElementById("availableInputArea").appendChild(div);
                    }

                    // 応募情報の取得
                    var nextParam = {
                        'event' : paramDB['event'],
                        'mail'  : paramDB['mail'].trim()
                    };
                    opDB('getApplicationList', nextParam);
                }
            }
            break;

        case 'getApplicationList':
            var param   = "function=" + "get_application_list"
                + "&event=" + encodeURIComponent(paramDB['event']) 
                + "&mail=" + encodeURIComponent(paramDB['mail']) 
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    // 写真フォーム
                    common_text_entry({'href' : {
                        'photoUrl' : (
                            data.form['url'] 
                            + '&' + data.form['event']  + '=' + encodeURI(paramDB['event'])
                            + '&' + data.form['mail']   + '=' + encodeURI(paramDB['mail'])
                        )
                    }});

                    const application = data.application;
                    if (application) {
                        // 応募済み

                        // 出勤可能日
                        const availableA = application.available.split(/,/);
                        let availableText = '';
                        availableA.forEach(function(d) {
                            var availablD = d.split(/_/);
                            availableText = availableText + (availablD[0] + ' ' + availablD[1] + '～' + availablD[2] + '<br>');
                        });

                        common_text_entry({
                            'innerText' : {
                                'inputText'         : '下記の内容で応募登録されています。',
                                'name'              : application.name,
                                'birthday'          : application.birthday,
                                'job'               : application.job,
                                'tell'              : application.tell,
                                'closestStation'    : application.closest_station,
                                'memo'              : application.memo,
                                'platform'          : application.platform,
                                'applicationDt'     : application.updated_dt,
                            },
                            'innerHTML' : {
                                'available' : availableText,
                            }
                        });

                        dispConfirm();

                        // 編集ボタンの制限
                        var statusOption = ['採用', '採用通知済み', '辞退', '不通', '追加済み', '無断蒸発'];
                        if (statusOption.includes(application.status)) {
                            common_op_view({
                                'none'  : ['editApplicationInfo']
                            });
                        }
                    } else {
                        dispInput();

                        // 応募フォーム
                        const url    = new URL(window.location.href);
                        const params = url.searchParams;
                        if (params.get('platform')) {
                            common_text_entry({
                                'innerText' : {
                                    'platform' : params.get('platform'),
                                },
                                'value' : {
                                    'inputPlatform' : params.get('platform'),
                                }
                            });
                            common_op_view({
                                'block' : ['platform'],
                                'none'  : ['inputPlatform']
                            });
                        }
                    }
                }
            }
            break;

        case 'registerApplication':
            var param   = "function=" + "register_application"
                + "&event="             + encodeURIComponent(paramDB['event'])
                + "&mail="              + encodeURIComponent(paramDB['mail'])
                + "&name="              + encodeURIComponent(paramDB['name'])
                + "&birthday="          + encodeURIComponent(paramDB['birthday'])
                + "&job="               + encodeURIComponent(paramDB['job'])
                + "&tell="              + encodeURIComponent(paramDB['tell'])
                + "&closestStation="    + encodeURIComponent(paramDB['closestStation'])
                + "&available="         + encodeURIComponent(paramDB['available'])
                + "&memo="              + encodeURIComponent(paramDB['memo'])
                + "&platform="          + encodeURIComponent(paramDB['platform'])
                + "&applicationDt="     + encodeURIComponent(paramDB['applicationDt'])
            ;

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    common_text_entry({'innerText' : {'applicationInfotMsg' : ''}});

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        // 出勤可能日
                        const availableA = paramDB['available'].split(/,/);
                        let availableText = '';
                        availableA.forEach(function(d) {
                            var availablD = d.split(/_/);
                            availableText = availableText + (availablD[0] + ' ' + availablD[1] + '～' + availablD[2] + '<br>');
                        });

                        common_text_entry({
                            'innerText' : {
                                'inputText'         : '下記の内容で応募登録されています。',
                                'name'              : paramDB['name'],
                                'birthday'          : paramDB['birthday'],
                                'job'               : paramDB['job'],
                                'tell'              : paramDB['tell'],
                                'closestStation'    : paramDB['closestStation'],
                                'memo'              : paramDB['memo'],
                                'platform'          : paramDB['platform'],
                                'applicationDt'     : paramDB['applicationDt'],
                            },
                            'innerHTML' : {
                                'available' : availableText,
                            }
                        });

                        dispConfirm();
                    } else {
                        common_text_entry({'innerText' : {'applicationInfotMsg' : '応募内容の登録ができませんでした。'}});
                    }
                }
            }
            break;
    }

    xmlhttp.open("POST", strUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}


// ──────────────────────────────────────────────────────
//  入力欄の表示
// ………………………………………………………………………………………………………………………………………………
function dispInput() {
    // 表示／非表示
    common_op_view({
        'block' : ['inputName', 'inputJob', 'inputTell', 'inputClosestStation', 'inputMemo', 'inputPlatform', 'sendApplicationInfo', 'cancelApplicationInfo'],
        'flex'  : ['inputBirthdayArea'],
        'none'  : ['name', 'birthday', 'job', 'tell', 'closestStation', 'available', 'memo', 'platform', 'editApplicationInfo']
    });
    Array.from(document.getElementById("availableInputArea").querySelectorAll("div")).forEach(function(e) {
        e.style.display = 'flex';
    });
}


// ──────────────────────────────────────────────────────
//  確認欄の表示
// ………………………………………………………………………………………………………………………………………………
function dispConfirm() {
    // 表示／非表示
    common_op_view({
        'block' : ['name', 'birthday', 'job', 'tell', 'closestStation', 'available', 'memo', 'platform', 'editApplicationInfo'],
        'none'  : ['inputName', 'inputBirthdayArea', 'inputJob', 'inputTell', 'inputClosestStation', 'inputMemo', 'inputPlatform', 'sendApplicationInfo', 'cancelApplicationInfo']
    });
    Array.from(document.getElementById("availableInputArea").querySelectorAll("div")).forEach(function(e) {
        e.style.display = 'none';
    });
}