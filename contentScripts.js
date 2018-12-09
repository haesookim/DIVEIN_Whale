
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
    if(tab.url != 'chrome://newtab/'){
      if(tab.openerTabId != null){
        console.log('not null');
        // console.log(this.findNode(tab.openerTabId));
        this.setParent(this.findNode(tab.openerTabId), newNode);
      }
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

      // // title 색 죽이기 (error : the color is reset when reloaded)
      // var closedNodeHTML = document.getElementById("n" + closedNode.id);
      // closedNodeHTML.children[2].children[0].style.color = "#D3D3D3";
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

  navUpdateNode(tabId, transitionQualifiers){
    var updatedNode = this.findNode(tabId);
    for (var i = 0; i < transitionQualifiers.length; i++){
      if (transitionQualifiers[i] == "from_address_bar"){
        console.log("----detatch the node----");
        if (updatedNode.parent){
          for (var i = 0; i < updatedNode.parent.children.length; i++){
            if (updatedNode.parent.children[i] == updatedNode){
              updatedNode.parent.children.splice(i, 1);
              updatedNode.parent = null;
            }
          }
        }
        break;
      }
      else if (transitionQualifiers[i] == "forward_back"){
        console.log("-----update tab title----");
        break;
      }
    }
  }

}

const createPort = whale.runtime.connect({name: 'create'});
const updatePort = whale.runtime.connect({name: 'update'});
const removePort = whale.runtime.connect({name: 'remove'});
const navigationPort = whale.runtime.connect({name: 'navigate'});


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

navigationPort.onMessage.addListener((message) =>{
  console.log('navigate');
  console.log(message.tabId);
  console.log(message.transitionQualifiers);
  diveInTree.navUpdateNode(message.tabId, message.transitionQualifiers);
  drawHTML();
})




function drawHTML(){
  var parentNodes = diveInTree.treeArray.filter((Node) => {
    return Node.parent == null;
  })
  while(tabTree.hasChildNodes()){
    tabTree.removeChild(tabTree.firstChild);
  }
  parentNodes.forEach(confirm);
}

//create tree class 'diveInTree'
var defNode = {};
var diveInTree = new tree(defNode);

console.log(diveInTree);

document.addEventListener('DOMContentLoaded', function() {
  console.log("----START----")
  whale.tabs.query({currentWindow: true}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
      console.log(i)
      diveInTree.createNode(tabs[i]);
    }
    drawHTML();
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
  createTreeElement(Node.id, Node.title, Node.favicon, Node.parent);
}



function createTreeElement(id, title, favicon, parent){
  var component = document.createElement("div");
  component.className = "node";
  component.id = "n" + id;
  if (parent) {component.className += " child"}

  // set fold button
  var foldDiv = document.createElement("div");
  foldDiv.className = "folder";
  component.appendChild(foldDiv);

  // set favicon
  var favIconDiv = document.createElement("div");
  favIconDiv.className = "favicon";
  var favIconImage = document.createElement("img");
  favIconImage.src = favicon;
  favIconDiv.appendChild(favIconImage);
  component.appendChild(favIconDiv);

  // set title in a tag;
  var titleDiv = document.createElement("div");
  titleDiv.className = "title";
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
  statusDiv.className = "status"
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

function inactivateNode(activeTabId) {
  for (var i = 0; i < diveInTree.treeArray.length; i++) {
    if (diveInTree.treeArray[i].id != activeTabId) {
      diveInTree.treeArray[i].setInactive();
    }
  }
}

whale.tabs.onActivated.addListener(function(activeInfo) {
  var id = activeInfo.tabId
  var activeNode = diveInTree.findNode(id);
  if (!activeNode.active) activeNode.setActive();
  inactivateNode(id);

  var rest = document.getElementsByTagName("a");
  for (var i = 0; i < rest.length; i++) {
    rest[i].style.fontWeight = "300"
  }
  var activeNodeHTML = document.getElementById("n" + id);
  activeNodeHTML.children[2].children[0].style.fontWeight = "700";
})

function formatTabTitle(title) {
  if(title.length > 35) {
    title = title.substring(0, 32) + "...";
  }
  return title;
}

// 나중엔 토글(on/off)가 아니라 세 가지 staus가 되어야겠지만..!
function changeStatus(id) {
  var changedNode = diveInTree.findNode(id);
  var changedNodeHTML = document.getElementById("n" + id)
  var statusIconPath = changedNodeHTML.children[3].children[0]
  if (!changedNode.checked && !changedNode.pinned) {
    changedNode.setChecked()
    statusIconPath.src = "../icons/checked.svg"
  } else if (changedNode.checked) {
    changedNode.setPinned()
    statusIconPath.src = "../icons/pin.svg"
    // whale.tabs.get(id, function(tab){              /* If you want to synchronize pinned nodes with pinned Tabs, activate the codes */
    //   whale.tabs.update(id, {'pinned' : true})
    // })
  } else if (changedNode.pinned) {
    changedNode.setDefault();
    statusIconPath.src = "../icons/default.svg"
    // whale.tabs.get(id, function(tab){             /* If you want to synchronize pinned nodes with pinned Tabs, activate the codes */
    //   whale.tabs.update(id, {'pinned' : false})
    // })
  }
}

// for super Delete
function superDelete(){
  var defaultNodes = diveInTree.treeArray.filter(node => {
    return (node.checked == false && node.pinned == false);
  })
  console.log(defaultNodes);
  for(var i = 0 ; i < defaultNodes.length ; i++){
    diveInTree.deleteNode(defaultNodes[i]);
  }
  console.log(diveInTree);
  drawHTML();
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
