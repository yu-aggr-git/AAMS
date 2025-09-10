<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/staff.css">
        <script type="text/javascript" src="public/js/staff.js"></script>
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>


        <!-- メイン -->
        <div id="main">

            <!-- モーダル -->
            <div id="modal">
                <div id="staffLogin">
                    <div class="modalTitle">
                        <p class="title">スタッフ画面</p>
                    </div>

                    <div class="modalBody">
                        <p class="guidance">勤怠情報の確認は、ログインが必要です。</p>

                        <p>EVENT</p>
                        <select id="staffEventName"></select>

                        <p>MAIL</p>
                        <input type="text" id="staffMail">

                        <p>PASSWORD</p>
                        <input type="password" id="staffPass">

                        <p id="staffLoginMsg" class="errorMsg"></p>

                        <button id="sendStaffLogin" type="button" >送信</button>
                    </div>
                </div>
            </div>

            
            <!-- メニュー -->
            <div id="menuBar">
                <div id="network">
                    <p id="networkStatus"></p>
                </div>
                <button type="button" id="staffLogout">ログアウト</button>
            </div>


            <!-- イベント選択 -->
            <div id="selectStaffEventArea">
                <div>
                    <select id="selectStaffEvent"></select>
                    <button id="sendSelectStaffEvent" type="button">選択</button>
                </div>
            </div>


            <!-- イベント情報 -->
            <div id="staffEventInfoArea">
                <div id="staffEventInfoMsgArea">
                    <p id="staffEventInfoMsg" class="errorMsg">＊パスワードの設定をしてください。</p>
                    <input type="password" id="inputStaffPass">
                    <button type="button" id="setPassOpen">設定</button>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th>イベント</th>
                            <td id="eventName"></td>
                            <td id="firstDay"></td>
                            <td id="separator">～</td>
                            <td id="endDay"></td>
                            <td id="shift"><a href="" target="_blank">📅</a></td>
                        </tr>
                        <tr>
                            <th>登録情報</th>
                            <td id="mail"></td>
                            <td colspan="2" id="staffName"></td>
                            <td colspan="2" id="birthday"></td>
                        </tr>
                    </tbody>
                </table>
            </div> 


            <!-- 項目切換え -->
            <div id="selectItemArea">
                <button type="button" id="workReportOpen" value="false">勤怠情報</button>
                <button type="button" id="workReportEditOpen"value="false">修正申請情報</button>
                <button type="button" id="stampEditOpen"value="false">打刻修正</button>
            </div>


            <!-- 勤怠情報 -->
            <div id="staffWorkReportInfoArea">
                <p>● 打刻端末がオフライン状態の場合など、データ反映にタイムラグがあります。</p>
                <p>● 打刻の秒数は、切り捨てで表示しています。（打刻時間「10:00:59」 → 勤怠時間「10:00」）</p>
                <p>● 打刻の分数は、15分単位での繰り上げです。（打刻時間「09:46:00」 → 勤怠時間「10:00」）</p>
                <p>　※ 退勤分のみ、15分単位での切り捨てです。（打刻時間「23:05:00」 → 勤怠時間「23:00」）</p>
                <p>● 「＊」で表示されている箇所は、打刻漏れ申請、または時間計算に情報が足りていない（出勤中など）状態です。</p>
                <div>
                    <table>
                        <tbody>
                            <tr id="dateHeader">
                                <th rowspan="2" id="sticky1" class="sticky">項目</th>
                            </tr>
                            <tr id="itemHeader"></tr>
                            <tr id="startRow">
                                <th id="sticky2" class="sticky">出勤</th>
                            </tr>
                            <tr id="break1sRow">
                                <th id="sticky3" class="sticky">休憩1：開始</th>
                            </tr>
                            <tr id="break1eRow">
                                <th id="sticky4" class="sticky">休憩1：終了</th>
                            </tr>
                            <tr id="break2sRow">
                                <th id="sticky5" class="sticky">休憩2：開始</th>
                            </tr>
                            <tr id="break2eRow">
                                <th id="sticky6" class="sticky">休憩2：終了</th>
                            </tr>
                            <tr id="break3sRow">
                                <th id="sticky7" class="sticky">休憩3：開始</th>
                            </tr>
                            <tr id="break3eRow">
                                <th id="sticky8" class="sticky">休憩3：終了</th>
                            </tr>
                            <tr id="endRow">
                                <th id="sticky9" class="sticky">退勤</th>
                            </tr>
                            <tr id="breakTimeRow">
                                <th id="sticky10" class="sticky">休憩時間</th>
                            </tr>
                            <tr id="workTimeRow">
                                <th id="sticky11" class="sticky">実働時間</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <!-- 修正申請情報 -->
            <div id="staffworkReportEditInfoArea">
                <p>● 打刻端末がオフライン状態の場合など、データ反映にタイムラグがあります。</p>
                <p>● 状態が「承認済・訂正済」になるまで勤怠情報には反映されません。</p>
                <div>
                    <table id="workReportEditInfoTable">
                        <tbody>
                            <tr>
                                <th class="sticky1">対象日</th>
                                <th class="sticky2">項目</th>
                                <th class="w10">状態</th>
                                <th>修正前</th>
                                <th>修正後</th>
                                <th class="w25">理由</th>
                                <th class="w25">申請日</th>
                                <th>承認日</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <!-- 打刻修正 -->
            <div id="staffStampEditArea">
                <div>
                    <p>修正対象日：</p>
                    <select id="editStampDay"></select>

                    <p>修正項目：</p>
                    <select id="editStampItem">
                        <option value="start" id="startOp">出勤</option>
                        <option value="end" id="endOp">退勤</option>
                        <option value="break1s" id="break1sOp">休憩1：開始</option>
                        <option value="break1e" id="break1eOp">休憩1：終了</option>
                        <option value="break2s" id="break2sOp">休憩2：開始</option>
                        <option value="break2e" id="break2eOp">休憩2：終了</option>
                        <option value="break3s" id="break3sOp">休憩3：開始</option>
                        <option value="break3e" id="break3eOp">休憩3：終了</option>
                    </select>

                    <p>修正内容：</p>
                    <div>
                        <select id="editStampHour">
                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                            <?php $i = sprintf('%02d', $i) ?>
                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                        <?php endfor; ?>
                        <option value="×">×</option>
                        </select>
                        <p class="separator">：</p>
                        <select id="editStampMinutes">
                            <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                <?php $i = sprintf('%02d', $i) ?>
                                <option value="<?php echo $i ?>"><?php echo $i ?></option>
                            <?php endfor; ?>
                            <option value="×">×</option>
                        </select>
                    </div>

                    <p>修正理由：</p>
                    <input type="text" id="editStampReason">

                    <p id="staffStampEditMsg" class="errorMsg"></p>

                    <button type="button" id="sendStaffStampEdit">送信</button>
                </div>
            </div>

        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>