---
title: Sharing State Between React, Svelte, and Vue in Astro
pubDate: '2022-12-30T14:40:22.233Z'
description: How to make frameworks share state between each other when using them in Astro
layout: '../../layouts/BlogPost.astro'
---

[Astro](https://astro.build/) is a new static site generator turned meta-framework. It ships no JavaScript by default and therefore creates very fast and lightweight sites. This blog site is built using Astro and the experience with it has been great. It's everything it promises to be and more, but it offers a very interesting feature. By default, it renders things via Astro components in `.astro` files, but Astro has a trick up its sleeve. It can render components using other frameworks as well. It can render them at build-time, load-time, or client-side. This got me thinking, what if you could share the state between different frameworks on the same page? It seems I wasn't the only one with this question as Astro released some [docs](https://docs.astro.build/en/core-concepts/sharing-state/) on how to go about sharing state across frameworks. In this post, I'll show you how I went about stitching together React, Svelte, and Vue so they all shared data between them. 

## Project Setup
Let's start with getting our project set up. Open a terminal, and start in the directory where you place your code projects. Then run the following:
``` bash
npm create astro@latest astro-shared-state # Selected Empty Project and install npm dependencies
cd astro-shared-state
npm run dev
```

Open up your browser to [http://localhost:3000/](http://localhost:3000/) to see if everything is built correctly. You should see a page with the word "Astro" on it.
  
Next, stop your dev server with `Ctrl+C` and run the following to install the packages we will need:

``` bash
npm install @astrojs/svelte @astrojs/react @astrojs/vue nanostores @nanostores/vue @nanostores/react
```

For the first three plugins:
- `@astrojs/svelte`
- `@astrojs/react`
- `@astrojs/vue`  

These are all packages that provide us with the adapters and dependencies to run the three different frameworks within Astro. The other packages:
- `nanostores`
- `@nanostores/vue`
- `@nanostores/react`

These packages are to install a common state management system that works with all three of the frontend frameworks. If you're familiar with Redux, Pinia, or Svelte stores, this package provides similar functionality. 

Next, update the `astro.config.mjs` file to look like the following:

```js
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), svelte(), vue()],
});
```
Here we are importing the three different Astro plug-ins. One for each of our frameworks.

## Creating the Store

We now need to set up the store. Within the `src` folder, create a folder called `stores` and inside that place a file called `couterStore.ts`:

```typescript
import { atom } from "nanostores";

export const counterStore = atom({
  count: 0,
});
```

This exported store represents an object that is shared globally within the application. We'll be incrementing the count variable via all of our components. 

## Creating the Components
Now, let's create a `components` directory in our `src` folder. Inside here will be our components. The Svelte component in `SvelteCounter.svelte`:
```html
<script lang="ts">
  import { counterStore } from "../stores/counterStore";
</script>

<div>
  <h2>Svelte Component</h2>
  <p>Clicks: {$counterStore.count}</p>
  <button
    on:click={() => counterStore.set({ ...$counterStore, count: $counterStore.count + 1 })}
    >Click!</button
  >
</div>

<style>
    div {
        padding: 1em;
    }
</style>
```
The Vue component in `VueCounter.vue`:
```html
<template>
  <div>
    <h2>Vue Component</h2>
    <p>Clicks: {{$counterStore.count}}</p>
    <button
      @click="counterStore.set({ ...$counterStore, count: $counterStore.count + 1 })"
    >
      Click!
    </button>
  </div>
</template>

<script setup lang="ts">
import { counterStore } from "../stores/counterStore";
import { useStore } from "@nanostores/vue";

const $counterStore = useStore(counterStore);
</script>

<style>
    div {
        padding: 1em;
    }
</style>
```
And finally the React component in `ReactCounter.jsx`:
``` tsx
import { useStore } from "@nanostores/react";
import { counterStore } from "../stores/counterStore";

export default function ReactCounter() {
  const $counterStore = useStore(counterStore);

  return (
    <div>
      <h2>React Component</h2>
      <p>Clicks: {$counterStore.count}</p>
      <button
        onClick={() =>
          counterStore.set({ ...$counterStore, count: $counterStore.count + 1 })
        }
      >
        Click!
      </button>
    </div>
  );
}
```
## The main page

Now update the main page under `src/pages/index.astro` to look like this:
``` html
---
import ReactCounter from "../components/ReactCounter";
import SvelteCounter from "../components/SvelteCounter.svelte";
import VueCounter from "../components/VueCounter.vue";
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>Astro</h1>
		<div class="counters">

			<SvelteCounter client:visible />
			<VueCounter client:visible />
			<ReactCounter client:visible />
		</div>
	</body>
</html>

<style>
.counters {
	display: flex;
	flex-direction: row;
}
</style>
```

Notice we can import each of our components at the top of the .astro file, and that when we use them, we specify `client:visible` below. If we hadn't, Astro would statically render our components at build time and strip out all the JavaScript leaving us with elements that don't have any logic behind them. The `client:visible` tag tells Astro to send along the JS behind the components with the rest of the page. 

Now, make sure your dev server is running and navigate to [http://localhost:3000/](http://localhost:3000/), and you should get something like this when navigating to your browser:

<img src="/content/blog/astro-shared-state/astro-shared-state-screenshot.png" />

You should be able to click on any of the three buttons and all three components should update with the new count value.
## Conclusion

You now have a very basic app that can share state across different types of frameworks. This is extremely interesting as an experiment, but in the long term, it probably isn't a great idea. From a maintenance standpoint, instead of having a single framework to worry about updating you have multiple, and the state management system, while it works, isn't the most elegant thing in the world. Every different thing you add to your software stack is another point of failure, so you absolutely will have problems related to the pieces interacting. Also, another downside is that since this is technically a multi-page app, if you were to change pages, state would be lost. This can be remedied by putting the state in local storage, which nanostores supports natively, but again adds some complexity. This paradigm of multiple frameworks on one page is very cool, and I want this idea to move forward, but my gut tells me it's a bit bleeding-edge right now, so I wouldn't do this in a serious project. All that said, I'm excited to see how this progresses and where Astro goes from here.