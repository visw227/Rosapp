

export function withCacheBustingTimestamp(url) {

    url += (url.indexOf('?') >= 0 ? '&' : '?') + '__dt=' + new Date().getTime();

    return url
}
