import useAuth from '@/context/authContext';

const RightBar = () => {
  const { currentUser } = useAuth();

  return (
    <div className="basis-1/4 hidden lg:block sticky h-full bg-white text-black">
      <div className="p-5 py-10">
        <h1 className="font-bold text-lg">Suggested</h1>
        <hr className="my-3 border-none h-[0.5px] bg-gray-300" />
        <div className="flex items-center gap-3 py-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={'./src/assets/person.png'}
            alt=""
          />
          <span className="font-medium">placeholder</span>
          <button className="bg-green-500 rounded-xl px-3 text-white font-bold">
            Follow
          </button>
        </div>
        <div className="flex items-center gap-3 py-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={'./src/assets/person.png'}
            alt=""
          />
          <span className="font-medium">placeholder</span>
          <button className="bg-green-500 rounded-xl px-3 text-white font-bold">
            Follow
          </button>
        </div>
        <div className="flex items-center gap-3 py-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={'./src/assets/person.png'}
            alt=""
          />
          <span className="font-medium">placeholder</span>
          <button className="bg-green-500 rounded-xl px-3 text-white font-bold">
            Follow
          </button>
        </div>
        <div className="flex items-center gap-3 py-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={'./src/assets/person.png'}
            alt=""
          />
          <span className="font-medium">placeholder</span>
          <button className="bg-green-500 rounded-xl px-3 text-white font-bold">
            Follow
          </button>
        </div>
        <div className="flex items-center gap-3 py-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={'./src/assets/person.png'}
            alt=""
          />
          <span className="font-medium">placeholder</span>
          <button className="bg-green-500 rounded-xl px-3 text-white font-bold">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
