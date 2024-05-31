// import { useEffect, useState, useRef } from "react";
// import AceEditor from "react-ace";
// import { Toaster, toast } from 'react-hot-toast';
// import { useNavigate, useParams } from "react-router-dom";
// import { generateColor } from "../../utils";
// import './Room.css'

// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-typescript";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/mode-yaml";
// import "ace-builds/src-noconflict/mode-golang";
// import "ace-builds/src-noconflict/mode-c_cpp";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/mode-css";

// import "ace-builds/src-noconflict/keybinding-emacs";
// import "ace-builds/src-noconflict/keybinding-vim";

// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/ext-language_tools";
// import "ace-builds/src-noconflict/ext-searchbox";

// export default function Room({ socket }) {
//   const navigate = useNavigate()
//   const { roomId } = useParams()
//   const [fetchedUsers, setFetchedUsers] = useState(() => [])
//   const [fetchedCode, setFetchedCode] = useState(() => "")
//   const [language, setLanguage] = useState(() => "javascript")
//   const [codeKeybinding, setCodeKeybinding] = useState(() => undefined)
//   const [timerRunning, setTimerRunning] = useState(false);
//   const [timerDuration, setTimerDuration] = useState(0);
//   const timerIntervalRef = useRef(null);

//   const languagesAvailable = ["javascript", "java", "c_cpp", "python", "typescript", "golang", "yaml", "html"]
//   const codeKeybindingsAvailable = ["default", "emacs", "vim"]

//   function onChange(newValue) {
//     setFetchedCode(newValue)
//     socket.emit("update code", { roomId, code: newValue })
//     socket.emit("syncing the code", { roomId: roomId })
//   }

//   function handleLanguageChange(e) {
//     setLanguage(e.target.value)
//     socket.emit("update language", { roomId, languageUsed: e.target.value })
//     socket.emit("syncing the language", { roomId: roomId })
//   }

//   function handleCodeKeybindingChange(e) {
//     setCodeKeybinding(e.target.value === "default" ? undefined : e.target.value)
//   }

//   function handleLeave() {
//     socket.disconnect()
//     !socket.connected && navigate('/', { replace: true, state: {} })
//   }

//   function copyToClipboard(text) {
//     try {
//       navigator.clipboard.writeText(text);
//       toast.success('Room ID copied')
//     } catch (exp) {
//       console.error(exp)
//     }
//   }

//   function startTimer() {
//     if (!timerRunning) {
//       setTimerRunning(true);
//       timerIntervalRef.current = setInterval(() => {
//         setTimerDuration(prev => prev + 1);
//       }, 1000);
//     }
//   }

//   function pauseTimer() {
//     if (timerRunning) {
//       clearInterval(timerIntervalRef.current);
//       setTimerRunning(false);
//     }
//   }

//   function stopTimer() {
//     clearInterval(timerIntervalRef.current);
//     setTimerRunning(false);
//     setTimerDuration(0);
//   }

//   function formatTime(duration) {
//     const hours = Math.floor(duration / 3600);
//     const minutes = Math.floor((duration % 3600) / 60);
//     const seconds = duration % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   }

//   useEffect(() => {
//     socket.on("updating client list", ({ userslist }) => {
//       setFetchedUsers(userslist)
//     })

//     socket.on("on language change", ({ languageUsed }) => {
//       setLanguage(languageUsed)
//     })

//     socket.on("on code change", ({ code }) => {
//       setFetchedCode(code)
//     })

//     socket.on("new member joined", ({ username }) => {
//       toast(`${username} joined`)
//     })

//     socket.on("member left", ({ username }) => {
//       toast(`${username} left`)
//     })

//     const backButtonEventListner = window.addEventListener("popstate", function (e) {
//       const eventStateObj = e.state
//       if (!('usr' in eventStateObj) || !('username' in eventStateObj.usr)) {
//         socket.disconnect()
//       }
//     });

//     return () => {
//       window.removeEventListener("popstate", backButtonEventListner)
//       clearInterval(timerIntervalRef.current);
//     }
//   }, [socket])

