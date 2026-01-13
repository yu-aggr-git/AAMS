<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/form.css">
        <script type="text/javascript" src="public/js/form.js"></script>
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>


        <!-- メイン -->
        <div id="main">

            <!-- イベント選択 -->
            <div id="eventSelectArea">
                <div class="text">
                    <p>
                        弊社の求人募集にご応募いただき<br>
                        誠にありがとうございます。<br>
                        <br>
                        <br>
                        下記の入力欄に基本情報を入力ください。<br>
                        <br>
                    </p>
                </div>

                <p>イベント名</p>
                <select id="selectEventName"></select>

                <p>メールアドレス</p>
                <input type="text" id="inputMail">

                <p id="eventSelectMsg" class="errorMsg"></p>

                <button id="sendEventSelect" type="button">送信</button>

                <div class="text">
                    <p>
                        （ ※イベントが募集中の場合、応募済みの登録内容も確認ができます。 ）
                    </p>
                </div>
            </div>


            <!-- 情報入力 -->
            <div id="applicationInfoInputArea">
                <div class="text">
                    <p id="inputText">下記、必要項目を入力してください。</p>
                </div>

                <dl>
                    <dt class="borderTop topLeft">項目</dt>
                    <dd class="borderTop topRight">内容</dd>

                    <dt>イベント名</dt>
                    <dd>
                        <p id="eventName"></p>
                    </dd>

                    <dt>メールアドレス</dt>
                    <dd>
                        <p id="mail"></p>
                    </dd>

                    <dt>氏名</dt>
                    <dd>
                        <p hidden id="name"></p>
                        <input hidden type="text" id="inputName">
                    </dd>

                    <dt>生年月日</dt>
                    <dd>
                        <p hidden id="birthday"></p>

                        <div hidden id="inputBirthdayArea">
                            <select id="inputBirthdayYear">
                                <?php for ($i =  date("Y") - 14; $i >= date("Y") - 70; $i--) : ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>

                            <p class="separator">-</p>

                            <select id="inputBirthdayMonth">
                                <?php for ($i = 1; $i <= 12; $i ++) : ?>
                                    <?php $i = sprintf('%02d', $i) ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>

                            <p class="separator">-</p>

                            <select id="inputBirthdayDay">
                                <?php for ($i = 1; $i <= 31; $i++) : ?>
                                    <?php $i = sprintf('%02d', $i) ?>
                                    <option value="<?php echo $i ?>"><?php echo $i ?></option>
                                <?php endfor; ?>
                            </select>

                        </div>
                    </dd>

                    <dt>ご職業</dt>
                    <dd>
                        <p hidden id="job"></p>
                        <input hidden type="text" id="inputJob">
                    </dd>

                    <dt>電話番号</dt>
                    <dd>
                        <p hidden id="tell"></p>
                        <input hidden type="text" id="inputTell">
                    </dd>

                    <dt>最寄り駅 </dt>
                    <dd>
                        <p hidden id="closestStation"></p>
                        <input hidden type="text" id="inputClosestStation">
                    </dd>

                    <dt>
                        出勤可能日<br>
                        <br>
                        ※出勤不可は「×～×」を選択
                    </dt>
                    <dd id="availableInputArea">
                        <p hidden id="available"></p>
                    </dd>

                    <dt>備考</dt>
                    <dd>
                        <p hidden id="memo"></p>
                        <textarea
                            hidden
                            id="inputMemo"
                            placeholder="（例）&#13;&#10;・週3日希望&#13;&#10;・日8時間以内&#13;&#10;"></textarea>
                    </dd>

                    <dt>応募元</dt>
                    <dd>
                        <p hidden id="platform"></p>
                        <input hidden type="text" id="inputPlatform" list="platformList" placeholder="テキスト入力 or 選択">
                        <datalist id="platformList">
                            <option value="Indeed">
                            <option value="Airワーク">
                            <option value="LINEの案内">
                            <option value="AAMSのお知らせ">
                            <option value="紹介（※紹介者の名前入力）">
                        </datalist>
                    </dd>

                    <dt>
                        顔写真<br>
                        <br>
                        ※弊社イベントの<br>
                        　経験者は再提出不要
                    </dt>
                    <dd id="photo">
                        <a id="photoUrl" href="" target="_blank">写真送信フォーム</a>
                        <p>
                            <br>
                            ※Googleアカウントを<br>
                            　お持ちでない方は<br>
                            　baito-staff@aggr.jpに<br>
                            　メールでお送りください。<br>
                        </p>
                    </dd>

                    <dt>登録・更新日時</dt>
                    <dd>
                        <p id="applicationDt">-</p>
                    </dd>
                </dl>

                <p id="applicationInfotMsg" class="errorMsg"></p>

                <div id="buttonArea">
                    <button hidden id="cancelApplicationInfo" class="cancelButton" type="button">取消</button>
                    <button hidden id="sendApplicationInfo" type="button">送信</button>
                    <button hidden id="editApplicationInfo" type="button">編集</button>
                </div>
            </div>


            <!-- LINEグループ -->
            <div id="lineGroupArea">
                <p id="newEventNotice">新着イベントのお知らせ</p>

                <p>
                    弊社は定期的にイベント求人をしております。
                    <br>
                    <br>募集開始のお知らせを受け取りたい方は、
                    <br>QRコードまたは招待URLからLINEグループにご参加ください。
                </p>

                <img src="public/img/LINE-GROUP-8665.jpg" alt="">

                <a href="https://line.me/R/ti/g/h9KSDTaq7T">https://line.me/R/ti/g/h9KSDTaq7T</a>

                <p>
                    ※求人の配信のみに使用するLINEグループです。
                    <br>お問い合わせ等は、baito-staff@aggr.jpまでご連絡ください。
                </p>
            </div>

        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>