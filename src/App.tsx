import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import * as FlexLayout from "flexlayout-react";
import "flexlayout-react/style/dark.css";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ts from "typescript";
import example from "./example?raw";

const model = FlexLayout.Model.fromJson({
  global: {
    tabEnableClose: false,
    tabEnableRename: false,
    tabSetEnableMaximize: false,
  },
  borders: [],
  layout: {
    type: "row",
    children: [
      {
        type: "tabset",
        children: [{ type: "tab", name: "input", component: "input" }],
      },
      {
        type: "tabset",
        children: [{ type: "tab", name: "output", component: "output" }],
      },
    ],
  },
});

const App = () => {
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  useEffect(() => {
    model.doAction(
      FlexLayout.Actions.updateModelAttributes({
        rootOrientationVertical: isPortrait,
      })
    );
  }, [isPortrait]);

  const [code, setCode] = useState(example);

  const factory = (node: FlexLayout.TabNode) => {
    const { width, height } = node.getRect();
    switch (node.getComponent()) {
      case "input": {
        return (
          <CodeMirror
            width={`${width}px`}
            height={`${height}px`}
            theme="dark"
            extensions={[javascript({ jsx: true, typescript: true })]}
            onChange={(value) => {
              setCode(value);
            }}
            value={code}
          />
        );
      }
      case "output": {
        return (
          <pre>
            <code>
              {
                ts.transpileModule(code, {
                  compilerOptions: {
                    module: ts.ModuleKind.ESNext,
                    jsx: ts.JsxEmit.React,
                  },
                }).outputText
              }
            </code>
          </pre>
        );
      }
    }
  };

  return <FlexLayout.Layout model={model} factory={factory} />;
};

export default App;
