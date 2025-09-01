<script>
    import Todoist from './lib/components/Todoist.svelte'
    import Weather from './lib/components/Weather.svelte'
    import Links from './lib/components/Links.svelte'
    import Clock from './lib/components/Clock.svelte'
    import Stats from './lib/components/Stats.svelte'
    import Settings from './lib/components/Settings.svelte'
    import SearchBar from './lib/components/SearchBar.svelte'
    import ImageDisplay from './lib/components/ImageDisplay.svelte'
    import '@fontsource-variable/geist-mono'
    import { onMount } from 'svelte'

    let showSettings = $state(false)
    function closeSettings() {
        showSettings = false
    }

    let rightColEl
    let leftColEl

    let rightHeight = $state(0)
    let leftWidth = $state(0)
    let searchWrapEl
    let searchWrapHeight = $state(0)
    let searchWrapWidth = $state(0)
    let rowGap = $state(0)

    const computeGap = () => {
        if (!leftColEl) return 0
        const cs = getComputedStyle(leftColEl)
        const g = cs.rowGap || cs.gap || '0px'
        const px = parseFloat(g)
        return Number.isFinite(px) ? px : 0
    }

    // Square size should fill available space but stay square (min of width vs available height)
    let squareSize = $derived(() => {
        const searchWidth = searchWrapWidth || 300
        const availableHeight = rightHeight - (searchWrapHeight || 80) - 24 // subtract search height and gap
        return Math.min(searchWidth, availableHeight)
    })

    onMount(() => {
        const roRight = new ResizeObserver((entries) => {
            const cr = entries[0]?.contentRect
            rightHeight = Math.round(
                cr?.height ?? rightColEl?.getBoundingClientRect().height ?? 0
            )
        })
        const roLeft = new ResizeObserver((entries) => {
            const cr = entries[0]?.contentRect
            leftWidth = Math.floor(cr?.width ?? leftColEl?.clientWidth ?? 0)
            rowGap = computeGap()
        })
        const roSearch = new ResizeObserver((entries) => {
            const cr = entries[0]?.contentRect
            searchWrapHeight = Math.round(cr?.height ?? searchWrapEl?.offsetHeight ?? 0)
            searchWrapWidth = Math.round(cr?.width ?? searchWrapEl?.offsetWidth ?? 0)
        })

        if (rightColEl) roRight.observe(rightColEl)
        if (leftColEl) roLeft.observe(leftColEl)
        if (searchWrapEl) roSearch.observe(searchWrapEl)

        // Initial sync
        rightHeight = Math.round(rightColEl?.getBoundingClientRect().height ?? 0)
        leftWidth = Math.floor(leftColEl?.clientWidth ?? 0)
        rowGap = computeGap()
        searchWrapHeight = Math.round(searchWrapEl?.offsetHeight ?? 0)
        searchWrapWidth = Math.round(searchWrapEl?.offsetWidth ?? 0)

        const onWinResize = () => {
            leftWidth = Math.floor(leftColEl?.clientWidth ?? 0)
            rowGap = computeGap()
        }
        window.addEventListener('resize', onWinResize)

        return () => {
            roRight.disconnect()
            roLeft.disconnect()
            roSearch.disconnect()
            window.removeEventListener('resize', onWinResize)
        }
    })
</script>

<main>
    <div class="layout">
        <!-- Left column height mirrors right column; content centered -->
        <div class="left-col" bind:this={leftColEl} style={`height:${rightHeight}px`}>
            <!-- SearchBar has natural width -->
            <div class="search-wrap" bind:this={searchWrapEl}>
                <SearchBar />
            </div>

            <!-- Image panel fills remaining space with flexbox -->
            <div class="image-flex-container">
                <ImageDisplay size={squareSize} width={squareSize} />
            </div>
        </div>

        <!-- Right column (unchanged logic) -->
        <div class="right-col" bind:this={rightColEl}>
            <div class="top">
                <Clock />
                <Stats />
            </div>
            <div class="widgets">
                <Weather />
                <Todoist />
            </div>
            <Links />
        </div>
    </div>

    <button
        class="settings-btn"
        onclick={() => (showSettings = true)}
        aria-label="Open settings"
    >
        settings
    </button>

    <Settings {showSettings} {closeSettings} />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        justify-content: center;
        align-items: center;
    }
    .layout {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
    }
    .left-col,
    .right-col {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        min-height: 0;
    }
    .left-col {
        align-items: center; /* center horizontally */
        justify-content: space-between; /* search at top, image at bottom */
    }
    .top,
    .widgets {
        display: flex;
        gap: 1.5rem;
    }
    .search-wrap {
        flex: 0 0 auto; /* fixed size, don't grow or shrink */
    }
    
    .image-flex-container {
        flex: 1; /* fill remaining space */
        display: flex;
        align-items: flex-end; /* align image panel to bottom */
        justify-content: center; /* center horizontally */
    }
    .settings-btn {
        position: fixed;
        top: 0;
        right: 0;
        padding: 1rem 1.5rem;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 100;
        color: var(--txt-3);
    }
    .settings-btn:hover {
        opacity: 1;
    }
</style>
