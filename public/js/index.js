window.onload = () => {
    var isOnline = navigator.onLine;
    isOnline ? online() : offline();

    window.addEventListener("online", function(){
        window.location.reload();
    }, false);

    window.addEventListener("offline", function() {
        window.location.reload();
    }, false)


    // 画面遷移：打刻
    document.getElementById("redirectStamp").onclick = function() {
        location.assign('stamp.php');
    }
}


function offline() {
    console.log('インターネットから切断されました');

    // 表示切替
    document.getElementById("networkStatus").textContent = 'off-line';
    document.getElementById("networkStatus").style.background = '#41438bff';
}


function online() {
    console.log('インターネットに接続中です');
    
    // 表示切替
    document.getElementById("networkStatus").textContent = 'on-line';
    document.getElementById("networkStatus").style.background = '#dc4618ff';


    // 画面遷移：スタッフ
    document.getElementById("redirectStaff").onclick = function() {
        location.assign('staff.php');
    }

    // 画面遷移：のものも
    document.getElementById("redirectNomonomo").onclick = function() {
        location.assign('nomonomo.php');
    }

    // 画面遷移：応募フォーム
    document.getElementById("redirectForm").onclick = function() {
        location.assign('form.php');
    }

    // 画面遷移：シフト
    document.getElementById("redirectShift").onclick = function() {
        location.assign('shift.php');
    }

    // 画面遷移：管理者
    document.getElementById("redirectAdmin").onclick = function() {
        location.assign('admin.php');
    }

}