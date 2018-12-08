// port.onMessage.addListener(message => {
//   console.log(message);
// })

console.log('Dont die, do kill');
whale.tabs.query({'currentWindow': true}, (tabs) => {
  console.log(tabs);
});

whale.runtime.onMessage.addListener((message) => {
  console.log(message);
})

//재귀
function confirm(Node) {
  for(var i = 0 ; i < Node.children.length; i++){
    draw(Node.children[i]);
    if(Node.children[i].hasProperty(children)){
      confirm(children[i]);
    }
  }
}

function draw(Node){
  var space = document.createElement("div");
  var titleText = document.createTextNode(formatTabTitle(Node.title));
  space.appendChild(titleText);
}


// function updateTabList() {
//   whale.tabs.query({currentWindow: true}, function(tabs){
//     var tabTree = document.getElementById('tree');
//     tabTree.innerHTML = "";

//     for (var i = 0; i < tabs.length; ++i)
//     {
//       console.log(tabs[i]);
  
//       if (tabs[i].hasOwnProperty('openerTabId') )
//         {
//           var treeChildNode = document.getElementById("t" + tabs[i].openerTabId).getElementsByTagName("ul");
//           if (treeChildNode.length)
//             {
//               createTreeElement("li", tabs[i].id, tabs[i].title, treeChildNode[0], tabs[i].favIconUrl);
//             }
//           else
//             {
//               createTreeElement("ul", tabs[i].openerTabId, "", document.getElementById("t" + tabs[i].openerTabId), "");
//               createTreeElement("li", tabs[i].id, tabs[i].title, document.getElementById("t" + tabs[i].openerTabId).getElementsByTagName("ul")[0], tabs[i].favIconUrl);
//             }
//         }
//       else
//         {
//           createTreeElement("li", tabs[i].id, tabs[i].title, tabTree, tabs[i].favIconUrl);
//         }

//         // make pinned tabs' background color as green
//         if (tabs[i].pinned) {
//           var pinnedNode = document.getElementById("t" + tabs[i].id);
//           pinnedNode.children[1].style.background = "#68E2BB46";
//           pinnedNode.children[2].src = getIconPath(tabs[i].pinned)
//         }

//         // make the active tab's title bold 
//         if (tabs[i].active) {
//           document.getElementById("t" + tabs[i].id).style.fontWeight = "bold";
//         }
//     }
//   })
// }

// function createTreeElement(name, id, title, parent, favIconUrl) {
//   var node = document.createElement(name);
//   node.id = "t" + id;
//   node.innerHTML = "";

//   // set favicon
//   var favIcon = document.createElement("img");
//   favIcon.src = favIconUrl;

//   // set title in a tag
//   var titleA = document.createElement("a");
//   var titleAText = document.createTextNode(formatTabTitle(title));
//   titleA.appendChild(titleAText);
//   // make title clickable to move focus
//   titleA.addEventListener('click', () => {
//     activateTab(id);
//   });
  
//   // set status icon
//   var status = document.createElement("img");
//   status.src = "../icons/default.svg";
//   status.addEventListener('click', () => {
//     changeStatus(id);
//   });

//   node.appendChild(favIcon);
//   node.appendChild(titleA);
//   node.appendChild(status);
//   parent.appendChild(node);
// }

// function activateTab(id) {
//   whale.tabs.update(id, {"active": true});
// }

function formatTabTitle(title) {
  if(title.length > 35) {
    title = title.substring(0, 32) + "...";
  }
  return title;
}

// // 나중엔 토글(on/off)가 아니라 세 가지 staus가 되어야겠지만..!
// function changeStatus(id) {
//   whale.tabs.get(id, function(tab){
//     whale.tabs.update(id, {'pinned': !tab.pinned})
//   });
// }

// function getIconPath(isPinned) {
//   return "../icons/" + (isPinned ? "pin" : "default") + ".svg";
// }

//   // 클릭했을 때 그 탭으로 focus 옮겨지도록 ✓
//   // 탭마다 status(default, checked, pinned 부여)
//   // 파비콘 삽입 ✓
//   // sidebar 오른쪽에다 status 표시하는 아이콘 넣고
//   // 이 아이콘 클릭했을 때 status 변하도록
//   // status 별로 배경색깔 다르게
  

//   //싱크
// document.addEventListener('DOMContentLoaded', function() {
//   updateTabList();
// });
// whale.tabs.onCreated.addListener(updateTabList);
// whale.tabs.onUpdated.addListener(updateTabList);
// whale.tabs.onAttached.addListener(updateTabList);
// whale.tabs.onDetached.addListener(updateTabList);
// whale.tabs.onRemoved.addListener(updateTabList);
// whale.tabs.onActivated.addListener(updateTabList); // to make the title bold
//   // attached, detached 되었을 때 비활된 창의 sidebar에도 활성화된 창의 탭 트리가 떠버림
//   // tab query currentWindow 손대야 할 듯