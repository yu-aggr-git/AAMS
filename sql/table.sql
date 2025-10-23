drop table aams.work_report;
create table aams.work_report(
    event   VARCHAR(100) NOT NULL                           COMMENT 'イベント名',
    name    VARCHAR(30) NOT NULL                            COMMENT '氏名',
    day     VARCHAR(10) NOT NULL                            COMMENT '日付(yyyy-mm-dd)',
    start   VARCHAR(8)                                      COMMENT '開始時間(hh:mm:ss)',
    end     VARCHAR(8)                                      COMMENT '終了時間(hh:mm:ss)',
    break1s VARCHAR(8)                                      COMMENT '休憩1開始(hh:mm:ss)',
    break1e VARCHAR(8)                                      COMMENT '休憩1終了(hh:mm:ss)',
    break2s VARCHAR(8)                                      COMMENT '休憩2開始(hh:mm:ss)',
    break2e VARCHAR(8)                                      COMMENT '休憩2終了(hh:mm:ss)',
    break3s VARCHAR(8)                                      COMMENT '休憩3開始(hh:mm:ss)',
    break3e VARCHAR(8)                                      COMMENT '休憩3終了(hh:mm:ss)',
    PRIMARY KEY (event, name, day)
);

drop table aams.event;
create table aams.event(
    event       VARCHAR(100) NOT NULL                            COMMENT 'イベント名',
    pass        VARCHAR(255) NOT NULL                            COMMENT 'パスワード',
    first_day   VARCHAR(10)  NOT NULL                            COMMENT '開催初日(yyyy-mm-dd)',
    end_day     VARCHAR(10)  NOT NULL                            COMMENT '開催最終日(yyyy-mm-dd)',
    shift_url   VARCHAR(255)                                     COMMENT 'シフトURL',
    PRIMARY KEY (event)
);

drop table aams.staff_list;
create table aams.staff_list(
    event       VARCHAR(100) NOT NULL                            COMMENT 'イベント名',
    no          INTEGER      NOT NULL                            COMMENT 'No.',
    name        VARCHAR(30)  NOT NULL                            COMMENT '氏名',
    mail        VARCHAR(255)                                     COMMENT 'メールアドレス',
    birthday    VARCHAR(8)                                       COMMENT '生年月日',
    pass        VARCHAR(255)                                     COMMENT 'パスワード',
    login_dt    VARCHAR(19)                                      COMMENT 'ログイン日時',
    PRIMARY KEY (event, name)
);

drop table aams.work_report_edit;
create table aams.work_report_edit(
    request_dt  VARCHAR(19)                                     COMMENT '申請日時',
    event       VARCHAR(100) NOT NULL                           COMMENT 'イベント名',
    name        VARCHAR(30)  NOT NULL                           COMMENT '氏名',
    day         VARCHAR(10)  NOT NULL                           COMMENT '日付(yyyy-mm-dd)',
    item        VARCHAR(10)  NOT NULL                           COMMENT '項目',
    data_before VARCHAR(8)                                      COMMENT '修正前(hh:mm:ss)',
    data_after  VARCHAR(8)                                      COMMENT '修正後(hh:mm:ss)',
    reason      VARCHAR(100)                                    COMMENT '理由',
    status      VARCHAR(10)                                     COMMENT '状態',
    approval_d  VARCHAR(10)                                     COMMENT '処理日',
    PRIMARY KEY (request_dt, event, name, day, item)
);

drop table aams.admin_user;
create table aams.admin_user(
    name        VARCHAR(100) NOT NULL                            COMMENT 'ユーザー名',
    pass        VARCHAR(255) NOT NULL                            COMMENT 'パスワード',
    PRIMARY KEY (name)
);


drop table aams.news;
create table aams.news(
    register_dt VARCHAR(19) NOT NULL                            COMMENT '登録日時',
    title       VARCHAR(100) NOT NULL                           COMMENT 'タイトル',
    body        VARCHAR(1000)                                   COMMENT '内容',
    link        VARCHAR(255)                                    COMMENT 'リンク',
    status      VARCHAR(10) NOT NULL                            COMMENT '状態',
    PRIMARY KEY (title)
);
