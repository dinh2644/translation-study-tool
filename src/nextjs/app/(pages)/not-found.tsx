import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="text-center mt-20">
            <h2 className="text-4xl font-bold">Not Found</h2>
            <p className="mt-4 mb-6">Could not find requested resource</p>
            <Link href="/home" className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors">Return Home</Link>
        </div>
    )
}