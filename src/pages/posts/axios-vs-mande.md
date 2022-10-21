---
title: Axios vs. Mande
pubDate: '2022-10-21T19:01:22.233Z'
description: What are they, do you need them, and how do they compare?
layout: '../../layouts/BlogPost.astro'
---

For web projects, I've been using Axios in my projects for quite some time. It's been my go-to library for making HTTP requests for quite a while now, but I started hearing about another library called mande recently. It seems to be gaining some traction and some people seem to be pretty happy with it. I wanted to take the opportunity in this post to do a deep dive into what each of these libraries does, and maybe if you don't need to use them at all.

# What is Axios?

Axios is a library that has the goal of being isomorphic regarding the browser and Node environments. This means that no matter if you're in the browser or on the server side in a node environment, you can use the same interface to interact with remote HTTP endpoints. This reduces mental overhead for making requests but is also very useful when writing a library that needs to make requests on both the server and client in the same way. This is all great, but as of earlier this year, the fetch function landed in NodeJS, meaning the same interface can be used on both the client and server. So unless you are using an older version of Node that doesn't support fetch, the main use case for Axios seems to have been rendered irrelevant.

While the self-stated goal of Axios is to be an isomorphic option for making HTTP calls, that's not all it has to offer. It also allows the creation of an instance of a client that lets you set things like your base URL, timeout parameters, default query parameters, and default request headers. Instead of building a custom client class, it handles that for you. It also provides hooks into the request and response pipelines that allow you to transform or run custom logic on the data in transit. This can be helpful for complex auth middleware scenarios or if the data coming back from the API needs to be manipulated in some way. If you're interested in seeing what the config options are you can find them [here](https://axios-http.com/docs/req_config). Many of these config options can also be [set as defaults globally](https://axios-http.com/docs/config_defaults) as well within the app.

Along the same lines as the default hooks into the request and response pipelines, Axios also has the concept of [Interceptors](https://axios-http.com/docs/interceptors). These are more modular and are handlers that can be added and removed from the client dynamically. All interceptors are function objects. They are similar to event handlers in frontend apps, they just handle the event of a request being sent or a response being received.

Axios also provides good ways to validate status codes, cancel in-flight requests, and provide definitions for TypeScript out of the box as well.

## What does it look like to use Axios?

Basic Axios usage for a GET call is pretty simple:

```ts
import axios from 'axios';

try {
  const response = await axios.get(
    'https://api.benbrougher.tech/hello?echo=Hi%20There'
  );
  console.info(response);
} catch (error) {
  console.error(error);
}
```

And for a POST:

```ts
import axios from 'axios';

try {
  const response = await axios.post('https://api.benbrougher.tech/hello', {
    echo: 'Hello World',
  });
  console.info(response);
} catch (error) {
  console.error(error);
}
```

# What is mande?

On the other hand, mande is not meant to be an isomorphic library. It is a simple wrapper around the `fetch` function. It checks to see that the status code is in an acceptable range, and provides a simple resource-based interface for you to interact with.

Like Axios it also provides some ways to define default values for resources. Things like default values and headers can be provided when creating a mande instance. It also provides hooks to cancel the request.

The other claim to fame of mande is it's small. As a library, its size is less than 800 bytes.

## What does it look like to use mande?

Basic usage of mande is also pretty simple:

```ts
import { mande } from 'mande';

const hello = mande('https://api.benbrougher.tech/hello');
try {
  const response = await hello.get('', { query: { echo: 'Test' } });
  console.info(response);
} catch (error) {
  console.error(error);
}
```

And a POST request:

```ts
import { mande } from 'mande';

const hello = mande('https://api.benbrougher.tech/hello');
try {
  const response = hello.post({ echo: 'Hi there' });
  console.info(response);
} catch (error) {
  console.error(error);
}
```

# Which one is better?

So, which is it? Which one is better to use? I think the answer to that question is the proverbial "it depends." If you're on a current version of Node, and you're using true REST API that's based on resources and not just making RPC calls with HTTP, then mande might be the library for you. But if you have any sort of issue with using a small library for core functionality, then you might go with Axios. And if the advanced features Axios provides would make your app simpler and reduce boiler-plate code, then it would probably be the better option. But what if you didn't want all that? What if you wanted a simple option that's built into all modern platforms already?

# Wait, what about fetch?

The `fetch` function is that option. It's now part of every modern browser, and it's part of NodeJS and deno and it works the same everywhere. It supports async/await like the two above, but it requires a bit more boilerplate code around it to do things like add in headers, handle errors, etc. It also doesn't have anything like Axios' Interceptors. All that said, for most things, fetch is probably just fine.

# Conclusion

So in short, all three have their strengths, and all three are viable options for most projects. I think moving forward, I'm going to use `fetch` for simple things, and then use Axios for larger apps with more complex data layers. The features provided by creating instances that have defaults are pretty useful in practice. That said, I look forward to seeing what mande brings to the table in the future. Will it stay a tiny library to wrap fetch? Or will it grow and add more features to rival Axios? Time will tell, but as of right now, it's a solid wrapper library in the middle ground complexity-wise between fetch and Axios.