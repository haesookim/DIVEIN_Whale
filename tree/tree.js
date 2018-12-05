Node class
// all open tabs are defined as nodes
class Node {
constructor(id, link, title, favicon) {
  this.id = id; // tab id of the node
  this.link = link;  // link information of the node
  this.title = title; // name of the tab/node
  this.favicon = favicon;
  this.parent = null;
  this.children = [];
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
    parentNode.children.push(childNode);
    childNode.parent = parentNode;
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
