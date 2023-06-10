const settings = require('electron-settings')

document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault()

  // Save settings here, for example:
  settings.set('startDirectory', document.getElementById('start-dir').value)
  settings.set('homeDirectory', document.getElementById('home-dir').value)
  settings.set('backgroundColor', document.getElementById('background-color').value)
  settings.set('textColor', document.getElementById('text-color').value)
  settings.set('font', document.getElementById('font').value)

  // Add logic to update the recent files list

  // Close the settings window when done
  window.close()
})

// Load settings when page loads
document.addEventListener('DOMContentLoaded', (event) => {
  // Load settings here, for example:
  document.getElementById('start-dir').value = settings.get('startDirectory')
  document.getElementById('home-dir').value = settings.get('homeDirectory')
  document.getElementById('background-color').value = settings.get('backgroundColor')
  document.getElementById('text-color').value = settings.get('textColor')
  document.getElementById('font').value = settings.get('font')

  // Add logic to display the recent files list
})
