import dayjs from 'dayjs';

const Comment = ({ comment }: any) => {
  debugger;
  return (
    <div className="mt-5 flex justify-between gap-5">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={comment.author.profilePicUrl ?? './src/assets/person.png'}
        alt=""
      />
      <div className="basis-1/5 flex flex-col gap-1 items-start">
        <span className="font-medium">{comment.author.username}</span>
        <p>{comment.content}</p>
      </div>
      <span className="flex-1 self-center text-sm">
        {dayjs(comment.createdAt).fromNow()}
      </span>
    </div>
  );
};

export default Comment;
