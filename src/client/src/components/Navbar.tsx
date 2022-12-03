import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import useAuth from '@/context/authContext';

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <div className="shadow-md flex items-center justify-center py-3 px-5 h-13 sticky top-0 bg-white color-black z-50">
      <div className="flex items-center gap-8">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-bold text-xl text-black">VerySocial</span>
        </Link>
        <HomeOutlinedIcon />
        <GridViewOutlinedIcon />
        <div className="flex items-center gap-3 border-black border rounded-xl p-1">
          <SearchOutlinedIcon />
          <input
            className="placeholder:text-gray-800 border-none lg:w-[500px] sm:w-[200px] bg-transparent text-black hidden sm:block"
            type="text"
            placeholder="Search..."
          />
        </div>

        <div className="items-center gap-5 hidden sm:flex">
          <div className="hidden md:flex items-center gap-3 font-medium">
            <img
              className="w-8 h-8"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <span>{currentUser?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
