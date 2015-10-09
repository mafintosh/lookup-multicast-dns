# lookup-multicast-dns

Lookup an ip for a hostname using multicast-dns if it is a .local domain or otherwise use the dns module

```
npm install lookup-multicast-dns
```

OSX supports resolving .local domains using mdns per default but unfortunately not
all other platforms have as good support for it. On Ubuntu you currently have to install and run the avahi-daemon
which is why I wrote this module that allows you to always resolve them from javascript without relying on os support.

## Usage

``` js
var lookup = require('lookup-multicast-dns')

lookup('google.com', function (err, ip) {
  console.log(ip) // is resolved using normal dns (173.194.116.32 on my machine)
})

lookup('brunhilde.local', function (err, ip) {
  console.log(ip) // is resolved using multicast-dns (192.168.10.254 on my machine)
})
```

If you want the node core dns module to always support multicast-dns you can do the following

``` js
require('lookup-multicast-dns/global')

// core dns now always support resolving .local domains
var dns = require('dns')

dns.lookup('brunhilde.local', function (err, ip) {
  console.log(ip) // is resolved using multicast-dns (192.168.10.254 on my machine)
})
```

## Command line tool

There is also a command line tool available if you install globally

```
npm install -g lookup-multicast-dns
lookup-multicast-dns brunhilde.local
> 192.168.10.254
```

## Related

Use [register-multicast-dns](https://github.com/mafintosh/register-multicast-dns) to register a `.local` domain
on another machine.

On one machine (let's pretend it has ip 192.168.10.456)

``` js
var register = require('register-multicast-dns')
register('hello-world.local')
```

On another

``` js
var lookup = require('lookup-multicast-dns')
lookup('hello-world.local', function (err, ip) {
  console.log(ip) // would print 192.168.10.456
})
```

## License

MIT
