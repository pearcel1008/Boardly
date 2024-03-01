# fastapi

---

## Introduction

Fastapi is a simple command-line utility that allows you to create an [Express](https://expressjs.com/)-based server based off of a single configuration file. It's useful for quickly spinning up mock APIs, among other things.

## Getting Started

Install the `fastapi` command-line utility via `npm i -g fastapi`. Next, create a configuration file like the one we see here.

``` javascript
// config.js
module.exports = {
	// A unique ID for this API
	'id': 'my-api',
	// The port on which Express is to listen
    'port': 7050,
    // Whether or not to log incoming requests to the console (default: true)
    'log': true,
    'routes': {
        '/api/v1/ping': {
            'get': (req, res, next) => {
                return res.send('pong');
            }
        }
    }
};
```

Next, launch your server as shown below.

```
$ fastapi -c ./config.js
```

## Defining Multiple APIs

A configuration file can define multiple APIs by exporting an array of configuration objects, like we see here.

```
module.exports = [
    {
        'id': 'api1',
        'port': 7050,
        'log': true,
        'routes': {
            '/api/v1/ping': {
                'get': (req, res, next) => {
                    return res.send('pong');
                }
            }
        }
    },
    {
        'id': 'api2',
        'port': 7051,
        'log': true,
        'routes': {
            '/api/v1/foo': {
                'get': (req, res, next) => {
                    return res.send('bar');
                }
            }
        }
    }
];
```

## Related Resources

- [Express](https://expressjs.com/)