window.onload = () => {

    let turn  = 0;
    let tefudaCnt   = 0;
    let bafudaMax = 0;
    let bafudaMin = 0;
    let tefudaId = '';
    let tefudaNo = '';
    let bafudaId = '';
    let bafudaNo = '';
    let addNo = '';


    // 全カードの作成
    let cardList = [];
    cardList = [...Array(48)].map((_, i) => i + 1);
    pointer("yamafuda")

    
    // 山札からカードを取得
    document.getElementById("yamafuda").onclick = function() {
        turn        = document.getElementById("turn").textContent;
        tefudaCnt   = document.getElementById("area_te").querySelectorAll("img").length;

        var val = {};
        switch (turn) {
            case '0':
                // 手札
                for (let i = 1; i <= 8; i++) {
                    val = getCard(cardList);

                    cardList = val.cardList;
                    document.getElementById("tefudaImg" + i).src = "public/img/nomonomo/" + val.selectCard + ".jpg";
                    document.getElementById("tefuda" + i).style.display = 'flex';
                }

                // 場札
                for (let i = 1; i <= 8; i++) {
                    val = getCard(cardList);

                    cardList = val.cardList;
                    var img = document.createElement('img');
                    img.src = "public/img/nomonomo/" + val.selectCard + ".jpg";
                    img.id = "bafudaImg" + i;
                    document.getElementById("bafuda" + i).appendChild(img);
                    document.getElementById("bafuda" + i).style.display = 'flex'
                }

                document.getElementById("turn").textContent = '1';
                pointer("area_te");
                break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5': 
            case '6':
            case '7':
            case '8':
                if (
                    (8 - tefudaCnt) == turn &&
                    document.getElementById("addfuda").querySelector("img") == null &&
                    document.getElementById("pointer") != null
                ) {
                    val = getCard(cardList);

                    cardList = val.cardList;
                    addNo = val.selectCard;

                    var img = document.createElement('img');
                    img.src = "public/img/nomonomo/" + addNo + ".jpg";
                    document.getElementById("addfuda").appendChild(img);

                    // 場札ピックアップ
                    bafudaMax =  Math.ceil(addNo / 4) * 4;
                    bafudaMin =  bafudaMax - 3;
                    pickupBafuda(bafudaMin, bafudaMax);

                    pointer("area_ba");
                }
        }        
    }


    // 手札の選択
    document.getElementById("area_te").addEventListener('click', (e) => {
        tefudaId = e.target.id;

        if (tefudaId.includes('tefudaImg')) {
            turn        = document.getElementById("turn").textContent;
            tefudaCnt   = document.getElementById("area_te").querySelectorAll("img").length;

            if ((8 - tefudaCnt) == (turn -1)) {
                turn  = document.getElementById("turn").textContent;
                tefudaNo = document.getElementById(tefudaId).getAttribute('src').split("/").reverse()[0].split('.')[0];

                // 選択拡大
                for (let i = 1; i <= 8; i++) {
                    document.getElementById("tefuda" + i).style.width = '5vmin';
                }
                document.getElementById("tefuda" + tefudaId.slice(-1)).style.width = '6vmin'

                // 場札ピックアップ
                bafudaMax =  Math.ceil(tefudaNo / 4) * 4;
                bafudaMin =  bafudaMax - 3;
                pickupBafuda(bafudaMin, bafudaMax);
            }
        }
    })


    // 場札選択
    document.getElementById("area_ba").addEventListener('click', (e) => {
        bafudaId = e.target.id;

        let selectfudNo = addNo ? addNo : tefudaNo;
        let selected = 'false';
        
        if (bafudaId.includes('bafudaImg')) {
            bafudaNo = document.getElementById(bafudaId).getAttribute('src').split("/").reverse()[0].split('.')[0];

            // 場札取得
            if (bafudaMin <= bafudaNo && bafudaNo <= bafudaMax) {
                document.getElementById(bafudaId).style.display = 'none';
                document.getElementById(bafudaId.replace("Img", "")).style.background = 'none';

                // 取り札表示
                let cardRank = '';
                let torifudaCnt = '';
                if (bafudaNo != '') {
                    // 手札・追加札
                    cardRank = checkCard(selectfudNo);
                    torifudaCnt = document.getElementById(cardRank).querySelectorAll("img").length;
                    var img = document.createElement('img');
                    img.src = "public/img/nomonomo/" + selectfudNo + ".jpg";
                    document.getElementById(cardRank + (torifudaCnt + 1)).appendChild(img);
                    document.getElementById(cardRank + (torifudaCnt + 1)).style.display = 'flex'

                    // 場札
                    cardRank = checkCard(bafudaNo);
                    torifudaCnt = document.getElementById(cardRank).querySelectorAll("img").length;
                    var img = document.createElement('img');
                    img.src = "public/img/nomonomo/" + bafudaNo + ".jpg";
                    document.getElementById(cardRank + (torifudaCnt + 1)).appendChild(img);
                    document.getElementById(cardRank + (torifudaCnt + 1)).style.display = 'flex'
                }

                checkPoint();
                selected = 'ture';
            }
        } else {
            // 場札
            if (selectfudNo && bafudaId.includes('bafuda')) {
                var img = document.createElement('img');
                img.src = "public/img/nomonomo/" + selectfudNo + ".jpg";
                img.id = bafudaId.replace("bafuda", "bafudaImg");
                document.getElementById(bafudaId).appendChild(img);

                selected = 'ture';
            }            
        }

        // 後処理
        if (selected == 'ture') {
            if (addNo) {
                document.getElementById("addfuda").querySelector("img").remove();

                if (turn < 8) {
                    document.getElementById("turn").textContent = Number(turn) + 1;
                    pointer("area_te");
                } else {
                    pointer("end");
                    document.getElementById("result").style.display = 'flex';
                }
            } else {
                document.getElementById(tefudaId).remove();
                document.getElementById(tefudaId.replace("Img", "")).style.width = '5vmin';
                document.getElementById(tefudaId.replace("Img", "")).style.background = 'none';
                pointer("yamafuda");
            }

            Array.from(document.getElementById("area_ba").querySelectorAll("img")).forEach(function(e) {
                e.style.filter = 'brightness(100%)';
            });

            addNo = '';
            tefudaId = '';
            tefudaNo = '';
            bafudaId = '';
            bafudaNo = '';
            bafudaMax = 0;
            bafudaMin = 0;
        }
    })

    // リトライ
    document.getElementById("retry").addEventListener('click', (e) => {
        window.location.reload();
    })

    
    // ヘルプ表示
    document.getElementById("opList").addEventListener('click', (e) => {
        document.getElementById("helpImg").style.display = 'flex';
        document.getElementById("hand").style.display = 'none';
        document.getElementById("list").style.display = 'block';
    })
    document.getElementById("opHand").addEventListener('click', (e) => {
        document.getElementById("helpImg").style.display = 'flex';
        document.getElementById("list").style.display = 'none';
        document.getElementById("hand").style.display = 'block';
    })
    document.getElementById("helpImg").addEventListener('click', (e) => {
        document.getElementById("helpImg").style.display = 'none';
        document.getElementById("hand").style.display = 'none';
        document.getElementById("list").style.display = 'none';
    })
}


