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

> 做出一個 `throttle wrapper`，能夠限讓`API call` 在限定時間內只能被呼叫幾次，超過 `quota` 則會 `pending` 到下一輪刷新時間為止，初期版本是直接指定時間與次數，後來改為拿 `Header` 裡面的 `rate-limit-xxxx` 作為參數，並且增加一次 `retry`，避免第一次呼叫時就超過 `rate-limit`

## page

https://dcard-pretest.web.app/
