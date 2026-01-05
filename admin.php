<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/admin.css">
        <script type="text/javascript" src="public/js/admin.js"></script>
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>


        <!-- メイン -->
        <div id="main">

            <!-- モーダル -->
            <div id="modal">
                <div id="adminLogin">
                    <div class="modalTitle">
                        <p class="title">管理者モード</p>
                    </div>

                    <div class="modalBody">
                        <p class="guidance">イベントの管理は、管理者のログインが必要です。</p>

                        <p>USER</p>
                        <input type="text" id="adminUser">

                        <p>PASSWORD</p>
                        <input type="password" id="adminUserPass">

                        <p id="adminMsg" class="errorMsg"></p>

                        <button id="sendAdminUser" type="button" >送信</button>
                    </div>
                </div>
            </div>


            <!-- メニュー -->
            <div id="menuBar">
                <button type="button" id="adminLogout">ログアウト</button>
            </div>


            <!-- イベント選択 -->
            <div id="selectEventArea">
                <div>
                    <select id="selectEvent"></select>
                    <button id="sendSelectEvent" type="button">選択</button>
                </div>
            </div>

            <!-- イベント通知 -->
            <div id="eventInfoNoticeArea">
                <dl>
                    <dt>イベント名</dt>
                    <dd>通知内容</dd>
                </dl>
            </div>

            <!-- イベント情報 -->
            <div class="itemName" id="eventInfoAreaOpen">
                <p>イベント情報</p>
                <p><span class="colorOrange">▲</span></p>
            </div>
            <div id="eventInfoArea">
                <div id="eventEditMenu">
                    <p id="eventEditMsg" class="errorMsg"></p>
                    <div id="eventEdit">
                        <button type="button" id="registerEvent"         >登録</button>
                        <button type="button" id="deleteEvent"     hidden>削除</button>
                        <button type="button" id="editEventEdit"   hidden>編集</button>
                        <button type="button" id="cancelEventEdit" hidden>取消</button>
                        <button type="button" id="sendEventEdit"   hidden>送信</button>
                    </div>
                </div>

                <dl>
                    <dt class="borderTop topLeft">項目</dt>
                    <dd class="borderTop topRight">内容</dd>

                    <dt>募集状況</dt>
                    <dd>
                        <p hidden id="recruit"></p>
                        <select id="inputRecruit">
                            <option value="募集中">募集中</option>
                            <option value="募集終了">募集終了</option>
                        </select>
                    </dd>

                    <dt>イベント名</dt>
                    <dd>
                        <p hidden id="eventName"></p>
                        <input type="text" id="inputEventName">
                    </dd>

                    <dt>パスワード</dt>
                    <dd>
                        <p hidden id="pass">非表示</p>
                        <input type="text" id="inputPass">
                    </dd>

                    <dt>営業初日</dt>
                    <dd>
                        <p hidden id="firstDay"></p>

                        <div id="inputFirstDayArea">
                            <select id="inputFirstYear">
                                <?php for ($i =  date("Y"); $i <= date("Y") + 1; $i++) : ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>

                            <p class="separator">-</p>

                            <select id="inputFirstMonth">
                                <?php for ($i = 1; $i <= 12; $i ++) : ?>
                                    <?php $i = sprintf('%02d', $i) ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>

                            <p class="separator">-</p>

                            <select id="inputFirstDay">
                                <?php for ($i = 1; $i <= 31; $i++) : ?>
                                    <?php $i = sprintf('%02d', $i) ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                    </dd>

                    <dt>営業最終日</dt>
                    <dd>
                        <p hidden id="endDay"></p>

                        <div id="inputEndDayArea">
                            <select id="inputEndYear">
                                <?php for ($i =  date("Y"); $i <= date("Y") + 1; $i++) : ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>

                            <p class="separator">-</p>

                            <select id="inputEndMonth">
                                <?php for ($i = 1; $i <= 12; $i ++) : ?>
                                    <?php $i = sprintf('%02d', $i) ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>

                            <p class="separator">-</p>

                            <select id="inputEndDay">
                                <?php for ($i = 1; $i <= 31; $i++) : ?>
                                    <?php $i = sprintf('%02d', $i) ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                    </dd>

                    <dt>営業時間</dt>
                    <dd>
                        <p hidden id="time"></p>

                        <div id="inputTimeArea">
                            <select id="inputTimeS">
                                <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                    <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                        <?php $m = sprintf('%02d', $m) ?>
                                        <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                    <?php endfor; ?>
                                <?php endfor; ?>
                            </select>

                            <p class="separator">～</p>

                            <select id="inputTimeE">
                                <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                    <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                        <?php $m = sprintf('%02d', $m) ?>
                                        <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                    <?php endfor; ?>
                                <?php endfor; ?>
                            </select>
                        </div>
                    </dd>

                    <dt>開催場所</dt>
                    <dd>
                        <p hidden id="place"></p>
                        <input type="text" id="inputPlace">
                    </dd>

                    <dt>時給</dt>
                    <dd>
                        <p hidden id="hourlyWage"></p>
                        <input type="text" id="inputHourlyWage">
                    </dd>

                    <dt>交通費上限</dt>
                    <dd>
                        <p hidden id="transportationLimit"></p>
                        <input type="text" id="inputTransportationLimit">
                    </dd>

                    <dt>食事手当</dt>
                    <dd>
                        <p hidden id="mealAllowance"></p>
                        <input type="text" id="inputMealAllowance">
                    </dd>

                    <dt>現場責任者</dt>
                    <dd>
                        <p hidden id="manager"></p>
                        <input type="text" id="inputMealManager">
                    </dd>

                    <dt>シフトURL</dt>
                    <dd>
                        <p hidden id="shiftUrl"><a id="aShiftUrl" href="" target="_blank"></a></p>
                        <input type="text" id="inputShiftUrl" placeholder="*外部参照の場合は入力">
                    </dd>

                    <dt>支払日</dt>
                    <dd>
                        <p hidden id="payDay"></p>

                        <div id="inputPayDayArea">
                            <?php for ($num =  1; $num < 3 + 1; $num++) : ?>
                                <div>
                                    <select id="inputPayDay<?php echo $num ?>Year">
                                        <option value=""></option>
                                        <?php for ($i =  date("Y"); $i <= date("Y") + 1; $i++) : ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                    </select>

                                    <p class="separator">-</p>

                                    <select id="inputPayDay<?php echo $num ?>Month">
                                        <option value=""></option>
                                        <?php for ($i = 1; $i <= 12; $i ++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                    </select>

                                    <p class="separator">-</p>

                                    <select id="inputPayDay<?php echo $num ?>Day">
                                        <option value=""></option>
                                        <?php for ($i = 1; $i <= 31; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                    </select>
                                </div>
                            <?php endfor; ?>
                        </div>
                    </dd>

                    <dt>メモ</dt>
                    <dd>
                        <p hidden id="memo"></p>
                        <textarea id="inputMemo"></textarea>
                    </dd>
                </dl>

                <!-- イベント日報 -->
                <div id="dayReportArea">
                    <div>
                        <p>・イベント日報：</p>
                        <select id="dayReportSelect"></select>
                    </div>

                    <dl>
                        <dt>内容</dt>
                        <dd>
                            <p id="dayReport"></p>
                        </dd>
                    </dl>
                </div>
            </div>


            <!-- 勤怠情報 -->
            <div class="itemName" id="workReportInfoAreaOpen">
                <p>勤怠情報</p>
                <p><span>▲</span></p>
            </div>
            <div id="workReportInfoArea">
                <p>● 打刻端末がオフライン状態の場合など、データ反映にタイムラグがあります。</p>
                <p>● 打刻時の秒数は、切り捨てで表示しています。（打刻時間「10:00:59」 → 表示時間「10:00」）</p>
                <p>● 打刻時の分数は、15分単位での繰り上げです。（打刻時間「09:46:00」 → 表示時間「10:00」）</p>
                <p>　※ 退勤分のみ、15分単位での切り捨てです。（打刻時間「23:05:00」 → 勤怠時間「23:00」）</p>
                <p>● 「＊」で表示されている箇所は、打刻漏れ申請、または時間計算に情報が足りていない（出勤中など）状態です。</p>
                <div>
                    <table id="workReportInfoTable">
                        <tbody>
                            <tr id="workReportInfoHeader"></tr>
                            <tr id="workReportInfoHeader2"></tr>
                            <tr id="workReportInfoHeader3"></tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <!-- 打刻情報 -->
            <div class="itemName" id="stampInfoAreaOpen">
                <p>打刻情報</p>
                <p><span>▲</span></p>
            </div>
            <div id="stampInfoArea">
                <div id="stampInfoSelect">
                    <div>
                        <select id="selectStampInfoStaff"></select>
                        <select id="selectStampInfoDay"></select>
                    </div>
                    <button id="sendStampInfo" type="button">選択</button>
                </div>

                <p>● 訂正したい項目のみ入力してください。（*打刻を取消しする場合は「×:×」を選択）</p>

                <div id="stampInfoEditMenu">
                    <div></div>
                    <div id="stampInfoEdit">
                        <button type="button" id="sendStampInfoEdit">送信</button>
                    </div>
                </div>

                <p id="stampInfoEditMsg" class="errorMsg"></p>

                <table>
                    <tbody>
                        <tr>
                            <th colspan="2">イベント名</th>
                            <td colspan="6" id="stampInfoEvent"></td>
                        </tr>
                        <tr>
                            <th colspan="2">スタッフ名</th>
                            <td colspan="6" id="stampInfoStaff"></td>
                        </tr>
                        <tr>
                            <th colspan="2">日付</th>
                            <td colspan="6" id="stampInfoDay"></td>
                        </tr>
                        <tr>
                            <th colspan="8" class="sepTh"></th>
                        </tr>
                        <tr>
                            <th>項目</th>
                            <th>シフト</th>
                            <th colspan="2">打刻</th>
                            <th colspan="2">勤怠</th>
                            <th colspan="2">訂正</th>
                        </tr>

                        <tr>
                            <th>出勤</th>
                            <td id="startShift"></td>
                            <td colspan="2" id="startStamp"></td>
                            <td colspan="2" id="startWork"></td>
                            <td colspan="2">
                                <select id="startEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th>休憩1</th>
                            <td rowspan="3" id="breakShift"></td>
                            <td id="break1sStamp"></td>
                            <td id="break1eStamp"></td>
                            <td id="break1sWork"></td>
                            <td id="break1eWork"></td>
                            <td>
                                <select id="break1sEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                            <td>
                                <select id="break1eEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th>休憩2</th>
                            <td id="break2sStamp"></td>
                            <td id="break2eStamp"></td>
                            <td id="break2sWork"></td>
                            <td id="break2eWork"></td>
                            <td>
                                <select id="break2sEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                            <td>
                                <select id="break2eEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>休憩3</th>
                            <td id="break3sStamp"></td>
                            <td id="break3eStamp"></td>
                            <td id="break3sWork"></td>
                            <td id="break3eWork"></td>
                            <td>
                                <select id="break3sEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                            <td>
                                <select id="break3eEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th>退勤</th>
                            <td id="endShift"></td>
                            <td colspan="2" id="endStamp"></td>
                            <td colspan="2" id="endWork"></td>
                            <td colspan="2">
                                <select id="endEdit">
                                    <option value="-">-</option>
                                    <?php for ($h = 0; $h <= 23; $h ++) : ?>
                                        <?php for ($m = 0; $m <= 45; $m += 15) : ?>
                                            <?php $m = sprintf('%02d', $m) ?>
                                            <option value="<?php echo $h . ':' . $m ?>"><?php echo $h . ':' . $m ?></option>
                                        <?php endfor; ?>
                                    <?php endfor; ?>
                                    <option value="×:×">×:×</option>
                                </select>
                            </td>
                        </tr>

                        <tr id="stampInfoReason">
                            <th>訂正理由</th>
                            <td colspan="7">
                                <input type="text" id="editStampInfoReason">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>



            <!-- 勤怠修正情報 -->
            <div class="itemName" id="workReportInfoEditAreaOpen">
                <p>勤怠修正情報</p>
                <p><span>▲</span></p>
            </div>
            <div id="workReportInfoEditArea">
                <div id="workReportInfoEditMenu">
                    <p id="workReportInfoEditMsg" class="errorMsg"></p>
                    <div id="workReportInfoEdit">
                        <button type="button" id="cancelWorkReportInfo" hidden>取消</button>
                        <button type="button" id="updateWorkReportInfo" hidden>更新</button>
                        <button type="button" id="approveWorkReportInfo">承認</button>
                        <button type="button" id="rejectWorkReportInfo">却下</button>
                    </div>
                </div>

                <div>
                    <table id="workReportInfoEditTable">
                        <tbody>
                            <tr>
                                <th class="sticky1 sticky9">スタッフ名</th>
                                <th class="sticky2 sticky9">対象日</th>
                                <th class="sticky3 sticky9">項目</th>
                                <th class="status sticky8">状態</th>
                                <th class="sticky8">修正前</th>
                                <th class="sticky8">修正後</th>
                                <th class="w25 sticky8">理由</th>
                                <th class="w25 sticky8">申請日</th>
                                <th class="sticky8">処理日</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>


            <!-- スタッフリスト -->
            <div class="itemName" id="payslipAreaOpen">
                <p>スタッフリスト</p>
                <p><span>▲</span></p>
            </div>
            <div id="payslipArea">
                <p>● 給与明細を複数登録する場合は入力欄で改行して登録してください。</p>
                <div id="payslipMenu">
                    <p id="payslipMsg" class="errorMsg"></p>
                    <div>
                        <button type="button" id="editPayslip">編集</button>
                        <button type="button" id="cancelPayslip" hidden>取消</button>
                        <button type="button" id="updatePayslip" hidden>更新</button>
                    </div>
                </div>
                <div id="payslipList">
                    <table id="payslipTable">
                        <tbody>
                            <tr id="payslipTableHeader">
                                <th class="w15 sticky1">スタッフ名</th>
                                <th class="w10 sticky2">就業規則</th>
                                <th class="w10 sticky2">経験者手当</th>
                                <th class="w15 sticky2">利用駅</th>
                                <th class="w10 sticky2">往復交通費</th>
                                <th class="w30 sticky2">銀行口座</th>
                                <th class="w30 sticky2">給与明細URL</th>
                                <th class="w10 sticky2">Tシャツ</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div id="deleteStaff">
                    <p>
                        ・スタッフの削除：
                        <span id="deleteStaffMsg" class="errorMsg"></span>
                    </p>

                    <dl>
                        <dt>氏名</dt>
                        <dd>
                            <select id="deleteStaffName"></select>
                        </dd>
                    </dl>

                    <button type="button" id="sendDeleteStaff" value="false">削除</button>
                </div>

                <div id="addStaff">
                    <p>
                        ・応募以外のスタッフ追加：
                        <span id="addStaffMsg" class="errorMsg"></span>
                    </p>

                    <dl>
                        <dt>氏名</dt>
                        <dd>
                            <input type="text" id="addStaffName">
                        </dd>

                        <dt>メール</dt>
                        <dd>
                            <input type="text" id="addStaffMail">
                        </dd>

                        <dt>生年月日<br>*初期PASS</dt>
                        <dd>
                            <input type="text" id="addStaffBirthday" value="yyyymmdd">
                        </dd>
                    </dl>

                    <button type="button" id="sendAddStaff" value="false">登録</button>
                </div>
            </div>


            <!-- お知らせ -->
            <div class="itemName" id="newsAreaOpen">
                <p>お知らせ</p>
                <p><span>▲</span></p>
            </div>
            <div id="newsArea">
                <div id="newsMenu">
                    <p id="newsMsg" class="errorMsg"></p>
                    <div>
                        <button type="button" id="registerNews"         >登録</button>
                        <button type="button" id="deleteNews"   hidden  >削除</button>
                        <button type="button" id="updateNews"   hidden  >更新</button>
                    </div>
                </div>

                <div id="newsRegister">
                    <dl>
                        <dt class="borderTop topLeft">項目</dt>
                        <dd class="borderTop topRight">内容</dd>

                        <dt>タイトル</dt>
                        <dd>
                            <p hidden id="newsTitle"></p>
                            <input type="text" id="inputTitle">
                        </dd>

                        <dt>内容</dt>
                        <dd>
                            <textarea id="inputBody"></textarea>
                        </dd>

                        <dt>URL</dt>
                        <dd>
                            <input type="text" id="inputLink">
                        </dd>

                        <dt>状態</dt>
                        <dd>
                            <input type="radio" name="inputStatus" value="公開" checked>公開
                            <input type="radio" name="inputStatus" value="非公開">非公開
                        </dd>
                    </dl>
                </div>

                <div id="newsSelect">
                    <div>
                        <button type="button" id="dispNews">公開</button>
                        <button type="button" id="noneNews">非公開</button>
                    </div>
                </div>

                <div id="newsList">
                    <table id="newsTable">
                        <tbody>
                            <tr id="newsTableHeader">
                                <th>登録日</th>
                                <th class="w50">タイトル</th>
                                <th class="w70">内容</th>
                                <th class="w50">URL</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>

            

        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>