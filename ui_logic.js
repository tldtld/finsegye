/* ---------------------------------------------------------
   [UI LOGIC] 모든 항목 필수 입력 및 자동 커서 강화 버전
   --------------------------------------------------------- */

/* 📂 ui_logic.js - 데이터 이름표 통일 버전 */
function submitAd() {
    const shop = document.getElementById("shopName");
    const biz = document.getElementById("bizType");
    const area = document.getElementById("area");
    const text = document.getElementById("adText");

    if(!shop.value.trim()) { alert("⚠️ 상호명을 입력해 주세요."); shop.focus(); return; }
    if(!biz.value.trim()) { alert("⚠️ 업종을 입력해 주세요."); biz.focus(); return; }
    if(!area.value.trim()) { alert("⚠️ 지역을 입력해 주세요."); area.focus(); return; }
    if(!text.value.trim()) { alert("⚠️ 문구를 입력해 주세요."); text.focus(); return; }

    const item = { shopName: shop.value, bizType: biz.value, area: area.value, date: new Date().toLocaleString() };
    saveFinData('ads', item);
    alert("✅ [" + shop.value + "] 행사 신청 완료!");
    resetAndGoHome();
}

function submitLoan() {
    const lName = document.getElementById("loanName");
    const lAmount = document.getElementById("loanAmount");
    const lPurpose = document.getElementById("loanPurpose");

    if(!lName.value.trim()) { alert("⚠️ 신청자명을 입력해 주세요."); lName.focus(); return; }
    if(!lAmount.value.trim()) { alert("⚠️ 금액을 입력해 주세요."); lAmount.focus(); return; }
    if(!lPurpose.value.trim()) { alert("⚠️ 목적을 입력해 주세요."); lPurpose.focus(); return; }

    saveFinData('loans', { loanName: lName.value, loanAmount: lAmount.value });
    alert("💰 공유 신청 접수 완료!");
    resetAndGoHome();
}

function submitRoutine() {
    const rOwner = document.getElementById("routineOwner");
    const rRegion = document.getElementById("routineRegion");
    const rText = document.getElementById("routineText");

    if(!rOwner.value.trim()) { alert("⚠️ 제작자명을 입력해 주세요."); rOwner.focus(); return; }
    if(!rRegion.value.trim()) { alert("⚠️ 지역을 입력해 주세요."); rRegion.focus(); return; }
    if(!rText.value.trim()) { alert("⚠️ 내용을 입력해 주세요."); rText.focus(); return; }

    saveFinData('routines', { routineOwner: rOwner.value, routineRegion: rRegion.value });
    alert("🌀 루틴 생성 완료!");
    resetAndGoHome();
}

function submitBank() {
    const name = document.getElementById("bankName");
    const agree = document.getElementById("bankAgree");

    if(!name.value.trim()) { alert("⚠️ 성명을 입력해 주세요."); name.focus(); return; }
    if(!agree.checked) { alert("⚠️ 개인정보 동의가 필요합니다."); return; }

    saveFinData('wallets', { bankName: name.value });
    alert("🏦 [" + name.value + "]님, AI 지갑 설립 완료!");
    resetAndGoHome();
}

// [공통 저장 보조 함수]
function saveFinData(key, item) {
    let list = JSON.parse(localStorage.getItem('fin_' + key) || '[]');
    item.date = new Date().toLocaleString();
    list.unshift(item);
    localStorage.setItem('fin_' + key, JSON.stringify(list));
    if(typeof forceRefreshData === 'function') forceRefreshData();
}

function resetAndGoHome() {
    document.querySelectorAll('input, textarea').forEach(el => {
        if(el.type === 'checkbox') el.checked = false; else el.value = '';
    });
    showSection('dashboard', document.getElementById('btn-dashboard'));
}

function refreshMyPage() {
    // 1. 지갑 정보 (이름만 표시하여 공간 확보)
    const walletData = localStorage.getItem("myWallet");
    const walletDisplay = document.getElementById("walletDisplay");
    if (walletData && walletDisplay) {
        const w = JSON.parse(walletData);
        walletDisplay.innerHTML = `<b>${w.userName}</b><br><span style="font-size:0.9em;">${w.userPhone}</span>`;
    }

    // 2. 행사 신청 (상호명만 표시)
    const adData = localStorage.getItem("myAds");
    const adListDisplay = document.getElementById("adListDisplay");
    if (adData && adListDisplay) {
        const ads = JSON.parse(adData);
        if(ads.length > 0) {
            adListDisplay.innerHTML = ads.slice(-2).reverse().map(ad => `<li>• ${ad.shopName}</li>`).join('');
        }
    }

    // 3. 공유 신청 (금액만 표시)
    const loanData = localStorage.getItem("myLoans");
    const loanListDisplay = document.getElementById("loanListDisplay");
    if (loanData && loanListDisplay) {
        const loans = JSON.parse(loanData);
        if(loans.length > 0) {
            loanListDisplay.innerHTML = loans.slice(-2).reverse().map(l => `<li>• ${l.loanAmount}</li>`).join('');
        }
    }

    // 4. 행사 루틴 (제작자만 표시)
    const routineData = localStorage.getItem("myRoutines");
    const routineListDisplay = document.getElementById("routineListDisplay");
    if (routineData && routineListDisplay) {
        const routines = JSON.parse(routineData);
        if(routines.length > 0) {
            routineListDisplay.innerHTML = routines.slice(-2).reverse().map(r => `<li>• ${r.routineOwner}</li>`).join('');
        }
    }
}
