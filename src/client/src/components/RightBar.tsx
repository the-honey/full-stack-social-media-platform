import useAuth from '@/context/authContext';
import PersonIcon from '@/assets/person.png';
import { makeRequest } from '../axios';
import UserSuggestion from './UserSuggestion';
import { useQuery } from '@tanstack/react-query';

const RightBar = () => {
  const { currentUser } = useAuth();

  const { isLoading, error, data } = useQuery(['suggestedusers'], () =>
    makeRequest.get('/api/user/recommended').then((res) => {
      return res.data;
    })
  );

  return (
    <div className="basis-1/4 hidden lg:block sticky h-full bg-white text-black">
      <div className="p-5 py-10 flex flex-col gap-5">
        <h1 className="font-bold text-lg">Suggested</h1>
        <hr className="my-3 border-none h-[0.5px] bg-gray-300" />
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
  );
};

export default RightBar;
