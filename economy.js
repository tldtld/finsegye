/* =========================================================
   1. 배경 애니메이션 (별 내리는 효과 - 선생님 원본 유지)
   ========================================================= */
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

/* =========================================================
   2. 핀세계 통합 데이터 엔진 (최신순 정렬 & 자동 갱신)
   ========================================================= */
const FinData = {
    // 데이터 가져오기 (키값 앞에 fin_을 붙여 관리)
    get: (key) => JSON.parse(localStorage.getItem('fin_' + key)) || [],

    // 데이터 추가 (unshift를 사용하여 새 데이터가 무조건 맨 위로!)
    add: (key, item) => {
        let list = FinData.get(key);
        item.date = new Date().toLocaleString(); // 날짜 자동 기록
        list.unshift(item); // 🚀 새 데이터를 배열 맨 앞에 추가
        localStorage.setItem('fin_' + key, JSON.stringify(list));
        FinData.updateUI(); // 저장 즉시 화면 갱신
    },

    // 모든 리스트 화면 새로고침
    updateUI: () => {
        // 1. 지갑 설립 내역
        FinData.renderList('wallets', 'walletDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; margin-bottom:5px;">
                <b style="color:gold; font-size:0.9em;">${item.bankName}</b><br>
                <small style="color:#888;">${item.date}</small>
            </div>
        `);

        // 2. 행사 신청 내역
        FinData.renderList('ads', 'adListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; margin-bottom:5px;">
                <b style="color:#ff00ff; font-size:0.9em;">${item.shopName}</b><br>
                <small style="color:#888;">${item.bizType} | ${item.area}</small>
            </div>
        `);

        // 3. 공유 신청 내역
        FinData.renderList('loans', 'loanListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; margin-bottom:5px;">
                <b style="color:#ff9900; font-size:0.9em;">${item.loanName}</b><br>
                <small style="color:#888;">${item.loanAmount}만원 | ${item.date}</small>
            </div>
        `);

        // 4. 행사 루틴 내역
        FinData.renderList('routines', 'routineListDisplay', (item) => `
            <div style="border-bottom:1px solid #333; padding:5px 0; margin-bottom:5px;">
                <b style="color:#cc99ff; font-size:0.9em;">${item.routineOwner}</b><br>
                <small style="color:#888;">${item.routineRegion}</small>
            </div>
        `);
    },

    // 실제 HTML에 그려주는 함수 (높이 제한은 HTML 구조에서 처리)
    renderList: (key, elementId, template) => {
        const list = FinData.get(key);
        const el = document.getElementById(elementId);
        if(!el) return;
        el.innerHTML = list.length === 0 
            ? '<div style="color:#555; font-size:0.8em; padding:10px;">내역 없음</div>' 
            : list.map(template).join('');
    }
};

// 페이지 로드 시 실행
window.addEventListener('load', () => FinData.updateUI());


/* =========================================================
   3. 핀세계 경제 지표 및 배당 엔진 (변수 포함 완결본)
   - 공유비율이 0%일 때만 자산 합산이 일어납니다.
   ========================================================= */

// [연료: 기본 데이터 설정]
let loanPercent = 100.0; 
let aiRate = 0.0; 
let advertiser = 50000; // 초기 행사자 금액
let consumer = 20000;   // 초기 소비자 금액
let decreasing = true; 
let pause = false;

// [엔진: 수치 계산 함수]
function updateStatus() {
    // 1. 지급준비율 (실시간 랜덤 변동)
    const reserveElem = document.getElementById("reserveValue");
    if(reserveElem) {
        reserveElem.innerText = (98.8 + Math.random() * 1.2).toFixed(2) + "%";
    }

    // 2. 공유비율 감소 로직 (100% -> 0% 하강)
    if(!pause) {
        if(decreasing) {
            loanPercent -= 0.5;
            if(loanPercent <= 0) {
                loanPercent = 0; 
                decreasing = false; 
                pause = true;
                
                // 0% 도달 시 5초 동안 멈추며 수익 배분 (이때 숫자가 올라감)
                setTimeout(() => { 
                    loanPercent = 100.0; 
                    decreasing = true; 
                    pause = false; 
                }, 5000);
            }
        }
    }

    const loanElem = document.getElementById("loanPercent");
    if(loanElem) {
        loanElem.innerText = loanPercent.toFixed(1) + "%";
    }

    // 3. AI 수익률 (지속 상승)
    aiRate += (Math.random() * 0.05);
    const aiRateElem = document.getElementById("aiRate");
    if(aiRateElem) {
        aiRateElem.innerText = "+" + aiRate.toFixed(1) + "%";
    }

    // 4. 자산 합산 (공유비율 0%일 때만 5초간 가동)
    if (loanPercent === 0) {
        let baseAmount = 20; 
        let bonusRate = 1.2; 
        
        advertiser += (baseAmount * bonusRate);
        consumer += baseAmount;

        if(document.getElementById("advValue")) 
            document.getElementById("advValue").innerText = Math.floor(advertiser).toLocaleString() + "원";
        if(document.getElementById("consValue")) 
            document.getElementById("consValue").innerText = Math.floor(consumer).toLocaleString() + "원";
        if(document.getElementById("totalValue")) 
            document.getElementById("totalValue").innerText = Math.floor(advertiser + consumer).toLocaleString() + "원";
    }
}

// [시동: 엔진 가동]
// 기존에 혹시 돌아가고 있을지 모를 엔진을 끄고 새로 시동을 겁니다.
if (window.finEngine) clearInterval(window.finEngine);
window.finEngine = setInterval(updateStatus, 100);
/* =========================================================
   4. AI 투자 포착 로직 (수정 없음)
   ========================================================= */
const assets = ["★핀세계(FINSEGYE)★", "삼성전자", "미국국채10Y", "GOLD(금)", "SILVER(은)", "USD/KRW(달러)", "비트코인"];
const actions = ["적극매수(STRONG BUY)", "매수(BUY)", "보유(HOLD)"];

function triggerAiInvestmentSignal() {
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
setInterval(triggerAiInvestmentSignal, 10000);
setTimeout(triggerAiInvestmentSignal, 1000);
