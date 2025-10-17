<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/index.css">
        <script type="text/javascript" src="public/js/index.js"></script>
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>


        <!-- メイン -->
        <div id="main">
            <!-- メニュー -->
            <div id="menuBar">
                <div id="network">
                    <p id="networkStatus"></p>
                    <p id="reflevted"></p>
                </div>
            </div>

            <div id="link">
                <button type="button" id="redirectStaff">スタッフ</button>
                <button type="button" id="redirectStamp">打刻画面</button>
                <button type="button" id="redirectNomonomo">のものも！</button>
                <button type="button" id="redirectAdmin">管理者</button>
            </div>
        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>