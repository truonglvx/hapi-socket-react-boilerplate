import React from 'react';
import PropTypes from 'prop-types';

import calculateTimeDifference from './../../../shared/helpers/timeHelper';

class Todo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      elapsed: props.entry.displayDate ? props.entry.displayDate : '',
    };

    this.tick = this.tick.bind(this);
  }

  /* istanbul ignore next */
  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  /* istanbul ignore next */
  tick() {
    this.setState({
      elapsed: calculateTimeDifference(this.props.entry.timestamp),
    });
  }

  render() {
    return (
      <div className="todo-tile">
        <h2>{this.props.entry.title}</h2>
        <p className="text">{this.props.entry.body}</p>
        <span className="text">{this.state.elapsed}</span>
      </div>
    );
  }
}

Todo.propTypes = {
  entry: PropTypes.object.isRequired,
};

export default Todo;
