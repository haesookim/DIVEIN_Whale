
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
    var newNode = new Node(tab.id, tab.url, tab.title, tab.favIconUrl);
    this.treeArray.push(newNode);
    // console.log(tab.openerTabId);
    if(tab.url != 'chrome://newtab/'){
      if(tab.openerTabId != null){
        // console.log(this.findNode(tab.openerTabId));
        this.setParent(this.findNode(tab.openerTabId), newNode);
      }
    }
  }

  //set parent - child relationship
  // called by
  setParent(parentNode, childNode){
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
      closedNode.title = "............"; // 이름은 그대로 두고 색을 죽여야 하지 않을까요?
      closedNode.favicon = "../icons/iconGray_16.svg"; //if loaded favicon exists, load it in (should create defualts setting in css)

      // // title 색 죽이기 (error : the color is reset when reloaded)
      // var closedNodeHTML = document.getElementById("n" + closedNode.id);
      // closedNodeHTML.children[2].children[0].color = "#D3D3D3";
    }
    //if leaf, delete node
    else {
      if(closedNode.parent){
        console.log(closedNode)
        for (var i = 0; i < closedNode.parent.children.length; i++){
          if (closedNode.parent.children[i] == closedNode){
            closedNode.parent.children.splice(i, 1);
            closedNode.parent = null;
            const idx = this.treeArray.indexOf(closedNode);
            if (idx > -1) this.treeArray.splice(idx, 1);
            break;
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
        break;
      }
    }
  }

  removeNode(tabId){
    if(this.findNode(tabId)){
      whale.tabs.remove(tabId);
    }
  }

}

const createPort = whale.runtime.connect({name: 'create'});
const updatePort = whale.runtime.connect({name: 'update'});
const removePort = whale.runtime.connect({name: 'remove'});
const navigationPort = whale.runtime.connect({name: 'navigate'});


createPort.onMessage.addListener((tab) => {
  diveInTree.createNode(tab);
  drawHTML();
})

updatePort.onMessage.addListener((message) => {
  diveInTree.updateNode(message.tabId, message.changeInfo);
  drawHTML();
})

removePort.onMessage.addListener((tabId) => {
  diveInTree.deleteNode(diveInTree.findNode(tabId));
  drawHTML();
})

navigationPort.onMessage.addListener((message) =>{
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
  parentNodes.forEach(indent)
  diveInTree.treeArray.forEach(statusBackground)
}

//create tree class 'diveInTree'
var defNode = {};
var diveInTree = new tree(defNode);

document.addEventListener('DOMContentLoaded', function() {
  whale.tabs.query({currentWindow: true}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
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
  createTreeElement(Node.id, Node.title, Node.favicon, Node.parent, Node.children);
}


function createTreeElement(id, title, favicon, parent, children){
  var family = document.createElement("div");
  family.className = "family"

  var component = document.createElement("div");
  component.className = "node";
  component.id = "n" + id;
  if (children.length > 0) {component.className += " parent"}
  if (parent) {component.className += " child"}
  family.appendChild(component)

  // set favicon
  var favIconDiv = document.createElement("div");
  favIconDiv.className = "favicon";
  var favIconImage = document.createElement("img");
  favIconImage.src = favicon;
  if (favicon == undefined || favicon == "chrome://resources/whale/img/favicon.png") {
    favIconImage.src = "../icons/none.svg"
  }
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

  // set delete button
  var deleteButtonDiv = document.createElement("div");
  deleteButtonDiv.innerHTML = "delete";
  component.appendChild(deleteButtonDiv);

  deleteButtonDiv.addEventListener('click', () => {
    console.log(id);
    diveInTree.removeNode(id);
  })

  // set status icon
  var statusDiv = document.createElement("div");
  statusDiv.className = "status"
  var status = document.createElement("img");
  drawStatus(status, id);
  statusDiv.appendChild(status);
  component.appendChild(statusDiv);

  status.addEventListener('click', () => {
    changeStatus(status, id);
  });

  tabTree.appendChild(component);
}

function drawStatus(status, id){
  var Node = diveInTree.findNode(id);
  if (!Node.checked && !Node.pinned) {
    status.src = "../icons/default.svg"
    // nodeHTML.children[2].style.background = ""
  } else if (Node.checked) {
    status.src = "../icons/checked.svg"
    // nodeHTML.children[2].style.background = "#60B6FF28"
  } else if (Node.pinned) {
    status.src = "../icons/pin.svg"
    // nodeHTML.children[2].style.background = "#68E2BB46"
  }
}

function statusBackground(Node) {
  var nodeHTML = document.getElementById("n" + Node.id)
  if (!Node.checked && !Node.pinned) {
    nodeHTML.children[2].style.background = ""
  } else if (Node.checked) {
    nodeHTML.children[2].style.background = "#60B6FF28"
  } else if (Node.pinned) {
    nodeHTML.children[2].style.background = "#68E2BB46"
  }
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
function changeStatus(status, id) {
  var changedNode = diveInTree.findNode(id);
  var changeNodeHTML = document.getElementById("n" + id)
  if (!changedNode.checked && !changedNode.pinned) {
    changedNode.setChecked()
    changeNodeHTML.children[2].style.background = "#60B6FF28"
    status.src = "../icons/checked.svg"
  } else if (changedNode.checked) {
    changedNode.setPinned()
    changeNodeHTML.children[2].style.background = "#68E2BB46"
    status.src = "../icons/pin.svg"
    whale.tabs.get(id, function(tab){              /* If you want to synchronize pinned nodes with pinned Tabs, activate the codes */
      whale.tabs.update(id, {'pinned' : true})
    })
  } else if (changedNode.pinned) {
    changedNode.setDefault();
    changeNodeHTML.children[2].style.background = ""
    status.src = "../icons/default.svg"
    whale.tabs.get(id, function(tab){             /* If you want to synchronize pinned nodes with pinned Tabs, activate the codes */
      whale.tabs.update(id, {'pinned' : false})
    })
  }
}

// for super Delete
const superDeletePort = whale.runtime.connect({name: `superDelete`});

function superDelete(){
  var defaultNodes = diveInTree.treeArray.filter(node => {
    return (node.checked == false && node.pinned == false);
  })
  var defaultNodesId = defaultNodes.map(Node => {
    return Node.id;
  })

  defaultNodesId.sort(function(a, b){
    return b-a;
  })


  superDeletePort.postMessage(defaultNodesId);

  // for(var i = 0 ; i < defaultNodes.length ; i++){
  //   diveInTree.deleteNode(defaultNodes[i]);
  // }
}

document.getElementById('superDeleteButton').addEventListener('click', () => {
  superDelete();
});

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

function indent(Node) {
  if (Node.parent != null) {
    var parentHTML = document.getElementById("n" + Node.parent.id)
    var pml = window.getComputedStyle(parentHTML).marginLeft
    pml = parseInt(pml);
    var nodeHTML = document.getElementById("n" + Node.id)
    var ml = window.getComputedStyle(nodeHTML).marginLeft;
    ml = ml.replace("px", " ");
    ml = parseInt(ml) + pml;
    nodeHTML.style.marginLeft = ml + "px"
  }
  if (Node.children.length > 0) {
    for (var i = 0; i < Node.children.length; i++) {
      indent(Node.children[i])
    }
  }
}