async function loadCSV() {
    try {
        const res = await fetch(CSV_URL);
        const data = await res.text();
        return parseCSV(data);
    } catch (e) {
        alert("資料載入失敗，請檢查 API 或網路");
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.split("\n").map(l => l.trim());
    const header = lines[0].split(",");

    return lines.slice(1).map(row => {
        const cols = row.split(",");
        return {
            日期: cols[0],
            廳位: cols[1],
            客人姓名: cols[2],
            電話: cols[3],
            桌數: cols[4],
            總金額: cols[5],
            訂金: cols[6],
        };
    });
}

document.getElementById("searchBtn").addEventListener("click", async () => {
    const hall = document.getElementById("hallSelect").value;
    const date = document.getElementById("dateInput").value;

    const resultBody = document.getElementById("resultBody");
    resultBody.innerHTML = "";

    const allData = await loadCSV();

    const filtered = allData.filter(item => {
        const matchDate = item.日期 === date;
        const matchHall = (hall === "全部" ? true : item.廳位 === hall);
        return matchDate && matchHall;
    });

    filtered.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.日期}</td>
            <td>${item.廳位}</td>
            <td>${item.客人姓名}</td>
            <td>${item.電話}</td>
            <td>${item.桌數}</td>
            <td>${item.總金額}</td>
            <td>${item.訂金}</td>
        `;
        resultBody.appendChild(tr);
    });
});
