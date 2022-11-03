import React from "react";
import ReactJson from "@dioxide-js/react-json-view";

import "./style.css";

const { useEffect, useState } = React;

export const Home = () => {
  return (
    <div className="ui-color-regular">
      <ReactJson
        src={PREDA_VIZ_LOG}
        style={{ background: "none" }}
        displayObjectSize={false}
        enableClipboard={false}
        displayDataTypes={false}
        name={false}
        theme="chalk"
      />
    </div>
  );
};
