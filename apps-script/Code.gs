const SPREADSHEET_NAME = "2026手搖飲點餐記錄";
const SHEET_NAME = "點餐記錄";
const HEADER_ROW = [
  "訂單編號",
  "送出時間",
  "姓名",
  "飲品",
  "尺寸",
  "杯數",
  "甜度",
  "冰量",
  "加料",
  "單杯金額",
  "訂單金額",
  "狀態"
];

const DRINKS = {
  "spring-green": { name: "春青", prices: { M: 30, L: 35 } },
  "summer-green": { name: "夏青", prices: { M: 30, L: 35 } },
  "autumn-green": { name: "秋青", prices: { M: 40, L: 45 } },
  "winter-green": { name: "冬露", prices: { M: 55, L: 60 } },
  "chrysanthemum-tea": { name: "東方菊花茶", prices: { M: 40, L: 50 } },
  "buckwheat-tea": { name: "西穀蕎麥茶", prices: { M: 45, L: 55 } },
  "rooibos-tea": { name: "南非國寶茶", prices: { M: 40, L: 50 } },
  "osmanthus-rice-tea": { name: "北風桂花玄米茶", prices: { M: 35, L: 45 } },
  "winter-melon": { name: "冬露（最低糖量為半糖）", prices: { M: 25, L: 30 } },
  "black-tea": { name: "天蟬紅茶", prices: { M: 35, L: 40 } },
  "green-tea": { name: "青山綠茶", prices: { M: 45, L: 55 } },
  "chrysanthemum-green": { name: "春青菊花", prices: { M: 50, L: 55 } },
  "yogurt-green": { name: "多多綠茶", prices: { M: 55, L: 65 } },
  "mountain-milk-tea": { name: "山峰奶茶", prices: { M: 45, L: 50 } },
  "agar-milk-tea": { name: "菜燕奶茶", prices: { M: 55, L: 60 } },
  "amber-pearl-milk-tea": { name: "琥珀珍珠奶茶", prices: { M: 55, L: 60 } },
  "buckwheat-pearl-milk-tea": { name: "蕎麥珍珠奶茶", prices: { M: 55, L: 65 } },
  "spring-green-winter-melon": { name: "春青冬露", prices: { M: 50, L: 60 } },
  "summer-green-latte": { name: "夏青那堤", prices: { M: 50, L: 60 } },
  "chrysanthemum-winter-melon": { name: "菊花冬露", prices: { M: 50, L: 65 } },
  "buckwheat-latte": { name: "蕎麥那堤", prices: { M: 50, L: 65 } },
  "cicada-latte": { name: "天蟬那堤", prices: { M: 55, L: 65 } },
  "oolong-fresh-milk-tea": { name: "青茶鮮奶奶茶", prices: { M: 55, L: 65 } },
  "oolong-jelly-latte": { name: "青茶凍天蟬那堤", prices: { M: 65, L: 75 } },
  "amber-pearl-latte": { name: "琥珀珍珠天蟬那堤", prices: { M: 65, L: 75 } },
  "buckwheat-pearl-latte": { name: "蕎麥珍珠夏青那堤", prices: { M: 65, L: 75 } },
  "buckwheat-cream-green": { name: "蕎麥奶蓋綠茶", prices: { M: 45, L: 50 } },
  "buckwheat-cream-rice": { name: "蕎麥奶蓋玄米茶", prices: { M: 50, L: 55 } },
  "sea-salt-cream-spring": { name: "海鹽奶蓋春青", prices: { M: 55, L: 60 } },
  "sea-salt-cream-black": { name: "海鹽奶蓋紅茶", prices: { M: 55, L: 60 } },
  "sea-salt-cream-apple": { name: "海鹽奶蓋輕蘋香茶", prices: { M: 65, L: 75 } },
  "sugarcane-spring": { name: "白甘蔗春青", prices: { M: 40, L: 45 } },
  "lemon-green": { name: "香檸綠茶", prices: { M: 55, L: 60 } },
  "almond-spring": { name: "杏仁凍春青", prices: { M: 40, L: 45 } },
  "orange-green": { name: "柳丁綠茶", prices: { M: 55, L: 60 } },
  "pomelo-green": { name: "紅柚綠茶", prices: { M: 55, L: 60 } },
  "tangerine-spring": { name: "橘子春青", prices: { M: 55, L: 60 } },
  "lychee-spring": { name: "荔枝春青（含青茶凍）", prices: { M: 60, L: 65 } },
  "pear-spring": { name: "水梨春青", prices: { M: 65, L: 75 } },
  "light-apple-tea": { name: "輕蘋香茶", prices: { M: 65, L: 75 } },
  "peach-summer": { name: "水蜜桃夏青", prices: { M: 65, L: 75 } },
  "agar-spring": { name: "菜燕春青", prices: { M: 40, L: 45 } }
};

const TOPPINGS = {
  "amber-pearl": { name: "琥珀珍珠", price: 10 },
  "buckwheat-pearl": { name: "蕎麥珍珠", price: 15 },
  "oolong-jelly": { name: "青茶凍", price: 10 },
  "almond-jelly": { name: "杏仁凍", price: 10 },
  "sea-salt-cream": { name: "海鹽奶蓋", price: 20 },
  "buckwheat-cream": { name: "蕎麥奶蓋", price: 20 }
};

