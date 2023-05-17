import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    window.api.toolbox.open();
  });

  return <div>App</div>;
}
