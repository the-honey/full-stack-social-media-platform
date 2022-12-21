import useAuth from '@/context/authContext';
import PersonIcon from '@/assets/person.png';
import { makeRequest } from '../axios';
import { useQuery } from '@tanstack/react-query';
import UserSuggestion from '@/components/UserSuggestion';
import { Link } from 'react-router-dom';

const LeftBar = () => {
  const { currentUser } = useAuth();

  const { isLoading, error, data } = useQuery(['newestusers'], () =>
    makeRequest.get('/user/newest').then((res) => {
      return res.data;
    })
  );

  return (
    <div className="basis-1/4 hidden lg:block sticky h-full bg-white text-black">
      <div className="px-5 py-10 gap-3">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
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
              <span className="font-medium">{currentUser?.username}</span>
            </Link>
          </div>
          <hr className="my-3 border-none h-[0.5px] bg-gray-300" />
          <h1 className="font-bold text-lg">New Users</h1>
          {error
            ? 'Something went wrong!'
            : isLoading
            ? 'loading'
            : data.users.map((user: any) => (
                <UserSuggestion
                  key={user.username}
                  username={user.username}
                  profilePicUrl={user.profile.profilePicUrl}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
