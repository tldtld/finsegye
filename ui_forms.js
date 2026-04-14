
/* =========================================================
   1. 핀세계 통합 데이터 관리 엔진 (FinData)
   - 최신 3개 데이터만 화면에 노출하여 레이아웃 밀림 방지
   ========================================================= */
const FinData = {
    // [데이터 가져오기]
    get: (key) => JSON.parse(localStorage.getItem('fin_' + key)) || [],

    // [데이터 추가 및 저장]
    add: (key, item) => {
        let list = FinData.get(key);
        item.date = new Date().toLocaleString(); // 저장 시점 기록
        list.unshift(item); // 최신 데이터가 맨 앞으로 오게 추가
        localStorage.setItem('fin_' + key, JSON.stringify(list));
        
        // 데이터가 바뀌었으므로 화면의 '나의 현황' 리스트도 즉시 갱신
        FinData.updateUI(); 
    },

    // [나의 현황 화면 업데이트]
    updateUI: () => {
        // 1. AI 지갑 설립 리스트 (최근 3인)
        FinData.renderList('wallets', 'walletDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; font-size:0.75em; color:#eee;">
                <b>✅ ${item.bankName}</b> 님 <span style="font-size:0.85em; color:#888;">설립완료</span>
            </div>
        `);

        // 2. 행사 신청 리스트 (최근 3개)
        FinData.renderList('ads', 'adListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; font-size:0.75em; color:#eee;">
                <b>📢 ${item.shopName}</b> <span style="font-size:0.85em; color:#888;">(${item.area})</span>
            </div>
        `);

        // 3. 공유 신청 리스트 (최근 3개)
        FinData.renderList('loans', 'loanListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; font-size:0.75em; color:#eee;">
                <b>💰 ${item.loanName}</b> <span style="font-size:0.85em; color:#888;">${item.loanAmount}만</span>
            </div>
        `);

        // 4. 행사 루틴 리스트 (최근 3개)
        FinData.renderList('routines', 'routineListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; font-size:0.75em; color:#eee;">
                <b>🌀 ${item.routineOwner}</b> <span style="font-size:0.85em; color:#888;">(${item.routineRegion})</span>
            </div>
        `);
    },

    // [리스트 실제 렌더링 함수 - 최신 3개 제한 로직 포함]
    renderList: (key, elementId, template) => {
        const list = FinData.get(key);
        const el = document.getElementById(elementId);
        if(!el) return;

        // ★ 대표님 요청 사항: 최신 3개만 잘라서 출력
        const limitedList = list.slice(0, 3); 

        el.innerHTML = limitedList.length === 0 
            ? '<div style="color:#555; font-size:0.75em; padding:10px;">내역 없음</div>' 
            : limitedList.map(template).join('');
    }
};

/* =========================================================
   2. 각 탭별 신청 버튼 작동 로직 (Submission)
   ========================================================= */

// [행사 신청]
function submitAd() {
    const shop = document.getElementById("shopName");
    const biz = document.getElementById("bizType");
    const area = document.getElementById("area");
    const text = document.getElementById("adText");

    if(!shop.value.trim()) { alert("⚠️ 상호명을 입력해 주세요."); shop.focus(); return; }
    
    FinData.add('ads', { shopName: shop.value, bizType: biz.value, area: area.value });
    alert("✅ [" + shop.value + "] 행사 신청 완료!");
    resetAndGoHome();
}

// [공유 신청]
function submitLoan() {
    const lName = document.getElementById("loanName");
    const lAmount = document.getElementById("loanAmount");
    
    if(!lName.value.trim()) { alert("⚠️ 신청자명을 입력해 주세요."); lName.focus(); return; }
    if(!lAmount.value) { alert("⚠️ 금액을 입력해 주세요."); lAmount.focus(); return; }
    
    FinData.add('loans', { loanName: lName.value, loanAmount: lAmount.value });
    alert("💰 공유 신청 접수 완료!");
    resetAndGoHome();
}

// [루틴 생성]
function submitRoutine() {
    const rOwner = document.getElementById("routineOwner");
    const rRegion = document.getElementById("routineRegion");
    
    if(!rOwner.value.trim()) { alert("⚠️ 제작자명을 입력해 주세요."); rOwner.focus(); return; }
    
    FinData.add('routines', { routineOwner: rOwner.value, routineRegion: rRegion.value });
    alert("🌀 루틴 생성 완료!");
    resetAndGoHome();
}

// [지갑 설립]
function submitBank() {
    const name = document.getElementById("bankName");
    const agree = document.getElementById("bankAgree");

    if(!name.value.trim()) { alert("⚠️ 성명을 입력해 주세요."); name.focus(); return; }
    if(!agree.checked) { alert("⚠️ 개인정보 동의가 필요합니다."); return; }

    FinData.add('wallets', { bankName: name.value });
    alert("🏦 [" + name.value + "]님, AI 지갑 설립 완료!");
    resetAndGoHome();
}

/* =========================================================
   3. 보조 유틸리티 함수
   ========================================================= */

// 입력폼 초기화 및 메인 화면으로 이동
function resetAndGoHome() {
    document.querySelectorAll('input, textarea').forEach(el => {
        if(el.type === 'checkbox') el.checked = false; else el.value = '';
    });
    // 대시보드 탭 활성화 (showSection 함수는 ui_dashboard.js 등에 있다고 가정)
    if(typeof showSection === "function") {
        showSection('dashboard', document.getElementById('btn-dashboard'));
    }
}

// 페이지가 로드될 때 '나의 현황'에 기존 데이터 뿌리기
window.addEventListener('load', () => FinData.updateUI());
