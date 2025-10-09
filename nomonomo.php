<!DOCTYPE html>
<html lang="ja">
    <head>
        <?php include('./include/head.php'); ?>

        <link rel="stylesheet" type="text/css" href="public/css/nomonomo.css">
        <script type="text/javascript" src="public/js/nomonomo.js"></script>
    </head>

    <body>
        <!-- ヘッダー -->
        <?php include('./include/header.php'); ?>


        <!-- メイン -->
        <div id="main">
            <div class="glitch-wrapper">
                <div class="glitch" data-text="のものも！">のものも！</div>
            </div>


            <!-- テキスト -->
            <div id="text1" class="text">
                <p>
                    情報メディア事業部より、<br>
                    花札の「こいこい」を元にしたしたオリジナルゲームをご提供！休憩中などに遊んでみてね。
                </p>
            </div>


            <!-- ヘルプ -->
            <div id="help">
                <button id="opList" type="button">札一覧</button>
                <button id="opHand" type="button">役一覧</button>
            </div>
            <div id="helpImg">
                <img hidden id="list" src="public/img/nomonomo/list.png" alt="">
                <img hidden id="hand" src="public/img/nomonomo/hand.png" alt="">
            </div>


            <!-- ゲームエリア -->
            <div id="field">
                <!-- ポイントエリア -->
                <div id="aria_point">
                    <p>
                        <span id="turn">0</span>ターン目
                    </p>

                    <p>
                        <span id="point">0</span>点
                    </p>
                </div>

                <div id="area_play">
                    <!-- 山札 -->
                    <div id="area_yama">
                        <div id="yamafuda" class="card">
                            <img src="public/img/nomonomo/yama.png" alt="">

                            <p hidden class="pointer">☛</p>
                        </div>

                        <div id="addfuda" class="card"></div>
                    </div>


                    <!-- 場札 -->
                    <div id="area_ba">
                        <div>
                            <?php for ($i = 1; $i <= 24; $i++) : ?>
                                <div id="<?php echo 'bafuda' . $i ?>" class="card"></div>
                            <?php endfor; ?>
                        </div>

                        <p hidden class="pointer">☛</p>
                    </div>

                    <!-- 手札 -->
                    <div id="area_te">
                        <?php for ($i = 1; $i <= 8; $i++) : ?>
                            <div id="<?php echo 'tefuda' . $i ?>" class="card">
                                <img id="<?php echo 'tefudaImg' . $i ?>" src="" alt="">
                            </div>
                        <?php endfor; ?>

                        <p hidden class="pointer">☛</p>
                    </div>
                </div>

                <!-- 取り札 -->
                <div id="area_tori">
                    <div id="hikarifuda">
                        <?php for ($i = 1; $i <= 5; $i++) : ?>
                            <div id="<?php echo 'hikarifuda' . $i ?>" class="card"></div>
                        <?php endfor; ?>
                    </div>
                    <div id="tanefuda">
                        <?php for ($i = 1; $i <= 9; $i++) : ?>
                            <div id="<?php echo 'tanefuda' . $i ?>" class="card"></div>
                        <?php endfor; ?>
                    </div>
                    <div id="labelfuda">
                        <?php for ($i = 1; $i <= 10; $i++) : ?>
                            <div id="<?php echo 'labelfuda' . $i ?>" class="card"></div>
                        <?php endfor; ?>
                    </div>
                    <div id="kasufuda">
                        <?php for ($i = 1; $i <= 24; $i++) : ?>
                            <div id="<?php echo 'kasufuda' . $i ?>" class="card"></div>
                        <?php endfor; ?>
                    </div>
                </div>
            </div>


            <!-- 結果 -->
            <div id="result">
                <p>結果：<span id="point_result"></span>点</p>

                <div>
                    <p>＜内訳＞</p>
                    <p>あっぱれ！五合（五光） ・・・ <span id="point_gokou"       >0</span>点</p>
                    <p>がぶ飲み！四合（四光） ・・・ <span id="point_shikou"      >0</span>点</p>
                    <p>あ、メシ行こ！（雨四光） ・・ <span id="point_ameshikou"   >0</span>点</p>
                    <p>飲んだね！三合（三光） ・・・ <span id="point_sankou"      >0</span>点</p>
                    <p>花見で一杯 ・・・・・・・・・ <span id="point_hanami"      >0</span>点</p>
                    <p>月見で一杯 ・・・・・・・・・ <span id="point_tsukimi"     >0</span>点</p>
                    <p>猪鹿腸詰め（猪鹿蝶） ・・・・ <span id="point_inoshikatyou">0</span>点</p>
                    <p>赤ラベル（赤タン） ・・・・・ <span id="point_akatan"      >0</span>点</p>
                    <p>青ラベル（青タン） ・・・・・ <span id="point_aotan"       >0</span>点</p>
                    <p>タネ ・・・・・・・・・・・・ <span id="point_tane"        >0</span>点</p>
                    <p>タン ・・・・・・・・・・・・ <span id="point_tan"         >0</span>点</p>
                    <p>カス ・・・・・・・・・・・・ <span id="point_kasu"        >0</span>点</p>
                </div>

                <button id="retry" type="button">リトライ</button>
            </div>


            <!-- テキスト -->
            <div id="text2" class="text">
                <p>
                    アプリ作成に興味のある方・エンジニアを目指したい方へ…<br>
                    <br>
                    　情報メディア事業部では、<b>〝未経験でプログラミングスキルが身につく〟</b> カリキュラムを用意しています。 <br>
                     <br>
                    　この「のものも！」ゲームをはじめとしたアプリや弊社のHPも、カリキュラム卒業生が作成しています！<br>               
                    　カリキュラムのみの提供から、弊社でエンジニアとして働きたい方も同時に募集していますので、お気軽にご相談ください！ <br> 
                    <br> 
                    <u>＜連絡先＞ <b>イベント現場責任者</b> または <b>info@aggr.jp</b> まで</u>
                </p>
            </div>
        </div>

        <!-- フッター -->
        <?php include('./include/footer.php'); ?>
    </body>
</html>