
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
    //if parent, only delete text data(link) of the node
    if (closedNode.children.length != 0){ /*is parent*/
      closedNode.link = null;
      // closedNode.title = "............";
      // closedNode.favicon = "../icons/iconGray_16.svg";
    }
    //if leaf, delete node
    else {
      if(closedNode.parent){
        for (var i = 0; i < closedNode.parent.children.length; i++){
          if (closedNode.parent.children[i] == closedNode){
            closedNode.parent.children.splice(i, 1);
            closedNode.parent = null;
            break;
          }
        }
        var idx = this.treeArray.indexOf(closedNode);
        if (idx > -1) this.treeArray.splice(idx, 1);
      }else {
        var idx = this.treeArray.indexOf(closedNode);
        if (idx > -1) this.treeArray.splice(idx, 1);
      }
    }
  }

  navUpdateNode(tabId, transitionQualifiers, transitionType){
    var updatedNode = this.findNode(tabId);
    console.log(transitionType);
    if (transitionType == "auto_bookmark"){
      console.log("whyyyy");
      if (updatedNode.parent != null){
        for (var i = 0; i < updatedNode.parent.children.length; i++){
          if (updatedNode.parent.children[i] == updatedNode){
            updatedNode.parent.children.splice(i, 1);
            updatedNode.parent = null;
          }
        }
      }
    }
    for (var i = 0; i < transitionQualifiers.length; i++){
      if (transitionQualifiers[i] == "from_address_bar"){
        if (updatedNode.parent != null){
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
    if(this.findNode(tabId).link == null){
      if(this.findNode(tabId).children.length == 0){
        console.log('debuggggggggggggggggggggggggggggggging');
        console.log(this.findNode(tabId));
        var idxx = this.treeArray.indexOf(this.findNode(tabId));
        if (idxx > -1) this.treeArray.splice(idxx, 1);
        drawHTML();
      }
    }else{
      whale.tabs.remove(tabId);
    }
    // console.log('this is treeArray***************************');
    // console.log(diveInTree.treeArray);
  }

}

const createPort = whale.runtime.connect({name: 'create'});
const updatePort = whale.runtime.connect({name: 'update'});
const removePort = whale.runtime.connect({name: 'remove'});
const navigationPort = whale.runtime.connect({name: 'navigate'});


createPort.onMessage.addListener((tab) => {
  diveInTree.createNode(tab);
  if (tab.active){
    console.log("hmm");
    var toDeactivate = diveInTree.treeArray.filter((Node) => {
      return Node.active == true;
    })
    for (var i = 0; i < toDeactivate.length; i++){
      toDeactivate[i].active = false;
    }
    var openedActive = diveInTree.findNode(tab.id);
    openedActive.active = true;

  }
  drawHTML();
})

updatePort.onMessage.addListener((message) => {
  diveInTree.updateNode(message.tabId, message.changeInfo);
  drawHTML();
})

removePort.onMessage.addListener((tabId) => {
  diveInTree.deleteNode(diveInTree.findNode(tabId));
  drawHTML();
  grayColor(tabId);
})

navigationPort.onMessage.addListener((message) =>{
  diveInTree.navUpdateNode(message.tabId, message.transitionQualifiers, message.transitionType);
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

  //testing active draw
  diveInTree.treeArray.forEach(activeStatus);
}

function activeStatus(Node) {
  // var rest = document.getElementsByTagName("a");
  // for (var i = 0; i < rest.length; i++) {
  //   rest[i].style.fontWeight = "400";
  // }
  if (Node.active) {
    console.log(Node.title);
    var activeNodeHTML = document.getElementById("n" + Node.id);
    console.log(activeNodeHTML);
    activeNodeHTML.children[1].children[0].style.fontWeight = "700";
    console.log(activeNodeHTML.children[1].children[0]);
  }
}

//create tree class 'diveInTree'
var defNode = {};
var diveInTree = new tree(defNode);

document.addEventListener('DOMContentLoaded', function() {
  whale.tabs.query({currentWindow: true}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
      diveInTree.createNode(tabs[i]);
      if (tabs[i].active){
        var toActivate = diveInTree.findNode(tabs[i].id);
        toActivate.active = true;
      }
      if (tabs[i].pinned){
        var toPin = diveInTree.findNode(tabs[i].id);
        toPin.setPinned();
      }
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
  createTreeElement(Node.id, Node.title, Node.favicon, Node.parent, Node.children, Node.link, Node.active);
}


function createTreeElement(id, title, favicon, parent, children, link, active){
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
  if (link == null) favIconImage.style.filter = "grayscale(100%)";
  else if (favicon == undefined || favicon == "chrome://resources/whale/img/favicon.png") {
    favIconImage.src = "../icons/none.svg"
  }
  favIconDiv.appendChild(favIconImage);
  component.appendChild(favIconDiv);

  // set title in a tag;
  var titleDiv = document.createElement("div");
  titleDiv.className = "title";
  var titleA = document.createElement("a");
  if (link == null) titleA.style.color = "A3A3A3";
  var titleAText = document.createTextNode(formatTabTitle(title));
  titleA.appendChild(titleAText);
  titleDiv.appendChild(titleA);
  component.appendChild(titleDiv);

  titleA.addEventListener('click', () => {
    activateTab(id);
  });

  // set delete button
  var deleteButtonDiv = document.createElement("div");
  deleteButtonDiv.className = "deleteBtn"
  deleteButtonDiv.innerHTML = "✕";
  component.appendChild(deleteButtonDiv);

  deleteButtonDiv.addEventListener('click', () => {
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
    nodeHTML.children[1].style.background = ""
  } else if (Node.checked) {
    nodeHTML.children[1].style.background = "#60B6FF28"
  } else if (Node.pinned) {
    nodeHTML.children[1].style.background = "#68E2BB46"
  }
}

function activateTab(id) {
  whale.tabs.update(id, {"active": true});
  console.log('activated this tab');
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
  console.log(diveInTree.findNode(id));

  drawHTML();
})

function formatTabTitle(title) {
  if(title.length > 47) {
    title = title.substring(0, 44) + "...";
  }
  return title;
}

function changeStatus(status, id) {
  var changedNode = diveInTree.findNode(id);
  var changeNodeHTML = document.getElementById("n" + id)
  if (!changedNode.checked && !changedNode.pinned) {
    changedNode.setChecked()
    changeNodeHTML.children[1].style.background = "#60B6FF28"
    status.src = "../icons/checked.svg"
  } else if (changedNode.checked) {
    changedNode.setPinned()
    changeNodeHTML.children[1].style.background = "#68E2BB46"
    status.src = "../icons/pin.svg"
    whale.tabs.get(id, function(tab){              /* If you want to synchronize pinned nodes with pinned Tabs, activate the codes */
      whale.tabs.update(id, {'pinned' : true})
    })
  } else if (changedNode.pinned) {
    changedNode.setDefault();
    changeNodeHTML.children[1].style.background = ""
    status.src = "../icons/default.svg"
    whale.tabs.get(id, function(tab){             /* If you want to synchronize pinned nodes with pinned Tabs, activate the codes */
      whale.tabs.update(id, {'pinned' : false})
    })
  }
}

function grayColor(id) {
      // // title 색 죽이기 (error : the color is reset when reloaded)
      var closedNodeHTML = document.getElementById("n" + id);
      if (closedNodeHTML.children.length > 0) {
      closedNodeHTML.children[0].children[0].style.filter = "grayscale(100%)";
      closedNodeHTML.children[1].children[0].style.color = "A3A3A3";

      console.log(closedNodeHTML.children[1].children[0]);
      }
}

// for super Delete
const superDeletePort = whale.runtime.connect({name: `superDelete`});

function superDelete(){
  var defaultNodes = diveInTree.treeArray.filter(node => {
    return (node.checked == false && node.pinned == false);
  })

  var defaultNodesId = defaultNodes.map(Node =>{
    return Node.id;
  })
  var reverseDefaultNodesId = defaultNodesId.sort(function(a, b){
    return b-a;
  })
  var reverseDefaultNodes = reverseDefaultNodesId.map(id =>{
    return diveInTree.findNode(id);
  })

  console.log('this is reverseDefaultNodes***************************');
  console.log(reverseDefaultNodes);

  for(var i =0; i<reverseDefaultNodes.length ;i++){
    if(reverseDefaultNodes[i].link == null){
      console.log('b');
      console.log(reverseDefaultNodes[i].children.length);
      if(checkChildrenStatus(reverseDefaultNodes[i])){
        console.log('bb');
        var idx = diveInTree.treeArray.indexOf(reverseDefaultNodes[i]);
        console.log(idx);
        diveInTree.treeArray.splice(idx, 1);
        console.log(diveInTree.treeArray);
      }
    }else{
      console.log('a');
      whale.tabs.remove(reverseDefaultNodes[i].id);
      // toDelete.push(reverseDefaultNodes[i]);
    }
  }
  // var toDeleteId = toDelete.map(Node => {
  //   return Node.id;
  // })

  // superDeletePort.postMessage(toDeleteId);
  // for(var i = 0 ; i < defaultNodes.length ; i++){
  //   diveInTree.deleteNode(defaultNodes[i]);
  // }
}

var forCheck;
function checkChildrenStatus(node){
  if(node.checked == false && node.pinned == false){
    forCheck = true;
  }else{
    forCheck = false;
  }

  if(node.children.length !=0){
    for(var i = 0 ; i < node.children.length ; i++){
      checkChildrenStatus(node.children[i]);
    }
  }
  return forCheck;
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
