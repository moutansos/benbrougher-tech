<script lang="ts">
import { Article } from "../models/Article";

export let articles: Article[] = [];
</script>

{#each articles as article}
    <h2>{article.name}</h2>
{/each}
