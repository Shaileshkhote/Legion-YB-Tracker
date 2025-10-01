'use client';

export function Footer() {
    return (
        <footer className="bg-dark-100 border-t border-dark-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        Legion YB Sale Tracker Made with ❤️ By{' '}
                        <a
                            href="https://twitter.com/0x_Shailesh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 transition-colors"
                        >
                            @0x_Shailesh
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
