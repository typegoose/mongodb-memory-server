This sub-module is inspired by `get-port`, which started shipping ESM-only builds and we werent able to upgrade yet, also to address memory leaks (not using intervals or timeouts)

The probe binds to the address the instance will bind to (`instance.ip`, default `127.0.0.1`): a wildcard probe does not conflict with a listener bound to a specific address, so it could report as free the port of a running instance.
