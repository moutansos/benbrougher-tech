<script>
  import { onMount } from 'svelte';

  let live = false;
  onMount(async () => {
    const response = await fetch("https://api.benbrougher.tech/twitch/status/channels?id=86145815");
    const data = await response.json();
    console.log(data);
    live = data.status === 'live';
  });
</script>

<div>
  {#if live}
    <div id="twitch-banner">
      <a
        href="https://twitch.tv/msyke"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>Currently LIVE on Twitch!</p>
      </a>
    </div>
  {/if}
</div>

<style>
  #twitch-banner {
    background-color: #6441a5;
    color: white;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    margin: 10px;
  }

  #twitch-banner p {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
  }

  #twitch-banner a {
    color: white;
  }
</style>
