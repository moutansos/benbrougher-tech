---
title: 'Building a Svelte Stopwatch with the Temporal API'
pubDate: '2023-03-12T18:15:22.233Z'
description: How to use the new Temporal API to build a stopwatch in Svelte and TypeScript
layout: '../../layouts/BlogPost.astro'
---

I've been hearing about the new Temporal API proposal for JavaScript for a while now. The goal of the new proposal is to fix all the problems that exist with the current Date object. There are an assortment of reasons for this. One is that often when using methods on a date object, they modify the internal state of the object rather than returning a new object with the new values. Others are more general ergonimic issues and overall the developer experience isn't great. For years we've looked to libraries like date-fns and moment.js to aleviate these problems. The idea is once Temporal lands in the browser, we won't need those libraries nearly as often. To start to explore this libary, I decided I would try and build a simple stopwatch component for Svelte. In it, there would be some minor time formatting and math, so I thought I'd see what it would be like. If you'd like to follow along, open up a Svelte project locally or on something like StackBlitz. You'll need to install packages so the standard Svelte REPL won't work here. 

## Setting Up

In your project, make sure TypeScript is installed, and then install the Temporal polyfill:

```bash
npm install @js-temporal/polyfill
```

Then create a file in your main code directory called `Stopwatch.svelte`. Now we should be ready to get started.

## Building the Component

Inside the `Stopwatch.svelte` file, start by creating a blank script tag, a div and a style tag:
```html
<script lang="ts">

</script>

<div class="stopwatch-wrapper">

</div>

<style>

</style>
```
First, lets create some variables for storing the current time and the start time:
```html
<script lang="ts">
  import { Temporal } from '@js-temporal/polyfill';

  let currentTime: Temporal.PlainTime = Temporal.Now.plainTimeISO();
  let startTime: Temporal.PlainTime | null = null;
</script>

... other blocks ...
```
Here we are importing the polyfill, then we use it to create a `Temporal.PlainTime` object. It represents a time without any date elements. Also, we add a second variable to hold the start time of our stopwatch. 
  
Next, lets add in some formatting functions, theres use the new Temporal API to handle formatting:
```html
<script lang="ts">
  ... stuff above ...
  function formatTime(time: Temporal.PlainTime | null): string {
      if(!time) return '';
      return time.toLocaleString('en-US', {
        timeStyle: 'medium',
      });
    }
  
    function formatDuration(duration: Temporal.Duration | null): string {
      if(!duration) return '';
      const durationString = duration.toString({ smallestUnit: 'millisecond' });
      return durationString
        .replace("PT", "")
        .replaceAll(/(S|H|M|D)/g, ":")
        .replace(/:$/, ''); 
    }
</script>
```

This pollyfill is technically incomplete. There are methods on the `Temporal.Duration` object that should be part of the `Intl` API. These methods are an additional proposal. If you're curious about them you can read about it [here](https://github.com/tc39/proposal-intl-duration-format). This means that we have to do some fixing of the output of the duration's `.toString()` method. Above though, with a regular date object we can use a standard `.toLocaleString(...)` method to format our date properly.  

Next, we need to set up our formatted string variables:
```html
<script lang="ts">
  ... stuff from above ...

  let currentTimeString: string = '';
  let startTimeString: string = '';
  $: currentTimeString = formatTime(currentTime);
  $: startTimeString = formatTime(startTime);

  let timeElapsed: Temporal.Duration | null = null;
  let timeElapsedString: string = '';
  $: timeElapsedString = formatDuration(timeElapsed);
</script>
```
Then we can create a timer that updates the variable on the screen. It looks a bit something like this:
``` html
<script lang="ts">
  ... stuff from above ...

  setInterval(() => {
    currentTime = Temporal.Now.plainTimeISO();
    if(startTime)
        timeElapsed = currentTime.since(startTime);
  }, 10);
</script>
```
Here we can use the `.since()` method. It calculates a duration based on two times. Next we'll add the action functions that will perform actions when they're pressed:
``` html
<script lang="ts">
  ... stuff from above ...
  
  function startTimer(): void {
    startTime = Temporal.Now.plainTimeISO();
  }

  function reset(): void {
    startTime = null;
    timeElapsed = null;
  }
</script>
```
Now that we have the actions built, we can add the markup and the styling:
```html
<div class="stopwatch-wrapper">
  <pre>
    Current Time: {currentTimeString}<br>
    Start Time: {startTimeString}<br>
    Time Elapsed: {timeElapsedString}<br>
  </pre>
  
  <button on:click={startTimer}>Start</button>
  <button on:click={reset}>Reset</button>
</div>

<style>
.stopwatch-wrapper {
    background: rgb(53, 53, 53);
    padding: 0.5em 1em 1em 1em;
    border-radius: 1em;
    margin: 1em;
    max-width: 15em;
}
</style>
```

## Adding it to Our App

Now we need to add it to our main App component. In the StackBlitz starter, this looks something like this:
```html
<script lang="ts">
  import Stopwatch from './Stopwatch.svelte'
</script>

<main>
  <Stopwatch />
</main>
```

If you want to see the result, you can see the full app [here](https://stackblitz.com/edit/vitejs-vite-7teh1f?file=src/Stopwatch.svelte).

## Conclusion

Now, if you hit the start button, you'll start the stopwatch time elapsing. If you hit the start button again, it will reset to run from the button is pressed. The reset button will clear the start and time elapsed.
  
The new Temporal API definitely feels more ergonomic compared to the standard date object. The API surface area makes sense in context with the `Intl` methods and APIs as well.

While Temporal isn't ready for prime time, the polyfill does allow shipping a production app using this API. The spec is mostly solidified at this point, so any changes to the API surface area will most likely be minor. 