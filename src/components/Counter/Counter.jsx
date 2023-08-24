import React, { useState } from "react";

import { Button } from "components";
import PropTypes from "prop-types";

const Counter = ({ limit = null }) => {
  const [count, setCount] = useState(0);
  const isLimitReached = count === limit;

  return (
    <div className="counter">
      <h3>Counter: {count}</h3>
      <Button
        onClick={() => {
          if (isLimitReached) return;
          setCount(count + 1);
        }}
      >
        Increment
      </Button>
      <Button
        onClick={() => {
          setCount(count - 1);
        }}
      >
        Decrement
      </Button>
      {isLimitReached && <span>You reached the limit!</span>}
    </div>
  );
};

Counter.propTypes = {
  limit: PropTypes.number,
};

export default Counter;
