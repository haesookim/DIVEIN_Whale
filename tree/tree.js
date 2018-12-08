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
    if(tab.openerTabId !== null){
      this.setParent(this.findNode(tab.openerTabId), newNode);
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
    for(var i; i<treeArray.length; ++i){
      if(treeArray[i].openerTabId === tabId){
        return treeArray[i];
      }
    }
  }

  updateNode(tabId, changeInfo){
    var updatedNode = this.findNode(tabId);
    updatedNode.link = changeInfo.url;
    updatedNode.title = changeInfo.title;
    updatedNode.favicon = changeInfo.favIconUrl;
    
    var index = treeArray.indexOf(this.findNode(tabId));
    this.findNode(tabId) = updatedNode;
    if (index !== -1) {
        this.treeArray[index] = updatedNode;
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
      closedNode.title = "";
      closedNode.favicon = null; //if loaded favicon exists, load it in (should create defualts setting in css)
    }
    //if leaf, delete node
    else {
      for (var i = 0; i < closedNode.parent.children.length; i++){
        if (closedNode.parent.children[i] == closedNode){
          break;
        }
        closedNode.parent.children.splice(i, 1);
        closedNode.parent = null;
        this.treeArray(i, 1);
      }
    }
  }
}

var defTab = whale.tabs.get(1);
defNode = new Node(defTab.id, defTab.url, defTab.title, defTab.favIconUrl);
const diveInTree = new tree(defNode);

whale.tabs.onCreated.addListener((tab) => {
  diveInTree.createNode(tab);
})

whale.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  diveInTree.updateNode(tabId, changeInfo);
})

whale.tabs.onRemoved.addListener((tab) => {
  diveInTree.deleteNode(diveInTree.findNode(tab.id));
})


whale.runtime.onConnect.addListener(port => {
  if(port.name === 'dive_in'){
    port.postMessage(diveInTree);
  }
})
