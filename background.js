whale.runtime.onConnect.addListener(port => {
  if(port.name === 'dive_in') {
    whale.tabs.onCreated.addListener(function(tab) {
      port.postMessage(tab);
    });
  }
})