//   return (
//     <div className="room">
//       <div className="roomSidebar">
//         <div className="roomSidebarUsersWrapper">
//           <div className="languageFieldWrapper">
//             <select className="languageField" name="language" id="language" value={language} onChange={handleLanguageChange}>
//               {languagesAvailable.map(eachLanguage => (
//                 <option key={eachLanguage} value={eachLanguage}>{eachLanguage}</option>
//               ))}
//             </select>
//           </div>

//           <div className="languageFieldWrapper">
//             <select className="languageField" name="codeKeybinding" id="codeKeybinding" value={codeKeybinding} onChange={handleCodeKeybindingChange}>
//               {codeKeybindingsAvailable.map(eachKeybinding => (
//                 <option key={eachKeybinding} value={eachKeybinding}>{eachKeybinding}</option>
//               ))}
//             </select>
//           </div>

//           <p>Connected Users:</p>
//           <div className="roomSidebarUsers">
//             {fetchedUsers.map((each) => (
//               <div key={each} className="roomSidebarUsersEach">
//                 <div className="roomSidebarUsersEachAvatar" style={{ backgroundColor: `${generateColor(each)}` }}>{each.slice(0, 2).toUpperCase()}</div>
//                 <div className="roomSidebarUsersEachName">{each}</div>
//               </div>
//             ))}
//             <br></br>
             

//           </div>
//         </div>

//         <div className="timerdiv">
//           <div className="timer">
//             <button className="startbutton" onClick={startTimer}>Start</button>
//             <button className="stopbutton" onClick={pauseTimer}>Stop</button>
//             <button className="resetbutton" onClick={stopTimer}>Reset</button>
//             <div className="timerDisplay">{formatTime(timerDuration)}</div>
//           </div>
//         </div>
//         <button className="roomSidebarCopyBtn" onClick={() => { copyToClipboard(roomId) }}>Copy Room id</button>
//         <button className="roomSidebarBtn" onClick={() => {
//           handleLeave()
//         }}>Leave</button>
//       </div>

//       <AceEditor
//           placeholder="Write your code here."
//           className="roomCodeEditor"
//           mode={language}
//           keyboardHandler={codeKeybinding}
//           theme="monokai"
//           name="collabEditor"
//           width="auto"
//           height="auto"
//           value={fetchedCode}
//           onChange={onChange}
//           fontSize={15}
//           showPrintMargin={true}
//           showGutter={true}
//           highlightActiveLine={true}
//           enableLiveAutocompletion={true}
//           enableBasicAutocompletion={false}
//           enableSnippets={false}
//           wrapEnabled={true}
//           tabSize={2}
//           editorProps={{
//             $blockScrolling: true
//           }}
//         />
//       <Toaster />
//     </div>
//   )
// }




// import { useEffect, useState, useRef } from "react";
// import AceEditor from "react-ace";
// import { Toaster, toast } from 'react-hot-toast';
// import { useNavigate, useParams } from "react-router-dom";
// import { generateColor } from "../../utils";
// import './Room.css';

// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-typescript";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/mode-yaml";
// import "ace-builds/src-noconflict/mode-golang";
// import "ace-builds/src-noconflict/mode-c_cpp";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/mode-css";

// import "ace-builds/src-noconflict/keybinding-emacs";
// import "ace-builds/src-noconflict/keybinding-vim";

// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/ext-language_tools";
// import "ace-builds/src-noconflict/ext-searchbox";

// export default function Room({ socket }) {
//   const navigate = useNavigate();
//   const { roomId } = useParams();
//   const [fetchedUsers, setFetchedUsers] = useState([]);
//   const [fetchedCode, setFetchedCode] = useState("");
//   const [language, setLanguage] = useState("javascript");
//   const [codeKeybinding, setCodeKeybinding] = useState(undefined);
//   const [question, setQuestion] = useState("");
//   const [output, setOutput] = useState("");
//   const [timerRunning, setTimerRunning] = useState(false);
//   const [timerDuration, setTimerDuration] = useState(0);
//   const timerIntervalRef = useRef(null);
  

//   const languagesAvailable = ["javascript", "java", "c_cpp", "python", "typescript", "golang", "yaml", "html"];
//   const codeKeybindingsAvailable = ["default", "emacs", "vim"];
//   const COUNTDOWN_DURATION = 5 * 60;

