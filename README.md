# es-modulesify

browserify transform to transpile CommonJS modules to ES modules

because **browserify-compatible CommonJS modules are statically analyzable**

```shell
npm install --save ahdinosaur/es-modulesify
```

_work in progress_

- [x] transpile require calls
- [ ] transpile module exports assignments

## how it works

parse source code into abstract-syntax tree and walk the nodes.

if node is require call,

  and if node is part of a top-level variable declaration, replace with import

  or if node is part of something else, replace with variable to top-level import.

if node is module exports assignment,

  and value is object, export variables by key

  or value is another type, export default value

## usage

TODO need to make this work

```shell
browserify ./ -g es-modulesify -g rollupify
```

## license

The Apache License

Copyright &copy; 2016 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
