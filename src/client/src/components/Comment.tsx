import dayjs from 'dayjs';
import PersonIcon from '@/assets/person.png';

const Comment = ({ comment }: any) => {
  return (
    <div className="mt-5 flex justify-between gap-5">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={comment.author.profilePicUrl ?? PersonIcon}
        alt=""
      />
      <div className="flex-[5] flex flex-col gap-1 items-start break-all">
        <span className="font-medium">{comment.author.username}</span>
        <p>{comment.content}</p>
      </div>
      <span className="right-0 self-center text-sm">
        {dayjs(comment.createdAt).fromNow()}
      </span>
    </div>
  );
};

export default Comment;