//   function onChange(newValue) {
//     setFetchedCode(newValue);
//     socket.emit("update code", { roomId, code: newValue });
//     socket.emit("syncing the code", { roomId });
//   }

//   function handleLanguageChange(e) {
//     setLanguage(e.target.value);
//     socket.emit("update language", { roomId, languageUsed: e.target.value });
//     socket.emit("syncing the language", { roomId });
//   }

//   function handleCodeKeybindingChange(e) {
//     setCodeKeybinding(e.target.value === "default" ? undefined : e.target.value);
//   }

//   function handleLeave() {
//     socket.disconnect();
//     !socket.connected && navigate('/', { replace: true, state: {} });
//   }

//   function copyToClipboard(text) {
//     try {
//       navigator.clipboard.writeText(text);
//       toast.success('Room ID copied');
//     } catch (exp) {
//       console.error(exp);
//     }
//   }

//   function startTimer() {
//     if (!timerRunning) {
//       setTimerRunning(true);
//       setTimerDuration(COUNTDOWN_DURATION);
//       timerIntervalRef.current = setInterval(() => {
//         setTimerDuration((prevDuration) => {
//           const newDuration = prevDuration - 1;
//           socket.emit("timer update", { timerDuration: newDuration, timerRunning: true });
//           return newDuration;
//         });
//       }, 1000);
//     }
//   }
  
//   function pauseTimer() {
//     if (timerRunning) {
//       clearInterval(timerIntervalRef.current);
//       setTimerRunning(false);
//       socket.emit("timer update", { timerDuration, timerRunning: false });
//     }
//   }
  
//   function stopTimer() {
//     clearInterval(timerIntervalRef.current);
//     setTimerRunning(false);
//     setTimerDuration(0);
//     socket.emit("timer update", { timerDuration: 0, timerRunning: false });
//   }
  

//   function formatTime(duration) {
//     const hours = Math.floor(duration / 3600);
//     const minutes = Math.floor((duration % 3600) / 60);
//     const seconds = duration % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   }

//   function runCode() {
//     try {
//       // Evaluate JavaScript code
//       if (language === "java") {
//         const result = eval(fetchedCode);
//         setOutput(result.toString());
//       } else {
//         setOutput("Language not supported for execution in the browser.");
//       }
//     } catch (error) {
//       setOutput(error.toString());
//     }
//   }

//   useEffect(() => {
//     socket.on("updating client list", ({ userslist }) => {
//       setFetchedUsers(userslist);
//     });

//     socket.on("on language change", ({ languageUsed }) => {
//       setLanguage(languageUsed);
//     });

//     socket.on("on code change", ({ code }) => {
//       setFetchedCode(code);
//     });

//     socket.on("new member joined", ({ username }) => {
//       toast(`${username} joined`);
//     });

//     socket.on("member left", ({ username }) => {
//       toast(`${username} left`);
//     });

//     socket.on("room question", ({ question }) => {
//       setQuestion(question);
//     });

//     socket.on("timer update", ({ timerDuration, timerRunning }) => {
//       setTimerDuration(timerDuration);
//       setTimerRunning(timerRunning);
//       if (!timerRunning) {
//         clearInterval(timerIntervalRef.current);
//       } else {
//         if (!timerIntervalRef.current) {
//           timerIntervalRef.current = setInterval(() => {
//             setTimerDuration((prevDuration) => {
//               const newDuration = prevDuration - 1;
//               socket.emit("timer update", { timerDuration: newDuration, timerRunning: true });
//               return newDuration;
//             });
//           }, 1000);
//         }
//       }
//     });

//     const backButtonEventListner = window.addEventListener("popstate", function (e) {
//       const eventStateObj = e.state;
//       if (!('usr' in eventStateObj) || !('username' in eventStateObj.usr)) {
//         socket.disconnect();
//       }
//     });

//     return () => {
//       window.removeEventListener("popstate", backButtonEventListner);
//       clearInterval(timerIntervalRef.current);
//     };
//   }, [socket]);

