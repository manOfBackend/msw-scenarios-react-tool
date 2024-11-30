# @msw-scenarios/react-ui

A React UI library designed to make using [msw-scenarios](https://github.com/manOfBackend/msw-scenarios) in your React projects easier and more efficient.

## Introduction

`@msw-scenarios/react-ui` is a companion library for `msw-scenarios`, aimed at simplifying the usage of `msw` in React environments. If you are using `msw` to handle mock data in your project, this library can help alleviate the complexity of managing numerous mock data scenarios and interactions.

By integrating `@msw-scenarios/react-ui`, you can easily set up and modify mock data directly from your React components, making the process of handling different mock scenarios seamless and much more developer-friendly.

## Features

- Effortless integration with `msw-scenarios` for React applications.
- Simplifies the management of mock data and reduces the complexity of testing.
- Helps you quickly switch between different mock scenarios, improving productivity and flexibility during development.

## Installation

You can install `@msw-scenarios/react-ui` using npm or yarn:

```sh
npm install @msw-scenarios/react-ui
```

or

```sh
yarn add @msw-scenarios/react-ui
```

## Usage

> Note: This library requires React 18 or later.

To use `@msw-scenarios/react-ui`, simply import it into your project and declare `<MSWScenariosReactTool />` in your React main file.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { MSWScenariosReactTool } from '@msw-scenarios/react-ui'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MSWScenariosReactTool />
    <App />
  </React.StrictMode>
)
```

This library works seamlessly with `msw-scenarios`, helping you handle complex mock data workflows without hassle.

## License

This project is licensed under the MIT License.
