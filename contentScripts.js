
// Node class
// all open tabs are defined as nodes
class Node {
  constructor(id, link, title, favicon) {
    this.id = id; // tab id of the node
    this.link = link;  // link information of the node
    this.title = title; // name of the tab/node
    this.favicon = favicon; //if loaded favicon exists, load it in (should create defualts setting in css)
    this.parent = null;
    this.children = [];
    this.active = false;
    this.checked = false;
    this.pinned = false;
  }

  setActive(){
    this.active = true;
  }

  setInactive(){
    this.active = false;
  }

  setChecked(){
    this.checked = true;
    this.pinned = false;
  }

  setPinned(){
    this.checked = false;
    this.pinned = true;
  }

  setDefault(){
    this.checked = false;
    this.pinned = false;
  }
}

// tree class
class tree{
  constructor(def){
    this.root = def;
    this.treeArray = [];
  }

  //add a new node to the tree
  createNode(tab){
    console.log("----creating Node----"); 
    var newNode = new Node(tab.id, tab.url, tab.title, tab.favIconUrl);
    this.treeArray.push(newNode);
    // console.log(tab.openerTabId);
    if(tab.openerTabId != null){
      console.log('not null');
      // console.log(this.findNode(tab.openerTabId));
      this.setParent(this.findNode(tab.openerTabId), newNode);
    }
  }

  //set parent - child relationship
  // called by
  setParent(parentNode, childNode){
    console.log("----set Parent----");
    parentNode.children.push(childNode);
    childNode.parent = parentNode;
  }

  // search for a specific node according to the tabid
  findNode(tabId){
    for(var i = 0; i<this.treeArray.length; ++i){
      if(this.treeArray[i].id == tabId){
        var find = this.treeArray[i];
        // break;
      }
    }
    return find;
  }

  updateNode(tabId, changeInfo){
    console.log("----updating Node----"); 
    var updatedNode = this.findNode(tabId);
    if (changeInfo.url) {
      updatedNode.link = changeInfo.url
    } else if (changeInfo.title) {
      updatedNode.title = changeInfo.title
    } else if (changeInfo.favIconUrl) {
      updatedNode.favicon = changeInfo.favIconUrl
    }
    console.log("-*-*-*-*-*-*-")
    console.log(diveInTree)
    console.log("-*-*-*-*-*-*-")
  }

  //insert node to the tree accordingly
  // insertNode(newNode){

  //   //setparent, setchild
  // }

  // run when tab(node) is closed
  // check if this is correct!!!
  deleteNode(closedNode){
    console.log("----deleting Node----"); 
    //if parent, only delete text data(link) of the node
    if (closedNode.children.length != 0){ /*is parent*/
      closedNode.link = null;
      closedNode.title = ""; // 이름은 그대로 두고 색을 죽여야 하지 않을까요?
      closedNode.favicon = null; //if loaded favicon exists, load it in (should create defualts setting in css)
    }
    //if leaf, delete node
    else {
      if(closedNode.parent){
        for (var i = 0; i < closedNode.parent.children.length; i++){
          if (closedNode.parent.children[i] == closedNode){
            closedNode.parent.children.splice(i, 1);
            closedNode.parent = null;
            console.log("turn " + i);
            const idx = this.treeArray.indexOf(closedNode);
            if (idx > -1) this.treeArray.splice(idx, 1);
          }
        }
      }else {
        const idx = this.treeArray.indexOf(closedNode);
        if (idx > -1) this.treeArray.splice(idx, 1);
      }
    }
  }
}

const createPort = whale.runtime.connect({name: 'create'});
const updatePort = whale.runtime.connect({name: 'update'});
const removePort = whale.runtime.connect({name: 'remove'});


createPort.onMessage.addListener((tab) => {
  console.log('created a new tab');
  diveInTree.createNode(tab);
  drawHTML();
})

updatePort.onMessage.addListener((message) => {
  console.log('updated a new tab');
  console.log(message.tabId);
  console.log(message.changeInfo);
  console.log(message.tab);
  diveInTree.updateNode(message.tabId, message.changeInfo);
  drawHTML();
})

removePort.onMessage.addListener((tabId) => {
  console.log('removed a new tab');
  console.log(tabId);
  diveInTree.deleteNode(diveInTree.findNode(tabId));
  drawHTML();
})


function drawHTML(){
  var parentNodes = diveInTree.treeArray.filter((Node) => {
    if(Node.parent == null){
      return Node;
    }
  })
  while(tabTree.hasChildNodes()){
    tabTree.removeChild(tabTree.firstChild);
  }
  parentNodes.forEach(confirm);
}

var defNode = {}
var diveInTree = new tree(defNode);

console.log(diveInTree)
document.addEventListener('DOMContentLoaded', function() {
    console.log("----START----")
    whale.tabs.query({currentWindow: true}, function(tabs){
      for (var i = 0; i < tabs.length; i++) {
        console.log(i)
        diveInTree.createNode(tabs[i]);
      }
    })
  })


// port.onMessage.addListener(message => {
//   console.log(message);
// })

//재귀

function confirm(Node) {
  if(Node.children.length){
    draw(Node);
    Node.children.forEach(confirm);
  } else{
    draw(Node);
  }
  // draw(Node);
}

var tabTree = document.getElementById('tree');
tabTree.innerHTML = "";


function draw(Node){
  createTreeElement(Node.id, Node.title, Node.favicon);
}

  // make pinned tabs' background color as green
// if (tabs[i].pinned) {
//   var pinnedNode = document.getElementById("t" + tabs[i].id);
//   pinnedNode.children[1].style.background = "#68E2BB46";
//   pinnedNode.children[2].src = getIconPath(tabs[i].pinned)
// }

//   // make the active tab's title bold 
// if (tabs[i].active) {
//   document.getElementById("t" + tabs[i].id).style.fontWeight = "bold";
// }

function createTreeElement(id, title, favicon){
  var component = document.createElement("div");

  // set fold button
  var foldDiv = document.createElement("div");
  component.appendChild(foldDiv);

  // set favicon
  var favIconDiv = document.createElement("div");
  var favIconImage = document.createElement("img");
  favIconImage.src = favicon;
  favIconDiv.appendChild(favIconImage);
  component.appendChild(favIconDiv);

  // set title in a tag;
  var titleDiv = document.createElement("div");
  var titleA = document.createElement("a");
  var titleAText = document.createTextNode(formatTabTitle(title));
  titleA.appendChild(titleAText);
  titleDiv.appendChild(titleA);
  component.appendChild(titleDiv);

  titleA.addEventListener('click', () => {
    activateTab(id);
  });

  // set status icon
  var statusDiv = document.createElement("div");
  var status = document.createElement("img");
  status.src = "../icons/default.svg";
  statusDiv.appendChild(status);
  component.appendChild(statusDiv);

  status.addEventListener('click', () => {
    changeStatus(id);
  });
    
  tabTree.appendChild(component);
}

function activateTab(id) {
  whale.tabs.update(id, {"active": true});
}

function formatTabTitle(title) {
  if(title.length > 35) {
    title = title.substring(0, 32) + "...";
  }
  return title;
}

// 나중엔 토글(on/off)가 아니라 세 가지 staus가 되어야겠지만..!
function changeStatus(id) {
  whale.tabs.get(id, function(tab){
    whale.tabs.update(id, {'pinned': !tab.pinned})
  });
}

function getIconPath(isPinned) {
  return "../icons/" + (isPinned ? "pin" : "default") + ".svg";
}

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