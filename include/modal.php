<div id="modal">

    <!-- ログイン -->
    <div id="eventLogin">
        <div class="modalTitle">
            <p class="title">Aggregation's Attendance Management System</p>
        </div>

        <div class="modalBody">
            <p class="guidance">打刻モードを表示するイベントを入力してください。</p>

            <p>EVENT</p>
            <select id="loginEventName"></select>

            <p>PASSWORD</p>
            <input type="password" id="loginEventPass">

            <p id="loginMsg" class="errorMsg"></p>

            <button id="sendUser" type="button" >送信</button>
        </div>
    </div>


    <!-- メニュー -->
    <div id="menu">
        <div class="modalTitle">
            <p class="title">Menu</p>
        </div>

        <div class="modalBody">
            <div id="menuList">
                <button type="button" id="openEdit">打刻修正</button>
                <button type="button" id="openDayReport">日報報告</button>

                <button type="button" id="changeEvent">イベント切換え</button>
            </div>
        </div>

        <button type="button" id="closeMenu" class="closeModal">閉じる</button>
    </div>
 

    <!-- 打刻 -->
    <div id="stamp">
        <div class="modalTitle">
            <p class="title">打刻</p>
        </div>

        <div class="modalBody">
            <p class="guidance">スタッフ名を選択してください。</p>
            <div id="stampAreaStaff">
                <select id="stampSelectStaff"></select>
            </div>

            <div id="stampAreaButton">
                <div>
                    <button value="start" id="stampWorkS" type="button" disabled>出勤</button>
                </div>

                <div>
                    <button id="stampBreakS" type="button" disabled>休憩開始</button>
                    <button id="stampBreakE" type="button" disabled>休憩終了</button>
                </div>

                <div>
                    <button value="end" id="stampWorkE" type="button" disabled>退勤</button>
                </div>
            </div>

            <div id="stampAreaEdit">
                <button id="stampEdit" type="button">＊打刻漏れ＊</button>

                <div id="selectEdit">
                    <select id="editItem"></select>

                    <select id="editHour">
                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                            <?php $i = sprintf('%02d', $i) ?>
                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                        <?php endfor; ?>
                    </select>

                    <p class="separator">：</p>

                    <select id="editMinutes">
                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                            <?php $i = sprintf('%02d', $i) ?>
                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                        <?php endfor; ?>
                    </select>

                    <button id="sendStampEdit" type="button" value="">送信</button>
                </div>
            </div>

            <div id="stampAreaInfo">
                <table>
                    <tbody>
                        <tr>
                            <th>日付</th>
                            <td colspan="2" id="stampAreaDay"></td>
                        </tr>
                        <tr>
                            <th>出勤</th>
                            <td colspan="2" id="stampAreaStart"></td>
                        </tr>
                        <tr>
                            <th>休憩1</th>
                            <td id="stampAreaBreak1s"></td>
                            <td id="stampAreaBreak1e"></td>
                        </tr>
                        <tr>
                            <th>休憩2</th>
                            <td id="stampAreaBreak2s"></td>
                            <td id="stampAreaBreak2e"></td>
                        </tr>
                        <tr>
                            <th>休憩3</th>
                            <td id="stampAreaBreak3s"></td>
                            <td id="stampAreaBreak3e"></td>
                        </tr>
                        <tr>
                            <th>退勤</th>
                            <td colspan="2" id="stampAreaEnd"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <button type="button" id="closeStamp" class="closeModal">閉じる</button>
    </div>


    <!-- 打刻修正 -->
    <div id="edit">
        <div class="modalTitle">
            <p class="title">打刻修正</p>
        </div>

        <div class="modalBody">
            <p class="guidance">スタッフ名を選択してください。</p>
            <div id="editAreaStaff">
                <select id="editSelectStaff"></select>
            </div>

            <div id="editInput">
                <div>
                    <p>修正対象日</p>
                    <select id="editWorkReportDay"></select>

                    <p>修正項目</p>
                    <select id="editWorkReportItem">
                        <option value="start" id="startOp">出勤</option>
                        <option value="break1s" id="break1sOp">休憩1：開始</option>
                        <option value="break1e" id="break1eOp">休憩1：終了</option>
                        <option value="break2s" id="break2sOp">休憩2：開始</option>
                        <option value="break2e" id="break2eOp">休憩2：終了</option>
                        <option value="break3s" id="break3sOp">休憩3：開始</option>
                        <option value="break3e" id="break3eOp">休憩3：終了</option>
                        <option value="end" id="endOp">退勤</option>
                    </select>

                    <p>修正内容</p>
                    <select id="editWorkReportHour">
                        <?php for ($i = 0; $i <= 23; $i++) : ?>
                            <?php $i = sprintf('%02d', $i) ?>
                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                        <?php endfor; ?>
                        <option value="×">×</option>
                    </select>
                    <p class="separator">：</p>
                    <select id="editWorkReportMinutes">
                        <?php for ($i = 0; $i <= 45; $i += 15) : ?>
                            <?php $i = sprintf('%02d', $i) ?>
                            <option value="<?php echo $i ?>"><?php echo $i ?></option>
                        <?php endfor; ?>
                        <option value="×">×</option>
                    </select>

                    <p>修正理由</p>
                    <input type="text" id="editWorkReportReason">

                    <p id="editMsg" class="errorMsg"></p>

                    <button type="button" id="sendEdit">送信</button>
                </div>
            </div>

            <div id="editInfo">
                <p class="guidance">※打刻を「取消」申請したい場合は、「×:×」を選択してください。</p>

                <p class="guidance">※状態が「承認済・訂正済」になるまで勤怠表には反映されません。</p>
            </div>

            <div id="editList">
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <th class="sticky1">対象日</th>
                                <th class="sticky2">項目</th>
                                <th class="w10">状態</th>
                                <th>修正前</th>
                                <th>修正後</th>
                                <th class="w25">理由</th>
                                <th class="w25">申請日</th>
                                <th>処理日</th>
                            </tr>
                        </tbody>
                </table>
                </div>
            </div>
        </div>

        <button type="button" id="closeEdit" class="closeModal">閉じる</button>
    </div>


    <!-- 日報報告 -->
    <div id="dayReport">
        <div class="modalTitle">
            <p class="title">日報報告</p>
        </div>

        <div class="modalBody">
            <p class="guidance">【1】日付を選択してください。</p>
            <div id="dayReportSelectArea">
                <select id="dayReportSelect"></select>
            </div>

            <div id="dayReportDispArea">
                <p class="guidance">日報は提出されています。</p>
                <div id="dayReportDispList">
                    <p></p>
                </div>
            </div>

            <div id="dayReportEditArea">
                <p class="guidance">【2】申請の処理をしてください。</p>
                <div id="dayReportEditList">
                    <div>
                        <table>
                            <tbody>
                                <tr id="dayReportEditListHeader">
                                    <th class="sticky1">承認／却下</th>
                                    <th>名前</th>
                                    <th>項目</th>
                                    <th>修正前</th>
                                    <th>修正後</th>
                                    <th class="w25">理由</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                <p class="guidance">【3】訂正する勤怠を選択してください。</p>
                <div id="dayReportList">
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="sticky1">名前</th>
                                </tr>

                                <tr>
                                    <th class="sticky1">項目</th>
                                </tr>

                                <tr>
                                    <th class="sticky1">出勤</th>
                                </tr>

                                <tr>
                                    <th class="sticky1 borderTopNone borderBottom">休憩1：開始</th>
                                </tr>

                                <tr>
                                    <th class="sticky1 borderTopNone">休憩1：終了</th>
                                </tr>

                                <tr>
                                    <th class="sticky1 borderTopNone borderBottom">休憩2：開始</th>
                                </tr>

                                <tr>
                                    <th class="sticky1 borderTopNone">休憩2：終了</th>
                                </tr>

                                <tr>
                                    <th class="sticky1 borderTopNone borderBottom">休憩3：開始</th>
                                </tr>

                                <tr>
                                    <th class="sticky1 borderTopNone">休憩3：終了</th>
                                </tr>

                                <tr>
                                    <th class="sticky1 borderTopNone">退勤</th>
                                </tr>

                                <tr>
                                    <th class="sticky1">休憩時間</th>
                                </tr>

                                <tr>
                                    <th class="sticky1">実働</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <p class="guidance">【4】訂正する内容を記入してください。</p>
                <div id="inputDayReportArea">
                    <textarea id="inputDayReport" placeholder="（例）&#13;&#10;・訂正事項なし&#13;&#10;・山田太郎[出勤]09:45 → 10:00(*シフト時間前に打刻)&#13;&#10;・佐藤花子[出勤]- → 無断欠勤&#13;&#10;"></textarea>
                </div>

                <p class="guidance">【5】イベントパスワードを入力して送信してください。</p>
                <div id="inputEventPassArea">
                    <input type="password" id="inputEventPass">
                </div>

                <div id="sendDayReportArea">
                    <p id="dayReportMsg" class="errorMsg"></p>

                    <button type="button" id="sendDayReport">送信</button>
                </div>
            </div>
        </div>

        <button type="button" id="closeDayReport" class="closeModal">閉じる</button>
    </div>


</div>