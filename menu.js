(function () {
  "use strict";

  const menu = [
    {
      category: "四季青茶",
      items: [
        { id: "spring-green", name: "春青", prices: { M: 30, L: 35 } },
        { id: "summer-green", name: "夏青", prices: { M: 30, L: 35 } },
        { id: "autumn-green", name: "秋青", prices: { M: 40, L: 45 } },
        { id: "winter-green", name: "冬露", prices: { M: 55, L: 60 } }
      ]
    },
    {
      category: "無咖啡因",
      items: [
        { id: "chrysanthemum-tea", name: "東方菊花茶", prices: { M: 40, L: 50 } },
        { id: "buckwheat-tea", name: "西穀蕎麥茶", prices: { M: 45, L: 55 } },
        { id: "rooibos-tea", name: "南非國寶茶", prices: { M: 40, L: 50 } },
        { id: "osmanthus-rice-tea", name: "北風桂花玄米茶", prices: { M: 35, L: 45 } }
      ]
    },
    {
      category: "純茶",
      items: [
        { id: "winter-melon", name: "冬露（最低糖量為半糖）", prices: { M: 25, L: 30 } },
        { id: "black-tea", name: "天蟬紅茶", prices: { M: 35, L: 40 } },
        { id: "green-tea", name: "青山綠茶", prices: { M: 45, L: 55 } },
        { id: "chrysanthemum-green", name: "春青菊花", prices: { M: 50, L: 55 } },
        { id: "yogurt-green", name: "多多綠茶", prices: { M: 55, L: 65 } }
      ]
    },
    {
      category: "奶茶與那堤",
      items: [
        { id: "mountain-milk-tea", name: "山峰奶茶", prices: { M: 45, L: 50 } },
        { id: "agar-milk-tea", name: "菜燕奶茶", prices: { M: 55, L: 60 } },
        { id: "amber-pearl-milk-tea", name: "琥珀珍珠奶茶", prices: { M: 55, L: 60 } },
        { id: "buckwheat-pearl-milk-tea", name: "蕎麥珍珠奶茶", prices: { M: 55, L: 65 } },
        { id: "spring-green-winter-melon", name: "春青冬露", prices: { M: 50, L: 60 } },
        { id: "summer-green-latte", name: "夏青那堤", prices: { M: 50, L: 60 } },
        { id: "chrysanthemum-winter-melon", name: "菊花冬露", prices: { M: 50, L: 65 } },
        { id: "buckwheat-latte", name: "蕎麥那堤", prices: { M: 50, L: 65 } },
        { id: "cicada-latte", name: "天蟬那堤", prices: { M: 55, L: 65 } },
        { id: "oolong-fresh-milk-tea", name: "青茶鮮奶奶茶", prices: { M: 55, L: 65 } },
        { id: "oolong-jelly-latte", name: "青茶凍天蟬那堤", prices: { M: 65, L: 75 } },
        { id: "amber-pearl-latte", name: "琥珀珍珠天蟬那堤", prices: { M: 65, L: 75 } },
        { id: "buckwheat-pearl-latte", name: "蕎麥珍珠夏青那堤", prices: { M: 65, L: 75 } }
      ]
    },
    {
      category: "奶蓋",
      items: [
        { id: "buckwheat-cream-green", name: "蕎麥奶蓋綠茶", prices: { M: 45, L: 50 } },
        { id: "buckwheat-cream-rice", name: "蕎麥奶蓋玄米茶", prices: { M: 50, L: 55 } },
        { id: "sea-salt-cream-spring", name: "海鹽奶蓋春青", prices: { M: 55, L: 60 } },
        { id: "sea-salt-cream-black", name: "海鹽奶蓋紅茶", prices: { M: 55, L: 60 } },
        { id: "sea-salt-cream-apple", name: "海鹽奶蓋輕蘋香茶", prices: { M: 65, L: 75 } }
      ]
    },
    {
      category: "果茶（不提供無糖）",
      items: [
        { id: "sugarcane-spring", name: "白甘蔗春青", prices: { M: 40, L: 45 } },
        { id: "agar-spring", name: "菜燕春青", prices: { M: 40, L: 45 } },
        { id: "lemon-green", name: "香檸綠茶", prices: { M: 55, L: 60 } },
        { id: "almond-spring", name: "杏仁凍春青", prices: { M: 40, L: 45 } },
        { id: "orange-green", name: "柳丁綠茶", prices: { M: 55, L: 60 } },
        { id: "pomelo-green", name: "紅柚綠茶", prices: { M: 55, L: 60 } },
        { id: "tangerine-spring", name: "橘子春青", prices: { M: 55, L: 60 } },
        { id: "lychee-spring", name: "荔枝春青（含青茶凍）", prices: { M: 60, L: 65 } },
        { id: "pear-spring", name: "水梨春青", prices: { M: 65, L: 75 } },
        { id: "light-apple-tea", name: "輕蘋香茶", prices: { M: 65, L: 75 } },
        { id: "peach-summer", name: "水蜜桃夏青", prices: { M: 65, L: 75 } }
      ]
    }
  ];

  const toppings = [
    { id: "amber-pearl", name: "琥珀珍珠", price: 10 },
    { id: "buckwheat-pearl", name: "蕎麥珍珠", price: 15 },
    { id: "oolong-jelly", name: "青茶凍", price: 10 },
    { id: "almond-jelly", name: "杏仁凍", price: 10 },
    { id: "sea-salt-cream", name: "海鹽奶蓋", price: 20 },
    { id: "buckwheat-cream", name: "蕎麥奶蓋", price: 20 }
  ];

  window.TEA_MENU = menu;
  window.TEA_TOPPINGS = toppings;
})();
