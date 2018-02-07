// After
class ExampleComponent extends React.Component {
  // Initialize state in constructor,
  // Or with a property initializer.
  // highlight-next-line
  state = {};

  // highlight-range{1-8}
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        lastRow: nextProps.currentRow,
        isScrollingDown:
          nextProps.currentRow > prevState.lastRow,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }
}
