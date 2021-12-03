---
publisher: @ahmtcn123
title: Tokenizer build is complete
updated_at: false
updated_by: false
description: After 29 days build is finally complete
date: 4.12.2021-00.56
---
# Completion of tokenizer

After 29 days of building & testing the tokenizer everything is works like expected. 

Here is the graph of the ellie library which parser had [strugled](https://github.com/behemehal/Ellie-Language/issues/54) to page.

![graph](https://raw.githubusercontent.com/behemehal/EllieBlog/main/img/graph.png)

We tested the pager with graphviz following code; Any one who wants to test [`RawPage`](https://github.com/behemehal/Ellie-Language/blob/0097a72087ca7afda940916f1071f5483c91e273/tokenizer/src/tokenizer.rs#L80) output can do so.

```js
var tree = require('./tree.json');
var path = require('path');
var fs = require('fs');

let output = "digraph dependencies {";
output += "\n    ratio=fill;";
output += "\n    node [style=filled];\n";
for (var i = 0; i < tree.length; i++) {
    var item = tree[i];
    for (var j = 0; j < item.dependencies.length; j++) {
        var dep = item.dependencies[j];
        var cr = path.basename(item.path).split(".")[0];
        var tg = path.basename(tree.find(x => x.hash == dep.hash).path).split(".")[0];
        output += `    ${cr} -> ${tg} [ label= "depends to"]\n`
    }
}
output += "}";
fs.writeFileSync("./outputTree.txt", output);
```

Here is the example output you can test [here](http://webgraphviz.com/):

```
digraph dependencies {
    ratio=fill;
    node [style=filled];
    ellie -> void [ label= "depends to"]
    ellie -> string [ label= "depends to"]
    ellie -> char [ label= "depends to"]
    ellie -> collective [ label= "depends to"]
    ellie -> float [ label= "depends to"]
    ellie -> bool [ label= "depends to"]
    ellie -> cloak [ label= "depends to"]
    ellie -> array [ label= "depends to"]
    ellie -> vector [ label= "depends to"]
    ellie -> function [ label= "depends to"]
    ellie -> nullAble [ label= "depends to"]
    ellie -> class [ label= "depends to"]
    ellie -> int [ label= "depends to"]
    ellie -> dyn [ label= "depends to"]
    void -> string [ label= "depends to"]
    string -> array [ label= "depends to"]
    string -> int [ label= "depends to"]
    string -> char [ label= "depends to"]
    array -> string [ label= "depends to"]
    array -> int [ label= "depends to"]
    int -> string [ label= "depends to"]
    int -> float [ label= "depends to"]
    class -> string [ label= "depends to"]
    dyn -> string [ label= "depends to"]
}
```