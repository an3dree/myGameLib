export default function handlePlatformBoxColor(platformSlug: string): string {
    let boxColor = '';

    switch (platformSlug) {
        case 'pc':
            return '#0000FF'
        case 'playstation5':
            return '#003791'
        case 'playstation4':
            return '#003791'
        case 'xbox-one':
            return '#107C10'
        case 'xbox-series-x':
            return '#107C10'
        case 'nintendo-switch':
            return 'red'
        case 'nintendo-3ds':
            return '#D12228'
        case 'nintendo-ds':
            return '#D12228'
        case 'nintendo-dsi':
            return '#D12228'
        case 'wii-u':
            return '#009AC7'
        case 'wii':
            return '#D12228'

        default:
            break;
    }

    return boxColor;
}