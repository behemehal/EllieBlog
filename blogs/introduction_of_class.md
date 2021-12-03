---
publisher: @ahmtcn123
title: Introduction of class [Outdated]
updated_at: false
updated_by: false
description: Meet the syntax of the class
date: 24.06.2021-00.00
---
## Introduction of class [Outdated]

This syntax is out of date please check this [page](https://ellie.behemehal.net/blog.html?page=finalization_of_tokenizer.md)

Classes are on the way you can find example class below

```ellie
class Animal {

    co Animal(name) {
        if name == "cow" {
           this.name = "lion";
        }
    }
    
    pub v name: string;
    pri v len: int;    

    pub g lenOfString : string {
      ret this.name.len
    }

    pri s len : int (len) {
        if len == this.name.len {
            this.len = 0;
        } else {
            this.len = len;
        }
    }   
}
```
