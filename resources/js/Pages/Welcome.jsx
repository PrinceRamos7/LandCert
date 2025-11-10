import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Welcome({ auth }) {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const features = [
        {
            icon: "🏢",
            title: "Land Use Certification",
            description:
                "Get certified for your land use compliance with our streamlined digital process.",
        },
        {
            icon: "⚡",
            title: "Fast Processing",
            description:
                "Quick and efficient application processing with real-time status updates.",
        },
        {
            icon: "🔒",
            title: "Secure & Reliable",
            description:
                "Your documents and data are protected with enterprise-grade security.",
        },
        {
            icon: "📱",
            title: "Digital Certificates",
            description:
                "Receive official digital certificates that are verifiable and authentic.",
        },
    ];

    const heroImages = ["/images/Ilagan2.png", "/images/Ilagan-2030.png"];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Welcome" />

            {/* Hero Section */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                {/* Background Image Slider */}
                <div className="absolute inset-0">
                    {heroImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide
                                    ? "opacity-30"
                                    : "opacity-0"
                            }`}
                        >
                            <img
                                src={image}
                                alt={`Hero ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
                    <div
                        className={`flex items-center space-x-4 transform transition-all duration-1000 ${
                            isVisible
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-10 opacity-0"
                        }`}
                    >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg p-1">
                            <img
                                src="/images/ilagan.png"
                                alt="Ilagan City Logo"
                                className="w-full h-full object-contain rounded-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">
                                CPDO
                            </h1>
                            <p className="text-blue-200 text-sm">
                                City of Ilagan
                            </p>
                        </div>
                    </div>

                    <div
                        className={`flex items-center space-x-4 transform transition-all duration-1000 delay-300 ${
                            isVisible
                                ? "translate-x-0 opacity-100"
                                : "translate-x-10 opacity-0"
                        }`}
                    >
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Dashboard
                            </Link>
                        ) : null}
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <div
                            className={`transform transition-all duration-1000 delay-500 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                City Planning and
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    Development Office
                                </span>
                            </h1>
                        </div>

                        <div
                            className={`transform transition-all duration-1000 delay-700 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                                Streamlined land use certification process for
                                the City of Ilagan, Isabela. Apply online, track
                                your application, and receive digital
                                certificates.
                            </p>
                        </div>

                        <div
                            className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-1000 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            {!auth.user && (
                                <>
                                    <Link
                                        href={route("register")}
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                                    >
                                        Get Started Today
                                    </Link>
                                    <Link
                                        href={route("login")}
                                        className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Already Have Account?
                                    </Link>
                                </>
                            )}
                            {auth.user && (
                                <Link
                                    href={route("dashboard")}
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div
                    className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${
                        isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                    }`}
                >
                    <div className="animate-bounce">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the future of government services with
                            our modern, efficient, and user-friendly platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                                    isVisible
                                        ? "animate-fade-in-up"
                                        : "opacity-0"
                                }`}
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            Simple 4-Step Process
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Getting your land use certificate has never been
                            easier
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Register Account",
                                desc: "Create your account with basic information",
                            },
                            {
                                step: "02",
                                title: "Submit Application",
                                desc: "Fill out the application form with project details",
                            },
                            {
                                step: "03",
                                title: "Upload Payment",
                                desc: "Submit payment receipt for processing",
                            },
                            {
                                step: "04",
                                title: "Get Certificate",
                                desc: "Download your official digital certificate",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`text-center group transform transition-all duration-500 hover:scale-105 ${
                                    isVisible
                                        ? "animate-fade-in-up"
                                        : "opacity-0"
                                }`}
                                style={{ animationDelay: `${index * 300}ms` }}
                            >
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-yellow-500/50 transition-all duration-300">
                                        <span className="text-2xl font-bold text-white">
                                            {item.step}
                                        </span>
                                    </div>
                                    {index < 3 && (
                                        <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-blue-100">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <div
                        className={`transform transition-all duration-1000 ${
                            isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                        }`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Join hundreds of satisfied applicants who have
                            streamlined their land use certification process
                            with our platform.
                        </p>

                        {!auth.user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route("register")}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                                >
                                    Create Account Now
                                </Link>
                                <Link
                                    href={route("login")}
                                    className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                                    <img
                                        src="/images/ilagan.png"
                                        alt="Ilagan City Logo"
                                        className="w-full h-full object-contain rounded-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">CPDO</h3>
                                    <p className="text-gray-400 text-sm">
                                        City of Ilagan
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                City Planning and Development Office - Serving
                                the community with efficient and reliable land
                                use certification services.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">
                                Contact Info
                            </h4>
                            <div className="space-y-2 text-gray-400">
                                <p>
                                    📍 Ground Floor,City Hall Bldg, City of
                                    Ilagan, Isabela
                                </p>
                                <p>📞 Contact: 624-0009</p>
                                <p>✉️ Email: cpdo@cityofilagan.gov.ph</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">
                                Office Hours
                            </h4>
                            <div className="space-y-2 text-gray-400">
                                <p>
                                    Monday - Friday: 8:00 AM - 5:00 PM - except
                                    Holiday
                                </p>
                                <p>Saturday - Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>
                            &copy; 2024 City Planning And Development Office.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </>
    );
}
