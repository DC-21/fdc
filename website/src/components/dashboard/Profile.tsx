import { useRecoilValue } from "recoil";
import { HelpCircle, Bell, Info, Settings, LogOut } from "lucide-react";
import { userDetailsAtom } from "../../recoil/atom";

const Profile = () => {
  const userDetails = useRecoilValue(userDetailsAtom);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center text-3xl font-bold text-gray-500">
            {userDetails.fullname.charAt(0)}
          </div>
          <h2 className="text-3xl font-semibold text-gray-800">
            {userDetails.fullname}
          </h2>
          <p className="text-gray-500">{userDetails.email}</p>
        </div>

        {/* Description */}
        <p className="text-center text-gray-600 px-4">
          Customize your account settings and view your personal information.
        </p>

        {/* Profile Options */}
        <div className="w-full flex flex-col space-y-3">
          <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <HelpCircle className="w-6 h-6 mr-3 text-gray-600" />
            <span className="font-medium">Help</span>
          </button>
          <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <Bell className="w-6 h-6 mr-3 text-gray-600" />
            <span className="font-medium">Notification Settings</span>
          </button>
          <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <Info className="w-6 h-6 mr-3 text-gray-600" />
            <span className="font-medium">Info</span>
          </button>
          <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <Settings className="w-6 h-6 mr-3 text-gray-600" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg transition-all">
            <LogOut className="w-6 h-6 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
