import React from 'react';
import { Link } from 'react-router-dom';

const VerificationNotice = () => {
  return (
    <div className="bg-yellow-300 text-black rounded-2xl">
      <span>You need to verify your email. Click </span>
      <span className="underline">Here</span>
      <span> to send activation code.</span>
    </div>
  );
};

export default VerificationNotice;