//   return (
//     <div className="room">
//       <div className="roomSidebar">
//         <div className="roomSidebarUsersWrapper">
//           <div className="languageFieldWrapper">
//             {/* <select className="languageField" name="language" id="language" value={language} onChange={handleLanguageChange}>
//               {languagesAvailable.map(eachLanguage => (
//                 <option key={eachLanguage} value={eachLanguage}>{eachLanguage}</option>
//               ))}
//             </select><p>     </p>

//             <select className="languageField" name="codeKeybinding" id="codeKeybinding" value={codeKeybinding} onChange={handleCodeKeybindingChange}>
//               {codeKeybindingsAvailable.map(eachKeybinding => (
//                 <option key={eachKeybinding} value={eachKeybinding}>{eachKeybinding}</option>
//               ))}
//             </select> */}
//             <div className="timerdiv">
//               <div className="timer">
//                 <button className="startbutton" onClick={startTimer}>Start</button>
//                 <button className="stopbutton" onClick={pauseTimer}>Stop</button>
//                 <button className="resetbutton" onClick={stopTimer}>Reset</button>
//                 <div className="timerDisplay">{formatTime(timerDuration)}</div>
//               </div>
//             </div>
//           </div>

//           <p className="cusers">Connected Users:</p>
//           <div className="roomSidebarUsers">
//             {fetchedUsers.map((each) => (
//               <div key={each} className="roomSidebarUsersEach">
//                 <div className="roomSidebarUsersEachAvatar" style={{ backgroundColor: `${generateColor(each)}` }}>{each.slice(0, 2).toUpperCase()}</div>
//                 <div className="roomSidebarUsersEachName">{each}</div>
//               </div>
//             ))}
//             <br></br>
//           </div>
//           <div className="questionBox">
//             <h2>Question:</h2><br/>
//             {/* <p>{question}</p> */}
//             {/* <input className="questionInput" type="textBo"></input>
//              */}
//             <textarea className="questionInput" name="multiLine" rows="4" cols="50" placeholder="Enter your text here"></textarea>
//           </div>
//         </div>
//         <button className="roomSidebarCopyBtn" onClick={() => { copyToClipboard(roomId) }}>Copy Room id</button>
//         <button className="roomSidebarBtn" onClick={() => {
//           handleLeave();
//         }}>Leave</button>
//       </div>

//       <div className="roomMain">
//         {/* <AceEditor
//           placeholder="Write your code here."
//           className="roomCodeEditor"
//           mode={language}
//           keyboardHandler={codeKeybinding}
//           theme="monokai"
//           name="collabEditor"
//           width="100%"
//           height="60vh"
//           value={fetchedCode}
//           onChange={onChange}
//           fontSize={15}
//           showPrintMargin={true}
//           showGutter={true}
//           highlightActiveLine={true}
//           enableLiveAutocompletion={true}
//           enableBasicAutocompletion={false}
//           enableSnippets={false}
//           wrapEnabled={true}
//           tabSize={2}
//           editorProps={{
//             $blockScrolling: false
//           }}
//         />
//         <div className="btnDiv">
//           <button className="runBtn" onClick={runCode}>Run</button>
//         </div>
//         <div className="outputBox">
//           <h3>Output</h3>
//           <pre>{output}</pre>
//         </div> */}

//         <iframe
//           src="https://collab-code-sepia.vercel.app/"
//           width="100%"
//           height="100%"
//           style={{ border: "none" }}
//           title="Collab Code"
//         ></iframe>
//       </div>
//       <Toaster />
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { generateColor } from "../../utils";
import './Room.css';