// 山札からカードを取得
function getCard(cardList) {

    // カードの取得
    const selectCard = cardList[Math.floor(Math.random() * cardList.length)];

    // 山札から削除
    cardList = cardList.filter(function(v) {
        return v !== selectCard;
    });
    
    return {
        "cardList"      : cardList,
        "selectCard"    : selectCard
    }
}


// 札チェック
function checkCard(cardNo) {

    let rank = '';
    switch (Number(cardNo)) {
        case 4:
        case 12:
        case 32:
        case 44:
        case 48:
            rank = 'hikarifuda';
            break;
    
        case 8:
        case 16:
        case 20:
        case 24:
        case 28:
        case 31:
        case 36:
        case 40:
        case 43:
            rank = 'tanefuda';
            break;

        case 3:
        case 7:
        case 11:
        case 15:
        case 19:
        case 23:
        case 27:
        case 35:
        case 39:
        case 42:
            rank = 'labelfuda';
            break;

        default:
            rank = 'kasufuda';
            break;
    }

    console.log(cardNo, rank);
    
    return rank;
}


// 場札ピックアップ
function pickupBafuda(bafudaMin, bafudaMax) {

    for (let i = 1; i <= 24; i++) {
        var pickBafudaId = "bafudaImg" + i;

        if (document.getElementById(pickBafudaId) != null) {
            var pickBafudaNo = document.getElementById(pickBafudaId).getAttribute('src').split("/").reverse()[0].split('.')[0];

            document.getElementById(pickBafudaId).style.filter = 'brightness(100%)';
            if (pickBafudaNo < bafudaMin || pickBafudaNo > bafudaMax) {
                document.getElementById(pickBafudaId).style.filter = 'brightness(25%)';
            }
        }
    }

    // 場札エリア追加
    const bafudaCnt = document.getElementById("area_ba").querySelectorAll("img").length;
    document.getElementById("bafuda" + (bafudaCnt + 1)).style.display = 'flex';

}


