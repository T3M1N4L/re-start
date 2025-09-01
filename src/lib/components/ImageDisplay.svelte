<script>
    import { settings } from '../settings-store.svelte.js'

    // Accept data URLs, http(s), and blob URLs
    function isDataUrl(str) {
        return typeof str === 'string' && str.startsWith('data:image/')
    }
    function isBlobUrl(str) {
        if (typeof str !== 'string') return false
        try {
            const u = new URL(str)
            return u.protocol === 'blob:'
        } catch {
            return false
        }
    }
    function isHttpUrl(str) {
        if (typeof str !== 'string') return false
        try {
            const u = new URL(str)
            return u.protocol === 'http:' || u.protocol === 'https:'
        } catch {
            return false
        }
    }

    // Normalize user-entered URLs (add https:// when missing)
    function normalizeUrl(str) {
        if (typeof str !== 'string') return ''
        const trimmed = str.trim()
        if (!trimmed) return ''
        // Already has a scheme like http:, https:, data:, blob:, file:, etc.
        if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed
        // Otherwise assume https
        return `https://${trimmed}`
    }

    // Default fallback image (GitHub avatar from defaults)
    const DEFAULT_IMAGE = 'https://avatars.githubusercontent.com/u/108430379?v=4'

    function computeImageSrc() {
        const raw = settings.imageDataUrl ?? settings.imageUrl ?? DEFAULT_IMAGE
        const candidate = isDataUrl(raw) ? raw : normalizeUrl(raw)
        if (isDataUrl(candidate) || isBlobUrl(candidate) || isHttpUrl(candidate)) return candidate
        return DEFAULT_IMAGE
    }

    let imgSrc = computeImageSrc()

    // Recompute when relevant settings change
    $effect(() => {
        // access to make them reactive
        void settings.imageDataUrl
        void settings.imageUrl
        imgSrc = computeImageSrc()
    })

    // If the image fails to load (bad URL), fall back to default once
    function onImgError() {
        if (imgSrc !== DEFAULT_IMAGE) {
            imgSrc = DEFAULT_IMAGE
        }
    }

    const altText = 'image'
</script>

<div class="panel image-panel">
    <div class="panel-label">image</div>
    <div class="square">
        <img
            class="image"
            src={imgSrc}
            alt={altText}
            loading="lazy"
            on:error={onImgError}
            decoding="async"
            referrerpolicy="no-referrer"
        />
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
    .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
        display: block;
    }
</style>