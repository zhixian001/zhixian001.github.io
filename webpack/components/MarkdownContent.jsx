import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

/**
 * 
 * @typedef {{
 *  markdownText?: string
 *  markdownUrl?: string
 * }} MarkdownContentProps
 */

/**
 * 
 * @param {MarkdownContentProps} props 
 */
export default function MarkdownContent(props) {
  const [markdownText, setMarkdownText] = useState('');

  useEffect(async () => {
    if (props.markdownText) {
      setMarkdownText(props.markdownText);
    } else {
      const markdownContentResponse = await fetch(props.markdownUrl);
      setMarkdownText(await markdownContentResponse.text());
    }
  }, []);

  return (<ReactMarkdown
    plugins={[gfm]}
    children={markdownText}
  />);
}