// ポインター
function pointer(target) {

    if (document.getElementById("pointer") != null) {
        document.getElementById("pointer").style.display = "none";
        document.getElementById("pointer").removeAttribute("id"); 
    }

    if (document.getElementById("pointer2") != null) {
        document.getElementById("pointer2").style.display = "none";
        document.getElementById("pointer2").removeAttribute("id"); 
    }

    if (target != 'end') {
        document.getElementById(target).querySelector("p").id = "pointer";
        document.getElementById("pointer").style.display = "block";
        document.getElementById("pointer").animate(
            [{ opacity : '0' }, { opacity : '1' }],
            { duration: 2000, iterations: Infinity }
        );

        if (target == "area_te") {
            document.getElementById("area_ba").querySelector("p").id = "pointer2";
            document.getElementById("pointer2").style.display = "block";
            document.getElementById("pointer2").animate(
                [{ opacity : '0' }, { opacity : '1' }],
                { duration: 2000, iterations: Infinity }
            );
        }
    }
}


// 役チェック
function checkPoint() {
    let myCardList = [];
    let point = 0;

    // 取り札
    document.getElementById("area_tori").querySelectorAll("img").forEach(function(e) {
        myCardList.push(e.getAttribute('src').split("/").reverse()[0].split('.')[0]);
    });

    // 五光
    let gokou = 0;
    [4, 12, 32, 44, 48].forEach(function(n) {
        if (myCardList.some(cardNo => cardNo == n)) {
            gokou = gokou + 1;
        }
    });
    if (gokou == 5) {
        point = point + 10;
        document.getElementById("point_gokou").textContent = 10;
    }

    // 四光
    let shikou = 0;
    if (gokou != 5) {
        [4, 12, 32, 48].forEach(function(n) {
            if (myCardList.some(cardNo => cardNo == n)) {
                shikou = shikou + 1;
            }
        });
        if (shikou == 4) {
            point = point + 8;
            document.getElementById("point_shikou").textContent = 8;
        }   
    }
    
    // 雨四光
    let ameshikou = 0;
    if (gokou != 5 && shikou != 4) {
        [4, 12, 32, 44].forEach(function(n) {
            if (myCardList.some(cardNo => cardNo == n)) {
                ameshikou = ameshikou + 1;
            }
        });
        if (ameshikou == 4) {
            point = point + 7;
            document.getElementById("point_ameshikou").textContent = 7;
        }   
    }




    // 三光
    let sankou = 0;
    if (gokou != 5 && shikou != 4 && ameshikou != 4) {
        [4, 12, 32, 48].forEach(function(n) {
            if (myCardList.some(cardNo => cardNo == n)) {
                sankou = sankou + 1;
            }
        });
        if (sankou >= 3) {
            point = point + 5;
            document.getElementById("point_sankou").textContent = 5;
        }
    }

    // 花見で一杯
    let hanami = 0;
    [12, 36].forEach(function(n) {
        if (myCardList.some(cardNo => cardNo == n)) {
            hanami = hanami + 1;
        }
    });
    if (hanami == 2) {
        point = point + 5;
        document.getElementById("point_hanami").textContent = 5;
    }

    // 月見で一杯
    let tsukimi = 0;
    [32, 36].forEach(function(n) {
        if (myCardList.some(cardNo => cardNo == n)) {
            tsukimi = tsukimi + 1;
        }
    });
    if (tsukimi == 2) {
        point = point + 5;
        document.getElementById("point_tsukimi").textContent = 5;
    }

    // 猪鹿蝶
    let inoshikatyou = 0;
    [24, 28, 40].forEach(function(n) {
        if (myCardList.some(cardNo => cardNo == n)) {
            inoshikatyou = inoshikatyou + 1;
        }
    });
    if (inoshikatyou == 3) {
        point = point + 5;
        document.getElementById("point_inoshikatyou").textContent = 5;
    }

    // 赤短
    let akatan = 0;
    [3, 7, 11].forEach(function(n) {
        if (myCardList.some(cardNo => cardNo == n)) {
            akatan = akatan + 1;
        }
    });
    if (akatan == 3) {
        point = point + 5;
        document.getElementById("point_akatan").textContent = 5;
    }

    // 青短
    let aotan = 0;
    [23, 35, 39].forEach(function(n) {
        if (myCardList.some(cardNo => cardNo == n)) {
            aotan = aotan + 1;
        }
    });
    if (aotan == 3) {
        point = point + 5;
        document.getElementById("point_aotan").textContent = 5;
    }

    // タネ
    if (inoshikatyou != 3) {
        let tane = 0;
        [8, 16, 20, 24, 28, 31, 36, 40, 43].forEach(function(n) {
            if (myCardList.some(cardNo => cardNo == n)) {
                tane = tane + 1;
            }
        });
        if (tane >= 5) {
            point = point + (1 + tane - 5);
            document.getElementById("point_tane").textContent = (1 + tane - 5);
        }
    }

    // タン
    let tan = 0;
    if (akatan != 3 && aotan != 3) {
        [3, 7, 11, 15, 19, 23, 27, 35, 39, 42].forEach(function(n) {
            if (myCardList.some(cardNo => cardNo == n)) {
                tan = tan + 1;
            }
        });
        if (tan >= 5) {
            point = point + (1 + tan - 5);
            document.getElementById("point_tan").textContent = (1 + tan - 5);
        }
    } else if (akatan == 3 && aotan != 3) {
        [15, 19, 23, 27, 35 ,39, 42].forEach(function(n) {
            if (myCardList.some(cardNo => cardNo == n)) {
                tan = tan + 1;
            }
        });
        point = point + tan;
        document.getElementById("point_tan").textContent = tan;
    } else if (akatan != 3 && aotan == 3) {
        [3, 7, 11, 15, 19, 27, 42].forEach(function(n) {
            if (myCardList.some(cardNo => cardNo == n)) {
                tan = tan + 1;
            }
        });
        point = point + tan;
        document.getElementById("point_tan").textContent = tan;
    } 

    // カス
    let kasu = 0;
    [
        1, 2,
        5, 6,
        9, 10,
        13, 14,
        17, 18,
        21, 22,
        25, 26,
        29, 30,
        33, 34,
        37, 38,
        41,
        45, 46, 47
    ].forEach(function(n) {
        if (myCardList.some(cardNo => cardNo == n)) {
            kasu = kasu + 1;
        }
    });
    if (kasu >= 10) {
        point = point + (1 + kasu - 10);
        document.getElementById("point_kasu").textContent = (1 + kasu - 10);
    }

    document.getElementById("point").textContent = point;
    document.getElementById("point_result").textContent = point;

    console.log(myCardList, point);
}
