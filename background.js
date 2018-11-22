// Tab is created
whale.tabs.onCreated.addListener(() => {
  // create tree node and add to tree
  // link might not be loaded at runtime - use onupdated api
});

whale.tabs.onUpdated.addListener(() => {
  // update every time link is changed)
  // might update with every reload - might not matter if tree hierarchy is maintained
});
