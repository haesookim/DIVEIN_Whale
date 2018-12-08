Node class
// all open tabs are defined as nodes
class Node {
constructor(data) {
  this.link = data;  // link/tab information of the node
  this.title = null; // name of the tab/node
  this.parent = null;

    /*
     * what I also could do is implement the child in actual list(array)form
      * instead of doing it the linked list way
      * might be easier to implement - consider as factor (look into JS array methods)
      */
    //this.children = [];
  }

  //do I need isParent & isLeaf booleans?
  //is this correct JS syntax
  booleans isParent(){
    if (this.children.length == 0){
      return false;
    }
    else return true;
  }
}

// tree class
class tree{
  constructor(){
    this.root = null;
  }

<<<<<<< HEAD
  //add a new node to the tree
  createNode(tab){
    console.log("-----------creating Node-------------"); 
    var newNode = new Node(tab.id, tab.url, tab.title, tab.favIconUrl);
    this.treeArray.push(newNode);
    if(tab.openerTabId != null){
      // console.log("if statement! tab.openerTabId is " + tab.openerTabId)
      this.setParent(this.findNode(tab.openerTabId), newNode);
=======
  //run when new tab(child node) is opened with the variable data (link)
  addChild(data){
    var newNode = new Node(data);

    if (this.root == null){
      this.root = newNode;
    } else {
      this.insertNode(newNode);
>>>>>>> b6dfc32b43c02bb5e124a658d2773d2ec1d7af69
    }
  }

  //set parent - child relationship
  setParent(parentNode, childNode){
    parentNode.children.push(childNode)
    childNode.parent = parentNode;
  }

<<<<<<< HEAD
  // search for a specific node according to the tabid
  findNode(tabId){
    console.log("-----------finding Node-------------");
    console.log(this.treeArray); // 📌
    for(var i = 0 ; i < this.treeArray.length; ++i){
      if(this.treeArray[i].id == tabId){
        console.log("Found it! --> " + this.treeArray[i].title)
        return this.treeArray[i];
      }
    }
  }

  updateNode(tabId, changeInfo){
    var updatedNode = this.findNode(tabId);
    console.log(tabId);
    
    console.log(changeInfo);
    if (changeInfo.url) {
      updatedNode.link = changeInfo.url
    } else if (changeInfo.title) {
      updatedNode.title = changeInfo.title
    } else if (changeInfo.favIconUrl) {
      updatedNode.favicon = changeInfo.favIconUrl
    }
    console.log(updatedNode)
    
    var index = this.treeArray.indexOf(this.findNode(tabId));
    this.findNode(tabId) = updatedNode;
    if (index !== -1) {
        this.treeArray[index] = updatedNode;
      }
    }

=======
>>>>>>> b6dfc32b43c02bb5e124a658d2773d2ec1d7af69
  //insert node to the tree accordingly
  insertNode(newNode){

    //setparent, setchild
  }

  // run when tab(node) is closed
  // check if this is correct!!!
  deleteNode(closedNode){
    //if parent, only delete text data(link) of the node
    if (closedNode.children.length != 0){ /*is parent*/
      closedNode.data = null;
      closedNode.title = "";
    }
    //if leaf, delete node
    else {
      for (var i = 0; i < closedNode.parent.children.length; i++){
        if (closedNode.parent.children[i] == closedNode){
          break;
        }
      }
      closedNode.parent.children.splice(i, 1);
      closedNode.parent = null;
    }
  }
}
<<<<<<< HEAD
var defNode = {}
const diveInTree = new tree(defNode);

document.addEventListener('DOMContentLoaded', function() {
// whale.sidebarAction.onClicked.addListener(function () {
  console.log("Let's Start!")
  whale.tabs.query({currentWindow: true}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
        diveInTree.createNode(tabs[i]);
    }
  })
})

whale.tabs.onCreated.addListener((tab) => {
  console.log("A tab is created!")
  diveInTree.createNode(tab);
})

whale.tabs.onUpdated.addListener((tabId, changeInfo) => {
  console.log("A tab is updated!")
  diveInTree.updateNode(tabId, changeInfo);
})

whale.tabs.onRemoved.addListener((tab) => {
  console.log("A tab is removed!")
  diveInTree.deleteNode(diveInTree.findNode(tab.id));
})


whale.runtime.onConnect.addListener(port => {
  if(port.name === 'dive_in'){
    port.postMessage(diveInTree);
  }
})
=======
>>>>>>> b6dfc32b43c02bb5e124a658d2773d2ec1d7af69
