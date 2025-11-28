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

// イベント選択
function eventSelect() {
    document.getElementById("eventSelectMsg").innerText = '';

    var selectEventName = document.getElementById("selectEventName").value;
    var inputMail = document.getElementById("inputMail").value;

    if (!selectEventName || !inputMail) {
        document.getElementById("eventSelectMsg").innerText = 'すべての項目に入力が必要です。';
    } else {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!emailRegex.test(inputMail)) {
            // メールバリデーション
            document.getElementById("eventSelectMsg").innerText = 'メールアドレスは半角かつ正しい形式で入力してください。';
        } else {
            // イベント情報の取得
            var paramDB = {
                'event' : selectEventName
            };
            opDB('getEvent', paramDB);

            // 表示切替
            document.getElementById("applicationInfoInputArea").style.display   = 'flex';
            document.getElementById("eventSelectArea").style.display            = 'none';
            document.getElementById("eventName").innerText                      = selectEventName;
            document.getElementById("mail").innerText                           = inputMail;

            // 応募情報の取得
            var paramDB = {
                'event' : selectEventName,
                'mail'  : inputMail
            };
            opDB('getApplicationList', paramDB);
        }
    }
}


// 応募登録
function registerApplication() {
    document.getElementById("applicationInfotMsg").innerText = '';

    const eventName             = document.getElementById("eventName").textContent;
    const mail                  = document.getElementById("mail").textContent;
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
        document.getElementById("applicationInfotMsg").innerText = '備考以外のすべての項目に入力が必要です。';
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
            'applicationDt'     : date().yyyymmddhhmmss
        };
        opDB('registerApplication', paramDB);
    }
}


