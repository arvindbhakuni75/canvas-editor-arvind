import { useCanvas } from "../context/CanvasContext";

const Navbar = () => {
  const { pages, currentPage, switchPage, addPage, removePage } = useCanvas() || {};

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-3 md:mb-0">Canvas Editor</h1>
        <div className="flex flex-wrap gap-2 justify-center">
          {pages.map((_:any, idx:number) => (
            <div key={idx} className="flex items-center gap-1 bg-blue-700 text-white rounded-md overflow-hidden shadow-md">
              <button
                onClick={() => switchPage(idx)}
                className={`px-3 py-1 text-sm transition-all ${
                  currentPage === idx
                    ? "bg-white text-blue-600 border border-blue-600"
                    : "bg-blue-700 text-white border border-transparent"
                } hover:bg-opacity-80`}
              >
                Page {idx + 1}
              </button>
              {pages.length > 1 && (
                <button
                  onClick={() => removePage(idx)}
                  className="text-white bg-blue-500 px-2 py-1 text-xs rounded-r-md hover:bg-red-600 transition-all"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addPage}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded-md shadow-md hover:bg-green-600 transition-all"
          >
            + Add Page
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
