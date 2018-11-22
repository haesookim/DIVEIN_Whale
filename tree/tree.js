// Node class
// all open tabs are defined as nodes
class Node {
  constructor(data) {
    this.link = data;  // link/tab information of the node
    this.title = null; // name of the tab/node
    this.parent = null;
    this.child = null;
    this.rightSibling = null;
    this.leftSibling = null;
    //do I need isParent & isLeaf booleans?
  }
}

// tree class
class tree{
  constructor(){
    this.root = null;
  }

  //run when new tab(child node) is opened with the variable data (link)
  addChild(data){
    var newNode = new Node(data);

    if (this.root == null){
      this.root = newNode;
    } else {
      this.insertNode(newNode);
    }
  }

  //set parent - child relationship
  setParent(parentNode, childNode){

  }

  // these two functions may be merged
  // set oldchild as rightSibling of newchild
  setRightSibling(oldChild, newChild){

  }

  // set newchild as leftsibling of oldChild
  setLeftSibling(oldChild, newChild){

  }

  //insert node to the tree accordingly
  insertNode(newNode){
    //setparent, setchild
  }

  // run when tab(node) is closed
  // implement recursively?
  deleteNode(closedNode){
    //if parent, only delete text data(link) of the node

    //if leaf, delete node
  }

  // find last child of a single parent
  // so that sibling could be added
  findLastChild(parentNode){

  }
}
