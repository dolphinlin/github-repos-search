# Front-end Web Developer Take Home Test

## Script

```shell
# run dev server
yarn start

# build
yarn build
```

## External libs

- axios
  - Promise based HTTP client
- parse-link-header
  - parse Link-Header
- styled-components
  - css in js

## Description

### file

- 將處理 `fetch repo` 所有邏輯封裝在 `useRepos`，讓外部 component 只需要專注於 `setKeyword & next`，且更專注於 Data 呈現，而不必理會關於 API 邏輯。

- 將所有可變參數拉出於 `services/config.ts` 當中， 以便於將來能夠快速的修改。

### mechanism

> 實作一個簡易的 `debounce wrapper`，去避免在 `setKeyword` 的時候會有過於頻繁的 `API call`

> 做出一個 `throttle wrapper`，能夠
