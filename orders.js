(function () {
  "use strict";

  const STORAGE_KEY = "spring-tea-orders";
  const list = document.querySelector("#orders-list");
  const syncStatus = document.querySelector("#sync-status");
  const endpoint = window.SHOP_CONFIG && window.SHOP_CONFIG.appsScriptUrl;

  function formatPrice(amount) {
    return `NT$ ${Number(amount).toLocaleString("zh-TW")}`;
  }

  function readLocalOrders() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) {
        throw new Error("訂單資料格式不正確。");
      }
      return saved;
    } catch (error) {
      throw new Error(`讀取本機訂單失敗：${error.message}`);
    }
  }

  function drawOrders(orders) {
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const cups = sortedOrders.reduce((sum, order) => sum + Number(order.quantity || 0), 0);
    const amount = sortedOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

    document.querySelector("#order-count").textContent = String(sortedOrders.length);
    document.querySelector("#cup-count").textContent = String(cups);
    document.querySelector("#order-total").textContent = formatPrice(amount);
    list.replaceChildren();

    if (sortedOrders.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      const mark = document.createElement("span");
      mark.className = "empty-state-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "茶";
      const title = document.createElement("strong");
      title.textContent = "還沒有訂單";
      const description = document.createElement("p");
      description.textContent = "第一杯飲料等你來點，點完就會出現在這裡。";
      empty.append(mark, title, description);
      list.append(empty);
      return;
    }

    sortedOrders.forEach((order) => {
      const row = document.createElement("article");
      row.className = "order-row";

      const person = document.createElement("div");
      person.className = "order-person";
      const avatar = document.createElement("span");
      avatar.className = "person-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = String(order.name || "?").trim().slice(0, 1);
      const name = document.createElement("span");
      name.className = "person-name";
      name.textContent = order.name || "匿名同學";
      person.append(avatar, name);

      const details = document.createElement("div");
      details.className = "order-drink";
      const drink = document.createElement("strong");
      drink.textContent = `${order.drinkName || "未命名飲品"} · ${order.size || ""}`;
      const options = document.createElement("span");
      const addOns = Array.isArray(order.toppingNames) ? order.toppingNames : [];
      const toppingText = addOns.length ? ` · 加料：${addOns.join("、")}` : "";
      options.textContent = `${order.sugar || "甜度未選"} · ${order.ice || "冰量未選"}${toppingText}`;
      details.append(drink, options);

      const quantity = document.createElement("span");
      quantity.className = "order-quantity";
      quantity.textContent = `${order.quantity || 1} 杯`;
      const price = document.createElement("strong");
      price.className = "order-price";
      price.textContent = formatPrice(order.totalPrice || 0);
      row.append(person, details, quantity, price);
      list.append(row);
    });
  }

  async function refreshOrders() {
    syncStatus.textContent = "正在載入訂單…";
    try {
      const localOrders = readLocalOrders();
      const remoteOrders = endpoint ? await window.TeaApi.listOrders(endpoint) : null;
      const allOrders = remoteOrders === null ? localOrders : [...remoteOrders, ...localOrders];
      const unique = new Map();
      allOrders.forEach((order) => unique.set(order.id, order));
      drawOrders(Array.from(unique.values()));
      syncStatus.textContent = remoteOrders === null
        ? "本機訂單 · 尚未連結共用試算表"
        : `已同步試算表 · ${new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
    } catch (error) {
      syncStatus.textContent = error.message;
      if (list.childElementCount === 0) {
        const localOrders = readLocalOrders();
        drawOrders(localOrders);
      }
    }
  }

  document.querySelector("#refresh-orders").addEventListener("click", refreshOrders);
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      refreshOrders();
    }
  });
  window.setInterval(refreshOrders, 30000);
  refreshOrders();
})();
