let defaultSettings = {
    timeFormat: '12hr',
    todoistApiToken: '',
    latitude: null,
    longitude: null,
    tempUnit: 'fahrenheit',
    speedUnit: 'mph',
    linksPerColumn: 4,
    links: [
        { title: 'classroom', url: 'https://classroom.google.com' },
        { title: 'mail', url: 'https://mail.google.com' },
        { title: 'drive', url: 'https://drive.google.com' },
        { title: 'docs', url: 'https://docs.google.com' },
        { title: 'spotify', url: 'https://open.spotify.com' },
        { title: 'github', url: 'https://github.com' },
        { title: 'blank', url: 'https://blank.page' },
        { title: 'chatgpt', url: 'https://chatgpt.com/' },
        { title: 'unbound', url: 'https://unbound.t3rm1n4l.dev' },
        { title: 'pstream', url: 'https://pstream.mov/' },
        { title: 't3rm1n4l', url: 'https://t3rm1n4l.dev' },
        { title: 'discord', url: 'https://discord.com' },
        { title: 'youtube', url: 'https://youtube.com' },
        { title: 'reddit', url: 'https://reddit.com' },
        { title: 'twitter', url: 'https://x.com' },
        { title: 'mocha', url: 'https://mocha.t3rm1n4l.dev' },
    ],
}

function loadSettings() {
    try {
        const stored = localStorage.getItem('settings')
        if (stored) {
            const parsed = JSON.parse(stored)
            return { ...defaultSettings, ...parsed }
        }
    } catch (error) {
        console.error('failed to load settings from localStorage:', error)
    }

    return defaultSettings
}

export function saveSettings(settings) {
    try {
        localStorage.setItem('settings', JSON.stringify(settings))
    } catch (error) {
        console.error('failed to save settings to localStorage:', error)
    }
}

export const settings = $state(loadSettings())
