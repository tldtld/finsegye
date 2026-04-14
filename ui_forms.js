/* =========================================================
   핀세계 통합 데이터 엔진 (무제한 스크롤 & 즉시 반영)
   ========================================================= */
const FinData = {
    // [데이터 가져오기]
    get: (key) => JSON.parse(localStorage.getItem('fin_' + key)) || [],

    // [데이터 추가 및 즉시 갱신]
    add: (key, item) => {
        let list = FinData.get(key);
        item.date = new Date().toLocaleString();
        list.unshift(item); // 최신 데이터가 맨 위로
        localStorage.setItem('fin_' + key, JSON.stringify(list));
        
        // ★ 핵심: 데이터를 저장하자마자 화면을 다시 그립니다.
        FinData.updateUI(); 
    },

    // [나의 현황 화면 업데이트]
    updateUI: () => {
        // 1. AI 지갑 설립 리스트
        FinData.renderList('wallets', 'walletDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:8px 0; font-size:0.85em;">
                <b style="color:gold;">✅ ${item.bankName}</b> 님 설립완료<br>
                <small style="color:#666;">${item.date}</small>
            </div>
        `);

        // 2. 행사 신청 리스트
        FinData.renderList('ads', 'adListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:8px 0; font-size:0.85em;">
                <b style="color:#ff00ff;">📢 ${item.shopName}</b> (${item.area})
            </div>
        `);

        // 3. 공유 신청 리스트
        FinData.renderList('loans', 'loanListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:8px 0; font-size:0.85em;">
                <b style="color:#ff9900;">💰 ${item.loanName}</b> ${item.loanAmount}만
            </div>
        `);

        // 4. 행사 루틴 리스트
        FinData.renderList('routines', 'routineListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:8px 0; font-size:0.85em;">
                <b style="color:#cc99ff;">🌀 ${item.routineOwner}</b> (${item.routineRegion})
            </div>
        `);
    },

    // [리스트 출력 - 무제한 스크롤]
    renderList: (key, elementId, template) => {
        const list = FinData.get(key);
        const el = document.getElementById(elementId);
        if(!el) return;
        el.innerHTML = list.length === 0 
            ? '<div style="color:#555; padding:10px; font-size:0.8em;">내역 없음</div>' 
            : list.map(template).join('');
    }
};

// 페이지 로드 시 즉시 실행하여 기존 내역 표시
window.addEventListener('load', () => FinData.updateUI());
