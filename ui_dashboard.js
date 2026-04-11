/* 📂 ui_dashboard.js - [데이터 강제 검색 및 무제한 출력 버전] */

function showSection(id, btn) {
    // 1. 모든 섹션 숨기기
    document.querySelectorAll("section").forEach(s => s.style.display = "none");

    // 2. 선택한 섹션 보이기
    const target = document.getElementById(id);
    if(target) {
        target.style.display = "block";

        // 커서 자동 이동
        setTimeout(() => {
            const firstInput = target.querySelector('input:not([type="checkbox"]), textarea');
            if (firstInput) firstInput.focus();
        }, 150);
    }

    // 3. 하단 버튼 활성화
    document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active"));
    const targetBtn = btn || document.getElementById('btn-' + id);
    if(targetBtn) targetBtn.classList.add("active");

    // 4. 세션 저장
    sessionStorage.setItem("lastTab", id);
    window.scrollTo(0, 0);

    // 🚀 섹션 이동 시 즉시 데이터 새로고침
    forceRefreshData();
}

// 📊 [강제 집행] 이름표가 무엇이든 데이터를 무조건 찾아오는 함수
function forceRefreshData() {
    const configs = [
        { key: 'wallets', display: 'walletDisplay', label: '지갑설립', nameKey: 'bankName' },
        { key: 'ads', display: 'adListDisplay', label: '행사', nameKey: 'shopName' },
        { key: 'loans', display: 'loanListDisplay', label: '공유', nameKey: 'loanName' },
        { key: 'routines', display: 'routineListDisplay', label: '루틴', nameKey: 'routineOwner' }
    ];

    configs.forEach(conf => {
        // 🔓 모든 가능한 조합을 다 뒤집니다 (fin_wallets, wallets, fin_bankForm 등)
        let raw = localStorage.getItem('fin_' + conf.key) ||
                  localStorage.getItem(conf.key) ||
                  localStorage.getItem('fin_bankForm') || // 지갑설립 특이 케이스
                  '[]';

        let list = [];
        try {
            list = JSON.parse(raw);
        } catch(e) { list = []; }

        const el = document.getElementById(conf.display);
        if(el) {
            if(Array.isArray(list) && list.length > 0) {
                // 🚀 slice(0, 2) 없이 전체 출력 (최근 등록 순)
                el.innerHTML = list.map(item => `
                    <div style="border-bottom:1px solid #444; padding:10px 0; font-size:0.85em;">
                        <b style="color:gold;">[${conf.label}]</b> ${item[conf.nameKey] || item.name || '등록회원'} 님<br>
                        <small style="color:#888;">${item.date || ''}</small>
                    </div>
                `).join('');
            } else {
                el.innerHTML = '<div style="color:#666; font-size:0.8em; padding:10px;">내역 없음</div>';
            }
        }

        // 📈 메인 화면 및 지갑설립 탭 숫자 실시간 연동
        if(conf.key === 'wallets') {
            const mCount = document.getElementById('totalUserCount');
            const rCount = document.getElementById('realtimeUserCount');
            if(mCount) mCount.innerText = list.length;
            if(rCount) rCount.innerText = list.length;
        }
    });
}

// ⏱️ 앱 시작 시 실행 및 1초마다 강제 동기화 (깜빡임/사라짐 방지)
window.onload = function() {
    const last = sessionStorage.getItem("lastTab");
    showSection(last || "dashboard");
    forceRefreshData();
};

// 다른 파일이 데이터를 지우지 못하게 1초마다 화면을 다시 그립니다.
setInterval(forceRefreshData, 1000);
