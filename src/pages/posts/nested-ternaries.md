---
title: I Love Nested Ternaries
pubDate: '2022-12-10T16:01:22.233Z'
description: Why I love them, and why I think they aren't an unreadable mess.
layout: '../../layouts/BlogPost.astro'
---

Before you start heading down to the comments section to tell me I'm wrong, hear me out. Nested ternaries might not be the worst thing for readability in code. On the contrary, done well, they can be more concise and prove to be a stop-gap solution for languages without things like pattern matching and the match syntax in Rust or switch expressions in C#. 

## How not to use them

Before I get into how to go about using them properly, I'd like to establish how not to use them. The worst usage is something I like to call the "wall of text":

```ts
const myList = ["a", "b", "a", "c"];

for(entry of myList) {
    const isVowel = "a" === entry ? true : "e" === entry ? true :
        "i" === entry ? true : "o" === entry ? true : "u" === entry 
        ? true : "y" === entry ? true : false;

    if(isVowel) console.log("It's a vowel!");
    else console.log("It's not a vowel!");
}
```
This is a pretty contrived example, there are better ways to do this, but I want to show off the concept specifically. The code above is perhaps concise, but it's very hard to reason about what's going on. If the conditionals are any more complex, you'd lose your place rather quickly. 

The next example is what I like to call "the exploded" approach. If you use a formatter like Prettier with your JS/TS you'll see this:

```ts
const myList = ["a", "b", "a", "c"];

for (entry of myList) {
  const isVowel =
    "a" === entry
      ? true
      : "e" === entry
      ? true
      : "i" === entry
      ? true
      : "o" === entry
      ? true
      : "u" === entry
      ? true
      : "y" === entry
      ? true
      : false;

  if (isVowel) console.log("It's a vowel!");
  else console.log("It's not a vowel!");
}

```

That ok, but it's still not great. It's more readable than the wall of text, but it could be a whole lot better.

## The best way

This is the best way to format them:

```ts
const myList = ["a", "b", "a", "c"];

for(entry of myList) {
    const isVowel = 
        "a" === entry ? true :
        "e" === entry ? true :
        "i" === entry ? true :
        "o" === entry ? true :
        "u" === entry ? true :
        "y" === entry ? true :
            false;

    if(isVowel) console.log("It's a vowel!");
    else console.log("It's not a vowel!");
}
```

It's clean and concise, and it shows you the conditional paired with the returned value and provides the default value on the last line. It also leaves no variables in null states like a row of if statements might. It also allows for flexibility in the conditions on the left side. Unlike the match or switch syntaxes you can check anything you want in the conditions on the left side. This is what I wish formatting tools like Prettier would default to. I've run into many situations where this format would be much cleaner and more concise.

## Conclusion

You may have heard that nested ternaries are bad and that they should be avoided at all costs for readability and maintainability, but I think they have a place in the coder's toolbox. They're a concise, flexible, and very functional way to check conditions and map them to values. They just need to be formatted properly.