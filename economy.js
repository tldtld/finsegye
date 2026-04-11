/* =========================================================
   [최종 엔진] 데이터 보존 + 초기화 대응 버전
   ========================================================= */

// 1. 데이터 불러오기 함수
function loadEconomicData() {
    window.advertiser = parseFloat(localStorage.getItem('fin_advertiser')) || 50000;
    window.consumer = parseFloat(localStorage.getItem('fin_consumer')) || 20000;
    window.loanPercent = 100.0;
}

loadEconomicData(); // 앱 시작 시 실행

window.isSystemPaused = false;
let aiRateValue = 0.0;
let decreasing = true;
let pause = false;

// 2. 화면 숫자 갱신 및 자동 저장
window.renderAssetUI = function() {
    const advEl = document.getElementById("advValue");
    const consEl = document.getElementById("consValue");
    const totalEl = document.getElementById("totalValue");
    const loanElem = document.getElementById("loanPercent");

    if(advEl) advEl.innerText = Math.floor(window.advertiser).toLocaleString() + "원";
    if(consEl) consEl.innerText = Math.floor(window.consumer).toLocaleString() + "원";
    if(totalEl) totalEl.innerText = Math.floor(window.advertiser + window.consumer).toLocaleString() + "원";

    if(loanElem) {
        let displayPercent = isNaN(window.loanPercent) ? 100.0 : window.loanPercent;
        loanElem.innerText = displayPercent.toFixed(1) + "%";
    }

    // 변경될 때마다 저장
    localStorage.setItem('fin_advertiser', window.advertiser);
    localStorage.setItem('fin_consumer', window.consumer);
};

// [추가] 데이터 초기화 함수 (대표님 요청)
window.resetEconomicData = function() {
    if(confirm("모든 자산 수치를 초기화하시겠습니까?")) {
        localStorage.removeItem('fin_advertiser');
        localStorage.removeItem('fin_consumer');
        loadEconomicData(); // 초기값으로 재로딩
        window.renderAssetUI();
        alert("수치가 초기화되었습니다.");
    }
};

// 3. 메인 엔진 (100ms마다 실행)
function updateStatus() {
    if (window.isSystemPaused === true) return;

    // AI 수익률/지급준비율 등 로직 (생략 없이 기존과 동일하게 작동)
    aiRateValue += (Math.random() * 0.05);
    const aiRateElem = document.getElementById("aiRate");
    if(aiRateElem) aiRateElem.innerText = "+" + aiRateValue.toFixed(1) + "%";

    const reserveElem = document.getElementById("reserveValue");
    if(reserveElem) reserveElem.innerText = (98.8 + Math.random() * 1.2).toFixed(2) + "%";

    if(!pause && decreasing) {
        window.loanPercent -= 0.67;
        if(window.loanPercent <= 0) {
            window.loanPercent = 0; decreasing = false; pause = true;
            setTimeout(() => { window.loanPercent = 100.0; decreasing = true; pause = false; }, 15000);
        }
    }

    if (window.loanPercent <= 0) {
        window.advertiser += 24; // 배당 로직
        window.consumer += 20;
    }

    window.renderAssetUI();

   // economy.js 맨 아래에 붙여넣기
window.resetEconomy = function() {
    window.advertiser = 50000;
    window.consumer = 20000;
    localStorage.setItem('fin_advertiser', 50000);
    localStorage.setItem('fin_consumer', 20000);
    // 화면 수치 즉시 갱신
    if (typeof renderAssetUI === "function") renderAssetUI();
    alert("수치가 초기화되었습니다.");
};
}

setInterval(updateStatus, 100);
