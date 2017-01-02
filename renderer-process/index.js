// Window
const BrowserWindow = require('electron').remote.BrowserWindow

// Library
const settings = require('electron-settings')
const path = require('path')
const EasyPieChart = require('easy-pie-chart')
const moment = require('moment')

// Elements
const startBtn = document.getElementById('start-btn')
const pauseBtn = document.getElementById('pause-btn')
const stopBtn = document.getElementById('stop-btn')
const settingBtn = document.getElementById('setting-btn')
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
const SETTING_MODAL_PATH = path.join('file://', __dirname, '../views/setting.html')

// variables
let settingWindow
let timerSettings

var status = STOPPED
var startTime
var endTime
var intervalId
var pausedRestTime
var current = 0

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
    current++
    status = FINISHED
    console.log(current)
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
      endTime = moment(startTime).add(timerSettings[current % timerSettings.length].value, 'minutes')
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

// 設定を開く
const openSetting = function() {
  if (settingWindow == null) {
    settingWindow = new BrowserWindow({
      width: 500,
      height: 600
    })
    settingWindow.on('close', function() { settingWindow = null })
    settingWindow.loadURL(SETTING_MODAL_PATH)
    settingWindow.show()
  }
}

const loadSettings = function() {
  // デフォルト値をセット
  settings.defaults({
    values: [
      {
        label: 'Task',
        value: 25
      },
      {
        label: 'Break',
        value: 5
      },
      {
        label: 'Task',
        value: 25
      },
      {
        label: 'Break',
        value: 5
      },
      {
        label: 'Task',
        value: 25
      },
      {
        label: 'Break',
        value: 5
      },
      {
        label: 'Task',
        value: 25
      },
      {
        label: 'Long Break',
        value: 20
      }
    ]
  })

  // 設定値をロード
  settings.get('values')
  .then(function(values) {
    timerSettings = values
  })
}

// 初期化処理
const init = function() {
  loadSettings()
  restTimeText.innerHTML = "00:00"
  startBtn.addEventListener('click', startTimer)
  pauseBtn.addEventListener('click', pauseTimer)
  stopBtn.addEventListener('click', stopTimer)
  settingBtn.addEventListener('click', openSetting)
}

init()
