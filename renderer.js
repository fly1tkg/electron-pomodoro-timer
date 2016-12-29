// Window
const BrowserWindow = require('electron').remote.BrowserWindow

// Library
const EasyPieChart = require('easy-pie-chart')
const moment = require('moment')

// Elements
const startBtn = document.getElementById('start-btn')
const pauseBtn = document.getElementById('pause-btn')
const stopBtn = document.getElementById('stop-btn')
const restTimeText = document.getElementById('rest-time-text')
const pie = document.getElementById('pie')
const chart = new EasyPieChart(pie, {
  size: 400
})

// Constants
const UPDATE_INTERVAL = 250
const STARTED = 0
const PAUSED = 1
const STOPPED = 2
const FINISHED = 3

// variables
var status = STOPPED
var startTime
var endTime
var intervalId
var pausedRestTime

// functions

// スタートしてからの時間(ms)を返す
const spentTime = function() {
  return moment().diff(moment(startTime))
}

// 残り時間(ms)を返す
const restTime = function() {
  return moment(moment(endTime)).diff()
}

// 残り時間のフォーマット文字列を返す
const formattedResTime = function() {
  return moment(restTime()).format('mm:ss')
}

// スタートしてからの進捗(%)を返す
const calcPercecnt = function() {
  return spentTime() / endTime.diff(startTime) * 100
}

// チャートと残り時間を更新する
const updateTimer = function() {
  var percent = calcPercecnt()
  chart.update(calcPercecnt())

  if (percent > 100) {
    restTimeText.innerHTML = "00:00"
    clearInterval(intervalId)
    new Notification('Pomodoro Timer', {body: 'Finished'});
    status = FINISHED
  } else {
    restTimeText.innerHTML = formattedResTime()
  }
}

// タイマーをスタートする
const startTimer = function() {
  startTime = moment()
  switch (status) {
    case STOPPED:
    case FINISHED:
      endTime = moment(startTime).add(25, 'minutes')
      // デバッグ用
      // endTime = moment(startTime).add(5, 'seconds')
      break;
    case PAUSED:
      endTime = moment(startTime).add(pausedRestTime)
      break;
    default:
      return;
  }

  updateTimer()
  intervalId = setInterval(updateTimer, UPDATE_INTERVAL)
  status = STARTED
}

// タイマーをポーズする
const pauseTimer = function() {
  if (status === STARTED) {
    clearInterval(intervalId)
    pausedRestTime = restTime()
    status = PAUSED
  }
}

// タイマーをストップする
const stopTimer = function() {
  pauseTimer()
  restTimeText.innerHTML = "25:00"
  status = STOPPED
}

// 初期化処理
const init = function() {
  startBtn.addEventListener('click', startTimer)
  pauseBtn.addEventListener('click', pauseTimer)
  stopBtn.addEventListener('click', stopTimer)
}

init()
