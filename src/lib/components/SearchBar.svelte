<script>
    import { settings } from '../settings-store.svelte.js'

    let query = $state('')
    function onSubmit(event) {
        event.preventDefault()
        const base = settings.searchBaseUrl || 'https://google.com/search?q='
        const q = query.trim()
        if (!q) return
        const url = base + encodeURIComponent(q)
        window.open(url, '_blank', 'noopener')
        query = ''
    }
</script>

<div class="panel">
    <div class="panel-label">search</div>
    <form on:submit={onSubmit} class="form">
        <input
            type="text"
            placeholder={settings.searchPlaceholder || 'search'}
            bind:value={query}
            aria-label="Search"
        />
        <button type="submit" class="go">go</button>
    </form>
</div>

<style>
    .form {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }
    input {
        flex: 1;
        background: transparent;
        border: 2px solid var(--bg-3);
        padding: 0.5rem 0.75rem;
    }
    .go {
        color: var(--txt-3);
    }
</style>