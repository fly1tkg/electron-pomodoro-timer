// Window
const BrowserWindow = require('electron').remote.BrowserWindow

// Library
const path = require('path')
const settings = require('electron-settings')

// Elements
const saveBtn = document.getElementById('save-btn')

// variables

// functions

const setSetting = function() {
  settings.get('values')
  .then(values => {
    values.forEach(function(elem, i) {
      console.log(elem)
      document.getElementById('label' + i).value = elem.label
      document.getElementById('value' + i).value = elem.value
    })
  })
}

const save = function() {
  let values = []
  for(var i = 0; i < 8; i++) {
    values.push({
      label: document.getElementById('label' + i).value,
      value: Number(document.getElementById('value' + i).value)
    })
  }
  console.log(values)
  settings.set('values', values)
}

const init = function() {
  saveBtn.addEventListener('click', save)
  setSetting()
}

init()
