import { useContext, useState } from 'react';
import useAuth from '@/context/authContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ImageIcon from '@mui/icons-material/Image';
import { makeRequest } from '../axios';
const Share = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');

  const { currentUser } = useAuth();

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: any) => {
      return makeRequest.post('/post/V2', data);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  const handleClick = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('content', content);
    mutation.mutate(formData);
    setContent('');
    setFile(null);
  };

  return (
    <div className="drop-shadow-md rounded-2xl bg-white text-black mb-5">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex w-full">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={
                currentUser?.profile.profilePicUrl ?? './src/assets/person.png'
              }
              alt=""
            />
            <textarea
              className="border-none outline-none mx-3 my-1 bg-transparent w-full h-fit"
              placeholder={`What's on your mind, ${currentUser?.username}?`}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>
          <div className="flex flex-col justify-end">
            {file && (
              <img
                className="w-24 h-24 object-cover rounded-2xl"
                alt=""
                src={URL.createObjectURL(file)}
              />
            )}
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <input
              className="border-none outline-none py-5 px-3 bg-transparent"
              type="file"
              id="file"
              style={{ display: 'none' }}
              onChange={(e: any) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="flex items-center gap-2 cursor-pointer">
                <ImageIcon className="text-green-500" />
                <span className="text-sm text-green-500">Add Image</span>
              </div>
            </label>
            {/*
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
            */}
          </div>
          <div className="">
            <button
              className="border-none py-2 px-4 text-white cursor-pointer bg-green-500 rounded-2xl font-bold"
              onClick={handleClick}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
