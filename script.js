async function loadCSV() {
    try {
        const res = await fetch(CSV_URL);
        const text = await res.text();
        return parseCSV(text);
    } catch (e) {
        alert("資料載入失敗！");
        return [];
    }
}

function parseCSV(text) {
    const rows = text.split("\n").map(r => r.trim());
    return rows.slice(1).map(r => {
        const c = r.split(",");
        return {
            日期: c[0],
            廳位: c[1],
            客人姓名: c[2],
            電話: c[3],
            桌數: c[4],
            總金額: c[5],
            訂金: c[6],
            備註: c[7] ?? ""
        };
    });
}

document.getElementById("searchBtn").addEventListener("click", async () => {
    const hall = document.getElementById("hallSelect").value;
    const date = document.getElementById("dateInput").value;
    const result = document.getElementById("resultList");

    result.innerHTML = "🔍 載入中...";

    const data = await loadCSV();

    const filtered = data.filter(item =>
        item.日期 === date &&
        (hall === "全部" || item.廳位 === hall)
    );

    if (!filtered.length) {
        result.innerHTML = "<div>❗ 沒有找到資料</div>";
        return;
    }

    result.innerHTML = "";

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${item.客人姓名}（${item.廳位}）</h3>
            <p>📅 日期：${item.日期}</p>
            <p>📞 電話：${item.電話}</p>
            <p>🍽️ 桌數：${item.桌數}</p>
            <p>💰 總金額：${item.總金額}</p>
            <p>💵 訂金：${item.訂金}</p>
        `;

        /* 點擊卡片 → 顯示備註 */
        card.addEventListener("click", () => {
            document.getElementById("noteContent").textContent =
                item.備註.trim() ? item.備註 : "（沒有備註）";

            document.getElementById("modalOverlay").style.display = "flex";
        });

        result.appendChild(card);
    });
});

/* 關閉彈窗 */
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modalOverlay").style.display = "none";
});
