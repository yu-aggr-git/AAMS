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
                <div id="network">
                    <p id="networkStatus"></p>
                </div>
                <button type="button" id="adminLogout">ログアウト</button>
            </div>


            <!-- イベント選択 -->
            <div id="selectEventArea">
                <div>
                    <select id="selectEvent"></select>
                    <button id="sendSelectEvent" type="button">選択</button>
                </div>
            </div>


            <!-- イベント情報 -->
            <div class="itemName" id="eventInfoAreaOpen">
                <p>イベント情報</p>
                <p><span class="colorOrange">▼</span></p>
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


                    <dt>シフトURL</dt>
                    <dd>
                        <p hidden id="shiftUrl"></p>
                        <input type="text" id="inputShiftUrl">
                    </dd>

                    <dt>スタッフ</dt>
                    <dd>
                        <div hidden id="staff"></div>
                        <!-- <p hidden id="staff"></p> -->
                        <textarea
                            id="inputStaff"
                            placeholder="1:山田太郎:yamada@test.com:20000401&#13;&#10;2:佐藤花子:satou@test.com:20001231&#13;&#10;…&#13;&#10;上記のように1行に1名分の、&#13;&#10;No:名前:メールアドレス:生年月日(YYYMMDD)&#13;&#10;を入力してください"></textarea>
                    </dd>
                </dl>
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
                    <table>
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

                <div id="stampInfoEditMenu">
                    <div></div>
                    <div id="stampInfoEdit">
                        <button type="button" id="editStampInfoEdit"   hidden>訂正</button>
                        <button type="button" id="cancelStampInfoEdit" hidden>取消</button>
                        <button type="button" id="sendStampInfoEdit"   hidden>送信</button>
                    </div>
                </div>

                <p id="stampInfoEditMsg" class="errorMsg"></p>

                <table>
                    <tbody>
                        <tr>
                            <th>イベント名</th>
                            <td colspan="2" id="stampInfoEvent"></td>
                        </tr>
                        <tr>
                            <th>スタッフ名</th>
                            <td colspan="2" id="stampInfoStaff"></td>
                        </tr>
                        <tr>
                            <th>日付</th>
                            <td colspan="2" id="stampInfoDay"></td>
                        </tr>
                        <tr>
                            <th>出勤</th>
                            <td colspan="2" id="stampInfoStart"></td>
                            <td colspan="2" id="editStampInfoStart" hidden>
                                <div>
                                    <select id="editStampInfoStartHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoStartMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>休憩1</th>
                            <td id="stampInfoBreak1s"></td>
                            <td id="stampInfoBreak1e"></td>
                            <td id="editStampInfoBreak1s" hidden>
                                <div>
                                    <select id="editStampInfoBreak1sHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoBreak1sMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                            <td id="editStampInfoBreak1e" hidden>
                                <div>
                                    <select id="editStampInfoBreak1eHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoBreak1eMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>休憩2</th>
                            <td id="stampInfoBreak2s"></td>
                            <td id="stampInfoBreak2e"></td>
                            <td id="editStampInfoBreak2s" hidden>
                                <div>
                                    <select id="editStampInfoBreak2sHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoBreak2sMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                            <td id="editStampInfoBreak2e" hidden>
                                <div>
                                    <select id="editStampInfoBreak2eHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoBreak2eMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>休憩3</th>
                            <td id="stampInfoBreak3s"></td>
                            <td id="stampInfoBreak3e"></td>
                            <td id="editStampInfoBreak3s" hidden>
                                <div>
                                    <select id="editStampInfoBreak3sHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoBreak3sMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                            <td id="editStampInfoBreak3e" hidden>
                                <div>
                                    <select id="editStampInfoBreak3eHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoBreak3eMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                        </tr>                        
                        <tr>
                            <th>退勤</th>
                            <td colspan="2" id="stampInfoEnd"></td>
                            <td colspan="2" id="editStampInfoEnd" hidden>
                                <div>
                                    <select id="editStampInfoEndHour">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                    <p class="separator">：</p>
                                    <select id="editStampInfoEndMinutes">
                                        <option value="-">-</option>
                                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                                            <?php $i = sprintf('%02d', $i) ?>
                                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                        <?php endfor; ?>
                                        <option value="×">×</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr id="stampInfoReason" hidden>
                            <th>訂正理由</th>
                            <td colspan="2">
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
                        <button type="button" id="approveWorkReportInfo" value="false">承認</button>
                        <button type="button" id="rejectWorkReportInfo" value="false">却下</button>
                    </div>
                </div>

                <div>
                    <table id="workReportInfoEditTable">
                        <tbody>
                            <tr>
                                <th class="sticky1">スタッフ名</th>
                                <th class="sticky2">対象日</th>
                                <th class="sticky3">項目</th>
                                <th class="status">状態</th>
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

            

        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>