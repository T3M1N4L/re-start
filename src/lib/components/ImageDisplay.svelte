<script>
    import { settings } from '../settings-store.svelte.js'
    const src = $derived(() => settings.imageUrl || 'https://avatars.githubusercontent.com/u/108430379?v=4')
</script>

<div class="panel image-panel">
    <div class="panel-label">image</div>
    <div class="square">
        <img src={src} alt="image" />
    </div>
</div>

<style>
    .image-panel {
        display: flex;
        flex-direction: column;
    }
    .square {
        width: 100%;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
</style>