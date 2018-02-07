---
title: Update on Async Rendering
author: [bvaughn]
---

For the past few months, the React team has been experimenting with [asynchronous rendering](/blog/2017/09/26/react-v16.0.html#new-core-architecture), and we are very excited about the new features it enables.

Along the way our research has shown that some of our legacy component lifecycles tend to encourage unsafe coding practices. They are:

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

Because of this, we have decided to rename the above lifecycles- (adding an "UNSAFE_" prefix)- in a future release. The plan for this is as follows:

* **16.3**: Introduce aliases for the unsafe lifecycles, `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`, and `UNSAFE_componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release.)
* **16.4**: Enable deprecation warning for `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate`. (Both the old lifecycle names and the new aliases will work in this release.)
* **17.0**: Remove `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` . (Only the new "UNSAFE_" lifecycle names will work in this release.)

In this post, we will explore some of the potential capabilities of async rendering, and we'll outline a migration plan for components that rely on the deprecated lifecycles.

## What can Asynchronous Rendering do?

#### With every new version, our goal is to improve the user experience of apps created with React.

We have been fine-tuning the performance of React with every new release. However, despite what synthetic benchmarks say, we've found that the real bottleneck is generally not React itself, but the application code using it. In order to unlock the next wave of performance optimizations and new features, we need React to be smarter about when to re-render components and flush updates to the screen.

We found that asynchronous rendering can help in several ways. For example:

1. As users navigate within an app, newly displayed components often have asynchronous dependencies (including data, images, and code splitting). This can lead to a "cascade of spinners" as the data loads. We'd like to make it easier for product developers to express asynchronous dependencies of components- keeping the old UI "alive" for a certain period while the new UI is not "ready" yet. React could render this new UI in the background and provide a declarative way to show a spinner if it takes more than a second.
2. Fast updates within a short timeframe often cause jank because React processes each update individually. We'd like to automatically "combine" updates within a few hundred milliseconds when possible so that there is less re-rendering.
3. Some updates are inherently "less important" than others. For example, if you're writing a live-updating search filter input like [this](https://zeit.co/blog/domains-search-web#asynchronous-rendering), it is essential that the input is updated immediately (within a few milliseconds). Re-rendering the result list can be done later, and should not block the thread or cause stutter when typing. It would be nice if React had a way to mark the latter updates as having a "lower priority".
4. For UI elements like hidden popups and tabs, we'd like to be able to start pre-rendering their content when the browser isn't busy. This way, they can appear instantaneously in response to a later user interaction. However, we don't want to make the initial rendering slower, so it's essential to render such elements lazily ([when the browser is idle](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)).
5. For many apps, React is not the only JavaScript on the page. It often has to coordinate with other JS libraries, server-rendered widgets, and so on. Asynchronous rendering lets React better coordinate with non-React code regarding when components are inserted into the DOM so that [the user experience is smooth](https://twitter.com/acdlite/status/909926793536094209).

Of course, it's possible to implement some of these features today, but it's difficult. We hope to make them effortless by building them into React itself. By replacing problematic lifecycles with safer alternatives, we also hope to make it simple to write async-safe React components.

In the next section, we'll look at how to update your existing components to prepare for the upcoming lifecycle changes.

## Updating class components

#### If you're an application developer, **you don't have to do anything about the deprecated methods yet**. The primary purpose of this release is to enable OSS maintainers to update their libraries in advance of any deprecation warnings. (Those warnings will be enabled with the next minor release, version 16.4.)

However, if you'd like to start using the new component API (or if you're a maintainer looking to update your library in advance) here are a few examples that we hope will help you to start thinking about components a bit differently. Over time, we plan to add additional “recipes” to our documentation that show how to perform common tasks in a way that's async-safe.

### Initializing state

This example shows a component with `setState` calls inside of `componentWillMount`:
`embed:update-on-async-rendering/initializing-state-before.js`

The simplest refactor for this type of component is to move the state-updates to the constructor or to a property initializer, like so:
`embed:update-on-async-rendering/initializing-state-after.js`

### Fetching external data

Here is an example of a component that uses `componentWillMount` to fetch external data::
`embed:update-on-async-rendering/fetching-external-data-before.js`

The upgrade path for this is just to move data-fetching into `componentDidMount`:
`embed:update-on-async-rendering/fetching-external-data-after.js`

> **Note**
>
> Some advanced use-cases (e.g. libraries like Relay) may want to experiment with eagerly prefetching async data. An example of how this can be done is available [here](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).

### Adding event listeners (or subscriptions)

Here is an example of a component that subscribes to an external event dispatcher when mounting:
`embed:update-on-async-rendering/adding-event-listeners-before.js`

Unfortunately, this can cause memory leaks in async mode since rendering might be interrupted before it is committed. (In that case, `componentWillUnmount` might not be called.) The solution is to use the `componentDidMount` lifecycle instead:
`embed:update-on-async-rendering/adding-event-listeners-after.js`

> **Note**
>
> This potential memory leak is not specific to async. The example shown above would also cause problems when rendering a component to a string.

### Updating `state` based on `props`

Here is an example of a component that uses the legacy `componentWillReceiveProps` lifecycle to update `state` based on new `props` values:
`embed:update-on-async-rendering/updating-state-from-props-before.js`

As of version 16.3, this can be done with the new `static getDerivedStateFromProps` lifecycle:
`embed:update-on-async-rendering/updating-state-from-props-after.js`

> **Note**
>
> That the [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill allows this new lifecycle to be used with older versions of React as well.

### Invoking external callbacks

Here is an example of a component that calls an external function when its internal state changes:
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

This would not be safe to do in async mode, because the external callback might get called multiple times for a single update. Instead, the `componentDidUpdate` lifecycle should be used:
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

## OSS maintainers

If you're an open source maintainer, you might be asking yourself what these changes mean for your library. If you implement the above suggestions, what happens with components that depend on the new static `getDerivedStateFromProps` lifecycle? Do you also have to release a new major version that drops compatibility for React 16.2 and older?

Fortunately, you do not!

Along with the release of 16.3, we've also released a new NPM package, [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat). This package polyfills components so that the new `getDerivedStateFromProps` lifecycle will also work with older versions of React (0.14.9+).

To use this polyfill, first add it as a dependency to your library:

```bash
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save
```

Next, update your component(s) to use the new static lifecycle, `getDerivedStateFromProps`, as described above.

Lastly, use the polyfill to make your component backwards compatible with older versions of React:
`embed:update-on-async-rendering/using-react-lifecycles-compat.js`

## The StrictMode component

`StrictMode` is a tool for highlighting potential problems in an application. Like `Fragment`, `StrictMode` does not render any visible UI. It simply activates additional checks and warnings for its descendants.

> **Note**
>
> These checks are run in development mode only; **they do not impact the production build**.

You can enable strict mode for any part of your application. For example:
`embed:update-on-async-rendering/enabling-strict-mode.js`

In the above example, strict mode checks will *not* be run against the `Header` and `Footer` components. However, `RouteOne` and `RouteTwo`, as well as all of their descendants, will have the checks.

In version 16.3, `StrictMode` helps with:
* Identifying components with unsafe lifecycles
* Warning about legacy string ref API usage
* Detecting unexpected side effects

Additional functionality will be added with future releases of React.

### Identifying unsafe lifecycles

As previously mentioned, certain legacy lifecycle methods are unsafe for use in async React applications. However, if your application uses third party libraries, it can be difficult to ensure that these lifecycles aren't being used. Fortunately, strict mode can help with this!

When strict mode is enabled, React compiles a list of all class components using the unsafe lifecycles, and logs a warning message with information about these components, like so:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Addressing the issues identified by strict mode _now_ will make it easier for you to take advantage of async rendering in future releases of React.

### Detecting unexpected side effects

As a general rule, side-effects should be avoided in certain class component methods (e.g. the `constructor`, `render`, etc). This is because React may invoke these methods more than once before committing, or it may invoke them without committing at all (because of an error or a higher priority interruption). Ignoring this rule can lead to a variety of problems, including memory leaks and invalid state. Unfortunately, it can be difficult to detect these problems as they are often non-deterministic.

Strict mode can't detect side effects for you, but it can help you spot them by making them a little more deterministic. This is done by intentionally double-invoking the following methods:

* Class component `constructor` method
* The `render` method
* `setState` updater functions
* The static `getDerivedStateFromProps` lifecycle

> **Note**:
>
> This only applies to development mode. **Lifecycles will not be double-invoked during production mode.**

For example, consider the following code:
`embed:update-on-async-rendering/side-effects-in-constructor.js`

At first glance, this code might not seem problematic. But if `SharedApplicationState.recordEvent` is not idempotent, then instantiating this component multiple times could lead to invalid application state. This sort of subtle bug might not manifest during development, or it might do so inconsistently and so be overlooked.

By intentionally double-invoking methods like the component constructor, strict mode makes patterns like this easier to spot.
