import Post from '@/components/Post';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../axios';

const Posts = ({ username }: any) => {
  const { isLoading, error, data } = useQuery(['posts_' + username], () =>
    makeRequest.get('/post/' + (username ?? '')).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="flex flex-col gap-12">
      {error
        ? 'Something went wrong!'
        : isLoading
        ? 'loading'
        : data.posts.map((post: any) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
