import React, { useState } from "react";
import { Link } from "react-router-dom";

const LearnMore = (props) => {
  const [id] = useState(props.id);

  return (
    <Link to={(location) => `/${id}`}>
      <u>More Details</u>
    </Link>
  );
};

export default LearnMore;
