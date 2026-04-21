import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.username}!
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <p className="text-gray-600 mb-6">
            You are logged in as a <span className="font-semibold px-2 py-1 bg-gray-100 rounded text-sm">{user?.role}</span>. 
            This is a protected page. Only authenticated users can see this content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">My Profile</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            {user?.role === 'OWNER' && (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">Manage Warehouses</h3>
                <p className="text-sm text-gray-500">List and manage your spaces.</p>
              </div>
            )}
            {user?.role === 'CUSTOMER' && (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">My Bookings</h3>
                <p className="text-sm text-gray-500">View active rentals & invoices.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
