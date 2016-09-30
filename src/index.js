'use strict';

const DockerModem = require('docker-modem').default;

// Following ENV vars are supported (docker-modem dep)
// DOCKER_HOST - e.g. tcp://localhost:2376 (optional)
// DOCKER_TLS_VERIFY - '1' (optional)
// DOCKER_CERT_PATH - Provide cert path of the host for TLS and https based server auth (optional)

// This tectonic driver allows
// opts.request (request transformer)
// opts.onError (onError callback)

// Users can pass the following options as well
// 1. authConfig [ string || object{ key: string } || object{ base64: string }]
// 2. registryConfig [ string || object{ base64: string } ]
// 3. file [ string ]
// 4. hijack [ boolean ]

// TectonicDockerModem is a class which, when constructed, returns a standard
// tectonic driver function
export default class TectonicDockerModem {

  constructor(opts = {}) {

    const dm = new DockerModem(opts);

    const mergeOptions = ({ params, body }) => {
      const options = {};
      for (let attrParam in params) { options[attrParam] = params[attrParam]; }
      if (body) {
        for (let attrBody in body) { options[attrBody] = body[attrBody]; }
      }
      return options;
    }

    const driverFunc = (sourceDef, query, success, fail) => {
      let {
        meta: { url, transform, method, headers, request }
      } = sourceDef;

      // Query has `params` for query parameters and `body` for POST/UPDATE bodies

      // Normalize method type
      method = method ? method.toUpperCase() : 'GET';

      // Create a new request
      const options = {
        //docker-modem
        path: url,
        method,
        headers,
        options: mergeOptions(query)
      };

      const cb = (err, res) => {
        // If this errored call fail
        if (err !== null) {

          // Pass the error into the global onError handler if it exists
          if (opts.onError) {
            opts.onError(err, res);
          }

          return fail(err, res);
        }

        if (transform) {
          return success(transform(res.body), res);
        }

        return success(res.body, res);
      }

      if (opts.request) {
        r = opts.request(r);
      }

      // When constructing the driver if we were passed a request transformer
      // use it

      // Similarly, if there's a meta.request parameter we should use it to
      // transform the request for this particular source only
      if (typeof request === 'function') {
        r = request(r);
      }

      //Options is the object that has query parameters and
      dm.dial(options, cb);
    }

    return driverFunc;
  }
}
