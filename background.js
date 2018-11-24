const list = document.querySelector(`#tablist`);

// get tabs of current window
whale.tabs.query({'currentWindow': true}, function (tabtree) {
  tabtree.forEach(function (tab) {
    listingTabs(tab);
  });
});

// Tab is created
whale.tabs.onCreated.addListener(() => {
  // create tree node and add to tree
  // link might not be loaded at runtime - use onupdated api
});

whale.tabs.onUpdated.addListener(() => {
  // update every time link is changed)
  // might update with every reload - might not matter if tree hierarchy is maintained
});

// list the titles of currently opened tabs in "sidebar.html"
function listingTabs(tab) {
  console.log(list); // null <- unsolved error!
  list.innerHTML += `<li>${tab.title}</li>`;
}