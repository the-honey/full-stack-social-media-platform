import { useContext, useState } from 'react';
import useAuth from '@/context/authContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';
import Comment from './Comment';
import PersonIcon from '@/assets/person.png';

const Comments = ({ postId }: any) => {
  const [desc, setDesc] = useState('');
  const { currentUser } = useAuth();

  const { isLoading, error, data } = useQuery(['post_' + postId], () =>
    makeRequest.get('/comment/' + postId).then((res) => {
      return res.data.comments;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (content: string) => {
      return makeRequest.post('/comment/' + postId, { content: content });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['post_' + postId]);
      },
    }
  );

  const handleClick = async (e: any) => {
    e.preventDefault();
    mutation.mutate(desc);
    setDesc('');
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-5 my-5">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={currentUser?.profile.profilePicUrl ?? PersonIcon}
          alt=""
        />
        <input
          className="w-full rounded-xl py-2 px-3 border border-solid border-black bg-transparent"
          type="text"
          placeholder="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button
          className="border-none bg-green-500 text-white py-2 px-5 cursor-pointer rounded-2xl font-bold"
          onClick={handleClick}
        >
          Send
        </button>
      </div>
      {error
        ? 'Something went wrong'
        : isLoading
        ? 'loading'
        : data.map((comment: any) => (
            <Comment key={comment.id} comment={comment} />
          ))}
    </div>
  );
};

export default Comments;
