(function () {
  "use strict";

  const STORAGE_KEY = "spring-tea-orders";
  const menuItems = window.TEA_MENU.flatMap((category) => category.items);
  const form = document.querySelector("#order-form");
  const drinkChoice = document.querySelector("#drink-choice");
  const toppingChoices = document.querySelector("#topping-choices");
  const quantityInput = document.querySelector("#quantity");
  const totalPrice = document.querySelector("#total-price");
  const priceBreakdown = document.querySelector("#price-breakdown");
  const message = document.querySelector("#form-message");
  const submitButton = form.querySelector('button[type="submit"]');
  const sugarChoice = document.querySelector("#sugar-choice");
  const noSugarOption = Array.from(sugarChoice.options).find((option) => option.value === "無糖");

  function formatPrice(amount) {
    return `NT$ ${amount.toLocaleString("zh-TW")}`;
  }

  function populateDrinkChoices() {
    window.TEA_MENU.forEach((category) => {
      const group = document.createElement("optgroup");
      group.label = category.category;
      category.items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.name}　M ${item.prices.M} / L ${item.prices.L}`;
        group.append(option);
      });
      drinkChoice.append(group);
    });
  }

  function populateToppings() {
    window.TEA_TOPPINGS.forEach((topping) => {
      const label = document.createElement("label");
      label.className = "topping-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "toppings";
      checkbox.value = topping.id;
      checkbox.addEventListener("change", updatePrice);
      const name = document.createElement("span");
      name.textContent = topping.name;
      const price = document.createElement("span");
      price.className = "topping-price";
      price.textContent = `+${topping.price}`;
      label.append(checkbox, name, price);
      toppingChoices.append(label);
    });
  }

  function getSelection() {
    const item = menuItems.find((entry) => entry.id === drinkChoice.value);
    const size = form.elements.size.value;
    const quantity = Number(quantityInput.value);
    const selectedToppings = Array.from(form.querySelectorAll('input[name="toppings"]:checked'))
      .map((input) => window.TEA_TOPPINGS.find((topping) => topping.id === input.value));

    if (!item) {
      throw new Error("請先選擇飲品。");
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error("杯數請填寫 1 到 20 杯的整數。");
    }

    const unitPrice = item.prices[size] + selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
    return { item, size, quantity, selectedToppings, unitPrice, total: unitPrice * quantity };
  }

  function updatePrice() {
    try {
      const selection = getSelection();
      const category = window.TEA_MENU.find((entry) => entry.items.some((item) => item.id === selection.item.id));
      const isFruitTea = category.category.startsWith("果茶");
      noSugarOption.disabled = isFruitTea;
      if (isFruitTea && sugarChoice.value === "無糖") {
        sugarChoice.value = "微糖";
      }
      totalPrice.textContent = formatPrice(selection.total);
      priceBreakdown.replaceChildren();

      const lines = [
        [`${selection.item.name} · ${selection.size} 杯`, formatPrice(selection.item.prices[selection.size])],
        ...selection.selectedToppings.map((topping) => [`加料：${topping.name}`, `+${formatPrice(topping.price)}`]),
        [`${selection.quantity} 杯小計`, formatPrice(selection.total)]
      ];

      lines.forEach(([label, amount]) => {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const value = document.createElement("dd");
        term.textContent = label;
        value.textContent = amount;
        row.append(term, value);
        priceBreakdown.append(row);
      });
      message.textContent = "";
      message.classList.remove("is-error");
    } catch (error) {
      message.textContent = error.message;
      message.classList.add("is-error");
    }
  }

  function readLocalOrders() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      throw new Error(`讀取本機訂單失敗：${error.message}`);
    }
  }

  function saveLocalOrder(order) {
    const existingOrders = readLocalOrders();
    existingOrders.unshift(order);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingOrders));
  }

  form.addEventListener("input", updatePrice);
  form.addEventListener("change", updatePrice);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.classList.remove("is-error");
    let savedLocally = false;

    try {
      const selection = getSelection();
      const name = form.elements.name.value.trim();
      if (!name) {
        throw new Error("請輸入姓名，方便辨認訂單。");
      }

      const order = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
        name,
        drinkId: selection.item.id,
        drinkName: selection.item.name,
        size: selection.size,
        quantity: selection.quantity,
        sugar: form.elements.sugar.value,
        ice: form.elements.ice.value,
        toppings: selection.selectedToppings.map((topping) => topping.id),
        toppingNames: selection.selectedToppings.map((topping) => topping.name),
        unitPrice: selection.unitPrice,
        totalPrice: selection.total,
        status: "已送出"
      };

      submitButton.disabled = true;
      message.textContent = "正在送出訂單…";
      saveLocalOrder(order);
      savedLocally = true;
      const endpoint = window.SHOP_CONFIG && window.SHOP_CONFIG.appsScriptUrl;
      if (endpoint) {
        await window.TeaApi.submitOrder(endpoint, order);
      }
      form.reset();
      updatePrice();
      message.textContent = endpoint
        ? "訂單已寫入 Google 試算表，請至「目前訂單」確認。"
        : "訂單已記錄在這台裝置。請完成 Apps Script 設定，才能同步到全班試算表。";
      window.setTimeout(() => {
        window.location.href = "orders.html";
      }, 1100);
    } catch (error) {
      message.textContent = savedLocally
        ? `訂單已保留在本機，但 Google 試算表尚未確認：${error.message}`
        : error.message;
      message.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
    }
  });

  populateDrinkChoices();
  populateToppings();
  updatePrice();
})();