export default function Room({ socket }) {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const [fetchedCode, setFetchedCode] = useState(""); // Add this line
    const [language, setLanguage] = useState("javascript");
    const [codeKeybinding, setCodeKeybinding] = useState(undefined);
    const [question, setQuestion] = useState("");
    const [output, setOutput] = useState("");
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerDuration, setTimerDuration] = useState(0);
    const timerIntervalRef = useRef(null);

    const COUNTDOWN_DURATION = 5 * 60;

    function startTimer() {
        if (!timerRunning) {
            setTimerRunning(true);
            setTimerDuration(COUNTDOWN_DURATION);
            timerIntervalRef.current = setInterval(() => {
                setTimerDuration((prevDuration) => {
                    const newDuration = prevDuration - 1;
                    socket.emit("timer update", { roomId, timerDuration: newDuration, timerRunning: true });
                    return newDuration;
                });
            }, 1000);
        }
    }

    function pauseTimer() {
        if (timerRunning) {
            clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            socket.emit("timer update", { roomId, timerDuration, timerRunning: false });
        }
    }

    function stopTimer() {
        clearInterval(timerIntervalRef.current);
        setTimerRunning(false);
        setTimerDuration(0);
        socket.emit("timer update", { roomId, timerDuration: 0, timerRunning: false });
    }

    function handleQuestionChange(e) {
        setQuestion(e.target.value);
        socket.emit("question update", { roomId, question: e.target.value });
    }

    function copyToClipboard(text) { // Add this function
        try {
            navigator.clipboard.writeText(text);
            toast.success('Room ID copied');
        } catch (exp) {
            console.error(exp);
        }
    }

    function handleLeave() { // Add this function
        socket.disconnect();
        !socket.connected && navigate('/', { replace: true, state: {} });
    }

    function formatTime(duration) {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    useEffect(() => {
        socket.on("updating client list", ({ userslist }) => {
            setFetchedUsers(userslist);
        });

        socket.on("on language change", ({ languageUsed }) => {
            setLanguage(languageUsed);
        });

        socket.on("on code change", ({ code }) => {
            setFetchedCode(code);
        });

        socket.on("new member joined", ({ username }) => {
            toast(`${username} joined`);
        });

        socket.on("member left", ({ username }) => {
            toast(`${username} left`);
        });

        socket.on("room question", ({ question }) => {
            setQuestion(question);
        });

        socket.on("timer update", ({ timerDuration, timerRunning }) => {
            setTimerDuration(timerDuration);
            setTimerRunning(timerRunning);
            if (!timerRunning) {
                clearInterval(timerIntervalRef.current);
            } else {
                if (!timerIntervalRef.current) {
                    timerIntervalRef.current = setInterval(() => {
                        setTimerDuration((prevDuration) => {
                            const newDuration = prevDuration - 1;
                            socket.emit("timer update", { roomId, timerDuration: newDuration, timerRunning: true });
                            return newDuration;
                        });
                    }, 1000);
                }
            }
        });

        return () => {
            clearInterval(timerIntervalRef.current);
        };
    }, [socket, roomId]);

    return (
        <div className="room">
            <div className="roomSidebar">
                <div className="roomSidebarUsersWrapper">
                    <div className="languageFieldWrapper">
                        <div className="timerdiv">
                            <div className="timer">
                                <button className="startbutton" onClick={startTimer}>Start</button>
                                <button className="stopbutton" onClick={pauseTimer}>Stop</button>
                                <button className="resetbutton" onClick={stopTimer}>Reset</button>
                                <div className="timerDisplay">{formatTime(timerDuration)}</div>
                            </div>
                        </div>
                    </div>

                    <p className="cusers">Connected Users:</p>
                    <div className="roomSidebarUsers">
                        {fetchedUsers.map((each) => (
                            <div key={each} className="roomSidebarUsersEach">
                                <div className="roomSidebarUsersEachAvatar" style={{ backgroundColor: `${generateColor(each)}` }}>{each.slice(0, 2).toUpperCase()}</div>
                                <div className="roomSidebarUsersEachName">{each}</div>
                            </div>
                        ))}
                        <br></br>
                    </div>
                    <div className="questionBox">
                        <h2>Question:</h2><br/>
                        <textarea className="questionInput" name="multiLine" rows="4" cols="50" placeholder="Enter your text here" value={question} onChange={handleQuestionChange}></textarea>
                    </div>
                </div>
                <button className="roomSidebarCopyBtn" onClick={() => { copyToClipboard(roomId) }}>Copy Room id</button>
                <button className="roomSidebarBtn" onClick={handleLeave}>Leave</button>
            </div>

            <div className="roomMain">
                <iframe
                    src="https://collab-code-sepia.vercel.app/"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Collab Code"
                ></iframe>
            </div>
            <Toaster />
        </div>
    );
}
