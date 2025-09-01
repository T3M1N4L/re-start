<script>
    import { settings } from '../settings-store.svelte.js'

    const props = $props()
    const panelHeight = $derived(Math.max(0, props.size ?? 0))
    const panelWidth = $derived(Math.max(0, props.width ?? 0))

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

    function normalizeUrl(str) {
        if (typeof str !== 'string') return ''
        const trimmed = str.trim()
        if (!trimmed) return ''
        if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed
        return `https://${trimmed}`
    }

    function computeImageSrc() {
        const raw = settings.imageDataUrl ?? settings.imageUrl
        const candidate = isDataUrl(raw) ? raw : normalizeUrl(raw)
        if (isDataUrl(candidate) || isBlobUrl(candidate) || isHttpUrl(candidate)) return candidate
        return settings.imageUrl
    }

    let imgSrc = computeImageSrc()

    $effect(() => {
        void settings.imageDataUrl
        void settings.imageUrl
        imgSrc = computeImageSrc()
    })

    function onImgError() {
        if (imgSrc !== settings.imageUrl) {
            imgSrc = settings.imageUrl
        }
    }

    const altText = 'image'
</script>

<div class="panel image-panel" style={`--height: ${panelHeight}px; --width: ${panelWidth}px`}>
    <div class="panel-label">image</div>
    <div class="image-container" aria-hidden={panelHeight <= 0}>
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
        align-items: center;
        justify-content: center;
        width: var(--width);
        height: var(--width); /* make it square based on width */
        padding: 1.5rem;
        transition: none;
        box-sizing: border-box;
    }

    .panel-label {
        position: absolute;
        top: -14px;
        left: 8px;
        background-color: var(--bg-1);
        color: var(--txt-4);
        z-index: 10;
    }

    .image-container {
        width: 100%;
        aspect-ratio: 1;
        position: relative;
        background-color: rgba(0, 0, 0, 0.05); /* optional for debugging */
    }

    .image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        display: block;
    }
</style>
