---
title: React リファレンス概要
---

<Intro>

このセクションは React で開発をする際の詳細なリファレンスドキュメントです。React の使い方の概要については [Learn](/learn) セクションをご覧ください。

</Intro>

React リファレンスは機能別にいくつかのサブセクションに分かれています。

## React {/*react*/}

プログラムから利用する React の機能です。

* [フック](/reference/react/hooks) - コンポーネント内から使用する様々な React の機能
* [コンポーネント](/reference/react/components) - JSX 内で用いる組み込みコンポーネント
* [API](/reference/react/apis) - コンポーネントの定義に用いる API
* [ディレクティブ](/reference/react/directives) - React Server Components 互換のバンドラに与えるための指示情報

## React DOM {/*react-dom*/}

React DOM には（ブラウザの DOM 環境で動作する）ウェブアプリケーションでのみ用いられる機能が含まれます。以下のセクションに分かれています。

* [フック](/reference/react-dom/hooks) - ブラウザの DOM 環境で実行されるウェブアプリケーションのためのフック
* [コンポーネント](/reference/react-dom/components) - React がサポートする組み込みの HTML および SVG コンポーネント
* [API](/reference/react-dom) - ウェブアプリケーションでのみ用いられる `react-dom` パッケージのメソッド
* [クライアント API](/reference/react-dom/client) - クライアント（ブラウザ）で React コンポーネントをレンダーするための `react-dom/client` API 群
* [サーバ API](/reference/react-dom/server) - サーバで React コンポーネントを HTML にレンダーするための `react-dom/server` API 群

## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## レガシー API {/*legacy-apis*/}

* [レガシー API](/reference/react/legacy) - `react` パッケージからエクスポートされているが新しいコードでは使用が推奨されないもの
