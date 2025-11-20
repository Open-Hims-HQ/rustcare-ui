import { Activity, Heart, Shield, Stethoscope, Pill, Dna } from "lucide-react";

export function MedicalHero() {
    return (
        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Central Medical Visualization */}
            <div className="relative z-10 w-full max-w-lg aspect-square">
                {/* Rotating Rings */}
                <div className="absolute inset-0 border-2 border-blue-100 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-8 border-2 border-indigo-100 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-16 border border-dashed border-blue-200 rounded-full animate-[spin_20s_linear_infinite]" />

                {/* Floating Icons */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 animate-[bounce_3s_infinite]">
                    <div className="bg-white p-3 rounded-xl shadow-lg text-red-500">
                        <Heart className="w-8 h-8 fill-current" />
                    </div>
                </div>

                <div className="absolute bottom-1/4 right-0 translate-x-6 animate-[bounce_4s_infinite_delay-100]">
                    <div className="bg-white p-3 rounded-xl shadow-lg text-blue-500">
                        <Activity className="w-8 h-8" />
                    </div>
                </div>

                <div className="absolute bottom-1/4 left-0 -translate-x-6 animate-[bounce_3.5s_infinite_delay-200]">
                    <div className="bg-white p-3 rounded-xl shadow-lg text-green-500">
                        <Shield className="w-8 h-8" />
                    </div>
                </div>

                <div className="absolute top-1/4 right-0 translate-x-4 animate-[bounce_4.5s_infinite_delay-300]">
                    <div className="bg-white p-2 rounded-lg shadow-md text-purple-500">
                        <Dna className="w-6 h-6" />
                    </div>
                </div>

                <div className="absolute top-1/4 left-0 -translate-x-4 animate-[bounce_5s_infinite_delay-400]">
                    <div className="bg-white p-2 rounded-lg shadow-md text-orange-500">
                        <Pill className="w-6 h-6" />
                    </div>
                </div>

                {/* Central Pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-2xl text-white">
                            <Stethoscope className="w-16 h-16" />
                        </div>
                    </div>
                </div>

                {/* EKG Line Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <path
                            d="M0,50 L20,50 L30,20 L40,80 L50,50 L300,50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-blue-500 animate-[dash_2s_linear_infinite]"
                            strokeDasharray="300"
                            strokeDashoffset="300"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="300"
                                to="0"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
