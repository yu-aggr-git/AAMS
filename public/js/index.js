window.onload = () => {
    document.getElementById("redirectStaff").onclick = function() {
        location.assign('staff.php');
    }

    document.getElementById("redirectStamp").onclick = function() {
        location.assign('stamp.php');
    }

    document.getElementById("redirectAdmin").onclick = function() {
        location.assign('admin.php');
    }
}
