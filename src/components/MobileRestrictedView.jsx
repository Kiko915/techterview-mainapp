import Image from "next/image";

export default function MobileRestrictedView() {
    return (
        <div className="relative flex min-h-screen flex-col items-center bg-[#FEFEFE] justify-center p-6 text-center">
            <div className="absolute left-6 top-6 h-12 w-12">
                <Image
                    src="/logo/techterview_symbol_colored.png"
                    alt="TechTerview Logo"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="relative mb-8 h-64 w-64 animate-in fade-in zoom-in duration-500">
                <Image
                    src="/assets/techbot/techbot-phone.png"
                    alt="TechBot on Phone"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <h1 className="mb-4 font-playfair text-3xl font-bold text-primary">
                Desktop Experience Only
            </h1>
            <p className="max-w-md font-montserrat text-muted-foreground">
                Mobile phones are not yet supported as of the moment. Please try switching
                to a Desktop or Laptop to access the app.
            </p>
        </div>
    );
}
