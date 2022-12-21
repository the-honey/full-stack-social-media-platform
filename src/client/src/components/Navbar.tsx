import Home from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@/assets/person.png';
import { Link } from 'react-router-dom';
import useAuth from '@/context/authContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="shadow-md flex py-3 px-5 h-13 sticky top-0 bg-white color-black z-50">
      <div className="flex items-center gap-3">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-bold text-xl text-black">Very Social</span>
        </Link>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Home className="invisible sm:visible" />
        </Link>

        <div className="hidden items-center gap-3 border-black border rounded-xl p-1">
          <SearchOutlinedIcon />
          <input
            className="placeholder:text-gray-800 border-none lg:w-[500px] sm:w-[200px] bg-transparent text-black hidden sm:block"
            type="text"
            placeholder="Search..."
          />
        </div>

        <div className="items-center gap-5 flex absolute right-0 mr-5">
          <div className="flex items-center gap-3 font-medium">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl
                  ? '/uploads/' + currentUser?.profile.profilePicUrl
                  : PersonIcon
              }
              alt=""
            />
            <Link to={'/profile/' + currentUser?.username}>
              <span>{currentUser?.username}</span>
            </Link>
          </div>
          <LogoutIcon className="cursor-pointer" onClick={() => logout()} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
