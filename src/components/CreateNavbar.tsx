import { Link } from 'react-router-dom'

export function CreateNavbar() {

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img className="h-7 w-7" src="/gene.png" alt="Aladdyn" />
            <span className="text-xl font-semibold">Aladdyn</span>
          </Link>
          
          <h1 className="text-xl font-semibold text-gray-900">Create Genie</h1>
        </div>
      </div>
    </nav>
  )
}
