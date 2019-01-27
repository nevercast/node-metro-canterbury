const http = require('http')
const url = require('url')
const {JSDOM} = require('jsdom')
const assert = require('assert')
const _unescape = require('unescape')
const querystring = require('querystring')
_unescape.extras['&nbsp;'] = ' '

const URL = 'http://rtt.metroinfo.co.nz/rtt/public/RoutePositionET.aspx'
const sanitize = text => _unescape(text, 'all').trim()

async function post(urlString, data) {
    const urlObj = url.parse(urlString)
    const postString = querystring.stringify(data)
    const requestOpt = {
        hostname: urlObj.hostname,
        path: urlObj.path,
        port: urlObj.port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postString)
        }
    }
    return new Promise((res, rej) => {
        const request = http.request(requestOpt, msg => {
            const failure = msg.statusCode >= 400;
            if (failure) {
                rej(`Request to ${msg.url} failed with HTTP ${msg.statusCode}: ${msg.statusMessage}`)
            } else {
                var response = ''
                msg
                .on('data', chunk => response += chunk)
                .on('end', () => res(response))
                .setEncoding('utf8')
            }
        })
        .on('error', rej);

        request.write(postString, err => {
            if (err) return rej(err)
            request.end()
        })
    })
}

async function platformQuery(platformNumber) {
    return post(URL, {PlatformTag: platformNumber})
}

async function platformEta(platformNumber) {
    return platformQuery(platformNumber)
    .then(utf8Content => new JSDOM(utf8Content))
    .then(dom => {
        const document = dom.window.document;
        const a_etTables = document.getElementsByClassName('tableET')
        assert(a_etTables.length == 1, `Expected 1 ETA Timetable, got: ${a_etTables.length}`)
        const etTable = a_etTables[0];
        const arrivals = Array.from(etTable.getElementsByTagName('tr'))
        assert(arrivals.length >= 1, `Expected at least 1 table row`)
        const a_headers = Array.from(arrivals.shift().getElementsByTagName('th')).map(thElm => sanitize(thElm.textContent))
        assert(a_headers.length == 3, `Expected 3 columns, got ${a_headers.length}`)
        assert(a_headers[0] == 'Rte', `Expected first column to equal "Rte", got: ${a_headers[0]}`)
        assert(a_headers[1] == 'Destination', `Expected second column to equal "Destination ", got: ${a_headers[1]}`)
        assert(a_headers[2] == 'ETA', `Expected third column to equal "ETA", got: ${a_headers[2]}`)
        return arrivals.map(arrivalRow => {
            let [route, destination, eta] = 
                (
                    Array.from(arrivalRow.getElementsByTagName('td'))
                    .map(tdElement => sanitize(tdElement.lastChild.textContent))
                )
            return {
                route,
                destination,
                eta
            }
        })    
    })
}

module.exports = {
    platformEta: platformEta
}