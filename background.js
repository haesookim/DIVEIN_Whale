whale.runtime.onConnect.addListener(createPort => {
  if(createPort.name === 'create'){
    whale.tabs.onCreated.addListener((tab) => {
      createPort.postMessage(tab);
    })
  }
})

whale.runtime.onConnect.addListener(updatePort => {
  if(updatePort.name === 'update'){
    whale.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      updatePort.postMessage({tabId: tabId, changeInfo: changeInfo, tab: tab});
    })
  }
})

whale.runtime.onConnect.addListener(removePort => {
  if(removePort.name === 'remove'){
    whale.tabs.onRemoved.addListener((tabId) => {
      removePort.postMessage(tabId);
    })
  }
})


//testing
whale.runtime.onConnect.addListener(navigationPort => {
  if (navigationPort.name === 'navigate'){
    whale.webNavigation.onCommitted.addListener((details) =>{
      navigationPort.postMessage({tabId : details.tabId, transitionQualifiers: details.transitionQualifiers, transitionType: details.transitionType});
    })
  }
})

whale.runtime.onConnect.addListener(superDeletePort => {
  if (superDeletePort.name === 'superDelete'){
    superDeletePort.onMessage.addListener(message => {

      for(var i = 0; i<message.length; i++){
        whale.tabs.remove(message[i]);
      }
    })
  }
})
