import { useState } from 'react';
import { makeRequest } from '../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import PersonImage from '@/assets/person.png';
import useAuth from '@/context/authContext';

const EditProfile = ({ setOpenEdit, user }: any) => {
  const { refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [texts, setTexts] = useState({
    firstName: user?.profile?.firstName ?? '',
    lastName: user?.profile?.lastName ?? '',
    description: user?.profile?.description ?? '',
    birthDate: user?.profile?.birthDate ?? '',
  });

  const handleChange = (e: any) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(texts);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: any) => {
      return makeRequest.patch('/api/user/', data);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        setError(null);
        refreshProfile();
        queryClient.invalidateQueries(['user_' + user?.username]);
      },
      onError: (e: any) => {
        setError(e);
      },
    }
  );

  const handleClick = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    if (profile) formData.append('file', profile);
    if (texts.birthDate) formData.append('birthDate', texts.birthDate);
    if (texts.description) formData.append('description', texts.description);
    if (texts.firstName) formData.append('firstName', texts.firstName);
    if (texts.lastName) formData.append('lastName', texts.lastName);
    mutation.mutate(formData);
    setOpenEdit(false);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="m-auto lg:w-2/5 w-full p-12 z-50 flex flex-col gap-5 bg-white rounded-2xl drop-shadow-lg">
        <h1 className="text-xl">Update Your Profile</h1>
        <form className="flex flex-col gap-5">
          {
            <div className="files">
              <label htmlFor="profile">
                <span>Profile Picture</span>
                <div className="relative">
                  <img
                    className="w-24 h-24 cursor-pointer rounded-full object-cover"
                    src={
                      profile
                        ? URL.createObjectURL(profile)
                        : user.profile.profilePicUrl
                        ? '/uploads/' + user.profile.profilePicUrl
                        : PersonImage
                    }
                    alt=""
                  />
                </div>
              </label>
              <input
                type="file"
                id="profile"
                style={{ display: 'none' }}
                onChange={(e: any) => setProfile(e.target.files[0])}
              />
            </div>
          }
          <label className="flex flex-col gap-2 text-md">First Name</label>
          <input
            className="p-1 border-b solid border-black bg-transparent"
            type="text"
            value={texts.firstName}
            name="firstName"
            onChange={handleChange}
          />
          <label className="flex flex-col gap-2 text-md">Last Name</label>
          <input
            className="p-1 border-b solid border-black bg-transparent"
            type="text"
            value={texts.lastName}
            name="lastName"
            onChange={handleChange}
          />
          <label className="flex flex-col gap-2 text-md">Birth Date</label>
          <input
            className="p-2 w-fit border-b border-black"
            type="date"
            value={dayjs(texts.birthDate).format('YYYY-MM-DD')}
            name="birthDate"
            onChange={handleChange}
          />
          <label className="flex flex-col gap-2 text-md">Bio</label>
          <textarea
            className="p-2 border solid border-black rounded-2xl bg-transparent"
            name="description"
            value={texts.description}
            onChange={handleChange}
          />
          <button
            className="bg-green-500 w-fit mx-auto text-white font-bold px-5 py-1 rounded-2xl"
            onClick={handleClick}
          >
            Save
          </button>
        </form>
        <button
          className="bg-red-500 w-fit mx-auto text-white font-bold px-5 py-1 rounded-2xl"
          onClick={() => setOpenEdit(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
