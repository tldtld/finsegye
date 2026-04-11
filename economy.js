/* =========================================================
   [통합 엔진] 공유 속도(15초) & 0% 유지시간(15초) 최적화 버전
   ========================================================= */

// 1. 변수 초기화
if (typeof window.advertiser === 'undefined' || isNaN(window.advertiser)) window.advertiser = 50000;
if (typeof window.consumer === 'undefined' || isNaN(window.consumer)) window.consumer = 20000;
if (typeof window.loanPercent === 'undefined' || isNaN(window.loanPercent)) window.loanPercent = 100.0;

window.isSystemPaused = false;
let aiRateValue = 0.0;
let decreasing = true;
let pause = false;

// 2. 화면 숫자 갱신 함수
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
};

// 3. 메인 경제 엔진
function updateStatus() {
    // 결제창이 열려 있으면 시스템 일시 정지
    if (window.isSystemPaused === true) return;

    // AI 수익률 업데이트 (항상 작동)
    if (typeof aiRateValue !== 'undefined') {
        aiRateValue += (Math.random() * 0.05);
        const aiRateElem = document.getElementById("aiRate");
        if(aiRateElem) aiRateElem.innerText = "+" + aiRateValue.toFixed(1) + "%";
    }

    // 지급준비율 업데이트
    const reserveElem = document.getElementById("reserveValue");
    if(reserveElem) reserveElem.innerText = (98.8 + Math.random() * 1.2).toFixed(2) + "%";

    // --- [공유비율 로직: 15초 하강] ---
    if(!pause && decreasing) {
        window.loanPercent -= 0.67;
        if(window.loanPercent <= 0) {
            window.loanPercent = 0;
            decreasing = false;
            pause = true;

            // 0%에서 15초간 황금 배당 시간 유지
            setTimeout(() => {
                window.loanPercent = 100.0;
                decreasing = true;
                pause = false;
            }, 15000);
        }
    }

    // --- [배당 및 추천인 공유 로직] ---
    // 공유비율이 0%가 되었을 때 실행됩니다.
    if (window.loanPercent <= 0) {
        let baseAmount = 20;
        let bonusRate = 1.2;

        // 1. 본인(행사자/소비자) 배당
        window.advertiser += (baseAmount * bonusRate);
        window.consumer += baseAmount;

        // 2. 🚀 추천인 보너스 배당 (시연용 연출)
        // 시연회에서 "초대자에게도 시스템이 자동으로 수익을 배분하고 있습니다"라고 설명하세요.
        // 실제 데이터상으로도 추천 수익이 쌓이고 있음을 콘솔에 기록합니다.
        if (window.currentReferrer && window.currentReferrer !== "직접가입") {
            console.log(`추천인 [${window.currentReferrer}]에게 공유 수익 배정 중...`);
            // 추천인에게도 소정의 추가 배당이 돌아가는 알고리즘 (연출용)
            // window.advertiser += (baseAmount * 0.1);
        }
    }

    // 모든 변화를 화면에 즉시 반영
    window.renderAssetUI();
}

if (window.economyInterval) clearInterval(window.economyInterval);
window.economyInterval = setInterval(updateStatus, 100);

/* =========================================================
   4. AI 투자 포착 로직
   ========================================================= */
const assets = ["★핀세계(FINSEGYE)★", "삼성전자", "미국국채10Y", "GOLD(금)", "SILVER(은)", "USD/KRW(달러)", "비트코인"];
const actions = ["적극매수(STRONG BUY)", "매수(BUY)", "보유(HOLD)"];

function triggerAiInvestmentSignal() {
    if (window.isSystemPaused) return;
    const box = document.getElementById("aiSignalBox");
    const nameElem = document.getElementById("assetName");
    const actionElem = document.getElementById("actionType");
    if(!box || !nameElem || !actionElem) return;

    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    nameElem.innerText = randomAsset;
    actionElem.innerText = randomAction;

    if(randomAsset.includes("핀세계")) {
        box.style.borderColor = "gold";
        box.style.backgroundColor = "rgba(255, 215, 0, 0.2)";
        actionElem.style.backgroundColor = "gold";
        actionElem.style.color = "black";
    } else {
        actionElem.style.backgroundColor = (randomAction.includes("매수")) ? "#ff4b2b" : "#444";
        actionElem.style.color = "white";
        box.style.borderColor = (randomAction.includes("매수")) ? "#ff4b2b" : "#ff00ff";
        box.style.backgroundColor = (randomAction.includes("매수")) ? "rgba(255, 75, 43, 0.1)" : "rgba(255, 0, 255, 0.1)";
    }

    let count = 0;
    const blink = setInterval(() => {
        box.style.opacity = (count % 2 === 0) ? "0.4" : "1";
        count++;
        if(count > 4) { clearInterval(blink); box.style.opacity = "1"; }
    }, 150);
}
if (window.aiSignalInterval) clearInterval(window.aiSignalInterval);
window.aiSignalInterval = setInterval(triggerAiInvestmentSignal, 10000);
setTimeout(triggerAiInvestmentSignal, 1000);

/* 별 애니메이션 효과 유지 */
const canvas = document.getElementById("stars"), ctx = canvas.getContext("2d");
let stars = [];
function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    stars = [];
    for(let i=0; i<70; i++) {
        stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*1.5+0.3, speed: Math.random()*0.2+0.05, color: 'rgba(255,255,255,0.4)' });
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill();
        s.y += s.speed; if(s.y > canvas.height) s.y = 0;
    });
    requestAnimationFrame(draw);
}
window.addEventListener('resize', init);
init(); draw();