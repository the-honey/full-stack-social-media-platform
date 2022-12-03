import useAuth from '@/context/authContext';

const LeftBar = () => {
  const { currentUser } = useAuth();

  return (
    <div className="basis-1/4 hidden lg:block sticky h-full bg-white text-black">
      <div className="px-5 py-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <span className="font-medium">{currentUser?.username}</span>
          </div>
          <hr className="my-3 border-none h-[0.5px] bg-gray-300" />
          <h1 className="font-bold">Suggested</h1>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <span className="font-medium">{currentUser?.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <span className="font-medium">{currentUser?.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <span className="font-medium">{currentUser?.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <span className="font-medium">{currentUser?.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <span className="font-medium">{currentUser?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
