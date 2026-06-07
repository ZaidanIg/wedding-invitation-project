'use client';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

const IframePreview = forwardRef(({ children, ...props }: any, ref) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  useImperativeHandle(ref, () => {
    return {
      querySelector: (selector: string) => {
        return contentRef?.contentWindow?.document?.querySelector(selector);
      },
      scrollTo: (options: any) => {
        contentRef?.contentWindow?.scrollTo(options);
      },
      addEventListener: (evt: string, cb: any) => {
         contentRef?.contentWindow?.addEventListener(evt, cb);
      },
      removeEventListener: (evt: string, cb: any) => {
         contentRef?.contentWindow?.removeEventListener(evt, cb);
      },
      get clientHeight() {
        return contentRef?.clientHeight || 0;
      },
      get scrollHeight() {
        return contentRef?.contentWindow?.document.documentElement.scrollHeight || 0;
      },
      get scrollTop() {
        return contentRef?.contentWindow?.document.documentElement.scrollTop || 0;
      }
    };
  }, [contentRef]);

  useEffect(() => {
    if (!contentRef || !contentRef.contentWindow) return;
    
    const doc = contentRef.contentWindow.document;
    doc.head.innerHTML = '';
    
    // Add viewport meta tag to simulate mobile rendering correctly
    const meta = doc.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    doc.head.appendChild(meta);
    
    const styles = document.head.querySelectorAll('style, link[rel="stylesheet"], link[rel="preconnect"], link[rel="preload"]');
    styles.forEach(style => doc.head.appendChild(style.cloneNode(true)));
    
    doc.documentElement.style.overflowX = 'hidden';
    doc.body.style.margin = '0';
    doc.body.style.padding = '0';
    doc.body.style.backgroundColor = 'transparent';
    doc.body.style.overflowX = 'hidden';
    doc.documentElement.style.width = '100%';
    doc.body.style.width = '100%';
    
  }, [contentRef]);

  return (
    <iframe 
      {...props} 
      ref={setContentRef} 
      style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent' }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
});

IframePreview.displayName = 'IframePreview';
export default IframePreview;
