# URL Check tool

Checks a collection of URLs to make sure they all return status 200.

## Setup

Requires a data file, `url.json` which is a simple JSON array of strings, each consisting of a single fully qualified URL which is expected to return a status 200.

```json
[
    "https://www.cancer.gov",
    "https://dceg.cancer.gov",
    "https://www.cancer.gov/about-cancer/treatment/clinical-trials/search"
]
```

## Execution

```
$ npm ci
$ npm start
```
**OR**
```
$ npm ci
$ node index.js
```
