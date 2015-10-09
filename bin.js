#!/usr/bin/env node

var lookup = require('./')

if (!process.argv[2]) {
  console.log('Usage: lookup-multicast-dns [name]')
  process.exit(1)
}

lookup(process.argv[2], function (err, ip) {
  if (err) throw err
  console.log(ip)
})
