import MoreVertIcon from '@mui/icons-material/MoreVert';
import Posts from '@/components/Posts';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import { useParams } from 'react-router-dom';
import useAuth, { AuthContext } from '../../context/authContext';
import PersonIcon from '@/assets/person.png';
//import Update from '../../components/update/Update';
import { useState } from 'react';

const Profile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const { currentUser } = useAuth();
  let { username } = useParams();

  const { isLoading, error, data } = useQuery(['user_' + username], () =>
    makeRequest.get('/user/id/' + username ?? '').then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ['relationship_' + username],
    () =>
      makeRequest.get('/follow/' + username).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following: boolean) => {
      if (following) return makeRequest.delete('/follow/' + username);
      return makeRequest.post('/follow/' + username);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['relationship_' + username]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.isFollowing);
  };
  return (
    <div className="p-3 md:p-5 lg:py-5 lg:px-16 min-w-full">
      {isLoading ? (
        'loading'
      ) : (
        <>
          <div className="profileContainer">
            <div className="drop-shadow-md bg-white rounded-2xl p-8 flex items-center justify-between mb-5">
              <div className="flex flex-1 flex-col items-center">
                <img
                  src={data?.user.profile.profilePicUrl ?? PersonIcon}
                  alt=""
                  className="w-48 h-48 rounded-full object-cover m-auto"
                />
                <span className="text-lg font-semibold">
                  {data.user.profile.firstName +
                    ' ' +
                    data.user.profile.lastName}
                </span>
                <span className="text-md">{'@' + data.user.username}</span>
                <div className="my-5">
                  <div className="text-gray-500 md:w-[450px] text-center break-all">
                    {data.user.profile.description ??
                      'No description has been set.'}
                  </div>
                </div>
                {rIsLoading ? (
                  'loading'
                ) : username === currentUser?.username ? (
                  <button
                    className="bg-green-500 text-white rounded-2xl font-bold px-4 py-1"
                    onClick={() => setOpenEdit(true)}
                  >
                    Edit Profile
                  </button>
                ) : relationshipData.isFollowing ? (
                  <button
                    className="bg-white ring-2 ring-green-500 text-green-500 rounded-2xl font-bold px-4 py-1"
                    onClick={handleFollow}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white rounded-2xl font-bold px-4 py-1"
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                )}
              </div>
              <div className="absolute right-8">
                <MoreVertIcon />
              </div>
            </div>
            <Posts username={username} />
          </div>
        </>
      )}
      {openEdit && <EditProfile setOpenEdit={setOpenEdit} user={data} />}
    </div>
  );
};

export default Profile;