const FRUIT_DRINK_IDS = new Set([
  "sugarcane-spring",
  "agar-spring",
  "lemon-green",
  "almond-spring",
  "orange-green",
  "pomelo-green",
  "tangerine-spring",
  "lychee-spring",
  "pear-spring",
  "light-apple-tea",
  "peach-summer"
]);

function doGet(event) {
  const orders = getSheet_().getDataRange().getValues().slice(1)
    .filter((row) => row[0])
    .map((row) => ({
      id: String(row[0]),
      createdAt: row[1] instanceof Date ? row[1].toISOString() : String(row[1]),
      name: String(row[2]),
      drinkName: String(row[3]),
      size: String(row[4]),
      quantity: Number(row[5]),
      sugar: String(row[6]),
      ice: String(row[7]),
      toppingNames: String(row[8]).split("、").filter(Boolean),
      unitPrice: Number(row[9]),
      totalPrice: Number(row[10]),
      status: String(row[11])
    }));

  const callback = event && event.parameter && event.parameter.callback;
  if (callback) {
    if (!/^[A-Za-z_$][\w$]*$/.test(callback)) {
      return jsonOutput_({ error: "無效的 callback 名稱。" });
    }
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(orders)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonOutput_(orders);
}

function doPost(event) {
  try {
    const rawOrder = event && event.parameter && event.parameter.order;
    if (!rawOrder) {
      throw new Error("缺少訂單資料。");
    }

    const order = JSON.parse(rawOrder);
    const validated = validateOrder_(order);
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const rowNumbers = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
      const existingIndex = rowNumbers.indexOf(validated.id);
      if (existingIndex !== -1) {
        const existing = sheet.getRange(existingIndex + 2, 1, 1, HEADER_ROW.length).getValues()[0];
        const sameOrder = existing[2] === validated.name
          && existing[3] === validated.drink.name
          && existing[4] === validated.size
          && Number(existing[5]) === validated.quantity
          && Number(existing[10]) === validated.totalPrice;
        if (!sameOrder) {
          throw new Error("這個訂單編號已用於其他訂單。");
        }
        return jsonOutput_({ ok: true, totalPrice: validated.totalPrice });
      }
    }
    const timestamp = new Date();
    sheet.appendRow([
      validated.id,
      timestamp,
      validated.name,
      validated.drink.name,
      validated.size,
      validated.quantity,
      validated.sugar,
      validated.ice,
      validated.toppings.map((item) => item.name).join("、"),
      validated.unitPrice,
      validated.totalPrice,
      "已送出"
    ]);

    return jsonOutput_({ ok: true, totalPrice: validated.totalPrice });
  } catch (error) {
    return jsonOutput_({ ok: false, error: error.message });
  }
}

function validateOrder_(order) {
  if (!order || typeof order !== "object") {
    throw new Error("訂單格式不正確。");
  }
  const name = String(order.name || "").trim();
  if (!name || name.length > 40) {
    throw new Error("姓名為必填，且不可超過 40 個字。");
  }

  const drink = DRINKS[order.drinkId];
  if (!drink) {
    throw new Error("找不到所選飲品。");
  }
  const id = String(order.id || "");
  if (!/^[\w-]{1,100}$/.test(id)) {
    throw new Error("訂單編號格式不正確。");
  }
  if (order.size !== "M" && order.size !== "L") {
    throw new Error("尺寸必須是 M 或 L。");
  }
  const quantity = Number(order.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    throw new Error("杯數必須是 1 到 20 的整數。");
  }

  const toppingIds = Array.isArray(order.toppings) ? order.toppings : [];
  const toppings = toppingIds.map((id) => {
    const topping = TOPPINGS[id];
    if (!topping) {
      throw new Error("訂單含有無效的加料選項。");
    }
    return topping;
  });
  if (new Set(toppingIds).size !== toppingIds.length) {
    throw new Error("同一種加料不可重複計價。");
  }
  const sugar = String(order.sugar || "");
  if (!["正常糖", "少糖", "半糖", "微糖", "一分糖", "無糖"].includes(sugar)) {
    throw new Error("甜度選項不正確。");
  }
  if (FRUIT_DRINK_IDS.has(order.drinkId) && sugar === "無糖") {
    throw new Error("果茶不提供無糖，請重新選擇甜度。");
  }

  const unitPrice = drink.prices[order.size] + toppings.reduce((sum, topping) => sum + topping.price, 0);
  const totalPrice = unitPrice * quantity;
  if (Number(order.totalPrice) !== totalPrice || Number(order.unitPrice) !== unitPrice) {
    throw new Error("送出的價格與菜單試算不符，請重新整理後再送出。");
  }

  return {
    id,
    name,
    drink,
    size: order.size,
    quantity,
    sugar,
    ice: String(order.ice || ""),
    toppings,
    unitPrice,
    totalPrice
  };
}

function getSheet_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  let spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
    properties.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADER_ROW.length)
      .setBackground("#e9f0e2")
      .setFontColor("#3e633f")
      .setFontWeight("bold");
  }
  return sheet;
}

function jsonOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
