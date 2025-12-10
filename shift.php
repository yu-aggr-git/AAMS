<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/shift.css">
        <script type="text/javascript" src="public/js/shift.js"></script>
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>


        <!-- メイン -->
        <div id="main">

            <!-- モーダル -->
            <div id="modal">

                <!-- 応募者詳細 -->
                <div id="formNameInfo">
                    <div class="modalTitle">
                        <p class="title">応募者詳細</p>
                    </div>

                    <div class="modalBody">
                        <dl>
                            <dt>氏名</dt>
                            <dd id="formInfoName"></dd>

                            <dt>メール</dt>
                            <dd id="formInfoMail"></dd>

                            <dt>生年月日</dt>
                            <dd id="formInfoBirthday"></dd>

                            <dt>年齢</dt>
                            <dd id="formInfoAge"></dd>

                            <dt>職業</dt>
                            <dd id="formInfoJob"></dd>

                            <dt>電話番号</dt>
                            <dd id="formInfoTell"></dd>

                            <dt>最寄り駅</dt>
                            <dd id="formInfoClosestStation"></dd>

                            <dt>応募メモ</dt>
                            <dd id="formInfoMemo"></dd>

                            <dt>応募元</dt>
                            <dd id="formInfoPlatform"></dd>

                            <dt>応募元URL</dt>
                            <dd id="formInfoPlatformUrl">
                                <a hidden href="" target="_blank"></a>
                            </dd>

                            <dt>応募履歴</dt>
                            <dd id="formInfoLog"></dd>

                            <dt>応募日時</dt>
                            <dd id="formInfoCreatedDt"></dd>

                            <dt>更新日時</dt>
                            <dd id="formInfoUpdatedDt"></dd>
                        </dl>

                    </div>

                    <button type="button" id="closeFormNameInfo" class="closeModal">閉じる</button>
                </div>


                <!-- シフト1日詳細 -->
                <div id="shiftDayInfo">
                    <div class="modalTitle">
                        <p class="title">シフト1日</p>
                    </div>

                    <div class="modalBody">
                        <div>
                            <table id="shiftDayInfoTable">
                                <tbody>
                                    <tr id="shiftDayInfoHeader">
                                        <th id="shiftDayInfoHeader1" class="sticky1">時間</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <button type="button" id="closeShiftDayInfo" class="closeModal">閉じる</button>
                </div>


                <!-- 管理者ログイン -->
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

                    <button type="button" id="closeAdminLogin" class="closeModal">閉じる</button>
                </div>


                <!-- スタッフログイン -->
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

                    <button type="button" id="closeStaffLogin" class="closeModal">閉じる</button>
                </div>
            </div>


            <!-- メニュー -->
            <div id="menuBar">
                <button type="button" id="adminLogout">ログアウト</button>
                <p id="displayName"></button>
            </div>


            <!-- イベント選択 -->
            <div id="selectEventArea">
                <div>
                    <select id="selectEvent"></select>
                    <button id="sendSelectEvent" type="button">選択</button>
                </div>
            </div>


            <!-- イベント情報 -->
            <div id="eventInfoArea">
                <table>
                    <tbody>
                        <tr>
                            <th rowspan="2">イベント情報</th>
                            <td rowspan="2" id="eventName"></td>
                            <td id="firstDay"></td>
                            <td id="separator">～</td>
                            <td id="endDay"></td>
                        </tr>
                            <td id="startTime"></td>
                            <td id="separator2">-</td>
                            <td id="endTime"></td>
                        <tr>

                        </tr>
                    </tbody>
                </table>
            </div> 


            <!-- ログイン -->
            <div id="shiftLoginArea">
                <p>
                    表示できるシフト情報がありません。<br>
                    下記より、いずれかでログインをしてください。
                </p>
                <button type="button" id="loginStaff">スタッフとしてログイン</button>
                <button type="button" id="loginAdmin">管理者としてログイン</button>
            </div>


             <!-- 項目切換え -->
            <div id="selectItemArea">
                <button type="button" id="shiftInfoOpen" value="false">シフト</button>
                <button type="button" id="shiftChangeInfoOpen" value="false">変更希望</button>
                <button type="button" id="formInfoOpen" value="false">応募状況</button>
            </div>


            <!-- シフト -->
            <div id="shiftInfoArea">
                <div id="shiftInfoMenu">
                    <p id="shiftInfoMsg" class="errorMsg"></p>
                    <div id="shiftInfoEdit">
                        <button type="button" id="editShiftInfo">編集</button>
                        <button type="button" id="cancelShiftInfo" hidden>取消</button>
                        <button type="button" id="updateShiftInfo" hidden>完了</button>
                    </div>
                </div>

                <div id="shiftUpdatedDt">
                    <p>更新日時：<span></span></p>
                </div>

                <div>
                    <table id="shiftInfoTable">
                        <tbody>
                            <tr id="shiftInfoHeader">
                                <th rowspan="4" id="shiftInfoHeader1" class="sticky1">氏名</th>
                                <th rowspan="4" id="shiftInfoHeader2" class="sticky5">
                                    <p>ブース</p>
                                    <select id="selectBooth">
                                        <option id="allBooth" value="ALL">ALL</option>
                                    </select>
                                </th>
                            </tr>
                            <tr id="totalNum"></tr>
                            <tr id="explanation1"></tr>
                            <tr id="explanation2"></tr>
                        </tbody>
                    </table>
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


            <!-- シフト変更希望 -->
            <div id="shiftChangeInfoArea">
                <div id="shiftChangeInfoMenu">
                    <p id="shiftChangeInfoMsg" class="errorMsg"></p>
                    <div id="shiftChangeInfoEdit">
                        <button type="button" id="approveShiftChangeInfo" value="false">承認</button>
                        <button type="button" id="rejectWorkShiftChangeInfo" value="false">却下</button>
                    </div>
                </div>

                <div id="shiftChangeInfoRequest">
                    <p>
                        ・シフト変更希望の提出：
                        <span id="shiftChangeInfoRequestMsg" class="errorMsg"></span>
                    </p>
                    <dl>
                        <dt>対象日</dt>
                        <dd>
                            <select id="selectShiftDay"></select>
                        </dd>

                        <dt>変更後</dt>
                        <dd>
                            <select id="selectShiftAfterS"></select>
                            <p>-</p>
                            <select id="selectShiftAfterE"></select>
                        </dd>
                    </dl>

                    <button type="button" id="sendShiftChangeInfoRequest" value="false">送信</button>
                </div>

                <div id="availableRequest">
                    <p>
                        ・出勤可能日の変更：
                        <span id="availableRequestMsg" class="errorMsg"></span>
                    </p>
                    <dl>
                        <dt>対象日</dt>
                        <dd>
                            <select id="selectAvailableDay"></select>
                        </dd>

                        <dt>変更後</dt>
                        <dd>
                            <select id="selectAvailableAfterS"></select>
                            <p> - </p>
                            <select id="selectAvailableAfterE"></select>
                        </dd>
                    </dl>

                    <button type="button" id="sendAvailableRequest" value="false">送信</button>
                </div>

                <div>
                    <table id="shiftChangeInfoTable">
                        <tbody>
                            <tr id="shiftChangeInfoHeader">
                                <th class="sticky1">申請日時</th>
                                <th class="sticky5">名前</th>
                                <th class="sticky3">ステータス</th>
                                <th class="sticky3">対象日</th>
                                <th class="sticky3">変更前</th>
                                <th class="sticky3">変更後</th>
                                <th class="sticky3">処理日</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <!-- 応募情報 -->
            <div id="formInfoArea">
                <div id="formInfoInfoEMenu">
                    <p id="formInfoMsg" class="errorMsg"></p>
                    <div id="formInfoEdit">
                        <button type="button" id="editFormInfo">編集</button>
                        <button type="button" id="cancelFormInfo" hidden>取消</button>
                        <button type="button" id="updateFormInfo" hidden>完了</button>
                    </div>
                </div>

                <div>
                    <table id="formInfoTable">
                        <tbody>
                            <tr id="formInfoHeader">
                                <th id="formInfoHeader1" class="sticky1">氏名</th>
                                <th id="formInfoHeader2" class="sticky5">ステータス</th>
                                <th id="formInfoHeader3" class="sticky3">応募メモ</th>
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