// 応募編集
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
    document.getElementById("inputName").value              = name;
    document.getElementById("inputBirthdayYear").value      = birthday.slice(0, 4);
    document.getElementById("inputBirthdayMonth").value     = birthday.slice(4, 6);
    document.getElementById("inputBirthdayDay").value       = birthday.slice(6, 8);
    document.getElementById("inputJob").value               = job;
    document.getElementById("inputTell").value              = tell;
    document.getElementById("inputClosestStation").value    = closestStation;
    const availableA        = available.split(/\n/);
    let i = 0;
    Array.from(document.getElementById("availableInputArea").querySelectorAll("div")).forEach(function(e) {
        var times = availableA[i].slice(10).split(/～/)
        var select = e.querySelectorAll("select");

        select[0].value = times[0].trim();
        select[1].value = times[1].trim();

        i++;
    });
    document.getElementById("inputMemo").value              = memo;
    document.getElementById("inputPlatform").value          = platform;
    document.getElementById("inputText").innerText          = '下記、必要項目を入力してください。';

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
                const select = document.getElementById("selectEventName");

                Array.from(select.querySelectorAll("option")).forEach(function(e) {
                    e.remove();
                });

                if (this.readyState == 4 && this.status == 200) {
                    const data = JSON.parse(this.response);

                    Object.keys(data).forEach(function(key) {
                        var option = document.createElement("option");
                        option.text = data[key];
                        option.value = data[key];
                        select.appendChild(option);
                    });
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

                    const availableInputArea = document.getElementById("availableInputArea");
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

                        // 日付
                        var p = document.createElement("p");
                        p.innerText = date.toLocaleDateString('sv-SE');

                        // 開始時間                        
                        var select1 = document.createElement("select");
                        var option1 = document.createElement("option");
                        option1.text = '×';
                        option1.value = '×';
                        select1.appendChild(option1);

                        // 区切り
                        var span = document.createElement("span");
                        span.innerText = '～';

                        // 終了時間
                        var select2 = document.createElement("select");
                        var option2 = document.createElement("option");
                        option2.text = '×';
                        option2.value = '×';
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
                                option1.text = h + ':' + m.toString().padStart(2, '0');
                                option1.value = h + ':' + m.toString().padStart(2, '0');
                                if (h == startTime[0] && m == startTime[1]) {
                                    option1.selected = 'ture';
                                }
                                select1.appendChild(option1);
                            }

                            // 終了
                            for (let m = s; m <= e; m += 15) {
                                option2 = document.createElement("option");
                                option2.text = h + ':' + m.toString().padStart(2, '0');
                                option2.value = h + ':' + m.toString().padStart(2, '0');
                                if (h == endTime[0] && m == endTime[1]) {
                                    option2.selected = 'ture';
                                }
                                select2.appendChild(option2);
                            }
                        }

                        // 時間選択肢
                        option1 = document.createElement("option");
                        option1.text = '×';
                        option1.value = '×';
                        select1.appendChild(option1);                        
                        option2 = document.createElement("option");
                        option2.text = '×';
                        option2.value = '×';
                        select2.appendChild(option2);

                        // 追加
                        div.appendChild(p);
                        div.appendChild(select1);
                        div.appendChild(span);
                        div.appendChild(select2);
                        div.style.display = "none";
                        availableInputArea.appendChild(div);
                    }
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

                    const application = data.application;
                    const form_url = data.form['url'] 
                        + '&' + data.form['event']  + '=' + encodeURI(paramDB['event'])
                        + '&' + data.form['mail']   + '=' + encodeURI(paramDB['mail'])
                    ;

                    if (application) {
                        // 応募済み
                        const availableA = application.available.split(/,/);
                        let availableText = '';
                        availableA.forEach(function(d) {
                            var availablD = d.split(/_/);
                            availableText = availableText + (availablD[0] + ' ' + availablD[1] + '～' + availablD[2] + '<br>');
                        });

                        document.getElementById("name").innerText           = application.name;
                        document.getElementById("birthday").innerText       = application.birthday;
                        document.getElementById("job").innerText            = application.job;
                        document.getElementById("tell").innerText           = application.tell;
                        document.getElementById("closestStation").innerText = application.closest_station;                        
                        document.getElementById("available").innerHTML      = availableText;
                        document.getElementById("memo").innerText           = application.memo;
                        document.getElementById("platform").innerText       = application.platform;
                        document.getElementById("photoUrl").href            = form_url;
                        document.getElementById("applicationDt").innerText  = application.updated_dt;
                        document.getElementById("inputText").innerText      = "下記の内容で応募登録されています。";

                        dispConfirm();
                    } else {
                        dispInput();
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
                    document.getElementById("applicationInfotMsg").innerText = '';

                    // 登録完了
                    if (this.response == 1) {
                        // console.log(this.response, '登録');

                        const availableA = paramDB['available'].split(/,/);
                        let availableText = '';
                        availableA.forEach(function(d) {
                            var availablD = d.split(/_/);
                            availableText = availableText + (availablD[0] + ' ' + availablD[1] + '～' + availablD[2] + '<br>');
                        });
                        
                        document.getElementById("name").innerText           = paramDB['name'];
                        document.getElementById("birthday").innerText       = paramDB['birthday'];
                        document.getElementById("job").innerText            = paramDB['job'];
                        document.getElementById("tell").innerText           = paramDB['tell'];
                        document.getElementById("closestStation").innerText = paramDB['closestStation'];
                        document.getElementById("available").innerHTML      = availableText;
                        document.getElementById("memo").innerText           = paramDB['memo'];
                        document.getElementById("platform").innerText       = paramDB['platform'];
                        document.getElementById("applicationDt").innerText  = paramDB['applicationDt'];
                        document.getElementById("inputText").innerText      = "下記の内容で応募登録されています。";
                        
                        dispConfirm();                        
                    } else {
                        document.getElementById("applicationInfotMsg").innerText = '応募内容の登録ができませんでした。';
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


// 入力欄の表示
function dispInput() {
    // 表示
    document.getElementById("inputName").style.display              = 'block';
    document.getElementById("inputBirthdayArea").style.display      = 'flex';
    document.getElementById("inputJob").style.display               = 'block';
    document.getElementById("inputTell").style.display              = 'block';
    document.getElementById("inputClosestStation").style.display    = 'block';
    Array.from(document.getElementById("availableInputArea").querySelectorAll("div")).forEach(function(e) {
        e.style.display = 'flex';
   });
    document.getElementById("inputMemo").style.display              = 'block';
    document.getElementById("inputPlatform").style.display          = 'block';
    document.getElementById("sendApplicationInfo").style.display    = 'block';
    document.getElementById("cancelApplicationInfo").style.display  = 'block';   

    
    // 非表示
    document.getElementById("name").style.display           = 'none';
    document.getElementById("birthday").style.display       = 'none';
    document.getElementById("job").style.display            = 'none';
    document.getElementById("tell").style.display           = 'none';
    document.getElementById("closestStation").style.display = 'none';
    document.getElementById("available").style.display      = 'none';
    document.getElementById("memo").style.display           = 'none';
    document.getElementById("platform").style.display       = 'none';
    document.getElementById("editApplicationInfo").style.display  = 'none';
}


// 確認欄の表示
function dispConfirm() {
    // 表示
    document.getElementById("name").style.display           = 'block';
    document.getElementById("birthday").style.display       = 'block';
    document.getElementById("job").style.display            = 'block';
    document.getElementById("tell").style.display           = 'block';
    document.getElementById("closestStation").style.display = 'block';
    document.getElementById("available").style.display      = 'block';
    document.getElementById("memo").style.display           = 'block';
    document.getElementById("platform").style.display       = 'block';
    document.getElementById("editApplicationInfo").style.display  = 'block';

    // 非表示
    document.getElementById("inputName").style.display              = 'none';
    document.getElementById("inputBirthdayArea").style.display      = 'none';
    document.getElementById("inputJob").style.display               = 'none';
    document.getElementById("inputTell").style.display              = 'none';
    document.getElementById("inputClosestStation").style.display    = 'none';
    Array.from(document.getElementById("availableInputArea").querySelectorAll("div")).forEach(function(e) {
        e.style.display = 'none';
    });
    document.getElementById("inputMemo").style.display              = 'none';
    document.getElementById("inputPlatform").style.display          = 'none';
    document.getElementById("sendApplicationInfo").style.display    = 'none';
    document.getElementById("cancelApplicationInfo").style.display  = 'none';
}