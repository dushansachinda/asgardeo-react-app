# Dev Server Ports
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) version `>=12.0.0` is required. ([Inquirer.js](https://github.com/SBoudrias/Inquirer.js) version used in the isn't compatible with lower node versions.)

## API Reference

### `findPort`

```js
import { findPort } from "dev-server-ports";

findPort(hostname: string, prefferedPort: string);
```

#### Returns

A `Promise` of type `number`.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.brionmario.com/"><img src="https://avatars.githubusercontent.com/u/25959096?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brion Mario</b></sub></a><br /><a href="https://github.com/Brion Mario/dev-server-ports/commits?author=brionmario" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
