var dns = require('dns')
var mdns = require('multicast-dns')

var dnsLookup = dns.lookup.bind(dns)

module.exports = lookup

function lookup (host, type, cb) {
  if (typeof type === 'function') return lookup(host, 4, type)
  if (!/\.local$/.test(host)) dnsLookup(host, type, cb)
  else mdnsLookup(host, type, cb)
}

function mdnsLookup (host, type, cb) {
  var socket = mdns()
  var recordType = type === 6 ? 'AAAA' : 'A'
  var tries = 0

  socket.on('response', function (response) {
    for (var i = 0; i < response.answers.length; i++) {
      var a = response.answers[i]
      if (a.name === host && a.type === recordType) {
        cleanup()
        cb(null, a.data, recordType === 'A' ? 4 : 6)
      }
    }
  })

  var interval = setInterval(query, 1000)
  query()

  function cleanup () {
    socket.destroy()
    clearInterval(interval)
  }

  function query () {
    if (++tries < 5) return socket.query([{type: recordType, name: host}])
    cleanup()
    cb(new Error('Query timed out'))
  }
}
