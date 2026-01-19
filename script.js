// 页面加载时初始化下拉框
window.onload = function () {
  initTimeSelectors("current");
  initTimeSelectors("target");

  // 默认当前时间为现在
  const now = new Date();
  setDefaultTime("current", now);

  // 目标时间默认为当前时间 + 1小时
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  setDefaultTime("target", oneHourLater);
};

// 初始化年、月、日、时、分下拉框
function initTimeSelectors(prefix) {
  const yearSelect = document.getElementById(`${prefix}-year`);
  const monthSelect = document.getElementById(`${prefix}-month`);
  const daySelect = document.getElementById(`${prefix}-day`);
  const hourSelect = document.getElementById(`${prefix}-hour`);
  const minuteSelect = document.getElementById(`${prefix}-minute`);

  // 年：当前年 ± 2年
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  // 月：1-12
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m.toString().padStart(2, '0');
    monthSelect.appendChild(opt);
  }

  // 日：1-31
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d.toString().padStart(2, '0');
    daySelect.appendChild(opt);
  }

  // 时：0-23
  for (let h = 0; h <= 23; h++) {
    const opt = document.createElement("option");
    opt.value = h;
    opt.textContent = h.toString().padStart(2, '0');
    hourSelect.appendChild(opt);
  }

  // 分：0, 6, 12, 18, 24, 30, 36, 42, 48, 54（可选每6分钟，便于对齐恢复机制）
  for (let m = 0; m < 60; m += 6) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m.toString().padStart(2, '0');
    minuteSelect.appendChild(opt);
  }
}

// 设置默认时间（当前时间或目标时间）
function setDefaultTime(prefix, date) {
  document.getElementById(`${prefix}-year`).value = date.getFullYear();
  document.getElementById(`${prefix}-month`).value = date.getMonth() + 1;
  document.getElementById(`${prefix}-day`).value = date.getDate();
  document.getElementById(`${prefix}-hour`).value = date.getHours();
  document.getElementById(`${prefix}-minute`).value = Math.floor(date.getMinutes() / 6) * 6; // 对齐6分钟
}

// 获取时间从下拉框
function getTimeFromSelect(prefix) {
  const year = parseInt(document.getElementById(`${prefix}-year`).value);
  const month = parseInt(document.getElementById(`${prefix}-month`).value) - 1; // JS月份从0开始
  const day = parseInt(document.getElementById(`${prefix}-day`).value);
  const hour = parseInt(document.getElementById(`${prefix}-hour`).value);
  const minute = parseInt(document.getElementById(`${prefix}-minute`).value);

  return new Date(year, month, day, hour, minute);
}

// 计算体力
function calculate() {
  const currentStamina = parseInt(document.getElementById("stamina").value);
  if (isNaN(currentStamina) || currentStamina < 0) {
    alert("请输入有效的当前体力！");
    return;
  }

  const currentTime = getTimeFromSelect("current");
  const targetTime = getTimeFromSelect("target");

  if (isNaN(currentTime.getTime()) || isNaN(targetTime.getTime())) {
    alert("请选择完整的时间！");
    return;
  }

  if (targetTime < currentTime) {
    alert("目标时间不能早于当前时间！");
    return;
  }

  // 计算分钟差
  const diffMs = targetTime - currentTime;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // 每6分钟恢复1点
  const recovered = Math.floor(diffMinutes / 6);
  const finalStamina = currentStamina + recovered;

  // 显示结果
  const resultDiv = document.getElementById("result");
  const fmt = (dt) => dt.toLocaleString("zh-CN", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  resultDiv.innerHTML = `
    <p>从 <strong>${fmt(currentTime)}</strong></p>
    <p>到 <strong>${fmt(targetTime)}</strong></p>
    <p>经过 <strong>${diffMinutes}</strong> 分钟</p>
    <p>恢复 <strong>${recovered}</strong> 点体力</p>
    <p style="font-size:20px;">🎯 最终体力: <strong>${finalStamina}</strong></p>
  `;
}
