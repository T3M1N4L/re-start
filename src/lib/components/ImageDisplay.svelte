<script>
    import { settings } from '../settings-store.svelte.js'

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
        const raw = settings.imageDataUrl ?? settings.imageUrl ?? DEFAULT_IMAGE
        const candidate = isDataUrl(raw) ? raw : normalizeUrl(raw)
        if (isDataUrl(candidate) || isBlobUrl(candidate) || isHttpUrl(candidate)) return candidate
        return DEFAULT_IMAGE
    }

    let imgSrc = computeImageSrc()

    $effect(() => {
        void settings.imageDataUrl
        void settings.imageUrl
        imgSrc = computeImageSrc()
    })

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
        min-height: 0;
    }

    .square {
        width: 100%;
        flex: 1 1 auto;
        min-height:0 ;
        position: relative;
        overflow: hidden;
    }

    .image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        display: block;
    }
</style>
