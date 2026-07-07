export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} HopeCare Hospital Portal. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1">Decoupled Architecture Project — Django REST API & React</p>
      </div>
    </footer>
  );
}