const port = whale.runtime.connect({name: 'dive_in'});

port.onMessage.addListener(message => {
  updateTabList();
})


updateTabList();

function updateTabList() {
  whale.tabs.query({currentWindow: true}, function(tabs){
    var elTabList = document.getElementById('tree');
    elTabList.innerHTML = "";

    for (var i = 0; i < tabs.length; ++i)
    {
      console.log(tabs[i]);
  
      if (tabs[i].hasOwnProperty('openerTabId') )
        {
          var treeChildNode = document.getElementById("t" + tabs[i].openerTabId).getElementsByTagName("ul");
          if (treeChildNode.length)
            {
              createTreeElement("li", tabs[i].id, tabs[i].title, treeChildNode[0], tabs[i].favIconUrl);
            }
          else
            {
              createTreeElement("ul", tabs[i].openerTabId, "", document.getElementById("t" + tabs[i].openerTabId), "");
              createTreeElement("li", tabs[i].id, tabs[i].title, document.getElementById("t" + tabs[i].openerTabId).getElementsByTagName("ul")[0], tabs[i].favIconUrl);
            }
        }
      else
        {
          createTreeElement("li", tabs[i].id, tabs[i].title, elTabList, tabs[i].favIconUrl);
        }
    }
  


  })
}

function createTreeElement(name, id, title, parent, favIconUrl) {
  var node = document.createElement(name);
  node.id = "t" + id;
  node.innerHTML = formatTabTitle(title);

  node.addEventListener('click', () => {
    activateTab(id);
  });
  
  var favIcon = document.createElement("img");
  // favIcon size
  // favIcon loading error?
  favIcon.src = favIconUrl;
  node.appendChild(favIcon);

  parent.appendChild(node);
}

function activateTab(id) {
  whale.tabs.update(id, {"active": true});
}

function formatTabTitle(title) {
  if(title.length > 50) {
    title = title.substring(0, 47) + "...";
  }
  return title;
}

    // 클릭했을 때 그 탭으로 focus 옮겨지도록 ✓
  // 탭마다 status(default, checked, pinned 부여)
  // 파비콘 삽입 ✓
  // sidebar 오른쪽에다 status 표시하는 아이콘 넣고
  // 이 아이콘 클릭했을 때 status 변하도록
  // status 별로 배경색깔 다르게
  

  //싱크
  document.addEventListener('DOMContentLoaded', function() {
    updateTabList();
  });
  whale.tabs.onCreated.addListener(updateTabList);
  whale.tabs.onUpdated.addListener(updateTabList);
  whale.tabs.onAttached.addListener(updateTabList);
  whale.tabs.onDetached.addListener(updateTabList);
  whale.tabs.onRemoved.addListener(updateTabList);
  // attached, detached 되었을 때 비활된 창의 sidebar에도 활성화된 창의 탭 트리가 떠버림
  // tab query currentWindow 손대야 할 듯