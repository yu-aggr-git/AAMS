<?php
    $config = parse_ini_file("../config.ini");

    $function = $_POST['function'];

    try {
        $dbh = pdo();
        $dbh->beginTransaction();

        switch ($function) {
            case 'get_work_report' :
                get_work_report($dbh, $_POST);
                break;

            case 'get_work_report_day' :
                get_work_report_day($dbh, $_POST);
                break;

            case 'register_work_report' :
                register_work_report($dbh, $_POST);
                break;



            case 'check_staff_list' :
                check_staff_list($dbh, $_POST);
                break;

            case 'get_staff_list' :
                get_staff_list($dbh, $_POST);
                break;
                
            case 'register_staff_list' :
                register_staff_list($dbh, $_POST);
                break;   



            case 'check_login_event' :
                check_login_event($dbh, $_POST);
                break;

            case 'get_event' :
                get_event($dbh, $_POST);
                break;

            case 'get_event_list' :
                get_event_list($dbh);
                break;

            case 'get_event_list_recruit' :
                get_event_list_recruit($dbh);
                break;                



            case 'get_staff_list_event' :
                get_staff_list_event($dbh, $_POST);
                break;

            case 'get_staff_list_name' :
                get_staff_list_name($dbh, $_POST);
                break;
                
            case 'check_staff_list_pass' :
                check_staff_list_pass($dbh, $_POST);
                break;

            case 'reset_password' :
                reset_password($dbh, $_POST);
                break;

            case 'register_staff_list_pass' :
                register_staff_list_pass($dbh, $_POST);
                break;

            case 'get_shift_url' :
                get_shift_url($dbh, $_POST);
                break;

            case 'update_staff_list_payslip' :
                update_staff_list_payslip($dbh, $_POST);
                break;



            case 'register_event' :
                register_event($dbh, $_POST);
                break;

            case 'update_event' :
                update_event($dbh, $_POST);
                break;

            case 'delete_event' :
                delete_event($dbh, $_POST);
                break;



            case 'register_work_report_edit' :
                register_work_report_edit($dbh, $_POST);
                break;

            case 'get_work_report_edit_all' :
                get_work_report_edit_all($dbh, $_POST);
                break;                

            case 'get_work_report_edit' :
                get_work_report_edit($dbh, $_POST);
                break;



            case 'update_work_report' :
                update_work_report($dbh, $_POST);
                break;

            case 'check_admin_login' :
                check_admin_login($dbh, $_POST);
                break;



            case 'get_news_list' :
                get_news_list($dbh, $_POST);
                break;

            case 'register_news' :
                register_news($dbh, $_POST);
                break;

            case 'delete_news' :
                delete_news($dbh, $_POST);
                break;


                
            case 'get_application_list' :
                get_application_list($dbh, $_POST);
                break;

            case 'register_application' :
                register_application($dbh, $_POST);
                break;
        }

        $dbh->commit();
    } catch (PDOException $e) {
        $dbh->rollBack();

        // print("データベースの接続に失敗しました" . $e->getMessage());

        date_default_timezone_set('Asia/Tokyo');
        $msg = 
            "{" . date('Y-m-d H:i:s') . "}" . 
            "{" . $function . "}" . 
            "{" . var_export($_POST , true) . "}" .
            "{" . $e->getMessage() . "}" . "\n"
        ;
        file_put_contents('../log/error_log.txt', print_r($msg, true), FILE_APPEND);

        die();
    }

    // 接続を閉じる
    $dbh = null;

    // ────DB接続─────────────────────────────
    function pdo() {
        global $config;

        $servername = $config['servername'];
        $username   = $config['username'];
        $password   = $config['password'];
        $port       = $config['port']; 
        $dbname     = $config['dbname'];

        $dbh = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
        return $dbh;
    }



    // ────勤怠情報：取得─────────────────────────────
    function get_work_report($dbh, $param) {
        $query = "
            SELECT *
            FROM work_report
            WHERE
                    event = :event
                AND name = :name
            ORDER BY day asc 
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'name'  => $param['name']
        ]);

        // 結果を配列で取得
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[] = array(
                'day'       => $row['day'],
                'start'     => $row['start'],
                'end'       => $row['end'],
                'break1s'   => $row['break1s'],
                'break1e'   => $row['break1e'],
                'break2s'   => $row['break2s'],
                'break2e'   => $row['break2e'],
                'break3s'   => $row['break3s'],
                'break3e'   => $row['break3e'],
            );
        }

        // PHPの配列をJSON形式のデータに変換
        $json = json_encode($employeeData);

        echo $json;
    }

    // ────勤怠情報：取得（1日）───────────────────────
    function get_work_report_day($dbh, $param) {
        $query = "
            SELECT *
            FROM work_report
            WHERE
                    event = :event
                AND name = :name
                AND day = :day
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'name'  => $param['name'],
            'day'   => $param['day']
        ]);
        
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        echo $result ? json_encode($result) : '';
    }

    // ────勤怠情報：登録─────────────────────────────
    function register_work_report($dbh, $param) {
        $query = "
            INSERT INTO
                work_report(event, name, day, start, end, break1s, break1e, break2s, break2e, break3s, break3e)
            VALUES
                (:event, :name, :day, :start, :end, :break1s, :break1e, :break2s, :break2e, :break3s, :break3e)
            ON DUPLICATE KEY UPDATE
                start   = IF(start   IS NULL, VALUES(start), start),
                end     = IF(end     IS NULL, VALUES(end), end),
                break1s = IF(break1s IS NULL, VALUES(break1s), break1s),
                break1e = IF(break1e IS NULL, VALUES(break1e), break1e),
                break2s = IF(break2s IS NULL, VALUES(break2s), break2s),
                break2e = IF(break2e IS NULL, VALUES(break2e), break2e),
                break3s = IF(break3s IS NULL, VALUES(break3s), break3s),
                break3e = IF(break3e IS NULL, VALUES(break3e), break3e)
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'event'     => $param['event'],
            'name'      => $param['name'],
            'day'       => $param['day'],
            'start'     => $param['start']   ? $param['start'] : null,
            'end'       => $param['end']     ? $param['end'] : null,
            'break1s'   => $param['break1s'] ? $param['break1s'] : null,
            'break1e'   => $param['break1e'] ? $param['break1e'] : null,
            'break2s'   => $param['break2s'] ? $param['break2s'] : null,
            'break2e'   => $param['break2e'] ? $param['break2e'] : null,
            'break3s'   => $param['break3s'] ? $param['break3s'] : null,
            'break3e'   => $param['break3e'] ? $param['break3e'] : null
        ]);

        echo $count;
    }



    // ────スタッフリスト：確認─────────────────────────────
    function check_staff_list($dbh, $param) {
        $query = "
            SELECT *
            FROM staff_list
            WHERE
                mail = :mail
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'mail'  => $param['inputStaffMail']
        ]);

        // 結果を返却
        $result = [];
        $resultPass = '';
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $result[$row['event']] = $row;

            if ($row['pass']) {
                $resultPass = $row['pass'];
            }
        }

        if ($resultPass) {
            $check = password_verify($param['inputStaffPass'], $resultPass);
        } else {
            $check = $param['inputStaffPass'] == $result[$param['inputStaffEventName']]['birthday'] ? true : false;
        }

        // ログイン日時の更新
        if ($check) {
            $query2 = "
                UPDATE
                    staff_list
                SET
                    login_dt = :loginDt
                WHERE
                    mail = :mail
            ";
            $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
            $sth2->execute([
                'mail'      => $param['inputStaffMail'],
                'loginDt'   => $param['loginDt'],
            ]);
        }

        echo $check ? 'true' : 'false';
    }

    // ────スタッフリスト：取得─────────────────────────────
    function get_staff_list($dbh, $param) {
        $query = "
            SELECT no, name, mail, birthday, payslip
            FROM staff_list
            WHERE
                    event = :event
            ORDER BY no asc
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event']
        ]);

        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[] = $row;
        }

        $json = json_encode($employeeData);
        echo $json;
    }

    // ────スタッフリスト：取得（イベント）──────────────────
    function get_staff_list_event($dbh, $param) {
        $query = "
            SELECT
                e.event
            FROM
                staff_list s
            LEFT JOIN
                event e
                ON s.event = e.event
            WHERE
                s.mail = :mail
            ORDER
                BY e.first_day desc 
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'mail' => $param['staffUser']
        ]);

        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[] = $row['event'];
        }

        $json = json_encode($employeeData);
        echo $json;
    }

    // ────スタッフリスト：取得（名前）──────────────────────
    function get_staff_list_name($dbh, $param) {
        $query = "
            SELECT *
            FROM staff_list
            WHERE 
                    event = :event
                AND mail = :mail
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'mail'  => $param['mail']
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $json = json_encode($result);
        echo $json;
    }
    
    // ────スタッフリスト：取得（パス）──────────────────────
    function check_staff_list_pass($dbh, $param) {
        $query = "
            SELECT *
            FROM staff_list
            WHERE
                mail = :mail
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'mail'  => $param['mail']
        ]);

        // 結果を返却
        $resultPass = '';
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            if ($row['pass']) {
                $resultPass = $row['pass'];                
            }
        }

        echo $resultPass ? 'true' : 'false';
    }

    // ────スタッフリスト：パスワードリセット─────────────────
    function reset_password($dbh, $param) {
        $query = "
            UPDATE
                staff_list
            SET
                pass = null
            WHERE
                mail = :mail
        ";
        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'mail'      =>  $param['inputStaffMail']
        ]);

        echo $sth->rowCount();
    }

    // ────スタッフリスト：登録（パス）─────────────────────────────
    function register_staff_list_pass($dbh, $param) {
        $query = "
            UPDATE
                staff_list
            SET
                pass = :pass
            WHERE
                mail = :mail
        ";
        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'mail'  => $param['mail'],
            'pass'  => password_hash($param['pass'], PASSWORD_DEFAULT),
        ]);

        echo $count;
    }

    // ────スタッフリスト：登録─────────────────────────────
    function register_staff_list($dbh, $param) {

        $names = [];
        foreach (explode(",", $param['staffList']) as $staff) {
            if ($staff) {
                $staffArray = explode(":", $staff);
                $no   = $staffArray[0];
                $name = $staffArray[1];
                $mail = $staffArray[2] ? $staffArray[2] : '';
                $birthday = $staffArray[3] ? $staffArray[3] : '';

                $query1 = "
                    INSERT INTO
                        staff_list(event, no, name, mail, birthday)
                    VALUES
                        (:event, :no, :name, :mail, :birthday)
                    ON DUPLICATE KEY UPDATE
                        no          = VALUES(no),
                        mail        = VALUES(mail),
                        birthday    = VALUES(birthday)
                ";
                $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                $sth1->execute([
                    'event'     => $param['event'],
                    'no'        => $no,
                    'name'      => $name,
                    'mail'      => $mail,
                    'birthday'  => $birthday
                ]);

                $names[] = $name;
            }
        }

        $namesNum = count($names);
        array_unshift($names, $param['event']);
        $query2 = "
            DELETE FROM
                staff_list
            WHERE
                event = ?
        ";
        if ($namesNum >= 1) {
            $query2 .= " AND name NOT IN (" . substr(str_repeat(',?', $namesNum), 1) . ")";
        }
        $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth2->execute($names);
    }

    // ────スタッフリスト：更新（給与明細）─────────────────────────────
    function update_staff_list_payslip($dbh, $param) {

        foreach (explode(",", $param['payslipList']) as $staff) {
            if ($staff) {
                $staffArray = explode("|", $staff);
                $name    = $staffArray[0];
                $payslip = $staffArray[1];
                
                $query = "
                    UPDATE
                        staff_list
                    SET
                        payslip = :payslip
                    WHERE
                            event = :event
                        AND name = :name
                ";
                $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                $count = $sth->execute([
                    'event'     => $param['event'],
                    'name'      => $name,
                    'payslip'   => $payslip
                ]);
            }
        }

        echo $count;
    }



    // ────イベント：ログイン───────────────────────────────
    function check_login_event($dbh, $param) {
        $query = "
            SELECT pass
            FROM event
            WHERE
                    event = :event
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $check = password_verify($param['pass'], $result['pass']);
        echo $check ? 'true' : 'false';
    }

    // ────イベント：取得─────────────────────────────
    function get_event($dbh, $param) {
        $query = "
            SELECT *
            FROM event
            WHERE event = :event
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event']
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $json = json_encode($result);
        echo $json;
    }

    // ────イベント：リスト取得─────────────────────────────
    function get_event_list($dbh) {
        $query = "
            SELECT event
            FROM event
            ORDER BY first_day desc 
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute();

        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[] = $row['event'];
        }

        $json = json_encode($employeeData);
        echo $json;
    }

    // ────イベント：リスト取得（募集中）─────────────────────────────
    function get_event_list_recruit($dbh) {
        $query = "
            SELECT event
            FROM event
            WHERE recruit = '募集中'
            ORDER BY first_day desc 
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute();

        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[] = $row['event'];
        }

        $json = json_encode($employeeData);
        echo $json;
    }

    // ────イベント：URL取得─────────────────────────────
    function get_shift_url($dbh, $param) {
        $query = "
            SELECT shift_url
            FROM event
            WHERE event = :event
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event']
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        echo $result ? $result['shift_url'] : '';
    }
    
    // ────イベント：登録─────────────────────────────
    function register_event($dbh, $param) {
        $query = "
            INSERT INTO
                event(event, pass, first_day, end_day, start_time, end_time, shift_url, recruit)
            VALUES
                (:event, :pass, :firstDay, :endDay, :start_time, :end_time, :shiftUrl, :recruit)
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'recruit'       => $param['recruit'],
            'event'         => $param['event'],
            'pass'          => password_hash($param['pass'], PASSWORD_DEFAULT),
            'firstDay'      => $param['firstDay'],
            'endDay'        => $param['endDay'],
            'start_time'    => $param['start_time'],
            'end_time'      => $param['end_time'],
            'shiftUrl'      => $param['shiftUrl']
        ]);

        $nextParam = [
            'event'     => $param['event'],
            'staffList' => $param['staffList']
        ];
        register_staff_list($dbh, $nextParam);

        echo $count;
    }

    // ────イベント：更新─────────────────────────────
    function update_event($dbh, $param) {
        $query = "
            UPDATE
                event
            SET
                pass        = IF(:pass IS NULL, pass, :pass),
                first_day   = :firstDay,
                end_day     = :endDay,
                start_time  = :start_time,
                end_time    = :end_time,
                shift_url   = :shiftUrl,
                recruit     = :recruit
            WHERE
                event = :event
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'recruit'       => $param['recruit'],
            'event'         => $param['event'],
            'pass'          => $param['pass'] ? password_hash($param['pass'], PASSWORD_DEFAULT) : null,
            'firstDay'      => $param['firstDay'],
            'endDay'        => $param['endDay'],
            'start_time'    => $param['start_time'],
            'end_time'      => $param['end_time'],
            'shiftUrl'      => $param['shiftUrl']
        ]);

        $nextParam = [
            'event'     => $param['event'],
            'staffList' => $param['staffList']
        ];
        register_staff_list($dbh, $nextParam);

        echo $count;
    }

    // ────イベント：削除─────────────────────────────
    function delete_event($dbh, $param) {
        // イベント
        $query1 = "
            DELETE FROM
                event
            WHERE
                event = :event
        ";
        $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth1->execute([
            'event'     => $param['event'],
        ]);

        // スタッフリスト
        $query2 = "
            DELETE FROM
                staff_list
            WHERE
                event = :event
        ";
        $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth2->execute([
            'event'     => $param['event'],
        ]);

        // 勤怠情報
        $query3 = "
            DELETE FROM
                work_report
            WHERE
                event = :event
        ";
        $sth3 = $dbh->prepare($query3, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth3->execute([
            'event'     => $param['event'],
        ]);

        // 勤怠修正情報
        $query4 = "
            DELETE FROM
                work_report_edit
            WHERE
                event = :event
        ";
        $sth4 = $dbh->prepare($query4, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth4->execute([
            'event'     => $param['event'],
        ]);

        echo $count;
    }


    
    // ────勤怠修正情報：登録─────────────────────────────
    function register_work_report_edit($dbh, $param) {
        $query = "
            INSERT IGNORE INTO
                work_report_edit(request_dt, event, name, day, item, data_before, data_after, reason, status, approval_d)
            VALUES
                (:requestDt, :event, :name, :day, :item, :before, :after, :reason, :status, :approvalD)
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'requestDt' => $param['requestDt'],
            'event'     => $param['event'],
            'name'      => $param['name'],
            'day'       => $param['day'],
            'item'      => $param['item'],
            'before'    => $param['before'],
            'after'     => $param['after'],
            'reason'    => $param['reason'],
            'status'    => $param['status'],
            'approvalD' => $param['approvalD'] ?: null ,
        ]);

        echo $count;
    }

    // ────勤怠修正情報：取得─────────────────────────────
    function get_work_report_edit_all($dbh, $param) {
        $query = "
            SELECT *
            FROM work_report_edit
            WHERE
                    event = :event
            ORDER BY 
                name asc, 
                day asc
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
        ]);

        // 結果を配列で取得
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[$row['name']][$row['day']][$row['item']][] = array(
                'status'        => $row['status'],
                'data_before'   => $row['data_before'],
                'data_after'    => $row['data_after'],
                'reason'        => $row['reason'],
                'request_dt'    => $row['request_dt'],
                'approval_d'    => $row['approval_d']
            );
        }

        // PHPの配列をJSON形式のデータに変換
        $json = json_encode($employeeData);

        echo $json;
    }
    
    // ────勤怠修正情報：取得（名前）──────────────────────────
    function get_work_report_edit($dbh, $param) {
        $query = "
            SELECT *
            FROM work_report_edit
            WHERE
                    event = :event
                AND name = :name
            ORDER BY day asc 
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'name'  => $param['name']
        ]);

        // 結果を配列で取得
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[$row['day']][$row['item']][] = array(
                'status'        => $row['status'],
                'data_before'   => $row['data_before'],
                'data_after'    => $row['data_after'],
                'reason'        => $row['reason'],
                'request_dt'    => $row['request_dt'],
                'approval_d'    => $row['approval_d']
            );
        }

        // PHPの配列をJSON形式のデータに変換
        $json = json_encode($employeeData);
        echo $json;
    }

    // ────勤怠情報・勤怠修正情報：更新─────────────────────────────
    function update_work_report($dbh, $param) {
        $query1 = "
            UPDATE
                work_report_edit
            SET
                status      = :statusAfter,
                approval_d  = :approvalD
            WHERE
                    request_dt  = :requestDt
                AND event       = :event
                AND name        = :name
                AND day         = :day
                AND item        = :item
        ;";

        $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth1->execute([
            'statusAfter'   => $param['statusAfter'],
            'requestDt'     => $param['requestDt'],
            'event'         => $param['event'],
            'name'          => $param['name'],
            'day'           => $param['day'],
            'item'          => $param['item'],
            'approvalD'     => $param['approvalD'],
        ]);

        $query2 = "
            INSERT INTO
                work_report(event, name, day, start, end, break1s, break1e, break2s, break2e, break3s, break3e)
            VALUES
                (:event, :name, :day, :start, :end, :break1s, :break1e, :break2s, :break2e, :break3s, :break3e)
            ON DUPLICATE KEY UPDATE
                start   = IF(VALUES(start)   IS NULL, start,   IF(VALUES(start)     = '×:×', '-', VALUES(start))),
                end     = IF(VALUES(end)     IS NULL, end,     IF(VALUES(end)       = '×:×', '-', VALUES(end))),
                break1s = IF(VALUES(break1s) IS NULL, break1s, IF(VALUES(break1s)   = '×:×', '-', VALUES(break1s))),
                break1e = IF(VALUES(break1e) IS NULL, break1e, IF(VALUES(break1e)   = '×:×', '-', VALUES(break1e))),
                break2s = IF(VALUES(break2s) IS NULL, break2s, IF(VALUES(break2s)   = '×:×', '-', VALUES(break2s))),
                break2e = IF(VALUES(break2e) IS NULL, break2e, IF(VALUES(break2e)   = '×:×', '-', VALUES(break2e))),
                break3s = IF(VALUES(break3s) IS NULL, break3s, IF(VALUES(break3s)   = '×:×', '-', VALUES(break3s))),
                break3e = IF(VALUES(break3e) IS NULL, break3e, IF(VALUES(break3e)   = '×:×', '-', VALUES(break3e)))
        ";

        $nextParam = [
            'event'     => $param['event'],
            'name'      => $param['name'],
            'day'       => $param['day'],
            'start'     => null,
            'end'       => null,
            'break1s'   => null,
            'break1e'   => null,
            'break2s'   => null,
            'break2e'   => null,
            'break3s'   => null,
            'break3e'   => null
        ];
        $nextParam[$param['item']] = $param['after'];

        $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth2->execute($nextParam);

        echo $count;
    }



    // ────管理者ユーザー：ログイン─────────────────────────────────
    function check_admin_login($dbh, $param) {
        $query = "
            SELECT pass
            FROM admin_user
            WHERE
                name = :name
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'name' => $param['inputAdminUser'],
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $check = password_verify($param['inputAdminUserPass'], $result['pass']);
        echo $check ? 'true' : 'false';
    }



    // ────お知らせ：リスト取得─────────────────────────────
    function get_news_list($dbh, $param) {
        $query = "
            SELECT *
            FROM news
            WHERE status = :status 
            ORDER BY register_dt desc 
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'status' => $param['status']
        ]);

        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[] = $row;
        }

        $json = json_encode($employeeData);
        echo $json;
    }

    // ────お知らせ：登録─────────────────────────────
    function register_news($dbh, $param) {
        $query = "
            INSERT INTO
                news(register_dt, title, body, link, status)
            VALUES
                (:requestDt, :title, :body, :link, :status)
            ON DUPLICATE KEY UPDATE
                body    = VALUES(body),
                link    = VALUES(link),
                status  = VALUES(status)
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'requestDt'     => $param['requestDt'],
            'title'         => $param['title'],
            'body'          => $param['body'],
            'link'          => $param['link'],
            'status'        => $param['status']
        ]);

        echo $count;
    }

    // ────お知らせ：削除─────────────────────────────
    function delete_news($dbh, $param) {

        $query = "
            DELETE FROM
                news
            WHERE
                title = :title
        ";
        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'title'     => $param['title'],
        ]);

        echo $count;
    }



    // ────応募リスト：個人取得─────────────────────────────
    function get_application_list($dbh, $param) {
        global $config;

        $query = "
            SELECT *
            FROM application_list
            WHERE
                    event = :event
                AND mail = :mail
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'mail' => $param['mail']
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $result = array(
            'application'   => $result,
            'form'          => array(
                'url'   => $config['photo_form'],
                'event' => $config['photo_form_event'],
                'mail'  => $config['photo_form_mail'],
                'name'  => $config['photo_form_name']
            )
        );

        $json = json_encode($result);
        echo $json;
    }

    // ────応募リスト：登録─────────────────────────────
    function register_application($dbh, $param) {
        $query = "
            INSERT INTO
                application_list(
                    event,
                    no,
                    name,
                    mail,
                    birthday,
                    job,
                    tell,
                    closest_station,
                    available,
                    memo,
                    platform,
                    created_dt,
                    updated_dt,
                    status
                )
            VALUES
                (
                    :event,
                    (
                        SELECT
                            CASE
                                WHEN EXISTS (SELECT 1 FROM application_list al WHERE al.event = :event) 
                                THEN (
                                    SELECT al2.no 
                                    FROM application_list al2 
                                    WHERE al2.event = :event 
                                    ORDER BY al2.no DESC 
                                    LIMIT 1
                                ) + 1 

                                ELSE 1
                            END AS newNo
                    ),
                    :name,
                    :mail,
                    :birthday,
                    :job,
                    :tell,
                    :closestStation,
                    :available,
                    :memo,
                    :platform,
                    :applicationDt,
                    :applicationDt,
                    '応募受付'
                )
            ON DUPLICATE KEY UPDATE
                name            = VALUES(name),
                mail            = VALUES(mail),
                birthday        = VALUES(birthday),
                job             = VALUES(job),
                tell            = VALUES(tell),
                closest_station = VALUES(closest_station),
                available       = VALUES(available),
                memo            = VALUES(memo),
                platform        = VALUES(platform),
                updated_dt      = VALUES(updated_dt)
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'event'             => $param['event'],
            'mail'              => $param['mail'],
            'name'              => $param['name'],
            'birthday'          => $param['birthday'],
            'job'               => $param['job'],
            'tell'              => $param['tell'],
            'closestStation'    => $param['closestStation'],
            'available'         => $param['available'],
            'memo'              => $param['memo'],
            'platform'          => $param['platform'],
            'applicationDt'     => $param['applicationDt']
        ]);

        echo $count;
    }
    