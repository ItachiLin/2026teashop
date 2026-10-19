# 春青手搖飲｜班級點餐網站

班級飲料點餐網站，包含點餐頁、即時價格試算、全班訂單清單，以及可部署到 Google Apps Script 的試算表 API。

## 網頁

- 點餐：[index.html](./index.html)
- 訂單狀況：[orders.html](./orders.html)
- 菜單圖片：[menu.jpg](./menu.jpg)

點餐頁分成兩列：第一列等比例完整顯示菜單；第二列並排顯示點餐表單與即時計價。手機版會改成直向排列。

## 連接 Google 試算表

Apps Script 第一次收到訂單查詢或有效訂單時，會建立名為 `2026手搖飲點餐記錄` 的試算表，並建立含標題列的 `點餐記錄` 工作表。

1. 登入 [Google Apps Script](https://script.google.com/) 並建立新專案。
2. 將 `apps-script/Code.gs` 貼到 `Code.gs`，並依照 `apps-script/appsscript.json` 設定專案時區與 V8 執行環境。
3. 選擇「部署」→「新增部署作業」→「網頁應用程式」；執行身分選「我」，存取權選「所有人」，再完成 Google 授權。
4. 複製部署後的 `/exec` 網址，填入 [config.js](./config.js) 的 `appsScriptUrl`。
5. 將已設定 `config.js` 的網站檔案推送到 GitHub Pages。第一次開啟訂單頁或送出有效訂單後，Apps Script 會建立試算表及標題列。

若 `appsScriptUrl` 尚未設定，網站會把訂單保存在目前瀏覽器的本機儲存空間；這只適合本機測試，其他同學不會看到該筆訂單。連上 Apps Script 後，訂單才會共用並寫入 Google 試算表。

## GitHub Pages 部署

在 GitHub 建立名稱為 `2026teashop` 的公開 repository，將本專案根目錄的網站檔案推送到 `main` 分支。**不要推送 `spec/` 資料夾**。接著到 repository 的「Settings」→「Pages」，將來源設為 `Deploy from a branch`、分支設為 `main`、資料夾設為 `/(root)`。

啟用後的網址會是：

`https://<你的 GitHub 使用者名稱>.github.io/2026teashop/`

GitHub Pages 尚未由本機帳號建立或啟用時，這個網址無法預先確認；請在 repository 的 Pages 設定顯示成功後，將實際網址補到本節。

## 本機測試

使用任一靜態網站伺服器開啟專案根目錄，分別測試點餐頁與訂單頁。以 `file://` 直接開啟時，瀏覽器可能限制跨頁本機儲存；Google 試算表測試則需先部署 Apps Script 並設定 `config.js`。
