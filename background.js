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
      navigationPort.postMessage({tabId : details.tabId, transitionQualifiers: details.transitionQualifiers});
    })
  }
})

whale.runtime.onConnect.addListener(superDeletePort => {
  if (superDeletePort.name === 'superDelete'){
    superDeletePort.onMessage.addListener(message => {
      var defaultNodesIds = message.map((Node)=>{
        return Node.id
      })
      for(var i = 0; i<defaultNodesIds.length; i++){
        whale.tabs.remove(defaultNodesIds[i]);
      }
    })
  }
})