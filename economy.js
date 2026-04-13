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
   2. 핀세계 통합 데이터 엔진 (모든 항목 무제한 출력 보강)
   ========================================================= */
const FinData = {
    // 1. 데이터 가져오기 (키값 통일: fin_ 접두사 사용)
    get: (key) => JSON.parse(localStorage.getItem('fin_' + key)) || [],

    // 2. 데이터 추가 (unshift로 맨 위에 쌓기)
    add: (key, item) => {
        let list = FinData.get(key);
        item.date = new Date().toLocaleString();
        item.id = Date.now();
        list.unshift(item); // 🚀 새 데이터를 맨 앞에 추가
        localStorage.setItem('fin_' + key, JSON.stringify(list));

        // 저장 즉시 모든 UI 업데이트
        FinData.updateUI();
    },

    // 3. 모든 화면 새로고침 (숫자 + 4대 리스트 전체)
    updateUI: () => {
        const wallets = FinData.get('wallets');

        // [메인 & 지갑설립 탭 숫자 업데이트]
        // ID가 totalUserCount인 모든 곳에 숫자 반영
        const countElements = document.querySelectorAll('#totalUserCount, #realtimeUserCount');
        countElements.forEach(el => {
            el.innerText = wallets.length.toLocaleString();
        });

        // [나의 현황 - 4대 리스트 전체 출력]
        // 지갑 설립 리스트
        FinData.renderList('wallets', 'walletDisplay', (item) => `
            <div style="border-bottom:1px solid #444; padding:8px 0; font-size:0.85em;">
                <b style="color:gold;">[지갑설립]</b> ${item.bankName}<br>
                <small style="color:#aaa;">${item.date}</small>
            </div>
        `);

        // 행사 신청 리스트
        FinData.renderList('ads', 'adListDisplay', (item) => `
            <div style="border-bottom:1px solid #444; padding:8px 0; font-size:0.85em;">
                <b style="color:#ff00ff;">[행사]</b> ${item.shopName}<br>
                <small style="color:#aaa;">${item.bizType} | ${item.area}</small>
            </div>
        `);

        // 공유 신청 리스트
        FinData.renderList('loans', 'loanListDisplay', (item) => `
            <div style="border-bottom:1px solid #444; padding:8px 0; font-size:0.85em;">
                <b style="color:#ff9900;">[공유]</b> ${item.loanName}<br>
                <small style="color:#aaa;">${item.loanAmount}만원 | ${item.date}</small>
            </div>
        `);

        // 행사 루틴 리스트
        FinData.renderList('routines', 'routineListDisplay', (item) => `
            <div style="border-bottom:1px solid #444; padding:8px 0; font-size:0.85em;">
                <b style="color:#cc99ff;">[루틴]</b> ${item.routineOwner}<br>
                <small style="color:#aaa;">${item.routineRegion} | ${item.date}</small>
            </div>
        `);

        // [지갑설립 탭 전용] 실시간 명단 업데이트 (최근 10명)
        const liveList = document.getElementById('realtimeNameList');
        if(liveList) {
            if(wallets.length > 0) {
                liveList.innerHTML = wallets.slice(0, 10).map(u => `✅ ${u.bankName} 님 설립완료`).join('<br>');
            } else {
                liveList.innerHTML = "신규 설립을 기다리고 있습니다.";
            }
        }
    },

    // 리스트 그리기 함수 (제한 없이 전체 출력)
    renderList: (key, elementId, template) => {
        const list = FinData.get(key);
        const el = document.getElementById(elementId);
        if(!el) return;
        // 🚀 slice(0, 2)를 제거하여 모든 리스트가 나오게 수정함
        el.innerHTML = list.length === 0 ? '<div style="color:#666; font-size:0.8em; padding:10px;">내역 없음</div>' : list.map(template).join('');
    }
};

// 페이지 로드 시 실행
window.addEventListener('load', () => FinData.updateUI());

/* =========================================================
   3. 경제 지표 및 배당 로직 (수정 없음)
   ========================================================= */
let loanPercent = 100.0, aiRate = 0.0, advertiser = 20000, consumer = 10000, decreasing = true, pause = false;

/* =========================================================
   3. 경제 지표 및 배당 로직 (수정본)
   - 공유비율이 0%일 때만 자산 합계가 동작하도록 변경
   ========================================================= */
function updateStatus() {
    // [1] 지급준비율 업데이트 (항시 작동)
    const reserveElem = document.getElementById("reserveValue");
    if(reserveElem) reserveElem.innerText = (98.8 + Math.random() * 1.2).toFixed(2) + "%";

    // [2] 공유비율 감소 로직
    if(!pause) {
        if(decreasing) {
            loanPercent -= 0.5;
            if(loanPercent <= 0) {
                loanPercent = 0; 
                decreasing = false; 
                pause = true;
                // 0% 도달 시 5초간 멈추며 자산 합산 진행
                setTimeout(() => { 
                    loanPercent = 100.0; 
                    decreasing = true; 
                    pause = false; 
                }, 5000);
            }
        }
    }

    const loanElem = document.getElementById("loanPercent");
    if(loanElem) loanElem.innerText = loanPercent.toFixed(1) + "%";

    // [3] AI 수익률 업데이트 (항시 작동)
    aiRate += (Math.random() * 0.05);
    const aiRateElem = document.getElementById("aiRate");
    if(aiRateElem) aiRateElem.innerText = "+" + aiRate.toFixed(1) + "%";

    // [4] ★ 핵심 수정: 공유비율이 0일 때만 자산 합계 동작 ★
    if (loanPercent === 0) {
        let baseAmount = 20;
        let bonusRate = 1.2;
        advertiser += (baseAmount * bonusRate);
        consumer += baseAmount;

        // 화면 숫자 업데이트
        if(document.getElementById("advValue")) 
            document.getElementById("advValue").innerText = Math.floor(advertiser).toLocaleString() + "원";
        if(document.getElementById("consValue")) 
            document.getElementById("consValue").innerText = Math.floor(consumer).toLocaleString() + "원";
        if(document.getElementById("totalValue")) 
            document.getElementById("totalValue").innerText = Math.floor(advertiser + consumer).toLocaleString() + "원";
    }
}
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
