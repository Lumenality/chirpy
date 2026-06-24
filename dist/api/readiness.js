export function handlerReadiness(req, res) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(res.statusCode === 200 ? "OK" : "NON-OK");
}
