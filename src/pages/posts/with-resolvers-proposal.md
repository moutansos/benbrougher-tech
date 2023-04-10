---
title: The withResolvers JavaScript Proposal
pubDate: '2023-04-07T11:20:03.284Z'
description: 'What is the withResolvers Proposal and how does it work?'
layout: '../../layouts/BlogPost.astro'
---

I'm sure you're all familiar with promises, those handy objects that let us handle asynchronous operations in a clean and elegant way. But did you know that there's a new proposal in the works that could make promises even easier to create and use? It's called the withResolvers proposal, and it's currently at stage 1 of the [TC39 process](https://tc39.es/). In this blog post, I'll give you a brief overview of what this proposal is about, and show you some code examples of how it works.

So what is the withResolvers proposal? It's a simple but powerful idea: instead of creating a promise using the `new Promise()` syntax, which requires you to pass a function that receives two arguments (resolve and reject), you can use a static method called `Promise.withResolvers()` that returns an object with three properties: resolve, reject, and promise. The promise property is the actual promise object that you can use as usual, while the resolve and reject properties are functions that you can call to fulfill or reject the promise. This way, you don't need to wrap your code in a function, and you can return from the function without having to call resolve or reject explicitly. Combine this with object destructuring and you end up with an elegant one-liner to set up your new promise.

Here's an example of how this works. Suppose you want to write a function that fetches some data from an API using Node.js. You could do it like this using the traditional syntax:

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}
```

Now let's see how we can rewrite this function using the withResolvers syntax:

```javascript
function fetchData(url) {
  const { resolve, reject, promise } = Promise.withResolvers();
  const http = require('http');
  http
    .get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    })
    .on('error', (err) => {
      reject(err);
    });
  return promise;
}
```

Of course, this is just a simple example, and there are many more use cases where the withResolvers syntax can be handy, but this does get rid of one of the nested scopes and the need to pass a function into the Promise constructor. I know many will enjoy this syntax as it's a bit more concise and functional.

The withResolvers proposal is still in stage 1 of the tc39 process, which means it's not yet part of the official JavaScript specification and it's subject to change. As of time of writing, I don't see a polyfill available for it just yet, however you can still check out the official proposal repository for more details and examples [here](https://github.com/tc39/proposal-promise-with-resolvers).

I hope you enjoyed this blog post and learned something new about the withResolvers proposal. I think it's a great addition to the JavaScript language that will make working with async code easier and more enjoyable. Let me know what you think in the comments below!
