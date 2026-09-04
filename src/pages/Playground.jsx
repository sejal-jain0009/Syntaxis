import { useEffect, useMemo, useRef, useState } from 'react';
import LoginRequiredModal from '../components/LoginRequiredModal';
import TransitionModal from '../components/TransitionModal';
import { useProfile } from '../context/ProfileContext';
import { useSettings } from '../context/SettingsContext';
import './Playground.css';

const languageConfig = {
  Java: {
    fileName: 'Main.java',
    code: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Syntaxis!");
  }
}`,
  },
  'C++': {
    fileName: 'main.cpp',
    code: `#include <iostream>

int main() {
  std::cout << "Hello, Syntaxis!";
  return 0;
}`,
  },
  C: {
    fileName: 'main.c',
    code: `#include <stdio.h>

int main(void) {
  printf("Hello, Syntaxis!");
  return 0;
}`,
  },
  Python: {
    fileName: 'main.py',
    code: `def greet():
    print("Hello, Syntaxis!")


greet()`,
  },
  JavaScript: {
    fileName: 'script.js',
    code: `function greet() {
  console.log("Hello, Syntaxis!");
}

greet();`,
  },
};

function Playground({ onNavigate }) {
  const { isAuthenticated } = useProfile();
  const { settings } = useSettings();
  const editorRef = useRef(null);
  const playgroundRef = useRef(null);
  const [language, setLanguage] = useState(settings.defaultLanguage);
  const [code, setCode] = useState(() => window.localStorage.getItem('syntaxis-playground-autosave') || window.sessionStorage.getItem('syntaxis-playground-draft') || languageConfig[settings.defaultLanguage].code);
  const [fileName, setFileName] = useState(languageConfig[settings.defaultLanguage].fileName);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showDashboardTransition, setShowDashboardTransition] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const lineNumbers = useMemo(() => code.split('\n').map((_, index) => index + 1), [code]);

  useEffect(() => {
    if (settings.autoSave) {
      window.localStorage.setItem('syntaxis-playground-autosave', code);
    }
  }, [code, settings.autoSave]);

  useEffect(() => {
    if (!isFocusMode) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsFocusMode(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFocusMode]);

  useEffect(() => {
    const root = playgroundRef.current;
    if (!root) return undefined;
    const revealTargets = root.querySelectorAll('.playground-topbar, .workspace-heading, .editor-panel, .workspace-output');
    revealTargets.forEach((element, index) => {
      element.dataset.playgroundReveal = '';
      element.style.setProperty('--playground-reveal-delay', `${index * 70}ms`);
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function handleLanguageChange(event) {
    const nextLanguage = event.target.value;
    const config = languageConfig[nextLanguage];
    setLanguage(nextLanguage);
    setCode(config.code);
    setFileName(config.fileName);
    setOutput('');
    setSavedMessage('');
  }

  function handleRun() {
    setIsRunning(true);
    setOutput('');
    window.setTimeout(() => {
      setOutput('Hello, Syntaxis!');
      setIsRunning(false);
    }, 500);
  }

  function handleReset() {
    setCode(languageConfig[language].code);
    setOutput('');
  }

  function handleClear() {
    setCode('');
    setOutput('');
  }

  function handleClearOutput() {
    setOutput('');
  }

  function replaceEditorSelection(nextValue, selectionStart, selectionEnd = selectionStart) {
    setCode((currentCode) => `${currentCode.slice(0, selectionStart)}${nextValue}${currentCode.slice(selectionEnd)}`);
    window.requestAnimationFrame(() => {
      editorRef.current?.focus();
      editorRef.current?.setSelectionRange(selectionStart + nextValue.length, selectionStart + nextValue.length);
    });
  }

  function handleEditorKeyDown(event) {
    const pairMap = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" };
    const closingCharacters = new Set(Object.values(pairMap));
    const { selectionStart, selectionEnd, value } = event.currentTarget;
    const nextCharacter = value[selectionEnd];

    if (closingCharacters.has(event.key) && nextCharacter === event.key && selectionStart === selectionEnd) {
      event.preventDefault();
      event.currentTarget.setSelectionRange(selectionStart + 1, selectionStart + 1);
      return;
    }

    if (pairMap[event.key]) {
      event.preventDefault();
      const selectedText = value.slice(selectionStart, selectionEnd);
      replaceEditorSelection(`${event.key}${selectedText}${pairMap[event.key]}`, selectionStart, selectionEnd);
      window.requestAnimationFrame(() => editorRef.current?.setSelectionRange(selectionStart + 1, selectionEnd + 1));
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const currentLine = value.slice(lineStart, selectionStart);
    const currentIndent = currentLine.match(/^\s*/)?.[0] || '';
    const increasesIndent = /[({[]\s*$/.test(currentLine);
    const afterCursor = value.slice(selectionEnd);
    const closesBlock = increasesIndent && /^[)}\]]/.test(afterCursor);
    const innerIndent = `${currentIndent}${' '.repeat(settings.tabSize)}`;
    const insertedText = closesBlock ? `\n${innerIndent}\n${currentIndent}` : `\n${increasesIndent ? innerIndent : currentIndent}`;
    event.preventDefault();
    replaceEditorSelection(insertedText, selectionStart, selectionEnd);
    if (closesBlock) {
      window.requestAnimationFrame(() => editorRef.current?.setSelectionRange(selectionStart + 1 + innerIndent.length, selectionStart + 1 + innerIndent.length));
    }
  }

  function handleFormat() {
    let indentLevel = 0;
    const formattedCode = code.split('\n').map((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        return '';
      }
      if (/^[)}\]]/.test(trimmedLine)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      const formattedLine = `${' '.repeat(settings.tabSize).repeat(indentLevel)}${trimmedLine}`;
      if (/[({[]\s*$/.test(trimmedLine) && !/[)}\]]$/.test(trimmedLine)) {
        indentLevel += 1;
      }
      return formattedLine;
    }).join('\n');
    setCode(formattedCode);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyMessage('Copied');
    } catch {
      setCopyMessage('Copy unavailable');
    }
    window.setTimeout(() => setCopyMessage(''), 1600);
  }

  function handleSave() {
    if (!isAuthenticated) {
      window.sessionStorage.setItem('syntaxis-playground-draft', code);
      setShowLoginPrompt(true);
      return;
    }
    const snippet = { language, fileName, code, savedAt: new Date().toISOString() };
    window.localStorage.setItem('syntaxis-last-snippet', JSON.stringify(snippet));
    setSavedMessage('Snippet saved successfully.');
    window.setTimeout(() => setSavedMessage(''), 2400);
  }

  function openDashboard(event) {
    event.preventDefault();
    setShowDashboardTransition(true);
  }

  function openAuth(path) {
    window.sessionStorage.setItem('syntaxis-playground-draft', code);
    onNavigate(path);
  }

  return (
    <div ref={playgroundRef} className={`playground-page ${isFocusMode ? 'focus-mode' : ''}`}>
      <header className="playground-topbar">
        <a className="playground-brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate('/'); }} aria-label="Syntaxis home">
          <span className="brand-mark">S</span>
          <span className="brand-name">syntaxis</span>
        </a>
        <div className="playground-title"><span className="title-dot"></span><h1>Playground</h1></div>
        <div className="playground-top-actions">
          <label className="top-language" htmlFor="top-language">Language</label>
          <select id="top-language" value={language} onChange={handleLanguageChange} aria-label="Select programming language">
            {Object.keys(languageConfig).map((option) => <option key={option}>{option}</option>)}
          </select>
          {!isFocusMode && <a className="dashboard-link" href="/dashboard" onClick={openDashboard}>← Dashboard</a>}
          <button className="focus-toggle" type="button" onClick={() => setIsFocusMode((enabled) => !enabled)} aria-pressed={isFocusMode}>
            {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
          </button>
        </div>
      </header>

      <main className="playground-content">
        {!isFocusMode && <div className="workspace-heading">
          <div><p className="playground-kicker">CODE WORKSPACE</p><h2>Build your next solution.</h2></div>
          <div className="workspace-actions">
            {savedMessage && <span className="workspace-message" role="status">{savedMessage}</span>}
            <button className="save-button" type="button" onClick={handleSave}>Save Snippet</button>
          </div>
        </div>}

        <section className="editor-layout" aria-label="Coding workspace">
          <div className="editor-panel">
            <div className="editor-toolbar">
              <div className="file-control"><span className="file-icon" aria-hidden="true">▤</span><label htmlFor="file-name">File</label><input id="file-name" value={fileName} onChange={(event) => setFileName(event.target.value)} /></div>
              <div className="editor-actions"><button className="run-button" type="button" onClick={handleRun} disabled={isRunning}><span aria-hidden="true">{isRunning ? '...' : '▶'}</span>{isRunning ? 'Running...' : 'Run Code'}</button><button type="button" onClick={handleCopy}>{copyMessage || 'Copy Code'}</button><button type="button" onClick={handleFormat}>Format Code</button><button type="button" onClick={handleReset}>Reset</button><button type="button" onClick={handleClear}>Clear</button></div>
            </div>
            <div className="code-editor">
              <div className="line-numbers" aria-hidden="true">{lineNumbers.map((number) => <span key={number}>{String(number).padStart(2, '0')}</span>)}</div>
              <textarea ref={editorRef} aria-label={`${language} code editor`} spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} onKeyDown={handleEditorKeyDown} style={{ fontSize: settings.fontSize === 'small' ? '0.76rem' : settings.fontSize === 'large' ? '0.94rem' : '0.84rem', whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre', overflowWrap: settings.wordWrap ? 'anywhere' : 'normal' }} />
            </div>
            <div className="editor-status"><span><i></i>{language}</span><span>{code.length} characters</span></div>
          </div>

          <section className="output-panel workspace-output" aria-labelledby="output-title">
            <div className="output-panel-header"><div><p className="playground-kicker">TERMINAL</p><h2 id="output-title">Output</h2></div><div className="output-header-actions"><span className={`output-state ${isRunning ? 'running' : ''}`}>{isRunning ? 'Running' : output ? 'Complete' : 'Waiting'}</span><button className="clear-output" type="button" onClick={handleClearOutput} disabled={!output && !isRunning}>Clear</button></div></div>
            <div className={`output-body ${output ? 'has-output' : ''}`} aria-live="polite">
              {isRunning ? <><span className="output-prompt">$</span><span>Running demo...</span></> : output ? <><span className="output-prompt">$</span><span>{output}</span></> : <span className="output-empty">Run your code to see the output here.</span>}
            </div>
            <p className="demo-note">Demo output only. Code execution will connect to the Syntaxis runtime later.</p>
          </section>
        </section>
      </main>
      <LoginRequiredModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} onNavigate={openAuth} />
      <TransitionModal open={showDashboardTransition} title="Welcome back" message="Opening your workspace..." actionLabel="Opening Dashboard" onComplete={() => onNavigate('/dashboard')} />
    </div>
  );
}

export default Playground;
