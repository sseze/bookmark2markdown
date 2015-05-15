var dfdFunc = function(){
    var dfd = $.Deferred();
    return dfd.promise();
}


chrome.bookmarks.getTree(function(roots){
    var bookmarks = [];

    roots.forEach(parser);

    function parser(node){
        var depth = 0;
        if (node.children) {
            // console.log(node.title + '(id:' + node.id + ', parentId:' + node.parentId + ')');
            depth = depthCalc(depth,node.parentId);
            bookmarks.push({
                "id"       : node.id,
                "parentId" : node.parentId,
                "title"    : node.title,
                "depth"    : depth
            });
            // if (node.title) {
            //     bookmarks += '* ' + node.title + '\n';
            // }
            node.children.forEach(parser);
        } else if(node.url) {
            depth = depthCalc(depth,node.parentId);
            // console.log(node.title + '(id:' + node.id + ', parentId:' + node.parentId + ', depth:' + depth + ')');
            bookmarks.push({
                "id"       : node.id,
                "parentId" : node.parentId,
                "title"    : node.title,
                "url"      : node.url,
                "depth"    : depth
            });
            // if (parentId != node.parentId) {
            //     bookmarks += '--------------end folder--------------\n';
            // }
            // bookmarks += '  - ' + node.title + '\n';
            // parentId = node.parentId;
        }
    }
});

function depthCalc(depth,parentId){
    if (parentId != "0") {
        chrome.bookmarks.get(parentId,function(parentNode){
            // console.log(parentNode[0].parentId);
            if (parentNode[0].parentId != "0") {
                depth++;
                depthCalc(depth,parentNode[0].parentId);
            }
        });
    }
    return depth;
}
