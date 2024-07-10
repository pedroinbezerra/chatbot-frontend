import '../styles/globals.css'
import React, { useState } from 'react'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Script src="https://unpkg.com/react/umd/react.production.min.js" ></Script>

      <Script
        src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
      ></Script>

      <Script
        src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
      ></Script>

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
      />

      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
