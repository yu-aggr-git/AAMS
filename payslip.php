<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/payslip.css">
        <script type="text/javascript" src="public/js/payslip.js"></script>
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>

        <!-- メニュー -->
        <div id="payslipInfoMenu">
            <div id="payDayArea">
                <p>支払日：</p>
                <select id="payDaySelect"></select>
            </div>

            <div id="registeredNetPayArea">
                <p>登録済み差引支給額：</p>
                <p id="registeredNetPay"> - </p>
            </div>

            <div id="menuButton">
                <button type="button" id="reGet" hidden>再取得</button>
                <button type="button" id="reCalc" hidden>再計算</button>
                <button type="button" id="registerPay" hidden>給与登録</button>
                <button type="button" id="updatePay" hidden>給与更新</button>
                <button type="button" id="pdf" hidden>PDF化</button>
            </div>
            <p id="payslipInfoMenuMsg" class="errorMsg"></p>
        </div>


        <!-- メイン -->
        <div id="main">

            <!-- 基本情報 -->
            <p class="title">給与明細書</p>
            <div id="payslipInfoArea">
                <div id="days">
                    <p>期間：</p>
                    <select id="minDaySelect">
                        <option value=""></option>
                    </select>
                    <p>～</p>
                    <select id="maxDaySelect">
                        <option value=""></option>
                    </select>
                </div>

                <div>
                    <div id="event">
                        <p>会場名：</p>
                        <p id="eventDisp"></p>
                        <p class="sep"></p>
                    </div>

                    <div id="name">
                        <p>氏名：</p>
                        <p id="nameDisp"></p>
                        <p>様</p>
                    </div>
                </div>
            </div>

            <!-- 給与明細 -->
            <div id="payslipArea">
                <table id="payslipTable">
                    <tbody>
                        <tr>
                            <th>出勤日数</th>
                            <th>基本給</th>
                            <th>経験者手当</th>
                            <th>深夜手当</th>
                            <th>出勤手当</th>
                            <th>諸手当</th>
                            <th></th>
                            <th>支給額</th>
                        </tr>

                        <tr>
                            <td id="daysInput"></td>
                            <td id="basicInput"></td>
                            <td id="experienceInput"></td>
                            <td id="lateNightInput"></td>
                            <td id="attendanceInput"></td>
                            <td id="allowancesInput"></td>
                            <td></td>
                            <td rowspan="3" id="grossInput"></td>
                        </tr>

                        <tr>
                            <th>交通費</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>

                        <tr>
                            <td id="transportationInput"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                        <tr>
                            <th>住民税</th>
                            <th>源泉徴収税</th>
                            <th>厚生年金</th>
                            <th>健康保険</th>
                            <th>雇用保険</th>
                            <th></th>
                            <th></th>
                            <th>控除額</th>
                        </tr>

                        <tr>
                            <td></td>
                            <td id="taxInput"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td id="deductionInput"></td>
                        </tr>

                        <tr>
                            <th colspan="7">備考</th>
                            <th>差引支給額</th>
                        </tr>

                        <tr>
                            <td colspan="7">
                                <textarea id="memoInput"></textarea>
                            </td>
                            <td id="netPayInput"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 出勤明細 -->
            <p class="title">出勤明細</p>
            <div id="workReporArea">
                <table id="workReportTable">
                    <tbody>
                        <tr id="workReportTableHeader">
                            <th>日付</th>
                            <th class="w10 borderRight">勤務時間</th>
                            <th class="borderLeftNone">基本給</th>
                            <th>経験者手当</th>
                            <th>深夜手当</th>
                            <th>出勤手当</th>
                            <th>諸手当</th>
                            <th class="borderRight">交通費</th>
                            <th class="borderRight borderLeftNone">源泉徴収税</th>
                            <th class="borderLeftNone">合計(一日)</th>
                        </tr>
                    </tbody>
                </table>
            </div>


        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>