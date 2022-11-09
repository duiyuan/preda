import React from "react";
import ReactJson from "@dioxide-js/react-json-view";
import json from "json-bigint";

import "./style.css";

const { useEffect, useState } = React;

export const Home = () => {
  return (
    <div className="ui-color-regular">
      <div className="invoke_context">{json.stringify(BuildContext)}</div>
      <ReactJson
        src={PREDA_VIZ_LOG}
        style={{ background: "none" }}
        displayObjectSize={false}
        enableClipboard={false}
        displayDataTypes={false}
        displayArrayKey={false}
        collapsed={2}
        name={false}
        theme="chalk"
      />
    </div>
  );
};
