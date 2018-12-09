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
    whale.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      console.log('updated a new tab');
      console.log(changeInfo);
      console.log(tab);
      updatePort.postMessage({tabId: tabId, changeInfo: changeInfo, tab: tab});
    })
  }
})

whale.runtime.onConnect.addListener(removePort => {
  if(removePort.name === 'remove'){
    whale.tabs.onRemoved.addListener((tabId) => {
      console.log('removed a new tab');
      console.log(tabId);
      removePort.postMessage(tabId);
    })
  }
})

//testing
whale.runtime.onConnect.addListener(navigationPort => {
  if (navigationPort.name === 'navigate'){
    whale.webNavigation.onCommitted.addListener((details) =>{
      console.log('navigation working');
      console.log(details.tabId);
      console.log(details.transitionQualifiers);
      navigationPort.postMessage({tabId : details.tabId, transitionQualifiers: details.transitionQualifiers});
    })
  }
})

whale.runtime.onConnect.addListener(superDeletePort => {
  if (superDeletePort.name === 'superDelete'){
    superDeletePort.onMessage.addListener(message => {
      console.log(message);
      var defaultNodesIds = message.map((Node)=>{
        return Node.id
      })
      console.log(defaultNodesIds);
      for(var i = 0; i<defaultNodesIds.length; i++){
        whale.tabs.remove(defaultNodesIds[i]);
      }
    })
  }
})