

export function withCacheBustingTimestamp(url) {

    url += (url.indexOf('?') >= 0 ? '&' : '?') + 'dt=' + new Date().getTime();

    return url
}
