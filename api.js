(function () {
  "use strict";

  function listOrders(endpoint) {
    return new Promise((resolve, reject) => {
      const callbackName = `__teaOrders${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const script = document.createElement("script");
      const timeout = window.setTimeout(() => finish(new Error("讀取試算表逾時。")), 12000);

      function finish(error, orders) {
        window.clearTimeout(timeout);
        delete window[callbackName];
        script.remove();
        if (error) {
          reject(error);
        } else if (!Array.isArray(orders)) {
          reject(new Error("試算表回傳的訂單格式不正確。"));
        } else {
          resolve(orders);
        }
      }

      window[callbackName] = (orders) => finish(null, orders);
      script.onerror = () => finish(new Error("無法連線至 Google 試算表。"));
      script.src = `${endpoint}${endpoint.includes("?") ? "&" : "?"}callback=${encodeURIComponent(callbackName)}`;
      document.head.append(script);
    });
  }

  async function submitOrder(endpoint, order) {
    const body = new URLSearchParams({ order: JSON.stringify(order) });
    await fetch(endpoint, { method: "POST", mode: "no-cors", body });

    const orders = await listOrders(endpoint);
    if (!orders.some((savedOrder) => savedOrder.id === order.id)) {
      throw new Error("Google 試算表尚未確認這筆訂單，請稍後查看訂單清單再重試。");
    }
  }

  window.TeaApi = { listOrders, submitOrder };
})();
