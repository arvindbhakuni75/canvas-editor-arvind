import { useAuth } from "../context/AuthContext";
import Canvas from "../components/Canvas";
import { Navbar, Toolbar } from "../components";

const Home = () => {
  const { user, logout } = useAuth() || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-6">
        {/* Sidebar with Toolbar and User Info */}
        <div className="lg:w-1/4 flex flex-col gap-6">
          {user && (
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-4">
              <img
                src={user?.picture?.thumbnail}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-800">
                  {user.name.first} {user?.name?.last}
                </p>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                <button
                  onClick={logout}
                  className="mt-2 text-sm text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Toolbox */}
          <Toolbar />
        </div>

        {/* Canvas Area */}
        <div className="lg:w-3/4">
          <Canvas />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-2 text-center text-gray-500 text-sm">
        © Designed by Arvind Bhakuni | Developed by Arvind Bhakuni
      </footer>
    </div>
  );
};

export default Home;