<?php
    $config = parse_ini_file("../config.ini");

    $function = $_POST['function'];

    try {
        $dbh = pdo();
        $dbh->beginTransaction();

        switch ($function) {

            // 勤怠情報
            case 'get_work_report' :
                get_work_report($dbh, $_POST);
                break;

            case 'get_work_report_day' :
                get_work_report_day($dbh, $_POST);
                break;
            
            case 'get_work_report_day_all' :
                get_work_report_day_all($dbh, $_POST);
                break;

            case 'register_work_report' :
                register_work_report($dbh, $_POST);
                break;


            // スタッフリスト
            case 'check_staff_list' :
                check_staff_list($dbh, $_POST);
                break;

            case 'get_staff_list' :
                get_staff_list($dbh, $_POST);
                break;
            
            case 'get_staff_list_shift' :
                get_staff_list_shift($dbh, $_POST);
                break;

            case 'register_staff_list_add' :
                register_staff_list_add($dbh, $_POST);
                break;

            case 'check_login_event' :
                check_login_event($dbh, $_POST);
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

            case 'update_staff_list_payslip' :
                update_staff_list_payslip($dbh, $_POST);
                break;

            case 'update_staff_list_shift' :
                update_staff_list_shift($dbh, $_POST);
                break;

            case 'delete_staff_list' :
                delete_staff_list($dbh, $_POST);
                break;
                


            // イベント
            case 'get_event' :
                get_event($dbh, $_POST);
                break;

            case 'get_event_list' :
                get_event_list($dbh);
                break;

            case 'get_event_list_recruit' :
                get_event_list_recruit($dbh);
                break;

            case 'get_event_list_shift' :
                get_event_list_shift($dbh);
                break;                

            case 'get_event_notice' :
                get_event_notice($dbh);
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


            // 勤怠修正情報
            case 'register_work_report_edit' :
                register_work_report_edit($dbh, $_POST);
                break;

            case 'get_work_report_edit_all' :
                get_work_report_edit_all($dbh, $_POST);
                break;                

            case 'get_work_report_edit' :
                get_work_report_edit($dbh, $_POST);
                break;


            // 
            case 'update_work_report' :
                update_work_report($dbh, $_POST);
                break;

            case 'check_admin_login' :
                check_admin_login($dbh, $_POST);
                break;


            // お知らせ
            case 'get_news_list' :
                get_news_list($dbh, $_POST);
                break;

            case 'register_news' :
                register_news($dbh, $_POST);
                break;

            case 'delete_news' :
                delete_news($dbh, $_POST);
                break;


            // 応募リスト
            case 'get_application_list_all' :
                get_application_list_all($dbh, $_POST);
                break;

            case 'get_application_list' :
                get_application_list($dbh, $_POST);
                break;

            case 'get_application_Info' :
                get_application_Info($dbh, $_POST);
                break;
                
            case 'register_application' :
                register_application($dbh, $_POST);
                break;

            case 'update_application_status' :
                update_application_status($dbh, $_POST);
                break;


            // シフト変更希望
            case 'get_shift_change_list' :
                get_shift_change_list($dbh, $_POST);
                break;

            case 'get_shift_change_list_select' :
                get_shift_change_list_select($dbh, $_POST);
                break;

            case 'update_shift_change_list' :
                update_shift_change_list($dbh, $_POST);
                break;

            case 'check_shift_change_list' :
                check_shift_change_list($dbh, $_POST);
                break;
            
            case 'register_shift_change_list' :
                register_shift_change_list($dbh, $_POST);
                break;
                
                
            // 日報
            case 'register_day_report' :
                register_day_report($dbh, $_POST);
                break;

            case 'get_day_report' :
                get_day_report($dbh, $_POST);
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

    // ────勤怠情報：取得（1日全員）───────────────────────
    function get_work_report_day_all($dbh, $param) {

        // スタッフリスト
        $query1 = "
            SELECT name, shift
            FROM staff_list
            WHERE
                event = :event
            ORDER BY no asc
        ";
        $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth1->execute([
            'event' => $param['event']
        ]);
        $sth1->execute();
        while ($row = $sth1->fetch(PDO::FETCH_ASSOC)) {
            $name   = $row['name'];
            $shift  = $row['shift'];
            $employeeData['staffList'][$name] = array(
                'shift'             => [],
                'workReport'        => [],
                'workReportEdit'    => []
            );

            if ($shift) {
                foreach (explode(",", $shift) as $data) {
                    if ($data) {
                        $dataArray  = explode("_", $data);
                        $shiftDay   = $dataArray[0];
                        $shiftStart = $dataArray[1];
                        $shifEndd   = $dataArray[2];

                        if ($shiftDay == $param['day']) {
                            $employeeData['staffList'][$name]['shift'] = array(
                                'start' => $shiftStart,
                                'end'   => $shifEndd
                            );
                        }
                    }
                }
            }
        }

        // 勤怠情報
        $query2 = "
            SELECT *
            FROM work_report
            WHERE
                    event = :event
                AND day = :day
        ";
        $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth2->execute([
            'event' => $param['event'],
            'day'   => $param['day']
        ]);
        $sth2->execute();
        while ($row = $sth2->fetch(PDO::FETCH_ASSOC)) {
            $name   = $row['name'];

            if ($name) {
                $employeeData['staffList'][$name]['workReport'] = array(
                    'start'     => $row['start'],
                    'end'       => $row['end'],
                    'break1s'   => $row['break1s'],
                    'break1e'   => $row['break1e'],
                    'break2s'   => $row['break2s'],
                    'break2e'   => $row['break2e'],
                    'break3s'   => $row['break3s'],
                    'break3e'   => $row['break3e']
                );
            }
        }

        // 勤怠修正情報
        $query3 = "
            SELECT *
            FROM work_report_edit
            WHERE
                    event   = :event
                AND day     = :day
                AND status  = '申請中'
        ";
        $sth3 = $dbh->prepare($query3, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth3->execute([
            'event' => $param['event'],
            'day'   => $param['day']
        ]);
        $sth3->execute();
        while ($row = $sth3->fetch(PDO::FETCH_ASSOC)) {
            $name   = $row['name'];

            if ($name) {
                $employeeData['staffList'][$name]['workReportEdit'][] = array(
                    'request_dt'    => $row['request_dt'],
                    'day'           => $row['day'],
                    'item'          => $row['item'],
                    'data_before'   => $row['data_before'],
                    'data_after'    => $row['data_after'],
                    'reason'        => $row['reason']
                );
            }
        }

        // イベント
        $query4 = "
            SELECT
                e.first_day,
                e.end_day,
                dr.report
            FROM
                event e
            LEFT JOIN
                day_report dr
                ON  dr.event = e.event
                AND dr.day   = :day
            WHERE
                e.event = :event
        ";
        $sth4 = $dbh->prepare($query4, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth4->execute([
            'event' => $param['event'],
            'day'   => $param['day']
        ]);
        $sth4->execute();
        while ($row = $sth4->fetch(PDO::FETCH_ASSOC)) {
            $employeeData['event'] = array(
                'first_day' => $row['first_day'],
                'end_day'   => $row['end_day'],
                'report'    => $row['report']
            );
        }
        
        $json = json_encode($employeeData);
        echo $json;
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
            SELECT *
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

    // ────スタッフリスト：シフト─────────────────────────────
    function get_staff_list_shift($dbh, $param) {
        $query = "
            SELECT
                sl.no,
                sl.name,
                sl.mail,
                sl.booth,
                sl.shift,
                al.available,
                e.required_num,
                e.shift_updated_dt
            FROM
                staff_list sl
            LEFT JOIN
                application_list al
                ON  sl.mail = al.mail
                AND sl.event = al.event
            LEFT JOIN
                event e
                ON sl.event = e.event
            WHERE
                    CASE
                        WHEN 
                            :booth = 'ALL'
                        THEN
                            sl.event = :event
                        ELSE
                                sl.event = :event
                            AND sl.booth = :booth
                        END
            ORDER BY sl.no asc
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'booth' => $param['booth']
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

    // ────スタッフリスト：登録追加─────────────────────────────
    function register_staff_list_add($dbh, $param) {
        $query = "
            INSERT INTO
                staff_list(event, no, name, mail, birthday)
            SELECT
                :event,
                CASE
                    WHEN EXISTS (SELECT 1 FROM staff_list sl1 WHERE sl1.event = :event) 
                    THEN (
                        SELECT sl2.no 
                        FROM staff_list sl2 
                        WHERE sl2.event = :event
                        ORDER BY sl2.no DESC 
                        LIMIT 1
                    ) + 1 

                    ELSE 1
                END AS newNo,
                :name,
                :mail,
                :birthday
        ;";
        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'event'         => $param['event'],
            'name'          => $param['name'],
            'mail'          => $param['mail'],
            'birthday'      => $param['birthday'],
        ]);

        echo $count;
    }

    // ────スタッフリスト：更新（給与明細）─────────────────────────────
    function update_staff_list_payslip($dbh, $param) {

        foreach (explode(",", $param['payslipList']) as $staff) {
            if ($staff) {
                $staffArray = explode("|", $staff);
                $name       = $staffArray[0];
                $workRules  = $staffArray[1];
                $experience = $staffArray[2] ? $staffArray[2] : NULL;
                $payslipUrl = $staffArray[3];
                $tShirt     = $staffArray[4];

                $query = "
                    UPDATE
                        staff_list
                    SET
                        payslip     = :payslipUrl,
                        work_Rules  = :workRules,
                        experience  = :experience,
                        t_shirt     = :tShirt
                    WHERE
                            event = :event
                        AND name = :name
                ";
                $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                $count = $sth->execute([
                    'event'         => $param['event'],
                    'name'          => $name,
                    'payslipUrl'    => $payslipUrl,
                    'workRules'     => $workRules,
                    'experience'    => $experience,
                    'tShirt'        => $tShirt
                ]);
            }
        }

        echo $count;
    }

    // ────スタッフリスト：シフト更新─────────────────────────────
    function update_staff_list_shift($dbh, $param) {

        // シフトの更新
        foreach (explode(",", $param['updateList']) as $data) {
            $dataArray      = explode("|", $data);
            $name           = $dataArray[0];
            $booth          = $dataArray[1];
            $shift          = str_replace("/", ",", $dataArray[2]);
            
            if ($data) {
                $query1 = "
                    UPDATE
                        staff_list
                    SET
                        shift = :shift,
                        booth = :booth
                    WHERE
                            event   = :event
                        AND name    = :name
                ;";
                $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                $sth1->execute([
                    'event' => $param['event'],
                    'name'  => $name,
                    'booth'  => $booth,
                    'shift' => $shift
                ]);      
            }
        }        

        // イベント更新日時の更新
        $query2 = "
            UPDATE
                event
            SET
                shift_updated_dt = :shiftUpdatedDt,
                required_num = :updateNum
            WHERE
                event = :event
        ;";
        $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth2->execute([
            'event'             => $param['event'],
            'updateNum'         => $param['updateNum'],
            'shiftUpdatedDt'    => $param['shiftUpdatedDt']
        ]);

        echo $count;
    }

    // ────スタッフリスト：削除─────────────────────────────
    function delete_staff_list($dbh, $param) {
        $query = "
            DELETE FROM
                staff_list
            WHERE
                    event = :event
                AND name = :name
        ";
        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'event' => $param['event'],
            'name'  => $param['name'],
        ]);

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

        if (array_key_exists('return', $param)) {
            return $check ? 'true' : 'false';
        } else {
            echo $check ? 'true' : 'false';
        }
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

    // ────イベント：リスト取得（シフト）─────────────────────────────
    function get_event_list_shift($dbh) {
        $query = "
            SELECT event
            FROM event
            WHERE shift_url LIKE '%shift.php%'
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

    // ────イベント：お知らせ取得─────────────────────────────
    function get_event_notice($dbh) {

        $employeeData = [];

        // 応募リストの取得
        $query1 = "
            SELECT
                e.event,
                CONCAT(al.no, '.', al.name) as name,
                al.status
            FROM
                event e
            LEFT JOIN
                application_list al
                ON  al.event = e.event
                AND al.status IN ('採用', '採用通知済み')
            WHERE
                e.end_day >= CURRENT_DATE
            ORDER BY
                al.no asc
            ;
        ";
        $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth1->execute();
        while ($row = $sth1->fetch(PDO::FETCH_ASSOC)) {
            $event = $row['event'];
            $name = $row['name'];

            if ($name) {
                $employeeData[$event]['al_status'][$name] = $row['status'];
            }
        }


        // シフト変更希望リストの取得
        $query2 = "
            SELECT
                e.event,
                count(sl.request_dt) AS count
            FROM
                event e
            LEFT JOIN
                shift_change_list sl
                ON  sl.event = e.event
                AND sl.status = '申請中'
            WHERE
                e.end_day >= CURRENT_DATE
            GROUP BY
                e.event
            ;
        ";
        $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth2->execute();
        while ($row = $sth2->fetch(PDO::FETCH_ASSOC)) {
            $event = $row['event'];

            if ($event && $row['count'] >= 1) {
                $employeeData[$event]['sl_change'] = $row['count'];
            }
        }


        // 勤怠修正情報の取得
        $query3 = "
            SELECT
                event,
                count(request_dt) AS count
            FROM
                work_report_edit
            WHERE
                status IN ('申請中', '訂正中')
            GROUP BY
                event
            ;
        ";
        $sth3 = $dbh->prepare($query3, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth3->execute();
        while ($row = $sth3->fetch(PDO::FETCH_ASSOC)) {
            $event = $row['event'];

            if ($event && $row['count'] >= 1) {
                $employeeData[$event]['wr_request'] = $row['count'];
            }
        }

        // イベント支払日の取得
        $query4 = "
            SELECT
                event,
                pay_day,
                recruit
            FROM
                event
            ;
        ";
        $sth4 = $dbh->prepare($query4, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth4->execute();
        while ($row = $sth4->fetch(PDO::FETCH_ASSOC)) {
            $event = $row['event'];

            foreach (explode(",", $row['pay_day']) as $data) {
                if ($data) {
                    $today = date("Y-m-d");

                    if (strtotime($today) <= strtotime($data)) {
                       $employeeData[$event]['pay_day'][] = $data;
                    }
                }
            }

            if ($row['recruit'] == '募集中') {
                $employeeData[$event]['recruit'][] = $row['recruit'];
            }
        }

        $json = json_encode($employeeData);
        echo $json;
    }
    
    // ────イベント：登録─────────────────────────────
    function register_event($dbh, $param) {
        global $config;

        $query = "
            INSERT INTO
                event(event, pass, first_day, end_day, start_time, end_time, place, hourly_wage, transportation_limit, meal_allowance, pay_day, manager, shift_url, recruit, memo)
            VALUES
                (:event, :pass, :firstDay, :endDay, :startTime, :endTime, :place, :hourlyWage, :transportationLimit, :mealAllowance, :payDay, :manager, :shiftUrl, :recruit, :memo)
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'recruit'               => $param['recruit'],
            'event'                 => $param['event'],
            'pass'                  => password_hash($param['pass'], PASSWORD_DEFAULT),
            'firstDay'              => $param['firstDay'],
            'endDay'                => $param['endDay'],
            'startTime'             => $param['startTime'],
            'endTime'               => $param['endTime'],
            'place'                 => $param['place'],
            'hourlyWage'            => $param['hourlyWage'] ? $param['hourlyWage'] : NULL,
            'transportationLimit'   => $param['transportationLimit'] ? $param['transportationLimit'] : NULL,
            'mealAllowance'         => $param['mealAllowance'] ? $param['mealAllowance'] : NULL,
            'manager'               => $param['manager'],
            'shiftUrl'              => $param['shiftUrl'] ? $param['shiftUrl'] : $config['shift_url'] . '?event=' . urlencode($param['event']),
            'payDay'                => $param['payDay'],
            'memo'                  => $param['memo'],
        ]);

        echo $count;
    }

    // ────イベント：更新─────────────────────────────
    function update_event($dbh, $param) {
        $query = "
            UPDATE
                event
            SET
                pass                    = IF(:pass IS NULL, pass, :pass),
                first_day               = :firstDay,
                end_day                 = :endDay,
                start_time              = :startTime,
                end_time                = :endTime,
                place                   = :place,
                hourly_wage             = :hourlyWage,
                transportation_limit    = :transportationLimit,
                meal_allowance          = :mealAllowance,
                pay_day                 = :payDay,
                manager                 = :manager,
                shift_url               = :shiftUrl,
                recruit                 = :recruit,
                memo                    = :memo
            WHERE
                event = :event
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth->execute([
            'recruit'               => $param['recruit'],
            'event'                 => $param['event'],
            'pass'                  => $param['pass'] ? password_hash($param['pass'], PASSWORD_DEFAULT) : null,
            'firstDay'              => $param['firstDay'],
            'endDay'                => $param['endDay'],
            'startTime'             => $param['startTime'],
            'endTime'               => $param['endTime'],
            'place'                 => $param['place'],
            'hourlyWage'            => $param['hourlyWage'] ? $param['hourlyWage'] : NULL,
            'transportationLimit'   => $param['transportationLimit'] ? $param['transportationLimit'] : NULL,
            'mealAllowance'         => $param['mealAllowance'] ? $param['mealAllowance'] : NULL,
            'manager'               => $param['manager'],
            'shiftUrl'              => $param['shiftUrl'],
            'payDay'                => $param['payDay'],
            'memo'                  => $param['memo'],
        ]);

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

        // 応募リスト（※削除不要）
        // $query5 = "
        //     DELETE FROM
        //         application_list
        //     WHERE
        //         event = :event
        // ";
        // $sth5 = $dbh->prepare($query5, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        // $sth5->execute([
        //     'event'     => $param['event'],
        // ]);

        // シフト変更希望
        $query6 = "
            DELETE FROM
                shift_change_list
            WHERE
                event = :event
        ";
        $sth6 = $dbh->prepare($query6, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth6->execute([
            'event'     => $param['event'],
        ]);

        // 日報
        $query7 = "
            DELETE FROM
                day_report
            WHERE
                event = :event
        ";
        $sth7 = $dbh->prepare($query7, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth7->execute([
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

        foreach (explode(",", $param['updateList']) as $data) {

            if ($data) {
                $dataArray      = explode("|", $data);
                $statusAfter    = $dataArray[0];
                $requestDt      = $dataArray[1];
                $name           = $dataArray[2];
                $day            = $dataArray[3];
                $item           = $dataArray[4];

                if ($statusAfter == '取消済') {
                    $query3 = "
                        DELETE FROM
                            work_report_edit
                        WHERE
                                request_dt  = :requestDt
                            AND event       = :event
                            AND name        = :name
                            AND day         = :day
                            AND item        = :item
                    ";
                    $sth3 = $dbh->prepare($query3, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                    $count = $sth3->execute([
                        'requestDt'     => $requestDt,
                        'event'         => $param['event'],
                        'name'          => $name,
                        'day'           => $day,
                        'item'          => $item
                    ]);
                } else {
                    $after = $dataArray[5];

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
                        'statusAfter'   => $statusAfter,
                        'requestDt'     => $requestDt,
                        'event'         => $param['event'],
                        'name'          => $name,
                        'day'           => $day,
                        'item'          => $item,
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
                        'name'      => $name,
                        'day'       => $day,
                        'start'     => null,
                        'end'       => null,
                        'break1s'   => null,
                        'break1e'   => null,
                        'break2s'   => null,
                        'break2e'   => null,
                        'break3s'   => null,
                        'break3e'   => null
                    ];
                    $nextParam[$item] = $after;

                    $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                    $sth2->execute($nextParam);
                }
            }
        }

        if (!array_key_exists('return', $param)) {
            echo $count;
        }
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



    // ────応募リスト：取得─────────────────────────────
    function get_application_list_all($dbh, $param) {
        global $config;
        
        $query = "
            SELECT *
            FROM application_list
            WHERE
                event = :event
            ORDER BY 
                no asc
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event']
        ]);

        $employeeData['photoList'] = $config['photo_list'];

        // 結果を配列で取得
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData['applicationList'][] = $row;
        }

        // PHPの配列をJSON形式のデータに変換
        $json = json_encode($employeeData);

        echo $json;
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

    // ────応募リスト：個人詳細取得─────────────────────────────
    function get_application_Info($dbh, $param) {
        global $config;

        $query = "
            SELECT 
                a.*,
                (
                    SELECT
                        GROUP_CONCAT(CONCAT(b.event, ' ： ', b.status))
                    FROM
                        application_list b
                    WHERE
                        b.mail = :mail
                    GROUP BY
                        b.mail
                ) AS log
            FROM application_list a
            WHERE
                    a.event = :event
                AND a.mail = :mail
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'mail' => $param['mail']
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);

        $platformUrl = "";
        switch ($result['platform']) {
            case 'Indeed':
                $platformUrl = str_replace('replaceWord', mb_substr($result['name'], 0 ,1), $config['indeed_url']);
                break;

            case 'Airワーク':
                $platformUrl = str_replace('replaceWord', mb_substr($result['name'], 0 ,1), $config['airwork_url']);
                break;
        }

        $result = array(
            'application'   => $result,
            'platform_url'  => $platformUrl
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

    // ────応募リスト：ステータス更新─────────────────────────────
    function update_application_status($dbh, $param) {

        // 応募ステータスの変更
        $register = [];
        $delete = []; 
        foreach (explode(",", $param['updateList']) as $data) {
            if ($data) {
                $dataArray      = explode("|", $data);
                $mail           = $dataArray[0];
                $statusAfter    = $dataArray[1];

                $query1 = "
                    UPDATE
                        application_list
                    SET
                        status = :statusAfter
                    WHERE
                            event   = :event
                        AND mail    = :mail
                ;";
                $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                $count = $sth1->execute([
                    'event'         => $param['event'],
                    'mail'          => $mail,
                    'statusAfter'   => $statusAfter
                ]);

                if ($statusAfter == "追加済み") {
                    $register[] = $mail;
                }

                if (in_array($statusAfter, ['不採用', '辞退', '不通', '無断蒸発'], true)) {
                    $delete[] = $mail;
                }
            }
        }

        // スタッフリストに登録
        foreach ($register as $mail) {
            if ($mail) {
                $query2 = "
                    INSERT IGNORE INTO
                        staff_list(event, no, name, mail, birthday, shift)
                    SELECT
                        event,
                        (
                            SELECT
                                CASE
                                    WHEN EXISTS (SELECT 1 FROM staff_list sl1 WHERE sl1.event = :event) 
                                    THEN (
                                        SELECT sl2.no 
                                        FROM staff_list sl2 
                                        WHERE sl2.event = :event
                                        ORDER BY sl2.no DESC 
                                        LIMIT 1
                                    ) + 1 

                                    ELSE 1
                                END AS newNo
                        ),
                        name,
                        mail,
                        birthday,
                        available
                    FROM
                        application_list al
                    WHERE
                            al.event   = :event
                        AND al.mail    = :mail
                ;";
                $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                $sth2->execute([
                    'event'         => $param['event'],
                    'mail'          => $mail
                ]);         
            }
        }


        // スタッフリストから削除
        foreach ($delete as $mail) {
            if ($mail) {
                $query3 = "
                    DELETE FROM
                        staff_list
                    WHERE
                            event   = :event
                        AND mail    = :mail
                ;";
                $sth3 = $dbh->prepare($query3, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
                $sth3->execute([
                    'event'         => $param['event'],
                    'mail'          => $mail
                ]);         
            }
        }

        echo $count;
    }
    

    
    // ────シフト変更希望：取得─────────────────────────────
    function get_shift_change_list($dbh, $param) {
        $query = "
            SELECT *
            FROM shift_change_list
            WHERE
                CASE
                    WHEN 
                        :name = 'ALL'
                    THEN
                        event = :event
                    ELSE
                            event = :event
                        AND name = :name
                    END
            ORDER BY 
                request_dt desc
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'name' => $param['name']
        ]);

        // 結果を配列で取得
        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $employeeData[] = $row;
        }

        // PHPの配列をJSON形式のデータに変換
        $json = json_encode($employeeData);

        echo $json;
    }

    // ────シフト変更希望：選択肢の取得─────────────────────────────
    function get_shift_change_list_select($dbh, $param) {
        $query = "
            SELECT
                sl.shift,
                al.available
            FROM
                staff_list sl
            LEFT JOIN
                application_list al
                ON 
                    sl.mail = al.mail
                AND
                    sl.event = al.event
            WHERE
                    sl.event = :event
                AND sl.name = :name
        ;";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'name' => $param['name']
        ]);

        // 結果を取得
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $json = json_encode($result);
        echo $json;
    }

    // ────シフト変更希望：更新─────────────────────────────
    function update_shift_change_list($dbh, $param) {

        $query1 = "
            SELECT
                sl.shift,
                al.available,
                al.mail,
                e.first_day,
                e.end_day
            FROM
                staff_list sl
            LEFT JOIN
                application_list al
                ON 
                    sl.mail = al.mail
                AND
                    sl.event = al.event
            LEFT JOIN
                event e
                ON 
                    sl.event = e.event
            WHERE
                    sl.event = :event
                AND sl.name = :name
        ;";
        $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth1->execute([
            'event'         => $param['event'],
            'name'          => $param['name']
        ]);
        $result1 = $sth1->fetch(PDO::FETCH_ASSOC);


        // シフト更新値
        $updateShift = '';
        if ($result1['shift']) {
            foreach (explode(",", $result1['shift']) as $shift) {

                if (mb_substr($shift, 0 ,10) == $param['day']) {
                    $updateShift = $updateShift ? $updateShift . ',' . $param['after'] : $param['after'];
                } else {
                    $updateShift = $updateShift ? $updateShift . ',' . $shift : $shift;
                }
            }
        } else {
            for ($day = $result1['first_day']; $day <= $result1['end_day']; $day = date('Y-m-d', strtotime($day . '+1 day'))) {

                if ($day == $param['day']) {
                    $updateShift = $updateShift ? $updateShift . ',' . $param['after'] : $param['after'];
                } else {
                    $updateShift = $updateShift ? $updateShift . ',' . $day . '_×_×' : $day . '_×_×';                    
                }
            }
        }


        // シフト希望更新値
        $updateAvailable = '';
        foreach (explode(",", $result1['available']) as $available) {
            if (mb_substr($available, 0 ,10) == $param['day']) {
                $updateAvailable = $updateAvailable ? $updateAvailable . ',' . $param['after'] : $param['after'];
            } else {
                $updateAvailable = $updateAvailable ? $updateAvailable . ',' . $available : $available;
            }
        }


        // シフト更新
        $query2 = "
            UPDATE
                staff_list
            SET
                shift = :shiftAfter
            WHERE
                    event       = :event
                AND name        = :name
        ;";
        $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth2->execute([
            'event'         => $param['event'],
            'name'          => $param['name'],
            'shiftAfter'    => $param['statusAfter'] == '承認済' ? $updateShift : $result1['shift']
        ]);


        // 応募情報更新
        if ($updateAvailable) {
            $query3 = "
                UPDATE
                    application_list
                SET
                    available = :availableAfter,
                    updated_dt = :approvalD
                WHERE
                        event       = :event
                    AND mail        = :mail
            ;";
            $sth3 = $dbh->prepare($query3, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
            $sth3->execute([
                'event'             => $param['event'],
                'mail'              => $result1['mail'],
                'availableAfter'    => $param['statusAfter'] == '承認済' ? $updateAvailable : $result1['available'],
                'approvalD'         => $param['approvalD']
            ]);
        }

    
        // シフト変更希望更新
        $query4 = "
            UPDATE
                shift_change_list
            SET
                status      = :statusAfter,
                approval_d  = :approvalD
            WHERE
                    request_dt  = :requestDt
                AND event       = :event
                AND name        = :name
        ;";
        $sth4 = $dbh->prepare($query4, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth4->execute([
            'requestDt'     => $param['requestDt'],
            'event'         => $param['event'],
            'name'          => $param['name'],
            'statusAfter'   => $param['statusAfter'],
            'approvalD'     => $param['approvalD'],
        ]);

        echo $count;
    }

    // ────シフト変更希望：未承認の取得─────────────────────────────
    function check_shift_change_list($dbh, $param) {
        $query = "
            SELECT count(status) as count
            FROM shift_change_list
            WHERE
                    event = :event
                AND status = '申請中'
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event']
        ]);
        $result = $sth->fetch(PDO::FETCH_ASSOC);

        echo $result['count'];
    }

    // ────シフト変更希望：登録─────────────────────────────
    function register_shift_change_list($dbh, $param) {

        $query1 = "
            INSERT INTO
                shift_change_list(request_dt, event, name, shift_before, shift_after, status)
            VALUES
                (:requestDt, :event, :name, :before, :after, :status)
        ;";
        $sth1 = $dbh->prepare($query1, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $count = $sth1->execute([
            'requestDt'     => $param['requestDt'],
            'event'         => $param['event'],
            'name'          => $param['name'],
            'before'        => $param['before'],
            'after'         => $param['after'],
            'status'        => $param['status'],
        ]);


        if ($param['available']) {
            $query2 = "
                UPDATE
                    application_list al
                SET
                    al.available = :availableAfter,
                    al.updated_dt = :approvalD
                WHERE
                        al.event       = :event
                    AND al.mail        = (
                        SELECT
                            sl.mail
                        FROM
                            staff_list sl
                        WHERE
                                sl.event   = :event
                            AND sl.name    = :name
                    )
            ;";
            $sth2 = $dbh->prepare($query2, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
            $sth2->execute([
                'event'             => $param['event'],
                'name'              => $param['name'],
                'availableAfter'    => $param['available'],
                'approvalD'         => $param['requestDt']
            ]);
        }

        echo $count;
    }



    // ────日報：登録─────────────────────────────
    function register_day_report($dbh, $param) {

        if (
            check_login_event(
                $dbh,
                [
                    'event'     => $param['event'],
                    'pass'      => $param['eventPass'],
                    'return'    => true
                ]
            ) == 'true'
        ) {
            // 日報の登録
            $query = "
                INSERT INTO
                    day_report(event, day, report)
                VALUES
                    (:event, :day, :report)
                ON DUPLICATE KEY UPDATE
                    report    = VALUES(report)
            ";
            $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
            $count = $sth->execute([
                'event'     => $param['event'],
                'day'       => $param['day'],
                'report'    => $param['dayReport']
            ]);

            // 勤怠情報・勤怠修正情報の更新
            if ($param['approvalD']) {
                update_work_report(
                    $dbh,
                    [
                        'event'         => $param['event'],
                        'updateList'    => $param['updateList'],
                        'approvalD'     => $param['approvalD'],
                        'return'        => true
                    ]
                );
            }

            echo $count;
        } else {
            echo 'false';
        }
    }

    // ────日報：取得─────────────────────────────
    function get_day_report($dbh, $param) {
        $query = "
            SELECT *
            FROM day_report
            WHERE
                    event   = :event
                AND day     = :day
        ";

        $sth = $dbh->prepare($query, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute([
            'event' => $param['event'],
            'day' => $param['day']
        ]);

        // 結果を返却
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $json = json_encode($result);
        echo $json;
    }
    