<script lang="ts">
  import { Temporal } from '@js-temporal/polyfill';
  import TimerCard from './TimerCard.svelte';

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

  let currentTime: Temporal.PlainTime = Temporal.Now.plainTimeISO();
  let startTime: Temporal.PlainTime | null = null;

  let currentTimeString: string = '';
  let startTimeString: string = '';
  $: currentTimeString = formatTime(currentTime);
  $: startTimeString = formatTime(startTime);

  let timeElapsed: Temporal.Duration | null = null;
  let timeElapsedString: string = '';
  $: timeElapsedString = formatDuration(timeElapsed);

  setInterval(() => {
    currentTime = Temporal.Now.plainTimeISO();
    if(startTime)
        timeElapsed = currentTime.since(startTime);
  }, 10);

  function startTimer(): void {
    startTime = Temporal.Now.plainTimeISO();
  }

  function reset(): void {
    startTime = null;
    timeElapsed = null;
  }
</script>

<TimerCard>
  <pre>
    Current Time: {currentTimeString}<br>
    Start Time: {startTimeString}<br>
    Time Elapsed: {timeElapsedString}<br>
  </pre>
  
  <button on:click={startTimer}>Start</button>
  <button on:click={reset}>Reset</button>
</TimerCard>



