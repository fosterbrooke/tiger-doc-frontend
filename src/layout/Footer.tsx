import React from 'react'

export default function Footer() {
    return (
        <footer className="fixed left-0 bottom-0 w-full bg-gray-800 text-white py-6">
            <div className="container mx-auto px-6 text-center">
                <p>© {new Date().getFullYear()} Legal Document Converter. All rights reserved.</p>
            </div>
        </footer>

    )
}
