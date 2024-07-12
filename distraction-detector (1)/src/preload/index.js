import { contextBridge, ipcRenderer, BrowserWindow } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      minimizeWindow: () => ipcRenderer.send("minimize-window", ""),
      closeWindow: () => ipcRenderer.send("close-window", "")
    });
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

ipcRenderer.on("q-pressed", (event, data) => window.postMessage("q-pressed"));