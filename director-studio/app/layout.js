'use client'

import './globals.css'
import Sidebar from '../components/Sidebar'
import XiaoGuangChat from '../components/XiaoGuangChat'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
          <XiaoGuangChat />
        </div>
      </body>
    </html>
  )
}
