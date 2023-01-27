<script lang="ts">
  import { Project } from '../models/Project';
  export let projects: Project[] = [];
</script>

<div>
  <br />
  {#each projects as project}
    <article>
      <a href={project.url} target="_blank" rel="noreferrer">
        <img
          class="website-thumbnail"
          alt="screenhsot of project website"
          src="/content/assets/project-screenshots/{project.image}"
        />
      </a>
      <content>
        <a href={project.url} target="_blank" rel="noreferrer">
          <h3>{project.name}</h3>
        </a>
        <p class="description">{project.description}</p>
      </content>
    </article>
  {/each}
</div>

<style>
  a {
    text-decoration: none;
    color: var(--linkColor);
  }

  h3 {
    margin-bottom: 0.5em;
    font-family: 'Merriweather', 'Georgia', serif;
    font-size: 1.5rem;
  }

  p {
    padding-top: 0em;
    margin-top: 0.25em;
    margin-bottom: 0em;
  }

  article {
    margin-bottom: 4em;
    display: flex;
    flex-direction: row;
  }

  .description {
    font-size: var(--standardFontSize);
  }

  .website-thumbnail {
    width: 12em;
    border-radius: 0.75em;
    margin: 1em;
  }
</style>
