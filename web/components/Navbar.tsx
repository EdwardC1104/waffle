import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="Waffle logo"
                  height={39}
                  width={130}
                />
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link
                href="/profile"
                className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
