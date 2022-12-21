import dayjs from 'dayjs';
import PersonIcon from '@/assets/person.png';
import { Link } from 'react-router-dom';

const Comment = ({ comment }: any) => {
  return (
    <div className="mt-5 flex justify-between gap-5">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={
          comment.author.profile.profilePicUrl
            ? '/uploads/' + comment.author.profile.profilePicUrl
            : PersonIcon
        }
        alt=""
      />
      <div className="flex-[5] flex flex-col gap-1 items-start break-all">
        <Link to={'/profile/' + comment.author.username}>
          <span className="font-medium">{comment.author.username}</span>
        </Link>
        <p>{comment.content}</p>
      </div>
      <span className="right-0 self-center text-sm">
        {dayjs(comment.createdAt).fromNow()}
      </span>
    </div>
  );
};

export default Comment;
