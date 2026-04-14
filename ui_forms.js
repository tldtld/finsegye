/* =========================================================
   핀세계 통합 데이터 엔진 (무제한 스크롤 & 즉시 반영 버전)
   ========================================================= */
const FinData = {
    // [데이터 가져오기]
    get: (key) => JSON.parse(localStorage.getItem('fin_' + key)) || [],

    // [데이터 추가 및 저장]
    add: (key, item) => {
        let list = FinData.get(key);
        item.date = new Date().toLocaleString();
        list.unshift(item); // 최신 데이터가 맨 위로
        localStorage.setItem('fin_' + key, JSON.stringify(list));
        
        // ★ 즉시 반영: 등록 버튼 누르자마자 리스트 갱신
        FinData.updateUI(); 
    },

    // [나의 현황 리스트 출력]
    updateUI: () => {
        // 1. 지갑 설립 (무제한)
        FinData.renderList('wallets', 'walletDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0;">
                <b style="color:gold;">✅ ${item.bankName}</b> 님 설립완료
            </div>
        `);

        // 2. 행사 신청
        FinData.renderList('ads', 'adListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0;">
                <b style="color:#ff00ff;">📢 ${item.shopName}</b> (${item.area})
            </div>
        `);

        // 3. 공유 신청
        FinData.renderList('loans', 'loanListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0;">
                <b style="color:#ff9900;">💰 ${item.loanName}</b> ${item.loanAmount}만
            </div>
        `);

        // 4. 행사 루틴
        FinData.renderList('routines', 'routineListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0;">
                <b style="color:#cc99ff;">🌀 ${item.routineOwner}</b> (${item.routineRegion})
            </div>
        `);
    },

    // 대표님 요청: 3개 제한 삭제, 전체 출력 (HTML에서 설정한 스크롤로 작동)
    renderList: (key, elementId, template) => {
        const list = FinData.get(key);
        const el = document.getElementById(elementId);
        if(!el) return;
        el.innerHTML = list.length === 0 
            ? '<div style="color:#555; padding:10px; font-size:0.8em;">내역 없음</div>' 
            : list.map(template).join('');
    }
};

/* =========================================================
   2. 신청 버튼 로직 (UI 연결)
   ========================================================= */
function submitAd() {
    const shop = document.getElementById("shopName");
    if(!shop.value.trim()) { alert("상호명을 입력하세요."); shop.focus(); return; }
    FinData.add('ads', { shopName: shop.value, area: document.getElementById("area").value });
    alert("✅ 행사 신청 완료!");
    resetAndGoHome();
}

function submitLoan() {
    const name = document.getElementById("loanName");
    if(!name.value.trim()) { alert("이름을 입력하세요."); name.focus(); return; }
    FinData.add('loans', { loanName: name.value, loanAmount: document.getElementById("loanAmount").value });
    alert("💰 공유 신청 완료!");
    resetAndGoHome();
}

function submitRoutine() {
    const owner = document.getElementById("routineOwner");
    if(!owner.value.trim()) { alert("제작자명을 입력하세요."); owner.focus(); return; }
    FinData.add('routines', { routineOwner: owner.value, routineRegion: document.getElementById("routineRegion").value });
    alert("🌀 루틴 생성 완료!");
    resetAndGoHome();
}

function submitBank() {
    const name = document.getElementById("bankName");
    if(!name.value.trim()) { alert("성명을 입력하세요."); name.focus(); return; }
    FinData.add('wallets', { bankName: name.value });
    alert("🏦 AI 지갑 설립 완료!");
    resetAndGoHome();
}

function resetAndGoHome() {
    document.querySelectorAll('input, textarea').forEach(el => el.value = '');
    if(typeof showSection === "function") {
        showSection('dashboard', document.getElementById('btn-dashboard'));
    }
}

// 초기 로드 시 실행
window.addEventListener('load', () => FinData.updateUI());
