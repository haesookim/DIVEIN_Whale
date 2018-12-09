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
      console.log(details.transitionType);
      navigationPort.postMessage({tabId : details.tabId, transitionType: details.transitionType, transitionQualifiers: details.transitionQualifiers});
    })
  }
}

  /*whale.webNavigation.onCommitted.addListener(function(details) {
    var updatedNode = findNode(details.tabId);
    if (details.transitionQualifier == "forward_back"){
    }
    else (details.transitionQualifier == "from_address_bar"){
      //updatedNode.parent == null;
    }
  })*/
)
