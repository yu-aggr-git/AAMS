<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/stamp.css">
        <script type="text/javascript" src="public/js/stamp.js"></script>
        <link rel="manifest" href="manifest.json">
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>

        <!-- メイン -->
        <div id="main">

            <!-- モーダル -->
            <?php include('./include/modal.php'); ?>

            <!-- メニュー -->
            <div id="menuBar">
                <div id="network">
                    <p id="networkStatus"></p>
                    <p id="reflevted"></p>
                </div>

                <button type="button" id="menuOpen">i</button>
            </div>

            <!-- イベント情報 -->
            <div id="info">
                <div>
                    <p id="eventName"></p>
                </div>
            </div>

            <!-- 打刻 -->
            <div id="time">
                <p id="realday"></p>
                <p id="realtime"></p>
                <button id="stampButton" type="button" value="">打刻</button>
            </div>
            
            <!-- 出勤状態 -->
            <div id="workStatus">
                <table>
                    <tbody>
                        <tr>
                            <th>出勤中</th>
                            <th>休憩中</th>
                            <th>退勤済</th>
                        </tr>
                        <tr>
                            <td id="startList"></td>
                            <td id="breakList"></td>
                            <td id="endList"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>