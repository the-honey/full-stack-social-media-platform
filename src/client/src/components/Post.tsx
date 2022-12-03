import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Comments from '@/components/Comments';
import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { makeRequest } from '../axios';
import dayjs from 'dayjs';
import useAuth from '@/context/authContext';

function Post({ post }: any) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useAuth();

  const { isLoading, error, data } = useQuery(['reactions', post.id], () =>
    makeRequest.get('/reaction/' + post.id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked: boolean) => {
      if (liked) return makeRequest.delete('/reaction/' + post.id);
      return makeRequest.post('/reaction/' + post.id, { reactionType: 'LIKE' });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['reactions']);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete('/post/' + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.userReaction != null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="drop-shadow-md rounded-2xl bg-white text-black">
      <div className="p-5">
        <div className="flex items-center justify-between relative">
          <div className="flex gap-2">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={
                post.author.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <div className="flex flex-col">
              <Link
                to={`/profile/${post.author.username}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className="font-medium">{post.author.username}</span>
              </Link>
              <span className="text-xs">{dayjs(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon
            className="cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && post.author.id === currentUser?.id && (
            <button
              className="absolute top-7 right-0 border-none rounded-xl px-3 bg-red-500 p-1 cursor-pointer text-white"
              onClick={handleDelete}
            >
              delete
            </button>
          )}
        </div>
        <div className="my-5">
          <p>{post.content}</p>
          {/*<img
            className="w-full max-h-full object-cover mt-5"
            src={'/upload/' + post.img}
            alt=""
          />*/}
        </div>
        <div className="flex items-center gap-5">
          <div className="flex align-center gap-2 cursor-pointer text-sm">
            {isLoading ? (
              'loading'
            ) : data.userReaction != null ? (
              <FavoriteOutlinedIcon
                style={{ color: 'red' }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.reactionCount} Reactions
          </div>
          <div
            className="flex align-center gap-2 cursor-pointer text-sm"
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="flex align-center gap-2 cursor-pointer text-sm">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
}

export default Post;
