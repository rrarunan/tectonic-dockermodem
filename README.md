# tectonic-dockermodem

A dockermodem driver for [tectonic](https://github.com/tonyhb/tectonic).

# Usage

Basic usage:

```js
const manager = new Manager({
  drivers: {
    // assuming env vars are set: DOCKER_HOST, DOCKER_CERT_PATH etc.
    fromDockerModem: new TectonicDockerModem({})
});
```

Customization - all keys are optional and governed by [docker-modem](https://github.com/apocas/docker-modem).

```js
const manager = new Manager({
  drivers: {
    fromDockerModem: new TectonicDockerModem({
      host: '192.168.99.100',
      port: process.env.DOCKER_PORT || 2376,
      ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
      cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
      key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
	  })
  }
});

// get a list of services (assuming you have a model setup for docker services)
manager.fromDockerModem([
  {
    returns: models.Service.list(),
    params: ['ID'],
    meta: {
      url: '/services'
    }
  }
])

```
