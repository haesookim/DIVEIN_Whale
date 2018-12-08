whale.runtime.onConnect.addListener(createPort => {
  if(createPort.name === 'create'){
    whale.tabs.onCreated.addListener((tab) => {
      console.log('created a new tab');

      createPort.postMessage(tab);
    })
  }
})

whale.runtime.onConnect.addListener(updatePort => {
  if(updatePort.name === 'update'){
    whale.tabs.onUpdated.addListener((tabId, changeInfo) => {
      console.log('updated a new tab');

      updatePort.postMessage(tabId, changeInfo);
    })
  }
})

whale.runtime.onConnected.addListener(removePort => {
  if(removePort.name === 'remove'){
    whale.tabs.onRemoved.addListener((tabId) => {
      console.log('removed a new tab');

      removePort.postMessage(tabId);
    })
  }
})






