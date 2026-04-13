/* 📂 ui_dashboard.js - 탭 죽음 방지 완전체 버전 */
window.showSection = function(id, btn) {
    console.log("현재 요청된 탭 ID:", id); // 개발자 도구 확인용

    // 1. 모든 섹션 숨기기
    const sections = document.querySelectorAll("section");
    sections.forEach(s => { s.style.display = "none"; });

    // 2. 대상 섹션 찾기
    const target = document.getElementById(id);
    if (target) {
        target.style.display = "block";
        console.log(id + " 섹션 활성화 성공!");
    } else {
        // [긴급] 만약 섹션을 못 찾으면 대시보드라도 강제로 띄웁니다.
        document.getElementById('dashboard').style.display = "block";
        console.error("오류: " + id + " 라는 ID를 가진 섹션이 HTML에 없습니다!");
    }

    // 3. 버튼 불 켜기
    document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active"));
    const targetBtn = btn || document.getElementById('btn-' + id);
    if (targetBtn) targetBtn.classList.add("active");

    window.scrollTo(0, 0);

    // 4. 데이터 갱신 (에러 방지를 위해 체크 후 실행)
    if (typeof forceRefreshData === 'function') {
        forceRefreshData();
    }
};
