import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import shell from 'highlight.js/lib/languages/shell'
import xml from 'highlight.js/lib/languages/xml'
import { type FC, type PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('xml', xml)

type Props = PropsWithChildren<{
  className?: string
}>

const CodeBlock: FC<Props> = ({ children, className }) => {
  // const highlightedCode = hljs.highlight(code, {
  //   language,
  // }).value

  return (
    <code
      className={twMerge(
        'border-mid bg-dark block w-fit max-w-full overflow-scroll whitespace-pre-wrap rounded border px-4 py-2 text-xs sm:overflow-hidden sm:text-base',
        className,
      )}
      // dangerouslySetInnerHTML={{ __html: highlightedCode }}
    >
      {children}
    </code>
  )
}

export default CodeBlock
