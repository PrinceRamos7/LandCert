import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-purple-50 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="flex flex-col items-center">
                    <img 
                        src="/images/Ilagan.png" 
                        alt="LandCert Logo" 
                        className="h-24 w-24 object-contain"
                    />
                    <h1 className="mt-2 text-2xl font-bold text-gray-800">LandCert System</h1>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-xl sm:max-w-md sm:rounded-lg border border-gray-200">
                {children}
            </div>
        </div>
    );
}
