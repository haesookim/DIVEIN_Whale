var obj = [
    {id: 2, parent_id: 1, title: "Row 2"},
    {id: 3, parent_id: 2, title: "Row 3"},
    {id: 4, parent_id: 2, title: "Row 4"},
    {id: 1, parent_id: null, title: "Row 1"}
  ]
  
  var test = {};
  test.id = 5;
  test.parent_id = 1;
  test.title = "Row 5";

  obj.sort(function(a, b){
    return (a.parent_id == null ? 0 : a.parent_id) - (b.parent_id == null ? 0 : b.parent_id);
  });
  
  var tree = document.getElementById("tree");
  for (var i = 0; i < obj.length; ++i)
    {
  
      if (obj[i].parent_id == null)
        {
          createTreeElement("li", obj[i].id, obj[i].title, tree);
        }
      else
        {
           var treeChildNode = document.getElementById("t" + obj[i].parent_id).getElementsByTagName("ul");
          if (treeChildNode.length)
            {
              createTreeElement("li", obj[i].id, obj[i].title, treeChildNode[0]);
            }
          else
            {
              createTreeElement("ul", obj[i].parentId, "", document.getElementById("t" + obj[i].parent_id));
              createTreeElement("li", obj[i].id, obj[i].title, document.getElementById("t" + obj[i].parent_id).getElementsByTagName("ul")[0]);
            }
        }
    }
  
  function createTreeElement(name, id, text, parent) {
    var node = document.createElement(name);
    node.id = "t" + id;
    node.innerHTML = text;
    parent.appendChild(node);
  }
  
  
  // 클릭했을 때 그 탭으로 fcous 옮겨지도록
  // 탭마다 status(default, checked, pinned 부여)
  // 파비콘 삽입
  // sidebar 오른쪽에다 status 표시하는 아이콘 넣고
  // 이 아이콘 클릭했을 때 status 변하도록
  // status 별로 배경색깔 다르게
  
  //싱크
  //