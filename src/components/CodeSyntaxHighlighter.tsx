import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('yaml', yaml);

type CodeSyntaxHighlighterProps = {
  code: string;
  language?: string;
  showLineNumbers: boolean;
};

export function CodeSyntaxHighlighter({ code, language, showLineNumbers }: CodeSyntaxHighlighterProps) {
  return (
    <SyntaxHighlighter
      language={language || 'text'}
      style={oneLight}
      PreTag="div"
      CodeTag="code"
      showLineNumbers={showLineNumbers}
      wrapLongLines={false}
      customStyle={{
        margin: 0,
        borderRadius: 0,
        background: 'transparent',
        padding: '18px 20px 20px',
        fontSize: '14px',
        lineHeight: 1.78,
      }}
      codeTagProps={{
        style: {
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
      }}
      lineNumberStyle={{
        minWidth: '2.75em',
        paddingRight: '16px',
        color: '#a9b5c9',
        userSelect: 'none',
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
