import { useAuth } from './context/authContext';

function App() {
  const { logout } = useAuth();

  return (
    <div className="text-rose-300">
      App page
      <button
        className="ml-4 px-3 py-1 bg-rose-400 text-white rounded hover:bg-rose-500"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default App;