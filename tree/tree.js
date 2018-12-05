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
  constructor(){
    this.root = null;
  }

  //add a new node to the tree
  createNode(id, link, title, favicon){

  }

  //set parent - child relationship
  // called by
  setParent(parentNode, childNode){
    parentNode.children.push(childNode);
    childNode.parent = parentNode;
  }

  // search for a specific node according to the tabid
  findNode(tabid){

  }

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
