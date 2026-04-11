/* ---------------------------------------------------------
   [UI LOGIC] 모든 항목 필수 입력 및 자동 커서 강화 버전
   --------------------------------------------------------- */

// 1. 행사 신청 (상호명 ~ 행사문구까지 전체 검증)
function submitAd() {
    const shop = document.getElementById("shopName");
    const biz = document.getElementById("bizType");
    const area = document.getElementById("area");
    const text = document.getElementById("adText"); // 마지막 행사문구 칸

    if(!shop.value.trim()) { alert("⚠️ 상호명을 입력해 주세요."); shop.focus(); return; }
    if(!biz.value.trim()) { alert("⚠️ 업종/업태를 입력해 주세요."); biz.focus(); return; }
    if(!area.value.trim()) { alert("⚠️ 행사 지역을 입력해 주세요."); area.focus(); return; }
    // 🚀 [추가] 행사 문구 입력 검증
    if(!text.value.trim()) { alert("⚠️ 행사 문구를 입력해 주세요."); text.focus(); return; }

    let adList = JSON.parse(localStorage.getItem("myAds") || "[]");
    adList.push({
        shopName: shop.value,
        bizType: biz.value,
        area: area.value,
        adText: text.value,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("myAds", JSON.stringify(adList));

    alert("✅ [" + shop.value + "] 행사 신청이 완료되었습니다.");
    resetAndGoHome();
}

// 2. 공유 신청 (검증 후 실제 저장 기능 추가)
function submitLoan() {
    const lName = document.getElementById("loanName");
    const lAmount = document.getElementById("loanAmount");
    const lPurpose = document.getElementById("loanPurpose");

    if(!lName.value.trim()) { alert("⚠️ 신청자명을 입력해 주세요."); lName.focus(); return; }
    if(!lAmount.value.trim()) { alert("⚠️ 신청금액을 입력해 주세요."); lAmount.focus(); return; }
    if(!lPurpose.value.trim()) { alert("⚠️ 공유 목적을 입력해 주세요."); lPurpose.focus(); return; }

    // 🚀 [저장 로직 추가]
    let loanList = JSON.parse(localStorage.getItem("myLoans") || "[]");
    loanList.push({
        loanName: lName.value,
        loanAmount: lAmount.value,
        loanPurpose: lPurpose.value,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("myLoans", JSON.stringify(loanList));

    alert("💰 공유 신청이 정상적으로 접수되었습니다.");
    resetAndGoHome();
}

// 3. 행사 루틴 (검증 후 실제 저장 기능 추가)
function submitRoutine() {
    const rOwner = document.getElementById("routineOwner");
    const rRegion = document.getElementById("routineRegion");
    const rText = document.getElementById("routineText");

    if(!rOwner.value.trim()) { alert("⚠️ 제작자 이름을 입력해 주세요."); rOwner.focus(); return; }
    if(!rRegion.value.trim()) { alert("⚠️ 적용 지역을 입력해 주세요."); rRegion.focus(); return; }
    if(!rText.value.trim()) { alert("⚠️ 루틴 내용을 입력해 주세요."); rText.focus(); return; }

    // 🚀 [저장 로직 추가]
    let routineList = JSON.parse(localStorage.getItem("myRoutines") || "[]");
    routineList.push({
        routineOwner: rOwner.value,
        routineRegion: rRegion.value,
        routineText: rText.value,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("myRoutines", JSON.stringify(routineList));

    alert("🌀 새로운 루틴이 성공적으로 생성되었습니다.");
    resetAndGoHome();
}

// 4. 지갑 설립 (이미 정상이므로 유지)
function submitBank() {
    const name = document.getElementById('bankName');
    const phone = document.getElementById('bankPhone');
    const agree = document.getElementById('bankAgree');

    // 🚀 [수정 포인트 1] 추천인 이름을 "직접 가입" 대신 실제 인식된 이름으로 가져옵니다.
    // 만약 window.currentReferrer가 없으면 "직접 가입"으로 표시합니다.
    const finalReferrer = window.currentReferrer || "직접 가입";

    if (!name.value.trim()) { alert("성함을 입력해주세요."); name.focus(); return; }
    if (!agree.checked) { alert("개인정보 동의가 필요합니다."); return; }

    const newUser = {
        bankName: name.value,
        bankPhone: phone.value,
        referrer: finalReferrer, // 🚀 여기에 실제 이름이 들어갑니다.
        date: new Date().toLocaleString()
    };

    let wallets = JSON.parse(localStorage.getItem('fin_wallets') || '[]');
    wallets.unshift(newUser);
    localStorage.setItem('fin_wallets', JSON.stringify(wallets));

    // 🚀 [수정 포인트 2] 알림창에 추천인 이름을 제대로 보여줍니다.
    alert(`${name.value} 님 설립 완료!\n추천인: ${finalReferrer}`);

    // 가입 후 메인화면(나의 현황)으로 이동해서 변화를 보여줍니다.
    showSection('mypage', document.getElementById('btn-mypage'));
}

// --- 공통 보조 함수 (기존과 동일) ---

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