// import { useRef, useState } from "react";
// import { Box, HStack } from "@chakra-ui/react";
// import { Editor } from "@monaco-editor/react";
// import LanguageSelector from "./LanguageSelector";
// import { CODE_SNIPPETS } from ".../constants";
// import Output from "./Output";
// import './appbox.css';


// const CodeEditor = () => {
//   const editorRef = useRef();
//   const [value, setValue] = useState("");
//   const [language, setLanguage] = useState("javascript");

//   const onMount = (editor) => {
//     editorRef.current = editor;
//     editor.focus();
//   };

//   const onSelect = (language) => {
//     setLanguage(language);
//     setValue(CODE_SNIPPETS[language]);
//   };

//   return (
//     <Box >
//       <div className="appBox" spacing={4}>
//         <div className="codeDiv">
//           <Box h="50%" w="100% ">
//             <LanguageSelector language={language} onSelect={onSelect} />
//             <Editor className="editor"
//               options={{
//                 minimap: {
//                   enabled: false,
//                 },
//               }}
//               height="75vh"
//               theme="vs-dark"
//               language={language}
//               defaultValue={CODE_SNIPPETS[language]}
//               onMount={onMount}
//               value={value}
//               onChange={(value) => setValue(value)}
//             />
//           </Box>
//         </div>
//         <div className="outputDiv">
//           <Output editorRef={editorRef} language={language} />
//         </div> 
//       </div>
//     </Box>
//   );
// };
// export default CodeEditor;


// codeEditor.jsx

import { useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../constants";
import Output from "./Output";
import './appbox.css';

const CodeEditor = ({ language, setLanguage, value, setValue, onSelect }) => {
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Box>
      <div className="appBox" spacing={4}>
        <div className="codeDiv">
          <Box h="50%" w="100%">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              className="editor"
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              height="75vh"
              theme="vs-dark"
              language={language}
              value={value}
              onMount={onMount}
              onChange={(newValue) => setValue(newValue)}
            />
          </Box>
        </div>
        <div className="outputDiv">
          <Output editorRef={editorRef} language={language} />
        </div>
      </div>
    </Box>
  );
};

export default CodeEditor;
