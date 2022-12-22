import { Link } from 'react-router-dom';
import PersonIcon from '@/assets/person.png';
import useAuth from '@/context/authContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { makeRequest } from '../axios';

const UserSuggestion = ({ username, profilePicUrl }: any) => {
  const { currentUser } = useAuth();
  const { isLoading, data } = useQuery(['relationship_' + username], () =>
    makeRequest.get('/api/follow/' + username).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following: boolean) => {
      if (following) return makeRequest.delete('/api/follow/' + username);
      return makeRequest.post('/api/follow/' + username);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['relationship_' + username]);
      },
    }
  );

  function handleClick(e: any) {
    mutation.mutate(data.isFollowing);
  }

  return (
    <div className="flex items-center gap-3">
      <img
        className="w-8 h-8 rounded-full object-cover"
        src={profilePicUrl ? '/uploads/' + profilePicUrl : PersonIcon}
        alt=""
      />
      <Link
        to={`/profile/${username}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <span className="font-medium">{username}</span>
      </Link>
      {isLoading ? (
        'loading'
      ) : data.isFollowing ? (
        <button
          className="bg-white ring-2 ring-green-500 rounded-xl px-3 text-green-500 font-bold"
          onClick={handleClick}
        >
          Following
        </button>
      ) : (
        <button
          className="bg-green-500 rounded-xl px-3 text-white font-bold"
          onClick={handleClick}
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default UserSuggestion;
