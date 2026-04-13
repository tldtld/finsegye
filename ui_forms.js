ui_form.js

/* 📂 ui_forms.js 저장 로직 확인 */
function submitBank() {
    var n = document.getElementById('bankName').value;
    var p = document.getElementById('bankPhone').value;
    var a = document.getElementById('bankAddress').value;

    if (!n) { alert("성함을 입력해야 저장됩니다!"); return; }

    var item = { bankName: n, bankPhone: p, bankAddress: a, date: new Date().toLocaleString() };

    // 🚀 [확실한 저장]
    var keys = ['wallets', 'fin_wallets'];
    keys.forEach(function(k) {
        var list = JSON.parse(localStorage.getItem(k) || '[]');
        list.unshift(item);
        localStorage.setItem(k, JSON.stringify(list));
    });

    // ⭐ 이 문구가 뜨면 성공입니다!
    alert("🏦 [" + n + "] 님 데이터가 창고에 입고되었습니다!");

    document.getElementById('bankName').value = "";
    showSection('mypage'); // 나의 현황으로 이동
}
