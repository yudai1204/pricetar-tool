console.log("extension loaded");
//URLからGETパラメータを取得
let params = new URL(location.href).searchParams;
if (params.get("utilityResetMode") === "true") {
    resetPrice();
}
const infoTable = document.getElementById("infoTable");
if (infoTable) {
    const monthSelectForm = document.getElementById("monthSelectForm");
    if (monthSelectForm) {
        monthSelectForm.insertAdjacentHTML("beforeEnd", `
        <a href="javascript:void(0);" id="resetZero" style="margin-right: 12px;margin-left: auto;display: block;width: fit-content;">返金されたものを初期化する</a>
        `);
        document.getElementById("resetZero").addEventListener("click", function () {
            resetPrice();
        });
    }
}

function resetPrice() {
    let resetCount = 0;
    if (params.get("utilityResetCount")) {
        resetCount = Number(params.get("utilityResetCount"));
    }
    console.log("reset");
    console.log({ resetCount });
    const infoTable = document.getElementById("infoTable");
    const rows = infoTable.getElementsByTagName("tr");
    console.log("rows:" + rows.length);
    for (const row of rows) {
        const colmun = row.getElementsByTagName("td")[4];
        if (colmun && colmun.innerHTML.includes("返金</span>")) {
            row.getElementsByTagName("td")[8].querySelector(".form-inline input[type=text]").value = "";
            let event = new Event('change');
            row.getElementsByTagName("td")[8].querySelector(".form-inline input[type=text]").dispatchEvent(event);
            resetCount++;
            console.log("done");
        }
    }
    console.log("Done.");
    console.log({ resetCount });
    const footer = document.querySelector(".pagination.pagination-lg");
    if (footer && footer.innerHTML.includes("次のページ")) {
        const nextBtn = footer.querySelectorAll("li")[footer.querySelectorAll("li").length - 1];
        console.log("Next");
        if (nextBtn.classList.contains("disabled")) {
            console.log("EOC");
            alert("すべての返金されたアイテムの仕入価格をリセットしました。返金されたアイテムは" + resetCount + "件見つかりました。");
        } else {
            console.log("now location changing");
            setTimeout(function () {
                if (location.href.includes("utilityResetCount")) {
                    window.location.href = nextBtn.querySelector("a").getAttribute("href").slice(0, nextBtn.querySelector("a").getAttribute("href").indexOf("&utilityResetMode")) + '&utilityResetMode=true&utilityResetCount=' + resetCount;
                } else {
                    window.location.href = nextBtn.querySelector("a").getAttribute("href") + '&utilityResetMode=true&utilityResetCount=' + resetCount;
                }
            }, 1000);
        }
    }
}